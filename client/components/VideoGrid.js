"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Skeleton from "@mui/material/Skeleton";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { fetchDataFromApi } from "@/utils/api";

const VideoGrid = ({
  rows = 1,
  cols = 3, // Default to 3 columns
  videoIndex = [0, 3], // [start, end)
  aspect = "9/16", // Default to Reel/Shorts ratio
  gap = "gap-4",
  rounded = "xl",
  autoplay = false, // If true, uploaded videos play muted; YouTube gets ?autoplay=1
}) => {
  const [videos, setVideos] = useState([]);
  const [playingId, setPlayingId] = useState(null); // To track which video is clicked

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchDataFromApi("/api/videos/getAll", false);
        if (!res?.error) setVideos(res.data || []); 
      } catch (e) {
        console.error("Video fetch error", e);
      }
    };
    load();
  }, []);

  const items = videos
    .filter((v) => v.isActive)
    .slice(videoIndex[0], videoIndex[1]);

  return (
    <div className="w-full">
      <div
  className={`grid grid-flow-col auto-cols-[220px] sm:auto-cols-[260px] ${gap}`}
>

        {items.length > 0
          ? items.map((item) => (
              <div
                key={item._id}
                className={`relative bg-black overflow-hidden shadow-lg rounded-${rounded}`}
                style={{ aspectRatio: aspect }}
              >
                {/* LOGIC: IF PLAYING, SHOW VIDEO. IF NOT, SHOW THUMBNAIL */}
                {playingId === item._id || (autoplay && item.sourceType === 'upload') ? (
                    // --- VIDEO PLAYER MODE ---
                    <div className="w-full h-full">
                        {item.sourceType === 'youtube' ? (
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${item.videoUrl}?autoplay=1&mute=${autoplay ? 1 : 0}&controls=0&loop=1&playlist=${item.videoUrl}`}
                                title={item.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full object-cover"
                            ></iframe>
                        ) : (
                            <video
                                src={item.videoUrl}
                                className="w-full h-full object-cover"
                                autoPlay={autoplay || playingId === item._id}
                                muted={autoplay} // Auto-play must be muted
                                loop
                                controls={!autoplay} // Hide controls if acting as a background poster
                                playsInline
                            />
                        )}
                    </div>
                ) : (
                    // --- THUMBNAIL MODE (Click to Play) ---
                    <div 
                        className="group w-full h-full relative cursor-pointer"
                        onClick={() => setPlayingId(item._id)}
                    >
                        <Image
                            src={item.thumbnai || "/images/placeholder.jpg"}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                            unoptimized
                        />
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition">
                             <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50 group-hover:scale-110 transition">
                                <PlayArrowIcon className="text-white text-3xl ml-1" />
                             </div>
                        </div>
                        
                        {/* Title Overlay (Optional) */}
                        <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/80 to-transparent">
                            <p className="text-white text-sm font-medium truncate">{item.title}</p>
                        </div>
                    </div>
                )}
              </div>
            ))
          : 
          // SKELETON LOADING
          Array.from({ length: (videoIndex[1] - videoIndex[0]) }).map((_, i) => (
              <div key={i} className={`relative bg-slate-200 rounded-${rounded}`} style={{ aspectRatio: aspect }}>
                 <Skeleton variant="rectangular" width="100%" height="100%" />
              </div>
            ))
          }
      </div>
    </div>
  );
};

export default VideoGrid;