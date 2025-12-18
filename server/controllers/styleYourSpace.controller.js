import StyleYourSpaceModel from "../models/styleYourSpace.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_API_Key,
    api_secret: process.env.cloudinary_Config_API_Secret,
    secure: true
});

let uploadedImages = [];

// =============================
//  Upload Image
// =============================
export async function uploadImages(req, res) {
    try {
        const image = req.files || [];

        if (!image.length) {
            return res.status(400).json({
                message: "No image uploaded",
                success: false,
                error: true
            });
        }

        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: false,
        };

        const uploadedImages = [];   // ← ADD THIS

        for (let i = 0; i < image.length; i++) {
            const file = image[i];

            const upload = await cloudinary.uploader.upload(file.path, options);
            uploadedImages.push(upload.secure_url);

            fs.unlinkSync(file.path);
        }

        return res.status(200).json({
            success: true,
            error: false,
            images: uploadedImages   // ← NOW AN ARRAY ALWAYS
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message,
            success: false,
            error: true
        });
    }
}


// =============================
//  Create Style Your Space Item
// =============================
export async function createSpace(req, res) {
    try {
        const newItem = new StyleYourSpaceModel({
            image: req.body.image,
            name: req.body.name,
            url: req.body.url,
            index: req.body.index,
            status: req.body.status
        });

        await newItem.save();

        uploadedImages = []; // reset

        return res.status(200).json({
            success: true,
            error: false,
            message: "Style Your Space item created"
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message,
            success: false,
            error: true
        });
    }
}


// =============================
//  Get All Items (Pagination)
// =============================
export async function getSpaces(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 10;

        const totalItems = await StyleYourSpaceModel.countDocuments();
        const totalPages = Math.ceil(totalItems / perPage);

        if (page > totalPages) {
            return res.status(404).json({
                message: "Page not found",
                success: false,
                error: true
            });
        }

        const items = await StyleYourSpaceModel.find()
            .sort({ index: 1 })
            .skip((page - 1) * perPage)
            .limit(perPage);

        return res.status(200).json({
            success: true,
            error: false,
            data: items
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message,
            success: false,
            error: true
        });
    }
}


// =============================
//  Delete Item + Cloudinary Image
// =============================
export async function deleteSpace(req, res) {
    try {
        const space = await StyleYourSpaceModel.findById(req.params.id); // <-- use req.params.id

        if (!space) {
            return res.status(404).json({
                message: "Item not found",
                error: true,
                success: false
            });
        }

        // delete cloudinary image
        if (space.image && space.image.length > 0) {
            for (let img of space.image) {
                const urlParts = img.split("/");
                const fileName = urlParts[urlParts.length - 1];
                const publicId = fileName.split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            }
        }

        await StyleYourSpaceModel.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true,
            error: false,
            message: "Item deleted"
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message,
            success: false,
            error: true
        });
    }
}


// =============================
//  Remove Single Cloudinary Image
// =============================
export async function removeImage(req, res) {
    try {
        const publicId = req.query.img;

        if (!publicId) {
            return res.status(400).json({
                message: "Missing public_id",
                success: false,
                error: true
            });
        }

        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result !== "ok") {
            return res.status(400).json({
                message: "Failed to delete image",
                success: false,
                error: true
            });
        }

        return res.status(200).json({
            message: "Image deleted",
            success: true,
            error: false
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message,
            success: false,
            error: true
        });
    }
}


// =============================
//  Update Style Your Space
// =============================
export async function updateSpace(req, res) {
    try {
        const updated = await StyleYourSpaceModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({
                message: "Item not found",
                success: false,
                error: true
            });
        }

        return res.status(200).json({
            success: true,
            error: false,
            data: updated
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message,
            success: false,
            error: true
        });
    }
}


// =============================
// Reorder Style Your Space
// =============================
export const reorderSpaces = async (req, res) => {
  try {
    const { items } = req.body; // [{ id, index }]

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: "Provide items array with id and index",
      });
    }

    const ops = items.map((it) => ({
      updateOne: {
        filter: { _id: it.id },
        update: { $set: { index: it.index } },
      },
    }));

    await StyleYourSpaceModel.bulkWrite(ops);

    const updatedItems = await StyleYourSpaceModel.find({})
      .sort({ index: 1, dateCreated: -1 })
      .lean();

    return res.status(200).json({ success: true, data: updatedItems });
  } catch (err) {
    console.error("reorderSpaces error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
