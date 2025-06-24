

"use client";
import React, { useState, useEffect } from "react";
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
import { useCart } from "@/app/context/CartContext";
import { FaCartPlus } from "react-icons/fa6";
import { MdAccountCircle } from "react-icons/md";
import Search from "./Search";
import { FaBell } from "react-icons/fa";
import { useNotice } from "@/app/context/NotificationContext";


const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const righteous = Righteous({ subsets: ["latin"], weight: "400" });

const Navbar = ({ fontClass, cartItems = [] }) => {
  const { catData, setCatData } = useCat();
  const { setLoading } = useAuth(); // ✅ Added for loader
  const router = useRouter();
  const { userData, isLogin } = useAuth();
  const { cartData } = useCart();
  const { notices, getNotifications } = useNotice();





  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <nav className=" sticky top-[-70px]   z-[100] bg-gradient-to-r from-indigo-950 via-indigo-900 to-[#1e40af]  text-white border-t border-[#1e293b] shadow-md">


      <div className="max-w-full mx-auto px-6 py-2 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-1 flex-shrink-0 w-[200px]">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={50}
            height={50}
            className="rounded-full"
          />
          <Image
            src="/images/snsf-text.png"
            alt="SNSF Text"
            height={50}
            width={145}
            className="drop-shadow-xl"
          />
        </div>

        {/* Search Bar */}
        <Search />

        <div className="flex items-center justify-between w-[200px]">


          {/* Actions */}
          <IconButton aria-label="Notification" onClick={() => router.push("/notifications")}>
            {/* <StyledBadge badgeContent={notices.map((notice)=>!notice.read).length} color="secondary"> */}
            <FaBell className="text-2xl text-white" />
            {/* </StyledBadge> */}
          </IconButton>


          <IconButton aria-label="Call" onClick={() => window.location.href = 'tel:+919776501230'}>
            <MdCall className="text-3xl text-white" />
          </IconButton>


          <IconButton
            aria-label="Account"
            onClick={() => router.push(isLogin ? "/profile" : "/login")} className="text-slate-200"
          >
            <Image
              src={userData?.avatar || "/images/emptyAccount.png"}
              alt="Account"
              width={32}
              height={32}
              className="shrink-0 w-[24px] h-[24px] rounded-full border-2 border-slate-200 cursor-pointer object-cover"
            />
          </IconButton>



          <IconButton aria-label="Cart" onClick={() => router.push(isLogin ? "/cart" : "/login")}>
            <StyledBadge badgeContent={userData && cartData?.length} color="secondary">
              <FaCartPlus className="text-[27px] text-white" />
            </StyledBadge>
          </IconButton>


        </div>
      </div>

      <ul className="flex justify-evenly border border-b-slate-200 bg-white shadow-sm  px-10">
        <li
          onClick={() => router.push("/")}
          className="cursor-pointer flex items-center justify-center text-[18px] px-10 bg-slate-100 hover:bg-slate-200 text-[#131e30] hover:font-semibold py-1 transition-all duration-200"
          title="Back to Home"
        >
          <IoMdHome/>
        </li>

        {catData?.map((cat, index) => (
          <li
            key={index}
            onClick={() => router.push(`/ProductListing?catId=${cat._id}`)}
            className="relative group  w-full text-center cursor-pointer transition-all duration-200  "
          >
            <span className="block text-[15px] font-medium text-slate-800 transition duration-200 group-hover:text-[#131e30] hover:font-semibold w-full h-full py-1
          group-hover:font-semibold
          ">
              {cat.name}
            </span>

            {cat.children?.length > 0 && (
              <div
                onClick={(e) => e.stopPropagation()}
                className={`absolute top-full left-0 text-left ${index > catData.length - 3 ? "right-0 left-auto" : ""
                  } bg-white shadow-2xl border border-gray-200 rounded-lg px-6 py-5 
    opacity-0 invisible group-hover:opacity-100 group-hover:visible 
    group-hover:translate-y-2 transition-all duration-300 ease-in-out 
    z-[300] overflow-auto scrollbar-hide`}
                style={{ maxWidth: "100vw", whiteSpace: "nowrap" }}
              >
                <div
                  className="flex gap-4"
                  style={{ width: `${cat.children.length * 220}px` }}
                >
                  {cat.children.map((subCat, subIndex) => (
                    <div
                      key={subIndex}
                      className="min-w-[200px] transition-transform duration-300 hover:scale-[1.02]"
                    >
                      <a
                        href={`/ProductListing?subCatId=${subCat._id}`}
                        className="block text-[15px] font-semibold mb-3 text-slate-800 hover:text-indigo-700"
                      >
                        {subCat.name}
                      </a>
                      <ul className="space-y-1">
                        {subCat.children?.map((thirdSubCatId, thirdIndex) => (
                          <li key={thirdIndex}>
                            <a
                              href={`/ProductListing?thirdSubCatId=${thirdSubCatId._id}`}
                              className="block text-[15px] text-gray-600 hover:text-[#131e30] transition-all duration-200"
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
    </nav>
  );
};

export default Navbar;
