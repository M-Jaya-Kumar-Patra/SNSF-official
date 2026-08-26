import crypto from "crypto";
import RagChunkModel from "../models/ragChunk.model.js";
import ProductModel from "../models/product.model.js";
import { buildRagProductDocument } from "../utils/publicProduct.js";
import { createEmbedding, createEmbeddings } from "./embedding.service.js";

const STATIC_KNOWLEDGE = [
  {
    sourceType: "page",
    sourceId: "about",
    title: "About SNSF",
    slug: "about",
    text:
      "S N Steel Fabrication designs and manufactures stainless steel furniture in New Burupada, Hinjilicut, Odisha. Products include steel beds, almirahs, chairs, dining tables, sofa sets, office furniture, and custom fabrication for homes, institutions, offices, and businesses.",
    metadata: { sourceType: "page", slug: "about" },
  },
  {
    sourceType: "policy",
    sourceId: "warranty",
    title: "Warranty Policy",
    slug: "warranty",
    text:
      "SNSF warranty covers the stainless steel structure only. 202 grade stainless steel has 5 years warranty and 304 grade stainless steel has 15 years warranty. Fabric, foam cushions, non-steel parts, negligent use, harsh chemicals, physical damage, improper maintenance, and modifications are not covered.",
    metadata: { sourceType: "policy", slug: "warranty" },
  },
  {
    sourceType: "page",
    sourceId: "contact",
    title: "Contact SNSF",
    slug: "contact",
    text:
      "Customers can contact S N Steel Fabrication by phone or WhatsApp at +919776501230, email support@snsteelfabrication.com, or visit S N Steel Fabrication, New Burupada, Near Hanuman Temple, Via - Hinjilicut, Ganjam, Odisha - 761102, India. Working hours are Sun - Sat, 9:00 AM - 8:00 PM.",
    metadata: { sourceType: "page", slug: "contact" },
  },
];

const CHUNK_SIZE = Number(process.env.RAG_CHUNK_SIZE) || 1200;
const CHUNK_OVERLAP = Number(process.env.RAG_CHUNK_OVERLAP) || 160;
const VECTOR_DRIVER = (process.env.RAG_VECTOR_DRIVER || "auto").toLowerCase();

