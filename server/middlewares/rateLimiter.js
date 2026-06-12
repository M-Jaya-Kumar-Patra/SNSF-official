import Redis from "ioredis";

const buckets = new Map();
const RATE_LIMIT_PREFIX = process.env.RATE_LIMIT_PREFIX || "snsf";

let redisClient = null;
let redisDisabledUntil = 0;

const now = () => Date.now();

async function getRedisClient() {
  if (!process.env.REDIS_URL || redisDisabledUntil > now()) return null;

  try {
    if (redisClient && ["close", "end"].includes(redisClient.status)) {
      redisClient.disconnect();
      redisClient = null;
    }

    if (!redisClient) {
      redisClient = new Redis(process.env.REDIS_URL, {
        enableOfflineQueue: false,
        lazyConnect: true,
        maxRetriesPerRequest: 1,
      });

      redisClient.on("error", (error) => {
        console.warn("Redis rate limiter error:", error.message);
        redisDisabledUntil = now() + 30_000;
      });
    }

    if (redisClient.status === "wait") {
      await redisClient.connect();
    }

    return redisClient.status === "ready" ? redisClient : null;
  } catch (error) {
    console.warn("Redis rate limiter unavailable:", error.message);
    redisDisabledUntil = now() + 30_000;
    return null;
  }
}

function getClientKey(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.ip ||
    req.socket?.remoteAddress ||
    "unknown"
  );
}

function incrementMemoryBucket(key, windowMs) {
  const timestamp = now();
  const existing = buckets.get(key);
  const bucket =
    existing && existing.resetAt > timestamp
      ? existing
      : { count: 0, resetAt: timestamp + windowMs };

  bucket.count += 1;
  buckets.set(key, bucket);

  if (buckets.size > 10_000) {
    for (const [bucketKey, value] of buckets.entries()) {
      if (value.resetAt <= timestamp) buckets.delete(bucketKey);
    }
  }

  return bucket;
}

async function incrementRedisBucket(key, windowMs) {
  const redis = await getRedisClient();
  if (!redis) return null;

  const redisKey = `${RATE_LIMIT_PREFIX}:rate:${key}`;
  const count = await redis.incr(redisKey);
  let ttl = await redis.pttl(redisKey);

  if (count === 1 || ttl < 0) {
    await redis.pexpire(redisKey, windowMs);
    ttl = windowMs;
  }

  return {
    count,
    resetAt: now() + ttl,
  };
}

export function rateLimiter({
  windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000,
  max = Number(process.env.RATE_LIMIT_MAX) || 300,
} = {}) {
  return async (req, res, next) => {
    if (process.env.RATE_LIMIT_ENABLED === "false") return next();

    const key = getClientKey(req);
    let bucket;

    try {
      bucket =
        (await incrementRedisBucket(key, windowMs)) ||
        incrementMemoryBucket(key, windowMs);
    } catch (error) {
      console.warn("Rate limiter fallback used:", error.message);
      bucket = incrementMemoryBucket(key, windowMs);
    }

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

    return next();
  };
}
