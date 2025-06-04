import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
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

categoryRouter.post('/create', auth, upload.array('images'), createCategory);
categoryRouter.post('/uploadImage', auth, upload.array('images'), uploadImages);

categoryRouter.get('/getCategories', getCategories);
categoryRouter.get('/get/count', getCategoriesCount);
categoryRouter.get('/get/count/subCat', getSubCategoriesCount);
categoryRouter.get('/:id', getCategory);
categoryRouter.delete("/remove-img", auth, removeImageFromCloudinary);
categoryRouter.delete('/:id', auth, deleteCategory);

// ✅ Now handles image uploads during update
categoryRouter.put('/:id', auth, upload.array('images'), updatedCategory);

export default categoryRouter;
