import { searchAPI } from "@/utils/api";
import { trackVisitor } from "@/lib/tracking";

export const searchWithTracking = async (query, source = "unknown") => {
  if (!query?.trim()) return { products: [] };

  // 🔍 track search ONCE
  trackVisitor("search", {
    query,
    source, // "desktop" | "mobile"
  });

  // 🔎 fetch results
  return await searchAPI(
    `/api/product/search/get?q=${encodeURIComponent(query)}`,
    false
  );
};
