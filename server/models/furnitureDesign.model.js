import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, default: "" },
    publicId: { type: String, default: "" },
    provider: { type: String, default: "" },
    storage: { type: String, default: "" },
  },
  { _id: false }
);

const versionSchema = new mongoose.Schema(
  {
    versionNumber: { type: Number, required: true },
    prompt: { type: String, required: true, maxlength: 8_000 },
    modification: { type: String, default: "", maxlength: 2_000 },
    image: { type: imageSchema, default: () => ({}) },
    parentVersion: { type: Number, default: null },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const furnitureDesignSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true, index: true },
    prompt: { type: String, required: true, maxlength: 8_000 },
    structuredRequirements: { type: mongoose.Schema.Types.Mixed, default: {} },
    generatedImage: { type: imageSchema, default: () => ({}) },
    generationStatus: {
      type: String,
      enum: ["PENDING", "GENERATED", "NEEDS_CONFIGURATION", "FAILED"],
      default: "PENDING",
    },
    generationError: { type: String, default: "" },
    versions: { type: [versionSchema], default: [] },
    currentVersion: { type: Number, default: 0 },
  },
  { timestamps: true }
);

furnitureDesignSchema.index({ userId: 1, updatedAt: -1 });

const FurnitureDesignModel =
  mongoose.models.FurnitureDesign || mongoose.model("FurnitureDesign", furnitureDesignSchema);

export default FurnitureDesignModel;
