"use client";

import { useSession, signOut } from "next-auth/react";
import Navbar from "@/components/Navbar";
import React from "react";
import Image from "next/image";
import { Admin, Package, MapPin, Heart, RefreshCcw, Bell, LifeBuoy, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from '../../context/AuthContext'; // ✅ corrected path if needed
import { useRouter } from "next/navigation";
import LogoutBTN from "@/components/LogoutBTN";

const Account = () => {
  const { admin, logout, isLogin, adminData, setAdminData, isLoading, } = useAuth();
  const router = useRouter();
   const { jwtAdmin, setJwtAdmin } = useAuth();
  useEffect(() => {
    if (!isLogin) {
      router.push("/login");
    }
  }, [isLogin]);

  if (!admin) return <p className="text-center">Loading...</p>;

  const handleLogout = async () => {
    logout();
    await signOut({ redirect: false });
    router.push('/');
  };

  if (!isLogin) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <>
      <Navbar />
      <div className="flex w-full min-h-screen">
        {/* Sidebar */}
        <div className="left w-[250px] min-h-screen border-r-[1px] shadow-xl border-gray-300">
          <div className="p-3 pt-0 flex items-center gap-3 mt-4">
            <img
                                className="h-[140px] w-[140px] rounded-full object-cover"
                                src={adminData?.avatar || "/images/account.png"}
                                alt="Admin Profile"
                            />
            <div className="flex flex-col items-start font-sans text-sm break-words">
              <h2 className="text-gray-700 text-base font-semibold">{adminData?.name}</h2>
            </div>
          </div>

          <ul className="font-sans text-gray-600">
            {/* Menu Items */}
            <li><Link href="/profile"><div className="menu-item"><Admin size={18} /> Profile Information</div></Link></li>
            <li><Link href="/orders"><div className="menu-item"><Package size={18} /> My Orders</div></Link></li>
            <li><Link href="/account/address"><div className="menu-item"><MapPin size={18} /> Manage Address</div></Link></li>
            <li><Link href="/account/wishfav"><div className="menu-item"><Heart size={18} /> Wishlist & Favorites</div></Link></li>
            <li><Link href="/account/retref"><div className="menu-item"><RefreshCcw size={18} /> Returns and Refunds</div></Link></li>
            <li><Link href="/account/notifications"><div className="menu-item"><Bell size={18} /> Notifications</div></Link></li>
            <li><Link href="/account/support"><div className="menu-item"><LifeBuoy size={18} /> Support and Help</div></Link></li>
            <li>
              <div>
                <LogoutBTN />
              </div>
            </li>
          </ul>
        </div>

        {/* Content Area */}
        <div className="right w-full min-h-screen">
          <div className="min-h-10 w-full shadow-md text-black font-sans font-semibold flex items-center pl-4 text-lg">
            Profile information
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;
