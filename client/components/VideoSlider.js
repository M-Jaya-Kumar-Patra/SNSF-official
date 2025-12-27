"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchDataFromApi } from "@/utils/api";
import Skeleton from "@mui/material/Skeleton";

const VideoSlider = ({
  videoIndex = [0, 10],
}) => {
  const router = useRouter();
  const scrollRef = useRef(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const res = await fetchDataFromApi("/api/videos/getAll", false);
        if (!res?.error) setVideos(res.data || []);
      } catch (err) {
        console.log("Video fetch error:", err);
      }
    };
    loadVideos();
  }, []);

  const items = videos.slice(videoIndex[0], videoIndex[1]);

  return (
    <div className="w-full">
      <div
        ref={scrollRef}
        className="
          flex gap-4
          overflow-x-auto
          scrollbar-hide
          scroll-smooth
          py-2
        "
      >
        {items.length > 0
          ? items.map((video) => (
              <div
                key={video._id}
                onClick={() => router.push(`/video/${video._id}`)}
                className="
                  group
                  relative
                  min-w-[220px] sm:min-w-[280px]
                  aspect-[9/16]
                  rounded-xl
                  overflow-hidden
                  cursor-pointer
                  bg-black
                  shadow-md hover:shadow-xl
                  transition
                "
              >
                {/* Thumbnail */}
                <Image
                  src={video.thumbnail || "/images/placeholder.jpg"}
                  alt={video.title}
                  fill
                  className="
                    object-cover
                    transition-transform duration-500
                    group-hover:scale-105
                  "
                  unoptimized
                />

                {/* Play Icon */}
                <div className="
                  absolute inset-0
                  flex items-center justify-center
                  bg-black/30
                ">
                  <div className="
                    w-12 h-12
                    rounded-full
                    bg-white/90
                    flex items-center justify-center
                    text-black text-xl
                  ">
                    ▶
                  </div>
                </div>

                {/* Title */}
                <div className="
                  absolute bottom-0 left-0 right-0
                  p-3
                  bg-gradient-to-t from-black/80 to-transparent
                ">
                  <p className="
                    text-white text-sm font-medium truncate
                  ">
                    {video.title}
                  </p>
                </div>
              </div>
            ))
          : Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="min-w-[220px] aspect-[9/16] rounded-xl overflow-hidden"
              >
                <Skeleton
                  variant="rectangular"
                  sx={{
                    width: "100%",
                    height: "100%",
                    bgcolor: "rgba(203,213,225,0.5)",
                  }}
                />
              </div>
            ))}
      </div>
    </div>
  );
};

export default VideoSlider;
