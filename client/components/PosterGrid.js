"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Skeleton from "@mui/material/Skeleton";
import { useRouter } from "next/navigation";
import { fetchDataFromApi } from "@/utils/api";

const PosterGrid = ({
  rows = 1,
  cols = 1,
  posterIndex = [0, 1], // [start, end)
  aspect = "4/3",
  gap = "gap-3 sm:gap-4",
  darkFade = false,
  showText = false, 
  rounded = "xl"
}) => {
  const router = useRouter();
  const [posters, setPosters] = useState([]);
  const total = rows * cols;

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchDataFromApi("/api/poster/getAll", false);
        if (!res?.error) setPosters(res.data || []);
      } catch (e) {
        console.log("Poster fetch error", e);
      }
    };
    load();
  }, []);

  const items = posters
    .filter((p) => p.status)
    .slice(posterIndex[0], posterIndex[1])
    .slice(0, total);

  return (
    <div className="w-full ">
      <div
        className={`grid ${gap} `}
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}
      >
        {items.length > 0
          ? items.map((item) => (
              <div
                key={item._id}
                onClick={() => item.url && router.push(item.url)}
                className={`group relative cursor-pointer overflow-hidden
                  rounded-${rounded}
                  bg-black
                  shadow-md hover:shadow-2xl
                  transition-all duration-500`}
                style={{ aspectRatio: aspect }}
              >
                {/* IMAGE */}
                <Image
                  src={item.image?.[0]  || "/images/placeholder.jpg"}
                  alt={item.name  || "Poster"}
                  fill
                  className="
                    
                    transition-transform duration-[800ms] ease-out
                    group-hover:scale-[1.06]
                  "
                  unoptimized
                />

                {/* DARK FADE */}
                {!darkFade && <div className="
                  absolute inset-0
                  bg-gradient-to-t
                  from-black/80
                  via-black/20
                  to-transparent
                " />}

                {/* CONTENT */}
                {!showText && <div className="
                  absolute bottom-0 left-0 right-0
                  p-4
                ">
                  <h3 className="
                    text-white
                    text-sm sm:text-base
                    font-semibold
                    leading-tight
                    truncate
                  ">
                    {item.name}
                  </h3>

                  <span className="
                    inline-flex items-center
                    text-xs
                    text-slate-300
                    mt-1
                    opacity-90
                    group-hover:opacity-100
                    transition
                  ">
                    Explore collection
                    <span className="ml-1 text-sm">→</span>
                  </span>
                </div>}
              </div>
            ))
          : Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                className={`relative rounded-${rounded} overflow-hidden`}
                style={{ aspectRatio: aspect }}
              >
                <Skeleton
                  variant="rectangular"
                  sx={{
                    position: "absolute",
                    inset: 0,
                    bgcolor: "rgba(203,213,225,0.5)",
                  }}
                />
              </div>
            ))}
      </div>
    </div>
  );
};

export default PosterGrid;
