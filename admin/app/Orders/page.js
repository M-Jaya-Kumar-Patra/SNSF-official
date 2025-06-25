"use client"

import React, { useState, useEffect } from 'react'
import { useOrders } from '../context/OrdersContext'
import { usePrd } from '../context/ProductContext'
import { useAlert } from '../context/AlertContext'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { postData, deleteImages } from '@/utils/api'
import Button from '@mui/material/Button'
import PDFUploadBox from '@/components/PDFUploadBox';
import { IoMdClose } from "react-icons/io";

import UploadBox from '@/components/UploadBox'




const statusOptions = [
    { value: "Pending", label: "Pending", color: "bg-amber-100", text: "#92400e" },
    { value: "Confirmed", label: "Confirmed", color: "bg-blue-100", text: "#1d4ed8" },
    { value: "Processing", label: "Processing", color: "bg-cyan-100", text: "#155e75" },
    { value: "Delivered", label: "Delivered", color: "bg-green-100", text: "#15803d" },
    { value: "Canceled", label: "Canceled", color: "bg-red-100", text: "#b91c1c" },
    { value: "Returned", label: "Returned", color: "bg-orange-100", text: "#7c2d12" },
    { value: "Refunded", label: "Refunded", color: "bg-lime-100", text: "#3f6212" },
];

const getStatusStyle = (status) => {
    const found = statusOptions.find(opt => opt.value === status);
    return {
        bgClass: found?.color || "bg-gray-100",
        textColor: found?.text || "#334155",
    };
};

