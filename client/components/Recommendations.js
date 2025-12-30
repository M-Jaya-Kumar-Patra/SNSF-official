"use client";

import React, { useEffect, useState } from "react";
import { getOrCreateVisitorId, getOrCreateSessionId } from "@/lib/tracking";
import { fetchDataFromApi } from "@/utils/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Josefin_Sans } from "next/font/google";
import { useAuth } from "@/app/context/AuthContext";

const joSan = Josefin_Sans({ subsets: ["latin"], weight: "400" });

const Recommendations = ({ limit = 10, onEmpty }) => {
  const [recommended, setRecommended] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const { userData } = useAuth();

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (!hydrated) return;

    const fetchRecommendations = async () => {
      setLoading(true);

      const visitorId = getOrCreateVisitorId();
      const sessionId = getOrCreateSessionId();
      const userId = userData?._id;
      if (!userData) {
        onEmpty?.();
      }

      if (userId) {
        try {
          const res = await fetchDataFromApi(
            `/api/recommendations/getRecommendations?userId=${userId}&visitorId=${visitorId}&sessionId=${sessionId}&limit=${limit}`,
            false
          );

          if (!res?.success || res.data.length === 0) {
            onEmpty?.();
          }

          if (res?.success) {
            setRecommended(res.data || []);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRecommendations();
  }, [hydrated, limit]);

  if (!loading && recommended.length === 0) return null;

  return (
    <div
      className="
    w-full
    bg-white
    p-3 sm:p-6
    pb-2
    border
    rounded-xl
    shadow-2xl
  "
    >
      <h1 className="section-title">Recommended for You</h1>

      {/* SCROLL AREA */}
      <div className="mt-2 sm:mt-4 overflow-x-auto scrollbar-hide scroll-smooth">
        <div
          className="
    grid
    grid-flow-col
    auto-cols-[minmax(120px,180px)]
    sm:auto-cols-[minmax(160px,220px)]
    lg:auto-cols-[minmax(200px,240px)]
    gap-4 sm:gap-6
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
                className="
        group cursor-pointer
        bg-white rounded-xl
        border border-gray-200
        shadow-md hover:shadow-xl
        transition
      "
              >
                {/* IMAGE */}
                <div
                  className="relative w-full aspect-[16/10] overflow-hidden rounded-xl"
                  onClick={() => router.push(`/product/${prd._id}`)}
                >
                  <Image
                    src={prd?.images?.[0] || "/images/placeholder.jpg"}
                    alt={prd?.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    unoptimized
                  />
                </div>
              </article>
            ))
          ) : (
            <p className="text-gray-500 text-sm">
              No recommendations available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
