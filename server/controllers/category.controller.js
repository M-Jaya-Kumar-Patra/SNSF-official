import CategoryModel from "../models/category.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_API_Key,
    api_secret: process.env.cloudinary_Config_API_Secret,
    secure: true
});
let imagesArr = [];


export async function uploadImages(request, response) {
    try {
        const images = request.files || [];

        if (!images.length) {
            return response.status(400).json({
                message: "No images uploaded",
                error: true,
                success: false
            });
        }

        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: false,
        };

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.uploader.upload(images[i].path, options);
            imagesArr.push(result.secure_url);
            fs.unlinkSync(images[i].path);
        }

        return response.status(200).json({
            images: imagesArr,
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
export async function createCategory(request, response) {
    try {
        const { name, parentIds } = request.body;

const category = new CategoryModel({
    name,
    images: imagesArr,
    parentIds: parentIds || []  // Accept multiple parent categories
});

        const savedCategory = await category.save();
        imagesArr = []; // Clear after use

        // ✅ If it has a parent, push this into the parent's children


        return response.status(200).json({
            message: "Category created successfully",
            error: false,
            success: true,
            category: savedCategory
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function getCategories(request, response) {
    try {
        const categories = await CategoryModel.find();
        const categoryMap = {};

        categories.forEach(cat => {
            categoryMap[cat._id] = { ...cat._doc, children: [] };
        });

        const rootCategories = [];

        categories.forEach(cat => {
            if (cat.parentIds?.length) {
    cat.parentIds.forEach(pid => {
        if (categoryMap[pid]) {
            categoryMap[pid].children.push(categoryMap[cat._id]);
        }
    });
} else {
    rootCategories.push(categoryMap[cat._id]);
}

        });

        return response.status(200).json({
            error: false,
            success: true,
            data: rootCategories
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function getCategoriesCount(request, response) {
    try {
        const categoryCount = await CategoryModel.countDocuments({ parentIds: { $eq: [] } }) 

        return response.status(200).json({
            categoryCount,
            success: true,
            error: false
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function getSubCategoriesCount(request, response) {
    try {
        const subCategoriesCount = await CategoryModel.countDocuments({ parentIds: { $ne: [] } }) 

        return response.status(200).json({
            getSubCategoriesCount: subCategoriesCount,
            success: true,
            error: false
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function getCategory(request, response) {
    try {
        const category = await CategoryModel.findById(request.params.id);

        if (!category) {
            return response.status(404).json({
                message: "The category with the given ID was not found.",
                error: true,
                success: false
            });
        }

        return response.status(200).json({
            error: false,
            success: true,
            category
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

        const imgUrl = request.query.img;

        if (!imgUrl) {
            return response.status(400).json({
                message: "Image URL missing",
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

        if (destroyResult.result !== "ok") {
            return response.status(400).json({
                message: "Failed to delete image ",
                error: true,
                success: false
            });
        }

        return response.status(200).json({
            message: "Image deleted Successfully",
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

export async function deleteCategory(request, response) {
    try {
        const category = await CategoryModel.findById(request.params.id);
        console.log(category)
        if (!category) {
            return response.status(404).json({
                message: "Category not found",
                success: false,
                error: true
            });
        }

        // Delete images from Cloudinary
        for (let img of category.images) {
            const urlArr = img.split("/");
            const image = urlArr[urlArr.length - 1];
            const imageName = image.split(".")[0];
            if (imageName) {
                await cloudinary.uploader.destroy(imageName);
            }
        }

        // Delete subcategories and their children
        const subCategories = await CategoryModel.find({ parentIds: request.params.id });


        for (const subCat of subCategories) {
            const thirdSubCategories = await CategoryModel.find({ parentId: subCat._id });
            for (const thirdSubCat of thirdSubCategories) {
                await CategoryModel.findByIdAndDelete(thirdSubCat._id);
            }
            await CategoryModel.findByIdAndDelete(subCat._id);
        }

        // Delete parent category
        await CategoryModel.findByIdAndDelete(request.params.id);

        return response.status(200).json({
            message: "Category and subcategories deleted",
            success: true,
            error: false
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        });
    }
}

export async function updatedCategory(request, response) {
    try {
        const imageFiles = Array.isArray(request.files?.images)
            ? request.files.images
            : request.files?.images ? [request.files.images] : [];

        const uploadedImages = [];

        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: false,
        };

        for (let i = 0; i < imageFiles.length; i++) {
            const result = await cloudinary.uploader.upload(imageFiles[i].path, options);
            uploadedImages.push(result.secure_url);
            fs.unlinkSync(imageFiles[i].path);
        }

        if (typeof request.body.images === 'string') {
            try {
                request.body.images = JSON.parse(request.body.images);
            } catch {
                request.body.images = [];
            }
        }

        const updateData = {
            name: request.body.name,
            parentIds: request.body.parentIds || [],
            images: Array.isArray(request.body.images) && request.body.images.length > 0
                ? request.body.images
                : uploadedImages
        };

        const category = await CategoryModel.findByIdAndUpdate(
            request.params.id,
            updateData,
            { new: true }
        );

        if (!category) {
            return response.status(404).json({
                message: "Category not found",
                success: false,
                error: true
            });
        }

        return response.status(200).json({
            category,
            success: true,
            error: false
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || "Internal Server Error",
            success: false,
            error: true
        });
    }
}
