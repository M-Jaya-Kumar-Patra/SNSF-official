import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";
import { cacheResponse, invalidateCacheOnSuccess } from "../middlewares/cache.js";

import {
    uploadImages,
    createSpace,
    getSpaces,
    deleteSpace,
    removeImage,
    updateSpace,
    reorderSpaces
} from "../controllers/styleYourSpace.controller.js";

const styleSpaceRouter = Router();
const styleSpaceCache = cacheResponse("homeSections", Number(process.env.HOME_SECTION_CACHE_TTL_SECONDS) || 180);
const invalidateStyleSpaceCache = invalidateCacheOnSuccess(["homeSections"]);

// Upload Image
styleSpaceRouter.post('/uploadImages', auth, upload.array('images'), uploadImages);

// Create Style Your Space Item
styleSpaceRouter.post('/create', auth, invalidateStyleSpaceCache, createSpace);

// Get All Items
styleSpaceRouter.get('/getAll', styleSpaceCache, getSpaces);

// Delete image from Cloudinary
styleSpaceRouter.delete('/deleteImg', auth, invalidateStyleSpaceCache, removeImage);

// Delete Style Your Space Item
styleSpaceRouter.delete('/:id', auth, invalidateStyleSpaceCache, deleteSpace);

// Update Item
styleSpaceRouter.put('/:id', auth, invalidateStyleSpaceCache, updateSpace);

// POST reorder
styleSpaceRouter.post("/reorder", auth, invalidateStyleSpaceCache, reorderSpaces);



export default styleSpaceRouter;
