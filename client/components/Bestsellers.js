"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchDataFromApi } from "@/utils/api";
import { useAuth } from "@/app/context/AuthContext";
import { useScreen } from "@/app/context/ScreenWidthContext";
import ProductGrid from "./ProductGrid";
import { ArrowUpRight, Star } from "lucide-react";
import { getCloudinaryImageUrl } from "@/utils/cloudinary";

const Bestsellers = ({
  posterIndex,
  initialData = [],
  initialPoster = null,
}) => {
  const router = useRouter();
  const scrollRef = useRef(null);
  const { setLoading } = useAuth();
  const { isXs } = useScreen();

  const [data, setData] = useState(initialData);
  const [poster, setPoster] = useState(initialPoster);

  const limit = isXs ? 7 : 11;

  const loadCustomerFavorites = async () => {
    try {
      const res = await fetchDataFromApi(
        "/api/home-sections?sectionName=bestsellers",
        false
      );

      if (!res.error) setData(res?.data || []);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const loadPoster = async () => {
    try {
      const res = await fetchDataFromApi("/api/poster/getAll", false);

      if (!res.error) setPoster(res?.data[posterIndex]);
    } catch {
      setPoster(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialData.length > 0) {
      setLoading(false);
      return;
    }

    loadCustomerFavorites();
  }, []);

  useEffect(() => {
    if (initialPoster) {
      setLoading(false);
      return;
    }

    loadPoster();
  }, []);

  const productsForGrid = Array.isArray(data)
    ? data
        .slice(0, limit + 1)
        .filter((prd) => prd?.enabled && prd?.product)
        .map((prd) => ({
          id: prd.product._id,
          image: prd.product.images?.[0] || "/placeholder.jpg",
          title: prd.product.name,
        }))
    : [];

  return (
    <div
      className="flex w-full max-w-[1600px] flex-col gap-4 lg:flex-row lg:gap-0"
    >
      <div
        className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-200/70 sm:p-6 lg:my-4 lg:w-[calc(100%-340px)] lg:rounded-r-none lg:border-r-0"
      >
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <Star className="h-3.5 w-3.5 fill-slate-500" />
              Best sellers
            </p>
            <h2 className="section-title mt-1">Customer Favorites</h2>
          </div>

          <button
            type="button"
            aria-label="View more customer favorites"
            onClick={() => router.push("/BestSellersList")}
            className="group inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
          >
            <span className="hidden sm:inline">View all</span>
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

        <div className="relative w-full">
          <div
            ref={scrollRef}
            className="overflow-y-auto scroll-smooth pb-2 scrollbar-hide sm:overflow-x-auto sm:overflow-y-hidden sm:pb-4"
          >
            {productsForGrid.length > 0 ? (
              <ProductGrid
                products={productsForGrid}
                row={2}
                priorityFirst
                badge="Favorite"
              />
            ) : (
              <div className="grid grid-flow-col grid-rows-2 gap-3 pb-2 sm:gap-4">
                {Array.from({ length: limit + 1 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-[130px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:w-[218px]"
                  >
                    <div className="relative w-full aspect-[16/10]">
                      <div className="h-full w-full bg-slate-200 animate-pulse" />
                    </div>

                    <div className="p-2">
                      <div className="h-4 w-[90%] rounded bg-slate-200 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className="relative hidden w-full cursor-pointer overflow-hidden rounded-2xl bg-slate-900 lg:block lg:w-[340px] lg:rounded-l-none"
        onClick={() => poster?.url && router.push(poster.url)}
      >
        {poster?.status ? (
          <Image
            src={getCloudinaryImageUrl(
              poster?.image?.[0] || "/images/placeholder.jpg",
              { width: 480, crop: "limit" }
            )}
            alt="Promotional Poster"
            fill
            className="object-cover transition duration-700 hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 30vw"
            priority
          />
        ) : (
          <div className="absolute inset-0 h-full bg-slate-200 animate-pulse" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <p className="text-sm font-semibold text-white/75">Featured pick</p>
          <h3 className="mt-1 text-2xl font-semibold leading-tight">
            Most loved designs, ready to explore.
          </h3>
          <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950">
            Explore
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default Bestsellers;
