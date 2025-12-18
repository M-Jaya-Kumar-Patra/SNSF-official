"use client";

import React, { useEffect, useState } from "react";
import { fetchDataFromApi } from "@/utils/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function MostSearchedKeywords() {
  const [keywords, setKeywords] = useState([]);
  const [top10, setTop10] = useState([]);

  const loadKeywords = async () => {
    const res = await fetchDataFromApi("/api/analytics/search/most", false);
    if (res?.success) {
      setKeywords(res.data);
      setTop10(res.data.slice(0, 10));
    }
  };

  useEffect(() => {
    loadKeywords();
  }, []);

  return (
    <div className="w-full p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Most Searched Keywords
        </h2>
        <p className="text-sm text-slate-500">
          What users are actively searching for
        </p>
      </div>

      {/* Keyword Pills */}
      <div className="flex gap-2 overflow-x-auto pb-3">
        {keywords.map((k, index) => (
          <div
            key={index}
            className="flex-shrink-0 px-4 py-2 rounded-full
                       bg-slate-100 text-slate-700 text-sm
                       border border-slate-200
                       hover:bg-slate-200 transition cursor-default"
          >
            <span className="font-medium">{k.keyword}</span>
            <span className="ml-2 text-xs text-slate-500">
              {k.count}
            </span>
          </div>
        ))}
      </div>

      {/* Chart Title */}
      <div className="mt-6 mb-2">
        <h3 className="text-sm font-semibold text-slate-700">
          Top 10 Keywords
        </h3>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={top10}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="keyword"
            tick={{ fontSize: 11 }}
            interval={0}
            angle={-15}
            textAnchor="end"
          />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar
            dataKey="count"
            fill="#3b82f6"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
