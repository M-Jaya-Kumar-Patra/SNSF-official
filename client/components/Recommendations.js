"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { getOrCreateSessionId, getOrCreateVisitorId } from "@/lib/tracking";
import { fetchDataFromApi } from "@/utils/api";
import { useAuth } from "@/app/context/AuthContext";
import { getCloudinaryImageUrl } from "@/utils/cloudinary";

const Recommendations = ({
  limit = 10,
  onEmpty,
  title = "Suggested for You",
  subtitle = "Personal picks based on your browsing and related styles.",
  eyebrow = "For you",
  fallbackProductId,
  catId,
  subCatId,
  thirdSubCatId,
  brand,
  excludeProductId,
}) => {
  const [recommended, setRecommended] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const scrollRef = useRef(null);
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

      try {
        const recommendationQuery = new URLSearchParams({
          visitorId,
          sessionId,
          limit: String(limit),
        });

        if (userId) recommendationQuery.set("userId", userId);

        const res = await fetchDataFromApi(
          `/api/recommendations/getRecommendations?${recommendationQuery.toString()}`,
          false,
        );

        let nextItems = res?.success ? res.data || [] : [];

        if (!nextItems.length && fallbackProductId) {
          const fallbackQuery = new URLSearchParams({
            productId: fallbackProductId || "",
            catId: catId || "",
            subCatId: subCatId || "",
            thirdSubCatId: thirdSubCatId || "",
            brand: brand || "",
            limit: String(limit),
          });

          const fallbackRes = await fetchDataFromApi(
            `/api/product/suggestions?${fallbackQuery.toString()}`,
            false,
          );

          nextItems = fallbackRes?.error ? [] : fallbackRes?.data || [];
        }

        nextItems = nextItems.filter(
          (prd) => prd?._id && prd._id !== excludeProductId,
        );

        if (nextItems.length === 0) onEmpty?.();
        setRecommended(nextItems);
      } catch {
        setRecommended([]);
        onEmpty?.();
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [
    brand,
    catId,
    excludeProductId,
    fallbackProductId,
    hydrated,
    limit,
    onEmpty,
    subCatId,
    thirdSubCatId,
    userData?._id,
  ]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const checkScrollLimits = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setIsAtStart(scrollLeft <= 0);
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 5);
    };

    checkScrollLimits();
    container.addEventListener("scroll", checkScrollLimits);
    return () => container.removeEventListener("scroll", checkScrollLimits);
  }, [recommended]);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    container.scrollBy({
      left:
        direction === "left"
          ? -container.clientWidth * 0.82
          : container.clientWidth * 0.82,
      behavior: "smooth",
    });
  };

  if (!loading && recommended.length === 0) return null;

  return (
    <section className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            {eyebrow}
          </p>
          <h2 className="mt-1 text-[24px] font-semibold leading-tight text-slate-950 sm:text-[30px]">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{subtitle}</p>
        </div>

        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            aria-label={`Scroll ${title} left`}
            onClick={() => scroll("left")}
            disabled={isAtStart}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 transition disabled:cursor-not-allowed disabled:opacity-40 hover:border-slate-950"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            aria-label={`Scroll ${title} right`}
            onClick={() => scroll("right")}
            disabled={isAtEnd}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 transition disabled:cursor-not-allowed disabled:opacity-40 hover:border-slate-950"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="overflow-x-auto scroll-smooth scrollbar-hide">
        <div className="grid grid-flow-col auto-cols-[minmax(180px,220px)] gap-3 p-4 sm:auto-cols-[minmax(220px,250px)] sm:p-5">
          {loading
            ? Array.from({ length: Math.min(limit, 8) }).map((_, i) => (
                <article
                  key={i}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                >
                  <div className="aspect-[4/3] w-full animate-pulse bg-slate-200" />
                  <div className="p-3">
                    <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
                    <div className="mt-3 h-4 w-4/5 animate-pulse rounded bg-slate-200" />
                  </div>
                </article>
              ))
            : recommended.slice(0, 20).map((prd) => (
                <article
                  key={prd._id}
                  className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-md"
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
                      sizes="(max-width: 640px) 220px, 250px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="min-h-[86px] p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                      {prd?.brand || "SNSF"}
                    </p>
                    <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-5 text-slate-900">
                      {prd?.name}
                    </h3>
                  </div>
                </article>
              ))}
        </div>
      </div>
    </section>
  );
};

export default Recommendations;
