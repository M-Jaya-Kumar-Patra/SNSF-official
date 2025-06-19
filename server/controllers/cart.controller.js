import { request } from "express";
import CartProductModel from "../models/cartProduct.model.js";
import UserModel from "../models/user.model.js";
import AddressModel from "../models/address.model.js";
import mongoose from "mongoose";

export const addToCartItemController = async (request, response) => {
  try {
    const userId = request.userId;
    const { productTitle, image, rating, brand, price, quantity, subTotal, productId, countInStock } = request.body;

    if (!productId) {
      return response.status(404).json({
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
      productTitle: productTitle,
      image: image,
      rating: rating,
      price: price,
      quantity: quantity,
      subTotal: subTotal,
      productId: productId,
      countInStock: countInStock,
      userId: userId,
      brand: brand
    });

    const save = await cartItem.save()


    await UserModel.findByIdAndUpdate(userId, {
      $push: { shopping_cart: productId }
    });


    return response.status(200).json({
      data: save,
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
    const userId = req.userId;

    console.log(userId, "dddddddddd")

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized: No user ID found",
        success: false,
        error: true,
      });
    }

    const cartItem = await CartProductModel.find({ userId: userId });


    return res.status(200).json({
      success: true,
      error: false,
      data: cartItem,
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

    console.log(userId, request.body)
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

    if (!deleteCartItem) {
      return response.status(404).json({
        message: "The product in the cart is not found",
        error: true,
        success: false
      });
    }


    const user = await UserModel.findOne({ _id: userId });
    console.log(Array.isArray(user.shopping_cart))


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

    console.log("Saving updated shopping_cart:.....................................................................", user.shopping_cart);
await user.save();
console.log("Saved successfully");

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


export const emptyCartController = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "User ID is required",
      });
    }

    // 1. Delete all cart products
    const result = await CartProductModel.deleteMany({ userId });

    // 2. Also clear embedded shopping_cart in user model
    await UserModel.findByIdAndUpdate(userId, {
      $set: { shopping_cart: [] },
    });

    return res.status(200).json({
      error: false,
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.error("Failed to empty cart:", error);
    return res.status(500).json({
      error: true,
      success: false,
      message: "Something went wrong while emptying the cart",
    });
  }
};