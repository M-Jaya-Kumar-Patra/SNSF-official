import VisitCountModel from "../models/visitCount.model.js";
import VisitorModel from "../models/visitor.model.js";
import crypto from "crypto";

/* =========================================================
   CONSTANTS
========================================================= */

const IST_OFFSET = 5.5 * 60 * 60 * 1000;

/* =========================================================
   HELPERS
========================================================= */

// 🔐 Hash IP
const hashIp = (ip) =>
  crypto.createHash("sha256").update(ip).digest("hex");

// Convert UTC Date → IST (ONLY for labels)
const toIST = (date) => new Date(date.getTime() + IST_OFFSET);

// Align start to bucket boundary (UTC)
const floorDate = (d, bucket) => {
  const dt = new Date(d);

  if (bucket === "minute") {
    dt.setSeconds(0, 0);
  } else if (bucket === "hour") {
    dt.setMinutes(0, 0, 0);
  } else if (bucket === "day") {
    dt.setHours(0, 0, 0, 0);
  } else if (bucket === "week") {
    const day = (dt.getDay() + 6) % 7; // Monday
    dt.setDate(dt.getDate() - day);
    dt.setHours(0, 0, 0, 0);
  } else if (bucket === "month") {
    dt.setDate(1);
    dt.setHours(0, 0, 0, 0);
  }

  return dt;
};

// Parse datetime-local (IST) → UTC
const parseISTDate = (value) => {
  const d = new Date(value);
  return new Date(d.getTime() - IST_OFFSET);
};

