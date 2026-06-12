import mongoose from "mongoose";

const loginHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  loggedInAt: {
    type: Date,
    default: Date.now,
  },
});

loginHistorySchema.index({ userId: 1, loggedInAt: -1 });
loginHistorySchema.index({ loggedInAt: -1 });

const LoginHistoryModel =
  mongoose.models.LoginHistory ||
  mongoose.model("LoginHistory", loginHistorySchema);

export default LoginHistoryModel;
