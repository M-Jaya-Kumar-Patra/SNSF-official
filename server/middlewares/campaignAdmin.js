import AdminModel from "../models/admin.model.js";
import mongoose from "mongoose";

export async function campaignAdmin(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.adminId)) {
      return res.status(403).json({
        success: false,
        message: "An active, verified admin account is required.",
      });
    }
    const admin = await AdminModel.findById(req.adminId)
      .select("_id status verify_email")
      .lean();
    if (!admin || admin.status !== "Active" || !admin.verify_email) {
      return res.status(403).json({
        success: false,
        message: "An active, verified admin account is required.",
      });
    }
    return next();
  } catch (error) {
    return next(error);
  }
}
