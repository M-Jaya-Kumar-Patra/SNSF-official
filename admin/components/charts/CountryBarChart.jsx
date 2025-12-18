// admin/components/charts/CountryBarChart.jsx
"use client";
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { fetchDataFromApi } from "@/utils/api";

export default function CountryBarChart({ type = "1day" }) {
  const [data, setData] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await fetchDataFromApi(`/api/analytics/visitors/country?type=${type}`, false);
      if (res?.success) {
        setData(res.data.map((r) => ({ country: r._id || "Unknown", value: r.count })));
      }
    })();
  }, [type]);
  return (
    <div className="p-4 bg-white rounded-2xl shadow">
      <h3 className="font-semibold mb-2 text-black">Top Countries</h3>
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
