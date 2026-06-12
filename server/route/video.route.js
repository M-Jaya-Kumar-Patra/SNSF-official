import { Router } from "express";
import videoUpload from "../middlewares/videoMulter.js"; // <--- Import the new middleware
import { cacheResponse, invalidateCacheOnSuccess } from "../middlewares/cache.js";
import {
    uploadVideoFile,
    createVideo,
    getAllVideos,
    getVideoById,
    deleteVideo
} from "../controllers/video.controller.js";

const videoRouter = Router();
const videoCache = cacheResponse("videos", Number(process.env.VIDEO_CACHE_TTL_SECONDS) || 120);
const invalidateVideoCache = invalidateCacheOnSuccess(["videos", "homeSections"]);

// Upload Video File (Returns URL) - Limit 1 video per upload
videoRouter.post('/upload', videoUpload.single('video'), uploadVideoFile);
// Create Video DB Entry (Takes URL and Title)
videoRouter.post('/create', invalidateVideoCache, createVideo);

// Get All Videos (Public)
videoRouter.get('/getAll', videoCache, getAllVideos);

// Get Single Video (Public)
videoRouter.get('/:id', videoCache, getVideoById);

// Delete Video 
videoRouter.delete('/:id', invalidateVideoCache, deleteVideo);

export default videoRouter;
