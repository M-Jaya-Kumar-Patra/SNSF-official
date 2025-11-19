

"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Righteous } from "next/font/google";
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
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

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const righteous = Righteous({ subsets: ["latin"], weight: "400" });

const Navbar = ({ fontClass, cartItems = [], minimized = false }) => {
  const { catData, setCatData } = useCat();
  const router = useRouter();
  const { setLoading, userData, isLogin, isCheckingToken } = useAuth();
  const { getNotifications } = useNotice();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const [localLoading, setLocalLoading] = useState(false)


  useEffect(() => {
    const img = new window.Image(); // ✅ Native Image
    img.src = "/images/logo.png";

    img.onload = () => {
      setLocalLoading(false);
    };

    img.onerror = () => {
      console.error("Logo image failed to load");
      setLocalLoading(false);
    };
  }, []);


  if (localLoading) return <Loading />;

  useEffect(() => {
    getNotifications();
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

  const getOptimizedCloudinaryUrl = (url) => {
    if (!url?.includes("res.cloudinary.com")) return url;
    return url.replace("/upload/", "/upload/w_300,h_300,c_fit,fl_lossless,f_auto,q_100/");
  };

  return (
    <nav className=" sticky top-0 sm:top-[-82px]   z-[300] bg-gradient-to-r from-indigo-950 via-indigo-900 to-[#1e40af]  text-white  border-[#1e293b] shadow-md">


      <div>
        <div className="w-full max-w-screen-xl mx-auto px-3 md:px-6 lg:px-8 py-2 sm:py-4 flex items-center justify-between ">

          <div className="flex items-center gap-0  sm:gap-1  flex-shrink-0 h-[45px] sm:h-[50cd px]">
            {/* Logo Icon */}
            <Image
              src={getOptimizedCloudinaryUrl("/images/logo.png")}
              alt="Logo"
              width={50}
              height={50}
              className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] object-contain"
              fetchPriority="high" // ✅ hints browser it's high-priority for LCP
              quality={90}
            />

            {/* Logo Text */}
            <Image
              src={getOptimizedCloudinaryUrl("/images/snsf-text.png")}
              alt="SNSF"
              width={100}
              height={30}
              className="
                w-[140px] h-[50px] sm:w-[160px] sm:h-[60px]

      object-contain"

              fetchPriority="high" // ✅ hints browser it's high-priority for LCP
              quality={90}
            />
          </div>

       <div className="hidden sm:flex sm:flex-grow px-4 md:px-8 lg:px-20">
  <Search />
</div>



          

            <div className="w-auto sm:hidden flex">
              <div className="relative block sm:hidden" ref={dropdownRef}>
                <IconButton aria-label="Account" onClick={toggleMenu} className="text-slate-200">
                  <Image
                    src={(userData?.avatar) || "/images/emptyAccount.png"}
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
                          <div className="font-semibold text-gray-900">Welcome, Guest!</div>
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
                          <div className="font-semibold text-gray-900 px-3">{userData?.name || "User"}</div>
                          <hr className="border-gray-200" />
                          <Link href="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded transition">
                            <User size={18} /> Profile
                          </Link>
                          <Link href="/enquires" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded transition">
                            <MdOutlineMessage size={18} /> My Enquries
                          </Link>
                          <Link href="/wishlist" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded transition">
                            <Heart size={18} /> Wishlist
                          </Link>
                          <Link href="/notifications" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded transition">
                            <Bell size={18} /> Notifications
                          </Link>
                          <Link href="/address" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded transition">
                            <MapPin size={18} /> Manage Address
                          </Link>
                          {/* <Link href="/payments" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded transition">
                        <CreditCard size={18} /> Payments
                      </Link> */}
                          <div className="pt-2">
                            <LogoutBTN onLogout={() => {
                              setMenuOpen(false);  // Close menu
                              router.refresh();    // Force page refresh to re-check isLogin
                            }} />
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
                    d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>



            <div className="hidden sm:flex items-center gap-3">
              <IconButton aria-label="Notification" onClick={() => router.push("/notifications")}>
                <FaBell className="text-[28px] text-white" />
              </IconButton>
              <IconButton aria-label="Call" onClick={() => window.location.href = 'tel:+919776501230'}>
                <MdCall className="text-[34px] text-white" />
              </IconButton>


              <div className="relative group hidden sm:block">
                <IconButton
                  aria-label="Account"
                  onClick={() => router.push(isLogin ? "/profile" : "/login")}
                  className="text-slate-200"
                >
                  {isCheckingToken ? (
                    <Skeleton
                      variant="circular"
                      animation="wave"
                      width={32}
                      height={32}
                      sx={{ bgcolor: "rgba(203,213,225,0.5)" }}
                      className="w-[32px] h-[32px] rounded-full border-2 border-slate-200 cursor-pointer object-cover shrink-0"
                    />
                  ) : (
                    <Image
                      src={(userData?.avatar) || "/images/emptyAccount.png"}
                      alt="Account"
                      width={32}
                      height={32}
                      className="w-[32px] h-[32px] rounded-full border-2 border-slate-200 cursor-pointer object-cover shrink-0"
                    />
                  )}
                </IconButton>

                {/* Hover Dropdown */}
                <div className="absolute right-0 mt-2 w-[220px] bg-white text-[#1e293b] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[1000]">
                  <div className="flex flex-col p-3 space-y-2 text-sm">
                    {isLogin ? (
                      <>
                        <div className="font-semibold text-gray-900">{userData?.name || "User"}</div>
                        <hr className="border-gray-200" />
                        <Link href="/profile" className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded transition">
                          <User size={18} /> Profile
                        </Link>
                        <Link href="/enquires" className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded transition">
                          <MdOutlineMessage size={18} /> My Enquries
                        </Link>
                        <Link href="/wishlist" className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded transition">
                          <Heart size={18} /> Wishlist
                        </Link>
                        <Link href="/notifications" className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded transition">
                          <Bell size={18} /> Notifications
                        </Link>
                        <Link href="/address" className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded transition">
                          <MapPin size={18} /> Manage Address
                        </Link>
                        {/* <Link href="/payments" className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded transition">
            <CreditCard size={18} /> Payments
          </Link> */}
                        <div className="pt-0">
                          <LogoutBTN onLogout={() => setMenuOpen(false)} />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="font-semibold text-gray-900">Welcome, Guest!</div>
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

      {/* DESKTOP CATEGORY MENU */}
      <ul className="hidden md:flex w-full  border border-b-slate-200 bg-white shadow-xl sm:px-5 md:px-10 z-40">
        {/* Home Button */}
        <li
          onClick={() => router.push("/")}
          className="cursor-pointer flex items-center justify-center text-[20px] lg:px-10  hover:bg-slate-50 text-[#131e30] hover:font-semibold py-1 transition-all duration-200"
          title="Back to Home"
        >
          {
            (!catData || catData?.length === 0) ?

              <Skeleton
                variant="text"
                animation="wave"
                height={24}
                sx={{ bgcolor: "rgba(203,213,225,0.5)" }}
              />
              :
              <IoMdHome />
          }
        </li>

        {/* Category Skeleton Loader or Actual Categories */}
        {(!catData || catData?.length === 0)
          ? Array.from({ length: 7 }).map((_, index) => (
            <li key={`skeleton-${index}`} className="w-full px-6 py-1">
              <Skeleton
                variant="text"
                animation="wave"
                width={80}
                height={24}
                sx={{ bgcolor: "rgba(203,213,225,0.5)" }}
              />
            </li>
          ))
          : [...catData]
            .sort((a, b) => a.sln - b.sln)
            .map((cat, index) => (
              <li
                key={index}
                onClick={() => router.push(`/ProductListing?catId=${cat._id}`)}
                className="relative group w-full text-center cursor-pointer transition-all duration-200  "
              >
                <span className="block text-[15px] font-medium text-slate-800 transition duration-200 group-hover:text-[#131e30] group-hover:font-semibold py-1 text-nowrap">
                  {cat.name}
                </span>

                {cat.children?.length > 0 && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className={`absolute top-full left-0 text-left 
  ${index > catData.length - 3 ? "right-0 left-auto" : ""}
  bg-white shadow-2xl border border-gray-200 rounded-lg sm:px-3 lg:px-6 py-5
  opacity-0 invisible group-hover:opacity-100 group-hover:visible
  group-hover:translate-y-2 transition-all duration-300 ease-in-out
  z-[300] overflow-auto scrollbar-hide max-w-screen-sm sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl   text-nowrap
`}

                  >
                    
                    <div
  className="flex gap-0 lg:gap-4"
  style={{
    width:
      cat.children.length *
      (window.innerWidth < 640
        ? 160 // sm → reduced from 200
        : window.innerWidth < 1024
        ? 160 // md → normal
        : 240 // lg → more space
      ) + "px",
  }}
>
  {cat.children.map((subCat, subIndex) => (
    <div
      key={subIndex}
      className="min-w-[160px] sm:min-w-[16 0px] md:min-w-[200px] lg:min-w-[240px] 
                 transition-transform duration-300 hover:scale-[1.02]"
    >
      <a
        href={`/ProductListing?subCatId=${subCat._id}`}
        className="block text-[15px] sm:text-[15px] md:text-[16px] font-semibold mb-3 text-slate-800 hover:text-indigo-700"
      >
        {subCat.name}
      </a>
      <ul className="space-y-1">
        {subCat.children?.map((thirdSubCatId, thirdIndex) => (
          <li key={thirdIndex}>
            <a
              href={`/ProductListing?thirdSubCatId=${thirdSubCatId._id}`}
              className="block text-[14px] sm:text-[14px] md:text-[15px] text-gray-600 font-medium hover:text-[#131e30] transition-all duration-200"
            >
              {thirdSubCatId.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  ))}
</div>

                  </div>
                )}
              </li>
            ))}

      </ul>





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

    </nav>
  );
};

export default Navbar;
