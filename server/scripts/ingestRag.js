import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/connectDb.js";
import { ingestRagKnowledge } from "../services/rag.service.js";

try {
  await connectDB();
  const result = await ingestRagKnowledge();
  console.log("RAG ingestion completed:", result);
  process.exit(0);
} catch (error) {
  console.error("RAG ingestion failed:", error);
  process.exit(1);
}
