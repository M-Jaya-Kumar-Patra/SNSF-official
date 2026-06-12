import mongoose from "mongoose";

const searchLogSchema = new mongoose.Schema({
  query: { type: String, required: true },
  visitorId: String,
  sessionId: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

  resultsFound: Number,

  searchedAt: { type: Date, default: Date.now },
}, { timestamps: true });

searchLogSchema.index({ searchedAt: -1 });
searchLogSchema.index({ query: 1, searchedAt: -1 });
searchLogSchema.index({ userId: 1, searchedAt: -1 });
searchLogSchema.index({ visitorId: 1, searchedAt: -1 });
searchLogSchema.index({ sessionId: 1, searchedAt: -1 });

export default mongoose.models.SearchLog || mongoose.model("SearchLog", searchLogSchema);
