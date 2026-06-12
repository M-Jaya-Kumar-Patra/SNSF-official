import { addJob } from "../jobs/queue.js";
import { recordVisitorActivity } from "../services/analytics.service.js";

export const trackVisitor = async (req, res) => {
  try {
    const { visitorId, sessionId, pageName } = req.body;

    if (!visitorId || !sessionId || !pageName) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const result = await addJob("analytics", "track-visitor", req.body, {
      inline: recordVisitorActivity,
    });

    return res.status(result.queued ? 202 : 200).json({
      success: true,
      queued: result.queued,
    });
  } catch (err) {
    return res
      .status(err.statusCode || 500)
      .json({ success: false, error: err.message });
  }
};
