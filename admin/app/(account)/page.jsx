"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Admin, Package, MapPin, Heart, RefreshCcw, Bell, LifeBuoy } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import LogoutBTN from "@/components/LogoutBTN";

const Account = () => {
  const { logout, isLogin, adminData } = useAuth();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!isLogin) {
        router.push("/login");
      } else {
        setCheckingAuth(false);
      }
    }
  }, [isLogin, router]);

  if (checkingAuth) {
    return (
      <div className="w-full h-screen flex justify-center items-center text-gray-500 text-lg">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex w-full min-h-screen">
        {/* Sidebar */}
        <aside className="w-[250px] min-h-screen border-r shadow-md bg-white">
          <div className="p-4 flex flex-col items-center mt-4">
            <img
              className="h-[120px] w-[120px] rounded-full object-cover border shadow"
              src={adminData?.avatar || "/images/account.png"}
              alt={adminData?.name || "Admin"}
            />
            <h2 className="mt-3 font-semibold text-gray-700 text-center">{adminData?.name || "Admin"}</h2>
          </div>

          <ul className="font-sans text-sm text-gray-700 px-4">
            <li>
              <Link href="/profile">
                <div className="menu-item"><Admin size={18} /> Profile Information</div>
              </Link>
            </li>
            <li>
              <Link href="/enquires">
                <div className="menu-item"><Package size={18} /> My Enquries</div>
              </Link>
            </li>
            <li>
              <Link href="/account/address">
                <div className="menu-item"><MapPin size={18} /> Manage Address</div>
              </Link>
            </li>
            <li>
              <Link href="/account/wishfav">
                <div className="menu-item"><Heart size={18} /> Wishlist & Favorites</div>
              </Link>
            </li>
            <li>
              <Link href="/account/retref">
                <div className="menu-item"><RefreshCcw size={18} /> Returns and Refunds</div>
              </Link>
            </li>
            <li>
              <Link href="/account/notifications">
                <div className="menu-item"><Bell size={18} /> Notifications</div>
              </Link>
            </li>
            <li>
              <Link href="/account/support">
                <div className="menu-item"><LifeBuoy size={18} /> Support and Help</div>
              </Link>
            </li>
            <li className="mt-4">
              <LogoutBTN />
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen bg-gray-50 p-6">
          <div className="text-lg font-semibold text-gray-800 mb-4">
            Profile Information
          </div>
          {/* You can render profile detail or settings here */}
        </main>
      </div>
    </>
  );
};

export default Account;
