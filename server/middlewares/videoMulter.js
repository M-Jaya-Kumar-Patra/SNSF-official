import crypto from "crypto";
import fs from "fs";
import multer from "multer";
import path from "path";

const uploadDir = path.resolve(
  process.cwd(),
  process.env.VIDEO_UPLOAD_TMP_DIR || "uploads/videos"
);
const maxVideoSizeMb = Number(process.env.VIDEO_UPLOAD_MAX_FILE_SIZE_MB) || 50;

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

function sanitizeName(name = "video") {
  const ext = path.extname(name).toLowerCase();
  const base = path
    .basename(name, ext)
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);

  return `${Date.now()}-${crypto.randomUUID()}-${base || "video"}${ext}`;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, sanitizeName(file.originalname)),
});

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
