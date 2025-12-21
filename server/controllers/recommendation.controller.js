import ProductEventModel from "../models/productEvent.model.js";
import ProductModel from "../models/product.model.js";
import UserModel from "../models/user.model.js";
import sendEmailFun from "../config/sendEmail.js";
import recommendedProductsTemplate from "../utils/EmailTemplates/recommendedProductsEmail.js";
import { shouldSendRecommendationEmail } from "../utils/shouldSendRecommendationEmail.js";

// -----------------------------
// Get recommended products for a visitor or logged-in user
// -----------------------------
export const getRecommendedProducts = async (req, res) => {
  try {
    const { visitorId, sessionId, userId, limit = 10, sendEmail = false } = req.query;

    const allowEmail = sendEmail === "true";

    console.log("🔥 getRecommendedProducts HIT", {
      userId,
      visitorId,
      sessionId,
    });

    if (!visitorId && !sessionId && !userId) {
      return res
        .status(400)
        .json({
          success: false,
          message: "visitorId, sessionId, or userId required",
        });
    }

    // -----------------------------
    // Step 1: Fetch recent product events (view/add_to_cart/wishlist)
    // -----------------------------
    const eventFilter = {};

    if (userId) {
      eventFilter.userId = userId; // ✅ logged-in user
    } else {
      if (visitorId) eventFilter.visitorId = visitorId;
      if (sessionId) eventFilter.sessionId = sessionId;
    }

    const recentEvents = await ProductEventModel.find(eventFilter)
      .sort({ createdAt: -1 })
      .limit(20)
      .select("productId -_id");

    const viewedProductIds = [
      ...new Set(recentEvents.map((e) => e.productId.toString())),
    ];

    // -----------------------------
    // Step 2: Include wishlist items if user is logged in
    // -----------------------------
    let wishlistProductIds = [];
    if (userId) {
      const user = await UserModel.findById(userId).select("wishlist");
      if (user?.wishlist?.length) {
        wishlistProductIds = user.wishlist.map((p) => p.toString());
      }
    }

    // Combine viewed products + wishlist
    const combinedProductIds = [
      ...new Set([...viewedProductIds, ...wishlistProductIds]),
    ];

    // -----------------------------
    // Step 3: Fetch details of combined products
    // -----------------------------
    const combinedProducts = await ProductModel.find({
      _id: { $in: combinedProductIds },
    });

    // Extract unique categories & brands
    const categories = [
      ...new Set(combinedProducts.map((p) => p.catId).filter(Boolean)),
    ];
    const brands = [
      ...new Set(combinedProducts.map((p) => p.brand).filter(Boolean)),
    ];

    const orConditions = [];
    if (categories.length > 0)
      orConditions.push({ catId: { $in: categories } });
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
    const emailRecommendations = recommendations;

    // UI fallback only
    const uiRecommendations =
      recommendations.length > 0
        ? recommendations
        : await ProductModel.find().limit(limit);

    const MIN_VIEWS = 3;
    const MIN_WISHLIST_OR_VIEWS = 4;

    const totalSignals = viewedProductIds.length + wishlistProductIds.length;

    if (totalSignals < MIN_WISHLIST_OR_VIEWS) {
      return res.status(200).json({
        success: true,
        data: recommendations,
        emailSkipped: "Not enough user activ~ity",
      });
    }

    const recommendationSignature = [...categories, ...brands]
      .filter(Boolean)
      .sort()
      .join("|");

    // -----------------------------
// Step 5: Send recommendation email (logged-in users only)
// -----------------------------
if ( allowEmail && userId && emailRecommendations.length > 0) {
  const user = await UserModel.findById(userId).select(
    "email name lastRecommendationEmailAt lastRecommendationSignature"
  );

  if (!user) {
    return res.status(200).json({ success: true, data: recommendations });
  }

  // ❌ Same intent + cooldown not passed → skip email
  if (
    user.lastRecommendationSignature === recommendationSignature &&
    !shouldSendRecommendationEmail(user.lastRecommendationEmailAt)
  ) {
    console.log("⏭ Skipping email — same intent & cooldown active");
  } else {
    console.log("📧 Sending recommendation email", {
      viewed: viewedProductIds.length,
      wishlist: wishlistProductIds.length,
      recommendations: emailRecommendations.length,
    });

    // await sendEmailFun(
    //   user.email,
    //   "Your recent activity on S N Steel Fabrication",
    //   undefined,
    //   recommendedProductsTemplate(user.name, emailRecommendations)
    // );

    // ✅ Update tracking fields
    await UserModel.findByIdAndUpdate(userId, {
      lastRecommendationEmailAt: new Date(),
      lastRecommendationSignature: recommendationSignature,
    });
  }
}

    return res.status(200).json({
      success: true,
      data: uiRecommendations,
    });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
