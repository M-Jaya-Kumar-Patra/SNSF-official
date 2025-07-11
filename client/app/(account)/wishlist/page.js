"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MdOutlineMessage } from "react-icons/md";
import {
  User,
  Package,
  CreditCard,
  Bell,
  Heart,
} from "lucide-react";

import LogoutBTN from "@/components/LogoutBTN";
import { useAuth } from "@/app/context/AuthContext";
import { useWishlist } from "@/app/context/WishlistContext";
import { MdDelete } from "react-icons/md";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';



const Account = () => {
  const router = useRouter();
  const { userData, isLogin ,isCheckingToken, setIsCheckingToken } = useAuth();
  const {
    wishlistData,
    removeFromWishlist,
  } = useWishlist();
      if (isCheckingToken) return <div className="text-center mt-10">Checking session...</div>;

  useEffect(() => {
    if (!isLogin) {
      setIsCheckingToken(false)
      router.push("/login");
    }
  }, [isLogin, router]);


  const getOptimizedCloudinaryUrl = (url) => {
  if (!url?.includes("res.cloudinary.com")) return url; // Don't touch local images
  return url.replace("/upload/", "/upload/w_800,h_800,c_fill,f_auto,q_90/");
};


  return (
    <div className="flex w-full min-h-screen justify-center bg-slate-100">
      <div className="w-full sm:w-[1020px] sm:my-3 mx-auto flex justify-between">
        {/* Sidebar */}
        <div className="hidden sm:block left h-full">
          <div className="w-[256px] bg-white shadow-lg pb-5 pt-6 px-5 gap-3 flex flex-col justify-center items-center">
           <Image
  className="h-[140px] w-[140px] rounded-full object-cover"
  src={getOptimizedCloudinaryUrl(userData?.avatar) || "/images/account.png"}
  alt="User Profile"
  width={140}
  height={140}
  loading="lazy"
/>

            <h1 className="text-black font-sans font-semibold overflow-x-auto scrollbar-hide">
              {userData?.name}
            </h1>
          </div>

          <div className="leftlower mt-3 w-[256px] bg-white shadow-lg">
            <ul className="text-gray-600 font-sans">
              <li>
                <Link href="/enquires">
                  <div className="h-[50px] flex items-center pl-5 font-semibold cursor-pointer gap-2 active:bg-slate-100">
                    <MdOutlineMessage size={18} /> My Enquries
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
                  <div className="h-[50px] flex items-center pl-5 font-semibold cursor-pointer gap-2 active:bg-slate-100">
                    <Bell size={18} /> Notifications
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/wishlist">
                  <div className="h-[40px] flex items-center pl-[12.5px] font-semibold border border-l-8 border-y-0 border-r-0 border-indigo-950 cursor-pointer text-indigo-950 bg-slate-100 active:bg-slate-100 gap-[9px]">
                    <Heart size={18} /> Wishlist
                  </div>
                </Link>
              </li>
              <li>
                <LogoutBTN />
              </li>
            </ul>
          </div>
        </div>

        {/* Wishlist Section */}
<div className="right h-full w-full sm:w-[750px] bg-slate-100 sm:bg-white shadow-xl sm:p-6">
  <div className="mb-2 sm:border-b border-gray-200 py-2 pl-3 sm:py-0 sm:pl-0 sm:pb-4 bg-white">
    <h2 className="text-[22px] sm:text-3xl font-extrabold text-gradient text-black ">
      My Wishlist 
    </h2>
  </div>

  <div className="list-section min-h-[90vh] space-y-2 sm:space-y-4 p-2 sm:px-0 bg-white">
    {wishlistData?.length > 0 ? (
      wishlistData.map((item, index) => (
        <div
          key={index}
          className="flex gap-4 p-2 sm:p-4 border rounded-lg shadow-sm hover:shadow-md transition"
        >
          {/* Product Image */}
          <div
            className="w-[130px] h-[110px] flex items-center justify-center bg-gray-100 rounded cursor-pointer"
            onClick={() => router.push(`/product/${item?.productId}`)}
          >
            <Image
  src={getOptimizedCloudinaryUrl(item.image)}
  alt={item.title || "Product"}
  width={100}
  height={100}
  className="object-contain max-h-full max-w-full"
  loading="lazy"
/>

          </div>

          {/* Product Info */}
          <div className="flex-1 flex flex-col justify-between">
            <div
              className="cursor-pointer"
              onClick={() => router.push(`/product/${item?.productId}`)}
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {item?.productTitle}
              </h3>
              <p className="text-gray-500 text-sm">{item?.brand}</p>
              
            </div>
          </div>

          {/* Delete Button */}
          <div className="flex items-start">
            <MdDelete
              className="text-gray-400 hover:text-red-500 text-2xl cursor-pointer transition"
              onClick={(e) =>
                removeFromWishlist(e, item?._id, item?.productId)
              }
            />
          </div>
        </div>
      ))
    ) : (
      <div className="flex flex-col items-center justify-center mt-20 text-center">
        <div className="w-[200px] sm:w-[260px] mb-4">
          <DotLottieReact
      src="https://lottie.host/3083b307-7cfd-4fcd-9d3d-76299b402a46/P13OnArBCk.lottie"
      loop
      autoplay
    />
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
          Your Wishlist is Empty
        </h2>
        <p className="text-gray-500 mt-2 text-sm sm:text-base max-w-sm">
          Looks like you haven’t added anything to your wishlist yet. Start
          exploring and add your favorite items!
        </p>
        <Link
          href="/"
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm sm:text-base transition"
        >
          Back to Home
        </Link>
      </div>
    )}
  </div>
</div>

      </div>
    </div>
  );
};

export default Account;
