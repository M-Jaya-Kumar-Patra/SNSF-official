import { test } from "node:test";
import assert from "node:assert/strict";
import { validateDesign, buildDesignPrompt } from "../utils/designStudio.js";
import { createDesign, getDesign, sharedDesign, saveDesignEnquiry } from "../controllers/design.controller.js";
import { DesignQuota, ProductDesign } from "../models/design.model.js";
import Admin from "../models/admin.model.js";
import { designAccount } from "../middlewares/designAuth.js";
import { generateDesignImage, generationAvailable, providerFailureMessage, reserveGeneration, trustedImageUrl } from "../services/designGeneration.service.js";
import { v2 as cloudinary } from "cloudinary";

const id = "507f1f77bcf86cd799439011";
const base = () => ({ mode: "new", category: "sofa", description: "A sofa for a small apartment", requestKey: "a-valid-request-key-1234", materials: {}, dimensions: {}, quantity: 1 });
function response() { return { statusCode: 200, status(code) { this.statusCode = code; return this; }, set() { return this; }, json(value) { this.body = value; return this; } }; }

test("category-specific measurements and material selections reject invalid input", () => {
  assert.equal(validateDesign({ ...base(), dimensions: { seats: 3, width: "1800" } }).dimensions.width, 1800);
  for (const patch of [{ dimensions: { seats: 2.5 } }, { dimensions: { width: -1 } }, { dimensions: { shelves: 2 } }, { dimensions: { width: {} } }, { materials: { price: id } }, { materials: { fabric: { $ne: null } } }, { quantity: 1.5 }, { category: "invalid" }, { description: "short" }]) assert.throws(() => validateDesign({ ...base(), ...patch }), { statusCode: 400 });
  assert.throws(() => validateDesign({ ...base(), materials: { fabric: id }, fabricProductId: id }), /either a fabric swatch/);
});
test("reference image URLs cannot target internal services or unrelated Cloudinary accounts", () => {
  const old = process.env.cloudinary_Config_Cloud_Name; process.env.cloudinary_Config_Cloud_Name = "snsf-test";
  try {
    assert.match(trustedImageUrl("https://res.cloudinary.com/snsf-test/image/upload/sofa.png"), /sofa.png/);
    for (const url of ["http://127.0.0.1/a", "https://res.cloudinary.com/other/image/upload/x", "https://res.cloudinary.com@localhost/a", "https://res.cloudinary.com:444/snsf-test/image/upload/x", "https://example.com/a"]) assert.throws(() => trustedImageUrl(url));
  } finally { if (old === undefined) delete process.env.cloudinary_Config_Cloud_Name; else process.env.cloudinary_Config_Cloud_Name = old; }
});
test("prompt preserves furniture identity and distinguishes upholstery from internal construction", () => {
  const design = { ...base(), baseProduct: { name: "Sofa A", specifications: { grade: "202" } }, materials: [{ kind: "metal", name: "304 stainless steel", code: "SS304" }], dimensions: { width: 1800 } };
  const prompt = buildDesignPrompt(design, [{ role: "base product" }, { role: "fabric" }]);
  assert.match(prompt, /Image 2: fabric/); assert.match(prompt, /Do not copy its furniture shape/); assert.match(prompt, /304 stainless steel/); assert.match(prompt, /1800 mm/); assert.match(prompt, /not visible labels/);
});
test("provider failures give the business an actionable setup message without exposing provider details", () => {
  assert.match(providerFailureMessage(401, { code: "invalid_api_key" }), /server credentials/);
  assert.match(providerFailureMessage(400, { code: "organization_verification_required" }), /account billing/);
  assert.match(providerFailureMessage(429, { type: "rate_limit_error" }), /busy right now/);
  assert.match(providerFailureMessage(400, { code: "invalid_prompt" }), /reference images/);
});
test("Cloudflare can be selected without an OpenAI key when media storage is configured", () => {
  const names = ["DESIGN_STUDIO_ENABLED", "IMAGE_PROVIDER", "CLOUDFLARE_ACCOUNT_ID", "CLOUDFLARE_API_TOKEN", "OPENAI_IMAGE_API_KEY", "cloudinary_Config_Cloud_Name", "cloudinary_Config_API_Key", "cloudinary_Config_API_Secret"];
  const old = Object.fromEntries(names.map((name) => [name, process.env[name]]));
  try {
    Object.assign(process.env, { DESIGN_STUDIO_ENABLED: "true", IMAGE_PROVIDER: "cloudflare", CLOUDFLARE_ACCOUNT_ID: "account", CLOUDFLARE_API_TOKEN: "token", cloudinary_Config_Cloud_Name: "cloud", cloudinary_Config_API_Key: "key", cloudinary_Config_API_Secret: "secret" });
    delete process.env.OPENAI_IMAGE_API_KEY;
    assert.equal(generationAvailable(), true);
  } finally {
    for (const name of names) { if (old[name] === undefined) delete process.env[name]; else process.env[name] = old[name]; }
  }
});
test("customer cannot read another customer's design", async (t) => {
  let query;
  t.mock.method(ProductDesign, "findOne", (filter) => { query = filter; return { lean: async () => null }; });
  await assert.rejects(getDesign({ params: { id }, designOwner: "customer-b" }, response()), { statusCode: 404 });
  assert.deepEqual(query, { _id: id, owner: "customer-b" });
});
test("customer tokens do not grant admin access", async (t) => {
  t.mock.method(Admin, "findOne", () => ({ select: () => ({ lean: async () => null }) }));
  const res = response(); let next = false;
  await designAccount(true)({ userId: id }, res, () => { next = true; });
  assert.equal(res.statusCode, 403); assert.equal(next, false);
});
test("public shared designs omit contact data, owner, internal notes and token", async (t) => {
  const secret = { ...base(), _id: id, materials: [], owner: "private-owner", imageUrl: "https://image", enquiry: { name: "Private", phone: "9999999999", adminNote: "Secret" }, shareToken: "a".repeat(48), status: "ready" };
  t.mock.method(ProductDesign, "findOne", () => ({ lean: async () => secret }));
  const res = response(); await sharedDesign({ params: { token: "a".repeat(48) } }, res);
  assert.equal(res.body.design.enquiry, undefined); assert.equal(res.body.design.owner, undefined); assert.equal(res.body.design.shareToken, undefined); assert.equal(JSON.stringify(res.body).includes("9999999999"), false);
});
test("idempotent retries return the saved generation without requiring a provider or another quota reservation", async (t) => {
  const { requestHash } = await import("../utils/designStudio.js");
  const input = base(); const saved = { ...input, _id: id, materials: [], requestHash: requestHash(validateDesign(input)), status: "queued" };
  t.mock.method(ProductDesign, "findOne", () => ({ lean: async () => saved }));
  const res = response(); await createDesign({ body: input, designOwner: "customer" }, res);
  assert.equal(res.body.design.id, id);
  await assert.rejects(createDesign({ body: { ...input, colour: "red" }, designOwner: "customer" }, response()), { statusCode: 409 });
});
test("daily user quota is atomic across concurrent reservations", async (t) => {
  const counts = new Map();
  t.mock.method(DesignQuota, "updateOne", async ({ _id }) => { if (!counts.has(_id)) counts.set(_id, 0); });
  t.mock.method(DesignQuota, "findOneAndUpdate", async ({ _id, used }) => { const count = counts.get(_id); if (count >= used.$lt) return null; counts.set(_id, count + 1); return { used: count + 1 }; });
  t.mock.method(DesignQuota, "updateMany", async ({ _id }) => { for (const key of _id.$in) counts.set(key, counts.get(key) - 1); });
  const results = await Promise.allSettled(Array.from({ length: 7 }, () => reserveGeneration("customer")));
  assert.equal(results.filter((item) => item.status === "fulfilled").length, 5);
  assert.equal(results.filter((item) => item.status === "rejected" && item.reason.statusCode === 429).length, 2);
});
test("WhatsApp handoff uses saved specifications and includes the image and design links", async (t) => {
  const design = { ...base(), _id: id, materials: [{ name: "Blue weave", kind: "fabric", code: "FAB1" }], status: "ready", imageUrl: "https://res.cloudinary.com/snsf-test/image/upload/result.png", shareToken: "a".repeat(48), enquiry: { name: "Customer", phone: "+919999999999", submittedAt: new Date(), status: "new" } };
  t.mock.method(ProductDesign, "findOne", () => ({ lean: async () => design }));
  t.mock.method(ProductDesign, "findById", () => ({ lean: async () => design }));
  const res = response(); await saveDesignEnquiry({ params: { id }, designOwner: "customer", body: { name: "Customer", phone: "+919999999999" } }, res);
  const text = new URL(res.body.whatsappUrl).searchParams.get("text");
  assert.match(text, /Blue weave/); assert.match(text, /\/designs\/a{48}/); assert.match(text, /result.png/);
});
test("image editing sends separate base and fabric references and stores the actual provider result", async (t) => {
  const oldCloud = process.env.cloudinary_Config_Cloud_Name; process.env.cloudinary_Config_Cloud_Name = "snsf-test";
  t.after(() => { if (oldCloud === undefined) delete process.env.cloudinary_Config_Cloud_Name; else process.env.cloudinary_Config_Cloud_Name = oldCloud; });
  const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Zl1AAAAAASUVORK5CYII=", "base64");
  let providerBody;
  t.mock.method(globalThis, "fetch", async (url, options) => {
    if (String(url).startsWith("https://api.openai.com")) { assert.match(url, /images\/edits$/); providerBody = options.body; return Response.json({ data: [{ b64_json: png.toString("base64") }] }); }
    return new Response(png, { headers: { "content-type": "image/png" } });
  });
  t.mock.method(cloudinary.uploader, "upload", async (data) => { assert.match(data, /^data:image\/png;base64,/); return { secure_url: "https://image/result.png", public_id: "result" }; });
  const result = await generateDesignImage({ ...base(), _id: id, materials: [], baseProduct: { image: "https://res.cloudinary.com/snsf-test/image/upload/base.png" }, fabricProduct: { image: "https://res.cloudinary.com/snsf-test/image/upload/fabric.png" } });
  assert.equal(providerBody.getAll("image[]").length, 2); assert.equal(result.imageUrl, "https://image/result.png");
});
test("Cloudflare image editing sends the supported reference field names and uploads the result", async (t) => {
  const names = ["IMAGE_PROVIDER", "CLOUDFLARE_ACCOUNT_ID", "CLOUDFLARE_API_TOKEN", "CLOUDFLARE_IMAGE_MODEL", "cloudinary_Config_Cloud_Name"];
  const old = Object.fromEntries(names.map((name) => [name, process.env[name]]));
  process.env.IMAGE_PROVIDER = "cloudflare";
  process.env.CLOUDFLARE_ACCOUNT_ID = "account";
  process.env.CLOUDFLARE_API_TOKEN = "token";
  process.env.CLOUDFLARE_IMAGE_MODEL = "@cf/black-forest-labs/flux-2-klein-4b";
  process.env.cloudinary_Config_Cloud_Name = "snsf-test";
  t.after(() => { for (const name of names) { if (old[name] === undefined) delete process.env[name]; else process.env[name] = old[name]; } });
  const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Zl1AAAAAASUVORK5CYII=", "base64");
  let providerBody; let providerUrl;
  t.mock.method(globalThis, "fetch", async (url, options) => {
    if (String(url).includes("api.cloudflare.com")) { providerUrl = String(url); providerBody = options.body; return Response.json({ success: true, result: { image: png.toString("base64") } }); }
    return new Response(png, { headers: { "content-type": "image/png" } });
  });
  t.mock.method(cloudinary.uploader, "upload", async () => ({ secure_url: "https://image/cloudflare-result.png", public_id: "cloudflare-result" }));
  const result = await generateDesignImage({ ...base(), _id: id, materials: [], baseProduct: { image: "https://res.cloudinary.com/snsf-test/image/upload/base.png" }, fabricProduct: { image: "https://res.cloudinary.com/snsf-test/image/upload/fabric.png" } });
  assert.match(providerUrl, /accounts\/account\/ai\/run\/(@cf|%40cf)\/black-forest-labs\/flux-2-klein-4b$/);
  assert.ok(providerBody.get("input_image_0")); assert.ok(providerBody.get("input_image_1"));
  assert.equal(result.imageUrl, "https://image/cloudflare-result.png");
});
