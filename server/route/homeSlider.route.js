    import { Router } from "express";
    import auth from "../middlewares/auth.js";
    import upload from "../middlewares/multer.js";
    import {uploadImages, getAllSlides, deleteSlide, removeImageFromCloudinary, createSlide} from "../controllers/homeSlider.controller.js";
    import { cacheResponse, invalidateCacheOnSuccess } from "../middlewares/cache.js";

    const sliderRouter = Router();
    const sliderCache = cacheResponse("homeSections", Number(process.env.HOME_SECTION_CACHE_TTL_SECONDS) || 180);
    const invalidateSliderCache = invalidateCacheOnSuccess(["homeSections"]);

    sliderRouter.post('/uploadImages', auth, upload.array('images'), uploadImages)
    sliderRouter.post('/create', auth, invalidateSliderCache, createSlide)
    sliderRouter.get('/getAllSlides', sliderCache, getAllSlides)
    sliderRouter.delete('/deleteImg', auth, invalidateSliderCache, removeImageFromCloudinary)
    sliderRouter.delete('/:id', auth, invalidateSliderCache, deleteSlide)

    export default sliderRouter
