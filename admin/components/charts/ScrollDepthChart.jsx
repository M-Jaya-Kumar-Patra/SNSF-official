
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

export default function ScrollDepthChart() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const res = await fetchDataFromApi("/api/analytics/scrollDepth/top", false);
    if (res?.success) {
      setData(
        res.data.map((x) => ({
          page: x.page,        // e.g. "/product/chair-123"
          depth: x.avgScroll,
        }))
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 External navigation
  const handleBarClick = (payload) => {
    if (!payload?.page) return;

    const baseUrl = "https://snsteelfabrication.com";
    const finalUrl = `${baseUrl}${payload.page}`;

    window.open(finalUrl, "_blank"); // 👈 open live site
  };

  return (
    <div className="p-4 bg-white rounded-2xl shadow">
      <h3 className="font-semibold text-black mb-3">
        Top Pages by Scroll Depth
      </h3>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="page"
            tick={{ fontSize: 12 }}
            tickFormatter={(v) =>
              v.length > 15 ? v.slice(0, 15) + "…" : v
            }
          />
          <YAxis />
          <Tooltip
            formatter={(value) => [`${value}%`, "Avg Scroll"]}
            labelFormatter={(label) => `Page: ${label}`}
          />

          <Bar
            dataKey="depth"
            fill="#f59e0b"
            cursor="pointer"
            onClick={(e) => handleBarClick(e.payload)}
          />
        </BarChart>
      </ResponsiveContainer>

      <p className="text-xs text-gray-500 mt-2">
        💡 Click a bar to open the live website page
      </p>
    </div>
  );
}
