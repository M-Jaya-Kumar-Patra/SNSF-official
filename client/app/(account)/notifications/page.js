

"use client";

import { useSession, signOut } from "next-auth/react";
import Navbar from "@/components/Navbar";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link"; import { User, Package, CreditCard, MapPin, Heart, RefreshCcw, Bell, LifeBuoy, LogOut } from "lucide-react";
import LogoutBTN from "@/components/LogoutBTN";
import { useAuth } from "@/app/context/AuthContext";



const Account = () => {
    const { data: session } = useSession();
    const router = useRouter();
    return (
        <>
            <div className="flex w-full min-h-screen justify-center bg-slate-100">
                <div className="w-[1020px] my-3 mx-auto flex justify-between">
                    <div className="left h-full">
                        <div className="leftupper h-16 bg-white shadow-lg p-2 flex gap-3 items-center">
                            <img
                                className="h-full rounded-full"
                                              src={avatar}

                                alt="User Profile"
                            />
                            <h1 className="text-black font-sans font-semibold">{fullName}</h1>
                        </div>

                        <div className="leftlower mt-3 w-[256px] bg-white shadow-lg">
                            <ul className="text-gray-600 font-sans">
                                <li>
                                    <Link href="/orders">
                                        <div className="h-[50px] flex items-center pl-5 font-semibold cursor-pointer gap-2  active:bg-slate-100">
                                            <Package size={18} />My Orders
                                        </div>
                                    </Link>
                                </li>
                                <li>
                                    <div className="h-[50px] flex items-center pl-5 font-semibold cursor-pointer gap-2">
                                        <User size={18} />Account Settings
                                    </div>
                                </li>
                                <li>
                                    <Link href="/profile">
                                        <div className="h-[40px] flex items-center pl-12 font-semibold cursor-pointer active:bg-slate-100 ">
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
                                            <CreditCard size={18} />Payments
                                        </div>
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/notifications">
                                        <div className="h-[50px] flex items-center pl-5 font-semibold cursor-pointer gap-2 text-[#131e30] bg-slate-100 active:bg-slate-100">
                                            <Bell size={18} />Notifications
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
                    <div className="right h-full w-[750px] bg-white shadow-lg"></div>
                </div>
            </div>
        </>
    );
};

export default Account;
