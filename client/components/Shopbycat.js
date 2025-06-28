"use client";

import React, { useEffect, useState } from "react";
import { Josefin_Sans } from "next/font/google";
import { useCat } from "@/app/context/CategoryContext";
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";
import Loading from "./Loading";


const joSan = Josefin_Sans({ subsets: ["latin"], weight: "400" });

const Shopbycat = () => {
  const { catData } = useCat();
  const { isCheckingToken } = useAuth(); // ✅ protect from premature render
  const [hydrated, setHydrated] = useState(false);
    const [localLoading, setLocalLoading] = useState(false);
    

  useEffect(() => {
    if(!catData){
      setLocalLoading(false)
    }
    
    setHydrated(true);
  }, []);

  const catLength = catData?.length || 0;

  if (!hydrated || isCheckingToken || localLoading) return <Loading/>;
  

  return (
    <div className=" flex flex-col items-center bg-slate-100 w-full pb-4 sm:pb-8">
      <h1
        className={`text-2xl sm:text-3xl font-bold text-black mt-4 sm:mt-8 mb-4 sm:mb-8 ${joSan.className}`}
      >
        Shop by Category
      </h1>

      <div className="flex flex-col items-center justify-center w-full">
        <div className="grid grid-cols-4 gap-2 sm:gap-5 justify-center items-center place-items-center">
          {catData?.slice(0, Math.ceil(catLength / 2)).map((cat, index) => (
            <a
              key={index}
              href={`/ProductListing?catId=${cat._id}`}
              className="w-[65px] h-[65px] sm:w-[100px] sm:h-[100px] bg-white rounded-full p-1 sm:p-2 shadow-gray-400 shadow-md flex justify-center items-center transition-transform hover:scale-110 hover:shadow-lg hover:shadow-gray-500"
            >
              {cat?.images?.[0] && (
                <Image
                  src={cat.images[0]}
                  width={100}
                  height={100}
                  className="rounded-full object-cover"
                  alt="Category"
                />
              )}
            </a>
          ))}
        </div>

        <div className="mt-2 sm:mt-3 grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-2 sm:gap-5 justify-center items-center place-items-center">
          {catData?.slice(Math.ceil(catLength / 2), catLength).map((cat, index) => (
            <a
              key={index}
              href={`/ProductListing?catId=${cat._id}`}
              className="w-[65px] h-[65px] sm:w-[100px] sm:h-[100px] bg-white rounded-full p-2 shadow-gray-400 shadow-md flex justify-center items-center transition-transform hover:scale-110 hover:shadow-lg hover:shadow-gray-500"
            >
              {cat?.images?.[0] && (
                <Image
                  src={cat.images[0]}
                  width={100}
                  height={100}
                  className="rounded-full object-cover"
                  alt="Category"
                />
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shopbycat;
