// admin/components/charts/CountryBarChart.jsx
"use client";
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { fetchDataFromApi } from "@/utils/api";

export default function CountryBarChart({ type = "1day" }) {
  const [data, setData] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await fetchDataFromApi(`/api/analytics/visitors/country?type=${type}`);
      if (res?.success) {
        setData(res.data.map((r) => ({ country: r._id || "Unknown", value: r.count })));
      }
    })();
  }, [type]);
  return (
    <div className="rounded-2xl bg-[var(--admin-surface)] p-4 shadow">
      <h3 className="mb-2 font-semibold text-[var(--admin-text)]">Top Countries</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="country" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
