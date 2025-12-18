"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchDataFromApi } from "@/utils/api";
import Skeleton from "@mui/material/Skeleton";

export default function VideoPlayerPage() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const res = await fetchDataFromApi(`/api/videos/${id}`, false);
        if (!res?.error) setVideo(res.data);
      } catch (err) {
        console.log("Video load error:", err);
      }
    };
    loadVideo();
  }, [id]);

  if (!video) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Skeleton variant="rectangular" width={320} height={560} />
      </div>
    );
  }

  return (
    <div className="
      min-h-screen
      flex justify-center items-center
      bg-black
      px-2
    ">
      <div className="
        w-full max-w-md
        aspect-[9/16]
        bg-black
        rounded-xl
        overflow-hidden
        shadow-2xl
      ">
        <video
          src={video.videoUrl}
          controls
          autoPlay
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
