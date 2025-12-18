"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { fetchDataFromApi } from "@/utils/api";

export default function MostViewedPagesChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await fetchDataFromApi(
        `/api/analytics/pages/most-viewed?limit=8`,
        false
      );
      if (res?.success) {
        setData(
          res.data.map((r) => ({
            page: r._id,
            views: r.views,
          }))
        );
      }
    })();
  }, []);

   const handleBarClick = (payload) => {
    if (!payload?.page) return;

    const baseUrl = "https://snsteelfabrication.com";
    const finalUrl = `${baseUrl}${payload.page}`;

    window.open(finalUrl, "_blank"); // 👈 open live site
  };

  return (
    <div className="w-full p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Most Viewed Pages
        </h2>
        <p className="text-sm text-slate-500">
          Pages with highest view count
        </p>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <BarChart layout="vertical" data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis
            dataKey="page"
            type="category"
            width={220}
            tick={{ fontSize: 12 }}
          />
          <Tooltip />
          <Bar dataKey="views" fill="#7c3aed" radius={[0, 6, 6, 0]} 
                      cursor="pointer"
                      onClick={(e) => handleBarClick(e.payload)}
                    />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
