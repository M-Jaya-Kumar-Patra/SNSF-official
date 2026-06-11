"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { fetchDataFromApi } from "@/utils/api";
import { useAuth } from "@/app/context/AuthContext";
import { getCloudinaryImageUrl } from "@/utils/cloudinary";
import { getProductPath } from "@/utils/productUrl";

const New = () => {
  const router = useRouter();
  const scrollRef = useRef(null);
  const { setLoading } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadNewArrivals = async () => {
      try {
        const res = await fetchDataFromApi(
          "/api/product/new-arrivals?limit=12",
          false,
        );
        if (!res.error) setData([...(res.data || [])].reverse());
      } catch {
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    loadNewArrivals();
  }, [setLoading]);

  return (
    <section className="flex w-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-200/70 sm:p-6">
      <div className="mb-4 flex items-end justify-between gap-4 sm:px-4">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <Sparkles className="h-3.5 w-3.5" />
            Fresh from workshop
          </p>
          <h2 className="section-title mt-1">New Arrivals</h2>
        </div>
        <span className="hidden rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 sm:inline-flex">
          Latest designs
        </span>
      </div>

      <div
        ref={scrollRef}
        className="relative overflow-x-auto scroll-smooth scrollbar-hide"
      >
        <div className="grid grid-flow-col grid-rows-2 auto-cols-[minmax(138px,1fr)] gap-3 pb-1 sm:grid-rows-1 sm:auto-cols-[minmax(230px,1fr)] sm:gap-4 sm:px-4 sm:pb-4">
          {Array.isArray(data) && data.length > 0
            ? data.slice(0, 12).map((prd, index) => (
                <button
                  type="button"
                  aria-label={`Open ${prd?.name || "new product"}`}
                  key={prd._id}
                  onClick={() => router.push(getProductPath(prd))}
                  className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                    <Image
                      src={getCloudinaryImageUrl(
                        prd?.images?.[0] || "/images/placeholder.jpg",
                        { width: 420, height: 315 },
                      )}
                      alt={prd?.name || "Product"}
                      fill
                      sizes="(max-width: 640px) 50vw, 230px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {index === 0 && (
                      <span className="absolute bottom-3 left-3 rounded-full bg-slate-950/85 px-3 py-1 text-xs font-semibold text-white">
                        Just added
                      </span>
                    )}
                  </div>

                  <div className="flex min-h-[86px] flex-col justify-between gap-2 p-3">
                    <h3
                      className="line-clamp-2 text-sm font-semibold leading-5 text-slate-800"
                      title={prd?.name}
                    >
                      {prd?.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 transition group-hover:text-slate-900">
                      View product
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </button>
              ))
            : Array.from({ length: 12 }).map((_, idx) => (
                <article
                  key={idx}
                  className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm animate-pulse"
                >
                  <div className="relative aspect-[4/3] w-full bg-slate-200" />
                  <div className="p-2 text-center">
                    <div className="mx-auto h-3 w-[70%] rounded bg-slate-200 sm:h-4" />
                  </div>
                </article>
              ))}
        </div>
      </div>
    </section>
  );
};

export default New;
