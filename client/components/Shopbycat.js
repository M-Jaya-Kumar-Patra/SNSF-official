"use client";

import React, { useEffect, useState } from "react";
import { useCat } from "@/app/context/CategoryContext";
import { useAuth } from "@/app/context/AuthContext";
import {
  BedDouble,
  Boxes,
  Home,
  LampDesk,
  Laptop,
  Package,
  Sofa,
  UtensilsCrossed,
} from "lucide-react";

const categoryIcons = {
  sofas: Sofa,
  "living room": Home,
  bedroom: BedDouble,
  dining: UtensilsCrossed,
  "study & office": Laptop,
  "home decor": LampDesk,
  accessories: Boxes,
};

const getCategoryIcon = (name) => {
  const Icon = categoryIcons[name?.toLowerCase()] || Package;
  return <Icon className="h-6 w-6 text-slate-900" strokeWidth={1.9} />;
};

const Shopbycat = () => {
  const { catData } = useCat();
  const { isCheckingToken } = useAuth();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const sortedCatData = (catData || []).slice().sort((a, b) => a.sln - b.sln);
  const isLoading = isCheckingToken || !hydrated || sortedCatData.length === 0;

  const renderCategories = () => {
    if (isLoading) {
      return Array.from({ length: 8 }).map((_, index) => (
        <div
          key={`category-skeleton-${index}`}
          className="min-w-[88px] rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:min-w-[118px] sm:p-4"
        >
          <div className="mx-auto h-12 w-12 animate-pulse rounded-2xl bg-slate-200 sm:h-14 sm:w-14" />
          <div className="mx-auto mt-3 h-3 w-14 animate-pulse rounded bg-slate-200" />
        </div>
      ));
    }

    return sortedCatData.map((cat) => (
      <a
        key={cat._id}
        href={`/ProductListing?catId=${cat._id}`}
        className="min-w-[88px] rounded-2xl border border-slate-200 bg-white p-3 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md active:scale-[0.98] sm:min-w-[118px] sm:p-4"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 ring-1 ring-slate-200 sm:h-14 sm:w-14">
          {getCategoryIcon(cat?.name)}
        </div>

        <p className="mt-2 line-clamp-2 min-h-[32px] text-[11px] font-semibold leading-4 text-slate-800 sm:text-xs">
          {cat?.name}
        </p>
      </a>
    ));
  };

  return (
    <div className="flex w-full flex-col items-center">
      <div className="w-full px-3">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Browse
            </p>
            <h2 className="text-[22px] font-semibold leading-tight text-slate-950 sm:text-3xl">
              Shop by Category
            </h2>
          </div>
        </div>

        <div className="-mx-3 overflow-x-auto scroll-smooth px-3 pb-2 scrollbar-hide">
          <div className="flex gap-3 sm:justify-center sm:gap-4">
            {renderCategories()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shopbycat;
