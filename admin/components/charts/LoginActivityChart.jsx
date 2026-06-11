"use client";

import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fetchDataFromApi } from "@/utils/api";
import { formatChartTime, formatTooltipTime, toApiDateTime } from "@/utils/chartTime";

const ranges = {
  "1hour": "1 Hour",
  "12hour": "12 Hours",
  "1day": "1 Day",
  "7day": "7 Days",
  "6month": "6 Months",
  "1year": "1 Year",
};

export default function LoginActivityChart() {
  const [range, setRange] = useState("1day");
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const formatData = (list, selectedRange = range) =>
    list.map((row) => ({
      timeRaw: row.time,
      timeLabel: formatChartTime(row.time, selectedRange),
      logins: row.logins,
    }));

  const loadPresetRange = async () => {
    const res = await fetchDataFromApi(`/api/analytics/logins/activity?type=${range}`);
    if (res?.success) {
      setTotal(res.total);
      setData(formatData(res.data || [], range));
    }
  };

  const loadCustomRange = async () => {
    if (!customStart || !customEnd) {
      alert("Select both start and end dates!");
      return;
    }

    const res = await fetchDataFromApi(
      `/api/analytics/logins/activity?start=${encodeURIComponent(
        toApiDateTime(customStart)
      )}&end=${encodeURIComponent(toApiDateTime(customEnd))}`
    );

    if (res?.success) {
      setTotal(res.total);
      setData(formatData(res.data || [], "custom"));
    }
  };

  useEffect(() => {
    loadPresetRange();
  }, [range]);

  return (
    <div className="w-full rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--admin-text)]">
            Login Activity
          </h2>
          <p className="text-sm text-[var(--admin-muted)]">
            User login frequency across selected time range
          </p>
        </div>
        <p className="text-sm font-semibold text-[var(--admin-muted)]">
          Total Logins: <span className="text-[var(--admin-text)]">{total}</span>
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {Object.entries(ranges).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setRange(key)}
            className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition ${
              range === key
                ? "bg-[var(--admin-accent)] text-white"
                : "bg-[var(--admin-surface-soft)] text-[var(--admin-muted)] hover:text-[var(--admin-text)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <label className="text-xs font-semibold text-[var(--admin-muted)]">
          Start
          <input
            type="datetime-local"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            className="mt-1 block rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none"
          />
        </label>

        <label className="text-xs font-semibold text-[var(--admin-muted)]">
          End
          <input
            type="datetime-local"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            className="mt-1 block rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none"
          />
        </label>

        <button
          onClick={loadCustomRange}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Show Range
        </button>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timeLabel" />
          <YAxis allowDecimals={false} />
          <Tooltip
            content={({ active, payload, label }) =>
              active && payload?.length ? (
                <div className="rounded-lg border border-gray-300 bg-white p-2 text-sm shadow-md">
                  <p className="font-semibold text-gray-800">
                    Time: {formatTooltipTime(payload[0].payload?.timeRaw || label)}
                  </p>
                  <p className="text-blue-600">Logins: {payload[0].value}</p>
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
