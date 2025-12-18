import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
  visitorId: { type: String, required: true },
  sessionId: { type: String },

  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

  deviceType: String,
  browser: String,
  os: String,
  screenWidth: Number,
  screenHeight: Number,

  ip: String,
  country: String,
  city: String,

  referrer: String,
  utmSource: String,
  utmMedium: String,
  utmCampaign: String,

  firstVisit: { type: Date, default: Date.now },
  lastVisit: { type: Date, default: Date.now },

  visitorType: { type: String, enum: ["new", "returning"], default: "new" },

}, { timestamps: true });

export default mongoose.models.Visitor || mongoose.model("Visitor", visitorSchema);
