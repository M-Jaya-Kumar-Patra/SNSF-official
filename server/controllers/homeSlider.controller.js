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

export async function createSlide(req, res) {
  try { 

    console.log("99999999999999999999999999999999999999")
    const {
      images,
      title,
      tagline,
      description,
      url,
      ctaText,
      order,
      isActive
    } = req.body;
    
        
    if (!images || !images.length || !title) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Images and title are required"
      });
    }

    const slide = new HomeSliderModel({
      images,
      title,
      tagline,
      description,
      url,
      ctaText,
      order,
      isActive
    });

    await slide.save();

    imagesArr = [];

    return res.status(201).json({
      error: false,
      success: true,
      message: "Slide created successfully",
      data: slide
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false
    });
  }
}

export async function uploadImages(req, res) {
  try {
    const files = req.files || [];

    if (!files.length) {
      return res.status(400).json({
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

    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, options);
      imagesArr.push(result.secure_url);
      fs.unlinkSync(file.path);
    }

    return res.status(200).json({
      images: imagesArr,
      success: true,
      error: false
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false
    });
  }
}

export async function getAllSlides(req, res) {
  try {
    const slides = await HomeSliderModel
      .find({ isActive: true })
      .sort({ order: 1, createdAt: -1 });

    return res.status(200).json({
      error: false,
      success: true,
      data: slides
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false
    });
  }
}

export async function deleteSlide(req, res) {
  try {
    const slider = await HomeSliderModel.findById(req.params.id);

    if (!slider) {
      return res.status(404).json({
        message: "Slide not found",
        error: true,
        success: false
      });
    }

    for (const img of slider.images) {
      const imageName = img.split("/").pop().split(".")[0];
      if (imageName) {
        await cloudinary.uploader.destroy(imageName);
      }
    }

    await slider.deleteOne();

    return res.status(200).json({
      success: true,
      error: false,
      message: "Slide deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
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
