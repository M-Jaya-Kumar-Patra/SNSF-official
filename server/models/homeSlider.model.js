import mongoose from "mongoose";

const homeSliderSchema = new mongoose.Schema(
  {
    // 🔹 Main product image(s)
    images: {
      type: [String],
      required: true,
    },

    // 🔹 Hero text content
    title: {
      type: String,
      required: true, // e.g. "Comfort Sofa Chair"
      trim: true,
    },

    tagline: {
      type: String,
      default: "Premium Furniture",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 300,
    },

    // 🔹 CTA navigation
    url: {
      type: String,
      default: "",
    },

    // 🔹 Optional button label
    ctaText: {
      type: String,
      default: "View Details",
    },

    // 🔹 Slider control
    order: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const HomeSliderModel =
  mongoose.models.HomeSlider ||
  mongoose.model("HomeSlider", homeSliderSchema);

export default HomeSliderModel;
