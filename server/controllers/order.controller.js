import mongoose from "mongoose";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import AddressModel from "../models/address.model.js";
import { v2 as cloudinary } from "cloudinary";
import sendEmailFun from "../config/sendEmail.js";
import orderConfirmationEmail from "../utils/EmailTemplates/orderConfirmed.js";
import fs from "fs";
import orderCancelledEmail from "../utils/EmailTemplates/orderCanceledEmail.js";
import orderDeliveredEmail from "../utils/EmailTemplates/orderDeliveredEmail.js";
import refundCompletedEmail from "../utils/EmailTemplates/orderRefundedEmail.js";
import orderReturnedEmail from "../utils/EmailTemplates/orderReturnedEmail.js";
import path from "path";


cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_Name,
  api_key: process.env.cloudinary_Config_API_Key,
  api_secret: process.env.cloudinary_Config_API_Secret,
  secure: true
});


let imagesArr = []





// Create a new order
export async function createOrder(req, res) {
  try {
    const {
      orderId,
      userId,
      products,          // renamed from 'items'
      delivery_address,  // renamed from 'shippingAddressId'
      paymentId,
      payment_status,
      totalAmt,
      order_type,
    } = req.body;

    console.log("order.............................................................................")

    // Validate user
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Validate address
    const address = await AddressModel.findById(delivery_address);
    if (!address) return res.status(404).json({ message: "Address not found" });

    const finalOrderId = orderId || `ORD-${Date.now()}`;

    const existingOrder = await OrderModel.findOne({ orderId: finalOrderId });
    if (existingOrder) {
      return res.status(200).json({ message: "Order already exists", order: existingOrder });
    }






    // Create order
    const order = new OrderModel({
      orderId: finalOrderId,
      userId,
      products,
      delivery_address,
      paymentId,
      payment_status,
      totalAmt,
      order_Status: "Pending",
      order_type,
    });

    const savedOrder = await order.save();

    await UserModel.findByIdAndUpdate(
      userId,
      { $push: { orders: savedOrder._id } },
      { new: true }
    );

    sendEmailFun(
      user?.email,
      `Order Confirmed – ${orderId}`,
      ``,
      orderConfirmationEmail(user?.name, orderId, totalAmt, `Delivery in ${delivery_days} days`)
    );


    res.status(200).json({
      message: "Order created",
      order: savedOrder,
      error: false,
      success: true
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
}

// Get all orders
export async function getAllOrders(req, res) {
  try {
    const orders = await OrderModel.find()
      .populate("userId")
      .populate('delivery_address');

    console.log(orders)

    res.status(200).json({
      error: false,
      success: true,
      data: orders
    }
    );
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
}

export async function getOrdersByUser(req, res) {
  try {
    const userId = req.userId;
    console.log("UuuuuuuuuuuuuuuuuuuuuusssssssssssseeeeeeeeeeeeeeeeerrrrrrrrId", userId)

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const orders = await OrderModel.find({ userId }).populate("userId");

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json({
      error: false,
      success: true,
      data: orders
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user orders",
      error: error.message
    });
  }
}
// Update order status
export async function updateOrderStatus(req, res) {
  try {
    const { orderId } = req.query;
    const { order_Status } = req.body;

    const order = await OrderModel.findById(orderId).populate("userId");
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.order_Status = order_Status;
    order.updatedAt = new Date();
    await order.save();

    const user = order.userId;
    const email = user.email;
    const name = user.name;
    const totalAmt = order.totalAmt;
    const paymentMethod = order.order_type;
    const orderProducts = order.products;

    // Create products list HTML for emails
    const itemsHtml = `
      <ul style="padding-left: 20px; margin-top: 10px;">
        ${orderProducts
        .map(
          (item) =>
            `<li>🛒 ${item.productTitle || "Item"} – Qty: ${item.quantity}</li>`
        )
        .join("")}
      </ul>
    `;

    // Conditional Email Sending Based on New Status
    switch (order_Status) {
      case "Canceled":
        await sendEmailFun(
          email,
          `❌ Order Cancelled – ${order.orderId}`,
          ``,
          orderCancelledEmail(
            name,
            order.orderId,
            "If you paid online, your refund will be processed within 5–7 working days."
          )
        );
        break;

      case "Delivered":
        // Set delivery date
        order.delivery_date = Date.now();

        // Save the updated order (MongoDB assumed)
        await order.save();

        // Send email
        await sendEmailFun(
          email,
          `✅ Order Delivered – ${order.orderId}`,
          ``,
          orderDeliveredEmail(
            name,
            order.orderId,
            new Date(order.delivery_date).toLocaleDateString("en-IN", {
              timeZone: "Asia/Kolkata",
              year: "numeric",
              month: "long",
              day: "2-digit",
            }),
            itemsHtml
          )
        );

        break;

      case "Refunded":
        await sendEmailFun(
          email,
          `💸 Refund Completed – ${order.orderId}`,
          ``,
          refundCompletedEmail(name, order.orderId, totalAmt, paymentMethod)
        );
        break;

      case "Returned":
        await sendEmailFun(
          email,
          `↩️ Order Returned – ${order.orderId}`,
          ``,
          orderReturnedEmail(name, order.orderId, undefined, itemsHtml)
        );
        break;

      case "Confirmed":
      case "Processing":
      case "Pending":
        // Optional: Send emails for other statuses if needed
        break;

      default:
        console.warn("No email template configured for this status:", order_Status);
    }

    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }
}

export async function updatePaymentStatus(req, res) {
  try {
    const { orderId, payment_status } = req.body; // ✅ get orderId from body

    const order = await OrderModel.findById(orderId).populate("userId");
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.payment_status = payment_status;
    order.updatedAt = new Date();
    await order.save();

    const user = order.userId;
    const email = user.email;
    const name = user.name;
    const orderIdStr = order.orderId;
    const totalAmt = order.totalAmt;
    const paymentMethod = order.order_type;
    const orderProducts = order.products;

    // ✅ Create product list HTML for email
    

    res.status(200).json({ message: "Payment status updated", order });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({
      message: "Failed to update payment status",
      error: error.message,
    });
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
// Remove an item from orders
export const deleteOrdersItemController = async (req, res) => {
  try {
    const userId = req.userId;
    const { _id, productId } = req.body;

    if (!_id || !productId) {
      return res.status(400).json({ message: "Provide _id and productId" });
    }

    const order = await OrderModel.findOne({ _id, userId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.products = order.products.filter(p => p.productId !== productId);
    await order.save();

    return res.status(200).json({ message: "Item removed from order", order });

  } catch (error) {
    console.error("Error in deleteOrdersItemController:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};
// Update quantity of a product in an order
export const updateOrdersItemQtyController = async (req, res) => {
  try {
    const userId = req.userId;
    const { _id, productId, qty } = req.body;

    if (!_id || !productId || !qty) {
      return res.status(400).json({ message: "Provide _id, productId, and qty" });
    }

    const order = await OrderModel.findOne({ _id, userId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    const product = order.products.find(p => p.productId === productId);
    if (!product) return res.status(404).json({ message: "Product not found in order" });

    product.quantity = qty;
    product.subTotal = product.price * qty;

    await order.save();

    res.status(200).json({ message: "Order item updated", order });

  } catch (error) {
    console.error("Error in updateOrdersItemQtyController:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};


// In your controller
export async function getOrderById(req, res) {
  try {
    const { orderId } = req.params;

    const order = await OrderModel.findOne({ _id: orderId }) // or { orderId } if custom

      .populate('userId', 'name email') // optional, populate user
      .populate('delivery_address');    // optional, populate address

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}





export async function uploadSinglePDF(request, response) {
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


export async function uploadInvoice(request, response) {
  try {
    const orderId = request.query.orderId?.replace(/[{}]/g, '');
    const imgUrl = request.file; // Should be a string

    // If `imgUrl` is an array with one item, get the first one
    const singleUrl = Array.isArray(imgUrl) ? imgUrl[0] : imgUrl;

    await OrderModel.findByIdAndUpdate(orderId, {
      invoiceUrl: singleUrl,
    });

    return response.status(200).json({
      error: false,
      success: true,
      message: "Successfully uploaded",
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}





// In your controller file
export const setEstimatedDeliveryDate = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { estimatedDate } = req.body;

    if (!estimatedDate) {
      return res.status(400).json({ error: true, message: "Estimated date is required" });
    }

    const order = await OrderModel.findByIdAndUpdate(
      orderId,
      { estimated_delivery_date: new Date(estimatedDate) },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: true, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Estimated delivery date updated",
      data: order.estimated_delivery_date,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Server error" });
  }
};


export const downloadInvoiceImage = async (req, res) => {
  const { orderId } = req.params;

  try {
    // Define supported image types (you can support both .jpg and .png)
    const possibleExtensions = [".jpg", ".jpeg", ".png"];

    let invoicePath = null;
    let fileExtension = null;

    for (let ext of possibleExtensions) {
      const fullPath = path.resolve(`./invoices/invoice-${orderId}${ext}`);
      if (fs.existsSync(fullPath)) {
        invoicePath = fullPath;
        fileExtension = ext;
        break;
      }
    }

    if (!invoicePath) {
      return res.status(404).json({
        success: false,
        message: "Invoice image not found",
      });
    }

    // Set headers for image download
    res.setHeader("Content-Type", `image/${fileExtension.replace(".", "")}`);
    res.setHeader("Content-Disposition", `attachment; filename=invoice-${orderId}${fileExtension}`);

    const imageStream = fs.createReadStream(invoicePath);
    imageStream.pipe(res);

  } catch (error) {
    console.error("Error downloading invoice image:", error);
    res.status(500).json({
      success: false,
      message: "Failed to download invoice image",
    });
  }
};