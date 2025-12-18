import multer from "multer";

// Use MemoryStorage so the file is stored in RAM as a Buffer
const storage = multer.memoryStorage();

const videoUpload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // Limit to 50MB (Adjust if needed)
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed!"), false);
    }
  },
});

export default videoUpload;