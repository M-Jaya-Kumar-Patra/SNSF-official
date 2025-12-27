"use client";

import React, { useRef, useEffect, useState } from "react";
import { Josefin_Sans } from "next/font/google";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";
import Skeleton from "@mui/material/Skeleton";
import { fetchDataFromApi } from "@/utils/api";

const joSan = Josefin_Sans({ subsets: ["latin"], weight: "400" });

const Suggestions = ({ productId, catId, subCatId, thirdSubCatId, brand }) => {
  const { setLoading, isCheckingToken } = useAuth();
  const scrollRef = useRef(null);
  const router = useRouter();

  const [data, setData] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);

  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const loadSuggestions = async () => {
    try {
      const query = `productId=${productId}&catId=${catId}&subCatId=${subCatId}&thirdSubCatId=${thirdSubCatId}&brand=${brand}&limit=12`;

      const res = await fetchDataFromApi(`/api/product/suggestions?${query}`, false);

      if (!res.error) {
        setData(res.data || []);
      }
    } catch (err) {
      console.log("Suggestions fetch error:", err);
    } finally {
      setLocalLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuggestions();
  }, [productId]);

  useEffect(() => {
    if (!hydrated || isCheckingToken) return;

    if (Array.isArray(data)) {
      setLoading(false);
    }
  }, [data, hydrated, isCheckingToken]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    checkScrollLimits();

    container.addEventListener("scroll", checkScrollLimits);
    return () => container.removeEventListener("scroll", checkScrollLimits);
  }, []);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;

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

  const cloud = (url) =>
    url?.includes("res.cloudinary.com")
      ? url.replace("/upload/", "/upload/w_800,h_800,c_fit,f_auto,q_90/")
      : url;

  return (
    <div className="flex flex-col items-center mt-3 pb-5 bg-slate-100 w-full">
      <h1 className={`text-2xl sm:text-3xl font-bold text-black mt-4 mb-4 sm:mt-8 sm:mb-8 ${joSan.className}`}>
        Similar Products
      </h1>

      <div className="relative w-full max-w-[1100px] mx-auto px-4">
        <button
          onClick={() => scroll("left")}
          disabled={isAtStart}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 sm:p-2 rounded-full shadow transition ${
            isAtStart ? "bg-gray-300" : "bg-white/60 hover:bg-white"
          }`}
        >
          <ChevronLeft />
        </button>

        <div ref={scrollRef} className="overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-hide py-5">
          <div className="inline-flex gap-4 py-4 px-2">
            {Array.isArray(data) && data.length > 0 ? (
              data.map((prd, i) => (
                <div
                  key={i}
                  className="min-w-[256px] max-w-[256px] p-2 bg-white shadow-md flex flex-col items-center gap-3 hover:scale-105 transition"
                >
                  <div
                    className="w-full relative rounded-md overflow-hidden cursor-pointer"
                    style={{ aspectRatio: "4 / 3" }}
                    onClick={() => router.push(`/product/${prd?._id}`)}
                  >
                    <Image
                      src={cloud(prd?.images?.[0]) || "/images/placeholder.jpg"}
                      alt="Product"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  <h2
                    className="text-sm w-full font-medium text-gray-800 text-center cursor-pointer px-2 truncate"
                    onClick={() => router.push(`/product/${prd?._id}`)}
                  >
                    {prd?.name}
                  </h2>
                </div>
              ))
            ) : localLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="min-w-[256px] max-w-[256px] p-2 bg-white shadow-md flex flex-col items-center gap-3"
                >
                  <Skeleton variant="rectangular" width="100%" height={120} />
                  <Skeleton variant="text" width="80%" />
                </div>
              ))
            ) : (
              <p className="text-gray-500">No suggestions found</p>
            )}
          </div>
        </div>

        <button
          onClick={() => scroll("right")}
          disabled={isAtEnd}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 sm:p-2 rounded-full shadow ${
            isAtEnd ? "bg-gray-300" : "bg-white/60 hover:bg-white"
          }`}
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Suggestions;
