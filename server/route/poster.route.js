import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

import {
    uploadImages,
    createPoster, getPosters, deletePoster, removeImage, updatePoster, reorderPoster} from "../controllers/poster.controller.js";

const posterRouter = Router();

// Upload Image
posterRouter.post('/uploadImages', auth, upload.array('images'), uploadImages);

// Create Style Your Space Item
posterRouter.post('/create', auth, createPoster);

// Get All Items
posterRouter.get('/getAll', getPosters);

// Delete image from Cloudinary
posterRouter.delete('/deleteImg', removeImage);

// Delete Style Your Space Item
posterRouter.delete('/:id', deletePoster);

// Update Item
posterRouter.put('/:id', auth, updatePoster);

// POST reorder
posterRouter.post("/reorder", reorderPoster);



export default posterRouter;
