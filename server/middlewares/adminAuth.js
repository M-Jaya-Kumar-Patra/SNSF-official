import mongoose from "mongoose";
import AdminModel from "../models/admin.model.js";

export default async function adminAuth(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.userId)) {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    const admin = await AdminModel.findOne({ _id: req.userId, status: "Active" })
      .select("_id status")
      .lean();

    if (!admin) {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    req.admin = admin;
    req.adminId = admin._id;
    return next();
  } catch (error) {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
}
