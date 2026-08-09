import { v2 as cloudinary } from "cloudinary";
import { OpenRouterNotConfiguredError, OpenRouterRequestError } from "./openRouter.service.js";

const DEFAULT_TIMEOUT_MS = 90_000;

export class ImageGenerationNotConfiguredError extends Error {
  constructor(message = "Image generation is not configured") {
    super(message);
    this.name = "ImageGenerationNotConfiguredError";
    this.code = "IMAGE_GENERATION_NOT_CONFIGURED";
    this.statusCode = 503;
  }
}

export class ImageEditingUnavailableError extends Error {
  constructor() {
    super("Image editing is unavailable for the configured image model");
    this.name = "ImageEditingUnavailableError";
    this.code = "IMAGE_EDITING_UNAVAILABLE";
    this.statusCode = 501;
  }
}

function imageConfig() {
  return {
    apiKey: String(process.env.OPENROUTER_API_KEY || "").trim(),
    model: String(process.env.OPENROUTER_IMAGE_MODEL || "").trim(),
    baseUrl: String(process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1").replace(/\/$/, ""),
    appUrl: String(process.env.OPENROUTER_APP_URL || "").trim(),
    appName: String(process.env.OPENROUTER_APP_NAME || "SNSF AI").trim(),
    timeoutMs: Math.max(10_000, Math.min(180_000, Number(process.env.OPENROUTER_IMAGE_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS)),
    editing: String(process.env.OPENROUTER_IMAGE_EDITING || "false").toLowerCase() === "true",
  };
}

export function isImageGenerationConfigured() {
  const config = imageConfig();
  return Boolean(config.apiKey && config.model);
}

export function isImageEditingConfigured() {
  const config = imageConfig();
  return Boolean(config.apiKey && config.model && config.editing);
}

function normalizeImageUrl(payload) {
  const message = payload?.choices?.[0]?.message;
  const candidates = [
    ...(Array.isArray(message?.images) ? message.images : []),
    ...(Array.isArray(message?.content) ? message.content : []),
  ];

  for (const candidate of candidates) {
    const url = candidate?.image_url?.url || candidate?.imageUrl || candidate?.url;
    if (typeof url === "string" && url.trim()) return url.trim();
  }

  const direct = payload?.data?.[0]?.url || payload?.image_url?.url;
  return typeof direct === "string" ? direct.trim() : "";
}

function safeProviderPrompt(prompt) {
  return String(prompt || "")
    .replace(/[\u0000-\u001f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 8_000);
}

async function requestImage({ prompt, imageUrl = "", edit = false }) {
  const config = imageConfig();
  if (!config.apiKey || !config.model) {
    throw new ImageGenerationNotConfiguredError(
      "Set OPENROUTER_API_KEY and OPENROUTER_IMAGE_MODEL before generating furniture images"
    );
  }
  if (edit && !config.editing) throw new ImageEditingUnavailableError();

  const content = [{ type: "text", text: safeProviderPrompt(prompt) }];
  if (edit && imageUrl) content.push({ type: "image_url", image_url: { url: imageUrl } });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const headers = {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      "X-Title": config.appName,
    };
    if (config.appUrl) headers["HTTP-Referer"] = config.appUrl;

    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: "user", content }],
        modalities: ["text", "images"],
        stream: false,
      }),
      signal: controller.signal,
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      throw new OpenRouterRequestError(payload?.error?.message || `Image provider failed with ${response.status}`, response.status);
    }

    const url = normalizeImageUrl(payload);
    if (!url) throw new OpenRouterRequestError("Image provider returned no image");
    return { url, provider: "openrouter", model: payload?.model || config.model };
  } catch (error) {
    if (error instanceof ImageGenerationNotConfiguredError || error instanceof ImageEditingUnavailableError || error instanceof OpenRouterRequestError) throw error;
    if (error instanceof OpenRouterNotConfiguredError) throw new ImageGenerationNotConfiguredError();
    if (error?.name === "AbortError") throw new OpenRouterRequestError("Image generation timed out", 504);
    throw new OpenRouterRequestError("Image generation failed");
  } finally {
    clearTimeout(timeout);
  }
}

export function buildSafeFurniturePrompt({ prompt, specifications = {}, modification = "" }) {
  const specificationText = Object.entries(specifications)
    .filter(([, value]) => value !== undefined && value !== null && String(value).trim())
    .map(([key, value]) => `${key}: ${String(value).slice(0, 180)}`)
    .join(", ");
  return [
    "Create a realistic product concept image for SNSF furniture fabrication.",
    "Show one complete piece on a clean neutral studio background, with no logos, prices, text, people, or unsafe claims.",
    `Customer design: ${safeProviderPrompt(prompt)}`,
    specificationText ? `Structured requirements: ${specificationText}` : "",
    modification ? `Requested modification: ${safeProviderPrompt(modification)}` : "",
  ].filter(Boolean).join("\n");
}

export async function generateFurnitureImage({ prompt, specifications }) {
  return requestImage({ prompt: buildSafeFurniturePrompt({ prompt, specifications }) });
}

export async function editFurnitureImage({ prompt, specifications, modification, imageUrl }) {
  return requestImage({
    prompt: buildSafeFurniturePrompt({ prompt, specifications, modification }),
    imageUrl,
    edit: true,
  });
}

export async function storeDesignImage(image) {
  if (!image?.url) return { url: "", publicId: "", provider: image?.provider || "", storage: "" };

  const cloudinaryConfigured = Boolean(
    process.env.cloudinary_Config_Cloud_Name &&
      process.env.cloudinary_Config_API_Key &&
      process.env.cloudinary_Config_API_Secret
  );
  if (!cloudinaryConfigured || image.url.startsWith("data:")) {
    return { url: image.url, publicId: "", provider: image.provider || "", storage: "provider" };
  }

  cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_API_Key,
    api_secret: process.env.cloudinary_Config_API_Secret,
  });
  const uploaded = await cloudinary.uploader.upload(image.url, {
    folder: "snsf/furniture-designs",
    resource_type: "image",
  });
  return { url: uploaded.secure_url, publicId: uploaded.public_id, provider: image.provider || "openrouter", storage: "cloudinary" };
}
