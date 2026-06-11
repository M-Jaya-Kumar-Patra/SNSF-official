// admin/components/charts/BrowserPieChart.jsx
"use client";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { fetchDataFromApi } from "@/utils/api";
const COLORS = ["#2563eb","#ef4444","#f59e0b","#10b981","#7c3aed","#06b6d4"];
export default function BrowserPieChart({ type = "1day" }) {
  const [data, setData] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await fetchDataFromApi(`/api/analytics/visitors/browser?type=${type}`);
      if (res?.success) {
        setData(res.data.map((r) => ({ name: r._id || "Unknown", value: r.count })));
      }
    })();
  }, [type]);
  return (
    <div className="rounded-2xl bg-[var(--admin-surface)] p-4 shadow">
      <h3 className="mb-2 font-semibold text-[var(--admin-text)]">Browser</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={70} label />
          <Tooltip />
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
