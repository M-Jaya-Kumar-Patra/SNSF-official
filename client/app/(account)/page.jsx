"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import LogoutBTN from "@/components/LogoutBTN";
import { useAuth } from '../../context/AuthContext';
import { User, Package, MapPin, Heart, RefreshCcw, Bell, LifeBuoy, Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Account = () => {
  const router = useRouter();
  const { userData, isLogin ,isCheckingToken,setIsCheckingToken } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
      if (isCheckingToken) return <div className="text-center mt-10">Checking session...</div>;

  useEffect(() => {
    if (!isLogin) {
      setIsCheckingToken(false); // ✅ This is crucial
      router.push("/login");
      
    }
  }, [isLogin]);

  return (
    <div className="flex flex-col sm:flex-row w-full min-h-screen">
      {/* Mobile Header */}
      <div className="sm:hidden flex items-center justify-between px-4 py-3 border-b shadow-md">
        <h2 className="text-lg font-semibold text-gray-800">Account</h2>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <div className={`sm:block ${sidebarOpen ? 'block' : 'hidden'} w-full sm:w-[250px] border-r shadow-md sm:min-h-screen bg-white`}>
        <div className="p-4 flex flex-col items-center gap-3">
          <Image
            className="h-[100px] w-[100px] rounded-full object-cover"
            src={userData?.avatar || "/images/account.png"}
            alt="User Profile"
            width={100}
            height={100}
          />
          <h2 className="text-gray-700 text-base font-semibold text-center break-words">{userData?.name}</h2>
        </div>

        <ul className="font-sans text-gray-600 space-y-1 px-4">
          <li><Link href="/profile"><div className="menu-item"><User size={18} className="mr-2" /> Profile Information</div></Link></li>
          <li><Link href="/orders"><div className="menu-item"><Package size={18} className="mr-2" /> My Orders</div></Link></li>
          <li><Link href="/account/address"><div className="menu-item"><MapPin size={18} className="mr-2" /> Manage Address</div></Link></li>
          <li><Link href="/account/wishfav"><div className="menu-item"><Heart size={18} className="mr-2" /> Wishlist & Favorites</div></Link></li>
          <li><Link href="/account/retref"><div className="menu-item"><RefreshCcw size={18} className="mr-2" /> Returns and Refunds</div></Link></li>
          <li><Link href="/account/notifications"><div className="menu-item"><Bell size={18} className="mr-2" /> Notifications</div></Link></li>
          <li><Link href="/account/support"><div className="menu-item"><LifeBuoy size={18} className="mr-2" /> Support and Help</div></Link></li>
          <li><LogoutBTN /></li>
        </ul>
      </div>

      {/* Content Area */}
      <div className="w-full flex-1">
        <div className="min-h-10 w-full shadow-md text-black font-sans font-semibold flex items-center pl-4 text-lg bg-white">
          Profile information
        </div>
        <div className="p-4">
          {/* Actual dynamic content can go here */}
        </div>
      </div>
    </div>
  );
};

export default Account;
