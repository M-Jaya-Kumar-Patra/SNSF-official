"use client";

import React, { useEffect, useState } from "react";
import { useCat } from "@/app/context/CategoryContext";
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";
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
import { getCloudinaryImageUrl } from "@/utils/cloudinary";

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
  return <Icon className="h-7 w-7 text-slate-900" strokeWidth={1.9} />;
};

const Shopbycat = () => {
  const { catData } = useCat();
  const { isCheckingToken } = useAuth();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const sortedCatData = (catData || []).slice().sort((a, b) => a.sln - b.sln);

  const catLength = sortedCatData.length;
  const mid = catLength % 2 === 0 ? catLength / 2 : Math.ceil(catLength / 2);

  const upperRow = sortedCatData.slice(0, mid);
  const lowerRow = sortedCatData.slice(mid);

  const renderRow = (items, rowKey) =>
    items.map((cat, index) => (
      <a
        key={`${rowKey}-${index}`}
        href={`/ProductListing?catId=${cat._id}`}
        className="w-[65px] h-[65px] sm:w-[100px] sm:h-[100px] md:w-[110px] md:h-[110px] lg:w-[200px] lg:h-[200px] bg-white rounded-full p-1 shadow-gray-400 shadow-md flex justify-center items-center transition-transform hover:scale-110 hover:shadow-lg hover:shadow-gray-500"
      >
        {cat?.images?.[0] ? (
          <Image
            src={getCloudinaryImageUrl(cat.images[0], {
              width: 160,
              height: 160,
            })}
            width={100}
            height={100}
            className="rounded-full object-cover"
            alt="Category"
          />
        ) : (
          <span className="block h-full w-full rounded-full bg-slate-200 animate-pulse" />
        )}
      </a>
    ));

  const renderSkeletonRow = (count, rowKey) =>
    Array.from({ length: count }).map((_, index) => (
      <div
        key={`${rowKey}-skeleton-${index}`}
        className="w-[65px] h-[65px] sm:w-[100px] sm:h-[100px] md:w-[110px] md:h-[110px] bg-white rounded-full p-1 shadow-gray-400 shadow-md flex justify-center items-center"
      >
        <span className="block h-full w-full rounded-full bg-slate-200 animate-pulse" />
      </div>
    ));

  const renderMobileCategories = () => {
    if (isCheckingToken || !hydrated || catLength === 0) {
      return Array.from({ length: 6 }).map((_, index) => (
        <div
          key={`mobile-category-skeleton-${index}`}
          className="min-w-[88px] rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
        >
          <div className="mx-auto h-12 w-12 animate-pulse rounded-2xl bg-slate-200" />
          <div className="mx-auto mt-3 h-3 w-14 animate-pulse rounded bg-slate-200" />
        </div>
      ));
    }

    return sortedCatData.map((cat) => (
      <a
        key={`mobile-category-${cat._id}`}
        href={`/ProductListing?catId=${cat._id}`}
        className="min-w-[88px] rounded-2xl border border-slate-200 bg-white p-3 text-center shadow-sm transition active:scale-[0.98]"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 ring-1 ring-slate-200">
          {getCategoryIcon(cat?.name)}
        </div>
        <p className="mt-2 line-clamp-2 min-h-[32px] text-[11px] font-semibold leading-4 text-slate-800">
          {cat?.name}
        </p>
      </a>
    ));
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full px-3 sm:hidden">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Browse
            </p>
            <h2 className="text-[22px] font-semibold leading-tight text-slate-950">
              Shop by Category
            </h2>
          </div>
        </div>

        <div className="-mx-3 overflow-x-auto scroll-smooth px-3 pb-1 scrollbar-hide">
          <div className="flex gap-3">{renderMobileCategories()}</div>
        </div>
      </div>

      <h2 className="section-title hidden sm:block">Shop by Category</h2>

      <div className="hidden flex-col items-center justify-center w-full gap-4 mt-4 sm:mt-6 md:mt-8 sm:flex">
        <div className="flex justify-center flex-wrap gap-2 sm:gap-5">
          {isCheckingToken || !hydrated || catLength === 0
            ? renderSkeletonRow(mid || 4, "upper")
            : renderRow(upperRow, "upper")}
        </div>

        {lowerRow.length > 0 && (
          <div className="flex justify-center flex-wrap gap-2 sm:gap-5">
            {isCheckingToken || !hydrated || catLength === 0
              ? renderSkeletonRow(catLength - mid || 3, "lower")
              : renderRow(lowerRow, "lower")}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shopbycat;