const Orders = () => {



    const [formFields, setFormFields] = useState({
        images: []  // single PDF instead of array
    });

    const { getOrders, ordersData } = useOrders();
    const router = useRouter();
    const alert = useAlert();
    const { userData } = useAuth()

    const [statusMap, setStatusMap] = useState({});
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        getOrders();
    }, []);




    const getNotificationMessage = (status, orderCode) => {
        const boldCode = `<strong>${orderCode}</strong>`;
        switch (status) {
            case "Confirmed":
                return `Great news! Your order ${boldCode} has been confirmed. We'll process it soon.`;
            case "Processing":
                return `Your order ${boldCode} is being prepared. Hang tight!`;
            case "Delivered":
                return `Woohoo! Your order ${boldCode} has been delivered. Enjoy!`;
            case "Canceled":
                return `Your order ${boldCode} has been canceled. Contact support if needed.`;
            case "Returned":
                return `We’ve received the return for your order ${boldCode}. Thank you!`;
            case "Refunded":
                return `Your refund for order ${boldCode} has been processed.`;
            default:
                return `Update on your order ${boldCode}.`;
        }
    };



    const handleChangeOrderStatus = async (orderId, newStatus, order) => {
        console.log("Updating order ID:", orderId);

        try {
            // 1. Update the order status
            const updateRes = await postData(`/api/order/updateStatus?orderId=${orderId}`, {
                order_Status: newStatus
            }, true);

            if (updateRes.error) {
                alert.alertBox({ type: "error", msg: "Failed to update status" });
                return;
            }

            alert.alertBox({ type: "success", msg: "Status updated" });
            setStatusMap((prev) => ({ ...prev, [orderId]: newStatus }));

            // 2. Send notification
            const body = {
                recipientId: order?.delivery_address?.userId[0], // Make sure this is a valid ObjectId
                message: getNotificationMessage(newStatus, order?.orderId),
                image: "", // Optionally add product or order image
                link: `/orderDetails/${order?._id}`, // Link to order details
            };

            const notifyRes = await postData(`/api/notice/send`, body, true);

            if (!notifyRes.error) {
                console.log("✅ Notification sent:", notifyRes.data);
            } else {
                console.error("❌ Failed to send notification:", notifyRes.message);
            }
        } catch (err) {
            console.error("❌ Unexpected error:", err.message);
            alert.alertBox({ type: "error", msg: "Something went wrong" });
        }
    };

    const handleOrderDetails = (order) => {
        setSelectedOrder(order);

        // Show invoice if it exists
        if (order?.invoiceImages?.length > 0) {
            setPreviews(order.invoiceImages);
        } else if (order?.invoiceUrl) {
            setPreviews([order.invoiceUrl]); // ✅ Add this
        } else {
            setPreviews([]);
        }
    };


    const closeDetails = () => {
        setSelectedOrder(null);
    };


    const [isUploading, setIsUploading] = useState(false);


    const [previews, setPreviews] = useState([]);

    const setPreviewsFun = (previewsArr) => {
        setPreviews(previewsArr)
        setFormFields((prev) => ({
            ...prev,
            images: previewsArr // ✅ set it in formFields
        }));

    }


    const handleChangeAdd = (e) => {
        e.preventDefault();
        setFormFields({ ...formFields, [e.target.name]: e.target.value });


    }

 const handleSubmitAddForm = async (e) => {
  e.preventDefault();

  if (!formFields.images || previews.length === 0) {
    alert.alertBox({ type: "error", msg: "Please select invoice image" });
    return;
  }

  try {
    const response = await postData(
      `/api/order/uploadInvoice?orderId=${selectedOrder._id}`,
      formFields
    );

    if (!response.error) {
      alert.alertBox({ type: "success", msg: "Invoice uploaded!" });

      // Reset form
      setFormFields({ images: [] });
      setPreviews([]);

      // 🔁 Refresh orders
      setTimeout(() => getOrders(), 300);
    } else {
      alert.alertBox({
        type: "error",
        msg: response.message || "Failed to upload invoice",
      });
    }
  } catch (err) {
    console.error("❌ Upload failed:", err);
    alert.alertBox({ type: "error", msg: "Something went wrong. Please try again." });
  }
};



    const removeImage = async (image, index) => {
        const publicId = image.split("/").pop().split(".")[0]; // Extract public_id from URL
        console.log(previews, "previews")
        var imageArr = []
        imageArr = previews;
        console.log(image, "image")
        deleteImages(`/api/order/deleteImg?img=${publicId}`).then((response) => {
            console.log(response)
            imageArr.splice(index, 1);

            setPreviews([])

            setTimeout(() => {
                setPreviews(imageArr);
                setFormFields(previews => ({
                    ...previews,
                    images: imageArr
                })
                )
            }, 100)
            setPreviews([])
        })
    }



    const updateEstimatedDeliveryDate = async (orderId, date) => {
        try {
            const res = await postData(`/api/order/setEstimatedDate/${orderId}`, {
                estimatedDate: date,
            }, true);

            if (res.success) {
                alert.alertBox({ type: "success", msg: "Estimated delivery date updated!" });
                getOrders(); // Refresh data
            } else {
                alert.alertBox({ type: "error", msg: res.message || "Failed to update date" });
            }
        } catch (err) {
            console.error(err);
            alert.alertBox({ type: "error", msg: "Something went wrong." });
        }
    };


    const paymentStatusOptions = [
        "Pending",
        "Completed",
        "Canceled",
        "Refunded",
    ];

