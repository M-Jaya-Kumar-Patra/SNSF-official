import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    senderType: {
      type: String,
      enum: ["USER", "AI", "ADMIN", "SYSTEM"],
      required: true,
    },
    messageType: {
      type: String,
      enum: ["TEXT", "PRODUCTS", "ENQUIRY", "DESIGN", "SYSTEM"],
      default: "TEXT",
    },
    content: {
      type: String,
      default: "",
    },
    attachments: [
      {
        type: {
          type: String,
          default: "image",
        },
        url: String,
        name: String,
      },
    ],
    productReference: {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        default: null,
      },
      name: String,
      slug: String,
      image: String,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

messageSchema.index({ conversationId: 1, createdAt: 1 });

const MessageModel =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

export default MessageModel;
