// models/Enquiry.js
import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    default: null,
  },
  source: {
    type: String,
    enum: ["WEB", "AI", "WHATSAPP", "CALL"],
    default: "WEB",
  },
  image:{
    type: String,
    ref: "Product",
  },
  message: {
    type: String,
    default: "",
  },
  userMsg: {
    type: String,
    default: "",
  },
  contactInfo: {
    name: String,
    email: String,
    phone: String,
  },
  aiContext: {
    customerRequirement: { type: String, default: "" },
    requestedPrice: { type: String, default: "" },
    availabilityRequested: { type: Boolean, default: false },
    customizationRequest: { type: String, default: "" },
    productSpecifications: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

enquirySchema.index({ conversationId: 1, createdAt: -1 });
enquirySchema.index({ source: 1, createdAt: -1 });

const enquiryModel =  mongoose.model("Enquiry", enquirySchema);


export default enquiryModel
