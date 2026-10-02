import crypto from "node:crypto";
import Product from "../models/product.model.js";
import { DesignMaterial, ProductDesign } from "../models/design.model.js";
import { CATEGORY_MATERIALS, CONCEPT_NOTICE, DESIGN_CATEGORIES, DESIGN_FIELDS, MATERIAL_KINDS, isId, problem, requestHash, specificationLines, textValue, validateDesign } from "../utils/designStudio.js";
import { configureDesignMedia, dailyLimit, designReferences, generationAvailable, readImage, releaseReservation, reserveGeneration, trustedImageUrl } from "../services/designGeneration.service.js";

const productSelect = "name slug images catName subCat specifications";
function productSnapshot(product) {
  if (!product) return null;
  return { id: String(product._id), name: product.name, slug: product.slug, image: product.images?.[0] || "", category: product.catName, specifications: product.specifications || {} };
}
function publicDesign(design) {
  return { id: String(design._id), category: design.category, mode: design.mode, description: design.description, colour: design.colour, requirements: design.requirements,
    quantity: design.quantity, baseProduct: design.baseProduct, fabricProduct: design.fabricProduct, materials: design.materials, dimensions: design.dimensions,
    status: design.status, error: design.error, imageUrl: design.imageUrl, createdAt: design.createdAt, notice: CONCEPT_NOTICE, specifications: specificationLines(design) };
}
function ownerDesign(design) { return { ...publicDesign(design), enquiry: design.enquiry?.submittedAt ? { name: design.enquiry.name, phone: design.enquiry.phone, note: design.enquiry.note, status: design.enquiry.status, submittedAt: design.enquiry.submittedAt } : null, shareToken: design.shareToken }; }
const pageNumber = (value) => Math.max(1, Math.min(10000, Number.parseInt(value, 10) || 1));
async function owned(req) {
  if (!isId(req.params.id)) throw problem("Design not found.", 404);
  const design = await ProductDesign.findOne({ _id: req.params.id, owner: req.designOwner }).lean();
  if (!design) throw problem("Design not found.", 404);
  return design;
}
export async function studioConfig(req, res) {
  const materials = await DesignMaterial.find({ active: true }).select("-imagePublicId -__v").sort({ kind: 1, name: 1 }).lean();
  res.json({ success: true, enabled: generationAvailable(), dailyLimit: dailyLimit(), categories: DESIGN_CATEGORIES, fields: DESIGN_FIELDS, materialKinds: MATERIAL_KINDS, categoryMaterials: CATEGORY_MATERIALS, materials, notice: CONCEPT_NOTICE });
}
export async function studioProducts(req, res) {
  const query = textValue(req.query.q, 80, "Search");
  const filter = { images: { $exists: true, $ne: [] }, ...(query ? { name: { $regex: query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } } : {}) };
  if (req.query.fabric === "true") filter["specifications.fabric"] = { $exists: true, $nin: ["", null] };
  if (req.query.id) {
    if (!isId(req.query.id)) throw problem("Product not found.", 404);
    filter._id = req.query.id;
  }
  const page = pageNumber(req.query.page);
  const products = await Product.find(filter).select(productSelect).sort({ _id: -1 }).skip((page - 1) * 12).limit(13).lean();
  res.json({ success: true, products: products.slice(0, 12).map(productSnapshot), hasMore: products.length > 12 });
}
export async function createDesign(req, res) {
  const input = validateDesign(req.body);
  const hash = requestHash(input);
  const existing = await ProductDesign.findOne({ owner: req.designOwner, requestKey: req.body.requestKey }).lean();
  if (existing) {
    if (existing.requestHash !== hash) throw problem("This request has changed. Please generate it again.", 409);
    return res.json({ success: true, design: ownerDesign(existing) });
  }
  if (!generationAvailable()) throw problem("The AI design studio is not accepting previews right now. Please contact SNSF for customization.", 503);
  const [base, fabric, materials] = await Promise.all([
    input.baseProductId ? Product.findById(input.baseProductId).select(productSelect).lean() : null,
    input.fabricProductId ? Product.findById(input.fabricProductId).select(productSelect).lean() : null,
    DesignMaterial.find({ _id: { $in: Object.values(input.materials) }, active: true }).lean(),
  ]);
  if (input.baseProductId && (!base || !base.images?.[0])) throw problem("This product is no longer available for customization.");
  if (input.fabricProductId && (!fabric?.images?.[0] || !fabric.specifications?.fabric)) throw problem("This product no longer has a fabric reference available.");
  for (const [kind, id] of Object.entries(input.materials)) {
    if (!materials.some((item) => String(item._id) === id && item.kind === kind && (!(item.categories || []).length || item.categories.includes(input.category)))) throw problem("A selected material is no longer available for this product. Please refresh the material library.");
  }
  const designData = { ...input, baseProduct: productSnapshot(base), fabricProduct: productSnapshot(fabric), materials: materials.map((item) => ({ id: String(item._id), name: item.name, code: item.code, kind: item.kind, description: item.description, imageUrl: item.imageUrl })) };
  for (const ref of designReferences(designData)) trustedImageUrl(ref.url);
  const reservation = await reserveGeneration(req.designOwner);
  try {
    const design = await ProductDesign.create({ ...designData, owner: req.designOwner, requestKey: req.body.requestKey, requestHash: hash });
    return res.status(202).json({ success: true, design: ownerDesign(design.toObject()) });
  } catch (error) {
    await releaseReservation(reservation);
    if (error.code === 11000) {
      const previous = await ProductDesign.findOne({ owner: req.designOwner, requestKey: req.body.requestKey }).lean();
      if (previous?.requestHash === hash) return res.json({ success: true, design: ownerDesign(previous) });
      throw problem("This request has changed. Please generate it again.", 409);
    }
    throw error;
  }
}
export async function listDesigns(req, res) {
  const page = pageNumber(req.query.page);
  const designs = await ProductDesign.find({ owner: req.designOwner }).sort({ createdAt: -1 }).skip((page - 1) * 12).limit(13).lean();
  res.json({ success: true, designs: designs.slice(0, 12).map(ownerDesign), hasMore: designs.length > 12 });
}
export async function getDesign(req, res) { res.json({ success: true, design: ownerDesign(await owned(req)) }); }
export async function saveDesignEnquiry(req, res) {
  const design = await owned(req);
  if (design.status !== "ready") throw problem("Generate a completed preview before sending an enquiry.");
  const name = textValue(req.body.name, 100, "Name", true);
  const phone = textValue(req.body.phone, 20, "Phone number", true).replace(/[\s()-]/g, "");
  if (!/^\+?\d{10,15}$/.test(phone)) throw problem("Enter a valid phone number including the country code.");
  const note = textValue(req.body.note, 1000, "Enquiry note");
  // Enquiry snapshots are fixed so a shared design always matches the original quote request.
  if (!design.enquiry?.submittedAt) await ProductDesign.updateOne({ _id: design._id, "enquiry.submittedAt": { $exists: false } }, { $set: { shareToken: crypto.randomBytes(24).toString("hex"), enquiry: { name, phone, note, submittedAt: new Date(), status: "new" } } });
  const saved = await ProductDesign.findById(design._id).lean();
  const site = (process.env.DESIGN_SITE_URL || "https://www.snsteelfabrication.com").replace(/\/$/, "");
  const shareUrl = `${site}/designs/${saved.shareToken}`;
  const message = [`Hello SNSF, please quote my custom design ${String(saved._id).slice(-8).toUpperCase()}.`, ...specificationLines(saved).map((line) => line.slice(0, 220)), `Preview and complete specifications: ${shareUrl}`, `Image: ${saved.imageUrl}`, `Name: ${saved.enquiry.name}`, `Phone: ${saved.enquiry.phone}`, saved.enquiry.note && `Note: ${saved.enquiry.note}`, "Please confirm feasibility, materials, dimensions, availability and price."].filter(Boolean).join("\n");
  const number = (process.env.DESIGN_WHATSAPP_NUMBER || "919776501230").replace(/\D/g, "");
  res.json({ success: true, design: ownerDesign(saved), shareUrl, whatsappUrl: `https://wa.me/${number}?text=${encodeURIComponent(message)}` });
}
export async function sharedDesign(req, res) {
  if (!/^[a-f\d]{48}$/.test(req.params.token)) throw problem("Design not found.", 404);
  const design = await ProductDesign.findOne({ shareToken: req.params.token, status: "ready" }).lean();
  if (!design) throw problem("Design not found.", 404);
  res.set("X-Robots-Tag", "noindex, nofollow");
  res.json({ success: true, design: publicDesign(design) });
}
export async function downloadDesign(req, res) {
  const design = await owned(req);
  if (design.status !== "ready" || !design.imageUrl) throw problem("The preview is not ready.", 409);
  const { buffer, type } = await readImage(design.imageUrl);
  res.set({ "Content-Type": type, "Content-Disposition": `attachment; filename="SNSF-design-${String(design._id).slice(-8)}.png"`, "Cache-Control": "private, no-store" });
  res.send(buffer);
}
export async function listMaterials(req, res) {
  res.json({ success: true, materials: await DesignMaterial.find().sort({ createdAt: -1 }).lean(), categories: DESIGN_CATEGORIES, kinds: MATERIAL_KINDS, enabled: generationAvailable() });
}
export async function saveMaterial(req, res) {
  const body = req.body;
  const name = textValue(body.name, 100, "Material name", true);
  const code = textValue(body.code, 40, "Material code", true).toUpperCase();
  if (!/^[A-Z0-9_-]+$/.test(code)) throw problem("Use letters, numbers, hyphens or underscores in the material code.");
  if (!MATERIAL_KINDS.includes(body.kind)) throw problem("Choose a material type.");
  if (!Array.isArray(body.categories) || body.categories.some((cat) => !DESIGN_CATEGORIES.includes(cat))) throw problem("Choose valid product types.");
  const update = { name, code, kind: body.kind, categories: [...new Set(body.categories)], description: textValue(body.description, 500, "Description"), active: body.active !== false };
  if (req.params.id) {
    if (!isId(req.params.id)) throw problem("Material not found.", 404);
    const material = await DesignMaterial.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
    if (!material) throw problem("Material not found.", 404);
    return res.json({ success: true, material });
  }
  res.status(201).json({ success: true, material: await DesignMaterial.create(update) });
}
export async function materialImage(req, res) {
  if (!isId(req.params.id)) throw problem("Material not found.", 404);
  const material = await DesignMaterial.findById(req.params.id);
  if (!material) throw problem("Material not found.", 404);
  if (!req.file) throw problem("Select a JPEG, PNG or WebP image under 5 MB.");
  const media = configureDesignMedia();
  const upload = await new Promise((resolve, reject) => {
    media.uploader.upload_stream({ folder: "snsf/materials", resource_type: "image", format: "png", timeout: 60000, transformation: [{ width: 1600, height: 1600, crop: "limit" }] }, (error, result) => error ? reject(error) : resolve(result)).end(req.file.buffer);
  });
  material.imageUrl = upload.secure_url; material.imagePublicId = upload.public_id;
  await material.save();
  res.json({ success: true, material });
}
export async function adminEnquiries(req, res) {
  const page = pageNumber(req.query.page);
  const filter = { "enquiry.submittedAt": { $exists: true } };
  if (["new", "contacted", "quoted", "closed"].includes(req.query.status)) filter["enquiry.status"] = req.query.status;
  const designs = await ProductDesign.find(filter).sort({ "enquiry.submittedAt": -1 }).skip((page - 1) * 20).limit(21).lean();
  res.json({ success: true, designs: designs.slice(0, 20).map((design) => ({ ...ownerDesign(design), adminNote: design.enquiry.adminNote || "" })), hasMore: designs.length > 20 });
}
export async function updateEnquiry(req, res) {
  if (!isId(req.params.id) || !["new", "contacted", "quoted", "closed"].includes(req.body.status)) throw problem("Invalid enquiry update.");
  const adminNote = textValue(req.body.adminNote, 2000, "Internal note");
  const design = await ProductDesign.findOneAndUpdate({ _id: req.params.id, "enquiry.submittedAt": { $exists: true } }, { $set: { "enquiry.status": req.body.status, "enquiry.adminNote": adminNote } }, { new: true }).lean();
  if (!design) throw problem("Enquiry not found.", 404);
  res.json({ success: true });
}
