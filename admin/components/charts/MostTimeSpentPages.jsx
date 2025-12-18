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

export default function MostTimeSpentPages() {
  const [data, setData] = useState([]);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    (async () => {
      const res = await fetchDataFromApi(
        `/api/analytics/pages/timeSpent`,
        false
      );
      if (res?.success) {
        const arr = res.data.map((item) => ({
          page: item.pageName,
          time: item.totalTime,
        }));
        setData(arr);
        setTotalTime(arr.reduce((s, x) => s + x.time, 0));
      }
    })();
  }, []);

   const handleBarClick = (payload) => {
    if (!payload?.page) return;

    const baseUrl = "https://snsteelfabrication.com";
    const finalUrl = `${baseUrl}${payload.page}`;

    window.open(finalUrl, "_blank"); // 👈 open live site
  };

  return (
    <div className="w-full p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Time Spent per Page
          </h2>
          <p className="text-sm text-slate-500">
            Pages with highest engagement time
          </p>
        </div>
        <div className="text-lg font-bold text-slate-700">
          {totalTime} sec
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="page" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="time" fill="#8b5cf6" radius={[6, 6, 0, 0]} 

          
                                cursor="pointer"
                                onClick={(e) => handleBarClick(e.payload)}
                              />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
