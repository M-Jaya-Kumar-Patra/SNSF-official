"use client";

import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { fetchDataFromApi } from "@/utils/api";

export default function AvgSessionDurationChart({ type = "1day" }) {
  const [data, setData] = useState([]);
  const [average, setAverage] = useState(0);

  useEffect(() => {
    (async () => {
      const res = await fetchDataFromApi(
        `/api/analytics/sessions/avg-duration?type=${type}`,
        false
      );

      if (res?.success) {
        const formatted = res.data.map((r) => ({
          time: new Date(r.time).toLocaleString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "short",
          }),
          avgSeconds: Math.round(r.avgSeconds),
        }));

        setData(formatted);

        if (formatted.length) {
          const sum = formatted.reduce((s, x) => s + x.avgSeconds, 0);
          setAverage(Math.round(sum / formatted.length));
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
            Avg Session Duration
          </h2>
          <p className="text-sm text-slate-500">
            Average time users spend per session
          </p>
        </div>

        <div className="text-lg font-semibold text-slate-900">
          {average}s
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis allowDecimals={false} />
          <Tooltip
            content={({ active, payload, label }) =>
              active && payload && payload.length ? (
                <div className="bg-white border border-gray-300 shadow-md rounded-lg p-2 text-sm">
                  <p className="font-semibold text-gray-800">🕒 {label}</p>
                  <p className="text-cyan-600">
                    Avg Duration: {payload[0].value}s
                  </p>
                </div>
              ) : null
            }
          />
          <Area
            type="monotone"
            dataKey="avgSeconds"
            stroke="#06b6d4"
            fill="#06b6d4"
            fillOpacity={0.25}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
