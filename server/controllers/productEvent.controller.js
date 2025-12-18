// server/controllers/productEvent.controller.js

import ProductEventModel from "../models/productEvent.model.js";

// -----------------------------
// 1️⃣ Track a product event
// -----------------------------
export const trackProductEvent = async (req, res) => {
  try {
    const { sessionId, visitorId, userId, productId, eventType, timeSpent } = req.body;

    // Validate required fields
    if (!sessionId || !visitorId || !productId || !eventType) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Validate eventType
    const validEvents = ["view", "add_to_cart", "remove_from_cart", "wishlist"];
    if (!validEvents.includes(eventType)) {
      return res.status(400).json({ success: false, message: "Invalid event type" });
    }

    const event = await ProductEventModel.create({
      sessionId,
      visitorId,
      productId,
      eventType,
      timeSpent: timeSpent || 0,
      userId: userId || null, // optional
    });

    return res.status(200).json({ success: true, data: event });
  } catch (error) {
    console.error("Error tracking product event:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// -----------------------------
// 2️⃣ Get product events by visitor/session
// -----------------------------
export const getProductEvents = async (req, res) => {
  try {
    const { visitorId, sessionId, limit = 20 } = req.query;

    if (!visitorId && !sessionId) {
      return res.status(400).json({ success: false, message: "visitorId or sessionId required" });
    }

    const filter = {};
    if (visitorId) filter.visitorId = visitorId;
    if (sessionId) filter.sessionId = sessionId;

    const events = await ProductEventModel.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate("productId", "name images price category"); // optional fields for frontend

    return res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.error("Error fetching product events:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
