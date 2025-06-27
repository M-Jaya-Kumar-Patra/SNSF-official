"use client"
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { useOrders } from '@/app/context/OrdersContext'
import { useRouter, useParams } from 'next/navigation'
import { fetchDataFromApi, postData } from '@/utils/api'
import { Button, Rating } from '@mui/material'
import { useAlert } from '@/app/context/AlertContext'
import Image from 'next/image'

const OrdersPage = () => {
  const router = useRouter()
  const { userData, isLogin } = useAuth()
  const { getOrdersItems, OrdersData } = useOrders()

  const [openedOrder, setOpenedOrder] = useState(null)
  const [showRateReview, setShowRateReview] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")
  const alert = useAlert()

  const params = useParams()
  const orderId = params.order
  

    // New state for call confirmation modal
  const [showCallConfirm, setShowCallConfirm] = useState(false)
  const [callPurpose, setCallPurpose] = useState("") // "exchange" or "cancel"


  
  
  useEffect(() => {
    if (!isLogin) return;
    getOrdersItems();
  }, []);
  


  
  useEffect(() => {
    if (!orderId) return
    
    fetchDataFromApi(`/api/order/${orderId}`)
    .then((res) => {
      if (res.success) {
        setOpenedOrder(res.data)
        console.log("openedOrder",res.data)
      } else {
        console.warn("Order fetch failed:", res.message)
      }
    })
    .catch((err) => {
      console.error("Fetch error:", err)
    })
  }, [orderId])

  const handleRateReviewModal = (product) => {
    setSelectedProduct(product)
    setShowRateReview(true)
  }
  
  const handleSubmitReview = (productId) => {
    if (!rating || review.length < 5) {
      alert("Please provide a valid rating and review.")
      return
    }
    
    console.log("ProooooooooooooooooooooooooooooooooductId", productId)
    
    console.log("Submitting review for product:", selectedProduct)
    console.log({ rating, review })
    
    // TODO: Send POST request to /api/review or similar endpoint
    const formData = {
      userName: userData?.name,
      review: review,
      rating: rating,
      productId: productId
    }
    
    postData(`/api/user/addReview`, formData).then((res) => {
      if (!res.error) {
        alert.alertBox({ type: "success", msg: "Review submitted successfully!" })
      } else {
        alert.alertBox({ type: "error", msg: "Please provide a rating and review." })
      }
    })

    // Reset modal
    setShowRateReview(false)
    setRating(0)
    setReview("")
    setSelectedProduct(null)
  }
  


   // Show call confirmation modal with purpose
  const handleExchange = () => {
    setCallPurpose("exchange")
    setShowCallConfirm(true)
  }

  const handleCancel = () => {
    setCallPurpose("cancel")
    setShowCallConfirm(true)
  }

  // Confirm and redirect to call
  const confirmCall = () => {
    const phoneNumber = "+919776501230"
    window.location.href = `tel:${phoneNumber}`
    setShowCallConfirm(false)
    setCallPurpose("")
  }

  // Cancel call modal
  const cancelCall = () => {
    setShowCallConfirm(false)
    setCallPurpose("")
  }



const handleDownload = async (e, orderId) => {
  e.preventDefault();

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/order/${orderId}/invoice`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to download invoice");
    }

    const blob = await response.blob();
    const contentType = response.headers.get("Content-Type");
    
    // Detect extension from content-type
    let extension = "jpg";
    if (contentType === "image/png") extension = "png";
    else if (contentType === "image/jpeg") extension = "jpg";

    const url = window.URL.createObjectURL(new Blob([blob]));

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `invoice-${orderId}.${extension}`);
    document.body.appendChild(link);
    link.click();

    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading invoice:", error);
    alert("Something went wrong while downloading the invoice.");
  }
};


  
  return (
    <div className='w-full bg-slate-100 flex justify-center items-center'>
      <div className='w-[1020px] bg-white min-h-screen my-3 p-4'>

        <div className='flex justify-between items-center'>
          <h1 className='text-2xl font-bold text-gray-700 mb-4'>Order Details</h1>
          <div >
           {openedOrder?.order_Status === "Delivered" &&
            <Button variant='contained' className='bg-primary-gradient' onClick={(e)=>handleDownload(e,openedOrder?._id)}>Download Invoice</Button>}

          </div>
        </div>

        <div className="w-full p-4 border rounded-md bg-white mb-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

  {/* Order ID */}
  <div className="flex flex-col items-center justify-center text-center">
    <span className="text-sm text-gray-500 font-semibold">Order ID</span>
    <span className="text-black text-base font-bold">{openedOrder?.orderId}</span>
  </div>

  {/* Order Status */}
  <div className="flex flex-col items-center justify-center text-center">
    <span className="text-sm text-gray-500 font-semibold">Order Status</span>
    <span className={`text-sm px-2 py-1 rounded-full font-bold 
      ${openedOrder?.order_Status === "Pending" && "bg-amber-100 text-amber-800"}
      ${openedOrder?.order_Status === "Confirmed" && "bg-blue-100 text-blue-800"}
      ${openedOrder?.order_Status === "Processing" && "bg-cyan-100 text-cyan-800"}
      ${openedOrder?.order_Status === "Delivered" && "bg-green-100 text-green-800"}
      ${openedOrder?.order_Status === "Canceled" && "bg-red-100 text-red-600"}
      ${openedOrder?.order_Status === "Returned" && "bg-orange-100 text-orange-800"}
      ${openedOrder?.order_Status === "Refunded" && "bg-lime-100 text-lime-800"}
    `}>
      {openedOrder?.order_Status}
    </span>
  </div>

  {/* Payment Status */}
  <div className="flex flex-col items-center justify-center text-center">
    <span className="text-sm text-gray-500 font-semibold">Payment Status</span>
    <span className={`text-sm px-2 py-1 rounded-full font-bold
      ${openedOrder?.payment_status === "Completed" && "bg-green-100 text-green-800"}
      ${openedOrder?.payment_status === "Canceled" && "bg-red-100 text-red-600"}
      ${openedOrder?.payment_status === "Refunded" && "bg-lime-100 text-lime-800"}
      ${openedOrder?.payment_status === "Pending" && "bg-amber-100 text-amber-800"}
    `}>
      {openedOrder?.payment_status}
    </span>
  </div>

  {/* Total Amount */}
  <div className="flex flex-col items-center justify-center text-center">
    <span className="text-sm text-gray-500 font-semibold">Total Amount</span>
    <span className="text-black text-lg font-bold">₹{openedOrder?.totalAmt}</span>
  </div>

  {/* Order Date */}
  <div className="flex flex-col items-center justify-center text-center col-span-1 md:col-span-1">
    <span className="text-sm text-gray-500 font-semibold">Order Date</span>
    <span className="text-black text-sm font-semibold">
  {openedOrder?.createdAt && (
    <>
      {new Date(openedOrder.createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}{" "}
      {new Date(openedOrder.createdAt).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })}
    </>
  )}
</span>

  </div>

 {openedOrder?.order_Status === "Delivered" ? (
  <div className="flex flex-col items-center justify-center text-center col-span-1 md:col-span-1">
  <span className="text-sm text-gray-500 font-semibold">Order Delivered On</span>
  <span className="text-black text-sm font-semibold">
    {openedOrder?.delivery_date
      ? new Date(openedOrder.delivery_date).toLocaleString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: false,
        })
      : "N/A"}
  </span>
</div>

) : (
  <div className="flex flex-col items-center justify-center text-center col-span-1 md:col-span-1">
  <span className="text-sm text-gray-500 font-semibold">Estimated Delivery Date</span>
  <span className="text-black text-sm font-semibold">
    {(() => {
      if (openedOrder?.estimated_delivery_date) {
        const date = new Date(openedOrder.estimated_delivery_date);
        return `${date.toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`;
      } else if (openedOrder?.createdAt) {
        const deliveryDays = Math.floor(Math.random() * 3) + 5; // 5 to 7 days
        const estimate = new Date(openedOrder.createdAt);
        estimate.setDate(estimate.getDate() + deliveryDays);
        return `${estimate.toLocaleDateString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`;
      } else {
        return "N/A";
      }
    })()}
  </span>
</div>

)}


  {/* Delivery Date */}
  
</div>


        {/* Shipping / Delivery Address */}
        {/* Improved Delivery Address UI */}
        <div className="w-full p-3 border rounded-sm bg-white text-sm mb-4 text-gray-800">
          <h2 className="text-lg font-semibold border-b pb-2 mb-3 text-gray-700">Delivery Address</h2>

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-x-6 gap-y-2">
            <div><span className="font-medium">Name:</span> {openedOrder?.delivery_address?.name || userData?.name}</div>
            <div><span className="font-medium">Phone:</span> {openedOrder?.delivery_address?.phone || 'N/A'}</div>
            <div><span className="font-medium">Email:</span> {openedOrder?.delivery_address?.email || userData?.email}</div>
            <div><span className="font-medium">Pin Code:</span> {openedOrder?.delivery_address?.pin || 'N/A'}</div>
            <div className="col-span-2"><span className="font-medium">Address:</span> {openedOrder?.delivery_address?.address || 'N/A'}</div>
            <div><span className="font-medium">City:</span> {openedOrder?.delivery_address?.city || 'N/A'}</div>
            <div><span className="font-medium">State:</span> {openedOrder?.delivery_address?.state || 'N/A'}</div>
            <div><span className="font-medium">Country:</span> {openedOrder?.delivery_address?.country || 'N/A'}</div>
          </div>
        </div>



        {/* Products List */}
        <div className='w-full p-1 sm:p-3 border rounded-sm bg-white mb-4 flex flex-col justify-between'>
          {Array.isArray(openedOrder?.products) && openedOrder.products.length > 0 ? (
            openedOrder.products.map((prd, index) => (
              <div
                key={index}
                className='w-full border border-gray-300 h-fit text-black p-2 sm:p-4 rounded mb-2 flex justify-between items-center'
              >
                <div className="flex gap-4 items-center cursor-pointer w-[60%]"
                  onClick={() => router.push(`/product/${prd?.productId}`)}>

                  <Image
                    src={prd?.image || prd?.images?.[0] || '/images/placeholder.png'}
                    alt={prd?.productTitle}
                    className="w-24 h-24 object-contain rounded shadow"
                                width={100} height={100}

                  />
                  <div className='w-full'
                    onClick={() => router.push(`/product/${prd?.productId}`)}>
                    <h3 className="text-lg font-semibold">{prd?.productTitle}</h3>
                    <p className="text-sm text-gray-500">{prd?.productBrand || "Brand Info"}</p>
                    <p className="text-sm text-gray-600">Qty: {prd?.quantity}</p>
                  </div>
                </div>

                {/* Rate & Review */}
                {openedOrder?.order_Status === "Delivered" ? (
                  <div className='flex flex-col w-[20%]  gap-3'>
                    <Button
                      variant='contained'
                      className='!bg-green-700'
                      onClick={() => handleRateReviewModal(prd)}
                    >
                      Rate & Review
                    </Button>

                    <Button
                      variant='outlined'
                      color='inherit'
                      onClick={()=>handleExchange()}
                    >
                      Exchange
                    </Button>

                  </div>
                ) : (
                  <div className='text-center w-[20%]'>
                    <Button
                      variant='outlined'
                      color='inherit'
                      onClick={()=>handleCancel()}
                      className='!bg-white !border !border-red-500 !text-red-500 hover:!bg-red-100 !rounded !px-3 !py-1'
                    >
                      Cancel
                    </Button>
                  </div>

                )}

                {/* Price */}
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

        {/* Rate & Review Modal */}
        {showRateReview && (
          <div className='fixed inset-0 z-[999] bg-black bg-opacity-40 flex justify-center items-center'>
            <div className='bg-white w-[500px] rounded-lg p-6 text-black shadow-lg'>
              <h2 className='text-xl font-bold mb-2'>Rate & Review</h2>
              <p className='text-gray-600 mb-4'>Product: <strong>{selectedProduct?.productTitle}</strong></p>

              {console.log("selected Product::::::::::::::::::", selectedProduct)}

              <div className='mb-4'>
                <label className='block font-medium mb-1'>Rating</label>
                <Rating
                  value={rating}
                  onChange={(e, value) => setRating(value)}
                  size="large"
                />
              </div>

              <div className='mb-4'>
                <label className='block font-medium mb-1'>Review</label>
                <textarea
                  className='w-full border rounded p-2 text-sm'
                  rows="4"
                  placeholder='Share your experience...'
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />
              </div>

              <div className='flex justify-end gap-4'>
                <Button
                  variant='outlined'
                  onClick={() => {
                    setShowRateReview(false)
                    setRating(0)
                    setReview("")
                    setSelectedProduct(null)
                  }}
                >
                  Cancel
                </Button>
                <Button variant='contained' onClick={() => handleSubmitReview(selectedProduct?.productId)}>
                  Submit
                </Button>
              </div>
            </div>
          </div>
        )}

         {/* Call Confirmation Modal */}
{showCallConfirm && (
  <div className='fixed inset-0 z-[1000] bg-black bg-opacity-50 flex justify-center items-center'>
    <div className='bg-white rounded-lg p-6 max-w-sm w-full shadow-lg text-center'>
      <h3 className='text-lg font-semibold mb-4'>
        {callPurpose === "exchange" && "Confirm Exchange Call"}
        {callPurpose === "cancel" && "Confirm Cancellation Call"}
      </h3>
      <p className='mb-6 text-gray-700'>
        Are you sure you want to call <strong>S N Steel Fabrication</strong> for {callPurpose}?
      </p>
      <div className='flex justify-center gap-6'>
        <Button variant='outlined' onClick={cancelCall}>
          No
        </Button>
        <Button variant='contained' onClick={confirmCall} className="!bg-primary-gradient">
          Yes, Call
        </Button>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  )
}

export default OrdersPage
