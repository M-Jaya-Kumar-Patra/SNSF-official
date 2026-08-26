import mongoose from "mongoose";

const ragChunkSchema = new mongoose.Schema(
  {
    sourceType: {
      type: String,
      enum: ["product", "page", "policy"],
      required: true,
      index: true,
    },
    sourceId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      default: "",
      index: true,
    },
    text: {
      type: String,
      required: true,
    },
    embedding: {
      type: [Number],
      required: true,
      select: false,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    contentHash: {
      type: String,
      required: true,
      index: true,
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true },
);

ragChunkSchema.index({ sourceId: 1, contentHash: 1 }, { unique: true });
ragChunkSchema.index({ title: "text", text: "text" });

const RagChunkModel =
  mongoose.models.RagChunk || mongoose.model("RagChunk", ragChunkSchema);

export default RagChunkModel;
