import mongoose from "mongoose";
import ConversationModel from "../models/conversation.model.js";
import MessageModel from "../models/message.model.js";
import { answerAssistantMessage } from "../services/aiAssistant.service.js";
import { getProductDetails } from "../services/aiProductTools.service.js";
import { emitConversationEvent } from "../socket/index.js";

function titleFromMessage(message) {
  const clean = String(message || "SNSF AI conversation").replace(/\s+/g, " ").trim();
  return clean.length > 64 ? `${clean.slice(0, 61)}...` : clean;
}

export async function listConversations(req, res) {
  try {
    const conversations = await ConversationModel.find({ userId: req.userId })
      .sort({ lastMessageAt: -1 })
      .limit(30)
      .populate("referencedProductId", "name slug images catName subCat specifications")
      .lean();

    return res.json({ success: true, data: conversations });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function getConversationMessages(req, res) {
  try {
    const conversation = await ConversationModel.findOne({
      _id: req.params.id,
      userId: req.userId,
    }).lean();

    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    const messages = await MessageModel.find({ conversationId: conversation._id })
      .sort({ createdAt: 1 })
      .lean();

    return res.json({ success: true, conversation, messages });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

export async function sendAssistantMessage(req, res) {
  try {
    const { message, conversationId, productContext } = req.body || {};
    const cleanMessage = String(message || "").trim();

    if (!cleanMessage) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    const requestedProductId =
      typeof productContext?.productId === "string" && mongoose.Types.ObjectId.isValid(productContext.productId)
        ? productContext.productId
        : null;
    const safeProductContext = requestedProductId ? { productId: requestedProductId } : null;

    let conversation = null;
    if (conversationId && mongoose.Types.ObjectId.isValid(conversationId)) {
      conversation = await ConversationModel.findOne({
        _id: conversationId,
        userId: req.userId,
      });
    }

    const history = conversation
      ? await MessageModel.find({ conversationId: conversation._id })
          .sort({ createdAt: -1 })
          .limit(12)
          .lean()
          .then((items) => items.reverse())
      : [];

    if (conversation?.mode === "HUMAN" || conversation?.status === "WAITING_FOR_ADMIN") {
      const userMessage = await MessageModel.create({
        conversationId: conversation._id,
        senderType: "USER",
        content: cleanMessage,
      });
      conversation.lastMessageAt = new Date();
      conversation.unreadForAdmin += 1;
      await conversation.save();

      emitConversationEvent(conversation._id, "conversation_message", { message: userMessage });
      emitConversationEvent(conversation._id, "conversation_updated", { conversation });

      return res.json({
        success: true,
        conversation,
        messages: [userMessage],
        humanTakeover: true,
      });
    }

    const referencedProduct = requestedProductId ? await getProductDetails(requestedProductId) : null;

    if (!conversation) {
      conversation = await ConversationModel.create({
        userId: req.userId,
        referencedProductId: referencedProduct?._id || null,
        title: titleFromMessage(cleanMessage),
        type: referencedProduct ? "PRODUCT_ENQUIRY" : "GENERAL",
        metadata: { initialProductContext: safeProductContext },
      });
    }

    const userMessage = await MessageModel.create({
      conversationId: conversation._id,
      senderType: "USER",
      content: cleanMessage,
      productReference: referencedProduct
        ? {
            productId: referencedProduct._id,
            name: referencedProduct.name,
            slug: referencedProduct.slug,
            image: referencedProduct.images?.[0],
          }
        : undefined,
      metadata: { productContext: safeProductContext },
    });

    const aiAnswer = await answerAssistantMessage({
      userId: req.userId,
      message: cleanMessage,
      productContext: safeProductContext,
      conversationId: conversation._id,
      history,
    });

    const aiMessage = await MessageModel.create({
      conversationId: conversation._id,
      senderType: "AI",
      messageType: aiAnswer.messageType || "TEXT",
      content: aiAnswer.content,
      metadata: aiAnswer.metadata || {},
    });

    conversation.lastMessageAt = new Date();
    conversation.unreadForAdmin += aiAnswer.metadata?.humanHandoff ? 1 : 0;
    if (aiAnswer.metadata?.humanHandoff) {
      conversation.status = "WAITING_FOR_ADMIN";
      conversation.mode = "HUMAN";
      conversation.type = "SUPPORT";
    }
    await conversation.save();

    emitConversationEvent(conversation._id, "conversation_message", { message: userMessage });
    emitConversationEvent(conversation._id, "conversation_message", { message: aiMessage });
    emitConversationEvent(conversation._id, "conversation_updated", { conversation });

    return res.json({
      success: true,
      conversation,
      messages: [userMessage, aiMessage],
    });
  } catch (error) {
    console.error("AI assistant error:", error);
    return res.status(500).json({
      success: false,
      message: "SNSF AI is temporarily unavailable. The website is still working normally.",
    });
  }
}

export async function markUserConversationRead(req, res) {
  try {
    const conversation = await ConversationModel.findOne({ _id: req.params.id, userId: req.userId });
    if (!conversation) return res.status(404).json({ success: false, message: "Conversation not found" });
    conversation.unreadForUser = 0;
    await conversation.save();
    emitConversationEvent(conversation._id, "conversation_read", { role: "USER" });
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to mark conversation read" });
  }
}
