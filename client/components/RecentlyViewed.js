"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Josefin_Sans } from "next/font/google";
import { postData } from "@/utils/api";
import { useRouter } from "next/navigation";

const joSan = Josefin_Sans({ subsets: ["latin"], weight: "400" });

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
        false
      );

      if (!res?.error) {
        // 🔥 FIX: maintain correct order
        const orderedProducts = viewed
          .map(id => res.data.find(p => p._id === id))
          .filter(Boolean);

        setProducts(orderedProducts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchRecentlyViewed();
}, []);
if (!loading && products.length === 0) return null;

return (
  <div className="w-full bg-white p-3 sm:p-6 pb-2 border rounded-xl shadow-2xl">



      <h2 className="section-title">
  Recently Viewed
</h2>

      {/* SCROLL AREA */}
      <div className="mt-2  sm:mt-4  overflow-x-auto scrollbar-hide scroll-smooth">
        <div
  className="
    grid
    grid-flow-col
    auto-cols-[minmax(120px,160px)]
    sm:auto-cols-[minmax(160px,200px)]
    lg:auto-cols-[minmax(200px,220px)]
    gap-4 sm:gap-6
    pb-1 sm:pb-4
  "
>

          {loading ? (
  /* ===== RECENTLY VIEWED SKELETON ===== */
  Array.from({ length: 6 }).map((_, i) => (
    <article
      key={i}
      className="
        bg-white
        rounded-xl
        border border-gray-200
        shadow-md
        overflow-hidden
        animate-pulse
      "
    >
      {/* IMAGE */}
      <div className="relative w-full aspect-[16/10] bg-slate-200" />
    </article>
  ))
) : products.length > 0 ? (
  products.slice(0, 20).map((prd) => (
    <article
      key={prd._id}
      onClick={() => router.push(`/product/${prd._id}`)}
      className="
        group cursor-pointer
        bg-white rounded-xl
        border border-gray-200
        shadow-md hover:shadow-xl
        transition
      "
    >
      {/* IMAGE */}
      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xl">
        <Image
          src={prd?.images?.[0]  || "/images/placeholder.jpg"}
          alt={prd?.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          unoptimized
        />
      </div>
    </article>
  ))
) : (
  <p className="text-gray-500 text-sm">No recently viewed products</p>
)}

        </div>
      </div>
    </div>
  );
}
