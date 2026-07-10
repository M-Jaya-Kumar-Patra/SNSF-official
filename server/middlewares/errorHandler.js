export function errorHandler(err, req, res, next) {
  if (!err) return next();

  const isUploadError =
    err.name === "MulterError" ||
    err.message?.startsWith("Unsupported file type") ||
    err.message === "Only video files are allowed!";

  if (isUploadError) {
    const statusCode = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    return res.status(statusCode).json({
      success: false,
      error: true,
      message: err.message,
    });
  }

  const statusCode = err.statusCode || err.status || 500;

  if (statusCode >= 500) {
    console.error("Unhandled request error:", err);
  }

  return res.status(statusCode).json({
    success: false,
    error: true,
    message: statusCode >= 500 ? "Internal server error" : err.message,
  });
}
