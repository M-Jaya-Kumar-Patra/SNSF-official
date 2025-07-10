"use client";

import React, { useState, useEffect } from "react";
import { Josefin_Sans } from "next/font/google";
import { usePrd } from "@/app/context/ProductContext";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import { useAlert } from "@/app/context/AlertContext";
import { useItem } from "@/app/context/ItemContext";
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";
import Loading from "./Loading";
import WhatsappIcon from "@/components/WhatsappIcon";
import { IoCall } from "react-icons/io5";
import Skeleton from "@mui/material/Skeleton";



const joSan = Josefin_Sans({ subsets: ["latin"], weight: "400" });

const Bestsellers = () => {
    const { prdData } = usePrd();
    const router = useRouter();
    const alert = useAlert();
    const { item, setItem } = useItem();
    const { userData, setUserData, isLogin, setLoading, isCheckingToken } = useAuth();
    const [localLoading, setLocalLoading] = useState(false);


    const [quantity] = useState(1);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        if (!prdData) {
            setLocalLoading(false)
        }
        setHydrated(true);
    }, []);
    const getOptimizedCloudinaryUrl = (url) => {
    if (!url?.includes("res.cloudinary.com")) return url;
    return url.replace("/upload/", "/upload/w_800,h_800,c_fill,f_auto,q_90/");
  };




    return (
        <div className="flex flex-col items-center mt-2 sm:mt-5 w-full pb-4 sm:pb-8">
            <h1
                className={`text-2xl sm:text-3xl font-bold text-black mt-4 mb-4 sm:mt-8 sm:mb-8 ${joSan.className}`}
            >
                Best Sellers
            </h1>

            <div className="flex justify-center items-center">
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 place-items-center gap-5 mb-5">
                    {prdData && prdData.filter((prd) => prd?.isFeatured).length > 0 ? (
  prdData
    .filter((prd) => prd?.isFeatured)
    .reverse()
    .slice(0, 6)
    .map((prd, index) => (
      <div
        key={prd?._id || index}
        className="group w-[290px] sm:w-[290px] bg-white h-auto flex flex-col justify-between p-2 border hover:shadow-lg transition-transform duration-300 hover:scale-[1.03]"
      >
        <div
          className="w-full cursor-pointer"
          onClick={() => router.push(`/product/${prd?._id}`)}
        >
          <div className="w-full aspect-[4/3] relative overflow-hidden rounded-md">
            <Image
              src={getOptimizedCloudinaryUrl(prd?.images?.[0] || "/images/placeholder.png")}
              alt={prd?.name}
              fill
              className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              priority
            />
          </div>

          <div className="mt-3 text-center">
            <h2 className="text-black text-base font-semibold truncate">{prd?.name}</h2>
            <p className="text-gray-500 text-sm mt-1 truncate">{prd?.brand}</p>
          </div>
        </div>
      </div>
    ))
) : (localLoading || isCheckingToken || !prdData || !hydrated ) ? (
  Array.from({ length: 6 }).map((_, index) => (
    <div
      key={index}
      className="w-[290px] sm:w-[290px] bg-white h-auto flex flex-col justify-between p-2 border shadow-sm "
    >
      {/* Skeleton Image */}
      <div className="w-full aspect-[4/3] relative overflow-hidden rounded-md">
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
            borderRadius: "8px",
            bgcolor: "rgba(203,213,225,0.5)",
          }}
        />
      </div>

      {/* Skeleton Text */}
      <div className="mt-3 text-center">
        <Skeleton
          variant="text"
          animation="wave"
          width="80%"
          height={20}
          sx={{
            mx: "auto",
            bgcolor: "rgba(203,213,225,0.5)",
            borderRadius: "4px",
          }}
        />
        <Skeleton
          variant="text"
          animation="wave"
          width="60%"
          height={16}
          sx={{
            mt: 1,
            mx: "auto",
            bgcolor: "rgba(203,213,225,0.5)",
            borderRadius: "4px",
          }}
        />
      </div>
    </div>
  ))
) : (
  <p className="text-gray-500 text-sm col-span-full text-center">
    No featured products found
  </p>
)}

                </div>
            </div>

            <Button
                variant="contained"
                className="!bg-blue-900 hover:!bg-blue-950 text-white rounded-md px-6 py-2"
                onClick={() => {
                    router.push("/BestSellersList");
                }}
            >
                Explore Now
            </Button>
        </div>
    );
};

export default Bestsellers;
