import mongoose from "mongoose";
import OrderModel from "../models/order.model.js";  // Assuming you have an order model
import UserModel from "../models/user.model.js";
import AddressModel from "../models/address.model.js";


// Create a new order
export async function createOrder(req, res) {
  try {
    const { userId, items, shippingAddressId, paymentInfo, totalAmount } = req.body;

    // Validate user
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Validate address
    const address = await AddressModel.findById(shippingAddressId);
    if (!address) return res.status(404).json({ message: "Address not found" });

    // Create order
    const order = new OrderModel({
      user: userId,
      items,
      shippingAddress: address,
      paymentInfo,
      totalAmount,
      status: "pending", // default order status
      createdAt: new Date(),
    });

    const savedOrder = await order.save();

    res.status(201).json({ message: "Order created", order: savedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
}


// Get all orders (could be admin only)
export async function getAllOrders(req, res) {
  try {
    const orders = await OrderModel.find()
      .populate("user", "name email")
      .populate("shippingAddress");
    
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
}


// Get orders by user
export async function getOrdersByUser(req, res) {
  try {
    const { userId } = req.params;
    const orders = await OrderModel.find({ user: userId })
      .populate("shippingAddress");

    if (!orders.length) return res.status(404).json({ message: "No orders found for this user" });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user orders", error: error.message });
  }
}


// Update order status (e.g. pending -> shipped -> delivered)
export async function updateOrderStatus(req, res) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await OrderModel.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    order.updatedAt = new Date();

    await order.save();

    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status", error: error.message });
  }
}


// Delete an order
export async function deleteOrder(req, res) {
  try {
    const { orderId } = req.params;

    const deletedOrder = await OrderModel.findByIdAndDelete(orderId);

    if (!deletedOrder) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete order", error: error.message });
  }
}
