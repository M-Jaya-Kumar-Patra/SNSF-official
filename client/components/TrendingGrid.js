// ProductGrid.jsx
import React from "react";
import { useRouter } from "next/navigation";
import { getCloudinaryImageUrl } from "@/utils/cloudinary";


export default function TrendingGrid({ products = [], row = 1, loading = false  }) {
    const router = useRouter();


  return (
    <div className="max-w-[1400px] mx-auto ">
      <div
  className={`
    grid gap-3 sm:gap-5

    grid-rows-2 

  

    /* MOBILE */
   sm:grid-rows-1

   grid-flow-col
    sm:px-4
scrollbar-hide

sm:pb-4


 sm:auto-cols-[minmax(230px,1fr)]
  auto-cols-[minmax(110px,1fr)]
    `}
  
>

       {loading ? (
  /* ================= SKELETON ================= */
  Array.from({ length: row === 2 ? 8 : 6 }).map((_, idx) => (
    <article
      key={`skeleton-${idx}`}
      className="
        bg-white
        overflow-hidden
        border border-black/10
        shadow-[0_10px_30px_rgba(7,16,19,0.06)]
        flex flex-col
        animate-pulse
        
      "
    >
      {/* IMAGE SKELETON */}
      <div className="relative w-full aspect-[4/3] bg-slate-200" />

      {/* CONTENT SKELETON */}
      <div className="p-1 sm:p-2 flex flex-col gap-2 items-center">
        <div className="h-3 sm:h-4 w-[70%] bg-slate-200 rounded" />
        <div className="h-3 sm:h-4 w-[50%] bg-slate-200 rounded" />
      </div>
    </article>
  ))
) : (
  /* ================= REAL DATA ================= */
  products.map((p) => (
    <article
      key={p.id}
      onClick={() => router.push(`/product/${p.id}`)}
      className="
        group
        bg-white
        overflow-hidden
        rounded-xl
        border border-slate-200
        shadow-sm
        transition-all duration-300 ease-out
        sm:hover:shadow-lg
        sm:hover:-translate-y-1
        flex flex-col
      "
    >
      {/* IMAGE */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={getCloudinaryImageUrl(p.image, { width: 420, height: 315 })}
          alt={p.title ?? "product image"}
          loading="lazy"
          className="
            absolute inset-0
            w-full h-full
            object-cover
            transition-transform duration-700 ease-out
            group-hover:scale-105
          "
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>

      {/* CONTENT */}
      <div className="flex min-h-[92px] flex-1 flex-col justify-between gap-3 p-3 sm:p-4">
        <h3
          className="
            text-[14px] sm:text-[15px]
            font-medium
            leading-snug
            text-slate-800
            line-clamp-2
            w-full
          "
          title={p.title}
        >
          {p.title}
        </h3>

        {p.subtitle && (
          <p className="text-xs sm:text-sm text-gray-500 line-clamp-1 truncate">
            {p.subtitle}
          </p>
        )}
      </div>
    </article>
  ))
)}

      </div>
    </div>
  );
}
