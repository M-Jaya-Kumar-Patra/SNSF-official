import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import {
  cacheResponse,
  invalidateCacheOnSuccess,
} from "../middlewares/cache.js";
import {
  createCategory,
  getCategories,
  uploadImages,

  getCategoriesCount,
  removeImageFromCloudinary,
  getSubCategoriesCount,
  getCategory,
  deleteCategory,
  updatedCategory,
} from "../controllers/category.controller.js";

const categoryRouter = Router();
const categoryCache = cacheResponse("categories", Number(process.env.CATEGORY_CACHE_TTL_SECONDS) || 300);
const invalidateCategoryCache = invalidateCacheOnSuccess([
  "categories",
  "products",
  "productSearch",
  "homeSections",
]);

categoryRouter.post('/create', auth, upload.array('images'), invalidateCategoryCache, createCategory);
categoryRouter.post('/uploadImage', auth, upload.array('images'), uploadImages);

categoryRouter.get('/getCategories', categoryCache, getCategories);
categoryRouter.get('/get/count', categoryCache, getCategoriesCount);
categoryRouter.get('/get/count/subCat', categoryCache, getSubCategoriesCount);
categoryRouter.get('/:id', categoryCache, getCategory);
categoryRouter.delete("/remove-img", auth, invalidateCategoryCache, removeImageFromCloudinary);
categoryRouter.delete('/:id', auth, invalidateCategoryCache, deleteCategory);

// ✅ Now handles image uploads during update
categoryRouter.put('/:id', auth, upload.array('images'), invalidateCategoryCache, updatedCategory);

export default categoryRouter;
