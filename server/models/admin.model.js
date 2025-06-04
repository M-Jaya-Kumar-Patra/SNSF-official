import mongoose from "mongoose";

const IST_OFFSET = 5.5 * 60 * 60 * 1000; // +5:30 in milliseconds

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Provide Name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Provide email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/.+@.+\..+/, "Enter a valid email"],
    },
    phone: {
      type: String,
      default: "",
      match: [/^[0-9]{10,15}$/, "Enter a valid phone number"], // Optional pattern
    },
    password: {
      type: String,
      required: function () {
        return !this.provider || this.provider === "credentials";
      },
    },
    provider: {
      type: String,
      required: true,
      default: "credentials",
      enum: ["credentials", "google"],
    },
    avatar: {
      type: String,
      default: "",
    },
    verify_email: {
      type: Boolean,
      default: function () {
        return this.provider === "google";
      },
    },
    access_token: {
      type: String,
      default: "",
    },
    refresh_token: {
      type: String,
      default: "",
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
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    signUpWithGoogle: {
      type: Boolean,
      default: function () {
        return this.provider === "google";
      },
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple nulls
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to update `last_login_date` to IST when modified or new
adminSchema.pre("save", function (next) {
  if (this.isModified("last_login_date") || !this.last_login_date) {
    this.last_login_date = new Date(Date.now() + IST_OFFSET);
  }
  next();
});

const AdminModel = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export default AdminModel;
