import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  productId: {
    type: mongoose.Schema.ObjectId,
  },
  checked: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
  },
  images: [
    {
      type: String,
      required: true,
    },
  ],
  brand: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    default: 0,
  },
  oldPrice: {
    type: Number,
    default: 0,
  },
  catId: {
    type: String,
    default: '',
  },
  catName: {
    type: String,
    default: '',
  },
  subCatId: {
    type: String,
    default: '',
  },
  subCat: {
    type: String,
    default: '',
  },
  thirdSubCatId: {
    type: String,
    default: '',
  },
  thirdSubCat: {
    type: String,
    default: '',
  },
  countInStock: {
    type: Number,
  },
  sales: {
    type: Number,
    default: 0,
  },rating: {
  type: Number,
  default: 0,
},
ratingCount: {
  type: Number,
  default: 0,
},
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isAllinOne: {
    type: Boolean,
    default: false,
  },
  discount: {
    type: Number,
  },
  size: [
    {
      type: String,
      default: null,
    },
  ],
  location: [
    {
      value: {
        type: String,
      },
      label: {
        type: String,
      },
    },
  ],
  dateCreated: {
    type: Date,
    default: Date.now,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  
    delivery_days:{
        type: String
    },
    callOnlyDelivery:{
        type:Boolean,
        default:true
    },

  specifications: {
    material: { type: String, default: "" },
    setOf:{type:Number, default:1},
    grade: { type: String, default: "" },
    fabric: { type: String, default: "" },
    fabricColor: { type: String, default: "" },
    size: { type: String, default: "" }, // use `specifications.size` if you want detailed size string
    weight: { type: String, default: "" },
    height: { type: String, default: "" },
    warranty: { type: String, default: "" },
    thickness: { type: String, default: "" },
    length: { type: String, default: "" },
    width: { type: String, default: "" },
    polish: { type: String, default: "" },  // optional
    frameMaterial: { type: String, default: "" }, // optional
  }
});

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
