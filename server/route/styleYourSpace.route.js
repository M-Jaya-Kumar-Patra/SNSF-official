import { Router } from "express";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

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

// Upload Image
styleSpaceRouter.post('/uploadImages', auth, upload.array('images'), uploadImages);

// Create Style Your Space Item
styleSpaceRouter.post('/create', auth, createSpace);

// Get All Items
styleSpaceRouter.get('/getAll', getSpaces);

// Delete image from Cloudinary
styleSpaceRouter.delete('/deleteImg', removeImage);

// Delete Style Your Space Item
styleSpaceRouter.delete('/:id', deleteSpace);

// Update Item
styleSpaceRouter.put('/:id', auth, updateSpace);

// POST reorder
styleSpaceRouter.post("/reorder", reorderSpaces);



export default styleSpaceRouter;
