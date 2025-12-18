"use client";

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { fetchDataFromApi } from "@/utils/api";

export default function LoginActivityChart() {
  const [range, setRange] = useState("1day");
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const ranges = {
    "1hour": "1 Hour",
    "12hour": "12 Hours",
    "1day": "1 Day",
    "7day": "7 Days",
    "6month": "6 Months",
    "1year": "1 Year",
  };

  const formatData = (list) =>
    list.map((r) => ({
      time: new Date(r.time).toLocaleString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "short",
      }),
      logins: r.logins,
    }));

  const loadPresetRange = async () => {
    const res = await fetchDataFromApi(
      `/api/analytics/logins/activity?type=${range}`,
      false
    );
    if (res?.success) {
      setTotal(res.total);
      setData(formatData(res.data));
    }
  };

  const loadCustomRange = async () => {
    if (!customStart || !customEnd) {
      alert("Select both start and end dates!");
      return;
    }

    const res = await fetchDataFromApi(
      `/api/analytics/logins/activity?start=${encodeURIComponent(
        customStart
      )}&end=${encodeURIComponent(customEnd)}`,
      false
    );

    if (res?.success) {
      setTotal(res.total);
      setData(formatData(res.data));
    }
  };

  useEffect(() => {
    loadPresetRange();
  }, [range]);

  return (
    <div className="w-full p-5 bg-white rounded-2xl border border-slate-200 shadow-md">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Login Activity
          </h2>
          <p className="text-sm text-slate-500">
            User login frequency across selected time range
          </p>
        </div>

        <p className="text-lg text-slate-600">
          Total Logins: <span className="font-bold">{total}</span>
        </p>
      </div>

      {/* Preset Ranges */}
      <div className="mb-4 flex flex-wrap gap-2">
        {Object.keys(ranges).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
             className={`px-3 py-1 rounded ${
              range === r
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {ranges[r]}
          </button>
        ))}
      </div>

      {/* Custom Range */}
      <div className="flex flex-wrap items-end gap-3 mb-4">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Start</label>
          <input
            type="datetime-local"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            className="border rounded-md p-1.5 text-sm text-black"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">End</label>
          <input
            type="datetime-local"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            className="border rounded-md p-1.5 text-sm text-black"
          />
        </div>

        <button
          onClick={loadCustomRange}
           className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Show Range
        </button>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis allowDecimals={false} />
          <Tooltip
            content={({ active, payload, label }) =>
              active && payload?.length ? (
                <div className="bg-white border border-gray-300 shadow-md rounded-lg p-2 text-sm">
                  <p className="font-semibold text-gray-800">🕒 {label}</p>
                  <p className="text-blue-600">
                    🔐 Logins: {payload[0].value}
                  </p>
                </div>
              ) : null
            }
          />
          <Line
            type="monotone"
            dataKey="logins"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
