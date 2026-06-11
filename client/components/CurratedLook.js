"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Layers3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchDataFromApi } from "@/utils/api";
import { useAuth } from "@/app/context/AuthContext";
import { useScreen } from "@/app/context/ScreenWidthContext";
import ProductGrid from "./ProductGrid";
import { getCloudinaryImageUrl } from "@/utils/cloudinary";

const CurratedLooks = () => {
  const router = useRouter();
  const { setLoading } = useAuth();
  const { isXs } = useScreen();

  const [data, setData] = useState([]);
  const [poster, setPoster] = useState(null);

  const limit = isXs ? 7 : 12;

  useEffect(() => {
    const loadCurratedLooks = async () => {
      try {
        const res = await fetchDataFromApi(
          "/api/home-sections?sectionName=curatedLook",
          false,
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
        if (!res.error) setPoster(res?.data?.[4] || null);
      } catch {
        setPoster(null);
      } finally {
        setLoading(false);
      }
    };

    loadCurratedLooks();
    loadPoster();
  }, [setLoading]);

  const productsForGrid = Array.isArray(data)
    ? data
        .slice(0, limit + 1)
        .filter((item) => item?.enabled && item?.product)
        .map((item) => ({
          id: item.product._id,
          image: item.product.images?.[0] || "/placeholder.jpg",
          title: item.product.name,
        }))
    : [];

  return (
    <section className="flex w-full justify-center">
      <div className="grid w-full max-w-[1600px] gap-4 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-0">
        <button
          type="button"
          aria-label="Open curated collection"
          className="group relative hidden min-h-[360px] cursor-pointer overflow-hidden rounded-2xl bg-slate-900 text-left lg:block lg:rounded-r-none"
          onClick={() => poster?.url && router.push(poster.url)}
        >
          {poster?.status ? (
            <Image
              src={getCloudinaryImageUrl(
                poster?.image?.[0] || "/images/placeholder.jpg",
                { width: 520, height: 720 },
              )}
              alt="Curated collection"
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
              sizes="340px"
            />
          ) : (
            <div className="absolute inset-0 bg-slate-200 animate-pulse" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-white/75">
              <Layers3 className="h-4 w-4" />
              Curated range
            </p>
            <h3 className="mt-2 text-2xl font-semibold leading-tight">
              Designs that work beautifully together.
            </h3>
            <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950">
              Explore looks
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </button>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-200/70 sm:p-6 lg:rounded-l-none lg:border-l-0">
          <div className="mb-4 flex items-end justify-between gap-4 sm:px-4">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <Layers3 className="h-3.5 w-3.5" />
                Styled together
              </p>
              <h2 className="section-title mt-1">Curated Looks</h2>
            </div>
            <span className="hidden rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 sm:inline-flex">
              Complete sets
            </span>
          </div>

          <div className="overflow-y-auto scroll-smooth pb-2 scrollbar-hide sm:overflow-x-auto sm:overflow-y-hidden">
            {productsForGrid.length > 0 ? (
              <ProductGrid products={productsForGrid} row={1} badge="Curated" />
            ) : (
              <div className="grid grid-flow-col grid-rows-2 gap-3 pb-2 sm:grid-rows-1 sm:gap-4">
                {Array.from({ length: limit + 1 }).map((_, index) => (
                  <article
                    key={index}
                    className="flex w-[138px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm animate-pulse sm:w-[218px]"
                  >
                    <div className="relative aspect-[4/3] w-full bg-slate-200" />
                    <div className="p-3">
                      <div className="h-4 w-[80%] rounded bg-slate-200" />
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurratedLooks;
