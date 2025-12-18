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

export default function PagesPerSessionChart({ type = "1day" }) {
  const [data, setData] = useState([]);
  const [average, setAverage] = useState(0);

  useEffect(() => {
    (async () => {
      const res = await fetchDataFromApi(
        `/api/analytics/sessions/pages-per-session?type=${type}`,
        false
      );

      if (res?.success) {
        const formatted = res.data.map((r) => ({
          pages: r._id,
          sessions: r.count,
        }));

        setData(formatted);

        if (formatted.length) {
          const totalSessions = formatted.reduce(
            (sum, x) => sum + x.sessions,
            0
          );
          const weightedPages = formatted.reduce(
            (sum, x) => sum + x.pages * x.sessions,
            0
          );

          setAverage(
            totalSessions ? (weightedPages / totalSessions).toFixed(2) : 0
          );
        } else {
          setAverage(0);
        }
      }
    })();
  }, [type]);

  return (
    <div className="w-full p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Pages Per Session
          </h2>
          <p className="text-sm text-slate-500">
            Average number of pages viewed per session
          </p>
        </div>

        <div className="text-lg font-semibold text-slate-900">
          {average}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="pages"
            label={{
              value: "Pages",
              position: "insideBottom",
              offset: -5,
            }}
          />
          <YAxis allowDecimals={false} />
          <Tooltip
            content={({ active, payload, label }) =>
              active && payload && payload.length ? (
                <div className="bg-white border border-gray-300 shadow-md rounded-lg p-2 text-sm">
                  <p className="font-semibold text-gray-800">
                    📄 Pages: {label}
                  </p>
                  <p className="text-emerald-600">
                    Sessions: {payload[0].value}
                  </p>
                </div>
              ) : null
            }
          />
          <Bar
            dataKey="sessions"
            fill="#10b981"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
