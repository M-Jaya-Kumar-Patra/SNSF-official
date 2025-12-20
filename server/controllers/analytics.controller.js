// server/controllers/analytics.controller.js
import Visitor from "../models/visitor.model.js";
import Session from "../models/session.model.js";
import PageView from "../models/pageView.model.js";
import ProductEvent from "../models/productEvent.model.js";
import SearchLog from "../models/searchLog.model.js";
import LoginHistory from "../models/loginHistory.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import VisitCount from "../models/visitCount.model.js";
import VisitCountModel from "../models/visitCount.model.js";
import pageViewModel from "../models/pageView.model.js";
import ProductEventModel from "../models/productEvent.model.js";
// server/controllers/searchAnalytics.controller.js
import ProductModel from "../models/product.model.js";
import mongoose from "mongoose";
import sessionModel from "../models/session.model.js";
import UserModel from "../models/user.model.js";


/**
 * Util: parse range query
 * Accepts ?type=1hour|12hour|1day|7day|1month|6month|1year OR start & end ISO strings
 * Returns { start: Date, end: Date }
 */
const parseRange = (qs) => {
  const { start: qstart, end: qend, type } = qs;
  if (qstart && qend) {
    const s = new Date(qstart);
    const e = new Date(qend);
    if (!isNaN(s) && !isNaN(e)) return { start: s, end: e };
  }
  const now = new Date();
  switch (type) {
    case "1hour":
      return { start: new Date(now.getTime() - 60 * 60 * 1000), end: now };
    case "12hour":
      return { start: new Date(now.getTime() - 12 * 60 * 60 * 1000), end: now };
    case "1day":
      return { start: new Date(now.getTime() - 24 * 60 * 60 * 1000), end: now };
    case "7day":
      return { start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), end: now };
    case "1month":
      {
        const d = new Date(now);
        d.setMonth(d.getMonth() - 1);
        return { start: d, end: now };
      }
    case "6month":
      {
        const d = new Date(now);
        d.setMonth(d.getMonth() - 6);
        return { start: d, end: now };
      }
    case "1year":
      {
        const d = new Date(now);
        d.setFullYear(d.getFullYear() - 1);
        return { start: d, end: now };
      }
    default:
      return { start: new Date(now.getTime() - 24 * 60 * 60 * 1000), end: now };
  }
};

/**
 * Helper: generic aggregated time-series using $dateTrunc
 * collection: Mongoose model
 * dateField: "visitedAt" or "timestamp" etc
 * unit: minute/hour/day/week/month
 * timezone: default Asia/Kolkata
 */
