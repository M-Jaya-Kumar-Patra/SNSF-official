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
import Skeleton from "@mui/material/Skeleton";


const joSan = Josefin_Sans({ subsets: ["latin"], weight: "400" });

const New = () => {
  const { prdData } = usePrd();
  const { setLoading, isCheckingToken } = useAuth(); // ✅ use isCheckingToken
  const scrollRef = useRef(null);
  const router = useRouter();
  const [localLoading, setLocalLoading] = useState(false);


  const [hydrated, setHydrated] = useState(false);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  useEffect(() => {
    if (!prdData) {
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

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    checkScrollLimits(); // Check on mount

    container.addEventListener("scroll", checkScrollLimits);
    return () => container.removeEventListener("scroll", checkScrollLimits);
  }, []);


  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollLeft, clientWidth } = container;
    const scrollAmount = clientWidth * 0.8;

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };


  const checkScrollLimits = () => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;

    setIsAtStart(scrollLeft <= 0);
    setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 5);
  };




  return (
    <div className="flex flex-col items-center mt-3 pb-5 sm:pb-8 bg-slate-100 w-full">
      <h1 className={`text-2xl sm:text-3xl font-bold text-black mt-4 mb-4 sm:mt-8 sm:mb-8 ${joSan.className}`}>
        New Arrivals
      </h1>

      <div className="relative w-full max-w-[1100px] mx-auto px-4">
        <button
          onClick={() => scroll("left")}
          disabled={isAtStart}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 sm:p-2 rounded-full shadow transition text-base sm:text-xl ${isAtStart ? "bg-gray-300 cursor-not-allowed" : "bg-white/60 hover:bg-white text-gray-800"
            }`}
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
                .sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated))
                .slice(0, 10)
                .map((prd, index) => (
                  <div
                    key={index}
                    className="min-w-[256px] max-w-[256px] p-2 bg-white shadow-md flex flex-col items-center justify-start gap-3 transition-transform duration-300 group hover:scale-105    "
                  >
                    {/* Image */}
                    <div
                      className="w-full relative rounded-md overflow-hidden cursor-pointer"
                      style={{ aspectRatio: '4 / 3' }}
                      onClick={() => router.push(`/product/${prd?._id}`)}
                    >
                      <Image
                        src={prd?.images?.[0] || '/placeholder.png'}
                        alt={prd?.name || 'Product Image'}
                        fill
                        sizes="(max-width: 768px) 100vw, 256px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* Title */}
                    <div
                      className="w-full flex flex-col items-center text-center gap-1 px-2 cursor-pointer"
                      onClick={() => router.push(`/product/${prd?._id}`)}
                    >
                      <h2 className="text-sm font-semibold text-gray-800 truncate w-full">
                        {prd?.name || 'Unnamed Product'}
                      </h2>
                    </div>
                  </div>
                ))
            ) : (localLoading || isCheckingToken || !prdData || !hydrated) ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="min-w-[256px] max-w-[256px] p-2 bg-white shadow-md flex flex-col items-center justify-start gap-3 "
                >
                  {/* Skeleton Image */}
                  <div
                    className="w-full relative rounded-md overflow-hidden"
                    style={{ aspectRatio: '4 / 3' }}
                  >
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      width="100%"
                      height="100%"
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        height: "100%",
                        width: "100%",
                        borderRadius: "8px",
                        bgcolor: 'rgba(203,213,225,0.5)', // match slate-100 tone
                      }}
                    />
                  </div>

                  {/* Skeleton Title */}
                  <Skeleton
                    variant="text"
                    animation="wave"
                    width="80%"
                    height={20}
                    sx={{ bgcolor: 'rgba(203,213,225,0.5)', borderRadius: '4px' }}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No products available</p>
            )}


          </div>

        </div>


        <button
          onClick={() => scroll("right")}
          disabled={isAtEnd}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 sm:p-2 rounded-full shadow transition text-base sm:text-xl ${isAtEnd ? "bg-gray-300 cursor-not-allowed" : "bg-white/60 hover:bg-white text-gray-800"
            }`}
        >
          <ChevronRight />
        </button>


      </div>
    </div>
  );
};

export default New;
