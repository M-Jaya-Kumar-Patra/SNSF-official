"use client";

import React, { useRef, useEffect, useState } from "react";
import { Josefin_Sans } from "next/font/google";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Skeleton from "@mui/material/Skeleton";
import { fetchDataFromApi } from "@/utils/api";
import { useAuth } from "@/app/context/AuthContext";

const joSan = Josefin_Sans({ subsets: ["latin"], weight: "400" });

const New = () => {
  const router = useRouter();
  const scrollRef = useRef(null);
  const { setLoading, isCheckingToken } = useAuth();

  const [isAtStart, setIsAtStart] = useState(true);
const [isAtEnd, setIsAtEnd] = useState(false);



  const [data, setData] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  
useEffect(() => {
  const el = scrollRef.current;
  if (!el) return;

  const handleScroll = () => {
    setIsAtStart(el.scrollLeft <= 5);
    setIsAtEnd(
      Math.ceil(el.scrollLeft + el.clientWidth) >= el.scrollWidth - 5
    );
  };

  handleScroll();
  el.addEventListener("scroll", handleScroll);
  return () => el.removeEventListener("scroll", handleScroll);
}, []);


  const loadNewArrivals = async () => {
    try {
      const res = await fetchDataFromApi(
        "/api/product/new-arrivals?limit=12",
        false
      );
      if (!res.error) setData([...(res.data || [])].reverse());
    } catch (err) {
      console.log("New Arrivals fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNewArrivals();
  }, []);

  const getOptimizedCloudinaryUrl = (url) => {
    if (!url?.includes("res.cloudinary.com")) return url;
    return url.replace("/upload/", "/upload/w_800,h_800,c_fit,f_auto,q_90/");
  };

  return (
    <div className="flex flex-col bg-white w-full p-3 sm:p-6 sm:pb-3 pb-3">
      <h1
className="section-title sm:ml-4" >
        New Arrivals
      </h1>

      <div
        ref={scrollRef}
        className="
          relative
          overflow-x-auto
            scrollbar-hide
          scroll-smooth
          mt-3 sm:mt-4
        "
      >
        <div
          className="
            grid gap-4 sm:gap-6

            /* MOBILE */
            grid-rows-2
            grid-flow-col
            auto-cols-[minmax(110px,1fr)]

            /* SM AND UP */
            sm:grid-rows-1
            sm:auto-cols-[minmax(230px,1fr)]

            pb-1
            sm:px-4
            sm:pb-4

          "
        >
          {Array.isArray(data) && data.length > 0 ? (
            data.slice(0, 12).map((prd) => (
              <article
                key={prd._id}
                onClick={() => router.push(`/product/${prd._id}`)}
                className="
                  group
                  cursor-pointer
                  bg-white
                  rounded-xl sm:rounded-2xl
                  overflow-hidden
                  border border-gray-200
                  shadow-[0_2px_10px_rgba(0,0,0,0.04)]
                  transition-all duration-300
                  sm:hover:shadow-[0_10px_20px_rgba(0,0,0,0.12)]
                  sm:hover:-translate-y-1
                  flex flex-col
                "
              >
                {/* IMAGE */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
                  <Image
                    src={getOptimizedCloudinaryUrl(
                      prd?.images?.[0]  || "/images/placeholder.jpg"
                    )}
                    alt={prd?.name}
                    fill
                    className="
                      object-cover
                      transition-transform duration-700
                      group-hover:scale-105
                    "
                    unoptimized
                  />
                </div>

                {/* CONTENT */}
                <div className="p-1 sm:p-2 text-center">
                  <h3
                    className="
                             card-title
                      truncate
                      px-1
                    "
                    title={prd?.name}
                  >
                    {prd?.name}
                  </h3>
                </div>
              </article>
            ))
          ) : (
  /* ===== NEW ARRIVALS GRID SKELETON ===== */
  Array.from({ length: 12 }).map((_, idx) => (
    <article
      key={idx}
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

      {/* TITLE */}
      <div className="p-1 sm:p-2 text-center">
        <div className="h-3 sm:h-4 w-[70%] mx-auto bg-slate-200 rounded" />
      </div>
    </article>
  ))
)
 }
        </div>
      </div>
    </div>
  );
};

export default New;
