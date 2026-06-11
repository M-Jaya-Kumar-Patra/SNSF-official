"use client";

import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
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
  "1month": "1 Month",
  "6month": "6 Months",
  "1year": "1 Year",
};

const UniqueVisitorsChart = () => {
  const [data, setData] = useState([]);
  const [range, setRange] = useState("1day");
  const [loading, setLoading] = useState(false);
  const [totalVisitors, setTotalVisitors] = useState(0);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

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

  const fetchVisitors = async (url, selectedRange = range) => {
    setLoading(true);
    try {
      const res = await fetchDataFromApi(url);

      if (res?.success) {
        const formatted = (res.data || []).map((row) => ({
          timeRaw: row.time,
          timeLabel: formatChartTime(row.time, selectedRange),
          visitors: row.count,
        }));

        setData(formatted);
        setTotalVisitors(formatted.reduce((sum, item) => sum + item.visitors, 0));
      } else {
        setData([]);
        setTotalVisitors(0);
      }
    } catch {
      setData([]);
      setTotalVisitors(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomRange = () => {
    if (!customStart || !customEnd) {
      alert("Select both start and end!");
      return;
    }

    fetchVisitors(
      `/api/analytics/visitors/bucketed?start=${encodeURIComponent(
        toApiDateTime(customStart)
      )}&end=${encodeURIComponent(toApiDateTime(customEnd))}`,
      "custom"
    );
  };

  useEffect(() => {
    const { startISO, endISO } = getPresetRange();
    fetchVisitors(`/api/analytics/visitors/bucketed?start=${startISO}&end=${endISO}`, range);
  }, [range]);

  return (
    <div className="w-full rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--admin-text)]">
            Unique Visitors
          </h2>
          <p className="text-sm text-[var(--admin-muted)]">
            Distinct users over selected time period
          </p>
        </div>
        <div className="text-lg font-semibold text-[var(--admin-text)]">
          {totalVisitors}
        </div>
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
          onClick={fetchCustomRange}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Show Range
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-sm text-[var(--admin-muted)]">Loading...</div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data}>
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
                    <p className="text-blue-600">Visitors: {payload[0].value}</p>
                  </div>
                ) : null
              }
            />
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
