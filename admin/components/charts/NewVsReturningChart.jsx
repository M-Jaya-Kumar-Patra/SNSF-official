// admin/components/charts/NewVsReturningChart.jsx
"use client";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { fetchDataFromApi } from "@/utils/api";

const COLORS = ["#60a5fa", "#f97316"];
export default function NewVsReturningChart({ type = "1day" }) {
  const [data, setData] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await fetchDataFromApi(`/api/analytics/visitors/new-vs-returning?type=${type}`, false);
      if (res?.success) {
        setData([{ name: "New", value: res.data.new || 0 }, { name: "Returning", value: res.data.returning || 0 }]);
      }
    })();
  }, [type]);
  return (
    <div className="p-4 bg-white rounded-2xl shadow">
      <h3 className="font-semibold mb-2 text-black">New vs Returning</h3>
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
