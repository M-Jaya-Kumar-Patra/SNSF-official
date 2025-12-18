import visitorModel from "../models/visitor.model.js";
import sessionModel from "../models/session.model.js";
import pageViewModel from "../models/pageView.model.js";

export const trackVisitor = async (req, res) => {
  try {
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
    } = req.body;

    if (!visitorId || !sessionId || !pageName) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    // 1️⃣ Visitor update
    const existing = await visitorModel.findOne({ visitorId });

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

    // 2️⃣ Session update
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

    // 3️⃣ Page view
    await pageViewModel.create({
      visitorId,
      sessionId,
      userId: userId || null,
      pageName,
      scrollDepth: scrollDepth || 0,
      timeSpent: timeSpent || 0,
    });

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
