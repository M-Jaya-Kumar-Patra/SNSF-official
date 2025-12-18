"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchDataFromApi } from "@/utils/api";

const MostActiveUsers = () => {
  const [data, setData] = useState([]);
  const [range, setRange] = useState("1day");
  const [loading, setLoading] = useState(false);
  const [totalLogins, setTotalLogins] = useState(0);
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

  const fetchLogins = async (url) => {
    setLoading(true);
    try {
      const res = await fetchDataFromApi(url, false);
      if (res?.success) {
        setData(res.data);
        setTotalLogins(res.totalLogins || 0);
      } else {
        setData([]);
        setTotalLogins(0);
      }
    } catch (err) {
      console.error("MostActiveUsers error:", err);
      setData([]);
      setTotalLogins(0);
    }
    setLoading(false);
  };

  const fetchPreset = () => {
    fetchLogins(`/api/user/getMostActiveUsers?type=${range}`);
  };

  const fetchCustom = () => {
    if (!customStart || !customEnd) {
      alert("Select both start and end dates");
      return;
    }
    fetchLogins(
      `/api/user/getMostActiveUsers?start=${encodeURIComponent(
        customStart
      )}&end=${encodeURIComponent(customEnd)}`
    );
  };

  useEffect(() => {
    fetchPreset();
  }, [range]);

  return (
    <div className="w-full p-5 bg-white rounded-2xl border border-slate-200 shadow-md">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Most Active Users
          </h2>
          <p className="text-sm text-slate-500">
            Users with highest login frequency
          </p>
        </div>

        <p className="text-lg text-slate-600">
          Total Logins:{" "}
          <span className="font-bold text-slate-800">{totalLogins}</span>
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
          onClick={fetchCustom}
         className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Show Range
        </button>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="text-sm text-slate-500">Loading...</div>
      ) : (
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11 }}
              angle={-20}
              textAnchor="end"
            />
            <YAxis allowDecimals={false} />
            <Tooltip
              content={({ active, payload, label }) =>
                active && payload?.length ? (
                  <div className="bg-white border border-gray-300 shadow-md rounded-lg p-2 text-sm">
                    <p className="font-semibold text-gray-800">
                      👤 {label}
                    </p>
                    <p className="text-blue-600">
                      🔐 Logins: {payload[0].value}
                    </p>
                  </div>
                ) : null
              }
            />
            <Bar dataKey="logins" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default MostActiveUsers;
