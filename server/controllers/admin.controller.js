import mongoose from "mongoose";
import AdminModel from "../models/admin.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmailFun from "../config/sendEmail.js";
import verificationAdminEmail from "../utils/EmailTemplates/verifyAdminEmailTemplate.js";
import generatedAccessToken from '../utils/generatedAccessToken.js';
import generatedRefreshToken from '../utils/generatedRefreshToken.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_API_Key,
    api_secret: process.env.cloudinary_Config_API_Secret,
    secure: true
});

const destEmail = process.env.DESTINATION_EMAIL

var imagesArr = [];

export async function registerAdminController(request, response) {
    try {
        const { name, email, password } = request.body;

        if (!name || !email || !password) {
            return response.status(400).json({
                message: "Provide name, email, password",
                error: true,
                success: false
            });
        }

        const existingAdmin = await AdminModel.findOne({ email });
        
        if (existingAdmin) {
            return response.json({
                message: "Admin already registered with this email",
                error: true,
                success: false
            });
        }

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        const newAdmin = new AdminModel({
            name,
            email,
            password: hashPassword,
            otp: verifyCode,
            otpExpires: Date.now() + 600000 // 10 minutes
        });

        await newAdmin.save();


        // Send verification email
        await sendEmailFun(
            destEmail,
            "Verify email from Ecommerce App",
            "",
            verificationAdminEmail(name, verifyCode)
        );

        const token = jwt.sign(
            { email: newAdmin.email, id: newAdmin._id },
            process.env.JWT_SECRET
        );

        return response.status(200).json({
            message: "Admin registered successfully",
            error: false,
            success: true,
            token
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function verifyEmailController(request, response) {
    try {
        const { email, otp } = request.body;
        console.log("verifyEmailController triggered")

        if (!email || !otp) {
            return response.status(400).json({
                message: "Provide email and OTP",
                error: true,
                success: false
            });
        }

        const admin = await AdminModel.findOne({ email });
        if (!admin) {
            return response.status(404).json({
                message: "Admin not found",
                error: true,
                success: false
            });
        }

        if (admin.otp !== otp) {
            return response.status(400).json({
                message: "Invalid OTP",
                error: true,
                success: false
            });
        }

        if (admin.otpExpires < Date.now()) {
            return response.status(400).json({
                message: "OTP expired",
                error: true,
                success: false
            });
        }

        admin.verify_email = true;
        admin.otp = undefined;
        admin.otpExpires = undefined;

        await admin.save();

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

        const admin = await AdminModel.findOne({ email });
        if (!admin) {
            return response.status(404).json({
                message: "Admin not found",
                error: true,
                success: false
            });
        }

        if (admin.status !== "Active") {
            return response.status(400).json({
                message: "Admin is not active",
                error: true,
                success: false
            });
        }

        if (admin.verify_email !== true) {
            return response.status(400).json({
                message: "Your email is not verified yet please verify your email first",
                error: true,
                success: false
            });
        }


        const checkPassword = await bcryptjs.compare(password, admin.password);
        if (!checkPassword) {
            return response.status(400).json({
                message: "Check your password",
                error: true,
                success: false
            });
        }

        const accessToken = await generatedAccessToken(admin._id);
        const refreshToken = await generatedRefreshToken(admin._id);

        await AdminModel.findByIdAndUpdate(admin._id, {
            last_login_date: new Date()
        });

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            maxAge: 5 * 60 * 60 * 1000 // 5 hours
        };

        console.log(admin?.body?.name)
        response.cookie("accessToken", accessToken, cookieOptions);
        response.cookie("refreshToken", refreshToken, cookieOptions);
        console.log(accessToken, refreshToken)

        return response.json({
            message: "Login successfully",
            error: false,
            success: true,
            data: {
                accessToken,
                refreshToken,
                id: admin._id,
                email: email,
                name: admin.name,
                avatar: admin.avatar,
                phone: admin.phone
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



export async function logoutController(request, response) {
    try {
        const adminid = request.adminId;
        console.log("logoutController Triggered")

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        };

        response.clearCookie('accessToken', cookieOptions);
        response.clearCookie('refreshToken', cookieOptions);

        await AdminModel.findByIdAndUpdate(adminid, {
            refresh_token: ""
        });

        return response.status(200).json({
            message: "Admin logged out successfully",
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

export async function adminAvatarController(request, response) {
    try {
        console.log("adminAvatarController Triggered")
        const adminId = request.adminId;
        console.log("Admin ID from token:", adminId);
        console.log("Is valid ObjectId:", mongoose.Types.ObjectId.isValid(adminId));

        // Validate adminId
        if (!mongoose.Types.ObjectId.isValid(adminId)) {
            return response.status(400).json({
                message: "Invalid admin ID",
                error: true,
                success: false
            });
        }

        const admin = await AdminModel.findById(adminId);
        if (!admin) {
            return response.status(404).json({
                message: "Admin not found",
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

        // Update admin avatar
        admin.avatar = imagesArr[0];
        await admin.save();

        return response.status(200).json({
            _id: adminId,
            avatar: imagesArr[0],
            message: "Avatar updated successfully",
            error: false,
            success: true
        });

    } catch (error) {
        console.error("Error in adminAvatarController:", error);
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
        const adminId = request.adminId || request.query.adminId; // Prefer token, fallback to query

        if (!imgUrl || !adminId) {
            return response.status(400).json({
                message: "Image URL or Admin ID missing",
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
        await AdminModel.findByIdAndUpdate(adminId, {
            $unset: { avatar: "" }
        });

        return response.status(200).json({
            message: "Image deleted and avatar removed from admin profile",
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

export async function updateAdminDetails(request, response) {
    console.log("0")

    try {

        const adminId = request.adminId
        console.log("1")
        const { name, email, phone, password } = request.body

        const adminExist = await AdminModel.findById(adminId);

        if (!adminExist) {
            return response.status(400).json({
                message: "The Admin cannot be updated!",
                error: true,
                success: false
            });
        }



        let verifyCode = ""

        if (email !== adminExist.email) {
            verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        }

        let hashPassword = ""
        console.log("11")

        if (password) {
            const salt = await bcryptjs.genSalt(10)
            hashPassword = await bcryptjs.hash(password, salt)
        } else {
            hashPassword = adminExist.password
        }
        console.log("111")

        const updateAdmin = await AdminModel.findByIdAndUpdate(
            adminId,
            {
                name: name,
                phone: phone,
                email: email,
                verify_email: email !== adminExist.email ? false : true,
                password: hashPassword,
                otp: verifyCode !== "" ? verifyCode : null,
                otpExpires: verifyCode !== "" ? Date.now() + 600000 : null,
            },
            { new: true }
        );
        console.log("1111")

        if (email !== adminExist.email) {
            await sendEmailFun({
                sendTo: destEmail,
                subject: "Verify email from Ecommerce App",
                text: "", // Optional plain text version
                html: verificationAdminEmail(name, verifyCode)
            });
        }

        console.log("11111")

        return response.status(200).json({
            message: "Admin updated successfully",
            error: false,
            success: true,
            admin: {
                name: updateAdmin?.name,
                _id: updateAdmin?._id,
                email: updateAdmin?.email,
                phone: updateAdmin?.phone,
                avatar: updateAdmin?.avatar
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

        const admin = await AdminModel.findOne({ email: email })

        if (!admin) {
            return response.status(400).json({
                message: "Email not available",
                error: true,
                success: false
            })
        }
        else {
            let verifyCode = Math.floor(100000 + Math.random() * 900000).toString()


            admin.otp = verifyCode,
                admin.otpExpires = Date.now() + 600000

            await admin.save();




            await sendEmailFun(
                destEmail,
                "Verify email from Ecommerce App",
                "",
                verificationAdminEmail(admin?.name, verifyCode)
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

        const admin = await AdminModel.findOne({ email: email })

        if (!admin) {
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


        if (otp !== admin.otp) {
            return response.status(400).json({
                message: "Invalid OTP",
                error: true,
                success: false
            })
        }

        const currentTime = new Date().toISOString();

        if (admin.otpExpires < currentTime) {
            return response.status(400).json({
                message: "OTP is expired",
                error: true,
                success: false
            });
        }

        admin.otp = ""
        admin.otpExpires = ""

        await admin.save()



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

        const admin = await AdminModel.findOne({ email });
        if (!admin) {
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

        admin.password = hashPassword;
        await admin.save();

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

        const admin = await AdminModel.findOne({ email });
        if (!admin) {
            return response.status(400).json({
                message: "Email is not registered",
                error: true,
                success: false
            })
        }

        const salt = await bcryptjs.genSalt(10);
        const hashOldPassword = await bcryptjs.hash(oldPassword, salt);

        console.log(admin.password)
        console.log(oldPassword)
        console.log(hashOldPassword)
        const isPasswordCorrect = await bcryptjs.compare(oldPassword, admin.password);

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

        admin.password = hashPassword;
        await admin.save();

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

        const adminId = verifyToken?._id;
        const newAccessToken = await generatedAccessToken(adminId)

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

export async function adminDetails(request, response) {
    try {
        console.log(request.params)
        const adminId = request.adminId;
        console.log("adminId:", adminId);

        const admin = await AdminModel.findById(adminId).select("-password -refresh_token");

        if (!admin) {
            return response.status(404).json({
                message: "Admin not found",
                error: true,
                success: false,
            });
        }

        return response.json({
            message: "Admin details",
            data: admin,
            error: false,
            success: true,
        });
    } catch (error) {
        console.error("adminDetails error:", error); // <-- Add this line
        return response.status(500).json({
            message: "Something is wrong",
            error: true,
            success: false,
        });
    }
}


export async function resendOTP(request, response){
    try {
        const { email, name, adminId} = request.body;
        console.log("registerUserController triggered")

        if ( !email || !name ) {
            return response.status(400).json({
                message: "Provide email, name",
                error: true,
                success: false
            });
        }

        


        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

      

        const updateAdmin = await AdminModel.findByIdAndUpdate(
            adminId,
            {
                otp: verifyCode,
                otpExpires: verifyCode !== "" ? Date.now() + 600000 : null,
            },
            { new: true }
        );

        // Send verification email
        await sendEmailFun(
            destEmail,
            email,
            "Verify email from Ecommerce App",
            "",
            verificationAdminEmail(name, verifyCode)
        );

        return response.status(200).json({
            message: `OTP sent to ${email}`,
            error: false,
            success: true,
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || "Server Error",
            error: true,
            success: false
        });
    }
}





