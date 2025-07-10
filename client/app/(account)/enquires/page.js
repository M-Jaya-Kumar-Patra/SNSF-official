"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LogoutBTN from "@/components/LogoutBTN";
import { useAuth } from "@/app/context/AuthContext";
import { getUserEnquiries } from "@/utils/api"; // ✅ import the API function
import { MdOutlineMessage } from "react-icons/md";

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

const Account = () => {
    const router = useRouter();
    const { userData, isLogin, isCheckingToken } = useAuth();

    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userData?._id) return;
        setLoading(true);
        getUserEnquiries(userData._id)
            .then((res) => {
                if (res.success) {
                    setEnquiries(res.data);
                }
            })
            .finally(() => setLoading(false));
    }, [userData?._id]);

    const getOptimizedCloudinaryUrl = (url) => {
  if (!url?.includes("res.cloudinary.com")) return url; // Don't touch local images
  return url.replace("/upload/", "/upload/w_800,h_800,c_fill,f_auto,q_90/");
};


    if (isCheckingToken) return <div className="text-center mt-10">Checking session...</div>;

    return (
        <>
            <div className="flex w-full min-h-screen justify-center bg-slate-100">
                <div className="w-full sm:w-[1020px] sm:my-3 mx-auto flex justify-between">
                    {/* Left Sidebar */}
                    <div className="hidden sm:block left h-fit sticky top-8">
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
                                        <div className="h-[40px] flex items-center pl-[12.5px] font-semibold border border-l-8 border-y-0 border-r-0 border-indigo-950 cursor-pointer text-indigo-950 bg-slate-100 active:bg-slate-100 gap-[9px]">
                                            <MdOutlineMessage size={18} /> My Enquiries
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
                                    <Link href="/notifications">
                                        <div className="h-[50px] flex items-center pl-5 font-semibold cursor-pointer gap-2 active:bg-slate-100">
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

                {/* Right Section */}
<div className="right h-full w-full sm:w-[750px] bg-slate-100 sm:bg-white shadow-xl sm:p-6">
  <div className="mb-2 sm:border-b border-gray-200 py-2 pl-3 sm:py-0 sm:pl-0 sm:pb-4 bg-white">
    <h2 className="text-[22px] sm:text-3xl font-extrabold text-black">
      My Enquiries
    </h2>
  </div>

  <div className="w-full px-2 py-2">
    {loading ? (
      <p className="text-center text-gray-600">Loading enquiries...</p>
    ) : enquiries.length === 0 ? (
      <>
  <div className="flex flex-col items-center justify-center mt-16 sm:mt-20 text-center px-4">
    
    <h2 className="text-lg sm:text-2xl font-semibold text-gray-700">
      No Enquiries Yet
    </h2>

    <p className="text-gray-500 mt-2 text-sm sm:text-base max-w-sm">
      You haven't received any customer enquiries yet. Once someone contacts you, you'll see it here.
    </p>

    <Link
      href="/"
      className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-6 py-2 rounded-full text-sm sm:text-base transition shadow-md"
    >
      Back to Home
    </Link>

  </div>

      
      </>
    ) : (
      <div className="flex flex-col gap-2  sm:gap-3">
        {enquiries
          .slice()
          .reverse()
          .map((enq) => (
            <div
              key={enq._id}
              onClick={() => router.push(`/product/${enq.prdId}`)}
              className="bg-white border border-gray-200 rounded-md p-4 shadow-sm hover:shadow-md hover:border-indigo-200 cursor-pointer transition-all"
            >
              

              {/* User message */}
              <p className="text-gray-800 text-md font-medium">
                {enq?.userMsg?.includes("WhatsApp") && "📱"}{" "}
                {enq?.userMsg?.includes("Call") && "📞"} {enq.userMsg}
              </p>

              {/* Date */}
              <p className="text-gray-400 text-xs mt-1">
                {new Date(enq.createdAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
          ))}
      </div>
    )}
  </div>
</div>

                </div>
            </div>
        </>
    );
};

export default Account;
