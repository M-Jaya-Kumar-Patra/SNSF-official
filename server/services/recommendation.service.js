import ProductEventModel from "../models/productEvent.model.js";
import ProductModel from "../models/product.model.js";

export async function getUserRecommendations(userId, limit = 6) {
  // 1️⃣ Get recent product interactions
  const events = await ProductEventModel.find({ userId })
    .sort({ createdAt: -1 })
    .limit(20)
    .select("productId");

  const productIds = [...new Set(events.map(e => e.productId.toString()))];

  if (productIds.length === 0) return [];

  // 2️⃣ Fetch products
  const products = await ProductModel.find({ _id: { $in: productIds } });

  const categories = [...new Set(products.map(p => p.catId).filter(Boolean))];
  const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];

  // 3️⃣ Recommend similar products
  const recommendations = await ProductModel.find({
    _id: { $nin: productIds },
    $or: [
      { catId: { $in: categories } },
      { brand: { $in: brands } },
    ],
  }).limit(limit);

  return {
    recommendations,
    signature: [...categories, ...brands].sort().join("|"),
  };
}
