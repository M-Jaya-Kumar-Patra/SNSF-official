"use client";

import React, { useRef, useState, useEffect } from "react";
import { Josefin_Sans } from "next/font/google";

import Image from "next/image";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import { fetchDataFromApi } from "@/utils/api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { useScreen } from "@/app/context/ScreenWidthContext";
import ProductGrid from "./ProductGrid";
import { IoArrowForwardCircle } from "react-icons/io5";





const joSan = Josefin_Sans({ subsets: ["latin"], weight: "400" });

const Bestsellers = ({ posterIndex }) => {
  const router = useRouter();
  const scrollRef = useRef(null);
  const { setLoading, isCheckingToken } = useAuth(); // ✅ use isCheckingToken
  const { isXs } = useScreen();

  const [data, setData] = useState([]);
  const [poster, setPoster] = useState([]);

  const [hydrated, setHydrated] = useState(false);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const limit = isXs ? 7 : 11;

  useEffect(() => {
    setHydrated(true);
  }, []);

  const loadCustomerFavorites = async () => {
    try {
      const res = await fetchDataFromApi(
        "/api/home-sections?sectionName=bestsellers",
        false
      );

      if (!res.error) setData(res?.data || []);
    } catch (err) {
      console.log("Best sellers fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadPoster = async () => {
    try {
      const res = await fetchDataFromApi("/api/poster/getAll", false);

      if (!res.error) setPoster(res?.data[posterIndex]);
    } catch (err) {
      console.log("Best sellers fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomerFavorites();
    loadPoster();
  }, []);

  const getOptimizedCloudinaryUrl = (url) => {
    if (!url?.includes("res.cloudinary.com")) return url;
    return url.replace("/upload/", "/upload/w_800,h_800,c_fit,f_auto,q_90/");
  };

  const productsForGrid = Array.isArray(data)
    ? data
        .slice(0, limit + 1)
        .filter((prd) => prd?.enabled && prd?.product)
        .map((prd) => ({
          id: prd.product._id,
          image: getOptimizedCloudinaryUrl(
            prd.product.images?.[0] || "/placeholder.jpg"
          ),
          title: prd.product.name,
        }))
    : [];

  return (
    <div
  className="
    w-full max-w-[1600px]
    flex flex-col lg:flex-row
    gap-6 lg:gap-0
  "
>

      {/* ================= LEFT : Customer Favorites LIST ================= */}
      <div
        className="
          w-full lg:w-[calc(100%-327px)]
          bg-white
          p-3 sm:p-6 pb-1 sm:pb-0
          border
          lg:border-r-0
          rounded-lg lg:rounded-r-none
          lg:my-4

          
        "
      >
        <div className="flex justify-between items-center">
          <h1 className="section-title">Customer Favorites</h1>

          <button
            onClick={() => router.push("/BestSellersList")}
            className="
      flex items-center gap-2
      sm:px-3 
      rounded-full
      sm:text-slate-500
      sm:hover:text-slate-900
      text-slate-900

      transition-all duration-300
      group
    "
          >
            {/* Text → hidden on mobile */}
            <span className="hidden sm:inline text-sm font-medium ">
              View more
            </span>

           <IoArrowForwardCircle className="!section-heading w-5 h-5 " />
          </button>
        </div>

        <div className="relative w-full mt-3 sm:mt-4">
          <div
            ref={scrollRef}
            className="
    overflow-y-auto 
    sm:overflow-y-hidden

    sm:overflow-x-auto
    scroll-smooth
    scrollbar-hide
    pb-2 sm:pb-4

  "
          >
            {productsForGrid.length > 0 ? (
              <ProductGrid products={productsForGrid} row={2} />
            ) : (
              /* ===== GRID SKELETON ===== */
              <div
                className="
        grid gap-4 sm:gap-6
        grid-rows-2
        grid-flow-col
        auto-cols-max
        pb-2
      "
              >
                {Array.from({ length: limit+1 }).map((_, i) => (
                  <div
                    key={i}
                    className="
            w-[120px] sm:w-[220px]
            bg-white
            rounded-xl
            border
            shadow-sm
            overflow-hidden
          "
                  >
                    {/* IMAGE */}
                    <div className="relative w-full aspect-[16/10]">
                      <Skeleton
                        variant="rectangular"
                        sx={{
                          width: "100%",
                          height: "100%",
                          bgcolor: "rgba(203,213,225,0.5)",
                        }}
                      />
                    </div>

                    {/* TITLE */}
                    <div className="p-2">
                      <Skeleton width="90%" height={16} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= RIGHT : POSTER ================= */}
       <div
                className="
      
              hidden lg:block
                w-full lg:w-[327px]
                relative
                overflow-hidden
                rounded-xl lg:rounded-l-none
                cursor-pointer
              "
                onClick={() => poster?.url && router.push(poster.url)}
              >
                {poster?.status ? (
                  <Image
                    src={getOptimizedCloudinaryUrl(poster?.image[0]) || "/images/placeholder.jpg"}
                    alt="Promotional Poster"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 30vw"
                    priority
                    unoptimized
                  />
                ) : (
                  <Skeleton
                    variant="rectangular"
                    sx={{
                      position: "absolute",
                      inset: 0,
                      height: "100%",
                      bgcolor: "rgba(203,213,225,0.5)",
                    }}
                  />
                )}
              </div>
    </div>
  );
};

export default Bestsellers;
