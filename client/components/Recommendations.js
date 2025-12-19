"use client";

import React, { useEffect, useState } from "react";
import { getOrCreateVisitorId, getOrCreateSessionId } from "@/lib/tracking";
import { fetchDataFromApi } from "@/utils/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Josefin_Sans } from "next/font/google";

const joSan = Josefin_Sans({ subsets: ["latin"], weight: "400" });

const Recommendations = ({ limit = 10 }) => {
  const [recommended, setRecommended] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
  if (!hydrated) return;

  const fetchRecommendations = async () => {
    setLoading(true);

    const visitorId = getOrCreateVisitorId();
    const sessionId = getOrCreateSessionId();

    try {
      const res = await fetchDataFromApi(
        `/api/recommendations/getRecommendations?visitorId=${visitorId}&sessionId=${sessionId}&limit=${limit}`,
        false
      );

      if (!res?.error) {
        setRecommended(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchRecommendations();
}, [hydrated, limit]);


  return (
    <div className=" p-3 sm:p-6 pb-2 border rounded-xl shadow-2xl bg-white">
      <h1
className="section-title"    >
        Recommended for You
      </h1>

      {/* SCROLL AREA */}
      <div className="mt-2 sm:mt-4 overflow-x-auto scrollbar-hide scroll-smooth">
        <div
          className="
            grid gap-4 sm:gap-6
            grid-rows-1
            grid-flow-col
            auto-cols-[minmax(100px,1fr)]
            sm:-cols-[minmax(120px,1fr)]

            pb-1 sm:pb-4
          "
        >
  {loading ? (
  /* ===== RECOMMENDATIONS SKELETON ===== */
  Array.from({ length: limit }).map((_, i) => (
    <article
      key={i}
      className="
        bg-white
        rounded-xl
        border border-gray-200
        shadow-md
        overflow-hidden
        animate-pulse
      "
    >
      {/* IMAGE */}
      <div className="relative w-full aspect-[16/10] bg-slate-200" />
    </article>
  ))
) : recommended.length > 0 ? (
  recommended.slice(0, 20).map((prd) => (
    <article
      key={prd._id}
      onClick={() => router.push(`/product/${prd._id}`)}
      className="
        group cursor-pointer
        bg-white rounded-xl
        border border-gray-200
        shadow-md hover:shadow-xl
        transition
      "
    >
      {/* IMAGE */}
      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xl">
        <Image
          src={prd?.images?.[0] || "/placeholder.jpg"}
          alt={prd?.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          unoptimized
        />
      </div>
    </article>
  ))
) : (
  <p className="text-gray-500 text-sm">No recommendations available</p>
)}

        </div>
      </div>
    </div>
  );
};

export default Recommendations;
