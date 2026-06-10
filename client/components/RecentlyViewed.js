"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { postData } from "@/utils/api";
import { useRouter } from "next/navigation";
import { getCloudinaryImageUrl } from "@/utils/cloudinary";

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
    <section className="w-full rounded-xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-200/70 sm:p-6">
      <h2 className="section-title mb-4">Recently Viewed</h2>

      <div className="overflow-x-auto scroll-smooth scrollbar-hide">
        <div className="grid grid-flow-col auto-cols-[minmax(120px,160px)] gap-3 pb-1 sm:auto-cols-[minmax(160px,200px)] sm:gap-5 sm:pb-4 lg:auto-cols-[minmax(200px,220px)]">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <article
                key={i}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm animate-pulse"
              >
                <div className="relative aspect-[4/3] w-full bg-slate-200" />
              </article>
            ))
          ) : products.length > 0 ? (
            products.slice(0, 20).map((prd) => (
              <article
                key={prd._id}
                onClick={() => router.push(`/product/${prd._id}`)}
                className="group cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <Image
                    src={getCloudinaryImageUrl(
                      prd?.images?.[0] || "/images/placeholder.jpg",
                      { width: 420, height: 315 },
                    )}
                    alt={prd?.name || "Product"}
                    fill
                    sizes="(max-width: 640px) 160px, 220px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="min-h-[72px] p-3">
                  <h3 className="line-clamp-2 text-sm font-medium leading-5 text-slate-800">
                    {prd?.name}
                  </h3>
                </div>
              </article>
            ))
          ) : (
            <p className="text-sm text-gray-500">No recently viewed products</p>
          )}
        </div>
      </div>
    </section>
  );
}
