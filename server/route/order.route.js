import { Router } from "express";
import auth from "../middlewares/auth.js";
import {createOrder, getAllOrders, getOrderById, getOrdersByUser, updateOrderStatus, updatePaymentStatus, deleteOrder, deleteOrdersItemController, updateOrdersItemQtyController, uploadSinglePDF, removeImageFromCloudinary, uploadInvoice, setEstimatedDeliveryDate, downloadInvoiceImage} from "../controllers/order.controller.js"

import upload from "../middlewares/multer.js";

const orderRouter = Router()


orderRouter.post('/create',auth, createOrder)
orderRouter.get('/get',auth, getAllOrders)
orderRouter.get('/getByUser',auth, getOrdersByUser)
orderRouter.post('/updateStatus',auth, updateOrderStatus)
orderRouter.delete('/deleteOrder',auth, deleteOrder)
orderRouter.delete('/deleteItem',auth, deleteOrdersItemController)
orderRouter.post('/update-qty',auth, updateOrdersItemQtyController)
orderRouter.get('/:orderId',auth, getOrderById)
orderRouter.post('/uploadImages', auth, upload.array('images'), uploadSinglePDF)
orderRouter.delete("/deleteImg", auth, removeImageFromCloudinary);
orderRouter.post("/uploadInvoice", auth, uploadInvoice);
orderRouter.post("/setEstimatedDate/:orderId", auth, setEstimatedDeliveryDate );
orderRouter.post('/updatePaymentStatus',auth, updatePaymentStatus)
orderRouter.get('/:orderId/invoice', auth, downloadInvoiceImage);  



export default orderRouter          