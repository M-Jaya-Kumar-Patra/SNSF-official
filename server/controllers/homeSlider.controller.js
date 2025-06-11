import HomeSliderModel from "../models/homeSlider.model.js";
import { v2 as cloudinary } from "cloudinary";
import { error } from "console";
import fs from "fs";

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_API_Key,
    api_secret: process.env.cloudinary_Config_API_Secret,
    secure: true
});
let imagesArr = [];

export async function createSlide(request, response) {
    try {
        const slide = new HomeSliderModel({
            images: request.body.images,
        });
        await slide.save()

        if (!slide) {
            response.status(500).json({
                error: true,
                success: false,
                message: "slide Not Created"
            })
        }

        imagesArr = [];
        response.status(200).json({
            error: false,
            success: true,
            message: "slide created successfully"
        });


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}
export async function uploadImages(request, response) {
    try {
        const image = request.files || [];

        if (!image.length) {
            return response.status(400).json({
                message: "No images uploaded",
                error: true,
                success: false
            });
        }

        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: false
        };

        for (let i = 0; i < image.length; i++) {
            const result = await cloudinary.uploader.upload(image[i].path, options);
            imagesArr.push(result.secure_url);
            fs.unlinkSync(image[i].path); // Delete the temp file
        }

        return response.status(200).json({
            images: imagesArr,
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        });
    }
}

export async function getAllSlides(request, response) {
    try {
        console.log("Request Query:", request.query);
        const page = parseInt(request.query.page) || 1;
        const perPage = parseInt(request.query.perPage) || 10;

        const totalPosts = await HomeSliderModel.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return response.status(404).json({
                message: "Page not found",
                success: false,
                error: true
            });
        }

        const slides = await HomeSliderModel.find().skip((page - 1) * perPage)
            .limit(perPage).exec();
        if (!slides) {
            response.status(500).json({
                error: true,
                success: false
            })


        }
        return response.status(200).json({
            error: false,
            success: true,
            data: slides
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}
export async function deleteSlide(request, response) {
    try {

        console.log("cccccccccccccccccccccccccccccccccccc          ccccccccccccccccccccccccccccccccccccccccccccccccc",request.params.id)
        const slider = await HomeSliderModel.findById(request.params.id);

        if (!slider) {
            return response.status(404).json({
                message: "Product Not found",
                error: true,
                success: false
            });
        }

        // Step 1: Remove images from Cloudinary
        const images = slider.images;
        for (const img of images) {
            const imgUrl = img;
            const urlArr = imgUrl.split("/");
            const image = urlArr[urlArr.length - 1];
            const imageName = image.split(".")[0];

            if (imageName) {
                cloudinary.uploader.destroy(imageName, (error, result) => {
                    // Optional: console.log(error, result);
                });
            }
        }

        // Step 2: Now delete the product from DB
        const deletedSlides = await HomeSliderModel.findByIdAndDelete(request.params.id);

        if (!deletedSlides) {
            return response.status(404).json({
                message: "Slide not deleted!",
                success: false,
                error: true
            });
        }

        return response.status(200).json({
            success: true,
            error: false,   
            message: "Slide Deleted!"
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}



export async function removeImageFromCloudinary(request, response) {
    try {
        let publicId = request.query.img;

        if (!publicId) {
            return response.status(400).json({
                message: "Image public_id missing",
                error: true,
                success: false
            });
        }

        console.log("Deleting Cloudinary image:", publicId);

        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result !== "ok") {
            return response.status(400).json({
                message: "Failed to delete image from Cloudinary",
                error: true,
                success: false
            });
        }

        return response.status(200).json({
            message: "Image deleted from Cloudinary",
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        });
    }
}
