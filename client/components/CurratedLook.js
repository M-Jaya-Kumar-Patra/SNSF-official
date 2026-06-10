"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchDataFromApi } from "@/utils/api";
import { useAuth } from "@/app/context/AuthContext";
import { useScreen } from "@/app/context/ScreenWidthContext";
import ProductGrid from "./ProductGrid";
import { getCloudinaryImageUrl } from "@/utils/cloudinary";

const CurratedLooks = () => {
  const router = useRouter();
  const scrollRef = useRef(null);
  const { setLoading, isCheckingToken } = useAuth(); // ✅ use isCheckingToken
  const { isXs } = useScreen();

  const [data, setData] = useState([]);
  const [poster, setPoster] = useState([]);

  const [hydrated, setHydrated] = useState(false);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const limit = isXs ? 7 : 12;

  useEffect(() => {
    setHydrated(true);
  }, []);

  const loadCurratedLooks = async () => {
    try {
      const res = await fetchDataFromApi(
        "/api/home-sections?sectionName=curatedLook",
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

      if (!res.error) setPoster(res?.data[4]);
    } catch {
      setPoster(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurratedLooks();
    loadPoster();
  }, []);

  const productsForGrid = Array.isArray(data)
    ? data
        .slice(0, limit + 1)
        .filter((prd) => prd?.enabled && prd?.product)
        .map((prd) => ({
          id: prd.product._id,
          image: getCloudinaryImageUrl(prd.product.images?.[0] || "/placeholder.jpg", {
            width: 420,
            height: 315,
          }),
          title: prd.product.name,
        }))
    : [];

  return (
    <div className="w-full flex justify-center ">
      <div
        className="
        w-full max-w-[1600px]
        flex flex-col lg:flex-row
        gap-6 lg:gap-0
      "
      >
        {/* ================= LEFT : POSTER ================= */}
        <div
          className="

        hidden lg:block
          w-full lg:w-[327px]
          relative
          overflow-hidden
          cursor-pointer
          bg-slate-900
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
            />
          ) : (
            <div className="absolute inset-0 bg-slate-200 animate-pulse" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <p className="text-sm font-semibold text-slate-200">
              Curated range
            </p>
            <h3 className="mt-1 text-2xl font-semibold leading-tight">
              Designs that work together.
            </h3>
          </div>
        </div>

        {/* ================= RIGHT : CURATED ================= */}
        <div
          className="
          w-full lg:w-[calc(100%-327px)]
          bg-white
          p-4 sm:p-6
          border border-slate-200
          lg:border-l-0
          lg:my-4
        "
        >
          <div>
            <h2 className="section-title mt-1">Curated Looks</h2>
          </div>

          <div className="relative w-full mt-2 sm:mt-4">
            <div
              ref={scrollRef}
              className="

            overflow-y-auto 
            sm:overflow-x-auto
              scroll-smooth
              scrollbar-hide
              pb-0 sm:pb-2
            "
            >
             {productsForGrid.length > 0 ? (
  <ProductGrid products={productsForGrid} row={1} />
) : (
  /* ===== CURATED LOOKS GRID SKELETON ===== */
  <div
    className="
      grid gap-4 sm:gap-6
      grid-rows-2
      sm:grid-rows-1
      grid-flow-col
      auto-cols-[minmax(110px,1fr)]
      sm:auto-cols-[minmax(230px,1fr)]
      pb-2 sm:pb-4
    "
  >
    {Array.from({ length: limit+1 }).map((_, i) => (
      <article
        key={i}
        className="
          bg-white
          overflow-hidden
          rounded-xl
          border border-slate-200
          shadow-sm
          flex flex-col
          animate-pulse
        "
      >
        {/* IMAGE */}
        <div className="relative w-full aspect-[4/3] bg-slate-200" />

        {/* CONTENT */}
        <div className="p-1 sm:p-2 flex justify-center">
          <div className="h-3 sm:h-4 w-[70%] bg-slate-200 rounded" />
        </div>
      </article>
    ))}
  </div>
)}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurratedLooks;
