"use client";
import React, { useEffect, useState } from "react";
import { fetchDataFromApi } from "@/utils/api";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#3b82f6", "#f59e0b", "#10b981"];

export default function SearchConversionFunnel({ start, end }) {
  const [funnel, setFunnel] = useState([]);

  useEffect(() => {
    if (!start || !end) return;
    (async () => {
      const q = `/api/analytics/search/funnel?start=${encodeURIComponent(
        start
      )}&end=${encodeURIComponent(end)}`;
      const res = await fetchDataFromApi(q, false);
      if (res?.success) setFunnel(res.funnel || []);
    })();
  }, [start, end]);

  const total = funnel.reduce((s, f) => s + f.value, 0) || 1;

  return (
    <div className="w-full p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Search Conversion Funnel
        </h2>
        <p className="text-sm text-slate-500">
          How searches convert into actions
        </p>
      </div>

      <div className="flex gap-6 items-center">
        <div className="w-48 h-48">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={funnel}
                dataKey="value"
                innerRadius={45}
                outerRadius={80}
              >
                {funnel.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-2">
          {funnel.map((f, i) => (
            <div key={i} className="flex justify-between text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded "
                  style={{ background: COLORS[i % COLORS.length] }}
                />
                <span className="text-black">{f.stage}</span>
              </div>
              <span className="font-semibold text-black">
                {f.value} ({Math.round((f.value / total) * 100)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
