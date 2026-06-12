import {
  buildCacheKey,
  getCache,
  invalidateCacheNamespaces,
  setCache,
} from "../lib/cache.js";

export function cacheResponse(namespace, ttlSeconds = 60) {
  return async (req, res, next) => {
    if (req.method !== "GET") return next();

    const key = buildCacheKey(namespace, req.originalUrl);

    try {
      const cached = await getCache(key);
      if (cached) {
        res.set("X-Cache", "HIT");
        return res.status(cached.statusCode || 200).json(cached.body);
      }
    } catch (error) {
      console.warn("Cache read skipped:", error.message);
    }

    const originalJson = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        setCache(key, { statusCode: res.statusCode, body }, ttlSeconds).catch(
          (error) => console.warn("Cache write skipped:", error.message)
        );
      }

      res.set("X-Cache", "MISS");
      return originalJson(body);
    };

    return next();
  };
}

export function invalidateCacheOnSuccess(namespaces = []) {
  return (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = (body) => {
      const shouldInvalidate =
        res.statusCode >= 200 &&
        res.statusCode < 400 &&
        body?.success !== false &&
        body?.error !== true;

      if (shouldInvalidate) {
        invalidateCacheNamespaces(namespaces).catch((error) =>
          console.warn("Cache invalidation skipped:", error.message)
        );
      }

      return originalJson(body);
    };

    return next();
  };
}
