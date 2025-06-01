import { request } from "express";
import CartProductModel from "../models/cartProduct.model.js";
import UserModel from "../models/user.model.js";
import mongoose from "mongoose";

export const addToCartItemController = async (request, response) => {
    try {
        const userId = request.userId;
        const { productId } = request.body;

        if (!productId) {
            return response.status(400).json({
                message: "Provide productId",
                error: true,
                success: false,
            });
        }

        const checkItemCart = await CartProductModel.findOne({ userId, productId });

        if (checkItemCart) {
            return response.status(400).json({
                message: "Item already in cart",
                success: false,
                error: true
            });
        }

        const cartItem = await CartProductModel.create({
            quantity: 1,
            userId,
            productId,
        });

        // Optional: update shopping_cart in User
        await UserModel.updateOne({ _id: userId }, {
            $push: { shopping_cart: productId },
        });

        return response.status(200).json({
            data: cartItem,
            message: "Item added successfully",
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


export const getCartItemController = async (req, res) => {
    try {
        // userId is set by the auth middleware
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized: No user ID found",
                success: false,
                error: true,
            });
        }

        // Find cart items for this user and populate product details
        const cartItems = await CartProductModel.find({ userId })
            .populate('productId')  // Populates product details from Product collection
            .exec();

        return res.status(200).json({
            message: "Cart item list",
            success: true,
            cartItems,  // Return cart items array with product info included
        });

    } catch (error) {
        console.error("Error in getCartItemController:", error);
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message || error,
            success: false,
        });
    }
};

export const updateCartItemQtyController = async (request, response) => {
    try {
        const userId = request.userId
        const { _id, qty } = request.body

        if (!_id || !qty) {
            return response.status(400).json({
                message: "Provide _id and qty",
                error: true,
                success: false
            })
        }

        const updateCartItem = await CartProductModel.updateOne({
            _id: _id,
            userId: userId
        }, {
            quantity: qty
        })
        return response.json({
            message: "Update cart",
            success: true,
            error: false,
            data: updateCartItem
        })


    } catch (error) {
        console.error("Error in getCartItemController:", error);
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message || error,
            success: false,
        });
    }
}

export const deleteCartItemQtyContoller = async (request, response) => {
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

    const deleteCartItem = await CartProductModel.deleteOne({
      _id: _id,
      userId: userId
    });

    if (!deleteCartItem.deletedCount) {
      return response.status(404).json({
        message: "The product in the cart is not found",
        error: true,
        success: false
      });
    }

    const user = await UserModel.findOne({ _id: userId });

    if (!user || !Array.isArray(user.shopping_cart)) {
      return response.status(404).json({
        message: "User not found or cart is invalid",
        error: true,
        success: false
      });
    }

    user.shopping_cart = user.shopping_cart.filter(
      (id) => id.toString() !== productId
    );

    await user.save();

    return response.status(200).json({
      message: "Item removed",
      error: false,
      success: true,
      data: deleteCartItem
    });

  } catch (error) {
    console.error("Error in deleteCartItemQtyContoller:", error);
    return response.status(500).json({
      message: "Something went wrong",
      error: error.message || error,
      success: false,
    });
  }
};
