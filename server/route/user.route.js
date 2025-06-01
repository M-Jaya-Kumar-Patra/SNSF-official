import { Router } from "express";
  
import { registerUserController, verifyEmailController, authWithGoogle, loginController, logoutController, userAvatarController, removeImageFromCloudinary, updateUserDetails, forgotPasswordController, verifyForgotPasswordOtp, resetPassword, refreshToken, userDetails } from "../controllers/user.controller.js";

import auth from "../middlewares/auth.js"; // Adjust the path as necessary
import upload from "../middlewares/multer.js";

const userRouter = Router();

userRouter.post("/register", registerUserController);
userRouter.post("/verifyEmail", verifyEmailController);
userRouter.post("/login", loginController);
userRouter.post("/authWithGoogle", authWithGoogle);

userRouter.get("/logout", auth, logoutController);  
userRouter.put("/user-avatar", auth, upload.array('avatar'), userAvatarController);
userRouter.delete("/remove-img", auth, removeImageFromCloudinary);
userRouter.put('/:id', auth, updateUserDetails)
userRouter.post('/forgot-password', forgotPasswordController)
userRouter.post('/verify-forgot-password-otp', verifyForgotPasswordOtp)
userRouter.post('/reset-password', resetPassword)
userRouter.post('/refresh-token', refreshToken)
userRouter.get('/user-details', auth, userDetails)

export default userRouter;
