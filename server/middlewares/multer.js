import crypto from "crypto";
import fs from "fs";
import multer from "multer";
import path from "path";

const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_TMP_DIR || "uploads");
const maxFileSizeMb = Number(process.env.UPLOAD_MAX_FILE_SIZE_MB) || 5;
const maxFiles = Number(process.env.UPLOAD_MAX_FILES) || 10;

const allowedMimeTypes = new Set(
  (process.env.UPLOAD_ALLOWED_MIME_TYPES ||
    "image/jpeg,image/jpg,image/png,image/webp,image/gif")
    .split(",")
    .map((type) => type.trim().toLowerCase())
    .filter(Boolean)
);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Created uploads folder");
}

function sanitizeName(name = "upload") {
  const ext = path.extname(name).toLowerCase();
  const base = path
    .basename(name, ext)
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);

  return `${Date.now()}-${crypto.randomUUID()}-${base || "file"}${ext}`;
}

function cleanupFiles(req) {
  const files = [
    ...(Array.isArray(req.files) ? req.files : []),
    ...(!Array.isArray(req.files)
      ? Object.values(req.files || {})
          .flat()
          .filter(Boolean)
      : []),
    req.file,
  ].filter(Boolean);

  for (const file of files) {
    if (!file.path) continue;

    const fullPath = path.resolve(file.path);
    const relativePath = path.relative(uploadDir, fullPath);
    if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) continue;

    try {
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    } catch (error) {
      console.warn("Upload cleanup skipped:", error.message);
    }
  }
}

function wrapUpload(middleware) {
  return (req, res, next) => {
    res.on("finish", () => cleanupFiles(req));
    middleware(req, res, next);
  };
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, sanitizeName(file.originalname)),
});

const uploader = multer({
  storage,
  limits: {
    fileSize: maxFileSizeMb * 1024 * 1024,
    files: maxFiles,
  },
  fileFilter: (req, file, cb) => {
    const mimeType = file.mimetype?.toLowerCase();
    if (allowedMimeTypes.has(mimeType)) return cb(null, true);

    return cb(
      new Error(
        `Unsupported file type: ${file.mimetype}. Allowed types: ${[
          ...allowedMimeTypes,
        ].join(", ")}`
      )
    );
  },
});

const upload = {
  single: (...args) => wrapUpload(uploader.single(...args)),
  array: (...args) => wrapUpload(uploader.array(...args)),
  fields: (...args) => wrapUpload(uploader.fields(...args)),
  none: (...args) => wrapUpload(uploader.none(...args)),
};

export default upload;
