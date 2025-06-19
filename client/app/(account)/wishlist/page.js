

"use client";

import { useSession, signOut } from "next-auth/react";
import Navbar from "@/components/Navbar";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link"; import { User, Package, CreditCard, MapPin, Heart, RefreshCcw, Bell, LifeBuoy, LogOut, Club } from "lucide-react";
import LogoutBTN from "@/components/LogoutBTN";
import { useAuth } from "@/app/context/AuthContext";
import { useEffect } from "react";
import { useWishlist } from "@/app/context/WishlistContext";
import { MdDelete } from "react-icons/md";




const Account = () => {
    const router = useRouter();
    const { userData, isLogin } = useAuth()
    const { wishlistData, setWishlistData, addToWishlist, getWishlistItems, removeFromWishlist } = useWishlist()

    useEffect(() => {
        if (!isLogin) {
            router.push("/login");
        }

    }, [isLogin]);


    return (
        <>
            <div className="flex w-full min-h-screen justify-center bg-slate-100">
                <div className="w-[1020px] my-3 mx-auto flex justify-between">
                    {/* Left Sidebar */}
                    <div className="left h-full">
                        <div className="w-[256px] bg-white shadow-lg pb-5 pt-6 px-5   gap-3 flex flex-col justify-center items-center ">
                            <img
                                className="h-[140px] w-[140px] rounded-full object-cover"
                                src={userData?.avatar || "/images/account.png"}
                                alt="User Profile"
                            />
                            <h1 className="text-black font-sans font-semibold overflow-x-auto scrollbar-hide">
                                {userData?.name}
                            </h1>
                        </div>

                        <div className="leftlower mt-3 w-[256px] bg-white shadow-lg">
                            <ul className="text-gray-600 font-sans">
                                <li>
                                    <Link href="/orders">
                                        <div className="h-[50px] flex items-center pl-5 font-semibold cursor-pointer gap-2 active:bg-slate-100">
                                            <Package size={18} /> My Orders
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
                                <li>
                                    <Link href="/payments">
                                        <div className="h-[50px] flex items-center pl-5 font-semibold cursor-pointer gap-2 active:bg-slate-100">
                                            <CreditCard size={18} /> Payments
                                        </div>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/notifications">
                                        <div className="h-[50px] flex items-center pl-5 font-semibold cursor-pointer gap-2  active:bg-slate-100">
                                            <Bell size={18} /> Notifications
                                        </div>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/wishlist">
                                        <div className="h-[40px] flex items-center pl-[12.5px] font-semibold  border  border-l-8 border-y-0 border-r-0 border-slate-700  cursor-pointer  text-[#131e30] bg-slate-100 active:bg-slate-100 gap-[9px] ">

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
                    <div className="right h-full w-[750px] bg-white shadow-lg p-5">
                        <div className="mb-6">
                            <span className="text-black font-semibold font-sans text-[25px]">Wishlist</span>
                        </div>

                        <div className="list-section ">
                            <ul>
                                {!wishlistData?.length !== 0 && wishlistData?.map((item, index) => {
                                    return (
                                        <li
                                            key={index}
                                            className="w-full border border-slate-300 rounded p-3 h-auto 
                                            flex mb-3 hover:shadow-lg "
                                        >
                                            <div
                                                className="w-[150px] h-[120px] flex items-center justify-center cursor-pointer bg-gray-50 rounded"
                                                onClick={() => router.push(`/product/${item?.productId}`)}
                                            >
                                                <img
                                                    src={item.image}
                                                    alt={item.title || "Product"}
                                                    className="max-w-full max-h-full object-contain"
                                                />
                                            </div>


                                            <div className="w-full  "
                                            >
                                                <div className="flex ">
                                                    <div className=' w-full cursor-pointer px-3' onClick={() => router.push(`/product/${item?.productId}`)} >
                                                        <h1 className='text-black text-[20px] font-sans font-semibold'>{item?.productTitle}</h1>
                                                        <h3 className='text-gray-600 text-[18px] font-sans font-medium'>{item?.brand}</h3>
                                                        <h1 className='text-black mt-3 font-semibold text-[20px]'>₹{item?.price}</h1>
                                                    </div>
                                                    <div>
                                                        <div className='w-auto cursor-pointer p-1 '>
                                                            <MdDelete className='text-gray-500 text-[25px] hover:text-gray-700 cursor-pointer'
                                                                onClick={(e) => { removeFromWishlist(e, item?._id, item?.productId) }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>




                                        </li>)
                                })}
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default Account;
