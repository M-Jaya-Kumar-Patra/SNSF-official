// models/Enquiry.js
import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  image:{
    type: String,
    ref: "Product",
  },
  message: {
    type: String,
    default: "",
  },
  userMsg: {
    type: String,
    default: "",
  },
  contactInfo: {
    name: String,
    email: String,
    phone: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const enquiryModel =  mongoose.model("Enquiry", enquirySchema);


export default enquiryModel
