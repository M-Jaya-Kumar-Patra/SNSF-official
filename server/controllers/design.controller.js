import mongoose from "mongoose";
import ConversationModel from "../models/conversation.model.js";
import DesignRequestModel from "../models/designRequest.model.js";
import FurnitureDesignModel from "../models/furnitureDesign.model.js";
import {
  appendDesignMessage,
  createDesign,
  createDesignRequest,
  DESIGN_LABEL,
  ensureConversation,
  generateDesignVersion,
  getOwnedDesign,
  markGenerationFailure,
} from "../services/design.service.js";
import { emitConversationEvent } from "../socket/index.js";

function clean(value, max = 8_000) {
  return String(value || "").replace(/[\u0000-\u001f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

function validId(value) {
  return mongoose.Types.ObjectId.isValid(value);
}

function designMetadata(design) {
  return {
    designId: design._id,
    generationStatus: design.generationStatus,
    currentVersion: design.currentVersion,
    generatedImage: design.generatedImage,
    structuredRequirements: design.structuredRequirements,
  };
}

async function createAssistantDesignMessage(design, conversation) {
  const hasImage = Boolean(design.generatedImage?.url);
  const content = hasImage
    ? `${DESIGN_LABEL}\n\nYour furniture concept is ready. You can request a modification or ask SNSF whether it can be made.`
    : `${DESIGN_LABEL}\n\nThe design requirements were saved, but image generation is currently unavailable. You can still submit the design to SNSF for feasibility review.`;
  const message = await appendDesignMessage({
    conversationId: conversation._id,
    senderType: "AI",
    content,
    metadata: designMetadata(design),
  });
  emitConversationEvent(conversation._id, "conversation_message", { message });
  return message;
}

export async function createFurnitureDesign(req, res) {
  try {
    const prompt = clean(req.body?.prompt, 2_000);
    if (!prompt) return res.status(400).json({ success: false, message: "Describe the furniture you want to design" });

    const conversation = await ensureConversation({
      userId: req.userId,
      conversationId: req.body?.conversationId,
      title: prompt,
    });
    conversation.type = "DESIGN_REQUEST";
    await conversation.save();

    const userMessage = await appendDesignMessage({
      conversationId: conversation._id,
      senderType: "USER",
      content: prompt,
      messageType: "DESIGN",
      metadata: { action: "design_create" },
    });
    const design = await createDesign({ userId: req.userId, conversationId: conversation._id, prompt });

    try {
      await generateDesignVersion(design);
    } catch (error) {
      await markGenerationFailure(design, error);
    }
    const aiMessage = await createAssistantDesignMessage(design, conversation);
    conversation.metadata = { ...(conversation.metadata || {}), designId: design._id };
    await conversation.save();
    emitConversationEvent(conversation._id, "conversation_updated", { conversation, design });

    return res.status(201).json({
      success: true,
      conversation,
      design,
      messages: [userMessage, aiMessage],
      imageAvailable: Boolean(design.generatedImage?.url),
      imageStatus: design.generationStatus,
    });
  } catch (error) {
    console.error("Create furniture design error:", error);
    return res.status(500).json({ success: false, message: "Unable to save the furniture design" });
  }
}

export async function listFurnitureDesigns(req, res) {
  const designs = await FurnitureDesignModel.find({ userId: req.userId }).sort({ updatedAt: -1 }).limit(30).lean();
  return res.json({ success: true, data: designs });
}

export async function getFurnitureDesign(req, res) {
  const design = await getOwnedDesign(req.params.id, req.userId);
  if (!design) return res.status(404).json({ success: false, message: "Design not found" });
  return res.json({ success: true, data: design });
}

export async function generateDesignImage(req, res) {
  const design = await getOwnedDesign(req.params.id, req.userId);
  if (!design) return res.status(404).json({ success: false, message: "Design not found" });
  try {
    await generateDesignVersion(design);
    const message = await createAssistantDesignMessage(design, await ConversationModel.findById(design.conversationId));
    emitConversationEvent(design.conversationId, "conversation_updated", { design, message });
    return res.json({ success: true, data: design, message });
  } catch (error) {
    await markGenerationFailure(design, error);
    return res.status(error.statusCode || 502).json({
      success: false,
      status: design.generationStatus,
      data: design,
      message: error.message || "Image generation failed",
    });
  }
}

export async function editDesignImage(req, res) {
  const design = await getOwnedDesign(req.params.id, req.userId);
  if (!design) return res.status(404).json({ success: false, message: "Design not found" });
  const modification = clean(req.body?.modification, 2_000);
  if (!modification) return res.status(400).json({ success: false, message: "Describe the modification" });
  if (!design.generatedImage?.url) return res.status(409).json({ success: false, message: "Generate a design image before editing it" });

  try {
    await generateDesignVersion(design, { modification });
    const message = await createAssistantDesignMessage(design, await ConversationModel.findById(design.conversationId));
    emitConversationEvent(design.conversationId, "conversation_updated", { design, message });
    return res.json({ success: true, data: design, message });
  } catch (error) {
    return res.status(error.statusCode || 502).json({ success: false, status: "IMAGE_EDITING_UNAVAILABLE", message: error.message });
  }
}

export async function submitDesignForApproval(req, res) {
  const design = await getOwnedDesign(req.params.id, req.userId);
  if (!design) return res.status(404).json({ success: false, message: "Design not found" });
  const requestedModifications = Array.isArray(req.body?.requestedModifications)
    ? req.body.requestedModifications
    : req.body?.requestedModifications ? [req.body.requestedModifications] : [];
  const designRequest = await createDesignRequest({ design, userId: req.userId, requestedModifications });
  await ConversationModel.findByIdAndUpdate(design.conversationId, {
    type: "DESIGN_REQUEST",
    status: "WAITING_FOR_ADMIN",
    mode: "HUMAN",
  });

  const userMessage = await appendDesignMessage({
    conversationId: design.conversationId,
    senderType: "USER",
    content: "Ask SNSF if this can be made",
    metadata: { designRequestId: designRequest._id, designId: design._id },
  });
  const aiMessage = await appendDesignMessage({
    conversationId: design.conversationId,
    senderType: "AI",
    content: "I have sent this design to the SNSF team for feasibility approval. AI will pause if the team takes over this conversation.",
    metadata: { designRequestId: designRequest._id, status: designRequest.status, humanHandoff: true },
  });
  emitConversationEvent(design.conversationId, "conversation_updated", { designRequest, mode: "HUMAN" });
  emitConversationEvent(design.conversationId, "conversation_message", { message: userMessage });
  emitConversationEvent(design.conversationId, "conversation_message", { message: aiMessage });
  return res.status(201).json({ success: true, data: designRequest, messages: [userMessage, aiMessage] });
}

export async function listUserDesignRequests(req, res) {
  const requests = await DesignRequestModel.find({ userId: req.userId })
    .sort({ updatedAt: -1 })
    .populate("designId", "prompt generatedImage structuredRequirements versions currentVersion")
    .lean();
  return res.json({ success: true, data: requests });
}
