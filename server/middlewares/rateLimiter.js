const buckets = new Map();

export function rateLimiter({
  windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000,
  max = Number(process.env.RATE_LIMIT_MAX) || 300,
} = {}) {
  return (req, res, next) => {
    if (process.env.RATE_LIMIT_ENABLED === "false") return next();

    const key =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.ip ||
      req.socket?.remoteAddress ||
      "unknown";

    const timestamp = Date.now();
    const existing = buckets.get(key);
    const bucket =
      existing && existing.resetAt > timestamp
        ? existing
        : { count: 0, resetAt: timestamp + windowMs };

    bucket.count += 1;
    buckets.set(key, bucket);

    res.set("X-RateLimit-Limit", String(max));
    res.set("X-RateLimit-Remaining", String(Math.max(max - bucket.count, 0)));
    res.set("X-RateLimit-Reset", String(Math.ceil(bucket.resetAt / 1000)));

    if (bucket.count > max) {
      return res.status(429).json({
        success: false,
        error: true,
        message: "Too many requests. Please try again shortly.",
      });
    }

    if (buckets.size > 10_000) {
      for (const [bucketKey, value] of buckets.entries()) {
        if (value.resetAt <= timestamp) buckets.delete(bucketKey);
      }
    }

    return next();
  };
}
