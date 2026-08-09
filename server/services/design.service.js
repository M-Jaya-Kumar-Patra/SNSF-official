import mongoose from "mongoose";
import ConversationModel from "../models/conversation.model.js";
import MessageModel from "../models/message.model.js";
import FurnitureDesignModel from "../models/furnitureDesign.model.js";
import DesignRequestModel from "../models/designRequest.model.js";
import { completeOpenRouter, isOpenRouterConfigured } from "./openRouter.service.js";
import {
  editFurnitureImage,
  generateFurnitureImage,
  storeDesignImage,
} from "./imageGeneration.service.js";

const DESIGN_LABEL = "AI-generated concept — subject to SNSF feasibility approval.";

function cleanText(value, max = 8_000) {
  return String(value || "").replace(/[\u0000-\u001f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

function localRequirements(prompt) {
  const text = cleanText(prompt, 2_000);
  const lower = text.toLowerCase();
  const requirements = {
    seating: (lower.match(/\b(\d+)\s*[- ]?seater\b/i)?.[1] || ""),
    material: ["stainless steel", "steel", "iron", "wood", "metal"].find((item) => lower.includes(item)) || "",
    fabricColor: ["blue", "red", "green", "black", "white", "grey", "gray", "yellow", "floral"].find((item) => lower.includes(item)) || "",
    fabric: lower.includes("floral") ? "floral fabric" : lower.includes("fabric") ? "fabric requested" : "",
    backrest: lower.includes("curved back") || lower.includes("curved backrest") ? "curved" : "",
    armrests: lower.includes("wooden arm") || lower.includes("wood arm") ? "wooden" : lower.includes("armrest") ? "specified" : "",
    dimensions: "",
    finish: ["matte", "polished", "powder coated", "brushed"].find((item) => lower.includes(item)) || "",
    notes: text,
  };

  const dimension = text.match(/\b(\d+(?:\.\d+)?)\s*(?:x|by)\s*(\d+(?:\.\d+)?)\s*(?:x|by)?\s*(\d*(?:\.\d+)?)?\s*(cm|mm|inch|in|ft)?\b/i);
  if (dimension) requirements.dimensions = dimension[0];
  return requirements;
}

function parseProviderRequirements(content, fallback) {
  try {
    const match = String(content || "").match(/\{[\s\S]*\}/);
    const parsed = match ? JSON.parse(match[0]) : null;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return fallback;
    return { ...fallback, ...Object.fromEntries(Object.entries(parsed).slice(0, 20)) };
  } catch {
    return fallback;
  }
}

export async function extractDesignRequirements(prompt) {
  const fallback = localRequirements(prompt);
  if (!isOpenRouterConfigured()) return fallback;

  try {
    const response = await completeOpenRouter({
      temperature: 0,
      maxTokens: 450,
      messages: [
        {
          role: "system",
          content: "Extract furniture design requirements as JSON only. Never invent missing values. Use keys seating, material, fabricColor, fabric, backrest, armrests, dimensions, finish, notes.",
        },
        { role: "user", content: cleanText(prompt, 2_000) },
      ],
    });
    return parseProviderRequirements(response.content, fallback);
  } catch {
    return fallback;
  }
}

export function buildDesignPrompt(prompt, requirements) {
  const structured = Object.entries(requirements || {})
    .filter(([, value]) => value !== undefined && value !== null && String(value).trim())
    .map(([key, value]) => `${key}: ${cleanText(value, 180)}`)
    .join(", ");
  return [
    "SNSF custom furniture concept",
    `Customer brief: ${cleanText(prompt, 2_000)}`,
    structured ? `Extracted requirements: ${structured}` : "",
  ].filter(Boolean).join(". ");
}

export async function getOwnedDesign(designId, userId) {
  if (!mongoose.Types.ObjectId.isValid(designId) || !mongoose.Types.ObjectId.isValid(userId)) return null;
  return FurnitureDesignModel.findOne({ _id: designId, userId });
}

export async function ensureConversation({ userId, conversationId, title }) {
  if (conversationId && mongoose.Types.ObjectId.isValid(conversationId)) {
    const existing = await ConversationModel.findOne({ _id: conversationId, userId });
    if (existing) return existing;
  }

  return ConversationModel.create({
    userId,
    title: cleanText(title || "Design Your Furniture", 120),
    type: "DESIGN_REQUEST",
    mode: "AI",
  });
}

export async function createDesign({ userId, conversationId, prompt }) {
  const requirements = await extractDesignRequirements(prompt);
  return FurnitureDesignModel.create({
    userId,
    conversationId,
    prompt: cleanText(prompt),
    structuredRequirements: requirements,
    generationStatus: "PENDING",
  });
}

export async function generateDesignVersion(design, { modification = "" } = {}) {
  const providerImage = design.generatedImage?.url && modification
    ? await editFurnitureImage({
        prompt: design.prompt,
        specifications: design.structuredRequirements,
        modification,
        imageUrl: design.generatedImage.url,
      })
    : await generateFurnitureImage({
        prompt: design.prompt,
        specifications: design.structuredRequirements,
      });
  const image = await storeDesignImage(providerImage);
  const nextVersion = (design.currentVersion || 0) + 1;
  design.versions.push({
    versionNumber: nextVersion,
    prompt: buildDesignPrompt(design.prompt, design.structuredRequirements),
    modification: cleanText(modification, 2_000),
    image,
    parentVersion: design.currentVersion || null,
    userId: design.userId,
    conversationId: design.conversationId,
  });
  design.currentVersion = nextVersion;
  design.generatedImage = image;
  design.generationStatus = "GENERATED";
  design.generationError = "";
  await design.save();
  return design;
}

export async function markGenerationFailure(design, error) {
  design.generationStatus = error?.code === "IMAGE_GENERATION_NOT_CONFIGURED" ? "NEEDS_CONFIGURATION" : "FAILED";
  design.generationError = cleanText(error?.message || "Image generation failed", 1_000);
  await design.save();
  return design;
}

export async function createDesignRequest({ design, userId, requestedModifications = [] }) {
  const existing = await DesignRequestModel.findOne({
    designId: design._id,
    userId,
    status: { $nin: ["COMPLETED", "CANNOT_BE_MADE"] },
  });
  if (existing) return existing;

  return DesignRequestModel.create({
    userId,
    conversationId: design.conversationId,
    designId: design._id,
    generatedImage: design.generatedImage,
    prompt: design.prompt,
    specifications: design.structuredRequirements,
    requestedModifications: (Array.isArray(requestedModifications) ? requestedModifications : [requestedModifications])
      .map((value) => cleanText(value, 500))
      .filter(Boolean)
      .slice(0, 10),
  });
}

export async function appendDesignMessage({ conversationId, senderType, content, messageType = "DESIGN", metadata = {} }) {
  const message = await MessageModel.create({ conversationId, senderType, messageType, content, metadata });
  const unreadIncrement = senderType === "ADMIN"
    ? { unreadForUser: 1 }
    : senderType === "USER"
      ? { unreadForAdmin: 1 }
      : {};
  await ConversationModel.findByIdAndUpdate(conversationId, {
    lastMessageAt: new Date(),
    ...(Object.keys(unreadIncrement).length ? { $inc: unreadIncrement } : {}),
  });
  return message;
}

export { DESIGN_LABEL };
