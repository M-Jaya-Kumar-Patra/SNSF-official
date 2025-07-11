import { request } from "express";
import UserModel from "../models/user.model.js";
import AddressModel from "../models/address.model.js";
import mongoose from "mongoose";
import WishlistModel from "../models/wishlist.model.js";

export const addToWishlist = async (request, response) => {
    try {
        const userId = request.userId;
        const { productTitle, image, brand, productId } = request.body;

        if (!productId) {
            return response.status(404).json({
                message: "Provide productId",
                error: true,
                success: false,
            });
        }

        const checkItemWishlist = await WishlistModel.findOne({ userId, productId });

        if (checkItemWishlist) {
            return response.status(400).json({
                message: "Item already in Wishlist",
                success: false,
                error: true
            });
        }

        const wishlistItem = await WishlistModel.create({
            productTitle: productTitle,
            image: image,
            productId: productId,
            userId: userId,
            brand: brand || "Unknown Brand",
        });

        const save = await wishlistItem.save()


        await UserModel.findByIdAndUpdate(userId, {
            $push: { wishlist: productId }
        });


        return response.status(200).json({
            data: save,
            message: "Item added to wishlist",
            success: true,
            error: false,
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || "Internal Server Error",
            success: false,
            error: true,
        });
    }
};

export const getWishlistItemController = async (req, res) => {
    try {
        const userId = req.userId;


        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized: No user ID found",
                success: false,
                error: true,
            });
        }

        const wishlistItem = await WishlistModel.find({ userId: userId });


        return res.status(200).json({
            success: true,
            error: false,
            data: wishlistItem,
        });

    } catch (error) {
        console.error("Error in getWishlistItemController:", error);
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message || error,
            success: false,
        });
    }
};

export const deleteWishlistItemContoller = async (request, response) => {
    try {
        const userId = request.userId;

        const { _id, productId } = request.body;

        if (!_id || !productId) {
            return response.status(400).json({
                message: "Provide _id and productId",
                error: true,
                success: false
            });
        }

        const deleteWishlistItem = await WishlistModel.deleteOne({
            _id: _id,
            userId: userId
        });

        if (!deleteWishlistItem) {
            return response.status(404).json({
                message: "The product in the Wishlist is not found",
                error: true,
                success: false
            });
        }


        const user = await UserModel.findOne({ _id: userId });

        if (!user || !Array.isArray(user.wishlist)) {
            return response.status(404).json({
                message: "User not found or Wishlist is invalid",
                error: true,
                success: false
            });
        } ``

        user.wishlist = user.wishlist.filter(
            (id) => id.toString() !== productId
        );

        await user.save();
        console.log("Saved successfully");

        return response.status(200).json({
            message: "Item removed",
            error: false,
            success: true,
            data: deleteWishlistItem
        });

    } catch (error) {
        console.error("Error in deleteWishlistItemQtyContoller:", error);
        return response.status(500).json({
            message: "Something went wrong",
            error: error.message || error,
            success: false,
        });
    }
};
