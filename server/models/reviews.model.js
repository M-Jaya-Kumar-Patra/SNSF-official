import mongoose from "mongoose";

const reviewsSchema = new mongoose.Schema({
  image: {
    type: String,
    default: "",
  },
  userName: {
    type: String,
    default: "",
  },
  review: {
    type: String,
    default: "",
  },
  rating: {
    type: Number, // ⬅️ Corrected from String to Number
    required: true,
    min: 1,
    max: 5,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // ⬅️ Changed from String
    ref: "User", // optional if you want to populate later
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // optional for population
    required: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order", // optional for population
  },
}, {
  timestamps: true
});

const ReviewModel = mongoose.model("Review", reviewsSchema);

export default ReviewModel;
