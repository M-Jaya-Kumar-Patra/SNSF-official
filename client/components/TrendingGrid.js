"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { getCloudinaryImageUrl } from "@/utils/cloudinary";
import { getProductPath } from "@/utils/productUrl";

export default function TrendingGrid({ products = [], loading = false }) {
  const router = useRouter();

  const skeletonCount = 9;

  return (
    <div className="w-full overflow-x-auto scroll-smooth pb-2 scrollbar-hide">
      <div className="grid auto-cols-[minmax(148px,1fr)] grid-flow-col grid-rows-2 gap-3 sm:auto-cols-[minmax(218px,1fr)] sm:gap-4 lg:auto-cols-[minmax(230px,1fr)]">
        {loading
          ? Array.from({ length: skeletonCount }).map((_, idx) => (
              <article
                key={`trending-skeleton-${idx}`}
                className={`overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm animate-pulse ${
                  idx === 0
                    ? "col-span-2 row-span-2 min-w-[300px] sm:min-w-[430px]"
                    : ""
                }`}
              >
                <div
                  className={
                    idx === 0
                      ? "h-full min-h-[250px] bg-slate-200"
                      : "aspect-[4/3] bg-slate-200"
                  }
                />
                {idx !== 0 && (
                  <div className="space-y-2 p-3">
                    <div className="h-4 w-4/5 rounded bg-slate-200" />
                    <div className="h-3 w-1/2 rounded bg-slate-200" />
                  </div>
                )}
              </article>
            ))
          : products.map((product, index) => {
              const isFeatured = index === 0;

              return (
                <button
                  type="button"
                  aria-label={`Open ${product.title || "trending product"}`}
                  key={product.id}
                  onClick={() => router.push(getProductPath(product))}
                  className={`group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg ${
                    isFeatured
                      ? "col-span-2 row-span-2 min-w-[300px] sm:min-w-[430px]"
                      : ""
                  }`}
                >
                  {isFeatured ? (
                    <div className="relative h-full min-h-[250px] overflow-hidden bg-slate-100">
                      <img
                        src={getCloudinaryImageUrl(product.image, {
                          width: 760,
                          height: 560,
                        })}
                        alt={product.title ?? "Trending product"}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                        <div className="mb-3 inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900">
                          Most viewed
                        </div>
                        <h3
                          className="line-clamp-2 text-lg font-semibold leading-snug text-white sm:text-xl"
                          title={product.title}
                        >
                          {product.title}
                        </h3>
                        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-white/90">
                          View product
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                        <img
                          src={getCloudinaryImageUrl(product.image, {
                            width: 420,
                            height: 315,
                          })}
                          alt={product.title ?? "Trending product"}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>

                      <div className="flex min-h-[82px] flex-col justify-between gap-2 p-3">
                        <h3
                          className="line-clamp-2 text-sm font-semibold leading-snug text-slate-800"
                          title={product.title}
                        >
                          {product.title}
                        </h3>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 group-hover:text-slate-900">
                          View product
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </>
                  )}
                </button>
              );
            })}
      </div>
    </div>
  );
}
