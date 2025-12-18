"use client";

import React, { useEffect, useState } from "react";
import { fetchDataFromApi } from "@/utils/api";

export default function WishlistLeaderboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await fetchDataFromApi(
        "/api/analytics/products/most-wishlisted?limit=8",
        false
      );
      if (res?.success) setData(res.data);
    })();
  }, []);

  return (
    <div className="w-full p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Wishlist Leaderboard
        </h2>
        <p className="text-sm text-slate-500">
          Products users save the most
        </p>
      </div>

      <ul className="divide-y">
        {data.map((r, i) => (
          <li key={i} className="flex items-center gap-4 py-3">
            <img
              src={r.product?.images?.[0] || "/images/logo.png"}
              alt=""
              className="w-12 h-12 rounded-md object-cover border"
            />

            <div>
              <div className="font-medium text-slate-800">
                {r.product?.name || "Unknown"}
              </div>
              <div className="text-sm text-slate-500">
                Wishlisted {r.count} times
              </div>
            </div>

            <div className="ml-auto text-lg font-bold text-slate-700">
              {r.count}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