export function hashText(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

function chunkText(text, size = CHUNK_SIZE, overlap = CHUNK_OVERLAP) {
  const normalized = String(text || "").replace(/\s+/g, " ").trim();
  if (!normalized) return [];
  if (normalized.length <= size) return [normalized];

  const chunks = [];
  let start = 0;
  while (start < normalized.length) {
    const end = Math.min(start + size, normalized.length);
    chunks.push(normalized.slice(start, end));
    if (end === normalized.length) break;
    start = Math.max(0, end - overlap);
  }
  return chunks;
}

function stripSensitiveText(value) {
  return String(value || "")
    .replace(/₹\s*\d[\d,]*(?:\.\d+)?/g, "")
    .replace(/\b(?:rs\.?|inr)\s*\d[\d,]*(?:\.\d+)?/gi, "")
    .replace(/\b\d[\d,]*(?:\.\d+)?\s*(?:rupees?|rs\.?|inr)\b/gi, "")
    .replace(/\b(price|old price|mrp|cost|rate|discount)\s*[:=-]\s*\S+/gi, "$1 unavailable");
}

function expandDocument(document) {
  return chunkText(stripSensitiveText(document.text)).map((text, index) => ({
    sourceType: document.sourceType,
    sourceId: `${document.sourceId || document.id}#${index}`,
    title: document.title,
    slug: document.slug || "",
    text,
    metadata: {
      ...(document.metadata || {}),
      chunkIndex: index,
      sourceId: document.sourceId || document.id,
    },
    contentHash: hashText(text),
    active: true,
  }));
}

function cosineSimilarity(a = [], b = []) {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  const length = Math.min(a.length, b.length);

  for (let index = 0; index < length; index += 1) {
    const left = Number(a[index]) || 0;
    const right = Number(b[index]) || 0;
    dot += left * right;
    normA += left * left;
    normB += right * right;
  }

  if (!normA || !normB) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function retrieveWithLocalVectorSearch(queryEmbedding, limit) {
  const maxLocalCandidates =
    Number(process.env.RAG_LOCAL_VECTOR_CANDIDATES) || 1000;
  const chunks = await RagChunkModel.find({ active: true })
    .select("+embedding sourceType sourceId title slug text metadata contentHash active")
    .limit(maxLocalCandidates)
    .lean();

  return chunks
    .map((chunk) => {
      const { embedding, ...publicChunk } = chunk;
      return {
        ...publicChunk,
        score: cosineSimilarity(queryEmbedding, embedding),
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

async function getSourceDocuments() {
  const products = await ProductModel.find({}).lean();
  const productDocuments = products
    .map(buildRagProductDocument)
    .filter(Boolean)
    .map((doc) => ({
      ...doc,
      sourceId: doc.id,
    }));

  return [...STATIC_KNOWLEDGE, ...productDocuments];
}

export async function ingestRagKnowledge() {
  const documents = await getSourceDocuments();
  const chunks = documents.flatMap(expandDocument);
  const texts = chunks.map((chunk) => chunk.text);
  const embeddings = await createEmbeddings(texts);

  if (embeddings.length !== chunks.length) {
    throw new Error("Embedding count did not match chunk count.");
  }

  await RagChunkModel.updateMany({}, { $set: { active: false } });

  let upserted = 0;
  for (let index = 0; index < chunks.length; index += 1) {
    const chunk = chunks[index];
    await RagChunkModel.findOneAndUpdate(
      { sourceId: chunk.sourceId, contentHash: chunk.contentHash },
      { $set: { ...chunk, embedding: embeddings[index], active: true } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    upserted += 1;
  }

  await RagChunkModel.deleteMany({ active: false });

  return {
    documents: documents.length,
    chunks: chunks.length,
    upserted,
  };
}

export async function retrieveRagContext(query, { limit = 6 } = {}) {
  const safeLimit = Math.max(1, Math.min(10, Number(limit) || 6));
  let queryEmbedding = null;

  try {
    queryEmbedding = await createEmbedding(query);
  } catch (error) {
    const reason =
      error.code === "insufficient_quota"
        ? "Embedding provider quota is exhausted"
        : error.message;
    console.warn("RAG embedding unavailable:", reason);
  }

  if (queryEmbedding && VECTOR_DRIVER !== "local") {
    try {
      const results = await RagChunkModel.aggregate([
        {
          $vectorSearch: {
            index: process.env.MONGODB_VECTOR_INDEX || "rag_embedding_index",
            path: "embedding",
            queryVector: queryEmbedding,
            numCandidates: Math.max(50, safeLimit * 10),
            limit: safeLimit,
            filter: { active: true },
          },
        },
        {
          $project: {
            embedding: 0,
            score: { $meta: "vectorSearchScore" },
          },
        },
      ]);

      if (results.length) return results;
    } catch (error) {
      console.warn("Atlas vector search unavailable:", error.message);

      if (VECTOR_DRIVER === "atlas") {
        console.warn(
          "RAG_VECTOR_DRIVER=atlas is configured, so local vector fallback is skipped.",
        );
      }
    }
  }

  if (queryEmbedding && VECTOR_DRIVER !== "atlas") {
    try {
      const localResults = await retrieveWithLocalVectorSearch(
        queryEmbedding,
        safeLimit,
      );
      if (localResults.length) {
        console.warn("Using local vector search fallback.");
        return localResults;
      }
    } catch (error) {
      console.warn("Local vector search unavailable:", error.message);
    }
  }

  console.warn("Falling back to Mongo text search for RAG context.");

  return RagChunkModel.find(
    { active: true, $text: { $search: query } },
    { score: { $meta: "textScore" } },
  )
    .sort({ score: { $meta: "textScore" } })
    .limit(safeLimit)
    .lean();
}
