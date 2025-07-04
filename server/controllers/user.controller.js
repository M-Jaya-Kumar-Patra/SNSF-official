import mongoose from "mongoose";
import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmailFun from "../config/sendEmail.js";
import verificationEmail from "../utils/EmailTemplates/verifyEmailTemplate.js";
import generatedAccessToken from '../utils/generatedAccessToken.js';
import generatedRefreshToken from '../utils/generatedRefreshToken.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { error } from "console";
import { hash } from "crypto";
import AddressModel from "../models/address.model.js";
import welcomeEmail from "../utils/EmailTemplates/welcomeEmailTemplate.js";
import forgotPasswordEmail from "../utils/EmailTemplates/forgotPasswordTemplate.js";
import passwordResetSuccessEmail from "../utils/EmailTemplates/passwordResetSuccessEmail.js";
import newLoginEmail from "../utils/EmailTemplates/loginTemplate.js";

cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_API_Key,
    api_secret: process.env.cloudinary_Config_API_Secret,
    secure: true
});

var imagesArr = [];

export async function registerUserController(request, response) {
    try {
        const { name, email, password } = request.body;
        console.log("registerUserController triggered");

        if (!name || !email || !password) {
            return response.status(400).json({
                message: "Provide name, email, and password",
                error: true,
                success: false
            });
        }

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        let user;

        const existingUser = await UserModel.findOne({ email });

        if (existingUser && existingUser.verify_email) {
            return response.status(400).json({
                message: "User already registered with this email",
                error: true,
                success: false
            });
        }

        if (existingUser && !existingUser.verify_email) {
            // 🛠 Update existing unverified user
            existingUser.name = name;
            existingUser.password = hashPassword;
            existingUser.otp = verifyCode;
            existingUser.otpExpires = Date.now() + 600000;
            await existingUser.save();
            user = existingUser;
        } else {
            // ✅ Create new user
            user = new UserModel({
                name,
                email,
                password: hashPassword,
                otp: verifyCode,
                otpExpires: Date.now() + 600000
            });
            await user.save();
        }

        // 📧 Send verification email
        await sendEmailFun(
            email,
            "Verify your email – SNSF",
            "",
            verificationEmail(name, verifyCode)
        );

        // 🔐 Generate JWT token
        const token = jwt.sign(
            { email: user.email, id: user._id },
            process.env.JWT_SECRET
        );

        return response.status(200).json({
            message: "OTP sent successfully",
            error: false,
            success: true,
            token,
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            }
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}


export async function verifyEmailController(request, response) {
    try {
        const { email, otp } = request.body;
        console.log("✅ verifyEmailController triggered");

        if (!email || !otp) {
            return response.status(400).json({
                message: "Provide email and OTP",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        if (user.verify_email) {
            return response.status(400).json({
                message: "Email already verified",
                error: true,
                success: false
            });
        }

        if (user.otp !== otp.toString()) {
            return response.status(400).json({
                message: "Invalid OTP",
                error: true,
                success: false
            });
        }

        if (user.otpExpires < Date.now()) {
            return response.status(400).json({
                message: "OTP expired",
                error: true,
                success: false
            });
        }

        user.verify_email = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // Try to send welcome email, but don't break if it fails
        try {
            await sendEmailFun(
                email,
                "Welcome to S N Steel Fabrication – We’re glad to have you here!",
                "",
                welcomeEmail(user.name)
            );
            console.log("📨 Welcome email sent to:", email);
        } catch (emailErr) {
            console.error("⚠️ Failed to send welcome email:", emailErr.message || emailErr);
        }

        return response.status(200).json({
            message: "Email verified successfully",
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}


export async function loginController(request, response) {
    try {
        const { email, password } = request.body;
        console.log("loginController triggered")


        if (!email || !password) {
            return response.status(400).json({
                message: "Provide email and password",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        if (user.status !== "Active") {
            return response.status(400).json({
                message: "User is not active",
                error: true,
                success: false
            });
        }

        if (user.verify_email !== true) {
            return response.status(400).json({
                message: "Your email is not verified yet please verify your email first",
                error: true,
                success: false
            });
        }


        const checkPassword = await bcryptjs.compare(password, user.password);
        if (!checkPassword) {
            return response.status(400).json({
                message: "Check your password",
                error: true,
                success: false
            });
        }

        const accessToken = await generatedAccessToken(user._id);
        const refreshToken = await generatedRefreshToken(user._id);

        await UserModel.findByIdAndUpdate(user._id, {
            last_login_date: new Date()
        });

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            maxAge: 5 * 60 * 60 * 1000 // 5 hours
        };

        console.log(user?.body?.name)
        response.cookie("accessToken", accessToken, cookieOptions);
        response.cookie("refreshToken", refreshToken, cookieOptions);
        console.log(accessToken, refreshToken)

        await sendEmailFun(
            email,
             "New Login Detected – SNSF",
            "",
            newLoginEmail(user?.name)
        );

        return response.json({
            message: "Login successfully",
            error: false,
            success: true,
            data: {
                accessToken,
                refreshToken,
                id: user._id,
                email: email,
                name: user.name,
                avatar: user.avatar,
                phone: user.phone
            }
        });
    }
    catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function authWithGoogle(request, response) {
    try {
        const { name, email, password, avatar, phone, signUpWithGoogle, role } = request.body;
        const existingUser = await UserModel.findOne({ email: email })

        if (!existingUser) {
            const user = await UserModel.create({
                name: name,
                phone: phone,
                email: email,
                password: null,
                avatar: avatar,
                role: role,
                verify_email: true,
                emailVerified: true,
                signUpWithGoogle: true

            });

            await user.save()
            const accessToken = await generatedAccessToken(user._id);
            const refreshToken = await generatedRefreshToken(user._id);

            await UserModel.findByIdAndUpdate(user._id, {
                last_login_date: new Date()
            });

            const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
                maxAge: 5 * 60 * 60 * 1000 // 5 hours
            };

            console.log(user?.body?.name)
            response.cookie("accessToken", accessToken, cookieOptions);
            response.cookie("refreshToken", refreshToken, cookieOptions);

            return response.json({
                message: "Login successfully",
                error: false,
                success: true,
                data: {
                    accessToken,
                    refreshToken
                },
                user: {
                    id: request.userId,
                    email: email,
                    name: user.name
                }
            });
        }



        else {
            const accessToken = await generatedAccessToken(existingUser._id);
            const refreshToken = await generatedRefreshToken(existingUser._id);

            await UserModel.findByIdAndUpdate(existingUser._id, {
                last_login_date: new Date()
            });

            const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
                maxAge: 5 * 60 * 60 * 1000 // 5 hours
            };

            console.log(user?.body?.name)
            response.cookie("accessToken", accessToken, cookieOptions);
            response.cookie("refreshToken", refreshToken, cookieOptions);

            return response.json({
                message: "Login successfully",
                error: false,
                success: true,
                data: {
                    accessToken,
                    refreshToken
                },
                user: {
                    id: request.userId,
                    email: email,
                    name: user.name
                }
            });
        }
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function logoutController(request, response) {
    try {
        const userid = request.userId;
        console.log("logoutController Triggered")

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        };

        response.clearCookie('accessToken', cookieOptions);
        response.clearCookie('refreshToken', cookieOptions);

        await UserModel.findByIdAndUpdate(userid, {
            refresh_token: ""
        });

        return response.status(200).json({
            message: "User logged out successfully",
            error: false,
            success: true
        });
    }
    catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function userAvatarController(request, response) {
    try {
        console.log("userAvatarController Triggered")
        const userId = request.userId;
        console.log("User ID from token:", userId);
        console.log("Is valid ObjectId:", mongoose.Types.ObjectId.isValid(userId));

        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return response.status(400).json({
                message: "Invalid user ID",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        // Delete old avatar from cloudinary if 'img' query param is present
        const oldImgUrl = request.query.img;
        if (oldImgUrl) {
            try {
                const urlArr = oldImgUrl.split("/");
                const avatarImage = urlArr[urlArr.length - 1]; // e.g., "avatar123.jpg"
                const imageName = avatarImage.split(".")[0];   // "avatar123"

                if (imageName) {
                    const destroyResult = await cloudinary.uploader.destroy(imageName);
                    console.log("Cloudinary destroy result:", destroyResult);
                }
            } catch (err) {
                console.error("Cloudinary destroy error:", err);
            }
        }

        // Check for uploaded files
        const files = request.files;
        if (!files || files.length === 0) {
            return response.status(400).json({
                message: "No files uploaded",
                error: true,
                success: false
            });
        }

        // Limit to one avatar image
        if (files.length > 1) {
            return response.status(400).json({
                message: "Only one avatar image is allowed",
                error: true,
                success: false
            });
        }

        const imagesArr = [];
        const uploadOptions = {
            use_filename: true,
            unique_filename: false,
            overwrite: false,
        };

        for (const file of files) {
            try {
                const result = await cloudinary.uploader.upload(file.path, uploadOptions);
                console.log("Cloudinary upload result:", result);
                imagesArr.push(result.secure_url);

                // Remove local file
                fs.unlinkSync(file.path);
                console.log("Deleted local file:", file.filename);
            } catch (err) {
                console.error("Upload/Delete error:", err);
                return response.status(500).json({
                    message: "Error uploading image",
                    error: true,
                    success: false
                });
            }
        }

        // Update user avatar
        user.avatar = imagesArr[0];
        await user.save();

        return response.status(200).json({
            _id: userId,
            avatar: imagesArr[0],
            message: "Avatar updated successfully",
            error: false,
            success: true
        });

    } catch (error) {
        console.error("Error in userAvatarController:", error);
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}


export async function removeImageFromCloudinary(request, response) {
    try {
        const imgUrl = request.query.img;
        const userId = request.userId || request.query.userId; // Prefer token, fallback to query

        if (!imgUrl || !userId) {
            return response.status(400).json({
                message: "Image URL or User ID missing",
                error: true,
                success: false
            });
        }

        const urlArr = imgUrl.split("/");
        const image = urlArr[urlArr.length - 1];
        const imageName = image.split(".")[0];

        if (!imageName) {
            return response.status(400).json({
                message: "Invalid image name",
                error: true,
                success: false
            });
        }

        const destroyResult = await cloudinary.uploader.destroy(imageName);
        console.log("Cloudinary destroy result:", destroyResult);

        if (destroyResult.result !== "ok") {
            return response.status(400).json({
                message: "Failed to delete image from Cloudinary",
                error: true,
                success: false
            });
        }

        // Now unset avatar field in MongoDB
        await UserModel.findByIdAndUpdate(userId, {
            $unset: { avatar: "" }
        });

        return response.status(200).json({
            message: "Image deleted and avatar removed from user profile",
            error: false,
            success: true
        });
    } catch (error) {
        console.error("Error removing image:", error);
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function updateUserDetails(request, response) {
    console.log("0")

    try {

        const userId = request.userId
        console.log("1")
        const { name, email, phone, password } = request.body

        const userExist = await UserModel.findById(userId);

        if (!userExist) {
            return response.status(400).json({
                message: "The User cannot be updated!",
                error: true,
                success: false
            });
        }



        let verifyCode = ""

        if (email !== userExist.email) {
            verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        }

        let hashPassword = ""
        console.log("11")

        if (password) {
            const salt = await bcryptjs.genSalt(10)
            hashPassword = await bcryptjs.hash(password, salt)
        } else {
            hashPassword = userExist.password
        }
        console.log("111")

        const updateUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                name: name,
                phone: phone,
                email: email,
                verify_email: email !== userExist.email ? false : true,
                password: hashPassword,
                otp: verifyCode !== "" ? verifyCode : null,
                otpExpires: verifyCode !== "" ? Date.now() + 600000 : null,
            },
            { new: true }
        );
        console.log("1111")

        if (email !== userExist.email) {
            await sendEmailFun({
                sendTo: email,
                subject: "Verify email from Ecommerce App",
                text: "", // Optional plain text version
                html: verificationEmail(name, verifyCode)
            });
        }

        console.log("11111")

        return response.status(200).json({
            message: "User updated successfully",
            error: false,
            success: true,
            user: {
                name: updateUser?.name,
                _id: updateUser?._id,
                email: updateUser?.email,
                phone: updateUser?.phone,
                avatar: updateUser?.avatar
            }
        });
        console.log("111111")

    } catch (error) {
        console.log("1111111")

        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function forgotPasswordController(request, response) {
    try {
        const { email } = request.body

        const user = await UserModel.findOne({ email: email })

        if (!user) {
            return response.status(400).json({
                message: "Email not available",
                error: true,
                success: false
            })
        }
        else {
            let verifyCode = Math.floor(100000 + Math.random() * 900000).toString()


            user.otp = verifyCode,
                user.otpExpires = Date.now() + 600000

            await user.save();




            await sendEmailFun(
                email,
                "Reset Your Password – SNSF",
                "",
                forgotPasswordEmail(user?.name, verifyCode)
            );

            return response.json({
                message: "Check your email",
                error: false,
                success: true
            })
        }

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function verifyForgotPasswordOtp(request, response) {
    try {
        const { email, otp } = request.body;

        const user = await UserModel.findOne({ email: email })

        if (!user) {
            return response.status(400).json({
                message: "Email not available",
                error: true,
                success: false
            })
        }

        if (!email || !otp) {
            return response.status(400).json({
                message: "Provide required fields Email, OTP",
                error: true,
                success: false
            })
        }


        if (otp !== user.otp) {
            return response.status(400).json({
                message: "Invalid OTP",
                error: true,
                success: false
            })
        }

        const currentTime = new Date().toISOString();

        if (user.otpExpires < currentTime) {
            return response.status(400).json({
                message: "OTP is expired",
                error: true,
                success: false
            });
        }

        user.otp = ""
        user.otpExpires = ""

        await user.save()

        await sendEmailFun(
            email,
            "Your SNSF Password Has Been Changed",
            "",
            passwordResetSuccessEmail(user?.name)
        );




        return response.status(200).json({
            message: "OTP verified successfully",
            error: false,
            success: true
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function resetPassword(request, response) {
    try {
        const { email, newPassword, confirmPassword } = request.body

        if (!email || !newPassword || !confirmPassword) {
            return response.status(400).json({
                message: "Provide All the required fields",

            })
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return response.status(400).json({
                message: "Email is not available",
                error: true,
                success: false
            })
        }

        if (newPassword !== confirmPassword) {
            return response.status(400).json({
                message: "New password and Confirm password must be same",
                error: true,
                success: false
            })
        }

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(newPassword, salt);

        user.password = hashPassword;
        await user.save();

        return response.status(200).json({
            message: "Password updated successfully",
            error: false,
            success: true
        })



    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }

}

export async function changePassword(request, response) {
    try {
        const { email, oldPassword, newPassword, confirmPassword } = request.body

        if (!email || !oldPassword || !newPassword || !confirmPassword) {
            return response.status(400).json({
                message: "Provide All the required fields",

            })
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return response.status(400).json({
                message: "Email is not registered",
                error: true,
                success: false
            })
        }

        const salt = await bcryptjs.genSalt(10);
        const hashOldPassword = await bcryptjs.hash(oldPassword, salt);

        console.log(user.password)
        console.log(oldPassword)
        console.log(hashOldPassword)
        const isPasswordCorrect = await bcryptjs.compare(oldPassword, user.password);

        console.log(isPasswordCorrect)

        if (!isPasswordCorrect) {
            return response.status(400).json({
                message: "Please check your old password",
                error: true,
                success: false
            })
        }

        if (newPassword === oldPassword) {
            return response.status(400).json({
                message: "Your new password is same as you old password. Try different.",
                error: true,
                success: false
            })
        }

        if (newPassword !== confirmPassword) {
            return response.status(400).json({
                message: "New password and Confirm password must be same",
                error: true,
                success: false
            })
        }


        const hashPassword = await bcryptjs.hash(newPassword, salt);

        user.password = hashPassword;
        await user.save();

        return response.status(200).json({
            message: "Password updated successfully",
            error: false,
            success: true
        })



    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }

}

export async function refreshToken(request, response) {
    try {
        const refreshToken = request.cookies.refeshToken || request?.headers?.authorization?.split(".")[1]

        if (!refreshToken) {
            return response.status(401).json({
                message: "Invalid Token",
                error: true,
                success: false
            })
        }

        const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN)

        if (!verifyToken) {
            return response.status(401).json({
                message: "Token is expired",
                error: true,
                success: false
            })
        }

        const userId = verifyToken?._id;
        const newAccessToken = await generatedAccessToken(userId)

        const cookieOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        response.cookie('accessToken', newAccessToken, cookieOption)

        return response.json({
            message: "New Access token generated",
            error: false,
            success: true,
            data: {
                accessToken: newAccessToken
            }
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function userDetails(request, response) {
    try {
        const userId = request.userId;
        console.log("userId:", userId);

        const user = await UserModel.findById(userId).select("-password -refresh_token");

        if (!user) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false,
            });
        }

        return response.json({
            message: "User details",
            data: user,
            error: false,
            success: true,
        });
    } catch (error) {
        console.error("userDetails error:", error); // <-- Add this line
        return response.status(500).json({
            message: "Something is wrong",
            error: true,
            success: false,
        });
    }
}

export async function addAddress(request, response) {
    try {
        const {
            name,
            phone,
            pin,
            address,
            landmark,
            city,
            state,
            altPhone,
            locality,
            addressType,
            userId
        } = request.body;

        console.log("addAddressController triggered");

        console.log(name, pin, userId)

        if (!name || !pin || !userId) {
            return response.status(400).json({
                message: "Name, Pin, and User ID are required.",
                error: true,
                success: false
            });
        }

        const newAddress = new AddressModel({
            name,
            phone,
            pin,
            address,
            landmark,
            city,
            state,
            altPhone,
            locality,
            addressType,
            userId
        });

        const savedAddress = await newAddress.save();

        await UserModel.findByIdAndUpdate(
            userId,
            { $push: { address_details: savedAddress._id } },
            { new: true }
        );

        return response.status(200).json({
            message: "Address added successfully.",
            error: false,
            success: true,
            address: savedAddress
        });

    } catch (error) {
        console.error("Error in addAddressController:", error);
        return response.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}

export async function getUserAddress(request, response) {
    try {
        const userId = request.params.id; // ✅ Corrected
        if (!userId) {
            return response.status(400).json({ error: true, message: "User ID is required." });
        }

        const user = await UserModel.findById(userId).populate("address_details"); // ✅ Populates address data

        if (!user) {
            return response.status(404).json({ error: true, message: "User not found." });
        }

        //    

        return response.status(200).json({
            error: false,
            message: "User addresses fetched successfully.",
            address_details: user.address_details, // ✅ Match frontend usage
        });
    } catch (error) {
        console.error("Error fetching user address:", error);
        return response.status(500).json({
            error: true,
            message: "Internal server error.",
            details: error.message,
        });
    }
}

export async function deleteAddress(request, response) {
    console.log(request.params)
    const { id, addressId } = request.params; // ✅ Corrected
    console.log(id, addressId)
    try {

        if (!id) {
            return response.status(400).json({ error: true, message: "User ID is required." });
        }

        const address = await AddressModel.findByIdAndDelete(addressId);


        if (!address) {
            console.log(id, "addressId")
            return response.status(404).json({ message: 'Address not found' });
        }

        await UserModel.findByIdAndUpdate(id, {
            $pull: { address_details: addressId }
        });
        return response.status(200).json({
            error: false,
            message: "User address deleted successfully.",
        });

    }
    catch (error) {
        return response.status(500).json({
            error: true,
            message: "Internal server error.",
            details: error.message,
        });
    }
}

export async function updateUserAddress(request, response) {
    try {
        const { id: userId, addressId } = request.params;
        const {
            name,
            phone,
            pin,
            address,
            landmark,
            city,
            state,
            altPhone,
            locality,
            addressType
        } = request.body;

        // Check if user exists
        const userExist = await UserModel.findById(userId);
        if (!userExist) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        // Update address by ID
        const updatedAddress = await AddressModel.findByIdAndUpdate(
            addressId,
            {
                name,
                phone,
                pin,
                address,
                landmark,
                city,
                state,
                altPhone,
                locality,
                addressType
            },
            { new: true }
        );

        if (!updatedAddress) {
            return response.status(404).json({
                message: "Address not found or failed to update",
                error: true,
                success: false
            });
        }

        return response.status(200).json({
            message: "Address updated successfully",
            error: false,
            success: true,
            updatedAddress
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || "Server Error",
            error: true,
            success: false
        });
    }
}


export async function resendOTP(request, response) {
    try {
        const { email, name, userId } = request.body;
        console.log("resendOTP triggered");

        if (!email || !name || !userId) {
            return response.status(400).json({
                message: "Provide email, name, and userId",
                error: true,
                success: false,
            });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false,
            });
        }

        if (user.verify_email) {
            return response.status(400).json({
                message: "Email already verified. No need to resend OTP.",
                error: true,
                success: false,
            });
        }

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        user.otp = verifyCode;
        user.otpExpires = Date.now() + 600000; // 10 minutes
        await user.save();

        await sendEmailFun(
            email,
            "Verify your email – S N Steel Fabrication",
            "",
            verificationEmail(name, verifyCode)
        );

        return response.status(200).json({
            message: `OTP resent to ${email}`,
            error: false,
            success: true,
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || "Server Error",
            error: true,
            success: false,
        });
    }
}







import ProductModel from "../models/product.model.js";

export async function getRelatedProductsByCategory(req, res) {
    try {
        const { productId } = req.query;

        if (!productId) {
            return res.status(400).json({
                success: false,
                error: true,
                message: "Product ID is required"
            });
        }

        const product = await ProductModel.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                error: true,
                message: "Product not found"
            });
        }

        const { catId, subCatId, thirdSubCatId } = product;

        const relatedProducts = await ProductModel.find({
            $or: [
                { catId: catId },
                { subCatId: catId },
                { thirdSubCatId: catId },
                { catId: subCatId },
                { subCatId: subCatId },
                { thirdSubCatId: subCatId },
                { catId: thirdSubCatId },
                { subCatId: thirdSubCatId },
                { thirdSubCatId: thirdSubCatId },
            ]
        });

        return res.status(200).json({
            success: true,
            error: false,
            products: relatedProducts
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: true,
            message: error.message || "Server Error"
        });
    }
}



export async function getAllUsers(req, res) {
    try {
        const users = await UserModel.find().select("-password").populate("address_details");// exclude password

        return res.status(200).json({
            success: true,
            error: false,
            users,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: true,
            message: error.message || "Server Error",
        });
    }
}

