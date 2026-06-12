import multer from "multer";

const storage = multer.memoryStorage();
const maxVideoSizeMb = Number(process.env.VIDEO_UPLOAD_MAX_FILE_SIZE_MB) || 50;

const videoUpload = multer({
  storage,
  limits: {
    fileSize: maxVideoSizeMb * 1024 * 1024,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype?.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed!"), false);
    }
  },
});

export default videoUpload;
