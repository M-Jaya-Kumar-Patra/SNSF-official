// server/controllers/visitCount.controller.js

import VisitCountModel from "../models/visitCount.model.js";

export const addVisitCount = async (req, res) => {
  try {
    let visitDoc = await VisitCountModel.findOne();

    if (visitDoc) {
      visitDoc.count += 1;
      await visitDoc.save();
    } else {
      visitDoc = await VisitCountModel.create({ count: 1 });
    }

    return res.status(200).json({
      success: true,
      message: "Visit count incremented",
      data: visitDoc.count,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};


// Get current visit count
export const getVisitCount = async (req, res) => {
  try {
    let countDoc = await VisitCountModel.findOne();
    if (!countDoc) {
      // If no document exists, create one with 0
      countDoc = new VisitCountModel({ count: 0 });
      await countDoc.save();
    }

    return res.status(200).json({
      success: true,
      count: countDoc.count,
    });
  } catch (error) {
    console.error("Error fetching visit count:", error.message);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
};