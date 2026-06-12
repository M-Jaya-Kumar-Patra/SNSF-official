import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import { cacheResponse, invalidateCacheOnSuccess } from "../middlewares/cache.js";

import {
    uploadImages,
    createPoster, getPosters, deletePoster, removeImage, updatePoster, reorderPoster} from "../controllers/poster.controller.js";

const posterRouter = Router();
const posterCache = cacheResponse("homeSections", Number(process.env.HOME_SECTION_CACHE_TTL_SECONDS) || 180);
const invalidatePosterCache = invalidateCacheOnSuccess(["homeSections"]);

// Upload Image
posterRouter.post('/uploadImages', auth, upload.array('images'), uploadImages);

// Create Style Your Space Item
posterRouter.post('/create', auth, invalidatePosterCache, createPoster);

// Get All Items
posterRouter.get('/getAll', posterCache, getPosters);

// Delete image from Cloudinary
posterRouter.delete('/deleteImg', auth, invalidatePosterCache, removeImage);

// Delete Style Your Space Item
posterRouter.delete('/:id', auth, invalidatePosterCache, deletePoster);

// Update Item
posterRouter.put('/:id', auth, invalidatePosterCache, updatePoster);

// POST reorder
posterRouter.post("/reorder", auth, invalidatePosterCache, reorderPoster);



export default posterRouter;
