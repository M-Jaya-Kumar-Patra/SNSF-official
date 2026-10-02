import { v2 as cloudinary } from "cloudinary";
import { ProductDesign, DesignQuota } from "../models/design.model.js";
import { buildDesignPrompt, problem } from "../utils/designStudio.js";

const DEFAULT_OPENAI_MODEL = "gpt-image-2.5-sunburst";
const DEFAULT_CLOUDFLARE_MODEL = "@cf/black-forest-labs/flux-2-klein-4b";

export function imageProvider() {
  return String(process.env.IMAGE_PROVIDER || "openai").trim().toLowerCase();
}
export function providerModel(provider = imageProvider()) {
  return provider === "cloudflare"
    ? process.env.CLOUDFLARE_IMAGE_MODEL || DEFAULT_CLOUDFLARE_MODEL
    : process.env.DESIGN_IMAGE_MODEL || DEFAULT_OPENAI_MODEL;
}
export function generationAvailable() {
  const provider = imageProvider();
  const providerConfigured = provider === "cloudflare"
    ? Boolean(process.env.CLOUDFLARE_API_TOKEN && process.env.CLOUDFLARE_ACCOUNT_ID)
    : provider === "openai" && Boolean(process.env.OPENAI_IMAGE_API_KEY || process.env.OPENAI_API_KEY);
  return process.env.DESIGN_STUDIO_ENABLED === "true" && providerConfigured && Boolean(process.env.cloudinary_Config_Cloud_Name && process.env.cloudinary_Config_API_Key && process.env.cloudinary_Config_API_Secret);
}
export function configureDesignMedia() {
  cloudinary.config({ cloud_name: process.env.cloudinary_Config_Cloud_Name, api_key: process.env.cloudinary_Config_API_Key, api_secret: process.env.cloudinary_Config_API_Secret, secure: true });
  return cloudinary;
}
export function trustedImageUrl(value) {
  let url;
  try { url = new URL(value); } catch { throw problem("This reference image is unavailable for AI editing. Please choose another photo or contact SNSF."); }
  const cloudName = process.env.cloudinary_Config_Cloud_Name;
  const ownCloud = url.hostname === "res.cloudinary.com" && Boolean(cloudName) && url.pathname.startsWith(`/${cloudName}/image/upload/`);
  const hosts = (process.env.DESIGN_IMAGE_HOSTS || "").split(",").map((host) => host.trim()).filter(Boolean);
  if (url.protocol !== "https:" || url.username || url.password || url.port || (!ownCloud && !hosts.includes(url.hostname))) throw problem("This reference image is unavailable for AI editing. Please choose another photo or contact SNSF.");
  return url.toString();
}
function cloudflareReferenceUrl(value) {
  const trusted = trustedImageUrl(value);
  const url = new URL(trusted);
  const cloudName = process.env.cloudinary_Config_Cloud_Name;
  const uploadMarker = `/${cloudName}/image/upload/`;
  if (cloudName && url.hostname === "res.cloudinary.com" && url.pathname.startsWith(uploadMarker)) {
    url.pathname = url.pathname.replace("/image/upload/", "/image/upload/w_512,h_512,c_limit,q_auto,f_png/");
  }
  return url.toString();
}
export async function readImage(value, { cloudflare = false } = {}) {
  const response = await fetch(cloudflare ? cloudflareReferenceUrl(value) : trustedImageUrl(value), { redirect: "error", signal: AbortSignal.timeout(20000) });
  const type = response.headers.get("content-type")?.split(";")[0];
  if (!response.ok || !["image/jpeg", "image/png", "image/webp"].includes(type)) throw problem("A reference image could not be loaded.");
  const chunks = []; let size = 0;
  for await (const chunk of response.body) {
    size += chunk.length;
    if (size > 10 * 1024 * 1024) throw problem("A reference image is too large. Please use an image under 10 MB.");
    chunks.push(chunk);
  }
  return { buffer: Buffer.concat(chunks), type };
}
export const dailyLimit = () => Math.max(1, Number(process.env.DESIGN_DAILY_USER_LIMIT) || 5);
export const globalDailyLimit = () => Math.max(1, Number(process.env.DESIGN_DAILY_GLOBAL_LIMIT) || (imageProvider() === "cloudflare" ? 10 : 100));
export async function reserveGeneration(owner) {
  const day = new Date().toISOString().slice(0, 10);
  const acquired = [];
  try {
    for (const [key, limit] of [[`user:${owner}:${day}`, dailyLimit()], [`global:${day}`, globalDailyLimit()]]) {
      try { await DesignQuota.updateOne({ _id: key }, { $setOnInsert: { used: 0, expiresAt: new Date(Date.now() + 3 * 86400000) } }, { upsert: true }); } catch (error) { if (error.code !== 11000) throw error; }
      const result = await DesignQuota.findOneAndUpdate({ _id: key, used: { $lt: limit } }, { $inc: { used: 1 } });
      if (!result) throw problem(key.startsWith("user:") ? "You have reached today's preview limit. Your saved designs are still available. Please try again tomorrow." : "Today's design studio capacity has been reached. Please try tomorrow or contact SNSF.", 429);
      acquired.push(key);
    }
    return acquired;
  } catch (error) { await releaseReservation(acquired); throw error; }
}
export async function releaseReservation(keys) {
  if (keys.length) await DesignQuota.updateMany({ _id: { $in: keys }, used: { $gt: 0 } }, { $inc: { used: -1 } });
}
export function designReferences(design) {
  return [
    design.baseProduct?.image && { url: design.baseProduct.image, role: "base product" },
    design.fabricProduct?.image && { url: design.fabricProduct.image, role: "fabric" },
    ...(design.materials || []).filter((item) => item.imageUrl && ["fabric", "finish", "top"].includes(item.kind)).map((item) => ({ url: item.imageUrl, role: item.kind })),
  ].filter(Boolean);
}

