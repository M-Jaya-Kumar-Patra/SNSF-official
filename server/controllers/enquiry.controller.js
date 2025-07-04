// controllers/enquiryController.js
import enquiryModel from "../models/enquiry.model.js";

// CREATE a new enquiry
export const createEnquiry = async (req, res) => {
  try {
    const { userId, productId, message, userMsg, image, contactInfo } = req.body;

    if (!userId || !productId || !message || !userMsg) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newEnquiry = await enquiryModel.create({
      userId,
      productId,
      message,
      userMsg,
      image,
      contactInfo,
    });

    res.status(201).json({ success: true, data: newEnquiry });
  } catch (error) {
    console.error("❌ Error creating enquiry:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET all enquiries (for Admin Panel)
export const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await enquiryModel.find()
      .populate("userId", "name email")
      .populate("productId", "name");

    res.status(200).json({ success: true, data: enquiries });
  } catch (error) {
    console.error("❌ Error fetching enquiries:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET enquiries by userId (Client)
export const getEnquiriesByUser = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    const userEnquiries = await enquiryModel.find({ userId })
      .populate("productId", "name");

    res.status(200).json({ success: true, data: userEnquiries });
  } catch (error) {
    console.error("❌ Error fetching user enquiries:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// DELETE an enquiry
export const deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    await enquiryModel.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Enquiry deleted" });
  } catch (error) {
    console.error("❌ Error deleting enquiry:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
