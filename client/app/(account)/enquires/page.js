

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import LogoutBTN from "@/components/LogoutBTN";

import { useAuth } from "@/app/context/AuthContext";
import { useOrders } from "@/app/context/OrdersContext";
import { useWishlist } from "@/app/context/WishlistContext";
import {
    User,
    Package,
    CreditCard,
    MapPin,
    Heart,
    RefreshCcw,
    Bell,
    LifeBuoy,
    LogOut,
} from "lucide-react";
import Empty from "@/app/(ack)/Empty";




const Account = () => {
    const router = useRouter();
    const { ordersItems, addToOrders, getOrdersItems, OrdersData } = useOrders()
    const { userData, isLogin, isCheckingToken } = useAuth()
    if (isCheckingToken) return <div className="text-center mt-10">Checking session...</div>;

    useEffect(() => {
        getOrdersItems()
    },[])


    return (
        <>
            <div className="flex w-full min-h-screen justify-center bg-slate-100">
                <div className="w-full sm:w-[1020px]  sm:my-3 mx-auto flex justify-between">
                    {/* Left Sidebar */}
                    <div className="hidden sm:block  left h-fit sticky top-8">
                        <div className="w-[256px] bg-white shadow-lg pb-5 pt-6 px-5   gap-3 flex flex-col justify-center items-center ">
                            <Image
                                className="h-[140px] w-[140px] rounded-full object-cover"
                                src={userData?.avatar || "/images/account.png"}
                                alt="User Profile"
                                width={100} height={100}
                            />
                            <h1 className="text-black font-sans font-semibold overflow-x-auto scrollbar-hide">
                                {userData?.name}
                            </h1>
                        </div>

                        <div className="leftlower mt-3 w-[256px] bg-white shadow-lg">
                            <ul className="text-gray-600 font-sans">
                                <li>
                                    <Link href="/enquires">
                                        <div className="h-[40px] flex items-center pl-[12.5px] font-semibold  border  border-l-8 border-y-0 border-r-0 border-indigo-950  cursor-pointer  text-indigo-950 bg-slate-100 active:bg-slate-100 gap-[9px] ">

                                            <Package size={18} /> My Enquries
                                        </div>
                                    </Link>
                                </li>
                                <li>
                                    <div className="h-[50px] flex items-center pl-5 font-semibold cursor-pointer gap-2">
                                        <User size={18} /> Account Settings
                                    </div>
                                </li>
                                <li>
                                    <Link href="/profile">
                                        <div className="h-[40px] flex items-center pl-12 font-semibold cursor-pointer active:bg-slate-100">
                                            Profile Information
                                        </div>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/address">
                                        <div className="h-[40px] flex items-center pl-12 font-semibold cursor-pointer active:bg-slate-100">
                                            Manage Address
                                        </div>
                                    </Link>
                                </li>
                                {/* <li>
                                    <Link href="/payments">
                                        <div className="h-[50px] flex items-center pl-5 font-semibold cursor-pointer gap-2 active:bg-slate-100">
                                            <CreditCard size={18} /> Payments
                                        </div>
                                    </Link>
                                </li> */}
                                <li>
                                    <Link href="/notifications">
                                        <div className="h-[50px] flex items-center pl-5 font-semibold cursor-pointer gap-2  active:bg-slate-100">
                                            <Bell size={18} /> Notifications
                                        </div>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/wishlist">
                                        <div className="h-[50px] flex items-center pl-5 font-semibold cursor-pointer gap-2 active:bg-slate-100">

                                            <Heart size={18} /> Wishlist
                                        </div>
                                    </Link>
                                </li>
                                <li>
                                    <div>
                                        <LogoutBTN />
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>



                    {/* Right Profile Section */}
                    <div className="right h-full w-full sm:w-[750px] bg-slate-100 sm:bg-white shadow-xl sm:p-6">
  <div className="mb-2 sm:border-b border-gray-200  py-2 pl-3 sm:py-0 sm:pl-0 sm:pb-4 bg-white">
    <h2 className="text-[22px]  sm:text-3xl font-extrabold text-gradient text-black ">
      My Enquries
    </h2>
  </div>
                        {OrdersData?.length > 0 ? (
                            <div className="space-y-3 sm:space-y-6 p-2 sm:px-0 bg-white">
                                {OrdersData.slice().reverse().map((order, index) => (
                                    <div
                                        key={index}
                                        className="bg-white border border-gray-200 rounded-md sm:rounded-2xl p-2 sm:p-6 shadow-md hover:shadow-lg transition-all"
                                        onClick={() => router.push(`/orderDetails/${order?._id}`)}
                                    >
                                        {/* Order Header */}
                                        <div className="flex justify-between items-start flex-wrap gap-4 mb-2 sm:mb-6 border-b pb-1 sm:pb-4 border-gray-100">
                                            <div>
                                                <h3 className="text-md sm:text-lg font-semibold text-gray-700">
                                                    Order ID: <span className="text-[#131e30]">{order?.orderId || order?._id}</span>
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    Placed on:{" "}
                                                    {order?.createdAt &&
                                                        `${new Date(order.createdAt).toLocaleDateString("en-IN", {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric",
                                                        })}, ${new Date(order.createdAt).toLocaleTimeString("en-IN", {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: false,
                                                        })}`}
                                                </p>

                                            </div>

                                            <div className="flex  gap-8 text-center mt-0">
                                                <div className="flex flex-col">
                                                    <span className="text-xs sm:text-sm text-gray-500 font-semibold">Order Status</span>
                                                    <span
                                                        className={ `text-xs sm:text-sm  px-2 py-1 rounded-full font-bold ${order?.order_Status === "Pending" ? "bg-amber-100 text-amber-800" :
                                                                order?.order_Status === "Confirmed" ? "bg-blue-100 text-blue-800" :
                                                                    order?.order_Status === "Processing" ? "bg-cyan-100 text-cyan-800" :
                                                                        order?.order_Status === "Delivered" ? "bg-green-100 text-green-800" :
                                                                            order?.order_Status === "Canceled" ? "bg-red-100 text-red-600" :
                                                                                order?.order_Status === "Returned" ? "bg-orange-100 text-orange-800" :
                                                                                    order?.order_Status === "Refunded" ? "bg-lime-100 text-lime-800" :
                                                                                        "bg-none"
                                                            }`}
                                                    >
                                                        {order?.order_Status}
                                                    </span>
                                                </div>



                                                <div className="hidden sm:flex flex-col justify-center items-center">

                                                    <span className="text-sm text-gray-500 font-semibold">Payment Status</span>
                                                    <span
                                                        className={`text-xs sm:text-sm px-2 py-1 rounded-full font-bold ${order?.payment_status === "Completed" ? "bg-green-100 text-green-800" :
                                                                order?.payment_status === "Canceled" ? "bg-red-100 text-red-600" :
                                                                    order?.payment_status === "Refunded" ? "bg-lime-100 text-lime-800" :
                                                                        order?.payment_status === "Pending" ? "bg-amber-100 text-amber-800" :
                                                                            "bg-none"
                                                            }`}
                                                    >
                                                        {order?.payment_status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Products */}
                                        <div className="space-y-2 sm:space-y-4">
                                            {order?.products?.map((product, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-5 border border-slate-200 rounded-md sm:rounded-lg p-2 sm:p-4 bg-slate-50"
                                                >
                                                    {/* Product Image */}
                                                    <div
                                                        className="w-[120px] h-[100px] flex items-center justify-center bg-white rounded-sm sm:rounded-xl shadow cursor-pointer object-cover"
                                                        onClick={() => router.push(`/product/${product?.productId}`)}
                                                    >
                                                        <Image
                                                            src={product?.image || product?.images?.[0]}
                                                            alt={product?.productTitle || "Product"}
                                                            className="max-w-full max-h-full object-cover"
                                width={200} height={200}

                                                        />
                                                    </div>

                                                    {/* Product Info */}
                                                    <div className="flex-1">
                                                        <h4
                                                            className="text-base font-semibold text-gray-800 cursor-pointer hover:text-[#131e30]"
                                                            onClick={() => router.push(`/product/${product?.productId}`)}
                                                        >
                                                            {product?.productTitle}
                                                        </h4>
                                                        <p className="text-sm text-gray-500">{product?.productBrand || "Brand Info"}</p>
                                                        <div className="flex justify-between items-center mt-2">
                                                            <span className="text-sm text-gray-700">Qty: {product?.quantity || 1}</span>
                                                            <span className="text-base font-bold text-[#131e30]">
                                                                ₹{(product?.price || 0) * (product?.quantity || 1)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Total Amount */}
                                        <div className="flex justify-end mt-2 sm:mt-6">
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500">Total Amount</p>
                                                <h3 className="text-[22px] sm:text-2xl font-bold text-[#131e30]">₹{order?.totalAmt}</h3>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center mt-20 text-center">
  {/* Icon or Animation */}
  <div className="w-[200px] sm:w-[260px] mb-4">
    <Empty />
    {/* Or replace with Lottie animation if desired */}
  </div>

  {/* Message */}
  <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
    No Orders Yet
  </h2>
  <p className="text-gray-500 mt-2 text-sm sm:text-base max-w-sm">
    You haven’t placed any orders yet. Start shopping now to fill this space with your amazing purchases!
  </p>

  {/* Button */}
  <Link
    href="/"
    className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm sm:text-base transition"
  >
    Start Shopping
  </Link>
</div>

                        )}
                    </div>


                </div>
            </div>
        </>
    );
};

export default Account;
