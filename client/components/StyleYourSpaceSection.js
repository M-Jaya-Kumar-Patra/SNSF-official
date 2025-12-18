"use client";

import React, { useRef, useState, useEffect } from "react";
import { Josefin_Sans } from "next/font/google";
import Image from "next/image";
import Skeleton from "@mui/material/Skeleton";
import { useRouter } from "next/navigation";
import { fetchDataFromApi } from "@/utils/api";
import { useAuth } from "@/app/context/AuthContext";
import { useScreen } from "@/app/context/ScreenWidthContext";
import ProductGrid from "./ProductGrid";
import TrendingGrid from "./TrendingGrid"

const joSan = Josefin_Sans({ subsets: ["latin"], weight: "400" });

const StyleYourSpaceSection = () => {
  const router = useRouter();
  const scrollRef = useRef(null);
  const { setLoading, isCheckingToken } = useAuth();
    const { isXs } = useScreen();
  

  const [hydrated, setHydrated] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const [trendingData, setTrendingData] = useState([]);
  const [shopByRoomData, setShopByRoomData] = useState([]);


    const limit = isXs?8 : 12
    


  useEffect(() => {
    setHydrated(true);
  }, []);

  const loadShopByRoom = async () => {
    try {
      const res = await fetchDataFromApi("/api/style-your-space/getAll", false);
      if (!res.error) setShopByRoomData(res?.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const loadTrending = async () => {
    try {
      const res = await fetchDataFromApi(
        "/api/home-sections?sectionName=trendingNow",
        false
      );
      if (!res.error) setTrendingData(res?.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShopByRoom();
    loadTrending();
  }, []);

  const getOptimizedCloudinaryUrl = (url) => {
    if (!url?.includes("res.cloudinary.com")) return url;
    return url.replace("/upload/", "/upload/w_800,h_800,c_fit,f_auto,q_90/");
  };


  

  const productsForGrid = Array.isArray(trendingData)
  ? trendingData
      .slice(0, limit+1)
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
    <div className="lg:flex justify-center w-full gap-6 items-stretch">
      {/* LEFT : STYLE YOUR SPACE */}
      <div className="lg:w-[420px] flex-shrink-0 relative overflow-hidden">
        <div className="w-full sm:h-full bg-white p-3   sm:p-6 sm:pb-2  border border-l-0">
          <h1 className={`text-xl sm:text-2xl lg:text-3xl font-bold text-black ${joSan.className}`}>
            Style Your Space
          </h1>

          <div className="relative w-full mt-2 sm:mt-4">
            <div
              ref={scrollRef}
              className="
                whitespace-nowrap
                scroll-smooth
                sm:pb-4
                horizontal-scroll
              "
            >
         <div className="grid grid-rows-1 lg:grid-rows-2 grid-flow-col gap-2 sm:gap-6 place-items-center">
  {Array.isArray(shopByRoomData) && shopByRoomData.length > 0 ? (
    shopByRoomData.slice(0, 4).map(
      (prd, index) =>
        prd?.status && (
          <div
            key={prd?._id || index}
            className="
              min-w-full
              bg-white
              shadow-md
              flex
              transition-transform duration-300
              hover:scale-105
              cursor-pointer
            "
            onClick={() => router.push(`/product/${prd?._id}`)}
          >
            <div className="relative w-full overflow-hidden aspect-[3/5] md:aspect-[5/3] lg:aspect-[2/1] xl:aspect-video">
              <Image
                src={getOptimizedCloudinaryUrl(
                  prd?.image?.[0] || "/placeholder.jpg"
                )}
                alt={prd?.name || "Product Image"}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        )
    )
  ) : (
    /* ===== STYLE YOUR SPACE SKELETON ===== */
    Array.from({ length: 4 }).map((_, idx) => (
      <div
        key={idx}
        className="
          min-w-full
          bg-white
          shadow-md
          overflow-hidden
        "
      >
        <div className="relative w-full aspect-[3/5] md:aspect-[5/3] lg:aspect-[2/1] xl:aspect-video">
          <Skeleton
            variant="rectangular"
            sx={{
              position: "absolute",
              inset: 0,
              height: "100%",
              bgcolor: "rgba(203,213,225,0.5)",
            }}
          />
        </div>
      </div>
    ))
  )}
</div>

            </div>
          </div>
        </div>
      </div>

          <div
              className="
                w-full lg:w-[70%]
                bg-white
                p-3 sm:p-6 sm:pb-0
                border
                lg:border-r-0
              lg:rounded-r-none

              mt-2 sm:mt-4 md:mt-6  lg:mt-0
                
              "
            >
              <h1 className={`text-xl sm:text-2xl lg:text-3xl font-bold text-black ${joSan.className}`}>
               Trending Now
              </h1>
      
              <div className="relative w-full mt-2 sm:mt-4">
      
                <div
                  ref={scrollRef}
                  className="
      
                overflow-x-auto
                    scroll-smooth
                    scrollbar-hide
                    pb-1 sm:pb-2
                  "
                >
                  <TrendingGrid products={productsForGrid} row={2} loading={productsForGrid.length === 0}/>
      
                </div>
              </div>
            </div>
      
    </div>
  );
};

export default StyleYourSpaceSection;
