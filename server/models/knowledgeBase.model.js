import mongoose from "mongoose";

const knowledgeBaseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 180 },
    category: {
      type: String,
      enum: [
        "WARRANTY",
        "STEEL_GRADES",
        "PRODUCT_CARE",
        "DELIVERY",
        "RETURNS",
        "CUSTOMIZATION",
        "FAQ",
        "COMPANY",
        "OTHER",
      ],
      default: "OTHER",
      index: true,
    },
    content: { type: String, required: true, trim: true, maxlength: 100_000 },
    sourceType: {
      type: String,
      enum: ["MANUAL", "POLICY", "FAQ", "DOCUMENT"],
      default: "MANUAL",
    },
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED"],
      default: "PUBLISHED",
      index: true,
    },
    indexingStatus: {
      type: String,
      enum: ["PENDING", "INDEXED", "ERROR"],
      default: "PENDING",
      index: true,
    },
    indexingError: { type: String, default: "" },
    chunkCount: { type: Number, default: 0 },
    embeddingModel: { type: String, default: "" },
    embeddingDimensions: { type: Number, default: 0 },
    lastIndexedAt: { type: Date, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
  },
  { timestamps: true }
);

knowledgeBaseSchema.index({ status: 1, category: 1, updatedAt: -1 });

const KnowledgeBaseModel =
  mongoose.models.KnowledgeBase || mongoose.model("KnowledgeBase", knowledgeBaseSchema);

export default KnowledgeBaseModel;
