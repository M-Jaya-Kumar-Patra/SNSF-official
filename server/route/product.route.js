import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import {
  cacheResponse,
  invalidateCacheOnSuccess,
} from "../middlewares/cache.js";

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
const productCache = cacheResponse("products", Number(process.env.PRODUCT_CACHE_TTL_SECONDS) || 120);
const invalidateProductCache = invalidateCacheOnSuccess([
  "products",
  "productSearch",
  "homeSections",
  "analytics",
]);

// Upload images
productRouter.post("/uploadImages", auth, upload.array("images"), uploadImages);

// Create product
productRouter.post("/create", auth, invalidateProductCache, createProduct);

// All products
productRouter.get("/gaps", productCache, getAllProducts);

// Category based
productRouter.get("/gapsByCatId/:Id", productCache, getAllProductsByCatId);
productRouter.get("/gapsByCatName", productCache, getAllProductsByCatName);
productRouter.get("/gapsBySubCatId/:Id", productCache, getAllProductsBySubCatId);
productRouter.get("/gapsBySubCatName", productCache, getAllProductsBySubCatName);
productRouter.get("/gapsByThirdCatId/:thirdSubCatId", productCache, getAllProductsByThirdCatId);
productRouter.get("/gapsByThirdCatName", productCache, getAllProductsByThirdCatName);

// Price & Rating
productRouter.get("/gapsByPrice", productCache, getAllProductsByPrice);
productRouter.get("/gapsByRating", productCache, getAllProductsByRating);

// Counts & Featured
productRouter.get("/getAllProductsCount", productCache, getProductsCount);
productRouter.get("/getAllFeaturedProducts", productCache, getAllFeaturedProducts);

// Delete
productRouter.delete("/deleteImg", auth, invalidateProductCache, removeImageFromCloudinary);
productRouter.delete("/deleteMultiple", auth, invalidateProductCache, deleteMultipleProducts);
productRouter.delete("/:id", auth, invalidateProductCache, deleteProduct);

// Update
productRouter.post("/updateProduct/:id", auth, invalidateProductCache, updateProduct);

// Filters & Sort
productRouter.post("/filters", filters);
productRouter.post("/sortBy", sortBy);

// Search
productRouter.get("/search/get", cacheResponse("productSearch", 30), SearchProductsController);

// NEW ARRIVALS
productRouter.get("/new-arrivals", productCache, getNewArrivals);

// BEST SELLERS
productRouter.get("/best-sellers", productCache, getBestSellers);

// SUGGESTIONS
productRouter.get("/suggestions", productCache, getSuggestions);

// RECENTLY VIEWED
productRouter.post("/recently-viewed", getRecentlyViewed);

// Product by ID or SLUG
productRouter.get("/:prd", productCache, getProduct);

export default productRouter;
