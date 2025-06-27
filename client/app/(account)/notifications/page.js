"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import LogoutBTN from "@/components/LogoutBTN";
import { useAuth } from "@/app/context/AuthContext";
import { useNotice } from "@/app/context/NotificationContext";
import {
  User,
  Package,
  CreditCard,
  Heart,
  Bell,
} from "lucide-react";
import Empty from "@/app/(ack)/Empty";

const Account = () => {
  const router = useRouter();
  const { userData } = useAuth();
  const { notices, getNotifications, markAllUnreadAsRead } = useNotice();

  useEffect(() => {
  getNotifications();
}, []);

useEffect(() => {
  const handleReadOnLoad = async () => {
    await getNotifications();
    const hasUnread = notices.some((n) => !n.read);
    if (hasUnread) {
      await markAllUnreadAsRead();
    }
  };

  handleReadOnLoad();
}, []);

     const getStatusIcon = (message = "") => {
  if (message.includes("confirmed")) return "✅";
  if (message.includes("processing")) return "🔄";
  if (message.includes("delivered")) return "📦";
  if (message.includes("canceled")) return "❌";
  if (message.includes("returned")) return "↩️";
  if (message.includes("refunded")) return "💸";
  return "📬";
};



  return (
    <div className="flex w-full min-h-screen justify-center bg-slate-100">
      <div className="w-full sm:w-[1020px] my-3 mx-auto flex justify-between">
        {/* Left Sidebar */}
        <div className="hidden sm:block left h-fit sticky top-8">
          <div className="w-[256px] bg-white shadow-lg pb-5 pt-6 px-5 gap-3 flex flex-col justify-center items-center">
            <Image
              className="h-[140px] w-full sm:w-[140px] rounded-full object-cover"
              src={userData?.avatar || "/images/account.png"}
              alt="User Profile"
              width={140}
              height={140}
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
                  <div className="h-[40px] flex items-center pl-[12.5px] font-semibold border border-l-8 border-y-0 border-r-0 border-indigo-950 cursor-pointer text-indigo-950 bg-slate-100 active:bg-slate-100 gap-[9px]">
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
                <LogoutBTN />
              </li>
            </ul>
          </div>
        </div>

{/* Right Notification Section */}
<div className="right h-full w-full sm:w-[750px] bg-white shadow-xl p-3 sm:p-6">
  <div className="mb-2 sm:mb-4 border-b border-gray-200 pb-2 sm:pb-4">
    <h2 className="text-[22px] sm:text-3xl font-extrabold text-gradient text-black">
      🔔 Notifications
    </h2>
  </div>

  {notices?.length > 0 ? (
  <div className="space-y-2 sm:space-y-3 px-0 sm:px-0">
    {notices.map((notice, index) => (
      <div
        key={index}
        className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-3 sm:p-5 shadow-sm hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02] duration-200"
        onClick={() => {
          if (notice?.link) router.push(notice.link);
        }}
      >
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="text-xl sm:text-2xl">
            {getStatusIcon(notice.message)}
          </div>
          <div className="flex-1">
            <div className="text-[14px] sm:text-[15px] text-gray-800 font-medium leading-relaxed">
              <span
                dangerouslySetInnerHTML={{ __html: notice.message }}
              />
              {!notice.read && (
                <span className="ml-2 w-2 h-2 rounded-full bg-blue-600 inline-block animate-ping"></span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {new Date(notice.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
) : (
  <div className="flex flex-col items-center justify-center mt-16 sm:mt-20 text-center px-4">
    <div className="w-[180px] sm:w-[260px] mb-4">
      <Empty />
    </div>
    <h2 className="text-lg sm:text-2xl font-semibold text-gray-700">
      No Notifications Yet
    </h2>
    <p className="text-gray-500 mt-2 text-sm sm:text-base max-w-sm">
      You currently don’t have any notifications. We’ll keep you posted!
    </p>
    <Link
      href="/"
      className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-6 py-2 rounded-full text-sm sm:text-base transition shadow-md"
    >
      Start Shopping
    </Link>
  </div>
)}

</div>

      </div>
    </div>
  );
};

export default Account;
