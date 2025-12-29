"use client";

import React, { useEffect, useState } from "react";
import { Josefin_Sans } from "next/font/google";
import { useCat } from "@/app/context/CategoryContext";
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";
import Skeleton from "@mui/material/Skeleton";

const joSan = Josefin_Sans({ subsets: ["latin"], weight: "400" });

const Shopbycat = () => {
  const { catData } = useCat();
  const { isCheckingToken } = useAuth();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Ensure catData is sorted by `sln` (ascending)
  const sortedCatData = (catData || []).slice().sort((a, b) => a.sln - b.sln);

  const catLength = sortedCatData.length;
  const mid = catLength % 2 === 0 ? catLength / 2 : Math.ceil(catLength / 2);

  const upperRow = sortedCatData.slice(0, mid);
  const lowerRow = sortedCatData.slice(mid);

  const renderRow = (items, rowKey) =>
    items.map((cat, index) => (
      <a
        key={`${rowKey}-${index}`}
        href={`/ProductListing?catId=${cat._id}`}
        className="w-[65px] h-[65px] sm:w-[100px] sm:h-[100px] md:w-[110px] md:h-[110px] lg:w-[200px] lg:h-[200px] bg-white rounded-full p-1 shadow-gray-400 shadow-md flex justify-center items-center transition-transform hover:scale-110 hover:shadow-lg hover:shadow-gray-500"
      >
        {cat?.images?.[0]  ? (
          <Image
            src={cat.images[0] || "/images/placeholder.jpg"}
            width={100}
            height={100}
            className="rounded-full object-cover"
            alt="Category"
            priority
            unoptimized
          />
        ) : (
          <Skeleton
            variant="circular"
            animation="wave"
            width="100%"
            height="100%"
            sx={{ bgcolor: "rgba(203,213,225,0.5)" }}
          />
        )}
      </a>
    ));

  const renderSkeletonRow = (count, rowKey) =>
    Array.from({ length: count }).map((_, index) => (
      <div
        key={`${rowKey}-skeleton-${index}`}
        className="w-[65px] h-[65px] sm:w-[100px] sm:h-[100px] md:w-[110px] md:h-[110px]  bg-white rounded-full p-1 shadow-gray-400 shadow-md flex justify-center items-center"
      >
        <Skeleton
          variant="circular"
          animation="wave"
          width="100%"
          height="100%"
          sx={{ bgcolor: "rgba(203,213,225,0.5)" }}
        />
      </div>
    ));

  return (
    <div className="flex flex-col items-center w-full ">
      <h1
        className={`section-title`}
      >
        Shop by Category
      </h1>

      <div className="flex flex-col items-center justify-center w-full gap-4 mt-4 sm:mt-6 md:mt-8">
        {/* Top Row */}
        <div className="flex justify-center flex-wrap gap-2 sm:gap-5">
          {(isCheckingToken || !hydrated || catLength === 0)
            ? renderSkeletonRow(mid || 4, "upper")
            : renderRow(upperRow, "upper")}
        </div>

        {/* Bottom Row */}
        {lowerRow.length > 0 && (
          <div className="flex justify-center flex-wrap gap-2 sm:gap-5">
            {(isCheckingToken || !hydrated || catLength === 0)
              ? renderSkeletonRow(catLength - mid || 3, "lower")
              : renderRow(lowerRow, "lower")}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shopbycat;
