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

const LoginHistoryModel =
  mongoose.models.LoginHistory ||
  mongoose.model("LoginHistory", loginHistorySchema);

export default LoginHistoryModel;
