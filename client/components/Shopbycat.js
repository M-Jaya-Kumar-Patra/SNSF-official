"use client";

import React, { useEffect, useState } from "react";
import { Josefin_Sans } from "next/font/google";
import { useCat } from "@/app/context/CategoryContext";
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";
import Skeleton from "@mui/material/Skeleton";
import Loading from "./Loading";

const joSan = Josefin_Sans({ subsets: ["latin"], weight: "400" });

const Shopbycat = () => {
  const { catData } = useCat();
  const { isCheckingToken } = useAuth();
  const [hydrated, setHydrated] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    if (!catData) {
      setLocalLoading(true);
    } else {
      setLocalLoading(false);
    }

    setHydrated(true);
  }, [catData]);

  const catLength = catData?.length || 0;

  // Midpoint logic for zigzag
  const mid =
    catLength % 2 === 0 ? catLength / 2 : Math.ceil(catLength / 2);

  const upperRow = catData?.slice(0, mid) || [];
  const lowerRow = catData?.slice(mid, catLength) || [];


  const renderRow = (items, rowKey) =>
    items.map((cat, index) => (
      <a
        key={`${rowKey}-${index}`}
        href={`/ProductListing?catId=${cat._id}`}
        className="w-[65px] h-[65px] sm:w-[100px] sm:h-[100px] bg-white rounded-full p-1  shadow-gray-400 shadow-md flex justify-center items-center transition-transform hover:scale-110 hover:shadow-lg hover:shadow-gray-500"
      >
        {cat?.images?.[0] ? (
          <Image
            src={cat.images[0]}
            width={100}
            height={100}
            className="rounded-full object-cover"
            alt="Category"
            priority
          />
        ) : (
          <Skeleton
            variant="circular"
            animation="wave"
            width="100%"
          height='100%'
            sx={{ bgcolor: "rgba(203,213,225,0.5)" }}
          />
        )}
      </a>
    ));

  const renderSkeletonRow = (count, rowKey) =>
    Array.from({ length: count }).map((_, index) => (
      <div
        key={`${rowKey}-skeleton-${index}`}
        className="w-[65px] h-[65px] sm:w-[100px] sm:h-[100px] bg-white rounded-full p-1  shadow-gray-400 shadow-md flex justify-center items-center"
      >
        <Skeleton
          variant="circular"
          animation="wave"
          width="100%"
          height='100%'
          sx={{ bgcolor: "rgba(203,213,225,0.5)" }}
        />
      </div>
    ));

  return (
    <div className="flex flex-col items-center bg-slate-100 w-full pb-4 sm:pb-8">
      <h1
        className={`text-2xl sm:text-3xl font-bold text-black mt-4 sm:mt-8 mb-4 sm:mb-8 ${joSan.className}`}
      >
        Shop by Category
      </h1>

      <div className="flex flex-col items-center justify-center w-full gap-4">
        {/* Top Row */}
        <div className="flex justify-center flex-wrap gap-2 sm:gap-5">
          {(localLoading || isCheckingToken || !hydrated )
            ? renderSkeletonRow(mid || 4, "upper")
            : renderRow(upperRow, "upper")}
        </div>

        {/* Bottom Row */}
        {
        // lowerRow.length > 0 &&
         (
          <div className="flex justify-center flex-wrap gap-2 sm:gap-5">
            {(localLoading || isCheckingToken || !hydrated )
              ? renderSkeletonRow(catLength - mid||3, "lower")
              : renderRow(lowerRow, "lower")}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shopbycat;
