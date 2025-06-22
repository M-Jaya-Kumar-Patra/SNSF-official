This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.











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
    <nav className="sticky top-[-90px] z-[100] w-full">
      <div className="max-w-[2560px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between bg-gradient-to-l from-[#798ca8] via-[#334257] to-[#131e30]">
        <div className="flex gap-0 items-center">
          <Image className="w-16 h-16 rounded-full" src="/images/logo.png" alt="Logo" width={64} height={64} priority />
          <Image src="/images/snsf-text.png" alt="SNSF" height={64} width={173} className="ml-0" />
        </div>

        <div className="Search w-[30vw] border border-gray-500 h-[35px] px-1 flex items-center rounded-full">
          <Image className="mr-1 invert" src="/images/search.png" alt="Search" width={20} height={20} />
          <input type="text" placeholder="Search..." className="w-full bg-transparent outline-none font-sans" />
        </div>

        <div className="w-auto flex justify-between items-center gap-3">
          <IconButton aria-label="Home" onClick={() => router.push("/")}>
            <IoMdHome className="text-3xl text-white" />
          </IconButton>
          <IconButton aria-label="Call">
            <MdCall href="tel:+917847911696" className="text-3xl text-white" />
          </IconButton>
          <IconButton aria-label="Account" onClick={() => router.push(isLogin ? "/profile" : "/login")}>
            <Image
              className={`shrink-0 w-8 h-8 cursor-pointer rounded-full ${!isLogin ? "invert" : ""}`}
              src={userData?.avatar || "/images/account.png"}
              alt="Account"
              width={32}
              height={32}
            />
          </IconButton>
          <IconButton aria-label="Cart" onClick={() => router.push(isLogin ? "/cart" : "/login")}>
            <StyledBadge badgeContent={cartData?.length} color="secondary">
              <FaCartPlus className="text-3xl text-white" />
            </StyledBadge>
          </IconButton>
        </div>
      </div>

      <ul className="flex justify-around p-1 border border-b-slate-200 bg-white">
        {catData?.map((cat, index) => (
          <li key={index} className="relative group">
            <Link
              href={`/ProductListing?catId=${cat._id}`}
              className="text-[17px] font-semibold text-gray-700 hover:text-[#131e30] hover:border-b-2 hover:border-[#131e30] pb-1"
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
