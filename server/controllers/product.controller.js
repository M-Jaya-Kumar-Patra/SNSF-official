import ProductModel from "../models/product.model.js";
import { v2 as cloudinary } from "cloudinary";
import { error } from "console";
import fs from "fs";
import CategoryModel from "../models/category.model.js";

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.cloudinary_Config_Cloud_Name,
    api_key: process.env.cloudinary_Config_API_Key,
    api_secret: process.env.cloudinary_Config_API_Secret,
    secure: true
});


let imagesArr = []

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
            overwrite: false,
        };

        for (let i = 0; i < image.length; i++) {
            const result = await cloudinary.uploader.upload(image[i].path, options);
            imagesArr.push(result.secure_url);
            fs.unlinkSync(image[i].path);
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
// createProduct
export async function createProduct(request, response) {
    try {


        console.log("Images Array:", imagesArr);

        console.log(request.body)
        const product = new ProductModel({
            name: request.body.name,
            description: request.body.description,
            images: request.body.images,
            brand: request.body.brand,
            price: request.body.price,
            oldPrice: request.body.oldPrice,
            catName: request.body.catName,//1
            catId: request.body.catId,//1
            subCat: request.body.subCat,//2
            subCatId: request.body.subCatId,//2
            thirdSubCat: request.body.thirdSubCat,//3
            thirdSubCatId: request.body.thirdSubCatId,//3
            countInStock: request.body.countInStock,
            rating: request.body.rating,
            isFeatured: request.body.isFeatured,
            discount: request.body.discount,
            productWeight: request.body.productWeight,
            brand: request.body.brand,
            size: request.body.size, // ✅ add this line
        });
        await product.save()

        if (!product) {
            response.status(500).json({
                error: true,
                success: false,
                message: "Product Not Created"
            })
        }

        imagesArr = [];
        response.status(200).json({
            error: false,
            success: true,
            message: "Product created successfully"
        });


    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// /api/product/getProducts.js

export async function getAllProducts(request, response) {
    try {
        const products = await ProductModel.find();

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


export async function getAllProductsByCatId(request, response) {
    try {
        const page = parseInt(request.query.page) || 1;
        const perPage = parseInt(request.query.perPage) || 10;

        const totalPosts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return response.status(404).json({
                message: "Page not found",
                success: false,
                error: true
            });
        }

        const products = await ProductModel.find({ catId: request.params.Id })
            .populate("category").skip((page - 1) * perPage)
            .limit(perPage).exec();
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

export async function getAllProductsByCatName(request, response) {
    try {
        const page = parseInt(request.query.page) || 1;
        const perPage = parseInt(request.query.perPage) || 10;

        const totalPosts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return response.status(404).json({
                message: "Page not found",
                success: false,
                error: true
            });
        }

        const products = await ProductModel.find({ catName: request.query.catName })
            .populate("category").skip((page - 1) * perPage)
            .limit(perPage).exec();
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

export async function getAllProductsBySubCatId(request, response) {
    try {
        const page = parseInt(request.query.page) || 1;
        const perPage = parseInt(request.query.perPage) || 10;

        const totalPosts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return response.status(404).json({
                message: "Page not found",
                success: false,
                error: true
            });
        }

        const products = await ProductModel.find({ subCatId: request.params.Id })
            .populate("category").skip((page - 1) * perPage)
            .limit(perPage).exec();
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

export async function getAllProductsBySubCatName(request, response) {
    try {
        const page = parseInt(request.query.page) || 1;
        const perPage = parseInt(request.query.perPage) || 10;

        const totalPosts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return response.status(404).json({
                message: "Page not found",
                success: false,
                error: true
            });
        }

        const products = await ProductModel.find({ subCat: request.query.catName })
            .populate("category").skip((page - 1) * perPage)
            .limit(perPage).exec();
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

export async function getAllProductsByThirdCatId(request, response) {
    try {
        const page = parseInt(request.query.page) || 1;
        const perPage = parseInt(request.query.perPage) || 10;

        const totalPosts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return response.status(404).json({
                message: "Page not found",
                success: false,
                error: true
            });
        }

        const products = await ProductModel.find({ thirdSubCatId: request.params.thirdSubCatId })
            .populate("category").skip((page - 1) * perPage)
            .limit(perPage).exec();
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

export async function getAllProductsByThirdCatName(request, response) {
    try {
        const page = parseInt(request.query.page) || 1;
        const perPage = parseInt(request.query.perPage) || 10;

        const totalPosts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return response.status(404).json({
                message: "Page not found",
                success: false,
                error: true
            });
        }

        const products = await ProductModel.find({ thirdSubCat: request.query.thirdSubCat })
            .populate("category").skip((page - 1) * perPage)
            .limit(perPage).exec();
        if (!products) {
            response.status(500).json({
                error: true,
                success: false
            })


        }
        return response.status(200).json({
            error: false,
            success: true,
            data: products,
            totalPages: totalPages,
            page: page
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function getAllProductsByPrice(request, response) {
    try {
        let productList = [];

        // Filter by Category ID
        if (request.query.catId !== "" && request.query.catId !== undefined) {
            const productListArr = await ProductModel.find({
                catId: request.query.catId,
            }).populate("category");
            productList = productListArr;
        }

        // Filter by Third Sub Category ID
        if (request.query.thirdSubCatId !== "" && request.query.thirdSubCatId !== undefined) {
            const productListArr = await ProductModel.find({
                thirdSubCatId: request.query.thirdSubCatId,
            }).populate("category");
            productList = productListArr;
        }

        // Filter by Price Range
        const filteredProducts = productList.filter((product) => {
            if (request.query.minPrice && product.price < parseInt(request.query.minPrice)) {
                return false;
            }
            if (request.query.maxPrice && product.price > parseInt(request.query.maxPrice)) {
                return false;
            }
            return true;
        });

        return response.status(200).json({
            error: false,
            success: true,
            products: filteredProducts,
            totalPages: 0,
            page: 0,
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
        const page = parseInt(request.query.page) || 1;
        const perPage = parseInt(request.query.perPage) || 10;

        const totalPosts = await ProductModel.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return response.status(404).json({
                message: "Page not found",
                success: false,
                error: true
            });
        }

        let products = []

        if (request.query.catId !== undefined) {
            products = await ProductModel.find({
                rating: request.query.rating,
                catId: request.query.catId
            })
                .populate("category").skip((page - 1) * perPage)
                .limit(perPage).exec();
        }
        if (request.query.subCatId !== undefined) {
            products = await ProductModel.find({
                rating: request.query.rating,
                subCatId: request.query.subCatId
            })
                .populate("category").skip((page - 1) * perPage)
                .limit(perPage).exec();
        }
        if (request.query.thirdSubCatId !== undefined) {
            products = await ProductModel.find({
                rating: request.query.rating,
                thirdSubCatId: request.query.thirdSubCatId
            })
                .populate("category").skip((page - 1) * perPage)
                .limit(perPage).exec();
        }




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
        const products = await ProductModel.find({
            isFeatured: request.query.isFeatured
        }).populate("category")

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

export async function getProduct(request, response) {
    try {
        const product = await ProductModel.findById(request.params.id).populate("category");

        if (!product) {
            return response.status(404).json({
                message: "The product is not found",
                error: true,
                success: false
            })
        }

        return response.status(200).json({
            error: false,
            success: true,
            product: product
        })


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
        const product = await ProductModel.findByIdAndUpdate(
            request.params.id, {
            name: request.body.name,
            description: request.body.description,
            images: request.body.images,
            brand: request.body.brand,
            price: request.body.price,
            oldPrice: request.body.oldPrice,
            catName: request.body.catName,//1
            catId: request.body.catId,//1
            subCat: request.body.subCat,//1
            subCatId: request.body.subCatId,//2
            thirdSubCat: request.body.thirdsubCat,//3
            thirdSubCatId: request.body.thirdsubCatId,//3
            countInStock: request.body.countInStock,
            rating: request.body.rating,
            isFeatured: request.body.isFeatured,
            discount: request.body.discount,
            productWeight: request.body.productWeight,
            brand: request.body.brand,
        },

            { new: true }
        );

        if (!product) {
            response.status(404).json({
                status: false,
                message: "The product cannot be updated"
            })
        }

        imagesArr = [];

        return response.status(200).json({
            message: "The product is created",
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
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

    // Always apply price range
    query.price = {
      $gte: parseFloat(minPrice) || 0,
      $lte: parseFloat(maxPrice) || Infinity
    };

    // Optional rating filter
    if (rating !== undefined && rating !== null) {
      query.rating = { $gte: parseFloat(rating) };
    }

    // Log the final query for debugging
    console.log("Query filters:", query);

    // Pagination logic
    const parsedLimit = parseInt(limit) || 10;
    const skip = (parseInt(page) - 1) * parsedLimit;

    const products = await ProductModel.find(query)
      .populate("category")
      .skip(skip)
      .limit(parsedLimit);

    const total = await ProductModel.countDocuments(query);

    console.log("Total matched documents:", total);
console.log("Returned products:", products.length);

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




