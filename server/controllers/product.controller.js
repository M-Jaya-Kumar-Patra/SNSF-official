import ProductModel from "../models/product.model.js";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "../config/connectDb.js";
import slugify from "slugify";
import mongoose from "mongoose";


// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

function normalizeImages(images) {
  if (Array.isArray(images)) return images.filter(Boolean);
  if (typeof images === "string" && images.trim()) return [images.trim()];
  return [];
}

export const getProductBySlug = async (req, res) => {
  await connectDB();
  const { slug } = req.params;

  if (!slug) return res.status(400).json({ success: false, message: "Slug is required" });

  try {
    const product = await ProductModel.findOne({ slug });
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, product });
  } catch (err) {
    console.error("Error fetching product by slug:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// Upload Images Controller
export async function uploadImages(request, response) {
    try {
        const image = request.files || [];

        if (!image.length) {
            return response.status(400).json({
                message: "No images uploaded",
                error: true,
                success: false,
            });
        }

        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: false,
        };

        const uploadedImages = await Promise.all(
            image.map((file) =>
                cloudinary.uploader
                    .upload(file.path, options)
                    .then((result) => result.secure_url)
            )
        );

        return response.status(200).json({
            images: uploadedImages,
            error: false,
            success: true,
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}

// Create Product Controller
export async function createProduct(request, response) {
  try {
    const {
      name,
      description,
      images,
      brand,
      price,
      oldPrice,
      catName,
      catId,
      subCat,
      subCatId,
      thirdSubCat,
      thirdSubCatId,
      countInStock,
      rating,
      isFeatured,
      isAllinOne,
      discount,
      size,
      delivery_days,
      callOnlyDelivery,
      specifications,
      location,
      category,
    } = request.body;

    // ✅ Generate SEO-friendly slug
    const slug = slugify(name, { lower: true, strict: true });

    const product = new ProductModel({
      name,
      slug,  // <-- Save slug
      productId: new mongoose.Types.ObjectId(),
      checked: false,
      description,
      images: normalizeImages(images),
      brand,
      price,
      oldPrice,
      catName,
      catId,
      subCat,
      subCatId,
      thirdSubCat,
      thirdSubCatId,
      countInStock,
      sales: 0,
      rating: rating || 0,
      ratingCount: 0,
      isFeatured,
      isAllinOne,
      discount,
      size: size || [],
      location: location || [],
      dateCreated: Date.now(),
      delivery_days,
      callOnlyDelivery: callOnlyDelivery ?? true,
      category: category || null,

      specifications: {
        material: specifications?.material || "",
        setOf: specifications?.setOf || 1,
        grade: specifications?.grade || "",
        fabric: specifications?.fabric || "",
        fabricColor: specifications?.fabricColor || "",
        size: specifications?.size || "",
        capacity: specifications?.capacity || "",
        weight: specifications?.weight || "",
        width: specifications?.width || "",
        depth: specifications?.depth || "",
        seatHeight: specifications?.seatHeight || "",
        length: specifications?.length || "",
        height: specifications?.height || "",
        minHeight: specifications?.minHeight || "",
        maxHeight: specifications?.maxHeight || "",
        warranty: specifications?.warranty || "",
        thickness: specifications?.thickness || "",
        polish: specifications?.polish || "",
        frameMaterial: specifications?.frameMaterial || "",
      },
    });

    await product.save();

    return response.status(200).json({
      error: false,
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
// /api/product/getProducts.js

export async function getAllProducts(request, response) {
    try {
        const page = Math.max(1, parseInt(request.query.page, 10) || 1);
        const limit = Math.min(
            100,
            Math.max(1, parseInt(request.query.limit || request.query.perPage, 10) || 50)
        );
        const shouldPaginate = request.query.page || request.query.limit || request.query.perPage;

        const query = ProductModel.find().sort({ dateCreated: -1 });
        if (shouldPaginate) query.skip((page - 1) * limit).limit(limit);

        const [products, total] = await Promise.all([
            query.lean(),
            shouldPaginate ? ProductModel.countDocuments() : undefined,
        ]);

        return response.status(200).json({
            error: false,
            success: true,
            data: products,
            ...(shouldPaginate
                ? { total, page, totalPages: Math.ceil(total / limit), limit }
                : {})
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}





// controllers/productController.js
async function handleProductFetch(queryObj, request, response) {
    try {
        const page = Math.max(1, parseInt(request.query.page, 10) || 1);
        const limit = Math.min(
            100,
            Math.max(1, parseInt(request.query.limit || request.query.perPage, 10) || 50)
        );
        const shouldPaginate = request.query.page || request.query.limit || request.query.perPage;

        const query = ProductModel.find(queryObj)
            .populate("category")
            .sort({ dateCreated: -1 });
        if (shouldPaginate) query.skip((page - 1) * limit).limit(limit);

        const [products, total] = await Promise.all([
            query.lean().exec(),
            shouldPaginate ? ProductModel.countDocuments(queryObj) : undefined,
        ]);

        return response.status(200).json({
            error: false,
            success: true,
            data: products,
            total: shouldPaginate ? total : products.length,
            ...(shouldPaginate ? { page, totalPages: Math.ceil(total / limit), limit } : {})
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export default handleProductFetch;
export const getAllProductsByCatId = (req, res) =>
    handleProductFetch({ catId: req.params.Id }, req, res);

export const getAllProductsByCatName = (req, res) =>
    handleProductFetch({ catName: req.query.catName }, req, res);

export const getAllProductsBySubCatId = (req, res) =>
    handleProductFetch({ subCatId: req.params.Id }, req, res);

export const getAllProductsBySubCatName = (req, res) =>
    handleProductFetch({ subCat: req.query.catName }, req, res);

export const getAllProductsByThirdCatId = (req, res) =>
    handleProductFetch({ thirdSubCatId: req.params.thirdSubCatId }, req, res);

export const getAllProductsByThirdCatName = (req, res) =>
    handleProductFetch({ thirdSubCat: req.query.thirdSubCat }, req, res);









export async function getAllProductsByPrice(request, response) {
    try {
        const page = Math.max(1, parseInt(request.query.page, 10) || 1);
        const perPage = Math.min(
            100,
            Math.max(1, parseInt(request.query.perPage || request.query.limit, 10) || 20)
        );
        const minPrice = Number(request.query.minPrice) || 0;
        const maxPrice = Number(request.query.maxPrice);
        const query = {
            price: { $gte: minPrice },
        };

        if (Number.isFinite(maxPrice)) query.price.$lte = maxPrice;
        if (request.query.catId) query.catId = request.query.catId;
        if (request.query.subCatId) query.subCatId = request.query.subCatId;
        if (request.query.thirdSubCatId) query.thirdSubCatId = request.query.thirdSubCatId;

        const [products, total] = await Promise.all([
            ProductModel.find(query)
                .populate("category")
                .sort({ price: 1, dateCreated: -1 })
                .skip((page - 1) * perPage)
                .limit(perPage)
                .lean(),
            ProductModel.countDocuments(query),
        ]);

        return response.status(200).json({
            error: false,
            success: true,
            products,
            total,
            totalPages: Math.ceil(total / perPage),
            page,
        });
    } catch (error) {
        return response.status(500).json({
            error: true,
            success: false,
            message: error.message || error
        });
    }
}

export async function getAllProductsByRating(request, response) {
    try {
        const page = Math.max(1, parseInt(request.query.page, 10) || 1);
        const perPage = Math.min(
            100,
            Math.max(1, parseInt(request.query.perPage || request.query.limit, 10) || 10)
        );
        const rating = Number(request.query.rating);
        const query = {};

        if (Number.isFinite(rating)) query.rating = { $gte: rating };
        if (request.query.catId) query.catId = request.query.catId;
        if (request.query.subCatId) query.subCatId = request.query.subCatId;
        if (request.query.thirdSubCatId) query.thirdSubCatId = request.query.thirdSubCatId;

        const [products, total] = await Promise.all([
            ProductModel.find(query)
                .populate("category")
                .sort({ rating: -1, dateCreated: -1 })
                .skip((page - 1) * perPage)
                .limit(perPage)
                .lean(),
            ProductModel.countDocuments(query),
        ]);

        return response.status(200).json({
            error: false,
            success: true,
            data: products,
            total,
            page,
            totalPages: Math.ceil(total / perPage),
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function getProductsCount(request, response) {
    try {
        const productsCount = await ProductModel.countDocuments();

        if (!productsCount) {
            response.status(500).json({
                error: true,
                success: false
            })
        }
        return response.status(200).json({
            error: false,
            success: true,
            productsCount: productsCount
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function getAllFeaturedProducts(request, response) {
    try {
        const limit = Math.min(50, Math.max(1, Number(request.query.limit) || 20));
        const isFeatured =
            request.query.isFeatured === undefined ? true : request.query.isFeatured;

        const products = await ProductModel.find({ isFeatured })
            .populate("category")
            .sort({ dateCreated: -1 })
            .limit(limit)
            .lean();

        if (!products) {
            response.status(500).json({
                error: true,
                success: false
            })


        }
        return response.status(200).json({
            error: false,
            success: true,
            data: products
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function deleteProduct(request, response) {
    try {

        console.log(request.params.id)
        const product = await ProductModel.findById(request.params.id);

        if (!product) {
            return response.status(404).json({
                message: "Product Not found",
                error: true,
                success: false
            });
        }

        // Step 1: Remove images from Cloudinary
        const images = product.images;
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
        const deletedProduct = await ProductModel.findByIdAndDelete(request.params.id);

        if (!deletedProduct) {
            return response.status(404).json({
                message: "Product not deleted!",
                success: false,
                error: true
            });
        }

        return response.status(200).json({
            success: true,
            error: false,
            message: "Product Deleted!"
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function deleteMultipleProducts(request, response) {
    console.log("🔁 DELETE request received at /api/product/deleteMultiple");

    try {
        const { ids } = request.body;

        console.log("🛠️ Deleting multiple products:", ids);

        if (!ids || !Array.isArray(ids)) {
            return response.status(400).json({
                error: true,
                success: false,
                message: "Invalid input",
            });
        }

        for (let i = 0; i < ids.length; i++) {
            const product = await ProductModel.findById(ids[i]);

            if (!product) continue;

            const images = product.images;

            for (let img of images) {
                if (typeof img !== "string") continue;

                const urlArr = img.split("/");
                const image = urlArr[urlArr.length - 1];
                const imageName = image.split(".")[0];

                if (imageName) {
                    await cloudinary.uploader.destroy(imageName);
                }
            }
        }

        // ✅ Delete all products at once after cleaning up images
        await ProductModel.deleteMany({ _id: { $in: ids } });

        return response.status(200).json({
            message: "Products deleted successfully",
            error: false,
            success: true,
        });
    } catch (error) {
        console.error("🔥 Backend deleteMultiple error:", error);
        return response.status(500).json({
            message: error.message || "Something went wrong",
            error: true,
            success: false,
        });
    }
}

export const getProduct = async (req, res) => {
  await connectDB();
  const { prd } = req.params;

  try {
    // Check if prd is a valid MongoDB ObjectId
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(prd);

    let product;
    if (isObjectId) {
      product = await ProductModel.findById(prd).populate("category");
    } else {
      product = await ProductModel.findOne({ slug: prd }).populate("category");
    }

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, product });
  } catch (err) {
    console.error("Error fetching product:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};



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
            message: error.message || error,
            error: true,
            success: false
        });
    }
}
export async function updateProduct(request, response) {
    try {
        const {
            name,
            description,
            images,
            brand,
            price,
            oldPrice,
            catName,
            catId,
            subCat,
            subCatId,
            thirdSubCat,
            thirdSubCatId,
            countInStock,
            rating,
            isFeatured,
            isAllinOne,
            discount,
            size,
            delivery_days,
            callOnlyDelivery,
            location,
            category,
            specifications,
        } = request.body;

        const updatedProduct = await ProductModel.findByIdAndUpdate(
            request.params.id,
            {
                name,
                description,
                images: normalizeImages(images),
                brand,
                price,
                oldPrice,
                catName,
                catId,
                subCat,
                subCatId,
                thirdSubCat,
                thirdSubCatId,
                countInStock,
                rating,
                isFeatured,
                isAllinOne,
                discount,
                size: size || [],
                delivery_days,
                callOnlyDelivery: callOnlyDelivery ?? true,
                location: location || [],
                category: category || null,
                specifications: {
                    material: specifications?.material || "",
                    setOf: specifications?.setOf || 1,
                    grade: specifications?.grade || "",
                    fabric: specifications?.fabric || "",
                    fabricColor: specifications?.fabricColor || "",
                    size: specifications?.size || "",
                    capacity: specifications?.capacity || "",
                    weight: specifications?.weight || "",
                    width: specifications?.width || "",
                    depth: specifications?.depth || "",
                    seatHeight: specifications?.seatHeight || "",
                    length: specifications?.length || "",
                    height: specifications?.height || "",
                    minHeight: specifications?.minHeight || "",
                    maxHeight: specifications?.maxHeight || "",
                    warranty: specifications?.warranty || "",
                    thickness: specifications?.thickness || "",
                    polish: specifications?.polish || "",
                    frameMaterial: specifications?.frameMaterial || "",
                },
            },
            { new: true }
        );

        if (!updatedProduct) {
            return response.status(404).json({
                success: false,
                message: "The product could not be updated",
                error: true,
            });
        }

        return response.status(200).json({
            message: "The product has been updated successfully",
            error: false,
            success: true,
            product: updatedProduct,
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}
export async function filters(request, response) {
    const {
        catId = [],
        subCatId = [],
        thirdSubCatId = [],
        minPrice = 0,
        maxPrice = Infinity,
        rating,
        page = 1,
        limit = 10 // default limit
    } = request.body;

    try {
        const filters = [];

        // Only push filters if the arrays are not empty
        if (catId.length > 0) filters.push({ catId: { $in: catId } });
        if (subCatId.length > 0) filters.push({ subCatId: { $in: subCatId } });
        if (thirdSubCatId.length > 0) filters.push({ thirdSubCatId: { $in: thirdSubCatId } });

        // Build the query object
        const query = {};

        // Only apply OR condition if we have category filters
        if (filters.length > 0) {
            query.$or = filters;
        }

        query.price = { $gte: parseFloat(minPrice) || 0 };
        const parsedMaxPrice = parseFloat(maxPrice);
        if (Number.isFinite(parsedMaxPrice)) query.price.$lte = parsedMaxPrice;

        // Optional rating filter
        if (rating !== undefined && rating !== null) {
            query.rating = { $gte: parseFloat(rating) };
        }

        // Pagination logic
        const parsedLimit = Math.min(100, Math.max(1, parseInt(limit) || 10));
        const skip = (parseInt(page) - 1) * parsedLimit;

        const products = await ProductModel.find(query)
            .populate("category")
            .skip(skip)
            .limit(parsedLimit)
            .lean();

        const total = await ProductModel.countDocuments(query);

        return response.status(200).json({
            error: false,
            success: true,
            products,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parsedLimit)
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}


// Sort function
const sortItems = (products, sortBy, order) => {
    return products.sort((a, b) => {
        if (sortBy === 'name') {
            return order === 'asc'
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
        }

        if (sortBy === 'price') {
            return order === 'asc'
                ? a.price - b.price
                : b.price - a.price;
        }

        return 0; // Default: no sorting applied
    });
};


export async function sortBy(request, response) {
    try {
        const { products, sortBy, order } = request.body;

        const sortedItems = sortItems([...products], sortBy, order);

        return response.status(200).json({
            error: false,
            success: true,
            products: sortedItems,
            totalPages: 0,
            page: 0,
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}



// export async function SearchProductsController(request, response) {
//     try {
//         const query = request.query.q;
//         const page = parseInt(request.query.page) || 1;
//         const limit = parseInt(request.query.limit) || 10;
//         const skip = (page - 1) * limit;

//         if (!query) {
//             return response.status(400).json({
//                 message: "Query is required",
//                 error: true,
//                 success: false
//             });
//         }

//         const items = await ProductModel.find({
//             $or: [
//                 { name: { $regex: query, $options: "i" } },
//                 { brand: { $regex: query, $options: "i" } },
//                 { catName: { $regex: query, $options: "i" } },
//                 { subCat: { $regex: query, $options: "i" } },
//                 { thirdSubCat: { $regex: query, $options: "i" } },
//             ]
//         })
//             .populate("category")
//             .skip(skip)
//             .limit(limit);

//         return response.status(200).json({
//             error: false,
//             success: true,
//             products: items,
//         });

//     } catch (error) {
//         return response.status(500).json({
//             message: error.message || error,
//             error: true,
//             success: false,
//         });
//     }
// }

import SearchLog from "../models/searchLog.model.js";

export async function SearchProductsController(req, res) {
  try {
    const query = (req.query.q || "").trim();
    const visitorId = req.headers["x-visitor-id"] || null;
    const sessionId = req.headers["x-session-id"] || null;
    const userId = req.headers["x-user-id"] || null;
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit, 10) || 50));

    if (!query) {
      return res.json({ success: true, products: [] });
    }

    // 🔹 Split query into words
    let products = [];

    // 🔹 Build dynamic $and array where each word must match at least one field
    try {
      products = await ProductModel.find(
        { $text: { $search: query } },
        { score: { $meta: "textScore" } }
      )
        .sort({ score: { $meta: "textScore" }, dateCreated: -1 })
        .limit(limit)
        .lean();
    } catch (searchError) {
      console.warn("Text search unavailable, falling back to regex:", searchError.message);
    }

    // 🔹 Query the database
    if (!products.length) {
      const queryWords = query
        .split(/\s+/)
        .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .filter(Boolean);

      const andConditions = queryWords.map((word) => ({
        $or: [
          { name: { $regex: word, $options: "i" } },
          { brand: { $regex: word, $options: "i" } },
          { catName: { $regex: word, $options: "i" } },
          { subCat: { $regex: word, $options: "i" } },
          { thirdSubCat: { $regex: word, $options: "i" } },
        ],
      }));

      products = await ProductModel.find({ $and: andConditions })
        .limit(limit)
        .lean();
    }

    // 🔥 Log search (non-blocking)
    SearchLog.create({
        query,
        visitorId,
        sessionId,
        userId,
        resultsFound: products.length,
    }).catch((logError) => {
      console.error("Failed to log search:", logError.message);
    });

    return res.json({ success: true, products });

  } catch (err) {
    console.error("Search error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}


export async function getNewArrivals(req, res) {
    try {
        const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));

        const products = await ProductModel.find({})
            .sort({ dateCreated: -1 })
            .limit(limit)
            .lean();

        return res.status(200).json({
            error: false,
            success: true,
            data: products,
            total: products.length,
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            success: false,
            message: error.message,
        });
    }
}  

export async function getBestSellers(req, res) {
    try {
        const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
        const products = await ProductModel.find({ isFeatured: true })
            .populate("category")
            .sort({ sales: -1, dateCreated: -1 })
            .limit(limit)
            .lean();

        return res.status(200).json({
            error: false,
            success: true,
            data: products,
            total: products.length,
        });
    } catch (error) {
        return res.status(500).json({ error: true, success: false, message: error.message });
    }
}

export async function getSuggestions(req, res) {

  try {
    const {
      productId,
      catId,
      subCatId,
      thirdSubCatId,
      brand,
      keywords,
      limit = 10,
      excludeIds,
    } = req.query;

    const desiredLimit = Math.max(1, Math.min(50, parseInt(limit, 10) || 10)); // clamp 1..50

    // Build exclude set (ObjectId)
    const excludeSet = new Set();
    if (productId) {
      try { excludeSet.add(String(new mongoose.Types.ObjectId(productId))); } catch (e) {}
    }
    if (excludeIds) {
      excludeIds.split(",").forEach((id) => {
        const trimmed = id.trim();
        if (trimmed) {
          try { excludeSet.add(String(new mongoose.Types.ObjectId(trimmed))); } catch (e) {}
        }
      });
    }

    // Helper: add unique docs to results array
    const addUnique = (accArr, docs) => {
      for (const d of docs) {
        const idStr = String(d._id);
        if (!excludeSet.has(idStr) && !accArr.some((x) => String(x._id) === idStr)) {
          accArr.push(d);
          if (accArr.length >= desiredLimit) break;
        }
      }
    };

    const results = [];

    // 1) Try same sub-category (highest relevance)
    if (subCatId) {
      const docs = await ProductModel.find({
        subCatId,
        _id: { $nin: Array.from(excludeSet) },
      })
        .limit(desiredLimit)
        .populate("category")
        .exec();
      addUnique(results, docs);
    }

    // 2) Then same third-sub-category
    if (results.length < desiredLimit && thirdSubCatId) {
      const docs = await ProductModel.find({
        thirdSubCatId,
        _id: { $nin: Array.from(excludeSet) },
      })
        .limit(desiredLimit - results.length)
        .populate("category")
        .exec();
      addUnique(results, docs);
    }

    // 3) Then same category
    if (results.length < desiredLimit && catId) {
      const docs = await ProductModel.find({
        catId,
        _id: { $nin: Array.from(excludeSet) },
      })
        .limit(desiredLimit - results.length)
        .populate("category")
        .exec();
      addUnique(results, docs);
    }

    // 4) Then same brand
    if (results.length < desiredLimit && brand) {
      const docs = await ProductModel.find({
        brand,
        _id: { $nin: Array.from(excludeSet) },
      })
        .limit(desiredLimit - results.length)
        .populate("category")
        .exec();
      addUnique(results, docs);
    }

    // 5) Keyword / name similarity (either provided keywords or use product name)
    if (results.length < desiredLimit) {
      let keywordList = [];
      if (keywords) {
        keywordList = keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean)
          .slice(0, 5);
      } else if (productId) {
        try {
          const base = await ProductModel.findById(productId).select("name").lean();
          if (base?.name) {
            // split name into meaningful tokens (skip tiny words)
            keywordList = base.name
              .split(/\s+/)
              .map((w) => w.replace(/[^\w\-]/g, ""))
              .filter((w) => w.length > 2)
              .slice(0, 5);
          }
        } catch (e) {
          // ignore
        }
      }

      if (keywordList.length) {
        // Build OR regex queries for keywords
        const orQueries = keywordList.map((kw) => ({
          name: { $regex: kw.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"), $options: "i" },
        }));

        const docs = await ProductModel.find({
          $or: orQueries,
          _id: { $nin: Array.from(excludeSet) },
        })
          .limit(desiredLimit - results.length)
          .populate("category")
          .exec();

        addUnique(results, docs);
      }
    }

    // 6) Final fallback: random sampling (fills remaining slots)
    if (results.length < desiredLimit) {
      const remaining = desiredLimit - results.length;
      // Use aggregation $match + $sample
      const match = { _id: { $nin: Array.from(excludeSet) } };
      // Optionally prefer same category if provided (soft boost)
      if (catId) match.catId = catId;

      const sampled = await ProductModel.aggregate([
        { $match: match },
        { $sample: { size: remaining } },
      ]);

      // populate category for sampled docs (aggregate returns plain objects)
      const sampledIds = sampled.map((d) => d._id);
      if (sampledIds.length) {
        const populated = await ProductModel.find({ _id: { $in: sampledIds } }).populate("category").exec();
        addUnique(results, populated);
      }
    }

    // Ensure we never return the excluded productId
    const final = results.slice(0, desiredLimit).filter((p) => String(p._id) !== String(productId));


    return res.status(200).json({
      error: false,
      success: true,
      data: final,
      total: final.length,
    });
  } catch (error) {
    console.error("getSuggestions error:", error);
    return res.status(500).json({
      error: true,
      success: false,
      message: error.message || error,
    });
  }
}
export async function getRecentlyViewed(req, res) {
    try {
        const ids = req.body.ids || [];

        const products = await ProductModel.find({ _id: { $in: ids } })
            .populate("category");

        return res.status(200).json({
            error: false,
            success: true,
            data: products,
        });
    } catch (error) {
        return res.status(500).json({ error: true, success: false, message: error.message });
    }
}