// Keep provider details in server logs, but give customers an actionable message.
// Providers can reject an otherwise valid request when the account is not funded,
// the organization still needs verification, or the token is missing image access.
export function providerFailureMessage(status, providerError = {}, provider = imageProvider()) {
  const code = String(providerError.code || "").toLowerCase();
  const type = String(providerError.type || "").toLowerCase();
  const providerLabel = provider === "cloudflare" ? "Cloudflare Workers AI" : "the OpenAI image service";

  if (status === 401 || status === 403 || ["invalid_api_key", "insufficient_quota", "billing_hard_limit_reached", "organization_verification_required"].includes(code)) {
    return `${providerLabel} is not ready for this site. Please ask SNSF to verify the server credentials, account billing and image-model access.`;
  }
  if (status === 429 || code === "rate_limit_exceeded" || type === "rate_limit_error") {
    return "The AI image service is busy right now. Please wait a few minutes and try again.";
  }
  if (status === 400) {
    return "This design could not be generated. Try a shorter description or remove one of the reference images.";
  }
  return "Image generation is temporarily unavailable. Please try again later.";
}

async function uploadGeneratedImage(design, encoded, model) {
  if (!encoded || encoded.length > 30 * 1024 * 1024) throw problem("The image service did not return a usable preview.", 502);
  const buffer = Buffer.from(encoded, "base64");
  const type = buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    ? "image/png"
    : buffer.subarray(0, 2).equals(Buffer.from([255, 216]))
      ? "image/jpeg"
      : buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP"
        ? "image/webp"
        : null;
  if (!type) throw problem("The image service returned an invalid preview.", 502);
  const media = configureDesignMedia();
  const upload = await media.uploader.upload(`data:${type};base64,${encoded}`, { public_id: `snsf/designs/${design._id}`, overwrite: false, resource_type: "image", timeout: 60000 });
  return { imageUrl: upload.secure_url, imagePublicId: upload.public_id, model };
}

