import { Router } from "express";
  
import { registerAdminController, verifyEmailController, loginController, logoutController, adminAvatarController, removeImageFromCloudinary, updateAdminDetails, forgotPasswordController, verifyForgotPasswordOtp, resetPassword, refreshToken, adminDetails, changePassword, resendOTP, } from "../controllers/admin.controller.js";

import { promotionalEmail, promotionalImage, promotionalRecipients } from "../controllers/admin.controller.js";

import auth from "../middlewares/auth.js"; // Adjust the path as necessary
import { campaignAdmin } from "../middlewares/campaignAdmin.js";
import upload from "../middlewares/multer.js";


import { getAdminStats } from "../controllers/stats.controller.js";

const adminRouter = Router();

adminRouter.post("/register", registerAdminController);
adminRouter.post("/verifyEmail", verifyEmailController);
adminRouter.post("/login", loginController);
adminRouter.get("/logout", auth, logoutController);  
adminRouter.put("/admin-avatar", auth, upload.array('avatar'), adminAvatarController);
adminRouter.delete("/remove-img", auth, removeImageFromCloudinary);
adminRouter.put('/:id', auth, updateAdminDetails)
adminRouter.post('/forgot-password', forgotPasswordController)
adminRouter.post('/verify-forgot-password-otp', verifyForgotPasswordOtp)
adminRouter.post('/reset-password', resetPassword)
adminRouter.post('/refresh-token', refreshToken)
adminRouter.get('/admin-details', auth, adminDetails)
adminRouter.post('/changePassword', auth, changePassword)
adminRouter.post("/resendOTP", resendOTP)
adminRouter.post("/send-promotional-email", auth, campaignAdmin, promotionalEmail)
adminRouter.post("/promotional-image", auth, campaignAdmin, upload.single("image"), promotionalImage)
adminRouter.get("/promotional-recipients", auth, campaignAdmin, promotionalRecipients)



adminRouter.get("/admin/stats", getAdminStats);



export default adminRouter;
