"use client";

import React, { useEffect, useState } from "react";
import { fetchDataFromApi } from "@/utils/api";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function MostViewedProductsChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await fetchDataFromApi(
        "/api/analytics/products/most-viewed?limit=8",
        false
      );
      if (res?.success) {
        setData(
          res.data.map((r) => ({
            name: r.product?.name || "Unknown",
            views: r.views,
          }))
        );
      }
    })();
  }, []);

  return (
    <div className="w-full p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Most Viewed Products
        </h2>
        <p className="text-sm text-slate-500">
          Products attracting the most attention
        </p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart layout="vertical" data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis
            dataKey="name"
            type="category"
            width={220}
            tick={{ fontSize: 12 }}
          />
          <Tooltip />
          <Bar dataKey="views" fill="#2563eb" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
