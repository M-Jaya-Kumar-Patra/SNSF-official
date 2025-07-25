import { Router } from "express";
  
import { registerAdminController, verifyEmailController, loginController, logoutController, adminAvatarController, removeImageFromCloudinary, updateAdminDetails, forgotPasswordController, verifyForgotPasswordOtp, resetPassword, refreshToken, adminDetails, changePassword, resendOTP} from "../controllers/admin.controller.js";

import auth from "../middlewares/auth.js"; // Adjust the path as necessary
import upload from "../middlewares/multer.js";


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



export default adminRouter;
