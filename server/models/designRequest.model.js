import mongoose from "mongoose";

const designRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true, index: true },
    designId: { type: mongoose.Schema.Types.ObjectId, ref: "FurnitureDesign", required: true, index: true },
    generatedImage: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
      provider: { type: String, default: "" },
      storage: { type: String, default: "" },
    },
    prompt: { type: String, required: true, maxlength: 8_000 },
    specifications: { type: mongoose.Schema.Types.Mixed, default: {} },
    requestedModifications: { type: [String], default: [] },
    status: {
      type: String,
      enum: [
        "PENDING",
        "UNDER_REVIEW",
        "CAN_BE_MADE",
        "CANNOT_BE_MADE",
        "NEEDS_MODIFICATION",
        "COMPLETED",
      ],
      default: "PENDING",
      index: true,
    },
    assignedAdminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
    adminResponse: { type: String, default: "", maxlength: 4_000 },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

designRequestSchema.index({ status: 1, updatedAt: -1 });

const DesignRequestModel =
  mongoose.models.DesignRequest || mongoose.model("DesignRequest", designRequestSchema);

export default DesignRequestModel;
