import SearchLog from "../models/searchLog.model.js";
import ProductModel from "../models/product.model.js";

export async function SearchProductsController(req, res) {
  try {
    const query = (req.query.q || "").trim();
    const visitorId = req.headers["x-visitor-id"] || null;
    const sessionId = req.headers["x-session-id"] || null;
    const userId = req.headers["x-user-id"] || null;

    if (!query) {
      return res.json({ success: true, products: [] });
    }

    // Fetch products (limit 20 for now)
    const products = await ProductModel.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } },
        { catName: { $regex: query, $options: "i" } },
        { subCat: { $regex: query, $options: "i" } },
        { thirdSubCat: { $regex: query, $options: "i" } },
      ],
    })
      .limit(20);

    // 🔥 Log search (but don’t block the response if it fails)
    try {
      await SearchLog.create({
        query,
        visitorId,
        sessionId,
        userId,
        resultsFound: products.length,
      });
    } catch (logError) {
      console.error("Failed to log search:", logError);
    }

    return res.json({ success: true, products });

  } catch (err) {
    console.error("Search error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}
