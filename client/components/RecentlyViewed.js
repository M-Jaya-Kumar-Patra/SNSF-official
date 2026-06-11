"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { postData } from "@/utils/api";
import { useRouter } from "next/navigation";
import { getCloudinaryImageUrl } from "@/utils/cloudinary";
import { getProductPath } from "@/utils/productUrl";

export default function RecentlyViewed({ onEmpty }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchRecentlyViewed = async () => {
      const viewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

      if (viewed.length === 0) {
        setLoading(false);
        onEmpty?.();
        return;
      }

      try {
        const res = await postData(
          "/api/product/recently-viewed",
          { ids: viewed },
          false,
        );

        if (!res?.error) {
          const orderedProducts = viewed
            .map((id) => res.data.find((p) => p._id === id))
            .filter(Boolean);

          setProducts(orderedProducts);
        }
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentlyViewed();
  }, [onEmpty]);

  if (!loading && products.length === 0) return null;

  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-200/70 sm:p-6">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <Clock3 className="h-3.5 w-3.5" />
            Continue browsing
          </p>
          <h2 className="section-title mt-1">Recently Viewed</h2>
        </div>
      </div>

      <div className="overflow-x-auto scroll-smooth scrollbar-hide">
        <div className="grid grid-flow-col auto-cols-[minmax(138px,170px)] gap-3 pb-1 sm:auto-cols-[minmax(200px,230px)] sm:gap-4 sm:pb-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <article
                key={i}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm animate-pulse"
              >
                <div className="relative aspect-[4/3] w-full bg-slate-200" />
                <div className="space-y-2 p-3">
                  <div className="h-4 w-4/5 rounded bg-slate-200" />
                  <div className="h-3 w-1/2 rounded bg-slate-200" />
                </div>
              </article>
            ))
          ) : products.length > 0 ? (
            products.slice(0, 20).map((prd) => (
              <button
                type="button"
                aria-label={`Open ${prd?.name || "recently viewed product"}`}
                key={prd._id}
                onClick={() => router.push(getProductPath(prd))}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <Image
                    src={getCloudinaryImageUrl(
                      prd?.images?.[0] || "/images/placeholder.jpg",
                      { width: 420, height: 315 },
                    )}
                    alt={prd?.name || "Product"}
                    fill
                    sizes="(max-width: 640px) 170px, 230px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex min-h-[86px] flex-col justify-between gap-2 p-3">
                  <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-slate-800">
                    {prd?.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 transition group-hover:text-slate-900">
                    View again
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </button>
            ))
          ) : (
            <p className="text-sm text-gray-500">No recently viewed products</p>
          )}
        </div>
      </div>
    </section>
  );
}
