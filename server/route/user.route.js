import { Router } from "express";
  
import { registerUserController, verifyEmailController, authWithGoogle, loginController, logoutController, userAvatarController, removeImageFromCloudinary, updateUserDetails, forgotPasswordController, verifyForgotPasswordOtp, resetPassword, refreshToken, userDetails, changePassword, addAddress , getUserAddress, deleteAddress, updateUserAddress, resendOTP, setPassword,
     getRelatedProductsByCategory, getAllUsers   , getCurrentlyLoggedInUsers,
  getLoggedOutUsers,
  getLoginMethodStats,  
} from "../controllers/user.controller.js";

import { getMostActiveUsers } from "../controllers/loginAnalytics.controller.js";


import auth from "../middlewares/auth.js"; // Adjust the path as necessary
import upload from "../middlewares/multer.js";

const userRouter = Router();

userRouter.post("/register", registerUserController);
userRouter.post("/verifyEmail", verifyEmailController);
userRouter.post("/login", loginController);
userRouter.post("/authWithGoogle", authWithGoogle);
userRouter.get("/logout", logoutController);  
userRouter.post("/user-avatar", auth, upload.array('avatar', 1), userAvatarController);
userRouter.delete("/remove-img", auth, removeImageFromCloudinary);
userRouter.put('/:id', auth, updateUserDetails)
userRouter.post('/forgot-password', forgotPasswordController)
userRouter.post('/verify-forgot-password-otp', verifyForgotPasswordOtp)
userRouter.post('/reset-password', resetPassword)
userRouter.post('/refresh-token', refreshToken)
userRouter.get('/user-details', auth, userDetails)
userRouter.post('/changePassword', auth, changePassword)
userRouter.post('/setPassword', auth, setPassword)
userRouter.post("/addAddress", auth, addAddress)
userRouter.get("/getAddress/:id", auth, getUserAddress)
userRouter.delete("/:id/address/:addressId", auth, deleteAddress)
userRouter.post("/:id/address/:addressId", auth, updateUserAddress)
userRouter.post("/resendOTP", resendOTP)

userRouter.get("/getCategoriesByProductId", getRelatedProductsByCategory);


userRouter.get("/getAllUsers", getAllUsers);

userRouter.get("/getMostActiveUsers", getMostActiveUsers);



userRouter.get("/analytics/active-users", getCurrentlyLoggedInUsers);
userRouter.get("/analytics/logged-out-users", getLoggedOutUsers);
userRouter.get("/analytics/login-methods", getLoginMethodStats);




export default userRouter;
