import mongoose from "mongoose";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import AddressModel from "../models/address.model.js";
import { v2 as cloudinary } from "cloudinary";
import NotificationModel from "../models/notification.model.js";


import fs from "fs";
import { response } from "express";
import { error } from "console";





cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_API_Key,
    api_secret: process.env.cloudinary_Config_API_Secret,
    secure: true
});


let imagesArr = []


export async function sendNotification(request, response) {
  try {
    const { recipientId, message, image, link, read } = request.body;

    // Validate recipient existence
    const recipient = await UserModel.findById(recipientId);
    if (!recipient) {
      return response.status(404).json({
        error: true,
        success: false,
        message: "Recipient user not found",
      });
    }

        

    // Create a new notification
    const notify = new NotificationModel({
      recipientId: new mongoose.Types.ObjectId(recipientId), // ensure ObjectId type
      message,
      image,
      link,
      read,
    });

    const savedNotification = await notify.save();

    // Update user's notification array
    await UserModel.findByIdAndUpdate(
      recipientId,
      { $push: { notification_array: savedNotification._id } },
      { new: true }
    );

    return response.status(200).json({
      message: "Notification created successfully",
      data: savedNotification,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    return response.status(500).json({
      error: true,
      success: false,
      message: error.message || "Internal server error",
    });
  }
}


export async function getNotifications(req, res) {
  try {
    const userId = req.userId; // ✅ Corrected here

    if (!userId) {
      return res.status(401).json({
        error: true,
        success: false,
        message: "Unauthorized: User ID not found",
      });
    }

    const notifications = await NotificationModel.find({
      recipientId: new mongoose.Types.ObjectId(userId),
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      error: false,
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({
      error: true,
      success: false,
      message: error.message || "Failed to fetch notifications",
    });
  }
}


export async function markAllUnreadAsRead(req, res) {
  try {
    const userId = req.userId; // assuming middleware sets this

    if (!userId) {
      return res.status(401).json({
        error: true,
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await NotificationModel.updateMany(
      { recipientId: userId, read: false },
      { $set: { read: true } }
    );

    return res.status(200).json({
      success: true,
      message: `Marked ${result.modifiedCount} notifications as read`,
    });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to mark notifications as read",
    });
  }
}