// Format label for chart (IST)
const formatLabel = (bucket, dateObj) => {
  const d = new Date(dateObj); // ALREADY IST from $dateTrunc

  if (bucket === "minute" || bucket === "hour") {
    return `${d.getHours().toString().padStart(2, "0")}:${d
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  }

  if (bucket === "day") {
    return `${d.getDate().toString().padStart(2, "0")}/${(
      d.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}`;
  }

  return `${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${d.getFullYear()}`;
};


// Generate empty buckets
const generateBuckets = (start, endExclusive, bucket) => {
  const buckets = [];
  let current = new Date(start);

  while (current < endExclusive) {
    buckets.push({
      time: formatLabel(bucket, current),
      visits: 0,
    });

    if (bucket === "minute") {
      current = new Date(current.getTime() + 60 * 1000);
    } else if (bucket === "hour") {
      current = new Date(current.getTime() + 60 * 60 * 1000);
    } else if (bucket === "day") {
      current = new Date(current.getTime() + 24 * 60 * 60 * 1000);
    } else if (bucket === "week") {
      current = new Date(current.getTime() + 7 * 24 * 60 * 60 * 1000);
    } else {
      const next = new Date(current);
      next.setMonth(next.getMonth() + 1);
      current = next;
    }
  }

  return buckets;
};

/* =========================================================
   ADD VISIT
========================================================= */

export const addVisitCount = async (req, res) => {
  try {
    const visitorId = req.body.deviceId;
    if (!visitorId) {
      return res.status(400).json({ success: false, message: "Device ID missing" });
    }

    const rawIp =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress;

    const ipHash = hashIp(rawIp);

    const IGNORED_VISITORS = ["c56a8cdb-0a17-4cb5-b3f9-5c0180b5857f"];
    if (IGNORED_VISITORS.includes(visitorId)) {
      return res.json({ success: true, ignored: true });
    }

    const now = new Date(); // UTC
    const startOfDay = new Date(now);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const alreadyVisited = await VisitCountModel.findOne({
      visitorId,
      visitedAt: { $gte: startOfDay, $lte: endOfDay },
    });

    if (alreadyVisited) {
      await VisitorModel.updateOne(
        { visitorId },
        { $set: { lastVisit: new Date(), visitorType: "returning" } }
      );
      return res.json({ success: true });
    }

    await VisitCountModel.create({
      visitorId,
      ipHash,
      userAgent: req.headers["user-agent"],
      visitedAt: new Date(),
    });

    await VisitorModel.updateOne(
      { visitorId },
      {
        $setOnInsert: {
          firstVisit: new Date(),
          visitorType: "new",
        },
        $set: { lastVisit: new Date() },
      },
      { upsert: true }
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================================================
   GET VISITS BY PRESET RANGE
========================================================= */

export const getVisitsByRange = async (req, res) => {
  try {
    const type = (req.query.type || "1day").toString();
    const now = new Date(); // UTC

    let start;
    let bucket;

    switch (type) {
      case "1hour":
        start = new Date(now.getTime() - 1 * 60 * 60 * 1000);
        bucket = "minute";
        break;

      case "12hour":
        start = new Date(now.getTime() - 12 * 60 * 60 * 1000);
        bucket = "hour";
        break;

      case "1day":
        start = new Date(now);
        start.setUTCHours(0, 0, 0, 0); // TODAY
        bucket = "hour";
        break;

      case "7day":
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        bucket = "day";
        break;

      case "1month":
        start = new Date(now);
        start.setUTCDate(1);
        bucket = "day";
        break;

      case "6month":
        start = new Date(now);
        start.setUTCMonth(start.getUTCMonth() - 6);
        bucket = "week";
        break;

      case "1year":
        start = new Date(now);
        start.setUTCFullYear(start.getUTCFullYear() - 1);
        bucket = "month";
        break;

      default:
        return res.status(400).json({ success: false, message: "Invalid range" });
    }

    start = floorDate(start, bucket);
    const endExclusive = new Date(now.getTime() + 1);

    const buckets = generateBuckets(start, endExclusive, bucket);

    const agg = await VisitCountModel.aggregate([
      { $match: { visitedAt: { $gte: start, $lt: endExclusive } } },
      {
        $group: {
          _id: {
            $dateTrunc: {
              date: "$visitedAt",
              unit: bucket,
              timezone: "Asia/Kolkata",
            },
          },
          visits: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    agg.forEach((row) => {
      const label = formatLabel(bucket, row._id);
      const slot = buckets.find((b) => b.time === label);
      if (slot) slot.visits = row.visits;
    });

    res.json({
      success: true,
      totalVisits: agg.reduce((s, r) => s + r.visits, 0),
      data: buckets,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =========================================================
   GET VISITS BY CUSTOM RANGE
========================================================= */

export const getVisitsByCustomRange = async (req, res) => {
  try {
    const { start: startQ, end: endQ } = req.query;
    if (!startQ || !endQ) {
      return res.status(400).json({ success: false, message: "Start & end required" });
    }

    const startUTC = parseISTDate(startQ);
    const endUTC = parseISTDate(endQ);

    const diffHours = (endUTC - startUTC) / (1000 * 60 * 60);
    let bucket =
      diffHours <= 3 ? "minute" :
      diffHours <= 48 ? "hour" :
      diffHours <= 31 * 24 ? "day" :
      diffHours <= 180 * 24 ? "week" : "month";

    const start = floorDate(startUTC, bucket);
    const endExclusive = new Date(endUTC.getTime() + 1);

    const buckets = generateBuckets(start, endExclusive, bucket);

    const agg = await VisitCountModel.aggregate([
      { $match: { visitedAt: { $gte: start, $lt: endExclusive } } },
      {
        $group: {
          _id: {
            $dateTrunc: {
              date: "$visitedAt",
              unit: bucket,
              timezone: "Asia/Kolkata",
            },
          },
          visits: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    agg.forEach((row) => {
      const label = formatLabel(bucket, row._id);
      const slot = buckets.find((b) => b.time === label);
      if (slot) slot.visits = row.visits;
    });

    res.json({
      success: true,
      totalVisits: agg.reduce((s, r) => s + r.visits, 0),
      data: buckets,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};


/* =========================================================
   GET TOTAL VISIT COUNT (SIMPLE)
========================================================= */

export const getVisitCount = async (req, res) => {
  try {
    const total = await VisitCountModel.countDocuments({
      isIgnored: false,
    });

    return res.json({
      success: true,
      totalVisits: total,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
