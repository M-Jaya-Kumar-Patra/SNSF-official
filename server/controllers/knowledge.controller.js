import mongoose from "mongoose";
import KnowledgeBaseModel from "../models/knowledgeBase.model.js";
import KnowledgeChunkModel from "../models/knowledgeChunk.model.js";
import { indexKnowledgeBase } from "../services/knowledge.service.js";

const CATEGORIES = new Set([
  "WARRANTY",
  "STEEL_GRADES",
  "PRODUCT_CARE",
  "DELIVERY",
  "RETURNS",
  "CUSTOMIZATION",
  "FAQ",
  "COMPANY",
  "OTHER",
]);

function parsePayload(body = {}) {
  const title = String(body.title || "").trim();
  const content = String(body.content || "").trim();
  const category = String(body.category || "OTHER").trim().toUpperCase();
  const sourceType = String(body.sourceType || "MANUAL").trim().toUpperCase();
  const status = String(body.status || "PUBLISHED").trim().toUpperCase();

  if (!title || !content) return { error: "Title and content are required" };
  if (!CATEGORIES.has(category)) return { error: "Invalid knowledge category" };
  if (!["MANUAL", "POLICY", "FAQ", "DOCUMENT"].includes(sourceType)) return { error: "Invalid source type" };
  if (!["DRAFT", "PUBLISHED"].includes(status)) return { error: "Invalid knowledge status" };

  return { title, content, category, sourceType, status };
}

export async function listKnowledge(req, res) {
  try {
    const items = await KnowledgeBaseModel.find()
      .sort({ updatedAt: -1 })
      .select("title category sourceType status indexingStatus indexingError chunkCount embeddingModel embeddingDimensions lastIndexedAt createdAt updatedAt")
      .lean();
    return res.json({ success: true, data: items });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to load knowledge base" });
  }
}

export async function getKnowledge(req, res) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid knowledge id" });
    }
    const item = await KnowledgeBaseModel.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ success: false, message: "Knowledge entry not found" });
    return res.json({ success: true, data: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to load knowledge entry" });
  }
}

export async function createKnowledge(req, res) {
  const payload = parsePayload(req.body);
  if (payload.error) return res.status(400).json({ success: false, message: payload.error });

  try {
    const item = await KnowledgeBaseModel.create({
      ...payload,
      createdBy: req.adminId,
      updatedBy: req.adminId,
    });
    return res.status(201).json({ success: true, data: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to create knowledge entry" });
  }
}

export async function updateKnowledge(req, res) {
  const payload = parsePayload(req.body);
  if (payload.error) return res.status(400).json({ success: false, message: payload.error });
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid knowledge id" });
  }

  try {
    const item = await KnowledgeBaseModel.findByIdAndUpdate(
      req.params.id,
      {
        ...payload,
        indexingStatus: "PENDING",
        indexingError: "",
        updatedBy: req.adminId,
      },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ success: false, message: "Knowledge entry not found" });

    await KnowledgeChunkModel.deleteMany({ knowledgeBaseId: item._id });
    item.chunkCount = 0;
    item.embeddingModel = "";
    item.embeddingDimensions = 0;
    item.lastIndexedAt = null;
    await item.save();

    return res.json({ success: true, data: item });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to update knowledge entry" });
  }
}

export async function deleteKnowledge(req, res) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid knowledge id" });
  }

  try {
    const item = await KnowledgeBaseModel.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Knowledge entry not found" });
    await KnowledgeChunkModel.deleteMany({ knowledgeBaseId: item._id });
    return res.json({ success: true, message: "Knowledge entry deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to delete knowledge entry" });
  }
}

export async function indexKnowledge(req, res) {
  try {
    const item = await indexKnowledgeBase(req.params.id, req.adminId);
    return res.json({ success: true, data: item });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Knowledge indexing failed",
    });
  }
}

export async function reindexKnowledge(req, res) {
  try {
    const items = await KnowledgeBaseModel.find({ status: "PUBLISHED" }).select("_id").lean();
    const results = [];
    for (const item of items) {
      try {
        await indexKnowledgeBase(item._id, req.adminId);
        results.push({ id: item._id, status: "INDEXED" });
      } catch (error) {
        results.push({ id: item._id, status: "ERROR", message: error.message });
      }
    }
    return res.json({ success: true, data: results });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Knowledge re-indexing failed" });
  }
}
