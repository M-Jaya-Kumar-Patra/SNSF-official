"use client";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchDataFromApi } from "@/utils/api";

export default function TopSearchedCategories({ start, end, limit = 10 }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!start || !end) return;
    (async () => {
      const q = `/api/analytics/search/top-categories?start=${encodeURIComponent(
        start
      )}&end=${encodeURIComponent(end)}&limit=${limit}`;
      const res = await fetchDataFromApi(q, false);
      if (res?.success) setData(res.data || []);
    })();
  }, [start, end, limit]);

  return (
    <div className="w-full p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Top Searched Categories
        </h2>
        <p className="text-sm text-slate-500">
          Categories users are actively searching
        </p>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart layout="vertical" data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false} />
          <YAxis dataKey="cat" type="category" width={200} />
          <Tooltip />
          <Bar dataKey="count" fill="#10b981" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
