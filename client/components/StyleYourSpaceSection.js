"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchDataFromApi } from "@/utils/api";
import { useAuth } from "@/app/context/AuthContext";
import { useScreen } from "@/app/context/ScreenWidthContext";
import TrendingGrid from "./TrendingGrid";
import { getCloudinaryImageUrl } from "@/utils/cloudinary";

const StyleYourSpaceSection = () => {
  const router = useRouter();
  const { setLoading } = useAuth();
  const { isXs } = useScreen();

  const [trendingData, setTrendingData] = useState([]);
  const [shopByRoomData, setShopByRoomData] = useState([]);

  const limit = isXs ? 8 : 12;

  useEffect(() => {
    const loadShopByRoom = async () => {
      try {
        const res = await fetchDataFromApi(
          "/api/style-your-space/getAll",
          false,
        );
        if (!res.error) setShopByRoomData(res?.data || []);
      } catch {
        setShopByRoomData([]);
      } finally {
        setLoading(false);
      }
    };

    const loadTrending = async () => {
      try {
        const res = await fetchDataFromApi(
          "/api/home-sections?sectionName=trendingNow",
          false,
        );
        if (!res.error) setTrendingData(res?.data || []);
      } catch {
        setTrendingData([]);
      } finally {
        setLoading(false);
      }
    };

    loadShopByRoom();
    loadTrending();
  }, [setLoading]);

  const roomCards = useMemo(
    () =>
      Array.isArray(shopByRoomData)
        ? shopByRoomData.filter((item) => item?.status).slice(0, 5)
        : [],
    [shopByRoomData],
  );

  const productsForGrid = useMemo(
    () =>
      Array.isArray(trendingData)
        ? trendingData
            .slice(0, limit + 1)
            .filter((item) => item?.enabled && item?.product)
            .map((item) => ({
              id: item.product._id,
              image: item.product.images?.[0] || "/placeholder.jpg",
              title: item.product.name,
            }))
        : [],
    [limit, trendingData],
  );

  return (
    <section className="w-full">
      <div className="grid w-full gap-4 lg:grid-cols-[430px_minmax(0,1fr)] lg:gap-5">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-200/70 sm:p-5">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Shop by room
              </p>
              <h2 className="section-title mt-1">Style Your Space</h2>
            </div>
            <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 sm:inline-flex">
              {roomCards.length || 4} rooms
            </span>
          </div>

          {roomCards.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {roomCards.map((room, index) => (
                <RoomCard
                  key={room?._id || index}
                  room={room}
                  index={index}
                  isLarge={index === 0}
                  isMobile={isXs}
                  onOpen={() => room?.url && router.push(room.url)}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className={`animate-pulse rounded-xl bg-slate-200 ${
                    index === 0
                      ? "col-span-2 aspect-[16/10]"
                      : "aspect-[4/3]"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-200/70 sm:p-5">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Popular picks
              </p>
              <h2 className="section-title mt-1">Trending Now</h2>
            </div>
            <span className="hidden rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 sm:inline-flex">
              Top designs
            </span>
          </div>

          <TrendingGrid
            products={productsForGrid}
            loading={productsForGrid.length === 0}
          />
        </div>
      </div>
    </section>
  );
};

function RoomCard({ room, index, isLarge, isMobile, onOpen }) {
  return (
    <button
      type="button"
      aria-label={`Open ${room?.name || "room collection"}`}
      onClick={onOpen}
      className={`group relative overflow-hidden rounded-xl bg-slate-100 text-left shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
        isLarge ? "col-span-2 aspect-[16/10]" : "aspect-[4/3]"
      }`}
    >
      <Image
        src={getCloudinaryImageUrl(room?.image?.[0] || "/images/placeholder.jpg", {
          width: isLarge ? 720 : 360,
          height: isLarge ? 450 : 270,
          crop: isMobile ? "fill" : "limit",
        })}
        alt={room?.name || "Room design"}
        fill
        sizes={
          isLarge
            ? "(max-width: 1024px) 100vw, 430px"
            : "(max-width: 1024px) 50vw, 210px"
        }
        className="object-cover brightness-95 contrast-105 transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            {isLarge && (
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-white/70">
                Featured room
              </p>
            )}
            <h3
              className={`line-clamp-2 font-semibold leading-tight text-white ${
                isLarge ? "text-lg sm:text-xl" : "text-sm sm:text-base"
              }`}
              title={room?.name}
            >
              {room?.name}
            </h3>
          </div>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/90 text-slate-900 transition group-hover:bg-white">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
        {String(index + 1).padStart(2, "0")}
      </span>
    </button>
  );
}

export default StyleYourSpaceSection;
