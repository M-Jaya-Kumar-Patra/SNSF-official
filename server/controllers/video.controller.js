import VideoModel from "../models/video.model.js";
import cloudinary from "cloudinary";

// Ensure Cloudinary config is present...

// ... uploadVideoFile remains the same ...

// ... getAllVideos, deleteVideo, etc. remain the sa
// Configure cloudinary if not already done globally
const configureCloudinary = () => {
    if (!process.env.cloudinary_Config_Cloud_Name || !process.env.cloudinary_Config_API_Key || !process.env.cloudinary_Config_API_Secret) {
        throw new Error("Cloudinary configuration missing. Check .env file.");
    }
    cloudinary.v2.config({
        cloud_name: process.env.cloudinary_Config_Cloud_Name,
        api_key: process.env.cloudinary_Config_API_Key,
        api_secret: process.env.cloudinary_Config_API_Secret,
    });
};


/**
 * Create Video Entry (Handles BOTH Uploads and YouTube)
 */
export const createVideo = async (req, res) => {
    try {
        const { title, sourceType, videoUrl, thumbnail, publicId, description, isActive } = req.body;

        if (!title || !videoUrl) {
            return res.status(400).json({ success: false, message: "Title and Video URL are required" });
        }

        // Logic to extract YouTube Thumbnail if not provided
        let finalThumbnail = thumbnail;
        if (sourceType === 'youtube' && !thumbnail) {
            // simple regex to get ID if videoUrl is just the ID or full URL
            // Assuming frontend sends clean ID or we extract it here. 
            // For simplicity, let's assume frontend sends the Full URL and we grab ID here or frontend sends ID.
            // Let's rely on frontend sending a valid thumbnail URL for YouTube to keep backend simple.
            finalThumbnail = "https://img.youtube.com/vi/" + videoUrl + "/hqdefault.jpg"; 
        }

        const newVideo = new VideoModel({
            title,
            sourceType,
            videoUrl,
            thumbnail: finalThumbnail,
            publicId,
            description,
            isActive
        });

        await newVideo.save();

        return res.status(201).json({ success: true, message: "Video added successfully", data: newVideo });

    } catch (error) {
        console.error("createVideo error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};



/**
 * Upload Video to Cloudinary
 * Returns the secure_url and public_id
 */
// ... imports ...

export const uploadVideoFile = async (req, res) => {
    try {
        configureCloudinary();


        if (!req.file) {
            return res.status(400).json({ success: false, message: "No video file provided" });
        }

        // Safety Check: Ensure buffer exists
        if (!req.file.buffer) {
            return res.status(500).json({ success: false, message: "Server misconfiguration: File buffer missing" });
        }

        console.log(`📤 Uploading ${req.file.size} bytes to Cloudinary...`);

        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.v2.uploader.upload_stream(
                {
                    resource_type: "video",
                    folder: "snsf_videos",
                    chunk_size: 6000000, 
                    timeout: 120000 // Increase timeout to 2 minutes
                },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary Error:", error);
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
            // This is the critical part that was failing
            uploadStream.end(req.file.buffer); 
        });

        console.log("✅ Upload successful:", result.public_id);

        return res.status(200).json({
            success: true,
            message: "Video uploaded",
            url: result.secure_url,
            publicId: result.public_id,
            thumbnail: result.secure_url.replace(/\.[^/.]+$/, ".jpg")
        });

    } catch (error) {
        console.error("uploadVideoFile error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ... other controllers ...



/**
 * Get All Videos
 */
export const getAllVideos = async (req, res) => {
    try {
        // Sort by newest first
        const videos = await VideoModel.find({ isActive: true }).sort({ createdAt: -1 });
        
        return res.status(200).json({
            success: true,
            data: videos,
        });
    } catch (error) {
        console.error("getAllVideos error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Get Single Video by ID
 */
export const getVideoById = async (req, res) => {
    try {
        const { id } = req.params;
        const video = await VideoModel.findById(id);

        if (!video) {
            return res.status(404).json({
                success: false,
                message: "Video not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: video,
        });
    } catch (error) {
        console.error("getVideoById error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/**
 * Delete Video
 */
export const deleteVideo = async (req, res) => {
    try {
        const { id } = req.params;

        const video = await VideoModel.findById(id);

        if (!video) {
            return res.status(404).json({ success: false, message: "Video not found" });
        }

        // Optional: Delete from Cloudinary if publicId exists
        if (video.publicId) {
            await cloudinary.v2.uploader.destroy(video.publicId, { resource_type: "video" });
        }

        await VideoModel.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Video deleted successfully",
        });

    } catch (error) {
        console.error("deleteVideo error:", error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};