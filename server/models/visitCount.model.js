import mongoose from "mongoose";

const visitCountSchema = new mongoose.Schema(
  {
    visitorId: {
      type: String,
      index: true,
    },

    ipAddress: {
      type: String,
      index: true,
    },

    userAgent: {
      type: String,
    },

    visitedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    isIgnored: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const VisitCountModel =
  mongoose.models.VisitCount ||
  mongoose.model("VisitCount", visitCountSchema);

export default VisitCountModel;
