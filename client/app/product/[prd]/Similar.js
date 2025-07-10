"use client";

import React, { useRef, useEffect, useState } from "react";
import { Josefin_Sans } from "next/font/google";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";
import Skeleton from "@mui/material/Skeleton";
import { fetchDataFromApi } from "@/utils/api";

const joSan = Josefin_Sans({ subsets: ["latin"], weight: "400" });

const Similar = (props) => {
  const { prdId, hideArrows } = props;
  const scrollRef = useRef(null);
  const router = useRouter();
  const { isCheckingToken } = useAuth();

  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Scroll position state to enable/disable arrows
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  // Fetch similar products when prdId changes
  useEffect(() => {
    if (!prdId) {
      setSimilarProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchDataFromApi(`/api/user/getCategoriesByProductId?productId=${prdId}`, false)
      .then((res) => {
        // Assuming your API returns products in res.products, fallback to empty array
        setSimilarProducts(res?.products || []);
      })
      .catch((err) => {
        console.error("Error fetching similar products:", err);
        setSimilarProducts([]);
      })
      .finally(() => setLoading(false));
  }, [prdId]);

  // Scroll handler
  const scroll = (direction) => {
    if (!scrollRef.current) return;

    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollAmount = clientWidth * 0.8;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  // Check scroll position to toggle arrow button disable state
  const checkScrollLimits = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setIsAtStart(scrollLeft <= 0);
    setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 5);
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    checkScrollLimits();
    container.addEventListener("scroll", checkScrollLimits);

    return () => container.removeEventListener("scroll", checkScrollLimits);
  }, [similarProducts]);

  const getOptimizedCloudinaryUrl = (url) => {
    if (!url?.includes("res.cloudinary.com")) return url;
    return url.replace("/upload/", "/upload/w_800,h_800,c_fit,f_auto,q_90/");
  };

  return (
    <div className="flex flex-col items-center mt-3 pb-5 sm:pb-8 bg-slate-100 w-full">
      <h1 className={`text-2xl sm:text-3xl font-bold text-black mt-4 mb-4 sm:mt-8 sm:mb-8 ${joSan.className}`}>
        Similar Products
      </h1>

      <div className="relative w-full max-w-[1100px] mx-auto px-4">
        {/* Left Arrow */}
        {!hideArrows && (
          <>
          
          
          <button
            onClick={() => scroll("left")}
            disabled={isAtStart}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 sm:p-2 rounded-full shadow transition text-base sm:text-xl ${isAtStart
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-white/60 hover:bg-white text-gray-800"
              }`}
            aria-label="Scroll Left"
          >
            <ChevronLeft />
          </button>

        <div
          ref={scrollRef}
          className="overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-hide py-5"
        >
          <div className="inline-flex gap-4 py-4 px-2">
            {(loading || isCheckingToken) ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="min-w-[256px] max-w-[256px] p-2 bg-white shadow-md flex flex-col items-center justify-start gap-3"
                >
                  {/* Skeleton image */}
                  <div className="w-full relative rounded-md overflow-hidden" style={{ aspectRatio: "4 / 3" }}>
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      width="100%"
                      height="100%"
                      sx={{ bgcolor: "rgba(203,213,225,0.5)", borderRadius: "8px" }}
                    />
                  </div>
                  {/* Skeleton text */}
                  <Skeleton
                    variant="text"
                    animation="wave"
                    width="80%"
                    height={20}
                    sx={{ bgcolor: "rgba(203,213,225,0.5)", borderRadius: "4px" }}
                  />
                </div>
              ))
            ) : similarProducts.length > 0 ? (
              similarProducts
                .filter(prd => prd._id !== prdId) // exclude current product
                .slice(0, 10)
                .map((prd, index) => (
                  <div
                    key={prd._id || index}
                    className="min-w-[256px] max-w-[256px] p-2 bg-white shadow-md flex flex-col items-center justify-start gap-3 transition-transform duration-300 group hover:scale-105 cursor-pointer"
                    onClick={() => router.push(`/product/${prd._id}`)}
                  >
                    <div className="w-full relative rounded-md overflow-hidden" style={{ aspectRatio: "4 / 3" }}>
                      <Image
                        src={getOptimizedCloudinaryUrl(prd.images?.[0] || "/images/placeholder.png")}
                        alt={prd.name || "Product Image"}
                        fill
                        sizes="(max-width: 768px) 100vw, 256px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="w-full flex flex-col items-center text-center gap-1 px-2">
                      <h2 className="text-sm font-semibold text-gray-800 truncate w-full">{prd.name || "Unnamed Product"}</h2>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-gray-500 text-sm">No similar products found.</p>
            )}

          </div>
        </div>

          <button
            onClick={() => scroll("right")}
            disabled={isAtEnd}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 sm:p-2 rounded-full shadow transition text-base sm:text-xl ${isAtEnd
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-white/60 hover:bg-white text-gray-800"
              }`}
            aria-label="Scroll Right"
          >
            <ChevronRight />
          </button>

          </>
        )}
        
      </div>
    </div>
  );
};

export default Similar;
