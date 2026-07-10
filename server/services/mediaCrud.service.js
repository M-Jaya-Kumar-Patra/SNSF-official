import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_API_Key,
  api_secret: process.env.cloudinary_Config_API_Secret,
  secure: true,
});

const uploadOptions = {
  use_filename: true,
  unique_filename: false,
  overwrite: false,
};

function getCloudinaryPublicId(imageUrl) {
  const urlParts = imageUrl.split("/");
  const fileName = urlParts[urlParts.length - 1];
  return fileName.split(".")[0];
}

export function createMediaCrudController({
  Model,
  createMessage,
  deleteMessage,
  notFoundMessage,
  reorderBodyKey,
  reorderMissingMessage,
}) {
  const uploadImages = asyncHandler(async (req, res) => {
    const image = req.files || [];

    if (!image.length) {
      throw new ApiError(400, "No image uploaded");
    }

    const uploadedImages = [];

    for (const file of image) {
      const upload = await cloudinary.uploader.upload(file.path, uploadOptions);
      uploadedImages.push(upload.secure_url);

      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "", { images: uploadedImages }));
  });

  const createItem = asyncHandler(async (req, res) => {
    const newItem = new Model({
      image: req.body.image,
      name: req.body.name,
      url: req.body.url,
      index: req.body.index,
      status: req.body.status,
    });

    await newItem.save();

    return res.status(200).json(new ApiResponse(200, createMessage));
  });

  const getItems = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;

    const totalItems = await Model.countDocuments();
    const totalPages = Math.ceil(totalItems / perPage);

    if (page > totalPages) {
      throw new ApiError(404, "Page not found");
    }

    const items = await Model.find()
      .sort({ index: 1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    return res.status(200).json(new ApiResponse(200, "", { data: items }));
  });

  const deleteItem = asyncHandler(async (req, res) => {
    const item = await Model.findById(req.params.id);

    if (!item) {
      throw new ApiError(404, notFoundMessage);
    }

    if (item.image && item.image.length > 0) {
      for (const img of item.image) {
        await cloudinary.uploader.destroy(getCloudinaryPublicId(img));
      }
    }

    await Model.findByIdAndDelete(req.params.id);

    return res.status(200).json(new ApiResponse(200, deleteMessage));
  });

  const removeImage = asyncHandler(async (req, res) => {
    const publicId = req.query.img;

    if (!publicId) {
      throw new ApiError(400, "Missing public_id");
    }

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok") {
      throw new ApiError(400, "Failed to delete image");
    }

    return res.status(200).json(new ApiResponse(200, "Image deleted"));
  });

  const updateItem = asyncHandler(async (req, res) => {
    const updated = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) {
      throw new ApiError(404, notFoundMessage);
    }

    return res.status(200).json(new ApiResponse(200, "", { data: updated }));
  });

  const reorderItems = asyncHandler(async (req, res) => {
    const items = req.body[reorderBodyKey];

    if (!items || !Array.isArray(items)) {
      throw new ApiError(400, reorderMissingMessage);
    }

    const ops = items.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { index: item.index } },
      },
    }));

    await Model.bulkWrite(ops);

    const updatedItems = await Model.find({})
      .sort({ index: 1, dateCreated: -1 })
      .lean();

    return res
      .status(200)
      .json(
        new ApiResponse(200, "", { data: updatedItems }).toObject({
          includeError: false,
        })
      );
  });

  return {
    uploadImages,
    createItem,
    getItems,
    deleteItem,
    removeImage,
    updateItem,
    reorderItems,
  };
}
