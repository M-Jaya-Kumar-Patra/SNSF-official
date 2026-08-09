import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    assignedAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    mode: {
      type: String,
      enum: ["AI", "HUMAN", "HYBRID"],
      default: "AI",
    },
    status: {
      type: String,
      enum: ["OPEN", "WAITING_FOR_ADMIN", "CLOSED"],
      default: "OPEN",
    },
    type: {
      type: String,
      enum: ["GENERAL", "PRODUCT_ENQUIRY", "DESIGN_REQUEST", "SUPPORT"],
      default: "GENERAL",
    },
    referencedProductId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },
    title: {
      type: String,
      default: "SNSF AI conversation",
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    unreadForUser: {
      type: Number,
      default: 0,
    },
    unreadForAdmin: {
      type: Number,
      default: 0,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

conversationSchema.index({ userId: 1, updatedAt: -1 });
conversationSchema.index({ status: 1, lastMessageAt: -1 });
conversationSchema.index({ referencedProductId: 1, lastMessageAt: -1 });

const ConversationModel =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema);

export default ConversationModel;
