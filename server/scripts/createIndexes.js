import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "../config/connectDb.js";

import "../models/address.model.js";
import "../models/admin.model.js";
import "../models/category.model.js";
import "../models/homeSectionItem.model.js";
import "../models/homeSlider.model.js";
import "../models/loginHistory.model.js";
import "../models/notification.model.js";
import "../models/pageView.model.js";
import "../models/poster.model.js";
import "../models/product.model.js";
import "../models/productEvent.model.js";
import "../models/searchLog.model.js";
import "../models/session.model.js";
import "../models/styleYourSpace.model.js";
import "../models/user.model.js";
import "../models/video.model.js";
import "../models/visitCount.model.js";
import "../models/visitor.model.js";
import "../models/wishlist.model.js";

try {
  await connectDB();

  for (const modelName of mongoose.modelNames()) {
    const model = mongoose.model(modelName);
    await model.createIndexes();
    console.log(`Indexes ready: ${modelName}`);
  }

  await mongoose.disconnect();
  console.log("All indexes created successfully");
} catch (error) {
  console.error("Failed to create indexes:", error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
}
