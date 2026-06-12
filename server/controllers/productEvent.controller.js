import { addJob } from "../jobs/queue.js";
import {
  findProductEvents,
  recordProductEvent,
} from "../services/analytics.service.js";

export const trackProductEvent = async (req, res) => {
  try {
    const { sessionId, visitorId, productId, eventType } = req.body;

    if (!sessionId || !visitorId || !productId || !eventType) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const validEvents = ["view", "add_to_cart", "remove_from_cart", "wishlist"];
    if (!validEvents.includes(eventType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event type",
      });
    }

    const result = await addJob("analytics", "track-product-event", req.body, {
      inline: recordProductEvent,
    });

    return res.status(result.queued ? 202 : 200).json({
      success: true,
      queued: result.queued,
    });
  } catch (error) {
    console.error("Error tracking product event:", error);
    return res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message });
  }
};

export const getProductEvents = async (req, res) => {
  try {
    const events = await findProductEvents(req.query);
    return res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.error("Error fetching product events:", error);
    return res
      .status(error.statusCode || 500)
      .json({ success: false, message: error.message });
  }
};
