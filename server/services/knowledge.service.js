import mongoose from "mongoose";
import KnowledgeBaseModel from "../models/knowledgeBase.model.js";
import KnowledgeChunkModel from "../models/knowledgeChunk.model.js";
import {
  embedOpenRouter,
  isOpenRouterEmbeddingConfigured,
} from "./openRouter.service.js";

const DEFAULT_CHUNK_SIZE = 1_800;
const DEFAULT_CHUNK_OVERLAP = 240;

export class KnowledgeIndexError extends Error {
  constructor(message) {
    super(message);
    this.name = "KnowledgeIndexError";
    this.code = "KNOWLEDGE_INDEX_FAILED";
    this.statusCode = 503;
  }
}

function normalizeText(value) {
  return String(value || "").replace(/\r\n/g, "\n").replace(/[ \t]+/g, " ").trim();
}

export function chunkKnowledgeContent(content, chunkSize = DEFAULT_CHUNK_SIZE, overlap = DEFAULT_CHUNK_OVERLAP) {
  const text = normalizeText(content);
  if (!text) return [];

  const chunks = [];
  let start = 0;

  while (start < text.length) {
    let end = Math.min(text.length, start + chunkSize);
    if (end < text.length) {
      const boundary = text.lastIndexOf("\n", end);
      const sentenceBoundary = text.lastIndexOf(". ", end);
      const preferredBoundary = Math.max(boundary, sentenceBoundary);
      if (preferredBoundary > start + Math.floor(chunkSize * 0.55)) end = preferredBoundary + 1;
    }

    const chunk = text.slice(start, end).trim();
    if (chunk) chunks.push(chunk);
    if (end >= text.length) break;
    start = Math.max(end - overlap, start + 1);
  }

  return chunks;
}

async function updateIndexError(knowledgeId, error) {
  await KnowledgeBaseModel.findByIdAndUpdate(knowledgeId, {
    indexingStatus: "ERROR",
    indexingError: String(error?.message || "Knowledge indexing failed").slice(0, 1_000),
  });
}

export async function indexKnowledgeBase(knowledgeId, adminId) {
  if (!mongoose.Types.ObjectId.isValid(knowledgeId)) throw new KnowledgeIndexError("Invalid knowledge id");

  const knowledge = await KnowledgeBaseModel.findById(knowledgeId).lean();
  if (!knowledge) throw new KnowledgeIndexError("Knowledge entry not found");
  if (knowledge.status !== "PUBLISHED") throw new KnowledgeIndexError("Only published knowledge can be indexed");
  if (!isOpenRouterEmbeddingConfigured()) {
    await updateIndexError(knowledgeId, "OPENROUTER_EMBEDDING_MODEL is not configured");
    throw new KnowledgeIndexError("Embedding provider is not configured");
  }

  const chunks = chunkKnowledgeContent(knowledge.content);
  if (!chunks.length) throw new KnowledgeIndexError("Knowledge content is empty");

  await KnowledgeBaseModel.findByIdAndUpdate(knowledgeId, {
    indexingStatus: "PENDING",
    indexingError: "",
  });

  try {
    const embeddings = [];
    const batchSize = 32;
    let embeddingModel = "";

    for (let index = 0; index < chunks.length; index += batchSize) {
      const batch = chunks.slice(index, index + batchSize);
      const result = await embedOpenRouter({ input: batch, inputType: "search_document" });
      embeddingModel = result.model;
      embeddings.push(...result.embeddings);
    }

    const dimensions = embeddings[0]?.length || 0;
    if (!dimensions || embeddings.length !== chunks.length) {
      throw new KnowledgeIndexError("Embedding response did not match knowledge chunks");
    }

    await KnowledgeChunkModel.deleteMany({ knowledgeBaseId: knowledge._id });
    await KnowledgeChunkModel.insertMany(
      chunks.map((content, chunkIndex) => ({
        knowledgeBaseId: knowledge._id,
        chunkIndex,
        content,
        embedding: embeddings[chunkIndex],
        embeddingModel,
        embeddingDimensions: dimensions,
        metadata: {
          title: knowledge.title,
          category: knowledge.category,
          sourceType: knowledge.sourceType,
        },
      }))
    );

    return await KnowledgeBaseModel.findByIdAndUpdate(
      knowledgeId,
      {
        indexingStatus: "INDEXED",
        indexingError: "",
        chunkCount: chunks.length,
        embeddingModel,
        embeddingDimensions: dimensions,
        lastIndexedAt: new Date(),
        updatedBy: adminId || null,
      },
      { new: true }
    ).lean();
  } catch (error) {
    await updateIndexError(knowledgeId, error);
    throw error instanceof KnowledgeIndexError ? error : new KnowledgeIndexError(error.message);
  }
}

export async function searchKnowledgeBase({ query, limit = 5 }) {
  const cleanQuery = normalizeText(query);
  if (!cleanQuery) return [];
  if (!isOpenRouterEmbeddingConfigured()) return [];

  const { embeddings } = await embedOpenRouter({ input: cleanQuery, inputType: "search_query" });
  const queryVector = embeddings[0];
  if (!queryVector?.length) return [];

  const safeLimit = Math.max(1, Math.min(8, Number(limit) || 5));
  const indexName = process.env.MONGODB_VECTOR_INDEX_NAME || "knowledge_chunks_vector";

  const results = await KnowledgeChunkModel.aggregate([
    {
      $vectorSearch: {
        index: indexName,
        path: "embedding",
        queryVector,
        numCandidates: Math.max(50, safeLimit * 12),
        limit: safeLimit,
      },
    },
    {
      $project: {
        _id: 1,
        knowledgeBaseId: 1,
        content: 1,
        metadata: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
  ]);

  return results.filter((item) => Number(item.score) >= (Number(process.env.KNOWLEDGE_MIN_SCORE) || 0.65));
}

export function formatKnowledgeContext(results = []) {
  return results
    .map((item, index) => `[${index + 1}] ${item.metadata?.title || "SNSF knowledge"}\n${item.content}`)
    .join("\n\n");
}
