import mongoose from "mongoose";
import ProductModel from "../models/product.model.js";
import slugify from "slugify";
import connectDB from "../config/connectDb.js";

const generateSlugs = async () => {
  await connectDB();

  const products = await ProductModel.find();

  for (const product of products) {
    if (!product.slug) {
      product.slug = slugify(product.name, { lower: true, strict: true });
      await product.save();
      console.log(`Slug generated for: ${product.name}`);
    }
  }

  console.log("All slugs generated!");
  process.exit();
};

generateSlugs();
