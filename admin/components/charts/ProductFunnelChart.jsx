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

export default function MostTimeSpentProducts() {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await fetchDataFromApi(
        `/api/analytics/timeSpent/products?limit=10`,
        false
      );
      if (res?.success) {
        setData(
          res.data.map((p) => ({
            name: p.name,
            time: p.totalTime,
          }))
        );
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
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Time Spent on Products
        </h2>
        <p className="text-sm text-slate-500">
          Engagement duration per product
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11 }}
            angle={-20}
            textAnchor="end"
            interval={0}
          />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="time" fill="#6366f1" radius={[6, 6, 0, 0]} 
            
                                cursor="pointer"
                                onClick={(e) => handleBarClick(e.payload)}
                              />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
