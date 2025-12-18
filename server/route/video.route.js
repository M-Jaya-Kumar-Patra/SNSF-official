import { Router } from "express";
import auth from "../middlewares/auth.js";
import videoUpload from "../middlewares/videoMulter.js"; // <--- Import the new middleware
import {
    uploadVideoFile,
    createVideo,
    getAllVideos,
    getVideoById,
    deleteVideo
} from "../controllers/video.controller.js";

const videoRouter = Router();

// Upload Video File (Returns URL) - Limit 1 video per upload
videoRouter.post('/upload', videoUpload.single('video'), uploadVideoFile);
// Create Video DB Entry (Takes URL and Title)
videoRouter.post('/create', createVideo);

// Get All Videos (Public)
videoRouter.get('/getAll', getAllVideos);

// Get Single Video (Public)
videoRouter.get('/:id', getVideoById);

// Delete Video 
videoRouter.delete('/:id', deleteVideo);

export default videoRouter;