"use client";

import React, {useRef, useState, useEffect } from "react";
import { Josefin_Sans } from "next/font/google";
import Image from "next/image";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";
import { fetchDataFromApi } from "@/utils/api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

const joSan = Josefin_Sans({ subsets: ["latin"], weight: "400" });

const Trending = () => {
  const router = useRouter();
    const scrollRef = useRef(null);
    const { setLoading, isCheckingToken } = useAuth(); // ✅ use isCheckingToken
  

  const [data, setData] = useState([]);
  const [poster, setPoster] = useState([]);

  const [hydrated, setHydrated] = useState(false);
    const [isAtStart, setIsAtStart] = useState(true);
    const [isAtEnd, setIsAtEnd] = useState(false);
    const [localLoading, setLocalLoading] = useState(false);
  

  useEffect(() => {
    setHydrated(true);
  }, []);

  const loadTrending = async () => {
    try {
      const res = await fetchDataFromApi("/api/home-sections?sectionName=trendingNow", false);

      if (!res.error) setData(res?.data|| []);
    } catch (err) {
      console.log("Best sellers fetch error:", err);  
    } finally {
      setLoading(false);
    }
  };  

  useEffect(() => {
    loadTrending();
  }, []);

  const getOptimizedCloudinaryUrl = (url) => {
    if (!url?.includes("res.cloudinary.com")) return url;
    return url.replace("/upload/", "/upload/w_800,h_800,c_fit,f_auto,q_90/");
  };

  return (


   
     <div className="trending w-full p-6 pb-4 border rounded-xl shadow-2xl overflow-hidden bg-white flex flex-col">
          <h2 className={`text-2xl lg:text-3xl font-bold mb-3 ${joSan.className} text-slate-900`}>
       Trending
      </h2>

    
        <div
          ref={scrollRef}
          className="overflow-x-auto whitespace-nowrap scroll-smooth scrollbar-hide p-2"
        >
          <div className="flex gap-6">
  {data?.length > 0 ? (
    data  
      .filter((x) => x?.enabled)
      .slice(0, 8)
      .map((prd, idx) => (
        <div
          key={idx}
          onClick={() => router.push(`/product/${prd?.product?._id}`)}
          className="
            w-[220px] shrink-0
            bg-white rounded-xl
            shadow-md hover:shadow-xl
            transition cursor-pointer group
          "
        >
          {/* IMAGE (same for all) */}
          <div
            className="relative w-full overflow-hidden rounded-t-xl"
            style={{ aspectRatio: "16 / 10" }}
          >
            <Image
              src={prd?.product?.images?.[0] || "/images/placeholder.jpg"}
              alt={prd?.product?.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              unoptimized
            />
          </div>

          {/* TITLE (fixed height) */}
          <div className="px-3 py-2 h-[44px] text-center">
            <p className="text-sm font-medium text-gray-900 line-clamp-2">
              {prd?.product?.name}
            </p>
          </div>
        </div>
      ))
  ) : (localLoading || isCheckingToken || !hydrated) ? (
    Array.from({ length: 4 }).map((_, idx) => (
      <div
        key={idx}
        className="rounded-xl overflow-hidden shadow-md"
      >
        <div className="relative aspect-[3/3.7] h-full">
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{
              position: "absolute",
              inset: 0,
              height: "100%",
              width: "100%",
              bgcolor: "rgba(203,213,225,0.5)",
              borderRadius: "12px",
            }}
          />
        </div>
      </div>
    ))
  ) : (
    <p className="text-gray-500 text-sm col-span-2">
      No data available
    </p>
  )}
</div>

        </div>
     
    </div>

  );
};

export default Trending;
