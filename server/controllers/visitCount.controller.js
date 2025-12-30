// server/controllers/visitCount.controller.js
import VisitCountModel from "../models/visitCount.model.js";

/**
 * Helper: floor date to start of minute/hour/day/etc.
 */
const floorDate = (d, bucket) => {
  const dt = new Date(d);
  if (bucket === "minute") {
    dt.setSeconds(0, 0);
  } else if (bucket === "hour") {
    dt.setMinutes(0, 0, 0);
  } else if (bucket === "day") {
    dt.setHours(0, 0, 0, 0);
  } else if (bucket === "week") {
    // set to start of week (Monday ISO style)
    // get day (0=Sun..6=Sat) -> convert to Monday-based index
    const day = (dt.getDay() + 6) % 7; // 0 => Monday
    dt.setDate(dt.getDate() - day);
    dt.setHours(0, 0, 0, 0);
  } else if (bucket === "month") {
    dt.setDate(1);
    dt.setHours(0, 0, 0, 0);
  }
  return dt;
};

/**
 * Generate buckets (labels) between start (inclusive) and end (exclusive)
 * using the simple labels format (Option C).
 */
const generateBuckets = (start, endExclusive, bucket) => {
  const buckets = [];
  let current = new Date(start);

  // avoid infinite loop safety
  const safetyLimit = 10000;
  let iter = 0;

  while (current < endExclusive && iter++ < safetyLimit) {
    let label = "";
    if (bucket === "minute") {
      const hh = current.getHours().toString().padStart(2, "0");
      const mm = current.getMinutes().toString().padStart(2, "0");
      label = `${hh}:${mm}`;
      current = new Date(current.getTime() + 60 * 1000); // +1 minute
    } else if (bucket === "hour") {
      const hh = current.getHours().toString().padStart(2, "0");
      label = `${hh}:00`;
      current = new Date(current.getTime() + 60 * 60 * 1000); // +1 hour
    } else if (bucket === "day") {
      const dd = current.getDate().toString().padStart(2, "0");
      const mm = (current.getMonth() + 1).toString().padStart(2, "0");
      label = `${dd}/${mm}`;
      current = new Date(current.getTime() + 24 * 60 * 60 * 1000); // +1 day
    } else if (bucket === "week") {
      // ISO week number (simple)
      const tmp = new Date(current);
      const firstJan = new Date(tmp.getFullYear(), 0, 1);
      const days = Math.floor((tmp - firstJan) / (24 * 60 * 60 * 1000));
      const weekNo = Math.ceil((days + firstJan.getDay() + 1) / 7);
      label = `Wk ${weekNo}`;
      current = new Date(current.getTime() + 7 * 24 * 60 * 60 * 1000); // +1 week
    } else {
      // month
      const mm = (current.getMonth() + 1).toString().padStart(2, "0");
      const yy = current.getFullYear();
      label = `${mm}/${yy}`;
      // increment month safely
      const next = new Date(current);
      next.setMonth(next.getMonth() + 1);
      current = next;
    }

    buckets.push({ time: label, visits: 0 });
  }

  return buckets;
};

/**
 * label formatter for a JS Date according to bucket type (must match generateBuckets)
 */
const formatLabelFromDate = (bucket, dateObj) => {
  const dt = new Date(dateObj);
  if (bucket === "minute") {
    const hh = dt.getHours().toString().padStart(2, "0");
    const mm = dt.getMinutes().toString().padStart(2, "0");
    return `${hh}:${mm}`;
  }
  if (bucket === "hour") {
    const hh = dt.getHours().toString().padStart(2, "0");
    return `${hh}:00`;
  }
  if (bucket === "day") {
    const dd = dt.getDate().toString().padStart(2, "0");
    const mm = (dt.getMonth() + 1).toString().padStart(2, "0");
    return `${dd}/${mm}`;
  }
  if (bucket === "week") {
    const tmp = new Date(dt);
    const firstJan = new Date(tmp.getFullYear(), 0, 1);
    const days = Math.floor((tmp - firstJan) / (24 * 60 * 60 * 1000));
    const weekNo = Math.ceil((days + firstJan.getDay() + 1) / 7);
    return `Wk ${weekNo}`;
  }
  // month
  const mm = (dt.getMonth() + 1).toString().padStart(2, "0");
  const yy = dt.getFullYear();
  return `${mm}/${yy}`; 
};

