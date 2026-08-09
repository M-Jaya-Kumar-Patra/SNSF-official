import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/connectDb.js";
import mongoose from "mongoose";
import "../models/knowledgeChunk.model.js";

const indexName = process.env.MONGODB_VECTOR_INDEX_NAME || "knowledge_chunks_vector";
const dimensions = Number(process.env.KNOWLEDGE_EMBEDDING_DIMENSIONS);

if (!dimensions) {
  throw new Error("Set KNOWLEDGE_EMBEDDING_DIMENSIONS to match OPENROUTER_EMBEDDING_MODEL");
}

try {
  await connectDB();
  const collection = mongoose.connection.collection("knowledgechunks");
  const existing = await collection.listSearchIndexes().toArray();

  if (existing.some((item) => item.name === indexName)) {
    console.log(`Vector index already exists: ${indexName}`);
  } else {
    await collection.createSearchIndex({
      name: indexName,
      type: "vectorSearch",
      definition: {
        fields: [
          {
            type: "vector",
            path: "embedding",
            numDimensions: dimensions,
            similarity: process.env.KNOWLEDGE_VECTOR_SIMILARITY || "cosine",
          },
        ],
      },
    });
    console.log(`Vector index created: ${indexName}`);
  }
} finally {
  await mongoose.disconnect().catch(() => {});
}
