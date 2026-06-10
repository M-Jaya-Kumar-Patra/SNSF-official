"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchDataFromApi } from "@/utils/api";
import { useAuth } from "@/app/context/AuthContext";
import { useScreen } from "@/app/context/ScreenWidthContext";
import ProductGrid from "./ProductGrid";
import { IoArrowForwardCircle } from "react-icons/io5";
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
          image: getCloudinaryImageUrl(
            prd.product.images?.[0] || "/placeholder.jpg",
            {
              width: 420,
              height: 315,
            }
          ),
          title: prd.product.name,
        }))
    : [];

  return (
    <div
      className="
    w-full max-w-[1600px]
    flex flex-col lg:flex-row
    gap-6 lg:gap-0
  "
    >
      <div
        className="
          w-full lg:w-[calc(100%-327px)]
          bg-white
          p-3 sm:p-6 pb-1 sm:pb-0
          border
          lg:border-r-0
          rounded-lg lg:rounded-r-none
          lg:my-4
        "
      >
        <div className="flex justify-between items-center">
          <h2 className="section-title">Customer Favorites</h2>

          <button
            type="button"
            aria-label="View more customer favorites"
            onClick={() => router.push("/BestSellersList")}
            className="
      flex items-center gap-2
      sm:px-3
      rounded-full
      sm:text-slate-500
      sm:hover:text-slate-900
      text-slate-900
      transition-all duration-300
      group
    "
          >
            <span className="hidden sm:inline text-sm font-medium">
              View more
            </span>

            <IoArrowForwardCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="relative w-full mt-3 sm:mt-4">
          <div
            ref={scrollRef}
            className="
    overflow-y-auto
    sm:overflow-y-hidden
    sm:overflow-x-auto
    scroll-smooth
    scrollbar-hide
    pb-2 sm:pb-4
  "
          >
            {productsForGrid.length > 0 ? (
              <ProductGrid products={productsForGrid} row={2} priorityFirst />
            ) : (
              <div
                className="
        grid gap-4 sm:gap-6
        grid-rows-2
        grid-flow-col
        auto-cols-max
        pb-2
      "
              >
                {Array.from({ length: limit + 1 }).map((_, i) => (
                  <div
                    key={i}
                    className="
            w-[120px] sm:w-[220px]
            bg-white
            rounded-xl
            border
            shadow-sm
            overflow-hidden
          "
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
        className="
          hidden lg:block
          w-full lg:w-[327px]
          relative
          overflow-hidden
          rounded-xl lg:rounded-l-none
          cursor-pointer
        "
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
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 30vw"
            priority
          />
        ) : (
          <div className="absolute inset-0 h-full bg-slate-200 animate-pulse" />
        )}
      </div>
    </div>
  );
};

export default Bestsellers;
