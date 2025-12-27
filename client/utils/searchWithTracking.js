import { searchAPI } from "@/utils/api";
import { trackVisitor } from "@/lib/tracking";

export const searchWithTracking = async (query, source = "unknown") => {
  if (!query?.trim()) return { products: [] };

  const res = await searchAPI(
    `/api/product/search/get?q=${encodeURIComponent(query)}`,
    false
  );
  if (!res?.error) {
    trackVisitor("search", { query, source });
  }
  return res;
};
