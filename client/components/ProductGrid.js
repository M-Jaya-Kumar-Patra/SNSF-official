// ProductGrid.jsx
import React from "react";
import { useRouter } from "next/navigation";


export default function ProductGrid({ products = [], row = 2 }) {
    const router = useRouter();


  return (
    <div className="max-w-[1400px] mx-auto">
  <div
    className="
      grid gap-4 sm:gap-6

      /* MOBILE */
      grid-cols-2

      /* SM AND UP */
      sm:grid-cols-none
      sm:grid-flow-col
      sm:overflow-x-auto
      sm:px-4
      sm:pb-4
      scrollbar-hide
    "
    style={{
      gridTemplateRows: `repeat(${row}, minmax(0, 1fr))`,
      gridAutoColumns: "minmax(220px, 1fr)",
    }}
  >


        {products.map((p) => (
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

    {/* subtle overlay */}
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
  </div>

  {/* CONTENT */}
  <div className="p-1 sm:p-2 flex flex-col gap-2 flex-1 items-center ">
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

    {/* FOOTER */}
   
  </div>
</article>

        ))}
      </div>
    </div>
  );
}
