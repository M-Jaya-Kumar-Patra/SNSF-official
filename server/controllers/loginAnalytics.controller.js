import LoginHistoryModel from "../models/loginHistory.model.js";
import UserModel from "../models/user.model.js";

export const getMostActiveUsers = async (req, res) => {
  try {
    const { type = "1day", start, end } = req.query;

    let startDate, endDate = new Date();

    if (start && end) {
      startDate = new Date(start);
      endDate = new Date(end);
    } else {
      const now = new Date();
      switch (type) {
        case "1hour":
          startDate = new Date(now.getTime() - 60 * 60 * 1000);
          break;
        case "12hour":
          startDate = new Date(now.getTime() - 12 * 60 * 60 * 1000);
          break;
        case "1day":
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case "7day":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "1month":
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case "6month":
          startDate = new Date(now.setMonth(now.getMonth() - 6));
          break;
        case "1year":
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      }
    }

    // Aggregate login counts per user
    const logins = await LoginHistoryModel.aggregate([
      { $match: { loggedInAt: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: "$userId", logins: { $sum: 1 } } },
      { $sort: { logins: -1 } },
      { $limit: 20 },
    ]);

    const userIds = logins.map((u) => u._id);
    const users = await UserModel.find({ _id: { $in: userIds } })
      .select("name email avatar");

    const data = logins.map((login) => {
      const user = users.find((u) => u._id.equals(login._id));
      return {
        userId: user?._id,
        name: user?.name || "Unknown User",
        email: user?.email || "",
        avatar: user?.avatar || "",
        logins: login.logins,
      };
    });

    const totalLogins = logins.reduce((sum, l) => sum + l.logins, 0);

    res.json({
      success: true,
      totalLogins,  
      data,
    });
  } catch (error) {
    console.error("Error in getMostActiveUsers:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};


export const getLoginActivity = async (req, res) => {
  try {
    let start, end;

    // 🔹 CUSTOM RANGE
    if (req.query.start && req.query.end) {
      start = new Date(req.query.start);
      end = new Date(req.query.end);
    } else {
      // 🔹 PRESET RANGE
      const now = new Date();
      end = now;

      switch (req.query.type) {
        case "1hour":
          start = new Date(now.getTime() - 60 * 60 * 1000);
          break;
        case "12hour":
          start = new Date(now.getTime() - 12 * 60 * 60 * 1000);
          break;
        case "1day":
          start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case "7day":
          start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "6month":
          start = new Date(new Date().setMonth(now.getMonth() - 6));
          break;
        case "1year":
          start = new Date(new Date().setFullYear(now.getFullYear() - 1));
          break;
        default:
          start = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      }
    }

    const diffHours = (end - start) / (1000 * 60 * 60);

    const unit =
      diffHours <= 1 ? "minute" :
      diffHours <= 48 ? "hour" :
      diffHours <= 24 * 31 ? "day" :
      "week";

    const pipeline = [
      {
        $match: {
          loggedInAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: {
            $dateTrunc: {
              date: "$loggedInAt",
              unit,
              timezone: "Asia/Kolkata"
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          time: "$_id",
          logins: "$count"
        }
      },
      { $sort: { time: 1 } }
    ];

    const result = await LoginHistoryModel.aggregate(pipeline);

    res.json({
      success: true,
      unit,
      total: result.reduce((s, x) => s + x.logins, 0),
      data: result
    });

  } catch (err) {
    console.error("getLoginActivity Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
