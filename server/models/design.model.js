import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
  name: { type: String, required: true }, code: { type: String, required: true, unique: true },
  kind: { type: String, required: true }, categories: { type: [String], default: [] }, description: String,
  imageUrl: String, imagePublicId: String, active: { type: Boolean, default: true },
}, { timestamps: true });
materialSchema.index({ active: 1, kind: 1 });
export const DesignMaterial = mongoose.models.DesignMaterial || mongoose.model("DesignMaterial", materialSchema);

const designSchema = new mongoose.Schema({
  owner: { type: String, required: true }, requestKey: { type: String, required: true }, requestHash: String,
  category: String, mode: String, description: String, colour: String, requirements: String, quantity: Number,
  baseProduct: mongoose.Schema.Types.Mixed, fabricProduct: mongoose.Schema.Types.Mixed,
  materials: [mongoose.Schema.Types.Mixed], dimensions: mongoose.Schema.Types.Mixed,
  status: { type: String, enum: ["queued", "processing", "ready", "failed"], default: "queued" },
  startedAt: Date, completedAt: Date, error: String, imageUrl: String, imagePublicId: String, model: String,
  shareToken: { type: String, unique: true, sparse: true },
  enquiry: { name: String, phone: String, note: String, submittedAt: Date,
    status: { type: String, enum: ["new", "contacted", "quoted", "closed"] }, adminNote: String },
}, { timestamps: true });
designSchema.index({ owner: 1, requestKey: 1 }, { unique: true });
designSchema.index({ status: 1, createdAt: 1 });
designSchema.index({ owner: 1, createdAt: -1 });
export const ProductDesign = mongoose.models.ProductDesign || mongoose.model("ProductDesign", designSchema);

const quotaSchema = new mongoose.Schema({ _id: String, used: { type: Number, default: 0 }, expiresAt: Date });
quotaSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export const DesignQuota = mongoose.models.DesignQuota || mongoose.model("DesignQuota", quotaSchema);
