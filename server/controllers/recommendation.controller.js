import ProductEventModel from "../models/productEvent.model.js";
import ProductModel from "../models/product.model.js";
import UserModel from "../models/user.model.js";

// -----------------------------
// Get recommended products for a visitor or logged-in user
// -----------------------------
export const getRecommendedProducts = async (req, res) => {
  try {
    const { visitorId, sessionId, userId, limit = 10 } = req.query;

    if (!visitorId && !sessionId && !userId) {
      return res.status(400).json({ success: false, message: "visitorId, sessionId, or userId required" });
    }

    // -----------------------------
    // Step 1: Fetch recent product events (view/add_to_cart/wishlist)
    // -----------------------------
    const eventFilter = {};
    if (visitorId) eventFilter.visitorId = visitorId;
    if (sessionId) eventFilter.sessionId = sessionId;

    const recentEvents = await ProductEventModel.find(eventFilter)
      .sort({ createdAt: -1 })
      .limit(20)
      .select("productId -_id");

    const viewedProductIds = [...new Set(recentEvents.map(e => e.productId.toString()))];

    // -----------------------------
    // Step 2: Include wishlist items if user is logged in
    // -----------------------------
    let wishlistProductIds = [];
    if (userId) {
      const user = await UserModel.findById(userId).select("wishlist");
      if (user?.wishlist?.length) {
        wishlistProductIds = user.wishlist.map(p => p.toString());
      }
    }

    // Combine viewed products + wishlist
    const combinedProductIds = [...new Set([...viewedProductIds, ...wishlistProductIds])];

    // -----------------------------
    // Step 3: Fetch details of combined products
    // -----------------------------
    const combinedProducts = await ProductModel.find({ _id: { $in: combinedProductIds } });

    // Extract unique categories & brands
    const categories = [...new Set(combinedProducts.map(p => p.catId).filter(Boolean))];
    const brands = [...new Set(combinedProducts.map(p => p.brand).filter(Boolean))];

    const orConditions = [];
    if (categories.length > 0) orConditions.push({ catId: { $in: categories } });
    if (brands.length > 0) orConditions.push({ brand: { $in: brands } });

    // -----------------------------
    // Step 4: Get recommendations based on category/brand
    // -----------------------------
    let recommendations = [];
    if (orConditions.length > 0) {
      recommendations = await ProductModel.find({
        _id: { $nin: combinedProductIds }, // exclude already interacted products
        $or: orConditions,
      }).limit(parseInt(limit));
    }

    // Fallback if empty
    if (recommendations.length === 0) {
      recommendations = await ProductModel.find().limit(parseInt(limit));
    }

    return res.status(200).json({ success: true, data: recommendations });

  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
