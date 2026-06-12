import pageViewModel from "../models/pageView.model.js";
import ProductEventModel from "../models/productEvent.model.js";
import sessionModel from "../models/session.model.js";
import visitorModel from "../models/visitor.model.js";

export async function recordVisitorActivity(payload) {
  const {
    visitorId,
    sessionId,
    userId,
    pageName,
    scrollDepth,
    timeSpent,
    deviceType,
    browser,
    os,
    country,
    city,
    referrer,
  } = payload;

  if (!visitorId || !sessionId || !pageName) {
    const error = new Error("Missing fields");
    error.statusCode = 400;
    throw error;
  }

  const existing = await visitorModel.findOne({ visitorId }).select("_id").lean();

  await visitorModel.findOneAndUpdate(
    { visitorId },
    {
      $set: {
        lastVisit: new Date(),
        userId: userId || null,
        deviceType,
        browser,
        os,
        country,
        city,
        referrer,
        visitorType: existing ? "returning" : "new",
      },
      $setOnInsert: {
        firstVisit: new Date(),
        visitorId,
      },
    },
    { upsert: true }
  );

  await sessionModel.findOneAndUpdate(
    { sessionId },
    {
      visitorId,
      userId: userId || null,
      lastActivity: new Date(),
      $inc: { pagesVisitedCount: 1 },
    },
    { upsert: true }
  );

  await pageViewModel.create({
    visitorId,
    sessionId,
    userId: userId || null,
    pageName,
    scrollDepth: scrollDepth || 0,
    timeSpent: timeSpent || 0,
  });
}

export async function recordProductEvent(payload) {
  const { sessionId, visitorId, userId, productId, eventType, timeSpent } =
    payload;

  if (!sessionId || !visitorId || !productId || !eventType) {
    const error = new Error("Missing required fields");
    error.statusCode = 400;
    throw error;
  }

  const validEvents = ["view", "add_to_cart", "remove_from_cart", "wishlist"];
  if (!validEvents.includes(eventType)) {
    const error = new Error("Invalid event type");
    error.statusCode = 400;
    throw error;
  }

  return ProductEventModel.create({
    sessionId,
    visitorId,
    productId,
    eventType,
    timeSpent: timeSpent || 0,
    userId: userId || null,
  });
}

export async function findProductEvents({ visitorId, sessionId, limit = 20 }) {
  if (!visitorId && !sessionId) {
    const error = new Error("visitorId or sessionId required");
    error.statusCode = 400;
    throw error;
  }

  const filter = {};
  if (visitorId) filter.visitorId = visitorId;
  if (sessionId) filter.sessionId = sessionId;

  return ProductEventModel.find(filter)
    .sort({ createdAt: -1 })
    .limit(parseInt(limit, 10))
    .populate("productId", "name images price category")
    .lean();
}
