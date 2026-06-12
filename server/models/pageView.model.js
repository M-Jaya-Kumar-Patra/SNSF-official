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

pageViewSchema.index({ timestamp: -1 });
pageViewSchema.index({ sessionId: 1, timestamp: -1 });
pageViewSchema.index({ visitorId: 1, timestamp: -1 });
pageViewSchema.index({ userId: 1, timestamp: -1 });
pageViewSchema.index({ pageName: 1, timestamp: -1 });
pageViewSchema.index({ isExitPage: 1, timestamp: -1 });

export default mongoose.models.PageView || mongoose.model("PageView", pageViewSchema);
  
