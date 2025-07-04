import mongoose from "mongoose";

const IST_OFFSET = 5.5 * 60 * 60 * 1000; // +5:30 in milliseconds

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Provide Name"],
  },
  email: {
    type: String,
    required: [true, "Provide email"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: Number,
    default: "",
  },
  password: {
    type: String,
    required: function () {
      return !this.provider || this.provider === "credentials";
    },
  },
  provider: { type: String, required: true, default: "credentials" },
  avatar: {
    type: String,
    default: "",
  },
  verify_email: {
    type: Boolean,
    default: function () {
      return this.provider === "google" ? true : false;
    }, // Automatically true if provider is Google
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    default: "",
  }],
  access_token: {
     type: String, 
     default: ""
     },
  refresh_token: {
     type: String, 
     default: ""
    },
  last_login_date: {
    type: Date,
    default: () => new Date(Date.now() + IST_OFFSET),
  },
  status: {
    type: String,
    enum: ["Active", "Inactive", "Suspended"],
    default: "Active",
  },
  address_details: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "address",
    },
  ],
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
  notification_array:[{
    type: mongoose.Schema.ObjectId,
  }],
  signUpWithGoogle: {
    type: Boolean,
    default: function () {
      return this.provider === "google";
    },
  },
  googleId: { type: String, unique: true, sparse: true },
}, { timestamps: true });

// Pre-save hook to update last_login_date to IST if modified or new
userSchema.pre("save", function (next) {
  if (this.isModified("last_login_date") || !this.last_login_date) {
    this.last_login_date = new Date(Date.now() + IST_OFFSET);
  }
  next();
});

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel; 
