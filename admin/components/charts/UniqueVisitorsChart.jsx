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

const UniqueVisitorsChart = () => {
  const [data, setData] = useState([]);
  const [range, setRange] = useState("1day");
  const [loading, setLoading] = useState(false);
  const [totalVisitors, setTotalVisitors] = useState(0);

  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const ranges = {
    "1hour": "1 Hour",
    "12hour": "12 Hours",
    "1day": "1 Day",
    "7day": "7 Days",
    "1month": "1 Month",
    "6month": "6 Months",
    "1year": "1 Year",
  };

  /* ---------------- Range helpers ---------------- */
  const getPresetRange = () => {
    const now = new Date();
    const start = new Date(now);

    switch (range) {
      case "1hour":
        start.setHours(now.getHours() - 1);
        break;
      case "12hour":
        start.setHours(now.getHours() - 12);
        break;
      case "1day":
        start.setDate(now.getDate() - 1);
        break;
      case "7day":
        start.setDate(now.getDate() - 7);
        break;
      case "1month":
        start.setMonth(now.getMonth() - 1);
        break;
      case "6month":
        start.setMonth(now.getMonth() - 6);
        break;
      case "1year":
        start.setFullYear(now.getFullYear() - 1);
        break;
      default:
        start.setDate(now.getDate() - 1);
    }

    return {
      startISO: start.toISOString(),
      endISO: now.toISOString(),
    };
  };

  /* ---------------- Fetch ---------------- */
  const fetchVisitors = async (url) => {
    setLoading(true);
    try {
      const res = await fetchDataFromApi(url, false);

      if (res?.success) {
        const formatted = res.data.map((r) => ({
          time: new Date(r.time).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          visitors: r.count,
        }));

        setData(formatted);
        setTotalVisitors(
          formatted.reduce((sum, x) => sum + x.visitors, 0)
        );
      } else {
        setData([]);
        setTotalVisitors(0);
      }
    } catch (err) {
      console.error("Unique visitors error:", err);
      setData([]);
      setTotalVisitors(0);
    }
    setLoading(false);
  };

  const fetchPresetRange = () => {
    const { startISO, endISO } = getPresetRange();
    fetchVisitors(
      `/api/analytics/visitors/bucketed?start=${startISO}&end=${endISO}`
    );
  };

  const fetchCustomRange = () => {
    if (!customStart || !customEnd)
      return alert("Select both start and end!");

    fetchVisitors(
      `/api/analytics/visitors/bucketed?start=${encodeURIComponent(
        customStart
      )}&end=${encodeURIComponent(customEnd)}`
    );
  };

  useEffect(() => {
    fetchPresetRange();
  }, [range]);

  return (
    <div className="w-full p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Unique Visitors
          </h2>
          <p className="text-sm text-slate-500">
            Distinct users over selected time period
          </p>
        </div>

        <div className="text-lg font-semibold text-slate-900">
          {totalVisitors}
        </div>
      </div>

      {/* Preset Ranges */}
      <div className="mb-4 flex flex-wrap gap-2">
        {Object.keys(ranges).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-3 py-1 rounded text-sm ${
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
          <label className="block text-xs text-slate-600 mb-1">Start</label>
          <input
            type="datetime-local"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            className="border rounded px-2 py-1 text-sm text-black"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">End</label>
          <input
            type="datetime-local"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            className="border rounded px-2 py-1 text-sm text-black"
          />
        </div>

        <button
          onClick={fetchCustomRange}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
        >
          Show Range
        </button>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="text-sm text-slate-500">Loading…</div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="visitors"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.25}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default UniqueVisitorsChart;
