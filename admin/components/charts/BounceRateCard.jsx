"use client";

import React, { useEffect, useState } from "react";
import { fetchDataFromApi } from "@/utils/api";

export default function BounceRateCard({ type = "1day" }) {
  const [data, setData] = useState({
    total: 0,
    bounces: 0,
    bounceRate: 0,
  });

  useEffect(() => {
    (async () => {
      const res = await fetchDataFromApi(
        `/api/analytics/sessions/bounce-rate?type=${type}`,
        false
      );
      if (res?.success) setData(res.data);
    })();
  }, [type]);

  const rate = Number(data.bounceRate ?? 0);

  return (
    <div className="w-full p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">

      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800">
          Bounce Rate
        </h2>
        <p className="text-sm text-slate-500">
          Percentage of single-page sessions
        </p>
      </div>

      {/* Main KPI */}
      <div className="mt-4">
        <div
          className={`text-4xl font-bold ${
            rate < 40
              ? "text-emerald-600"
              : rate < 60
              ? "text-amber-500"
              : "text-rose-600"
          }`}
        >
          {rate}%
        </div>
      </div>

      {/* Footer stats */}
      <div className="mt-3 flex justify-between text-sm text-slate-500">
        <span>Total Sessions: <strong>{data.total}</strong></span>
        <span>Bounces: <strong>{data.bounces}</strong></span>
      </div>
    </div>
  );
}
