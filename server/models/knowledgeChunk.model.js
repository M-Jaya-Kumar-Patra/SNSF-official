import mongoose from "mongoose";

const knowledgeChunkSchema = new mongoose.Schema(
  {
    knowledgeBaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "KnowledgeBase",
      required: true,
      index: true,
    },
    chunkIndex: { type: Number, required: true },
    content: { type: String, required: true, maxlength: 10_000 },
    embedding: { type: [Number], required: true },
    embeddingModel: { type: String, required: true },
    embeddingDimensions: { type: Number, required: true },
    metadata: {
      title: String,
      category: String,
      sourceType: String,
    },
    indexedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

knowledgeChunkSchema.index({ knowledgeBaseId: 1, chunkIndex: 1 }, { unique: true });

const KnowledgeChunkModel =
  mongoose.models.KnowledgeChunk || mongoose.model("KnowledgeChunk", knowledgeChunkSchema);

export default KnowledgeChunkModel;
