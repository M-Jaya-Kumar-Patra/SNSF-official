// ProductGrid.jsx
import React from "react";
import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { getCloudinaryImageUrl } from "@/utils/cloudinary";
import { getProductPath } from "@/utils/productUrl";

export default function ProductGrid({
  products = [],
  row = 2,
  priorityFirst = false,
  badge = "View",
}) {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-[1400px]">
      <div
        className="grid grid-cols-2 gap-3 scrollbar-hide sm:grid-cols-none sm:grid-flow-col sm:overflow-x-auto sm:px-4 sm:pb-4 md:gap-4"
        style={{
          gridTemplateRows: `repeat(${row}, minmax(0, 1fr))`,
          gridAutoColumns: "minmax(218px, 1fr)",
        }}
      >
        {products.map((product, index) => {
          const isPriority = priorityFirst && index === 0;

          return (
            <button
              type="button"
              key={product.id}
              aria-label={`Open ${product.title || "product"}`}
              onClick={() => router.push(getProductPath(product))}
              className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                <img
                  src={getCloudinaryImageUrl(product.image, {
                    width: 420,
                    height: 315,
                  })}
                  alt={product.title ?? "Product image"}
                  loading={isPriority ? "eager" : "lazy"}
                  fetchPriority={isPriority ? "high" : "auto"}
                  decoding={isPriority ? "sync" : "async"}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
              </div>

              <div className="flex min-h-[84px] w-full flex-1 flex-col justify-between gap-2 p-3">
                <h3
                  className="line-clamp-2 text-sm font-semibold leading-snug text-slate-800"
                  title={product.title}
                >
                  {product.title}
                </h3>

                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 transition group-hover:text-slate-900">
                  View product
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
