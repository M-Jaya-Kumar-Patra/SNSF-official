import ProductEventModel from "../models/productEvent.model.js";
import ProductModel from "../models/product.model.js";
import UserModel from "../models/user.model.js";
import sendEmailFun from "../config/sendEmail.js";
import recommendedProductsTemplate from "../utils/EmailTemplates/recommendedProductsEmail.js";
import { shouldSendRecommendationEmail } from "../utils/shouldSendRecommendationEmail.js";

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

export async function sendDailyRecommendationEmails() {
  const users = await UserModel.find({
    email: { $exists: true },
  }).select(
    "email name lastRecommendationEmailAt lastRecommendedProductIds"
  );

  let sent = 0;

  for (const user of users) {
    const userId = user._id;

    const events = await ProductEventModel.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("productId")
      .lean();

    if (!events.length) continue;

    const categories = [
      ...new Set(events.map((event) => event.productId?.catId).filter(Boolean)),
    ];

    const brands = [
      ...new Set(events.map((event) => event.productId?.brand).filter(Boolean)),
    ];

    if (!categories.length && !brands.length) continue;

    if (!shouldSendRecommendationEmail(user.lastRecommendationEmailAt)) {
      continue;
    }

    const lastIds = user.lastRecommendedProductIds || [];

    const recommendations = await ProductModel.find({
      _id: { $nin: lastIds },
      $or: [{ catId: { $in: categories } }, { brand: { $in: brands } }],
    })
      .limit(10)
      .lean();

    if (recommendations.length < 1) continue;

    const finalProducts = recommendations
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);

    const subjects = [
      "You might like these, {{name}}",
      "Still thinking about these furniture picks?",
      "Handpicked furniture based on your browsing",
      "New ideas for your space, {{name}}",
      "Furniture you viewed is still available",
    ];

    const subject = subjects[
      Math.floor(Math.random() * subjects.length)
    ].replace("{{name}}", user.name?.split(" ")[0] || "there");

    await sendEmailFun(
      user.email,
      subject,
      undefined,
      recommendedProductsTemplate(user.name, subject, finalProducts)
    );

    await UserModel.findByIdAndUpdate(userId, {
      lastRecommendationEmailAt: new Date(),
      lastRecommendedProductIds: finalProducts.map((product) =>
        product._id.toString()
      ),
    });

    sent += 1;
  }

  return { sent };
}
