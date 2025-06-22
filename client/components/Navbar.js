

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
  const { productsData, setProductsData } = usePrd();
  const { setLoading } = useAuth(); // ✅ Added for loader
  const router = useRouter();
  const { userData, isLogin } = useAuth();
  const { cartData } = useCart();

  const getCat = (e, catId) => {
    setLoading(true); // ✅ start loading
    fetchDataFromApi(`/api/product/gapsByCatId?Id=${catId}`)
      .then((res) => {
        if (!res.error) {
          setProductsData(res?.data);
        } else {
          throw new Error("Error fetching category");
        }
      })
      .finally(() => setLoading(false)); // ✅ stop loading
  };

  const getSubCat = (e, subCatId) => {
    setLoading(true);
    fetchDataFromApi(`/api/product/gapsBySubCatId?Id=${subCatId}`)
      .then((res) => {
        if (!res.error) {
          setProductsData(res?.data);
        } else {
          throw new Error("Error fetching subcategory");
        }
      })
      .finally(() => setLoading(false));
  };

  const getThirdCat = (e, thirdSubCatIdId) => {
    setLoading(true);
    fetchDataFromApi(`/api/product/gapsByThirdCatId?thirdSubCatId=${thirdSubCatIdId}`)
      .then((res) => {
        if (!res.error) {
          setProductsData(res?.data);
        } else {
          throw new Error("Error fetching third subcategory");
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <nav className=" sticky top-[-90px]   z-[100] bg-gradient-to-r from-indigo-950 via-indigo-900 to-[#1e40af]  text-white border-t border-[#1e293b] shadow-md">

      {/* bg-gradient-to-l from-blue-600 to-indigo-800 
      
      
      bg-gradient-to-l from-[#798ca8] via-[#334257] to-[#131e30]
      
      
      */}

      {/* //  <header className="bg-gradient-to-r from-[#1c2044] to-[#5c37a7]  text-white border-t border-[#1e293b] shadow-md"> */}
      <div className="max-w-full mx-auto px-6 py-2 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-1 flex-shrink-0 w-auto">
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


        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="max-w-md w-full mr-2">
            <div className="flex items-center bg-transparent border border-slate-400 rounded-md px-2  py-1 shadow-inner">
              <Image
                src="/images/search.png"
                alt="Search"
                width={18}
                height={18}
                className="invert mr-2"
              />
              <input
                type="text"
                placeholder="Search products..."
                className="flex-grow bg-transparent outline-none text-sm text-white placeholder-slate-400"
              />
            </div>
          </div>


          {/* Actions */}
          <IconButton aria-label="Home" onClick={() => router.push("/")}>
            <IoMdHome className="text-3xl text-white" />
          </IconButton>
          <IconButton aria-label="Call" onClick={() => window.location.href = 'tel:+917847911696'}>
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

      <ul className="flex justify-around pb-1 border border-b-slate-200 bg-white">
        {catData?.map((cat, index) => (
          <li key={index} className="relative group">
            <Link
              href={`/ProductListing?catId=${cat._id}`}
              className="text-[15px]  text-gray-700 hover:text-[#131e30] hover:border-b-2 hover:border-[#131e30] pb-1"
            >
              {cat.name}
            </Link>

            {cat.children?.length > 0 && (
              <div
                className={`absolute top-full mt-4 ${index > catData.length - 3 ? "right-0" : "left-0"} bg-white shadow-xl px-6 py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[300] overflow-auto scrollbar-hide`}
                style={{ maxWidth: "100vw", whiteSpace: "nowrap" }}
              >
                <div className="flex gap-2" style={{ width: `${cat.children.length * 200}px` }}>
                  {cat.children.map((subCat, subIndex) => (
                    <div key={subIndex} className="min-w-[200px]">
                      <Link href={`/ProductListing?subCatId=${subCat._id}`}>
                        <h4 className="text-[16px] font-semibold mb-2 text-gray-800">{subCat.name}</h4>
                      </Link>
                      <ul className="space-y-1">
                        {subCat.children?.map((thirdSubCatId, thirdIndex) => (
                          <li key={thirdIndex}>
                            <Link
                              href={`/ProductListing?thirdSubCatId=${thirdSubCatId._id}`}
                              className="text-[16px] text-gray-600 hover:text-[#131e30] transition"
                            >
                              {thirdSubCatId.name}
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
