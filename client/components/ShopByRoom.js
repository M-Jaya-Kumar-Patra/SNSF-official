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

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

const joSan = Josefin_Sans({ subsets: ["latin"], weight: "400" });

const ShopByRoom = () => {
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

  const loadShopByRoom = async () => {
    try {
      const res = await fetchDataFromApi("/api/style-your-space/getAll", false);
      if (!res.error) setData(res?.data || []);
    } catch (err) {
      console.log("Best sellers fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShopByRoom();
  }, []);

  const getOptimizedCloudinaryUrl = (url) => {
    if (!url?.includes("res.cloudinary.com")) return url;
    return url.replace("/upload/", "/upload/w_800,h_800,c_fit,f_auto,q_90/");
  };

  return (
    <div className="w-full sm:p-6 border sm:rounded-xl shadow-2xl bg-white flex flex-col  mx-auto">
      <h1
        className={`text-2xl sm:text-3xl font-bold text-black mb-4 ${joSan.className}`}
      >
        Style Your Space
      </h1>

      <div className="grid grid-cols-4 sm:grid-cols-2 sm:gap-5">
        {shopByRoomData?.length > 0 ? (
          shopByRoomData
            .filter((x) => x?.status)
            .slice(0, 5)
            .map((prd, idx) => (
              <div
                key={idx}
                className="
    w-[clamp(200px,22vw,300px)]
    shrink-0
    bg-white
    rounded-xl
    shadow-md hover:shadow-xl
    transition-all duration-300
    cursor-pointer group
  "
              >
                {/* IMAGE */}
                <div
                  className="relative w-full overflow-hidden rounded-xl"
                  style={{ aspectRatio: "1 / 10" }}
                >
                  <Image
                    src={prd?.image?.[0] || "/images/placeholder.jpg"}
                    alt={prd?.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    unoptimized
                  />
                </div>
              </div>
            ))
        ) : localLoading || isCheckingToken || !hydrated ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="rounded-xl overflow-hidden shadow-md">
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
          <p className="text-gray-500 text-sm col-span-2">No data available</p>
        )}
      </div>
    </div>
  );
};

export default ShopByRoom;
