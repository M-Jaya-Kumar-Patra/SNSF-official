"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Skeleton from "@mui/material/Skeleton";
import { useRouter } from "next/navigation";
import { fetchDataFromApi } from "@/utils/api";
import { useAuth } from "@/app/context/AuthContext";
import { useScreen } from "@/app/context/ScreenWidthContext";
import ProductGrid from "./ProductGrid";
import TrendingGrid from "./TrendingGrid";

const StyleYourSpaceSection = () => {
  const router = useRouter();
  const scrollRefStyle = useRef(null);
  const scrollRefTrending = useRef(null);

  const { setLoading } = useAuth();
  const { isXs } = useScreen();

  const [trendingData, setTrendingData] = useState([]);
  const [shopByRoomData, setShopByRoomData] = useState([]);
  

  const limit = isXs ? 8 : 12;

  const getOptimizedCloudinaryUrl = (url) => {
    if (!url?.includes("res.cloudinary.com")) return url;
    return url.replace("/upload/", "/upload/w_800,h_800,c_fit,f_auto,q_90/");
  };

  useEffect(() => {
    const loadShopByRoom = async () => {
      try {
        const res = await fetchDataFromApi(
          "/api/style-your-space/getAll",
          false
        );
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

    loadShopByRoom();
    loadTrending();
  }, []);

  const productsForGrid = Array.isArray(trendingData)
    ? trendingData
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
  <div className="flex flex-col lg:flex-row gap-2 sm:gap-4 md:gap-6 lg:gap-4 w-full">
          {/* ================= LEFT : STYLE YOUR SPACE ================= */}
          <div className="w-full lg:w-[420px] flex-shrink-0 ">
            <div
              className="bg-white p-4 sm:p-6 sm:pb-0 pb-3  
        
        border rounded-none lg:rounded-r-lg h-full "
            >
              <h2 className="section-title mb-3 sm:mb-4">Style Your Space</h2>

              <div className="relative w-full">
                <div
                  ref={scrollRefStyle}
                  className="
                overflow-hidden
              
                pb-2 sm:pb-4
              "
                >
                  <div className="grid grid-rows-1 lg:grid-rows-2 grid-flow-col gap-3 sm:gap-6">
                    {Array.isArray(shopByRoomData) && shopByRoomData.length > 0
                      ? shopByRoomData.slice(0, 4).map(
                          (prd, index) =>
                            prd?.status && (
                              <div
                                key={prd?._id || index}
                                className="
                            min-w-full
                            bg-white
                            shadow-sm
                            rounded-lg
                            overflow-hidden
                            transition-transform duration-300
                            hover:scale-[1.03]
                            cursor-pointer
                          "
                                onClick={() =>
                                  router.push(`${prd?.url}`)
                                }
                              >
                                
                                <div className="relative w-full aspect-[3/5] md:aspect-[5/3] lg:aspect-[2/1] xl:aspect-video overflow-hidden group">

  {/* IMAGE */}
  <Image
    src={getOptimizedCloudinaryUrl(
      prd?.image?.[0] || "/images/placeholder.jpg"
    )}
    alt={prd?.name || "Product Image"}
    fill
    unoptimized
    className="
      object-cover
      brightness-95
      contrast-105
      transition-transform duration-700 ease-out
      group-hover:scale-105
    "
  />

  {/* DARK GRADIENT OVERLAY */}
  <div
    className="
      absolute inset-0
      bg-gradient-to-t
      from-black/65 via-black/30 to-black/0
    "
  />

  {/* PRODUCT NAME */}
  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
    <h3
      className="
        text-white
        text-sm sm:text-base
        font-semibold
        leading-tight
        drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]
        line-clamp-2
      "
      title={prd?.name}
    >
      {prd?.name}
    </h3>
  </div>

</div>

                              </div>
                            )
                        )
                      : Array.from({ length: 4 }).map((_, idx) => (
                          <div
                            key={idx}
                            className="
                        min-w-full
                        bg-white
                        rounded-lg
                        overflow-hidden
                      "
                          >
                            <div className="relative !w-full aspect-[3/5] md:!aspect-[5/3] lg:!aspect-[2/1] xl:!aspect-video">
                              <Skeleton 
                                variant="rectangular"
                                sx={{
                                  position: "absolute",
                                  inset: 0,
                                  bgcolor: "rgba(203,213,225,0.5)",
                                }}
                              />
                            </div>
                          </div>
                        ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
         

          {/* ================= RIGHT : TRENDING NOW ================= */}
          <div
            className="
          w-full lg:max-w-[1164px]
          bg-white
          p-4 sm:p-6 sm:pb-0 pb-3  
          border
          rounded-none  lg:rounded-l-lg
        "
          >
            <h2 className="section-title mb-3 sm:mb-4">Trending Now</h2>

            <div className="relative ">
              <div
                ref={scrollRefTrending}
                className="
              overflow-x-auto
              scroll-smooth
              scrollbar-hide
              pb-2
            "
              >
                <TrendingGrid
                  products={productsForGrid}
                  row={2}
                  loading={productsForGrid.length === 0}
                />
              </div>
            </div>
          </div>
        </div>
  );
};

export default StyleYourSpaceSection;
