import mongoose from "mongoose";

const videoSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    sourceType: {
        type: String,
        enum: ['upload', 'youtube'],
        default: 'upload',
        required: true
    },
    videoUrl: {
        type: String, 
        required: true,
    },
    thumbnail: {
        type: String, 
        // For YouTube, we can auto-fetch the thumbnail URL, for Upload we use Cloudinary's
    },
    publicId: {
        type: String, // Only for Cloudinary uploads
    },
    description: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const VideoModel = mongoose.model("Video", videoSchema);
export default VideoModel;