import ProductEventModel from "../models/productEvent.model.js";
import ProductModel from "../models/product.model.js";
import UserModel from "../models/user.model.js";
import sendEmailFun from "../config/sendEmail.js";
import recommendedProductsTemplate from "../utils/EmailTemplates/recommendedProductsEmail.js";
import { shouldSendRecommendationEmail } from "../utils/shouldSendRecommendationEmail.js";
import { PUBLIC_PRODUCT_SELECT, sanitizePublicProducts } from "../utils/publicProduct.js";
import { retrieveRagContext } from "../services/rag.service.js";

function shuffleProducts(products = []) {
  return products
    .map((product) => ({ product, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ product }) => product);
}

function mergeUniqueProducts(...groups) {
  const seen = new Set();
  const merged = [];

  for (const products of groups) {
    for (const product of products || []) {
      const key = String(product?._id || product?.id || product?.slug || "");
      if (!key || seen.has(key)) continue;
      seen.add(key);
      merged.push(product);
    }
  }

  return merged;
}

async function getSemanticRecommendations(products, excludedIds, limit) {
  try {
    const searchText = products
      .map((product) =>
        [
          product.name,
          product.brand,
          product.catName,
          product.subCat,
          product.thirdSubCat,
          product.description,
          ...Object.values(product.specifications || {}),
        ]
          .filter(Boolean)
          .join(" "),
      )
      .join(" ");

    if (!searchText.trim()) return [];

    const chunks = await retrieveRagContext(searchText, {
      limit: Math.max(limit * 3, 18),
    });

    const productIds = chunks
      .filter((chunk) => chunk.sourceType === "product")
      .map((chunk) => chunk.productId || chunk.metadata?.productId)
      .filter(Boolean)
      .filter((id) => !excludedIds.has(String(id)));

    const uniqueIds = [...new Set(productIds)].slice(0, Math.max(limit * 2, limit));
    if (!uniqueIds.length) return [];

    const foundProducts = await ProductModel.find({ _id: { $in: uniqueIds } })
      .select(PUBLIC_PRODUCT_SELECT)
      .lean();

    const byId = new Map(
      foundProducts.map((product) => [String(product._id), product]),
    );

    return shuffleProducts(
      uniqueIds.map((id) => byId.get(String(id))).filter(Boolean),
    ).slice(0, limit);
  } catch (error) {
    console.warn("Semantic recommendations unavailable:", error.message);
    return [];
  }
}

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
    }).lean();

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
    const excludedIds = new Set(combinedProductIds.map(String));
    let recommendations = await getSemanticRecommendations(
      combinedProducts,
      excludedIds,
      parseInt(limit),
    );

    if (orConditions.length > 0) {
      const categoryBrandRecommendations = await ProductModel.find({
        _id: { $nin: combinedProductIds }, // exclude already interacted products
        $or: orConditions,
      })
        .select(PUBLIC_PRODUCT_SELECT)
        .limit(Math.max(parseInt(limit) * 2, parseInt(limit)))
        .lean();

      recommendations = mergeUniqueProducts(
        recommendations,
        shuffleProducts(categoryBrandRecommendations),
      ).slice(0, parseInt(limit));
    }

    // Fallback if empty
    const emailRecommendations = recommendations;

    // UI fallback only
    const uiRecommendations =
      recommendations.length > 0
        ? recommendations
        : await ProductModel.aggregate([
            { $sample: { size: parseInt(limit) } },
            { $project: { price: 0, oldPrice: 0, discount: 0 } },
          ]);

    const MIN_VIEWS = 3;
    const MIN_WISHLIST_OR_VIEWS = 4;

    const totalSignals = viewedProductIds.length + wishlistProductIds.length;

    if (totalSignals < MIN_WISHLIST_OR_VIEWS) {
      return res.status(200).json({
        success: true,
        data: sanitizePublicProducts(recommendations),
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
    return res.status(200).json({ success: true, data: sanitizePublicProducts(recommendations) });
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
      data: sanitizePublicProducts(uiRecommendations),
    });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