/* ---------------------- controllers ---------------------- */
export const addVisitCount = async (req, res) => {
  try {
    const deviceId = req.body.deviceId;

    console.log("The deviceId is here: ",deviceId)
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress;


      
      if (!deviceId) {
        return res.status(400).json({
          success: false,
          message: "Device ID missing",
        });
      }

    // ❌ Ignore your own devices
    const IGNORED_DEVICE_IDS = [
      "c56a8cdb-0a17-4cb5-b3f9-5c0180b5857f",
    ];
    if (IGNORED_DEVICE_IDS.includes(deviceId)) {
      return res.status(200).json({
        success: true,
        ignored: true,
        message: "Visit ignored (admin device)",
      });
    }

    // 📅 Today range
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // 🔁 Check if THIS DEVICE already visited today
    const alreadyVisitedToday = await VisitCountModel.findOne({
      deviceId,
      visitedAt: { $gte: startOfDay, $lte: endOfDay },
    });

    if (alreadyVisitedToday) {
      return res.status(200).json({
        success: true,
        message: "Visit already counted today",
      });
    }

    // ✅ Record visit
    await VisitCountModel.create({
      deviceId,
      ip,
      visitedAt: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Visit recorded",
    });

  } catch (error) {
    console.error("addVisitCount error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getVisitCount = async (req, res) => {
  try {
    const now = new Date();
    const oneHour = new Date(now.getTime() - 1 * 60 * 60 * 1000);
    const twelveHours = new Date(now.getTime() - 12 * 60 * 60 * 1000);
    const oneDay = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const thirtyDays = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixMonths = new Date(now.getTime() - 182 * 24 * 60 * 60 * 1000);
    const oneYear = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    const counts = {
      last1Hour: await VisitCountModel.countDocuments({ visitedAt: { $gte: oneHour } }),
      last12Hours: await VisitCountModel.countDocuments({ visitedAt: { $gte: twelveHours } }),
      last1Day: await VisitCountModel.countDocuments({ visitedAt: { $gte: oneDay } }),
      last30Days: await VisitCountModel.countDocuments({ visitedAt: { $gte: thirtyDays } }),
      last6Months: await VisitCountModel.countDocuments({ visitedAt: { $gte: sixMonths } }),
      last1Year: await VisitCountModel.countDocuments({ visitedAt: { $gte: oneYear } }),
      total: await VisitCountModel.countDocuments(),
    };

    return res.status(200).json({ success: true, data: counts });
  } catch (error) {
    console.error("getVisitCount error:", error);
    return res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};

/**
 * main range endpoint
 * query: type=1hour|12hour|1day|7day|1month|6month|1year
 */
export const getVisitsByRange = async (req, res) => {
  try {
    const type = (req.query.type || "1day").toString();
    const now = new Date();

    let start;
    let bucketUnit;

    switch (type) {
      case "1hour":
        start = new Date(now.getTime() - 60 * 60 * 1000);
        bucketUnit = "minute";
        break;
      case "12hour":
        start = new Date(now.getTime() - 12 * 60 * 60 * 1000);
        bucketUnit = "hour";
        break;
      case "1day":
        start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        bucketUnit = "hour";
        break;
      case "7day":
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        bucketUnit = "day";
        break;
      case "1month":
        start = new Date(now);
        start.setMonth(start.getMonth() - 1);
        bucketUnit = "day";
        break;
      case "6month":
        start = new Date(now);
        start.setMonth(start.getMonth() - 6);
        bucketUnit = "week";
        break;
      case "1year":
        start = new Date(now);
        start.setFullYear(start.getFullYear() - 1);
        bucketUnit = "month";
        break;
      default:
        start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        bucketUnit = "hour";
    }

    // Align the start to bucket boundary
    start = floorDate(start, bucketUnit);
    // endExclusive = now + 1ms to safely use < endExclusive
    const endExclusive = new Date(now.getTime() + 1);

    // create buckets (labels)
    const buckets = generateBuckets(start, endExclusive, bucketUnit);

    // Use $dateTrunc to group by bucket with timezone
    const pipeline = [
      { $match: { visitedAt: { $gte: start, $lt: endExclusive } } },
      {
        $group: {
          _id: {
            $dateTrunc: {
              date: "$visitedAt",
              unit: bucketUnit,
              binSize: 1,
              timezone: "Asia/Kolkata",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ];

    const aggResult = await VisitCountModel.aggregate(pipeline);

    // Fill buckets using same label formatting
    for (const row of aggResult) {
      const dateKey = row._id; // this will be an ISODate (truncated)
      const label = formatLabelFromDate(bucketUnit, dateKey);
      const entry = buckets.find((b) => b.time === label);
      if (entry) entry.visits = row.count;
      // if not found, ignore (shouldn't happen if generateBuckets aligned)
    }

    const totalVisits = await VisitCountModel.countDocuments({
      visitedAt: { $gte: start, $lt: endExclusive },
    });

    return res.json({ success: true, totalVisits, data: buckets });
  } catch (err) {
    console.error("getVisitsByRange error →", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * custom range endpoint expects start and end as ISO strings or any Date-parsable strings
 * query: ?start=2025-12-10T00:00&end=2025-12-12T23:59
 */
export const getVisitsByCustomRange = async (req, res) => {
  try {
    let { start: startQ, end: endQ } = req.query;
    if (!startQ || !endQ) {
      return res.status(400).json({ success: false, message: "start and end required" });
    }
    const startRaw = new Date(startQ);
    const endRaw = new Date(endQ);
    if (isNaN(startRaw) || isNaN(endRaw)) {
      return res.status(400).json({ success: false, message: "Invalid dates" });
    }

    // choose bucket by diff
    const diffHours = (endRaw - startRaw) / (1000 * 60 * 60);
    let bucketUnit;
    if (diffHours <= 3) bucketUnit = "minute";
    else if (diffHours <= 48) bucketUnit = "hour";
    else if (diffHours <= 24 * 31) bucketUnit = "day";
    else if (diffHours <= 24 * 180) bucketUnit = "week";
    else bucketUnit = "month";

    // align start to bucket
    const start = floorDate(startRaw, bucketUnit);
    const endExclusive = new Date(endRaw.getTime() + 1);

    const buckets = generateBuckets(start, endExclusive, bucketUnit);

    const pipeline = [
      { $match: { visitedAt: { $gte: start, $lt: endExclusive } } },
      {
        $group: {
          _id: {
            $dateTrunc: {
              date: "$visitedAt",
              unit: bucketUnit,
              binSize: 1,
              timezone: "Asia/Kolkata",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ];

    const aggResult = await VisitCountModel.aggregate(pipeline);

    for (const row of aggResult) {
      const label = formatLabelFromDate(bucketUnit, row._id);
      const entry = buckets.find((b) => b.time === label);
      if (entry) entry.visits = row.count;
    }

    const totalVisits = await VisitCountModel.countDocuments({
      visitedAt: { $gte: start, $lt: endExclusive },
    });

    return res.json({ success: true, totalVisits, data: buckets });
  } catch (err) {
    console.error("getVisitsByCustomRange error →", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};