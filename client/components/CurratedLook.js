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

const joSan = Josefin_Sans({ subsets: ["latin"], weight: "400" });

const CurratedLooks = () => {
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

  const limit = isXs ? 7 : 12;

  useEffect(() => {
    setHydrated(true);
  }, []);

  const loadCurratedLooks = async () => {
    try {
      const res = await fetchDataFromApi(
        "/api/home-sections?sectionName=curatedLook",
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

      if (!res.error) setPoster(res?.data[4]);
    } catch (err) {
      console.log("Best sellers fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurratedLooks();
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
    <div className="w-full flex justify-center ">
      <div
        className="
        w-full max-w-[1600px]
        flex flex-col lg:flex-row
        gap-6 lg:gap-0
      "
      >
        {/* ================= LEFT : POSTER ================= */}
        <div
          className="

        hidden lg:block
          w-full lg:w-[327px]
          relative
          overflow-hidden
          rounded-xl lg:rounded-r-none
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

        {/* ================= RIGHT : CURATED ================= */}
        <div
          className="
          w-full lg:w-[calc(100%-327px)]
          bg-white
          p-3 sm:p-6 sm:pb-0
          border
          lg:border-l-0
          rounded-lg lg:rounded-l-none
          lg:my-4
        "
        >
          <h1
           className="section-title" >
            Curated Looks
          </h1>

          <div className="relative w-full mt-2 sm:mt-4">
            <div
              ref={scrollRef}
              className="

            overflow-y-auto 
            sm:overflow-x-auto
              scroll-smooth
              scrollbar-hide
              pb-0 sm:pb-2
            "
            >
             {productsForGrid.length > 0 ? (
  <ProductGrid products={productsForGrid} row={1} />
) : (
  /* ===== CURATED LOOKS GRID SKELETON ===== */
  <div
    className="
      grid gap-4 sm:gap-6
      grid-rows-2
      sm:grid-rows-1
      grid-flow-col
      auto-cols-[minmax(110px,1fr)]
      sm:auto-cols-[minmax(230px,1fr)]
      pb-2 sm:pb-4
    "
  >
    {Array.from({ length: limit+1 }).map((_, i) => (
      <article
        key={i}
        className="
          bg-white
          rounded-xl sm:rounded-2xl
          overflow-hidden
          border border-gray-200
          shadow-[0_2px_10px_rgba(0,0,0,0.04)]
          flex flex-col
          animate-pulse
        "
      >
        {/* IMAGE */}
        <div className="relative w-full aspect-[4/3] bg-slate-200" />

        {/* CONTENT */}
        <div className="p-1 sm:p-2 flex justify-center">
          <div className="h-3 sm:h-4 w-[70%] bg-slate-200 rounded" />
        </div>
      </article>
    ))}
  </div>
)}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurratedLooks;
