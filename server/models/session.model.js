import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  visitorId: { type: String, required: true },
  sessionId: { type: String, required: true },

  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

  pagesVisitedCount: { type: Number, default: 0 },
  sessionDuration: { type: Number, default: 0 },

  bounce: { type: Boolean, default: false },

  startedAt: { type: Date, default: Date.now },
  lastActivity: { type: Date, default: Date.now },
  endedAt: { type: Date },

}, { timestamps: true });

export default mongoose.models.Session || mongoose.model("Session", sessionSchema);
