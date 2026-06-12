import Redis from "ioredis";

const CACHE_PREFIX = process.env.CACHE_PREFIX || "snsf";
const CACHE_ENABLED = process.env.CACHE_ENABLED !== "false";
const memoryCache = new Map();

let redisClient = null;
let redisDisabledUntil = 0;

const now = () => Date.now();

async function getRedisClient() {
  if (!CACHE_ENABLED || !process.env.REDIS_URL) return null;
  if (redisDisabledUntil > now()) return null;

  try {
    if (!redisClient) {
      redisClient = new Redis(process.env.REDIS_URL, {
        enableOfflineQueue: false,
        lazyConnect: true,
        maxRetriesPerRequest: 1,
      });

      redisClient.on("error", (error) => {
        console.warn("Redis cache error:", error.message);
        redisDisabledUntil = now() + 30_000;
      });
    }

    if (redisClient.status === "wait") {
      await redisClient.connect();
    }

    return redisClient.status === "ready" ? redisClient : null;
  } catch (error) {
    console.warn("Redis cache unavailable, using memory cache:", error.message);
    redisDisabledUntil = now() + 30_000;
    return null;
  }
}

export function buildCacheKey(namespace, rawKey) {
  return `${CACHE_PREFIX}:cache:${namespace}:${rawKey}`;
}

export async function getCache(key) {
  if (!CACHE_ENABLED) return null;

  const redis = await getRedisClient();
  if (redis) {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= now()) {
    memoryCache.delete(key);
    return null;
  }

  return entry.value;
}

export async function setCache(key, value, ttlSeconds = 60) {
  if (!CACHE_ENABLED || ttlSeconds <= 0) return;

  const redis = await getRedisClient();
  if (redis) {
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
    return;
  }

  memoryCache.set(key, {
    value,
    expiresAt: now() + ttlSeconds * 1000,
  });
}

export async function deleteCachePattern(pattern) {
  const redis = await getRedisClient();
  if (redis) {
    let cursor = "0";
    do {
      const [nextCursor, keys] = await redis.scan(
        cursor,
        "MATCH",
        pattern,
        "COUNT",
        100
      );
      cursor = nextCursor;
      if (keys.length) await redis.del(keys);
    } while (cursor !== "0");
    return;
  }

  for (const key of memoryCache.keys()) {
    if (matchesPattern(key, pattern)) memoryCache.delete(key);
  }
}

export async function invalidateCacheNamespaces(namespaces = []) {
  await Promise.all(
    namespaces.map((namespace) =>
      deleteCachePattern(`${CACHE_PREFIX}:cache:${namespace}:*`)
    )
  );
}

function matchesPattern(key, pattern) {
  const escaped = pattern
    .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\*/g, ".*");
  return new RegExp(`^${escaped}$`).test(key);
}
