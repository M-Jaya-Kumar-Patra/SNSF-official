import mongoose from "mongoose";

const pageViewSchema = new mongoose.Schema({
  visitorId: { type: String, required: true },
  sessionId: { type: String, required: true },

  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

  pageName: { type: String, required: true },
  scrollDepth: Number,
  timeSpent: Number,
  isExitPage: { type: Boolean, default: false },

  timestamp: { type: Date, default: Date.now },

}, { timestamps: true });

export default mongoose.models.PageView || mongoose.model("PageView", pageViewSchema);
  