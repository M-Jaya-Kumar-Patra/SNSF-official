// admin/components/VisitChart.js  (or VisitsOverTime.jsx)
"use client";

import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchDataFromApi } from "@/utils/api"; // your existing helper

const VisitsOverTime = () => {
  const [data, setData] = useState([]);
  const [range, setRange] = useState("1day");
  const [loading, setLoading] = useState(false);
  const [totalVisits, setTotalVisits] = useState(0);

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

  const fetchVisits = async (url) => {
    setLoading(true);
    try {
      const res = await fetchDataFromApi(url, false); // your helper
      if (res && res.success && Array.isArray(res.data)) {
        setData(res.data);
        setTotalVisits(res.totalVisits || 0);
      } else if (res && res.success && Array.isArray(res)) {
        // defensive: if helper returned array directly
        setData(res);
        setTotalVisits(0);
      } else {
        setData([]);
        setTotalVisits(0);
      }
    } catch (err) {
      console.error("fetchVisits error:", err);
      setData([]);
      setTotalVisits(0);
    }
    setLoading(false);
  };

  const fetchPresetRange = () => {
    fetchVisits(`/api/visit/getByRange?type=${range}`);
  };

  const fetchCustomRange = () => {
    if (!customStart || !customEnd) return alert("Select both start and end!");
    // ensure values are ISO-like; the input gives local-datetime string without timezone
    // We'll send them as-is; backend will parse in server timezone handling
    fetchVisits(`/api/visit/getCustomRange?start=${encodeURIComponent(customStart)}&end=${encodeURIComponent(customEnd)}`);
  };

  useEffect(() => {
    fetchPresetRange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  return (
    <div className="w-full p-5  shadow-md bg-white rounded-2xl border border-slate-200 ">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
         <div>
          <h2 className="text-lg font-semibold text-slate-800">
                    Traffic Overview
                  </h2>
                  <p className="text-sm text-slate-500">
                    Visits trend across selected time range
                  </p>
         </div>
        <p className="text-lg text-gray-600">
          Total Visits: <span className="font-bold">{totalVisits}</span>
        </p>
      </div>

      {/* Range Buttons */}
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

      {/* Custom Range Inputs */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div>
          <label className="block text-xs text-gray-600">Start</label>
          <input
            type="datetime-local"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            className="border rounded p-1 text-sm text-black"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-600">End</label>
          <input
            type="datetime-local"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            className="border rounded p-1 text-sm text-black"
          />
        </div>

        <button
          onClick={fetchCustomRange}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Show Range
        </button>
      </div>

      {/* Chart */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis domain={[0, "dataMax + 2"]} allowDecimals={false} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white border border-gray-300 shadow-md rounded-lg p-2 text-sm">
                      <p className="font-semibold text-gray-800">🕒 {label}</p>
                      <p className="text-blue-600">👀 Visits: {payload[0].value}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area type="monotone" dataKey="visits" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default VisitsOverTime;
