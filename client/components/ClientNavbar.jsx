"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Righteous } from "next/font/google";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { IoCartOutline } from "react-icons/io5";
import { MdCall } from "react-icons/md";
import { useAuth } from "@/app/context/AuthContext";
import { IoMdHome } from "react-icons/io";
import { fetchDataFromApi } from "@/utils/api";
import { useCat } from "@/app/context/CategoryContext";
import { usePrd } from "@/app/context/ProductContext";
import { FaCartPlus } from "react-icons/fa6";
import { MdAccountCircle } from "react-icons/md";
import Search from "./Search";
import { FaBell } from "react-icons/fa";
import { useNotice } from "@/app/context/NotificationContext";
import LogoutBTN from "./LogoutBTN";
import { Package, User, CreditCard, Bell, Heart, MapPin } from "lucide-react";
import { MdOutlineMessage } from "react-icons/md";
import Loading from "./Loading";
import NextImage from "next/image";
import Skeleton from "@mui/material/Skeleton";
import { usePathname } from "next/navigation";
import HomeIcon from "@mui/icons-material/Home";
import { useScreen } from "@/app/context/ScreenWidthContext";

import {
  Sofa,
  Home,
  BedDouble,
  UtensilsCrossed,
  Laptop,
  LampDesk,
  Boxes,
} from "lucide-react";

/* ---------------- ICON MAP ---------------- */
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



