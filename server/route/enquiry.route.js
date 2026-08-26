// routes/enquiry.routes.js
import express from "express";
import {
  createEnquiry,
  getAllEnquiries,
  getEnquiriesByUser,
  deleteEnquiry,
} from "../controllers/enquiry.controller.js";

import auth from "../middlewares/auth.js";

const enquiryRouter = express.Router();

// ✅ Create a new enquiry
enquiryRouter.post("/", createEnquiry);

// ✅ Admin: Get all enquiries
enquiryRouter.get("/admin", auth, getAllEnquiries);

// ✅ Get all enquiries of a specific user (client-side)
enquiryRouter.get("/user", auth, getEnquiriesByUser);


// ✅ Delete enquiry by ID
enquiryRouter.delete("/:id", auth, deleteEnquiry);

export default enquiryRouter;