const timeSeriesAggregation = async (model, dateField, start, end, unit, timezone = "Asia/Kolkata") => {
  const pipeline = [
    { $match: { [dateField]: { $gte: start, $lt: end } } },
    {
      $group: {
        _id: {
          $dateTrunc: {
            date: `$${dateField}`,
            unit,
            binSize: 1,
            timezone,
          },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id": 1 } },
  ];
  return model.aggregate(pipeline);
};

/* ------------------ Visitor Analytics ------------------ */

// 1A: Unique visitors per day (or per bucket)
export const uniqueVisitors = async (req, res) => {
  try {
    const { start, end } = parseRange(req.query);

    console.log("_______________________", start, "______", end)
    // choose bucket unit based on range length:
    const diffHours = (end - start) / (1000 * 60 * 60);
    const unit = diffHours <= 3 ? "minute" : diffHours <= 48 ? "hour" : diffHours <= 24 * 31 ? "day" : "week";

    // group by truncated visitor firstVisit? For unique per bucket, group on visitorId + $dateTrunc of first seen in that bucket
    // Simpler: count distinct visitorId per bucket using $addToSet then $size
    const pipeline = [
      { $match: { firstVisit: { $gte: start, $lt: end } } },
      {
        $group: {
          _id: {
            $dateTrunc: { date: "$firstVisit", unit, binSize: 1, timezone: "Asia/Kolkata" },
          },
          visitors: { $addToSet: "$visitorId" },
        },
      },
      { $project: { time: "$_id", count: { $size: "$visitors" } } },
      { $sort: { time: 1 } },
    ];
    const agg = await Visitor.aggregate(pipeline);
    res.json({ success: true, data: agg.map((r) => ({ time: r.time, visitors: r.count })) });
  } catch (err) {
    console.error("uniqueVisitors error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 1B: New vs Returning visitors (pie)
export const newVsReturning = async (req, res) => {
  try {
    const { start, end } = parseRange(req.query);
    const pipeline = [
      { $match: { lastVisit: { $gte: start, $lt: end } } },
      { $group: { _id: "$visitorType", count: { $sum: 1 } } },
    ];
    const agg = await Visitor.aggregate(pipeline);
    // normalize
    const result = { new: 0, returning: 0 };
    agg.forEach((r) => {
      if (r._id === "new") result.new = r.count;
      else if (r._id === "returning") result.returning = r.count;
    });
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("newVsReturning error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 1C: Device type distribution
export const deviceDistribution = async (req, res) => {
  try {
    const { start, end } = parseRange(req.query);
    const agg = await Visitor.aggregate([
      { $match: { lastVisit: { $gte: start, $lt: end } } },
      { $group: { _id: "$deviceType", count: { $sum: 1 } } },
    ]);
    res.json({ success: true, data: agg });
  } catch (err) {
    console.error("deviceDistribution error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 1D: Browser distribution
export const browserDistribution = async (req, res) => {
  try {
    const { start, end } = parseRange(req.query);
    const agg = await Visitor.aggregate([
      { $match: { lastVisit: { $gte: start, $lt: end } } },
      { $group: { _id: "$browser", count: { $sum: 1 } } },
    ]);
    res.json({ success: true, data: agg });
  } catch (err) {
    console.error("browserDistribution error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 1E: Country distribution
export const countryDistribution = async (req, res) => {
  try {
    const { start, end } = parseRange(req.query);
    const agg = await Visitor.aggregate([
      { $match: { lastVisit: { $gte: start, $lt: end } } },
      { $group: { _id: "$country", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 50 },
    ]);
    res.json({ success: true, data: agg });
  } catch (err) {
    console.error("countryDistribution error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ------------------ Session Analytics ------------------ */

// 2A: Average session duration (seconds) over time (bucketed)
export const avgSessionDuration = async (req, res) => {
  try {
    const { start, end } = parseRange(req.query);
    // choose unit by span:
    const diffHours = (end - start) / (1000 * 60 * 60);
    const unit = diffHours <= 3 ? "minute" : diffHours <= 48 ? "hour" : "day";
    const pipeline = [
      { $match: { lastActivity: { $gte: start, $lt: end } } },
      {
        $group: {
          _id: {
            $dateTrunc: { date: "$startedAt", unit, binSize: 1, timezone: "Asia/Kolkata" },
          },
          avgDuration: { $avg: "$sessionDuration" },
        },
      },
      { $sort: { "_id": 1 } },
    ];
    const agg = await Session.aggregate(pipeline);
    res.json({ success: true, data: agg.map((r) => ({ time: r._id, avgSeconds: Math.round(r.avgDuration || 0) })) });
  } catch (err) {
    console.error("avgSessionDuration error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2B: Bounce rate (sessions with pagesVisitedCount <=1) percentage
export const bounceRate = async (req, res) => {
  try {
    const { start, end } = parseRange(req.query);
    const total = await Session.countDocuments({ startedAt: { $gte: start, $lt: end } });
    const bounces = await Session.countDocuments({ startedAt: { $gte: start, $lt: end }, pagesVisitedCount: { $lte: 1 } });
    const rate = total ? (bounces / total) * 100 : 0;
    res.json({ success: true, data: { total, bounces, bounceRate: Math.round(rate * 100) / 100 } });
  } catch (err) {
    console.error("bounceRate error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2C: Pages per session distribution (histogram-like top buckets)
export const pagesPerSession = async (req, res) => {
  try {
    const { start, end } = parseRange(req.query);
    const agg = await Session.aggregate([
      { $match: { startedAt: { $gte: start, $lt: end } } },
      { $group: { _id: "$pagesVisitedCount", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    res.json({ success: true, data: agg });
  } catch (err) {
    console.error("pagesPerSession error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ------------------ Page Analytics ------------------ */

// 3A: Most viewed pages
export const mostViewedPages = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const agg = await PageView.aggregate([
      { $group: { _id: "$pageName", views: { $sum: 1 }, avgTime: { $avg: "$timeSpent" }, avgScroll: { $avg: "$scrollDepth" } } },
      { $sort: { views: -1 } },
      { $limit: limit },
    ]);
    res.json({ success: true, data: agg });
  } catch (err) {
    console.error("mostViewedPages error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 3B: Average scroll depth per page (provide top N)
export const avgScrollDepth = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const agg = await PageView.aggregate([
      { $group: { _id: "$pageName", avgScroll: { $avg: "$scrollDepth" }, views: { $sum: 1 } } },
      { $sort: { avgScroll: -1 } },
      { $limit: limit },
    ]);
    res.json({ success: true, data: agg });
  } catch (err) {
    console.error("avgScrollDepth error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 3C: Time spent per page (avg)
export const timeSpentPerPage = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const agg = await PageView.aggregate([
      { $group: { _id: "$pageName", avgTimeSpent: { $avg: "$timeSpent" }, views: { $sum: 1 } } },
      { $sort: { avgTimeSpent: -1 } },
      { $limit: limit },
    ]);
    res.json({ success: true, data: agg });
  } catch (err) {
    console.error("timeSpentPerPage error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// 3C: Pages ranked by total time spent
export const mostTimeSpentPages = async (req, res) => {
  try {
    let { start, end, limit = 10 } = req.query;

    // default last 7 days
    const now = new Date();
    if (!start) start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    else start = new Date(start);

    if (!end) end = now;
    else end = new Date(end);

    const pipeline = [
      { 
        $match: { 
          timestamp: { $gte: start, $lte: end },
          timeSpent: { $gt: 0 }
        } 
      },
      {
        $group: {
          _id: "$pageName",
          totalTime: { $sum: "$timeSpent" },
          avgTime: { $avg: "$timeSpent" },
          hits: { $sum: 1 }
        }
      },
      { $sort: { totalTime: -1 } },
      { $limit: parseInt(limit) }
    ];

    const data = await PageView.aggregate(pipeline);

    return res.json({
      success: true,
      data: data.map((x) => ({
        pageName: x._id,
        totalTime: Math.round(x.totalTime),
        avgTime: Math.round(x.avgTime),
        hits: x.hits
      })),
    });

  } catch (err) {
    console.error("mostTimeSpentPages error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// 4C: Time spent per user type (new vs returning)
export const timeSpentByUserType = async (req, res) => {
  try {
    let { start, end } = req.query;
    const now = new Date();

    if (!start) start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // last 7 days
    else start = new Date(start);

    if (!end) end = now;
    else end = new Date(end);

    const pipeline = [
      {
        $match: {
          timestamp: { $gte: start, $lte: end },
          timeSpent: { $gt: 0 }
        }
      },
      {
        $lookup: {
          from: "visitors",
          localField: "visitorId",
          foreignField: "visitorId",
          as: "visitor"
        }
      },
      { $unwind: "$visitor" },

      {
        $group: {
          _id: "$visitor.visitorType",
          totalTime: { $sum: "$timeSpent" },
          avgTime: { $avg: "$timeSpent" },
          hits: { $sum: 1 }
        }
      },
      { $sort: { totalTime: -1 } }
    ];

    const result = await pageViewModel.aggregate(pipeline);

    return res.json({
      success: true,
      data: result.map((x) => ({
        userType: x._id,           // new / returning
        totalTime: Math.round(x.totalTime),
        avgTime: Math.round(x.avgTime),
        hits: x.hits
      }))
    });

  } catch (err) {
    console.error("timeSpentByUserType error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};



/* ------------------ Conversion Funnel ------------------ */

// 4A: Product funnel: views => add_to_cart (per product or aggregated)
// Query params: ?productId=... optional, ?start & ?end optional
export const productFunnel = async (req, res) => {
  try {
    const { start, end } = parseRange(req.query);
    const productId = req.query.productId;
    const baseFilter = { timestamp: { $gte: start, $lt: end } };
    if (productId) baseFilter.productId = productId;

    const views = await ProductEvent.countDocuments({ ...baseFilter, eventType: "view" });
    const addToCart = await ProductEvent.countDocuments({ ...baseFilter, eventType: "add_to_cart" });
    const removeFromCart = await ProductEvent.countDocuments({ ...baseFilter, eventType: "remove_from_cart" });

    res.json({ success: true, data: { views, addToCart, removeFromCart } });
  } catch (err) {
    console.error("productFunnel error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// 4D: Time spent per product (most viewed products by time)
export const mostTimeSpentProducts = async (req, res) => {
  try {
    let { start, end, limit = 10 } = req.query;

    const now = new Date();
    if (!start) start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // last month
    else start = new Date(start);

    if (!end) end = now;
    else end = new Date(end);

    const pipeline = [
      {
        $match: {
          eventType: "view",
          timestamp: { $gte: start, $lte: end },
          timeSpent: { $gt: 0 }
        }
      },
      {
        $group: {
          _id: "$productId",
          totalTime: { $sum: "$timeSpent" },
          views: { $sum: 1 }
        }
      },
      { $sort: { totalTime: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },

      {
        $project: {
          productId: "$_id",
          name: "$product.name",
          image: { $arrayElemAt: ["$product.images", 0] },
          totalTime: 1,
          views: 1
        }
      }
    ];

    const result = await ProductEventModel.aggregate(pipeline);

    return res.json({ success: true, data: result });

  } catch (err) {
    console.error("mostTimeSpentProducts error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};



export const timeSpentByDevice = async (req, res) => {
  try {
    let { start, end } = req.query;

    const now = new Date();
    if (!start) start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    else start = new Date(start);

    if (!end) end = now;
    else end = new Date(end);

    const pipeline = [
      {
        $match: {
          timestamp: { $gte: start, $lte: end },
          timeSpent: { $gt: 0 }
        }
      },
      {
        $lookup: {
          from: "visitors",
          localField: "visitorId",
          foreignField: "visitorId",
          as: "visitor"
        }
      },
      { $unwind: "$visitor" },

      {
        $group: {
          _id: "$visitor.deviceType",
          totalTime: { $sum: "$timeSpent" },
          avgTime: { $avg: "$timeSpent" },
          hits: { $sum: 1 }
        }
      }
    ];

    const result = await pageViewModel.aggregate(pipeline);

    res.json({
      success: true,
      data: result.map((x) => ({
        device: x._id || "unknown",
        totalTime: Math.round(x.totalTime),
        avgTime: Math.round(x.avgTime),
        hits: x.hits
      }))
    });

  } catch (err) {
    console.error("timeSpentByDevice error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};



/* ------------------ Search Analytics ------------------ */

// MOST SEARCHED KEYWORDS
export const mostSearchedKeywords = async (req, res) => {
  try {
    const data = await SearchLog.aggregate([
      {
        $group: {
          _id: "$query",
          count: { $sum: 1 },
          lastSearched: { $max: "$searchedAt" }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 100 } // top 100 keywords
    ]);

    res.json({
      success: true,
      data: data.map(k => ({
        keyword: k._id,
        count: k.count,
        lastSearched: k.lastSearched
      }))
    });
  } catch (err) {
    console.error("Most searched error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// 5A: Top searched keywords
export const topSearchKeywords = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 20;
    const agg = await SearchLog.aggregate([
      { $group: { _id: "$query", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);
    res.json({ success: true, data: agg });
  } catch (err) {
    console.error("topSearchKeywords error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 5C: Search volume over time (bucketed)
export const searchVolume = async (req, res) => {
  try {
    const { start, end } = parseRange(req.query);
    // choose bucket like earlier
    const diffHours = (end - start) / (1000 * 60 * 60);
    const unit = diffHours <= 3 ? "minute" : diffHours <= 48 ? "hour" : diffHours <= 24 * 31 ? "day" : "week";
    const agg = await timeSeriesAggregation(SearchLog, "searchedAt", start, end, unit);
    res.json({ success: true, data: agg });
  } catch (err) {
    console.error("searchVolume error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};



export const scrollDepthStats = async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: "$pageName",
          avgScroll: { $avg: "$scrollDepth" },
          views: { $sum: 1 }
        }
      },
      { $sort: { avgScroll: -1 } },
      { $limit: 10 }
    ];

    const result = await pageViewModel.aggregate(pipeline);

    res.json({
      success: true,
      data: result.map((x) => ({
        page: x._id,
        avgScroll: Math.round(x.avgScroll),
        views: x.views
      }))
    });

  } catch (err) {
    console.error("scrollDepthStats error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


/* ------------------ User Analytics ------------------ */

export const topUsersByTimeSpent = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || 10);

    const pipeline = [
      {
        $match: {
          timeSpent: { $gt: 0 }
        }
      },
      {
        $group: {
          _id: "$visitorId",
          totalTime: { $sum: "$timeSpent" },
          sessions: { $sum: 1 }
        }
      },
      { $sort: { totalTime: -1 } },
      { $limit: limit },

      {
        $lookup: {
          from: "visitors",
          localField: "_id",
          foreignField: "visitorId",
          as: "visitor"
        }
      },
      { $unwind: "$visitor" },

      {
        $lookup: {
          from: "users",
          localField: "visitor.userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          visitorId: "$_id",
          totalTime: 1,
          sessions: 1,
          name: "$user.name",
          email: "$user.email",
          visitorType: "$visitor.visitorType"
        }
      }
    ];

    const result = await pageViewModel.aggregate(pipeline);

    res.json({ success: true, data: result });

  } catch (err) {
    console.error("topUsersByTimeSpent error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// 6A: Daily logins (time-series)
export const dailyLogins = async (req, res) => {
  try {
    const { start, end } = parseRange(req.query);
    const diffHours = (end - start) / (1000 * 60 * 60);
    const unit = diffHours <= 48 ? "hour" : "day";
    const agg = await timeSeriesAggregation(LoginHistory, "loggedInAt", start, end, unit);
    res.json({ success: true, data: agg.map((r) => ({ time: r._id, count: r.count })) });
  } catch (err) {
    console.error("dailyLogins error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 6B: New signups over time (based on User.createdAt)
export const newSignups = async (req, res) => {
  try {
    const { start, end } = parseRange(req.query);
    const diffHours = (end - start) / (1000 * 60 * 60);
    const unit = diffHours <= 48 ? "hour" : "day";
    const agg = await timeSeriesAggregation(User, "createdAt", start, end, unit);
    res.json({ success: true, data: agg.map((r) => ({ time: r._id, count: r.count })) });
  } catch (err) {
    console.error("newSignups error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


export const userTopPages = async (req, res) => {
  try {
    const { visitorId } = req.query;
    if (!visitorId) return res.status(400).json({ success: false, msg: "visitorId required" });

    const pipeline = [
      { $match: { visitorId, timeSpent: { $gt: 0 } } },
      {
        $group: {
          _id: "$pageName",
          totalTime: { $sum: "$timeSpent" },
          views: { $sum: 1 }
        }
      },
      { $sort: { totalTime: -1 } }
    ];

    const result = await pageViewModel.aggregate(pipeline);

    res.json({
      success: true,
      data: result.map((x) => ({
        page: x._id,
        time: x.totalTime,
        views: x.views
      }))
    });

  } catch (err) {
    console.error("userTopPages error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


/* ------------------ Product Analytics ------------------ */

// 7A: Most viewed products (ProductEvent view counts)
export const mostViewedProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const agg = await ProductEvent.aggregate([
      { $match: { eventType: "view" } },
      { $group: { _id: "$productId", views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: limit },
    ]);
    // populate product details
    const productIds = agg.map((r) => r._id);
    const products = await Product.find({ _id: { $in: productIds } }).select("name images price").lean();
    const map = new Map(products.map((p) => [String(p._id), p]));
    const result = agg.map((r) => ({ product: map.get(String(r._id)) || null, views: r.views }));
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("mostViewedProducts error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Wishlist leaderboard
export const mostWishlisted = async (req, res) => {
  try {
    // If you store wishlist as array in UserModel or product model has wishlist counter use that.
    // Here we will count appearances in User.wishlist if available.
    // Fallback: count "wishlist" ProductEvent if you track it.
    // Try ProductEvent first:
    const limit = Number(req.query.limit) || 10;
    let agg = await ProductEvent.aggregate([
      { $match: { eventType: "wishlist" } },
      { $group: { _id: "$productId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);
    if (!agg.length) {
      // fallback: check User.wishlist arrays (if you used it)
      agg = await User.aggregate([
        { $unwind: "$wishlist" },
        { $group: { _id: "$wishlist", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: limit },
      ]);
    }
    const productIds = agg.map((r) => r._id);
    const products = await Product.find({ _id: { $in: productIds } }).select("name images price").lean();
    const map = new Map(products.map((p) => [String(p._id), p]));
    const result = agg.map((r) => ({ product: map.get(String(r._id)) || null, count: r.count }));
    res.json({ success: true, data: result });
  } catch (err) {
    console.error("mostWishlisted error:", err);
    res.status(500).json({ success: false, message: err.message });
  }

};



export const getUniqueVisitorsInRange = async (req, res) => {
  try {
    let { start, end } = req.query;
    if (!start || !end)
      return res.status(400).json({ success: false, msg: "start & end required" });

    start = new Date(start);
    end = new Date(end);

    const uniqueVisitors = await PageView.aggregate([
      { $match: { timestamp: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: null,
          visitors: { $addToSet: "$visitorId" },
        },
      },
      { $project: { count: { $size: "$visitors" } } },
    ]);

    res.json({
      success: true,
      uniqueVisitors: uniqueVisitors[0]?.count || 0,
    });
  } catch (err) {
    console.error("unique range error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getUniqueVisitorsBucketed = async (req, res) => {
  try {
    let { start, end } = req.query;
    start = new Date(start);
    end = new Date(end);

    const diffHours = (end - start) / (1000 * 60 * 60);
    const unit =
      diffHours <= 3 ? "minute" :
      diffHours <= 48 ? "hour" :
      diffHours <= 24 * 31 ? "day" :
      "week";

    const pipeline = [
      { $match: { timestamp: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: {
            $dateTrunc: {
              date: "$timestamp",
              unit,
              binSize: 1,
              timezone: "Asia/Kolkata"
            }
          },
          visitors: { $addToSet: "$visitorId" }
        }
      },
      {
        $project: {
          time: "$_id",
          count: { $size: "$visitors" },
        }
      },
      { $sort: { time: 1 } },
    ];

    const agg = await PageView.aggregate(pipeline);

    res.json({
      success: true,
      data: agg
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};


/**
 * Utility: parse optional start/end query (ISO or absent -> last 7 days)
 */
const parseStartEnd = (q) => {
  let { start, end } = q;
  let now = new Date();
  if (!end) end = now.toISOString();
  if (!start) {
    const d = new Date(now);
    d.setDate(d.getDate() - 7);
    start = d.toISOString();
  }
  return { start: new Date(start), end: new Date(end) };
};

/**
 * 1) Zero-result searches: timeseries + top zero queries list
 * GET /api/analytics/search/zero-results?start=...&end=...&unit=day|hour
 */
export const zeroResultSearches = async (req, res) => {
  try {
    const { start, end } = parseStartEnd(req.query);
    const unit = (req.query.unit === "hour") ? "hour" : "day";

    // bucket by day/hour and count searches with resultsFound == 0
    const pipeline = [
      { $match: { searchedAt: { $gte: start, $lt: end }, resultsFound: { $lte: 0 } } },
      {
        $group: {
          _id: {
            $dateTrunc: {
              date: "$searchedAt",
              unit,
              binSize: 1,
              timezone: "Asia/Kolkata",
            },
          },
          count: { $sum: 1 },
          queries: { $push: "$query" },
        },
      },
      { $sort: { "_id": 1 } },
    ];
    const agg = await SearchLog.aggregate(pipeline);

    // top zero-result queries (overall)
    const topZero = await SearchLog.aggregate([
      { $match: { searchedAt: { $gte: start, $lt: end }, resultsFound: { $lte: 0 } } },
      { $group: { _id: "$query", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 50 },
    ]);

    res.json({ success: true, timeseries: agg.map(a => ({ time: a._id, count: a.count })), topZero });
  } catch (err) {
    console.error("zeroResultSearches error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 2) Top searched categories: find top search queries, map them to product categories
 * GET /api/analytics/search/top-categories?start=...&end=...&limit=10
 *
 * Approach: take top N search queries, for each query try to find matching products
 * (name / catName / subCat). Then group by product.catName and sum counts.
 */
export const topSearchedCategories = async (req, res) => {
  try {
    const { start, end } = parseStartEnd(req.query);
    const limit = parseInt(req.query.limit || "10", 10);

    // top queries overall
    const topQueries = await SearchLog.aggregate([
      { $match: { searchedAt: { $gte: start, $lt: end } } },
      { $group: { _id: "$query", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 100 }, // grab top 100 queries to map to categories
    ]);

    // For each query find matching products (name/catName/subCat), then group categories
    const catMap = {}; // { catName: count }
    for (const q of topQueries) {
      const regex = new RegExp(q._id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      // find up to 6 matching products (cheap)
      const products = await ProductModel.find({
        $or: [
          { name: { $regex: regex } },
          { catName: { $regex: regex } },
          { subCat: { $regex: regex } },
        ],
      }).limit(6).select("catName").lean();

      // weight the query count across matched categories
      if (products.length) {
        const perCat = {};
        for (const p of products) {
          const cat = p.catName || "Uncategorized";
          perCat[cat] = (perCat[cat] || 0) + 1;
        }
        // add weighted query count to each category
        for (const [cat, cnt] of Object.entries(perCat)) {
          catMap[cat] = (catMap[cat] || 0) + (q.count * cnt / products.length);
        }
      } else {
        // no product matched: increment "No Match" bucket
        catMap["No Match"] = (catMap["No Match"] || 0) + q.count;
      }
    }

    // convert to array and sort
    const arr = Object.entries(catMap).map(([cat, count]) => ({ cat, count: Math.round(count) }));
    arr.sort((a, b) => b.count - a.count);
    res.json({ success: true, data: arr.slice(0, limit) });
  } catch (err) {
    console.error("topSearchedCategories error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 3) Search conversion funnel:
 * We compute unique visitor counts across stages:
 *  - searches (unique visitors who searched)
 *  - product views (unique visitors who had product view events after searching)
 *  - add_to_cart (unique visitors who added to cart after searching)
 *
 * GET /api/analytics/search/funnel?start=..&end=..
 */
export const searchConversionFunnel = async (req, res) => {
  try {
    const { start, end } = parseStartEnd(req.query);

    // unique visitors who searched in range
    const searchedVisitorsAgg = await SearchLog.aggregate([
      { $match: { searchedAt: { $gte: start, $lt: end } } },
      { $group: { _id: "$visitorId" } },
      { $count: "uniqueSearched" },
    ]);
    const uniqueSearched = searchedVisitorsAgg[0]?.uniqueSearched || 0;

    // visitors who viewed a product in range (productEvent with eventType 'view')
    const viewedVisitorsAgg = await ProductEventModel.aggregate([
      { $match: { eventType: "view", createdAt: { $gte: start, $lt: end } } },
      { $group: { _id: "$visitorId" } },
      { $count: "uniqueViewed" },
    ]);
    const uniqueViewed = viewedVisitorsAgg[0]?.uniqueViewed || 0;

    // visitors who added to cart
    const addedVisitorsAgg = await ProductEventModel.aggregate([
      { $match: { eventType: "add_to_cart", createdAt: { $gte: start, $lt: end } } },
      { $group: { _id: "$visitorId" } },
      { $count: "uniqueAdded" },
    ]);
    const uniqueAdded = addedVisitorsAgg[0]?.uniqueAdded || 0;

    // Build funnel result
    const funnel = [
      { stage: "Searched", value: uniqueSearched },
      { stage: "Viewed Product", value: uniqueViewed },
      { stage: "Add To Cart", value: uniqueAdded },
    ];

    res.json({ success: true, funnel });
  } catch (err) {
    console.error("searchConversionFunnel error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 4) Simple Search Intent Clustering
 * Groups queries by normalized tokens (remove stopwords, sort tokens) and buckets similar queries together.
 * GET /api/analytics/search/intents?limitClusters=50&minSize=2
 */
export const searchIntentClusters = async (req, res) => {
  try {
    const { start, end } = parseStartEnd(req.query);
    const limitClusters = parseInt(req.query.limitClusters || "50", 10);
    const minSize = parseInt(req.query.minSize || "2", 10);

    // fetch top 1000 search queries in range with counts
    const topQueries = await SearchLog.aggregate([
      { $match: { searchedAt: { $gte: start, $lt: end } } },
      { $group: { _id: "$query", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 2000 },
    ]);

    // small stopword list
    const stopwords = new Set(["the","a","an","of","in","on","for","to","is","are","and","with","by","from","at","how","what","best"]);

    const normalize = (s) => {
      return s
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .split(/\s+/)
        .filter(Boolean)
        .filter(w => !stopwords.has(w))
        .sort()
        .join(" "); // sorted token signature
    };

    // cluster map
    const clusters = new Map();
    for (const q of topQueries) {
      const sig = normalize(q._id) || q._id.toLowerCase();
      const entry = clusters.get(sig) || { queries: [], total: 0 };
      entry.queries.push({ query: q._id, count: q.count });
      entry.total += q.count;
      clusters.set(sig, entry);
    }

    // convert to array, filter small ones
    const arr = Array.from(clusters.entries()).map(([sig, v]) => ({
      signature: sig,
      total: v.total,
      queries: v.queries.slice(0, 20), // sample
      size: v.queries.length,
    }))
      .filter(c => c.total >= minSize)
      .sort((a,b) => b.total - a.total)
      .slice(0, limitClusters);

    res.json({ success: true, data: arr });
  } catch (err) {
    console.error("searchIntentClusters error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getActiveUsers = async (req, res) => {
  try {
    const now = new Date();
    const TEN_MIN = 10 * 60 * 1000;

    const activeSessions = await Session.find({
      lastActivity: { $gte: new Date(now - TEN_MIN) }
    });


    const visitorIds = activeSessions.map(s => s.visitorId);

    const visitors = await Visitor.find({ visitorId: { $in: visitorIds } });

    res.json({
      success: true,
      activeCount: visitors.length,
      visitors
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const activeUsersByDevice = async (req, res) => {
  try {
    const now = new Date();
    const TEN_MIN = 10 * 60 * 1000;

    const activeSessions = await Session.find({
      lastActivity: { $gte: new Date(now - TEN_MIN) }
    });

    const visitorIds = activeSessions.map(s => s.visitorId);

    const deviceStats = await Visitor.aggregate([
      { $match: { visitorId: { $in: visitorIds } } },
      { $group: { _id: "$deviceType", count: { $sum: 1 } } }
    ]);

    res.json({ success: true, deviceStats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const liveTopPages = async (req, res) => {
  try {
    const now = new Date();
    const TEN_MIN = 10 * 60 * 1000;

    const pageStats = await PageView.aggregate([
      { $match: { timestamp: { $gte: new Date(now - TEN_MIN) } } },
      { $group: { _id: "$pageName", views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 10 }
    ]);

    res.json({ success: true, pages: pageStats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const userPageEngagement = async (req, res) => {
  try {
    const { visitorId } = req.query;

    const pages = await PageView.aggregate([
      { $match: { visitorId } },
      {
        $group: {
          _id: "$pageName",
          views: { $sum: 1 },
          totalTime: { $sum: "$timeSpent" }
        }
      },
      { $sort: { totalTime: -1 } }
    ]);

    res.json({ success: true, pages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



export const getLiveUsers = async (req, res) => {
  try {
    const FIVE_MIN = 5 * 60 * 1000;
    const now = new Date();

    // Find active sessions
    const activeSessions = await Session.find({
      lastActivity: { $gte: new Date(now - FIVE_MIN) }
    }).lean();

    if (activeSessions.length === 0) {
      return res.json({ success: true, users: [] });
    }

    const visitorIds = activeSessions.map(s => s.visitorId);
    const sessionIds = activeSessions.map(s => s.sessionId);
    const userIds = activeSessions.map(s => s.userId).filter(Boolean);

    // Fetch logged-in users
    const users = await UserModel.find({ _id: { $in: userIds } })
      .select("name avatar")
      .lean();

   

    // Fetch latest page for each session
    const lastPages = await PageView.aggregate([
      { $match: { sessionId: { $in: sessionIds } } },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: "$sessionId",
          pageName: { $first: "$pageName" }
        }
      }
    ]);

    const pageMap = {};
    lastPages.forEach(p => { pageMap[p._id] = p.pageName; });

    // Combine everything
    const liveUsers = activeSessions.map((session) => {
      const user = users.find(u => u._id?.toString() === session.userId?.toString());

      return {
        visitorId: session.visitorId,
        userId: session.userId || null,
        name: user?.name || null,
        avatar: user?.avatar || null,
        device: session.deviceType || "unknown",
        currentPage: pageMap[session.sessionId] || "Homepage",
        activeSince: session.startedAt,
        timeActive: Math.floor((now - new Date(session.startedAt)) / 1000) // seconds
      };
    });

    return res.json({
      success: true,
      users: liveUsers
    });

  } catch (err) {
    console.error("Live user error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export default {
  uniqueVisitors,
  newVsReturning,
  deviceDistribution,
  browserDistribution,
  countryDistribution,
  avgSessionDuration,
  bounceRate,
  pagesPerSession,
  mostViewedPages,
  avgScrollDepth,
  timeSpentPerPage,
  productFunnel,
  topSearchKeywords,
  zeroResultSearches,
  searchVolume,
  dailyLogins,
  newSignups,
  mostViewedProducts,
  mostWishlisted,
  getUniqueVisitorsInRange,
  getUniqueVisitorsBucketed,
  mostTimeSpentPages,
  timeSpentByUserType,
  mostTimeSpentProducts,
  timeSpentByDevice,
  scrollDepthStats,
  topUsersByTimeSpent ,
  userTopPages , 
  mostSearchedKeywords,
  zeroResultSearches,
  topSearchedCategories,
  searchConversionFunnel,
  searchIntentClusters,
   getActiveUsers,
  activeUsersByDevice,
  liveTopPages,
  userPageEngagement,
  getLiveUsers
  
};
