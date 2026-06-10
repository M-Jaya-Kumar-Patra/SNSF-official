"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";
import { fetchDataFromApi } from "@/utils/api";
import { getCloudinaryImageUrl } from "@/utils/cloudinary";

const Suggestions = ({ productId, catId, subCatId, thirdSubCatId, brand }) => {
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
        const query = `productId=${productId}&catId=${catId}&subCatId=${subCatId}&thirdSubCatId=${thirdSubCatId}&brand=${brand}&limit=12`;
        const res = await fetchDataFromApi(
          `/api/product/suggestions?${query}`,
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
  }, [brand, catId, productId, setLoading, subCatId, thirdSubCatId]);

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
  }, []);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    container.scrollBy({
      left: direction === "left" ? -container.clientWidth * 0.8 : container.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex w-full flex-col items-center bg-slate-100 pb-5 pt-3">
      <h2 className="mb-4 mt-4 text-2xl font-bold text-black sm:mb-8 sm:mt-8 sm:text-3xl">
        Similar Products
      </h2>

      <div className="relative mx-auto w-full max-w-[1100px] px-4">
        <button
          type="button"
          aria-label="Scroll similar products left"
          onClick={() => scroll("left")}
          disabled={isAtStart}
          className={`absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full p-1 shadow transition sm:p-2 ${
            isAtStart ? "bg-gray-300" : "bg-white/80 hover:bg-white"
          }`}
        >
          <ChevronLeft />
        </button>

        <div
          ref={scrollRef}
          className="overflow-x-auto whitespace-nowrap scroll-smooth py-5 scrollbar-hide"
        >
          <div className="inline-flex gap-4 px-2 py-4">
            {Array.isArray(data) && data.length > 0 ? (
              data.map((prd) => (
                <article
                  key={prd?._id}
                  className="flex min-w-[256px] max-w-[256px] flex-col items-center gap-3 bg-white p-2 shadow-md transition hover:scale-105"
                >
                  <button
                    type="button"
                    aria-label={`Open ${prd?.name || "product"}`}
                    className="relative w-full cursor-pointer overflow-hidden rounded-md"
                    style={{ aspectRatio: "4 / 3" }}
                    onClick={() => router.push(`/product/${prd?._id}`)}
                  >
                    <Image
                      src={getCloudinaryImageUrl(
                        prd?.images?.[0] || "/images/placeholder.jpg",
                        { width: 320, height: 240 },
                      )}
                      alt={prd?.name || "Product"}
                      fill
                      sizes="256px"
                      className="object-cover"
                    />
                  </button>

                  <button
                    type="button"
                    className="w-full truncate px-2 text-center text-sm font-medium text-gray-800"
                    onClick={() => router.push(`/product/${prd?._id}`)}
                  >
                    {prd?.name}
                  </button>
                </article>
              ))
            ) : localLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex min-w-[256px] max-w-[256px] flex-col items-center gap-3 bg-white p-2 shadow-md"
                >
                  <div className="h-[150px] w-full animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200" />
                </div>
              ))
            ) : (
              <p className="text-gray-500">No suggestions found</p>
            )}
          </div>
        </div>

        <button
          type="button"
          aria-label="Scroll similar products right"
          onClick={() => scroll("right")}
          disabled={isAtEnd}
          className={`absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full p-1 shadow sm:p-2 ${
            isAtEnd ? "bg-gray-300" : "bg-white/80 hover:bg-white"
          }`}
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Suggestions;