const handleChangePaymentStatus = async (orderId, newStatus) => {
  try {
    const res = await postData(
      `/api/order/updatePaymentStatus`,
      { orderId, payment_status: newStatus },
      true
    );

    if (!res.error) {
      alert.alertBox({ type: "success", msg: "Payment status updated!" });

      // Optional: Manually update order in UI without full refresh
      setStatusMap((prev) => ({ ...prev, [orderId]: newStatus }));

      // Ensure fresh fetch (wait to avoid race conditions)
      setTimeout(() => {
        getOrders();
      }, 300);
    } else {
      console.error("❌ Payment update failed:", res);
      alert.alertBox({ type: "error", msg: res.message || "Failed to update status" });
    }
  } catch (err) {
    console.error("❌ Error updating payment status:", err);
    alert.alertBox({ type: "error", msg: "Something went wrong." });
  }
};






    return (
        <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse border border-slate-200 rounded-md shadow-lg">
                <thead className="h-12 bg-green-200">
                    <tr >
                        <th className="text-black px-4 py-2">Order ID</th>
                        <th className="text-black px-4 py-2">Order Date</th>
                        <th className="text-black px-4 py-2">Order Status</th>
                        <th className="text-black px-4 py-2">Total Products</th>
                        <th className="text-black px-4 py-2">Payment Method</th>
                        <th className="text-black px-4 py-2">Payment Status</th>
                        <th className="text-black px-4 py-2">Payment ID</th>
                        <th className="text-black px-4 py-2">Total</th>
                        <th className="text-black px-4 py-2">Delivery Date</th>
                        <th className="text-black px-4 py-2">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-slate-50">
                    {[...ordersData].reverse().map((order) => {
                        const currentStatus = statusMap[order._id] || order.order_Status;
                        const { bgClass, textColor } = getStatusStyle(currentStatus);

                        return (
                            <tr key={order._id} className="border-b border-slate-300">
                                <td className="text-black px-4 py-2 align-top cursor-pointer" onClick={() => handleOrderDetails(order)}>
                                    {order?.orderId}
                                </td>
                                <td className="text-black px-4 py-2 align-top" onClick={() => handleOrderDetails(order)}>
                                    {new Date(order?.createdAt).toLocaleString("en-IN", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "numeric",
                                        minute: "2-digit",
                                        hour12: true,
                                    })}
                                </td>
                                <td className="px-4 py-2 align-top">
                                    <div className={`rounded-lg p-1 ${bgClass}`}>
                                        <FormControl fullWidth>
                                            <Select
                                                value={currentStatus}
                                                onChange={(e) => handleChangeOrderStatus(order._id, e.target.value, order)}
                                                variant="standard"
                                                disableUnderline
                                                sx={{ color: textColor, fontWeight: 600 }}
                                            >
                                                {statusOptions.map((opt, i) => (
                                                    <MenuItem key={i} value={opt.value}>{opt.label}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                </td>
                                <td className="text-black px-4 py-2 align-top" onClick={() => handleOrderDetails(order)}>
                                    {order?.products?.length}
                                </td>
                                <td className="text-black px-4 py-2 align-top" onClick={() => handleOrderDetails(order)}>
                                    {order?.payment_method || "N/A"}
                                </td>
                                <td className="px-4 py-2 align-top">
                                    <FormControl fullWidth>
                                        <Select
                                            value={order?.payment_status}
                                            onChange={(e) => handleChangePaymentStatus(order._id, e.target.value)}
                                            variant="standard"
                                            disableUnderline
                                            sx={{ fontWeight: 600, textTransform: "capitalize" }}
                                        >
                                            {paymentStatusOptions.map((status) => (
                                                <MenuItem key={status} value={status}>
                                                    {status}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </td>

                                <td className="text-black px-4 py-2 align-top" onClick={() => handleOrderDetails(order)}>
                                    {order?.paymentId}
                                </td>
                                <td className="text-black px-4 py-2 align-top" onClick={() => handleOrderDetails(order)}>
                                    ₹{order?.totalAmt}
                                </td>
                                <td className="text-black px-4 py-2 align-top">
                                    <input
                                        type="date"
                                        value={
                                            order?.estimated_delivery_date
                                                ? new Date(order.estimated_delivery_date).toISOString().split("T")[0]
                                                : ""
                                        }
                                        onChange={(e) => updateEstimatedDeliveryDate(order._id, e.target.value)}
                                        className="border p-1 rounded text-sm"
                                    />
                                </td>

                                <td className="text-black px-4 py-2 align-top">
                                    <ModeEditOutlineIcon className="text-blue-600 cursor-pointer mr-4 active:bg-gray-200 rounded-full" />
                                    <DeleteOutlineIcon className="text-red-600 cursor-pointer active:bg-gray-200 rounded-full" />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>

            </table>

            {selectedOrder && (
                <div className="fixed inset-0 z-[300] flex justify-center items-center bg-black bg-opacity-50 overflow-y-auto">
                    <div className="modal-form w-[850px] relative max-h-[90%] my-9 p-5 rounded-md bg-white overflow-y-auto scrollbar-hide">
                        {/* Header */}
                        <div className="flex justify-between items-end mb-4">
                            <h1 className="text-black text-lg font-normal">
                                _id: <span className="text-gray-600 text-xl font-semibold">{selectedOrder?._id}</span>
                            </h1>
                            <div
                                className="px-2 py-1 font-semibold rounded-md text-white bg-red-600 text-lg border cursor-pointer"
                                onClick={() => setSelectedOrder(false)}
                            >
                                Close
                            </div>
                        </div>

                        {/* Order Info */}
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-black text-lg font-medium">
                                    Order ID: <span className="text-xl font-semibold">{selectedOrder?.orderId}</span>
                                </h2>

                                <div className="grid grid-cols-1 gap-4">
                                    {previews?.length > 0 && (
                                        <img
                                            src={previews[0]}
                                            alt="Invoice"
                                            className="w-40 h-auto rounded shadow"
                                        />
                                    )}

                                    {Array.isArray(selectedOrder?.invoiceUrl) &&
                                        selectedOrder.invoiceUrl.map((img, index) => (
                                            <div key={index} className="relative p-2 border border-gray-300 rounded-md bg-gray-50">
                                                <span
                                                    className="absolute w-[20px] h-[20px] rounded-full bg-red-700 -top-[5px] -right-[5px] flex items-center justify-center z-50 cursor-pointer"
                                                    onClick={() => removeImage(img, index)}
                                                >
                                                    <IoMdClose className="text-white text-[17px]" />
                                                </span>
                                                <div className="flex flex-col items-center justify-center">
                                                    <span className="text-xs text-gray-800 font-semibold text-center break-all">
                                                        {img.split("/").pop()}
                                                    </span>
                                                    <a href={img} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm underline mt-1">
                                                        View PDF
                                                    </a>
                                                </div>
                                            </div>
                                        ))}


                                    <UploadBox
                                        multiple={false}
                                        name="images"
                                        url="/api/order/uploadImages"
                                        setPreviewsFun={setPreviewsFun}
                                    />

                                    <Button
                                        variant="contained"
                                        onClick={handleSubmitAddForm}
                                        disabled={isUploading}
                                    >
                                        {isUploading ? "Uploading..." : "Upload"}
                                    </Button>

                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <h2 className="text-black text-lg font-medium">
                                    Order Date: <span className="text-xl font-medium">
                                        {new Date(selectedOrder?.createdAt).toLocaleString("en-IN", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour: "numeric",
                                            minute: "2-digit",
                                            hour12: true,
                                        })}
                                    </span>
                                </h2>

                                <h2 className="text-black text-lg font-medium">
                                    Order Status: <span className="text-xl font-semibold">{selectedOrder?.order_Status}</span>
                                </h2>
                            </div>

                            <div className="flex justify-between items-center">
                                <h2 className="text-black text-lg font-medium">
                                    Delivery Date: <span className="text-xl font-medium">
                                        {new Date(selectedOrder?.createdAt).toLocaleString("en-IN", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour: "numeric",
                                            minute: "2-digit",
                                            hour12: true,
                                        })}
                                    </span>
                                </h2>

                                <h2 className="text-black text-lg font-medium">
                                    Payment Status: <span className="text-xl font-semibold">{selectedOrder?.payment_status}</span>
                                </h2>
                            </div>

                            <div className="flex justify-end">
                                <h2 className="text-black text-lg font-medium">
                                    Payment Method: <span className="text-xl font-semibold">{selectedOrder?.payment_status}</span>
                                </h2>
                            </div>

                            <div className="flex justify-between items-center">
                                <h2 className="text-black text-lg font-medium">
                                    Total Amount: <span className="text-xl font-semibold">₹{selectedOrder?.totalAmt}</span>
                                </h2>
                                <h2 className="text-black text-lg font-medium">
                                    Payment ID: <span className="text-xl font-semibold">{selectedOrder?.paymentId}</span>
                                </h2>
                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="w-full p-3 border rounded-sm bg-white text-sm mb-4 text-gray-800">
                            <h2 className="text-lg font-semibold border-b pb-2 mb-3 text-gray-700">Delivery Address</h2>

                            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-lg">
                                <div><span className="font-medium">Name:</span> {selectedOrder?.delivery_address?.name || userData?.name}</div>
                                <div><span className="font-medium">Phone:</span> {selectedOrder?.delivery_address?.phone || 'N/A'}</div>
                                <div><span className="font-medium">Email:</span> {selectedOrder?.delivery_address?.email || userData?.email}</div>
                                <div><span className="font-medium">Pin Code:</span> {selectedOrder?.delivery_address?.pin || 'N/A'}</div>
                                <div className="col-span-2"><span className="font-medium">Address:</span> {selectedOrder?.delivery_address?.address || 'N/A'}</div>
                                <div><span className="font-medium">City:</span> {selectedOrder?.delivery_address?.city || 'N/A'}</div>
                                <div><span className="font-medium">State:</span> {selectedOrder?.delivery_address?.state || 'N/A'}</div>
                                <div><span className="font-medium">Country:</span> {selectedOrder?.delivery_address?.country || 'N/A'}</div>
                            </div>
                        </div>

                        {/* Product List */}
                        <div className="w-full p-3 border rounded-sm bg-white mb-4 flex flex-col gap-2">
                            {Array.isArray(selectedOrder?.products) && selectedOrder.products.length > 0 ? (
                                selectedOrder.products.map((prd, index) => (
                                    <div
                                        key={index}
                                        className="w-full border border-gray-300 h-fit text-black p-4 rounded flex justify-between items-center"
                                    >
                                        <div
                                            className="flex gap-4 items-center cursor-pointer w-[60%]"
                                            onClick={() => router.push(`/product/${prd?.productId}`)}
                                        >
                                            <img
                                                src={prd?.image || prd?.images?.[0] || "/images/placeholder.png"}
                                                alt={prd?.productTitle}
                                                className="w-24 h-24 object-contain rounded shadow"
                                            />
                                            <div>
                                                <p className="text-sm text-gray-500">{prd?.productId}</p>
                                                <h3 className="text-lg font-semibold">{prd?.productTitle}</h3>
                                                <p className="text-sm text-gray-500">{prd?.productBrand}</p>
                                                <p className="text-sm text-gray-600">Qty: {prd?.quantity}</p>
                                            </div>
                                        </div>

                                        <div className="text-right w-[20%]">
                                            <p className="text-gray-500 text-sm">Price</p>
                                            <p className="text-xl font-bold text-[#131e30]">
                                                ₹{(prd?.price || 0) * (prd?.quantity || 1)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-500 mt-8 text-lg">No products found in this order.</div>
                            )}
                        </div>

                        <div className="w-full p-3 border rounded-sm bg-white mb-4 flex flex-col gap-2">
                            <h1 className="text-black text-lg">User Details</h1>
                            {selectedOrder?.userId ? (
                                <div className="flex">
                                    <div className="w-[100px] h-[100px]">
                                        <img
                                            src={selectedOrder?.userId.avatar}
                                            alt="User Avatar"
                                            className="w-full h-full object-cover rounded"
                                        />
                                    </div>
                                    <div className="ml-4 text-black">
                                        <h1>{selectedOrder?.userId?.name}</h1>
                                        <h1>{selectedOrder?.userId?.phone || 'N/A'}</h1>
                                        <h1>{selectedOrder?.userId?.email}</h1>
                                        <h1>Total Orders: {selectedOrder?.userId?.orders?.length || 0}</h1>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 mt-8 text-lg">
                                    No user found for this order.
                                </div>
                            )}


                        </div>
                    </div>
                </div>

            )}
        </div>
    );
}
export default Orders