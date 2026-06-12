import fs from "fs/promises";
import cloudinary from "cloudinary";
import VideoModel from "../models/video.model.js";

const configureCloudinary = () => {
  const cloudName =
    process.env.cloudinary_Config_Cloud_Name ||
    process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey =
    process.env.cloudinary_Config_API_Key || process.env.CLOUDINARY_API_KEY;
  const apiSecret =
    process.env.cloudinary_Config_API_Secret ||
    process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary configuration missing. Check .env file.");
  }

  cloudinary.v2.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
};

export const createVideo = async (req, res) => {
  try {
    const {
      title,
      sourceType,
      videoUrl,
      thumbnail,
      publicId,
      description,
      isActive,
    } = req.body;

    if (!title || !videoUrl) {
      return res
        .status(400)
        .json({ success: false, message: "Title and Video URL are required" });
    }

    const finalThumbnail =
      sourceType === "youtube" && !thumbnail
        ? `https://img.youtube.com/vi/${videoUrl}/hqdefault.jpg`
        : thumbnail;

    const newVideo = await VideoModel.create({
      title,
      sourceType,
      videoUrl,
      thumbnail: finalThumbnail,
      publicId,
      description,
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: "Video added successfully",
      data: newVideo,
    });
  } catch (error) {
    console.error("createVideo error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadVideoFile = async (req, res) => {
  let tempFilePath;

  try {
    configureCloudinary();

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No video file provided" });
    }

    tempFilePath = req.file.path;
    if (!tempFilePath) {
      return res.status(500).json({
        success: false,
        message: "Server misconfiguration: File path missing",
      });
    }

    const result = await cloudinary.v2.uploader.upload_large(tempFilePath, {
      resource_type: "video",
      folder: "snsf_videos",
      chunk_size: 6_000_000,
      timeout: 120_000,
    });

    return res.status(200).json({
      success: true,
      message: "Video uploaded",
      url: result.secure_url,
      publicId: result.public_id,
      thumbnail: result.secure_url.replace(/\.[^/.]+$/, ".jpg"),
    });
  } catch (error) {
    console.error("uploadVideoFile error:", error);
    return res.status(500).json({ success: false, message: error.message });
  } finally {
    if (tempFilePath) {
      await fs.unlink(tempFilePath).catch((error) => {
        console.warn("Video temp cleanup skipped:", error.message);
      });
    }
  }
};

export const getAllVideos = async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(50, Number(req.query.limit) || 20));
    const videos = await VideoModel.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

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

export const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await VideoModel.findById(id).lean();

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

export const deleteVideo = async (req, res) => {
  try {
    configureCloudinary();

    const { id } = req.params;
    const video = await VideoModel.findById(id).select("publicId").lean();

    if (!video) {
      return res
        .status(404)
        .json({ success: false, message: "Video not found" });
    }

    if (video.publicId) {
      await cloudinary.v2.uploader.destroy(video.publicId, {
        resource_type: "video",
      });
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