const clientNavbar = ({ fontClass, cartItems = [], minimized = false }) => {
  const router = useRouter();
  const pathName = usePathname();
  const dropdownRef = useRef(null);

  const { catData } = useCat();

  const { userData, isLogin, isCheckingToken } = useAuth();
  const { getNotifications } = useNotice();
  const { showLarge } = usePrd();
  const {
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    isXl1440,
    is2Xl,
    isGELg,
    screenWidth,
    deskSearch,
    setDeskSearch,
  } = useScreen();

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    getNotifications();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // if (!showLarge) return null;
  if (localLoading) return <Loading />;

  /* ================= RENDER ================= */
  if (!showLarge) {
    return (
      <div className="w-full">
        <div className="  bg-slate-900 text-white ">
          {/* ================= TOP BAR ================= */}
          <div
            className={` max-w-[1600px] mx-auto px-2 sm:px-6 flex  justify-between items-center      ${
              isMd ? " h-[90px] " : "h-[80px]  sm:h-[90px] "
            }  `}
          >
            

            {/* SCROLLED TEXT CATEGORIES */}

            <div
              className={`
      hidden lg:flex h-full items-center gap-4 ml-10 mr-5 mt-4 text-sm font-medium
      transition-all duration-500
      ease-[cubic-bezier(0.22,1,0.36,1)] 


      ${
        deskSearch
          ? "opacity-0 translate-y-4 pointer-events-none"
          : pathName === "/"
          ? isScrolled
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6 pointer-events-none"
          : "opacity-100 translate-y-0"
      }
    `}
            >
              {/* Go Home Button */}
              {pathName !== "/" && (
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => router.push("/")}
                    className="text-slate-300 hover:text-white transition-colors mt-1"
                  >
                    <HomeIcon />
                  </button>
                  <span className="text-slate-400 font-semibold text-[20px]">
                    |
                  </span>
                </div>
              )}

              {/* Menu Items */}
              {["Sofas", "Living Room", "Bedroom", "Dining"].map(
                (name, i, arr) => (
                  <React.Fragment key={name}>
                    <button
                      onClick={() => {
                        const catId = catData?.find(
                          (c) => c.name === name
                        )?._id;
                        if (catId) {
                          router.push(`/ProductListing?catId=${catId}`);
                        }
                      }}
                      className={`
            text-slate-300 hover:text-white
            transition-colors duration-300
            relative after:absolute after:-bottom-1 after:left-0
            after:w-0 after:h-[1px] after:bg-white 
            hover:after:w-full after:transition-all after:duration-300 text-nowrap
              ${isXl1440 || is2Xl ? "text-[20px]" : " text-[17px]"}  `}
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

            <div className="sm:flex sm:gap-6 w-">
              {/* SEARCH */}
              <div className="relative md:w-[50px] lg:w-[50px] xl:w-[100px]">
                <div
                  className={`
        absolute right-0 top-1/2 -translate-y-1/2
        transition-[opacity,transform]
        duration-[500ms]
        ease-[cubic-bezier(0.22,1,0.36,1)]
        will-change-[opacity,transform]
        ${isScrolled ? " translate-x-0 " : "opacity-100 translate-x-0"}
      `}
                >
                  <Search />
                </div>
              </div>

              <div className="w-auto sm:hidden flex">
                <div className="relative block sm:hidden" ref={dropdownRef}>
                  <IconButton
                    aria-label="Account"
                    onClick={toggleMenu}
                    className="text-slate-200"
                  >
                    <Image
                      src={userData?.avatar || "/images/emptyAccount.png"}
                      alt="Account"
                      width={35}
                      height={35}
                      className="!w-[35px] !h-[35px] rounded-full border-2 border-slate-200 cursor-pointer object-cover shrink-0"
                    />
                  </IconButton>

                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-[230px] bg-white text-[#1e293b] rounded-xl shadow-2xl z-[1000]">
                      <div className="flex flex-col p-3 space-y-2 text-sm">
                        {!isLogin ? (
                          <>
                            <div className="font-semibold text-gray-900">
                              Welcome, Guest!
                            </div>
                            <hr className="border-gray-200" />
                            <button
                              onClick={() => {
                                router.push("/login");
                                setMenuOpen(false);
                              }}
                              className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition font-medium"
                            >
                              Login
                            </button>
                            <button
                              onClick={() => {
                                router.push("/signup");
                                setMenuOpen(false);
                              }}
                              className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition font-medium"
                            >
                              Register
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="font-semibold text-gray-900 px-3">
                              {userData?.name || "User"}
                            </div>
                            <hr className="border-gray-200" />
                            <Link
                              href="/profile"
                              onClick={() => setMenuOpen(false)}
                              className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded transition"
                            >
                              <User size={18} /> Profile
                            </Link>
                            <Link
                              href="/enquires"
                              onClick={() => setMenuOpen(false)}
                              className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded transition"
                            >
                              <MdOutlineMessage size={18} /> My Enquries
                            </Link>
                            <Link
                              href="/wishlist"
                              onClick={() => setMenuOpen(false)}
                              className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded transition"
                            >
                              <Heart size={18} /> Wishlist
                            </Link>
                            <Link
                              href="/notifications"
                              onClick={() => setMenuOpen(false)}
                              className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded transition"
                            >
                              <Bell size={18} /> Notifications
                            </Link>
                            <Link
                              href="/address"
                              onClick={() => setMenuOpen(false)}
                              className="flex items-center gap-2 hover:bg-gray-100 px-3 pt-2 pb-[2px] rounded transition"
                            >
                              <MapPin size={18} /> Manage Address
                            </Link>
                            <div className="pt-0">
                              <LogoutBTN onLogout={() => setMenuOpen(false)} />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-3">
                <div className="sm:hidden">
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="text-white focus:outline-none"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={
                          mobileMenuOpen
                            ? "M6 18L18 6M6 6l12 12"
                            : "M4 6h16M4 12h16M4 18h16"
                        }
                      />
                    </svg>
                  </button>
                </div>

                {/* ICONS */}
                <div className="hidden sm:flex items-center gap-3">
                  <IconButton onClick={() => router.push("/notifications")}>
                    <FaBell className="!text-[33px] text-white" />
                  </IconButton>
                  <IconButton
                    aria-label="Call"
                    onClick={() => (window.location.href = "tel:+919776501230")}
                  >
                    <MdCall className="!text-[37px] text-white" />
                  </IconButton>

                  {/* ACCOUNT */}
                  <div className="relative group hidden sm:block">
                    <IconButton
                      aria-label="Account"
                      onClick={() =>
                        router.push(isLogin ? "/profile" : "/login")
                      }
                      className="text-slate-200"
                    >
                      {isCheckingToken ? (
                        <Skeleton
                          variant="circular"
                          animation="wave"
                          width={37}
                          height={37}
                          sx={{ bgcolor: "rgba(203,213,225,0.5)" }}
                          className="w-[37.2px] h-[37.2px] rounded-full border-2 border-slate-200 cursor-pointer object-cover shrink-0"
                        />
                      ) : (
                        <Image
                          src={userData?.avatar || "/images/emptyAccount.png"}
                          alt="Account"
                          width={37}
                          height={37}
                          className="w-[37.2px] h-[37.2px] rounded-full border-2 border-slate-200 cursor-pointer object-cover shrink-0"
                        />
                      )}
                    </IconButton>

                    {/* Hover Dropdown */}
                    <div className="absolute right-0 mt-2 w-[220px] bg-white text-[#1e293b] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[1000]">
                      <div className="flex flex-col p-3 space-y-2 text-sm">
                        {isLogin ? (
                          <>
                            <div className="font-semibold text-gray-900">
                              {userData?.name || "User"}
                            </div>
                            <hr className="border-gray-200" />
                            <Link
                              href="/profile"
                              className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded transition"
                            >
                              <User size={18} /> Profile
                            </Link>
                            <Link
                              href="/enquires"
                              className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded transition"
                            >
                              <MdOutlineMessage size={18} /> My Enquries
                            </Link>
                            <Link
                              href="/wishlist"
                              className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded transition"
                            >
                              <Heart size={18} /> Wishlist
                            </Link>
                            <Link
                              href="/notifications"
                              className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded transition"
                            >
                              <Bell size={18} /> Notifications
                            </Link>
                            <Link
                              href="/address"
                              className="flex items-center gap-2 hover:bg-gray-100 px-3 pt-2 pb-[2px] rounded transition"
                            >
                              <MapPin size={18} /> Manage Address
                            </Link>
                            <div className="">
                              <LogoutBTN onLogout={() => setMenuOpen(false)} />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="font-semibold text-gray-900">
                              Welcome, Guest!
                            </div>
                            <hr className="border-gray-200" />
                            <button
                              onClick={() => router.push("/login")}
                              className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition font-medium"
                            >
                              Login
                            </button>
                            <button
                              onClick={() => router.push("/signup")}
                              className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition font-medium"
                            >
                              Register
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== MD TEXT NAVBAR ===== */}
        {pathName === "/" && isMd && isScrolled && (
          <div
            className={`
      w-full bg-slate-900 h-[48px] border-0
      transition-all duration-500
      ease-[cubic-bezier(0.22,1,0.36,1)]
     opacity-100 translate-y-0
      `}
          >
            <div className="max-w-[1200px] mx-auto px-4 relative">
              {/* Edge fade – left */}
              <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-slate-900 to-transparent z-10" />
              {/* Edge fade – right */}
              <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-slate-900 to-transparent z-10" />

              <div className="flex justify-center">
                <div
                  className="
            flex items-center gap-6
            overflow-x-auto whitespace-nowrap
            scrollbar-hide
            py-2
          "
                >
                  {[
                    "Sofas",
                    "Living Room",
                    "Bedroom",
                    "Dining",
                    "Study & Office",
                    "Home decor",
                    "Accessories",
                  ].map((name) => (
                    <button
                      key={name}
                      onClick={() => {
                        const catId = catData?.find(
                          (c) => c.name === name
                        )?._id;
                        if (catId)
                          router.push(`/ProductListing?catId=${catId}`);
                      }}
                      className="
                flex-shrink-0
                text-slate-300 hover:text-white
                text-[16px] font-medium tracking-[0.015em]
                transition-all duration-300
                px-1 py-1
                relative
                after:absolute after:-bottom-1 after:left-1/2
                after:-translate-x-1/2
                after:w-0 after:h-[1px] after:bg-white
                hover:after:w-full
                after:transition-all after:duration-300
              "
                    >
                      {name}
                      
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {pathName != "/" && isMd && (
          <div
            className={`
      w-full bg-slate-900 h-[48px] border-0
      transition-all duration-500
      ease-[cubic-bezier(0.22,1,0.36,1)]
      opacity-100 translate-y-0
      `}
          >
            <div className="max-w-[1200px] mx-auto px-4 relative">
              {/* Edge fade – left */}
              <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-slate-900 to-transparent z-10" />
              {/* Edge fade – right */}
              <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-slate-900 to-transparent z-10" />

              <div className="flex justify-center">
                <div
                  className="
            flex items-center gap-6
            overflow-x-auto whitespace-nowrap
            scrollbar-hide
            py-2
          "
                >
                  {pathName !== "/" && (
                    <div className="flex items-center justify-center gap-4">
                      <button
                        onClick={() => router.push("/")}
                        className="text-slate-300 hover:text-white transition-colors  px-4"
                      >
                        <HomeIcon />
                      </button>
                    </div>
                  )}
                  {[
                    "Sofas",
                    "Living Room",
                    "Bedroom",
                    "Dining",
                    "Study & Office",
                    "Home decor",
                    "Accessories",
                  ].map((name) => (
                    <button
                      key={name}
                      onClick={() => {
                        const catId = catData?.find(
                          (c) => c.name === name
                        )?._id;
                        if (catId)
                          router.push(`/ProductListing?catId=${catId}`);
                      }}
                      className="
                flex-shrink-0
                text-slate-300 hover:text-white
                text-[16px] font-medium tracking-[0.015em]
                transition-all duration-300
                px-1 py-1
                relative
                after:absolute after:-bottom-1 after:left-1/2
                after:-translate-x-1/2
                after:w-0 after:h-[1px] after:bg-white
                hover:after:w-full
                after:transition-all after:duration-300
              "
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= CATEGORY CARDS ================= */}
        <div
          className={` 
      hidden md:block 
      transition-[opacity,transform]
      duration-[500ms]
      ease-[cubic-bezier(0.22,1,0.36,1)]
      will-change-[opacity,transform]
      ${
        isScrolled
          ? "opacity-0 translate-y-3 pointer-events-none"
          : "opacity-100 translate-y-0"
      }
    `}
        >
          <div
            className={`max-w-[1600px] mx-auto py-2 flex justify-center  ${
              pathName === "/" ? "block" : "hidden"
            }`}
          >
            <ul className="flex items-start gap-4  scrollbar-hide">
              {!catData || catData.length === 0
                ? Array.from({ length: 7 }).map((_, index) => (
                   <li
  key={`skeleton-${index}`}
  className="h-[70px] md:w-[85px] lg:w-[110px] xl:w-[130px]"
>
  <Skeleton
    variant="rectangular"
    animation="wave"
    className="!h-[70px] !md:w-[85px] !lg:w-[110px] !xl:w-[130px] !rounded-xl"
    sx={{
      bgcolor: "rgba(203,213,225,0.5)",
    }}
  />
</li>

                  ))
                : [...catData]
                    .sort((a, b) => a.sln - b.sln)
                    .map((cat, index) => (
                      <li
                        key={cat._id}
                        onClick={() =>
                          router.push(`/ProductListing?catId=${cat._id}`)
                        }
                        className="relative group cursor-pointer"
                      >
                        {/* CATEGORY CARD */}
                        <div
                          className="
                h-[70px] md:w-[85px] lg:w-[110px] xl:w-[130px]
                  bg-white rounded-xl


                  flex flex-col
                  items-center justify-center
                  p-1 gap-1
                  shadow-sm
                  shadow-slate-900/20
                  hover:shadow-lg
                  hover:shadow-slate-900/30

                  transition-all duration-200


                "
                        >
                          <div className="w-8 h-8 flex items-center justify-center">
                            {getCategoryIcon(cat.name)}
                          </div>

                          <span className="  md:text-[12px] lg:text-[14px] xl:text-[16px]
      
        text-slate-900 text-nowrap font-medium text-center">
                            {cat.name}  
                          </span>
                        </div>

                        {/* MEGA MENU */}
                        {cat.children?.length > 0 && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className={`
                    absolute top-full left-0 text-left
                    ${index > catData.length - 3 ? "right-0 left-auto" : ""}
                    bg-white shadow-2xl border border-gray-200 rounded-lg
                    sm:px-3 lg:px-6 py-5
                    opacity-0 invisible
                    group-hover:opacity-100 group-hover:visible
                    group-hover:translate-y-2
                    transition-all duration-300 ease-in-out
                    z-[300]
                    overflow-auto scrollbar-hide
                    max-w-screen-lg

                    
                  `}
                          >
                            <div
                              className="flex gap-4 "
                              style={{
                                width:
                                  cat.children.length *
                                    (typeof window !== "undefined" &&
                                    window.innerWidth < 640
                                      ? 160
                                      : typeof window !== "undefined" &&
                                        window.innerWidth < 1024
                                      ? 160
                                      : 240) +
                                  "px",
                              }}
                            >
                              {cat.children.map((subCat, subIndex) => (
                                <div
                                  key={subIndex}
                                  className="min-w-[160px] md:min-w-[200px] lg:min-w-[240px]
                                  transition-transform duration-300 hover:scale-[1.02]
                                  
                                  "
                                >
                                  <a
                                    href={`/ProductListing?subCatId=${subCat._id}`}
                                    className="block text-[15px] md:text-[16px] font-semibold mb-3 text-slate-800 hover:text-indigo-700"
                                  >
                                    {subCat.name}
                                  </a>

                                  <ul className="space-y-1">
                                    {subCat.children?.map(
                                      (third, thirdIndex) => (
                                        <li key={thirdIndex}>
                                          <a
                                            href={`/ProductListing?thirdSubCatId=${third._id}`}
                                            className="block text-[14px] md:text-[15px] text-gray-600 font-medium hover:text-[#131e30] transition-all duration-200"
                                          >
                                            {third.name}
                                          </a>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
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

            {[...(catData || [])]
              .sort((a, b) => a.sln - b.sln)
              .map((cat) => (
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

                  {cat.children?.length > 0 && (
                    <ul className="pl-4 mt-1 space-y-1 text-sm text-gray-600">
                      {cat.children.map((subCat) => (
                        <li key={subCat._id}>
                          <Link
                            href={`/ProductListing?subCatId=${subCat._id}`}
                            className="hover:text-indigo-600"
                          >
                            {subCat.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    );
  }
};


export default clientNavbar