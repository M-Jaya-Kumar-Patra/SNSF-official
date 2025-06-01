import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  productId:{
    type: mongoose.Schema.ObjectId,
  },
  description: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
      required: true,
    }
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
  catName: {
    type: String,
    default: '',
  },
  catId: {
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
  thirdSubCat: {
    type: String,
    default: '',
  },
  thirdSubCatId: {
    type: String,
    default: '',
  },
  category: { type: String, required: true, default: 'Uncategorized' },

  countInStock: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  discount: {
    type: Number,
    required: true,
  },
  size: [
    {
      type: String,
      default: null,
    }
  ],
  location: [
    {
      value: {
        type: String,
      },
      label: {
        type: String,
      }
    }
  ],
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});


const ProductModel = mongoose.model('Product', productSchema)

export default ProductModel