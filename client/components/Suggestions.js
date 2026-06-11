"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { fetchDataFromApi } from "@/utils/api";
import { getCloudinaryImageUrl } from "@/utils/cloudinary";
import { getProductPath } from "@/utils/productUrl";

const Suggestions = ({
  productId,
  catId,
  subCatId,
  thirdSubCatId,
  brand,
  title = "Similar Products",
  subtitle = "More designs from the same style family.",
  eyebrow = "Related picks",
  limit = 12,
}) => {
  const { setLoading, isCheckingToken } = useAuth();
  const scrollRef = useRef(null);
  const router = useRouter();

  const [data, setData] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const query = new URLSearchParams({
          productId: productId || "",
          catId: catId || "",
          subCatId: subCatId || "",
          thirdSubCatId: thirdSubCatId || "",
          brand: brand || "",
          limit: String(limit),
        });

        const res = await fetchDataFromApi(
          `/api/product/suggestions?${query.toString()}`,
          false,
        );

        if (!res.error) setData(res.data || []);
      } catch {
        setData([]);
      } finally {
        setLocalLoading(false);
        setLoading(false);
      }
    };

    loadSuggestions();
  }, [brand, catId, limit, productId, setLoading, subCatId, thirdSubCatId]);

  useEffect(() => {
    if (!hydrated || isCheckingToken) return;
    if (Array.isArray(data)) setLoading(false);
  }, [data, hydrated, isCheckingToken, setLoading]);

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
  }, [data]);

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

  if (!localLoading && data.length === 0) return null;

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
          {Array.isArray(data) && data.length > 0
            ? data.map((prd) => (
                <article
                  key={prd?._id}
                  className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-md"
                  onClick={() => router.push(getProductPath(prd))}
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
              ))
            : Array.from({ length: 6 }).map((_, i) => (
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
              ))}
        </div>
      </div>
    </section>
  );
};

export default Suggestions;