async function generateOpenAiDesignImage(design, references) {
  const model = providerModel("openai");
  const params = { model, prompt: buildDesignPrompt(design, references), n: 1, size: "1024x1024", quality: "medium", output_format: "png" };
  let body; let headers = { Authorization: `Bearer ${process.env.OPENAI_IMAGE_API_KEY || process.env.OPENAI_API_KEY}` };
  if (references.length) {
    body = new FormData();
    for (const [key, value] of Object.entries(params)) body.append(key, String(value));
    for (const [index, ref] of references.entries()) {
      const { buffer, type } = await readImage(ref.url);
      body.append("image[]", new Blob([buffer], { type }), `reference-${index}.${type.split("/")[1]}`);
    }
  } else { headers["Content-Type"] = "application/json"; body = JSON.stringify(params); }
  const response = await fetch(`https://api.openai.com/v1/images/${references.length ? "edits" : "generations"}`, { method: "POST", headers, body, signal: AbortSignal.timeout(180000) });
  const result = await response.json();
  if (!response.ok) {
    console.error("Design image provider error", response.status, result.error?.code, result.error?.type);
    throw problem(providerFailureMessage(response.status, result.error, "openai"), 502);
  }
  const encoded = result.data?.[0]?.b64_json;
  return uploadGeneratedImage(design, encoded, model);
}

async function generateCloudflareDesignImage(design, references) {
  const model = providerModel("cloudflare");
  const usableReferences = references.slice(0, 4);
  const body = new FormData();
  body.append("prompt", buildDesignPrompt(design, usableReferences));
  body.append("width", "1024");
  body.append("height", "1024");
  for (const [index, ref] of usableReferences.entries()) {
    const { buffer, type } = await readImage(ref.url, { cloudflare: true });
    body.append(`input_image_${index}`, new Blob([buffer], { type }), `reference-${index}.${type.split("/")[1]}`);
  }
  const accountId = encodeURIComponent(process.env.CLOUDFLARE_ACCOUNT_ID);
  const modelPath = model.split("/").map((segment) => encodeURIComponent(segment)).join("/");
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${modelPath}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}` },
    body,
    signal: AbortSignal.timeout(180000),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.success === false) {
    const providerError = result.errors?.[0] || {};
    console.error("Cloudflare image provider error", response.status, providerError.code, providerError.message);
    throw problem(providerFailureMessage(response.status, providerError, "cloudflare"), 502);
  }
  let encoded = result.result?.image || result.result?.image_b64 || (typeof result.result === "string" ? result.result : "");
  if (encoded.startsWith("data:")) encoded = encoded.slice(encoded.indexOf(",") + 1);
  return uploadGeneratedImage(design, encoded, model);
}

export async function generateDesignImage(design) {
  const provider = imageProvider();
  const references = designReferences(design);
  if (provider === "cloudflare") return generateCloudflareDesignImage(design, references);
  if (provider === "openai") return generateOpenAiDesignImage(design, references);
  throw problem("The configured AI image provider is not supported. Please ask SNSF to check the server setup.", 503);
}

// MongoDB claims make the queue durable across server restarts and safe across replicas.
// Timed-out jobs fail rather than automatically issuing another paid generation.
export function startDesignWorker() {
  let running = false;
  const tick = async () => {
    if (running) return;
    running = true;
    try {
      await ProductDesign.updateMany({ status: "processing", startedAt: { $lt: new Date(Date.now() - 8 * 60000) } }, { $set: { status: "failed", error: "Preview generation was interrupted. You can create a new preview from your saved choices." } });
      await ProductDesign.updateMany({ status: "queued", createdAt: { $lt: new Date(Date.now() - 30 * 60000) } }, { $set: { status: "failed", error: "The design queue timed out. Please create a new preview later." } });
      if (!generationAvailable()) return;
      const design = await ProductDesign.findOneAndUpdate({ status: "queued" }, { $set: { status: "processing", startedAt: new Date() } }, { sort: { createdAt: 1 }, new: true }).lean();
      if (!design) return;
      try {
        const image = await generateDesignImage(design);
        await ProductDesign.updateOne({ _id: design._id, status: "processing" }, { $set: { ...image, status: "ready", completedAt: new Date() } });
      } catch (error) {
        console.error("Design generation failed", String(design._id), error.statusCode || error.name);
        await ProductDesign.updateOne({ _id: design._id, status: "processing" }, { $set: { status: "failed", error: error.statusCode ? error.message : "Preview generation could not finish. Please try again later." } });
      }
    } catch (error) { console.error("Design worker error", error.message); }
    finally { running = false; }
  };
  const timer = setInterval(tick, 3000);
  timer.unref();
  void tick();
  return () => clearInterval(timer);
}
