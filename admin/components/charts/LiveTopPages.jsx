"use client";
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { fetchDataFromApi } from "@/utils/api";

export default function LiveTopPages() {
  const [data, setData] = useState([]);

  const load = async () => {
    const res = await fetchDataFromApi("/api/analytics/live/pages", false);
    if (res.success) {
      setData(res.pages.map(p => ({ page: p._id, views: p.views })));
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 bg-white rounded-2xl shadow w-full">
      <h3 className="font-semibold mb-2 text-black">Top Pages (Live)</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <XAxis dataKey="page" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="views" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
