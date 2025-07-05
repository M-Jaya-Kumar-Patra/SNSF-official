"use client";

import React, { useRef, useEffect, useState } from "react";
import { Josefin_Sans } from "next/font/google";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePrd } from "@/app/context/ProductContext";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";
import Loading from "./Loading";
import WhatsappIcon from "@/components/WhatsappIcon";
import { IoCall } from "react-icons/io5";


const joSan = Josefin_Sans({ subsets: ["latin"], weight: "400" });

const New = () => {
  const { prdData } = usePrd();
  const { setLoading, isCheckingToken } = useAuth(); // ✅ use isCheckingToken
  const scrollRef = useRef(null);
  const router = useRouter();
          const [localLoading, setLocalLoading] = useState(false);
  

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if(!prdData){
            setLocalLoading(false)
        }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || isCheckingToken) return;

    if (Array.isArray(prdData)) {
      setLoading(false); // finished loading
    }
  }, [prdData, hydrated, isCheckingToken, setLoading]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Optional early return while waiting
  if (!hydrated || isCheckingToken || localLoading) return <Loading/>;
  

  return (
    <div className="flex flex-col items-center mt-3 pb-5 sm:pb-8 bg-slate-100 w-full">
      <h1 className={`text-2xl sm:text-3xl font-bold text-black mt-4 mb-4 sm:mt-8 sm:mb-8 ${joSan.className}`}>
        New Arrivals
      </h1>

      <div className="relative w-full max-w-[1100px] mx-auto px-4">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10  bg-white/60 hover:bg-white text-gray-800 p-1 rounded-full   bg-opacity-90     
          
              sm:p-2  shadow transition text-base sm:text-xl"
          
        >
          <ChevronLeft />
        </button>

      <div
  ref={scrollRef}
  className="overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-hide py-5"
>
  <div className="inline-flex gap-4 overflow-x-auto py-4 px-2">
  {Array.isArray(prdData) && prdData.length > 0 ? (
    [...prdData]
      .sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated)) // Newest first
      .slice(0, 10) // Limit to 10
      .map((prd, index) => (
        <div
          key={index}
          className="min-w-[256px] max-w-[256px] p-2 bg-white shadow-md flex flex-col items-center justify-start gap-3 transition-transform duration-300 group rounded-lg"
        >
          {/* Maintain 4:3 aspect ratio */}
          <div
            className="w-full relative rounded-md overflow-hidden cursor-pointer"
            style={{ aspectRatio: '4 / 3' }}
            onClick={() => router.push(`/product/${prd?._id}`)}
          >
            <Image
              src={prd?.images?.[0] || '/placeholder.png'}
              alt={prd?.name || 'Product Image'}
              fill
              className="object-cover"
            />
          </div>

          <div
            className="flex flex-col items-center text-center gap-1 px-2 cursor-pointer"
            onClick={() => router.push(`/product/${prd?._id}`)}
          >
            <h2 className="text-sm font-semibold text-gray-800 truncate w-full">
              {prd?.name || 'Unnamed Product'}
            </h2>
          </div>
        </div>
      ))
  ) : (
    <p className="text-gray-500 text-sm">No products available</p>
  )}
</div>

</div>


        <button
          onClick={() => scroll("right")}
          className="absolute right-0  bg-white   bg-opacity-90 
          
         top-1/2 -translate-y-1/2 z-10 bg-white/60 hover:bg-white text-gray-800 p-1 sm:p-2 rounded-full shadow transition text-base sm:text-xl"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default New;
