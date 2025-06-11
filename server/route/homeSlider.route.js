    import { Router } from "express";
    import auth from "../middlewares/auth.js";
    import upload from "../middlewares/multer.js";
    import {uploadImages, getAllSlides, deleteSlide, removeImageFromCloudinary, createSlide} from "../controllers/homeSlider.controller.js";

    const sliderRouter = Router();

    sliderRouter.post('/uploadImages', auth, upload.array('images'), uploadImages)
    sliderRouter.post('/create', auth, createSlide)
    sliderRouter.get('/getAllSlides',getAllSlides)
    sliderRouter.delete('/deleteImg', removeImageFromCloudinary)
    sliderRouter.delete('/:id', deleteSlide)

    export default sliderRouter