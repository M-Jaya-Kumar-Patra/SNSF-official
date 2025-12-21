import mongoose from "mongoose";

const productEventSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true },
    visitorId: { type: String, required: true },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    eventType: {
      type: String,
      enum: ["view", "add_to_cart", "remove_from_cart", "wishlist"],
      required: true,
    },

    timestamp: { type: Date, default: Date.now },
    timeSpent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ProductEventModel =
  mongoose.models.ProductEvent ||
  mongoose.model("ProductEvent", productEventSchema);

export default ProductEventModel;
