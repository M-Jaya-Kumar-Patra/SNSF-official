import mongoose from "mongoose";
import ConversationModel from "../models/conversation.model.js";
import MessageModel from "../models/message.model.js";
import DesignRequestModel from "../models/designRequest.model.js";
import { emitConversationEvent } from "../socket/index.js";

const DESIGN_STATUSES = new Set([
  "PENDING",
  "UNDER_REVIEW",
  "CAN_BE_MADE",
  "CANNOT_BE_MADE",
  "NEEDS_MODIFICATION",
  "COMPLETED",
]);

function validId(value) {
  return mongoose.Types.ObjectId.isValid(value);
}

function clean(value, max = 4_000) {
  return String(value || "").replace(/[\u0000-\u001f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

async function getAdminConversation(id) {
  if (!validId(id)) return null;
  return ConversationModel.findById(id);
}

async function addAdminMessage(conversation, content, metadata = {}, messageType = "TEXT") {
  const message = await MessageModel.create({
    conversationId: conversation._id,
    senderType: "ADMIN",
    messageType,
    content,
    metadata,
  });
  conversation.lastMessageAt = new Date();
  conversation.unreadForUser += 1;
  await conversation.save();
  emitConversationEvent(conversation._id, "conversation_message", { message });
  emitConversationEvent(conversation._id, "conversation_updated", { conversation });
  return message;
}

export async function listAdminConversations(req, res) {
  try {
    const filters = {};
    if (["OPEN", "WAITING_FOR_ADMIN", "CLOSED"].includes(req.query.status)) filters.status = req.query.status;
    if (["AI", "HUMAN", "HYBRID"].includes(req.query.mode)) filters.mode = req.query.mode;
    if (["GENERAL", "PRODUCT_ENQUIRY", "DESIGN_REQUEST", "SUPPORT"].includes(req.query.type)) filters.type = req.query.type;
    const search = clean(req.query.q, 120);
    if (search) filters.title = { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };

    const conversations = await ConversationModel.find(filters)
      .sort({ lastMessageAt: -1 })
      .limit(100)
      .populate("userId", "name email phone avatar")
      .populate("assignedAdminId", "name email")
      .populate("referencedProductId", "name slug images")
      .lean();
    return res.json({ success: true, data: conversations });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to load conversations" });
  }
}

export async function getAdminConversationMessages(req, res) {
  const conversation = await getAdminConversation(req.params.id);
  if (!conversation) return res.status(404).json({ success: false, message: "Conversation not found" });
  const messages = await MessageModel.find({ conversationId: conversation._id }).sort({ createdAt: 1 }).lean();
  return res.json({ success: true, conversation, messages });
}

export async function sendAdminMessage(req, res) {
  const conversation = await getAdminConversation(req.params.id);
  if (!conversation) return res.status(404).json({ success: false, message: "Conversation not found" });
  const content = clean(req.body?.message);
  if (!content) return res.status(400).json({ success: false, message: "Message is required" });

  conversation.mode = "HUMAN";
  conversation.status = "OPEN";
  conversation.assignedAdminId = req.adminId;
  const message = await addAdminMessage(conversation, content, { adminId: req.adminId });
  return res.json({ success: true, conversation, message });
}

export async function takeOverConversation(req, res) {
  const conversation = await getAdminConversation(req.params.id);
  if (!conversation) return res.status(404).json({ success: false, message: "Conversation not found" });
  conversation.mode = "HUMAN";
  conversation.status = "OPEN";
  conversation.assignedAdminId = req.adminId;
  conversation.unreadForUser += 1;
  await conversation.save();
  const message = await MessageModel.create({
    conversationId: conversation._id,
    senderType: "SYSTEM",
    messageType: "SYSTEM",
    content: "The SNSF team has taken over this conversation.",
    metadata: { action: "takeover", adminId: req.adminId },
  });
  emitConversationEvent(conversation._id, "conversation_message", { message });
  emitConversationEvent(conversation._id, "conversation_updated", { conversation });
  return res.json({ success: true, conversation, message });
}

export async function returnConversationToAI(req, res) {
  const conversation = await getAdminConversation(req.params.id);
  if (!conversation) return res.status(404).json({ success: false, message: "Conversation not found" });
  conversation.mode = "AI";
  conversation.status = "OPEN";
  conversation.assignedAdminId = null;
  conversation.unreadForUser += 1;
  await conversation.save();
  const message = await MessageModel.create({
    conversationId: conversation._id,
    senderType: "SYSTEM",
    messageType: "SYSTEM",
    content: "The SNSF team returned this conversation to SNSF AI.",
    metadata: { action: "return_to_ai", adminId: req.adminId },
  });
  emitConversationEvent(conversation._id, "conversation_message", { message });
  emitConversationEvent(conversation._id, "conversation_updated", { conversation });
  return res.json({ success: true, conversation, message });
}

export async function closeConversation(req, res) {
  const conversation = await getAdminConversation(req.params.id);
  if (!conversation) return res.status(404).json({ success: false, message: "Conversation not found" });
  conversation.status = "CLOSED";
  conversation.mode = "HUMAN";
  conversation.assignedAdminId = req.adminId;
  conversation.unreadForUser += 1;
  await conversation.save();
  const message = await MessageModel.create({
    conversationId: conversation._id,
    senderType: "SYSTEM",
    messageType: "SYSTEM",
    content: "This conversation has been closed by the SNSF team.",
    metadata: { action: "close", adminId: req.adminId },
  });
  emitConversationEvent(conversation._id, "conversation_message", { message });
  emitConversationEvent(conversation._id, "conversation_updated", { conversation });
  return res.json({ success: true, conversation, message });
}

export async function markAdminConversationRead(req, res) {
  const conversation = await getAdminConversation(req.params.id);
  if (!conversation) return res.status(404).json({ success: false, message: "Conversation not found" });
  conversation.unreadForAdmin = 0;
  await conversation.save();
  emitConversationEvent(conversation._id, "conversation_read", { role: "ADMIN" });
  return res.json({ success: true });
}

export async function listAdminDesignRequests(req, res) {
  const filters = {};
  if (DESIGN_STATUSES.has(req.query.status)) filters.status = req.query.status;
  const requests = await DesignRequestModel.find(filters)
    .sort({ updatedAt: -1 })
    .limit(100)
    .populate("userId", "name email phone")
    .populate("designId", "prompt structuredRequirements generatedImage versions currentVersion")
    .lean();
  return res.json({ success: true, data: requests });
}

export async function getAdminDesignRequest(req, res) {
  const request = await DesignRequestModel.findById(req.params.id)
    .populate("userId", "name email phone")
    .populate("designId", "prompt structuredRequirements generatedImage versions currentVersion")
    .lean();
  if (!request) return res.status(404).json({ success: false, message: "Design request not found" });
  return res.json({ success: true, data: request });
}

export async function updateAdminDesignRequest(req, res) {
  const request = await DesignRequestModel.findById(req.params.id);
  if (!request) return res.status(404).json({ success: false, message: "Design request not found" });
  const status = String(req.body?.status || request.status).toUpperCase();
  if (!DESIGN_STATUSES.has(status)) return res.status(400).json({ success: false, message: "Invalid design request status" });
  const response = clean(req.body?.adminResponse, 4_000);
  request.status = status;
  request.adminResponse = response || request.adminResponse;
  request.assignedAdminId = req.adminId;
  request.reviewedAt = new Date();
  await request.save();

  const conversation = await ConversationModel.findById(request.conversationId);
  if (conversation) {
    conversation.mode = "HUMAN";
    conversation.status = status === "COMPLETED" || status === "CANNOT_BE_MADE" ? "CLOSED" : "OPEN";
    conversation.assignedAdminId = req.adminId;
    await conversation.save();
    const message = await addAdminMessage(
      conversation,
      response || `SNSF design request status updated to ${status}.`,
      { designRequestId: request._id, status },
      "DESIGN"
    );
    emitConversationEvent(conversation._id, "design_request_updated", { request, message });
  }
  return res.json({ success: true, data: request });
}
