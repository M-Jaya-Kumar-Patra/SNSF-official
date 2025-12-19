// ProductGrid.jsx
import React from "react";
import { useRouter } from "next/navigation";


export default function TrendingGrid({ products = [], row = 1, loading = false  }) {
    const router = useRouter();


  return (
    <div className="max-w-[1400px] mx-auto ">
      <div
  className={`
    grid gap-4 sm:gap-6

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
        rounded-xl
        sm:rounded-2xl
        overflow-hidden
        border border-gray-200
        shadow-[0_2px_10px_rgba(0,0,0,0.04)]
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
        rounded-xl
        sm:rounded-2xl
        overflow-hidden
        border border-gray-200
        shadow-[0_2px_10px_rgba(0,0,0,0.04)]
        transition-all duration-300 ease-out
        sm:hover:shadow-[0_10px_10px_rgba(0,0,0,0.12)]
        sm:hover:-translate-y-1
        flex flex-col
      "
    >
      {/* IMAGE */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={p.image}
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
      <div className="p-1 sm:p-2 flex flex-col gap-2 flex-1 items-center">
        <h3
          className="
            card-title
            leading-snug
            text-center
            truncate
            w-full
            mx-10
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
