"use client";

import React, { useEffect, useState } from "react";
import { getOrCreateSessionId, getOrCreateVisitorId } from "@/lib/tracking";
import { fetchDataFromApi } from "@/utils/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { getCloudinaryImageUrl } from "@/utils/cloudinary";

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

      if (!userId) {
        onEmpty?.();
        setLoading(false);
        return;
      }

      try {
        const res = await fetchDataFromApi(
          `/api/recommendations/getRecommendations?userId=${userId}&visitorId=${visitorId}&sessionId=${sessionId}&limit=${limit}`,
          false,
        );

        if (!res?.success || res.data.length === 0) onEmpty?.();
        if (res?.success) setRecommended(res.data || []);
      } catch {
        setRecommended([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [hydrated, limit, onEmpty, userData?._id]);

  if (!loading && recommended.length === 0) return null;

  return (
    <section className="w-full rounded-xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-200/70 sm:p-6">
      <h2 className="section-title mb-4">Recommended for You</h2>

      <div className="overflow-x-auto scroll-smooth scrollbar-hide">
        <div className="grid grid-flow-col auto-cols-[minmax(120px,180px)] gap-3 pb-1 sm:auto-cols-[minmax(160px,220px)] sm:gap-5 sm:pb-4 lg:auto-cols-[minmax(200px,240px)]">
          {loading ? (
            Array.from({ length: limit }).map((_, i) => (
              <article
                key={i}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm animate-pulse"
              >
                <div className="relative aspect-[4/3] w-full bg-slate-200" />
              </article>
            ))
          ) : recommended.length > 0 ? (
            recommended.slice(0, 20).map((prd) => (
              <article
                key={prd._id}
                className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
                onClick={() => router.push(`/product/${prd._id}`)}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <Image
                    src={getCloudinaryImageUrl(
                      prd?.images?.[0] || "/images/placeholder.jpg",
                      { width: 420, height: 315 },
                    )}
                    alt={prd?.name || "Product"}
                    fill
                    sizes="(max-width: 640px) 180px, 240px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="min-h-[72px] p-3">
                  <h3 className="line-clamp-2 text-sm font-medium leading-5 text-slate-800">
                    {prd?.name}
                  </h3>
                </div>
              </article>
            ))
          ) : (
            <p className="text-sm text-gray-500">No recommendations available</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Recommendations;
