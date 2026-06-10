"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { fetchDataFromApi } from "@/utils/api";
import { useAuth } from "@/app/context/AuthContext";
import { getCloudinaryImageUrl } from "@/utils/cloudinary";

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
    <section className="flex w-full flex-col rounded-xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-200/70 sm:p-6">
      <h2 className="section-title mb-4 sm:ml-4">New Arrivals</h2>

      <div
        ref={scrollRef}
        className="relative mt-3 overflow-x-auto scroll-smooth scrollbar-hide sm:mt-4"
      >
        <div className="grid grid-flow-col grid-rows-2 auto-cols-[minmax(110px,1fr)] gap-3 pb-1 sm:grid-rows-1 sm:auto-cols-[minmax(230px,1fr)] sm:gap-5 sm:px-4 sm:pb-4">
          {Array.isArray(data) && data.length > 0
            ? data.slice(0, 12).map((prd) => (
                <article
                  key={prd._id}
                  onClick={() => router.push(`/product/${prd._id}`)}
                  className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
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
                  </div>

                  <div className="min-h-[72px] p-2 sm:p-3">
                    <h3
                      className="line-clamp-2 text-sm font-medium leading-5 text-slate-800"
                      title={prd?.name}
                    >
                      {prd?.name}
                    </h3>
                  </div>
                </article>
              ))
            : Array.from({ length: 12 }).map((_, idx) => (
                <article
                  key={idx}
                  className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm animate-pulse"
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
