"use client";

import React, { useRef, useState, useEffect } from "react";
import { Josefin_Sans } from "next/font/google";
import Image from "next/image";
import Skeleton from "@mui/material/Skeleton";
import { useRouter } from "next/navigation";
import { fetchDataFromApi } from "@/utils/api";
import { useAuth } from "@/app/context/AuthContext";

const joSan = Josefin_Sans({ subsets: ["latin"], weight: "400" });

const HotDeal = () => {
  const router = useRouter();
  const scrollRef = useRef(null);
  const { setLoading, isCheckingToken } = useAuth();

  const [data, setData] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    const loadHotDeal = async () => {
      try {
        const res = await fetchDataFromApi(
          "/api/home-sections?sectionName=dealsOfTheWeek",
          false
        );
        if (!res?.error) setData(res?.data || []);
      } finally {
        setLoading(false);
      }
    };
    loadHotDeal();
  }, []);

  return (
    <div className="hotDeal w-full p-6 pb-4  border rounded-xl shadow-2xl overflow-hidden bg-white flex flex-col">
      <h2 className={`text-2xl lg:text-3xl font-bold mb-3 ${joSan.className} text-slate-900`}>
        Deals of the Week
      </h2>

      <div
          ref={scrollRef}
          className="overflow-x-auto  whitespace-nowrap scroll-smooth scrollbar-hide p-2"
        >
          <div className="flex gap-6">
          {data?.length > 0 ? (
            data
              .filter((x) => x?.enabled)
              .slice(0, 5)
              .map((prd, idx) => (
                <div
                  key={idx}
                  onClick={() =>
                    router.push(`/product/${prd?.product?._id}`)
                  }
                  className="
                    w-[260px] shrink-0
                    bg-white rounded-xl
                    shadow-md hover:shadow-xl
                    transition cursor-pointer group
                  "
                >
                  {/* IMAGE */}
                  <div
                    className="relative w-full overflow-hidden rounded-xl"
                    style={{ aspectRatio: "16 / 10" }}
                  >
                    <Image
                      src={
                        prd?.product?.images?.[0] ||
                        "/placeholder.jpg"
                      }
                      alt={prd?.product?.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized
                    />
                  </div>
                </div>
              ))
          ) : (isCheckingToken || !hydrated) ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="w-[260px] shrink-0 bg-white rounded-xl shadow-md overflow-hidden"
                style={{ aspectRatio: "16 / 10" }}
              >
                <Skeleton variant="rectangular" width="100%" height="100%" />
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              No deals available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotDeal;
