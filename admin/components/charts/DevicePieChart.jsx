// admin/components/charts/DevicePieChart.jsx
"use client";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { fetchDataFromApi } from "@/utils/api";
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
export default function DevicePieChart({ type = "1day" }) {
  const [data, setData] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await fetchDataFromApi(`/api/analytics/visitors/device?type=${type}`, false);
      if (res?.success) {
        setData(res.data.map((r) => ({ name: r._id || "Unknown", value: r.count })));
      }
    })();
  }, [type]);
  return (
    <div className="p-4 bg-white rounded-2xl shadow">
      <h3 className="font-semibold mb-2 text-black">Device Type</h3>
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
