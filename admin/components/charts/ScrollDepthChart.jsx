"use client";

import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fetchDataFromApi } from "@/utils/api";

export default function ScrollDepthChart() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const res = await fetchDataFromApi("/api/analytics/scrollDepth/top");
    if (res?.success) {
      setData(
        (res.data || []).map((item) => ({
          page: item.page,
          depth: item.avgScroll,
        }))
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBarClick = (payload) => {
    if (!payload?.page) return;
    window.open(`https://snsteelfabrication.com${payload.page}`, "_blank");
  };

  return (
    <div className="rounded-2xl bg-[var(--admin-surface)] p-4 shadow">
      <h3 className="mb-3 font-semibold text-[var(--admin-text)]">
        Top Pages by Scroll Depth
      </h3>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="page"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) =>
              value.length > 15 ? `${value.slice(0, 15)}...` : value
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
            onClick={(event) => handleBarClick(event.payload)}
          />
        </BarChart>
      </ResponsiveContainer>

      <p className="mt-2 text-xs text-[var(--admin-muted)]">
        Click a bar to open the live website page
      </p>
    </div>
  );
}
