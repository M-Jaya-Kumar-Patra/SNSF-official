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


  const formatDurationSmart = (seconds) => {
  if (!seconds || seconds < 1) return "0s";

  const minute = 60;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;   // average month
  const year = 365 * day;   // average year

  if (seconds < minute) {
    return `${seconds}s`;
  }

  if (seconds < hour) {
    const m = Math.floor(seconds / minute);
    const s = seconds % minute;
    return s ? `${m}m ${s}s` : `${m}m`;
  }

  if (seconds < day) {
    const h = Math.floor(seconds / hour);
    const m = Math.floor((seconds % hour) / minute);
    return m ? `${h}h ${m}m` : `${h}h`;
  }

  if (seconds < month) {
    const d = Math.floor(seconds / day);
    const h = Math.floor((seconds % day) / hour);
    return h ? `${d}d ${h}h` : `${d}d`;
  }

  if (seconds < year) {
    const mo = Math.floor(seconds / month);
    const d = Math.floor((seconds % month) / day);
    return d ? `${mo}mo ${d}d` : `${mo}mo`;
  }

  const y = Math.floor(seconds / year);
  const mo = Math.floor((seconds % year) / month);
  return mo ? `${y}y ${mo}mo` : `${y}y`;
};


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
  {formatDurationSmart(average)}
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
  Avg Duration: {formatDurationSmart(payload[0].value)}
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
