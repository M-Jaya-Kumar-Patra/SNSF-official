"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaBell } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";
import { MdCall, MdOutlineMessage } from "react-icons/md";
import {
  BedDouble,
  Bell,
  Boxes,
  Heart,
  Home,
  LampDesk,
  Laptop,
  MapPin,
  Package,
  Sofa,
  User,
  UtensilsCrossed,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useCat } from "@/app/context/CategoryContext";
import { useNotice } from "@/app/context/NotificationContext";
import { usePrd } from "@/app/context/ProductContext";
import LogoutBTN from "./LogoutBTN";
import Search from "./Search";

const categoryIcons = {
  sofas: Sofa,
  "living room": Home,
  bedroom: BedDouble,
  dining: UtensilsCrossed,
  "study & office": Laptop,
  "home decor": LampDesk,
  accessories: Boxes,
};

const getCategoryIcon = (name) => {
  const Icon = categoryIcons[name?.toLowerCase()] || Package;
  return <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-slate-900" />;
};

const Navbar = () => {
  const router = useRouter();
  const pathName = usePathname();
  const dropdownRef = useRef(null);

  const { catData } = useCat();
  const { userData, isLogin, isCheckingToken } = useAuth();
  const { getNotifications } = useNotice();
  const { showLarge } = usePrd();

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (isLogin) getNotifications();
  }, [getNotifications, isLogin]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (showLarge) return null;

  const sortedCatData = [...(catData || [])].sort((a, b) => a.sln - b.sln);

  const goCategory = (name) => {
    const catId = catData?.find((c) => c.name === name)?._id;
    if (catId) router.push(`/ProductListing?catId=${catId}`);
  };

  return (
    <nav className="fixed w-full top-0 z-[1000] bg-slate-900">
      <div className="bg-slate-900 text-white">
        <div className="max-w-[1600px] mx-auto px-2 sm:px-6 flex justify-between items-center h-[80px] sm:h-[90px]">
          <button
            type="button"
            aria-label="Go to home page"
            onClick={() => router.push("/")}
            className="flex items-center gap-0 sm:gap-1 flex-shrink-0 h-[45px] sm:h-[50px]"
          >
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={60}
              height={60}
              className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] object-contain"
              priority
            />

            <Image
              src="/images/snsf-text.png"
              alt="SNSF"
              width={160}
              height={60}
              className="w-[140px] h-[50px] sm:w-[160px] sm:h-[60px] object-contain"
              priority
            />
          </button>

          <div
            className={`hidden lg:flex h-full items-center gap-4 ml-10 mr-5 mt-4 text-sm font-medium transition-all duration-500 ${
              pathName === "/" && !isScrolled
                ? "opacity-0 translate-y-6 pointer-events-none"
                : "opacity-100 translate-y-0"
            }`}
          >
            {pathName !== "/" && (
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  aria-label="Go to home page"
                  onClick={() => router.push("/")}
                  className="text-slate-300 hover:text-white transition-colors mt-1"
                >
                  <IoMdHome className="text-[24px]" />
                </button>
                <span className="text-slate-400 font-semibold text-[20px]">
                  |
                </span>
              </div>
            )}

            {["Sofas", "Living Room", "Bedroom", "Dining"].map(
              (name, i, arr) => (
                <React.Fragment key={name}>
                  <button
                    type="button"
                    onClick={() => goCategory(name)}
                    className="text-slate-300 hover:text-white transition-colors duration-300 relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-white hover:after:w-full after:transition-all after:duration-300 text-nowrap text-[17px]"
                  >
                    {name}
                  </button>

                  {i < arr.length - 1 && (
                    <span className="text-slate-400 font-semibold text-[20px]">
                      |
                    </span>
                  )}
                </React.Fragment>
              )
            )}
          </div>

          <div className="sm:flex sm:gap-6">
            <div className="relative md:w-[50px] lg:w-[50px] xl:w-[100px]">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 transition-[opacity,transform] duration-[500ms]">
                <Search />
              </div>
            </div>

            <div className="w-auto sm:hidden flex">
              <div className="relative block sm:hidden" ref={dropdownRef}>
                <button
                  type="button"
                  aria-label="Account"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="inline-flex items-center justify-center rounded-full p-2 text-slate-200"
                >
                  <Image
                    src={userData?.avatar || "/images/emptyAccount.png"}
                    alt="Account"
                    width={35}
                    height={35}
                    className="!w-[35px] !h-[35px] rounded-full border-2 border-slate-200 cursor-pointer object-cover shrink-0"
                  />
                </button>

                {menuOpen && (
                  <AccountMenu
                    isLogin={isLogin}
                    userData={userData}
                    onClose={() => setMenuOpen(false)}
                  />
                )}
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-3">
              <button
                type="button"
                aria-label="Open notifications"
                onClick={() => router.push("/notifications")}
                className="inline-flex items-center justify-center rounded-full p-2"
              >
                <FaBell className="!text-[33px] text-white" />
              </button>
              <button
                type="button"
                aria-label="Call"
                onClick={() => (window.location.href = "tel:+919776501230")}
                className="inline-flex items-center justify-center rounded-full p-2"
              >
                <MdCall className="!text-[37px] text-white" />
              </button>

              <div className="relative group hidden sm:block">
                <button
                  type="button"
                  aria-label="Account"
                  onClick={() => router.push(isLogin ? "/profile" : "/login")}
                  className="inline-flex items-center justify-center rounded-full p-2 text-slate-200"
                >
                  {isCheckingToken ? (
                    <span className="block w-[37.2px] h-[37.2px] rounded-full border-2 border-slate-200 bg-slate-300 animate-pulse shrink-0" />
                  ) : (
                    <Image
                      src={userData?.avatar || "/images/emptyAccount.png"}
                      alt="Account"
                      width={37}
                      height={37}
                      className="w-[37.2px] h-[37.2px] rounded-full border-2 border-slate-200 cursor-pointer object-cover shrink-0"
                    />
                  )}
                </button>

                <div className="absolute right-0 mt-2 w-[220px] bg-white text-[#1e293b] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[1000]">
                  <AccountMenu
                    isLogin={isLogin}
                    userData={userData}
                    onClose={() => setMenuOpen(false)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`hidden md:block transition-[opacity,transform] duration-[500ms] ${
            isScrolled
              ? "opacity-0 translate-y-3 pointer-events-none"
              : "opacity-100 translate-y-0"
          }`}
        >
          <div
            className={`max-w-[1600px] mx-auto py-2 flex justify-center ${
              pathName === "/" ? "block" : "hidden"
            }`}
          >
            <ul className="flex items-start gap-4 scrollbar-hide">
              {sortedCatData.length === 0
                ? Array.from({ length: 7 }).map((_, index) => (
                    <li
                      key={`skeleton-${index}`}
                      className="h-[70px] md:w-[85px] lg:w-[110px] xl:w-[130px]"
                    >
                      <div className="h-[70px] md:w-[85px] lg:w-[110px] xl:w-[130px] rounded-xl bg-slate-200 animate-pulse" />
                    </li>
                  ))
                : sortedCatData.map((cat) => (
                    <li
                      key={cat._id}
                      onClick={() =>
                        router.push(`/ProductListing?catId=${cat._id}`)
                      }
                      className="relative group cursor-pointer"
                    >
                      <div className="h-[70px] md:w-[85px] lg:w-[110px] xl:w-[130px] bg-white rounded-xl flex flex-col items-center justify-center p-1 gap-1 shadow-sm shadow-slate-900/20 hover:shadow-lg hover:shadow-slate-900/30 transition-all duration-200">
                        <div className="w-8 h-8 flex items-center justify-center">
                          {getCategoryIcon(cat.name)}
                        </div>

                        <span className="md:text-[12px] lg:text-[14px] xl:text-[16px] text-slate-900 text-nowrap font-medium text-center">
                          {cat.name}
                        </span>
                      </div>
                    </li>
                  ))}
            </ul>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="sm:hidden bg-white text-[#131e30] border-t border-b py-2 px-4 space-y-2">
            <div
              onClick={() => {
                router.push("/");
                setMobileMenuOpen(false);
              }}
              className="cursor-pointer hover:font-semibold flex items-center gap-2"
            >
              <IoMdHome /> Home
            </div>

            {sortedCatData.map((cat) => (
              <div key={cat._id}>
                <div
                  onClick={() => {
                    router.push(`/ProductListing?catId=${cat._id}`);
                    setMobileMenuOpen(false);
                  }}
                  className="cursor-pointer font-medium hover:text-indigo-600"
                >
                  {cat.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

function AccountMenu({ isLogin, userData, onClose }) {
  return (
    <div className="flex flex-col p-3 space-y-2 text-sm">
      {!isLogin ? (
        <>
          <div className="font-semibold text-gray-900">Welcome, Guest!</div>
          <hr className="border-gray-200" />
          <Link
            href="/login"
            onClick={onClose}
            className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition font-medium"
          >
            Login
          </Link>
          <Link
            href="/signup"
            onClick={onClose}
            className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition font-medium"
          >
            Register
          </Link>
        </>
      ) : (
        <>
          <div className="font-semibold text-gray-900 px-3">
            {userData?.name || "User"}
          </div>
          <hr className="border-gray-200" />
          <Link
            href="/profile"
            onClick={onClose}
            className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded transition"
          >
            <User size={18} /> Profile
          </Link>
          <Link
            href="/enquires"
            onClick={onClose}
            className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded transition"
          >
            <MdOutlineMessage size={18} /> My Enquries
          </Link>
          <Link
            href="/wishlist"
            onClick={onClose}
            className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded transition"
          >
            <Heart size={18} /> Wishlist
          </Link>
          <Link
            href="/notifications"
            onClick={onClose}
            className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded transition"
          >
            <Bell size={18} /> Notifications
          </Link>
          <Link
            href="/address"
            onClick={onClose}
            className="flex items-center gap-2 hover:bg-gray-100 px-3 pt-2 pb-[2px] rounded transition"
          >
            <MapPin size={18} /> Manage Address
          </Link>
          <div className="pt-0">
            <LogoutBTN onLogout={onClose} />
          </div>
        </>
      )}
    </div>
  );
}

export default Navbar;
