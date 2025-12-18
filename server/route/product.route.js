import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

import {
  createProduct,
  getAllProducts,
  uploadImages,
  getAllProductsByCatId,
  getAllProductsByCatName,
  getAllProductsBySubCatId,
  getAllProductsBySubCatName,
  getAllProductsByThirdCatId,
  getAllProductsByThirdCatName,
  getAllProductsByPrice,
  getAllProductsByRating,
  getProductsCount,
  getAllFeaturedProducts,
  deleteProduct,
  getProduct,
  removeImageFromCloudinary,
  updateProduct,
  deleteMultipleProducts,
  filters,
  sortBy,
  SearchProductsController,
  getProductBySlug,
  getNewArrivals,
  getBestSellers,
  getSuggestions,
  getRecentlyViewed
} from "../controllers/product.controller.js";

const productRouter = Router();

// Upload images
productRouter.post("/uploadImages", auth, upload.array("images"), uploadImages);

// Create product
productRouter.post("/create", auth, createProduct);

// All products
productRouter.get("/gaps", getAllProducts);

// Category based
productRouter.get("/gapsByCatId/:Id", getAllProductsByCatId);
productRouter.get("/gapsByCatName", getAllProductsByCatName);
productRouter.get("/gapsBySubCatId/:Id", getAllProductsBySubCatId);
productRouter.get("/gapsBySubCatName", getAllProductsBySubCatName);
productRouter.get("/gapsByThirdCatId/:thirdSubCatId", getAllProductsByThirdCatId);
productRouter.get("/gapsByThirdCatName", getAllProductsByThirdCatName);

// Price & Rating
productRouter.get("/gapsByPrice", getAllProductsByPrice);
productRouter.get("/gapsByRating", getAllProductsByRating);

// Counts & Featured
productRouter.get("/getAllProductsCount", getProductsCount);
productRouter.get("/getAllFeaturedProducts", getAllFeaturedProducts);

// Delete
productRouter.delete("/deleteImg", auth, removeImageFromCloudinary);
productRouter.delete("/deleteMultiple", auth, deleteMultipleProducts);
productRouter.delete("/:id", deleteProduct);

// Update
productRouter.post("/updateProduct/:id", auth, updateProduct);

// Filters & Sort
productRouter.post("/filters", filters);
productRouter.post("/sortBy", sortBy);

// Search
productRouter.get("/search/get", SearchProductsController);

// NEW ARRIVALS
productRouter.get("/new-arrivals", getNewArrivals);

// BEST SELLERS
productRouter.get("/best-sellers", getBestSellers);

// SUGGESTIONS
productRouter.get("/suggestions", getSuggestions);

// RECENTLY VIEWED
productRouter.post("/recently-viewed", getRecentlyViewed);

// Product by ID or SLUG
productRouter.get("/:prd", getProduct);

export default productRouter;
