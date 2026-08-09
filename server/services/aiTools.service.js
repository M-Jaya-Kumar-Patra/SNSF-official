import mongoose from "mongoose";
import {
  createProductEnquiry as createEnquiryRecord,
  findSimilarProducts,
  getProductDetails,
  getRecentViewedRecommendations,
  getWishlistRecommendations,
  searchProducts,
} from "./aiProductTools.service.js";
import { searchKnowledgeBase as retrieveKnowledge } from "./knowledge.service.js";

function requireUser(userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) throw new Error("Authenticated user is required");
  return userId;
}

function requireProductId(productId) {
  if (!mongoose.Types.ObjectId.isValid(productId)) throw new Error("Valid product id is required");
  return productId;
}

export async function searchProductsTool({ userId, query, limit = 6 }) {
  requireUser(userId);
  const cleanQuery = String(query || "").trim().slice(0, 300);
  if (!cleanQuery) return { intent: { filters: {}, keywords: [] }, products: [] };
  return searchProducts({ query: cleanQuery, limit });
}

export async function getProductDetailsTool({ userId, productId }) {
  requireUser(userId);
  return getProductDetails(requireProductId(productId));
}

export async function findSimilarProductsTool({ userId, productId, limit = 5 }) {
  requireUser(userId);
  return findSimilarProducts(requireProductId(productId), limit);
}

export async function compareProductsTool({ userId, productIds }) {
  requireUser(userId);
  const ids = [...new Set((Array.isArray(productIds) ? productIds : []).map(String))]
    .filter((id) => mongoose.Types.ObjectId.isValid(id))
    .slice(0, 4);
  if (ids.length < 2) return { products: [], fields: {} };

  const products = (await Promise.all(ids.map((productId) => getProductDetails(productId)))).filter(Boolean);
  const fields = ["material", "grade", "fabric", "fabricColor", "size", "capacity", "width", "depth", "length", "height", "warranty", "polish", "frameMaterial"];
  const comparison = Object.fromEntries(
    fields.map((field) => [field, products.map((product) => product.specifications?.[field] || "Not specified")])
  );

  return { products, fields: comparison };
}

export async function getUserWishlistTool({ userId, limit = 5 }) {
  requireUser(userId);
  return getWishlistRecommendations(userId, limit);
}

export async function getRecommendationsTool({ userId, limit = 4 }) {
  requireUser(userId);
  return getRecentViewedRecommendations(userId, limit);
}

export async function searchKnowledgeBaseTool({ userId, query, limit = 5 }) {
  requireUser(userId);
  return retrieveKnowledge({ query: String(query || "").trim().slice(0, 300), limit });
}

export async function createProductEnquiryTool({ userId, productId, user, conversationId, userMessage }) {
  requireUser(userId);
  return createEnquiryRecord({
    userId,
    productId: requireProductId(productId),
    user,
    conversationId,
    userMessage: String(userMessage || "").trim().slice(0, 2_000),
  });
}

export function requestHumanSupportTool({ userId }) {
  requireUser(userId);
  return { humanHandoff: true, status: "WAITING_FOR_ADMIN" };
}
