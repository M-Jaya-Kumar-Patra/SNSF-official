
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
import { Button } from "@mui/material";
import {useCat} from "@/app/context/CategoryContext";



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

  const {catData, setCatData} = useCat()


  const router = useRouter();
  const { userData, setUserData, isLogin } = useAuth();



  return (
    <nav >
      <div className="px-8 py-3 flex items-center justify-between bg-gradient-to-l from-[#798ca8] via-[#334257] to-[#131e30]">
        {/* Logo Section */}
        <div className="flex gap-0 items-center">
          <Image
            className="w-16 h-16 rounded-full"
            src="/images/logo.png"
            alt="S N Steel Fabrication Logo"
            width={64}
            height={64}
            priority={true}
          />
          <img src="images/snsf-text.png" alt="" className="h-[64px] ml-0" />

          {/* <h1 className={`${righteous.className} text-4xl text-white text-[64px]`}>
      This should be in Righteous
    </h1> */}

        </div>

        {/* Search Box */}
        <div className="Search w-[30vw] border border-gray-500 h-[35px] px-1 flex items-center active:backdrop-blur-3xl rounded-full">
          <Image
            className=" mr-1 invert"
            src="/images/search.png"
            alt="Search Icon"
            width={20}
            height={20}
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-transparent outline-none font-sans"
            aria-label="Search for products"
          />
        </div>

        {/* Contact, Account, and Cart */}
        <div className="contact-account-cart w-[17%] flex justify-between items-center gap-3">
          <IoMdHome className="text-3xl  text-white shrink-0 hover:bg-gray-100 hover:bg-opacity-20  rounded-full" onClick={() => router.push('/')} />
          <MdCall className="text-3xl  text-white shrink-0 hover:bg-gray-100 hover:bg-opacity-20  rounded-full" />

          <Image
            className={`shrink-0 w-8 h-8 cursor-pointer rounded-full ${(isLogin) ? "" : "invert"
              }`}
            src={userData?.avatar || "/images/account.png"}
            alt="User Account"
            width={32}
            height={32}
            onClick={() => router.push((isLogin) ? "/profile" : "/login")}
          />


          <IconButton aria-label="cart" onClick={() => router.push(isLogin ? "/cart" : "/login")}>
            <StyledBadge badgeContent={cartItems.length} showZero color="secondary">
              <IoCartOutline className="text-3xl  text-white shrink-0 hover:bg-gray-100 hover:bg-opacity-20  rounded-full" />
            </StyledBadge>
          </IconButton>
        </div>

      </div>


      <ul className="flex justify-around p-1 border  border-b-slate-200 mb-0  ">
        {catData?.map((cat, index) => (
          <li key={index} className="relative group">
            <Link href={`/category/${cat.slug}`} className="text-[17px] font-semibold font-sans text-gray-700 hover:text-[#131e30] hover:border-b-2 hover:border-[#131e30] active:border-[#131e30] pb-1 transform-origin-left  ">
              {cat.name}
            </Link>

            {cat.children?.length > 0 && (
              <div
                className={`absolute top-full mt-4 ${index > catData.length - 3 ? 'right-0' : 'left-0'
                  } bg-white shadow-xl px-6 py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-auto scrollbar-hide`}
                style={{
                  maxWidth: '100vw', // Prevent overflow
                  whiteSpace: 'nowrap', // Ensure columns line up horizontally
                }}
              >
                <div
                  className={`flex gap-2 `}
                  style={{
                    width: `${cat.children.length * 200}px`, // 200px per column, adjust if needed
                  }}
                >
                  {cat.children.map((subCat, subIndex) => (
                    <div key={subIndex} className="min-w-[200px]">
                      <h4 className="text-[16px] font-semibold font-sans mb-2 text-gray-800">{subCat.name}</h4>
                      <ul className="space-y-1">
                        {subCat.children?.map((thirdCat, thirdIndex) => (
                          <li key={thirdIndex}>
                            <Link
                              href={`/category/${thirdCat.slug}`}
                              className="text-[16px] font-sans text-gray-600 hover:text-[#131e30] transition"
                            >
                              {thirdCat.name}
                            </Link>
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

