"use client";

import { useSession, signOut } from "next-auth/react";
import Navbar from "@/components/Navbar";
import React from "react";
import Image from "next/image";
import { User, Package, MapPin, Heart, RefreshCcw, Bell, LifeBuoy, LogOut } from "lucide-react";
import Link from "next/link";

const Account = () => {
    const { data: session } = useSession(); // Get session data

    if (!session) {
        return <p className="text-center text-gray-500">Loading...</p>;
    }

    return (
        <>
            <Navbar />
            <div className="flex w-full min-h-screen">
                {/* Sidebar */}
                <div className="left w-[250px] min-h-screen border-r-[1px] shadow-xl border-gray-300">
                    <div className="p-3 pt-0 flex items-center gap-3 mt-4">
                        <Image
                            className="w-12 h-12 rounded-full"
                            src={session?.user?.image || "/images/logo.png"}
                            alt="SNSF Logo"
                            width={64}
                            height={64}
                        />
                        <div className="flex flex-col items-start font-sans text-sm break-words">
                            <h2 className="text-gray-700 text-base font-semibold">{session.user?.name}</h2>
                        </div>
                    </div>

                    {/* Sidebar Menu */}
                    <ul className="font-sans text-gray-600">
                        <li>
                            <Link href="/profile">
                                <div className="w-full h-10 p-2 pl-3 flex items-center gap-2 cursor-pointer hover:bg-gray-100 active:bg-gray-200">
                                    <User size={18} /> Profile Information
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/orders">
                                <div className="w-full h-10 p-2 pl-3 flex items-center gap-2 cursor-pointer hover:bg-gray-100 active:bg-gray-200">
                                    <Package size={18} /> My Orders
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/account/address">
                                <div className="w-full h-10 p-2 pl-3 flex items-center gap-2 cursor-pointer hover:bg-gray-100 active:bg-gray-200">
                                    <MapPin size={18} /> Manage Address
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/account/wishfav">
                                <div className="w-full h-10 p-2 pl-3 flex items-center gap-2 cursor-pointer hover:bg-gray-100 active:bg-gray-200">
                                    <Heart size={18} /> Wishlist & Favorites
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/account/retref">
                                <div className="w-full h-10 p-2 pl-3 flex items-center gap-2 cursor-pointer hover:bg-gray-100 active:bg-gray-200">
                                    <RefreshCcw size={18} /> Returns and Refunds
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/account/notifications">
                                <div className="w-full h-10 p-2 pl-3 flex items-center gap-2 cursor-pointer hover:bg-gray-100 active:bg-gray-200">
                                    <Bell size={18} /> Notifications
                                </div>
                            </Link>
                        </li>
                        <li>
                            <Link href="/account/support">
                                <div className="w-full h-10 p-2 pl-3 flex items-center gap-2 cursor-pointer hover:bg-gray-100 active:bg-gray-200">
                                    <LifeBuoy size={18} /> Support and Help
                                </div>
                            </Link>
                        </li>
                        <Link href="/">
                            <div onClick={() => signOut()}   className="w-full h-10 p-2 pl-3 flex items-center gap-2 text-red-600 cursor-pointer hover:bg-gray-100 active:bg-gray-200">
                                <LogOut size={18} /> Log out
                            </div>
                            </Link>
                    </ul>
                </div>

                {/* Content Area */}
                <div className="right w-full min-h-screen">
                    <div className="min-h-10 w-[100%] shadow-md text-black font-sans font-semibold flex items-center pl-4 text-lg">
                        Profile information
                    </div>
                </div>
            </div>
        </>
    );
};

export default Account;
