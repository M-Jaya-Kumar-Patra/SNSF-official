"use client";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchDataFromApi } from "@/utils/api";

export default function ZeroResultSearches({ start, end, unit = "day" }) {
  const [series, setSeries] = useState([]);
  const [topZero, setTopZero] = useState([]);

  useEffect(() => {
    if (!start || !end) return;
    (async () => {
      const q = `/api/analytics/search/zero-results?start=${encodeURIComponent(
        start
      )}&end=${encodeURIComponent(end)}&unit=${unit}`;
      const res = await fetchDataFromApi(q, false);
      if (res?.success) {
        setSeries(
          res.timeseries.map((t) => ({
            time: new Date(t.time).toLocaleString(),
            count: t.count,
          }))
        );
        setTopZero(res.topZero || []);
      }
    })();
  }, [start, end, unit]);

  return (
    <div className="w-full p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Zero Result Searches
        </h2>
        <p className="text-sm text-slate-500">
          Searches returning no results
        </p>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={series}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4">
        <h4 className="text-sm font-semibold text-slate-700 mb-2">
          Top Zero-Result Queries
        </h4>
        <div className="max-h-40 overflow-y-auto border rounded-lg">
          {topZero.length ? (
            topZero.map((k, idx) => (
              <div
                key={idx}
                className="flex justify-between px-3 py-2 border-b last:border-b-0 text-sm"
              >
                <span className="truncate text-black">{k._id}</span>
                <span className="text-slate-500">({k.count})</span>
              </div>
            ))
          ) : (
            <div className="px-3 py-3 text-sm text-slate-500">
              No zero-result searches in this range
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
