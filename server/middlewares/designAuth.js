import Admin from "../models/admin.model.js";
import User from "../models/user.model.js";
import { isId } from "../utils/designStudio.js";

// Authentication alone does not grant access to the material library or enquiries.
export const designAccount = (admin = false) => async (req, res, next) => {
  try {
    const Model = admin ? Admin : User;
    const identity = String(req.userId || "");
    const account = await Model.findOne(isId(identity) ? { _id: identity } : { googleId: identity }).select("_id status verify_email").lean();
    if (!account || account.status !== "Active" || !account.verify_email) return res.status(403).json({ success: false, message: admin ? "An active, verified admin account is required." : "Please verify your account to create designs." });
    req.designOwner = String(account._id);
    next();
  } catch (error) { next(error); }
};
