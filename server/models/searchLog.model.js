import mongoose from "mongoose";

const searchLogSchema = new mongoose.Schema({
  query: { type: String, required: true },
  visitorId: String,
  sessionId: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

  resultsFound: Number,

  searchedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.SearchLog || mongoose.model("SearchLog", searchLogSchema);
