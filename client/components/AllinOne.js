"use client";

import React, { useState, useEffect } from "react";
import { Josefin_Sans } from "next/font/google";
import { usePrd } from "@/app/context/ProductContext";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";
import Loading from "./Loading";
import Skeleton from "@mui/material/Skeleton";

const joSan = Josefin_Sans({ subsets: ["latin"], weight: "400" });

const AllinOne = () => {
  const { prdData } = usePrd();
  const router = useRouter();
  const { isCheckingToken } = useAuth();
  const [hydrated, setHydrated] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const filteredProducts = prdData
    ?.filter((prd) => prd?.isAllinOne)
    .slice(0, 20);


  return (
   <div className="flex flex-col items-center mt-2 sm:mt-5 w-full pb-4 sm:pb-8 bg-gradient-to-b from-slate-200 to-white">
            <h1
                className={`text-2xl sm:text-3xl font-bold text-black mt-4 mb-4 sm:mt-8 sm:mb-8 ${joSan.className}`}
            >
                Explore All in One
            </h1>
        

      <div className="relative w-full max-w-[1100px] mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-5">
          {filteredProducts && filteredProducts.length > 0 ? (
  filteredProducts.map((prd, index) => (
    <div
      key={prd?._id || index}
      className="group bg-white border p-1 sm:p-2 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div
        onClick={() => router.push(`/product/${prd._id}`)}
        className="cursor-pointer"
      >
        <div className="relative aspect-[4/3] rounded-md overflow-hidden">
          <Image
            src={prd.images?.[0] || "/images/placeholder.png"}
            alt={prd.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority
          />
        </div>

        <div className="mt-3 text-center">
          <h2 className="text-black text-base font-medium truncate">
            {prd.name}
          </h2>
        </div>
      </div>
    </div>
  ))
) : (!hydrated || localLoading || isCheckingToken || !filteredProducts) ? (
  Array.from({ length: 8 }).map((_, index) => (
    <div
      key={index}
      className="bg-white border p-1 sm:p-2 shadow-sm "
    >
      <div className="relative aspect-[4/3] rounded-md overflow-hidden">
        <Skeleton
          variant="rectangular"
          animation="wave"
          width="100%"
          height="100%"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(203,213,225,0.5)", // slate-colored
            borderRadius: "8px",
          }}
        />
      </div>
      <Skeleton
        variant="text"
        animation="wave"
        width="80%"
        height={20}
        sx={{
          mt: 2,
          mx: "auto",
          bgcolor: "rgba(203,213,225,0.5)",
          borderRadius: "4px",
        }}
      />
    </div>
  ))
) : (
  <p className="text-gray-500 text-sm col-span-full text-center">
    No products found
  </p>
)}

        </div>
      </div>

    </div>
  );
};

export default AllinOne;
