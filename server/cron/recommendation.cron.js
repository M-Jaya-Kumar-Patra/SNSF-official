import cron from "node-cron";
import UserModel from "../models/user.model.js";
import ProductEventModel from "../models/productEvent.model.js";
import ProductModel from "../models/product.model.js";
import sendEmailFun from "../config/sendEmail.js";
import recommendedProductsTemplate from "../utils/EmailTemplates/recommendedProductsEmail.js";
import { shouldSendRecommendationEmail } from "../utils/shouldSendRecommendationEmail.js";

export function startRecommendationCron() {
  cron.schedule("30 4 * * *", async () => {//everyday 10 am
    console.log("🕒 Recommendation cron running");

    const users = await UserModel.find({
      email: { $exists: true },
    });

    for (const user of users) {
      const userId = user._id;

      // 🔹 1. Fetch recent events
      const events = await ProductEventModel.find({ userId })
        .sort({ createdAt: -1 })
        .limit(20)
        .populate("productId");

      if (!events.length) continue;

      // 🔹 2. Extract categories & brands
      const categories = [
        ...new Set(events.map((e) => e.productId?.catId).filter(Boolean)),
      ];

      const brands = [
        ...new Set(events.map((e) => e.productId?.brand).filter(Boolean)),
      ];

      if (!categories.length && !brands.length) continue;

      const lastIds = user.lastRecommendedProductIds || [];

      const recommendations = await ProductModel.find({
        _id: { $nin: lastIds },
        $or: [{ catId: { $in: categories } }, { brand: { $in: brands } }],
      }).limit(10);

      if (recommendations.length < 1) continue;

      const shuffled = recommendations.sort(() => 0.5 - Math.random());
      const finalProducts = shuffled.slice(0, 4);

      // cooldown check
      if (!shouldSendRecommendationEmail(user.lastRecommendationEmailAt))
        continue;


      
      const subjects = [
        "You might like these, {{name}} 👀",
        "Still thinking about these furniture picks?",
        "Handpicked furniture based on your browsing",
        "New ideas for your space, {{name}}",
        "Furniture you viewed — still available",
      ];

      const subject = subjects[
        Math.floor(Math.random() * subjects.length)
      ].replace("{{name}}", user.name?.split(" ")[0] || "there");
      
      // send email
      await sendEmailFun(
        user.email,
        subject,
        undefined,
        recommendedProductsTemplate(user.name, subject, finalProducts)
      );

      // update user
      await UserModel.findByIdAndUpdate(userId, {
        lastRecommendationEmailAt: new Date(),
        lastRecommendedProductIds: finalProducts.map((p) => p._id.toString()),
      });

      console.log("📧 Recommendation email sent to:", user.email);
    }
  });
}
