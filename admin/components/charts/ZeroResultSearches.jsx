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
import { formatChartTime, formatTooltipTime } from "@/utils/chartTime";

export default function ZeroResultSearches({ start, end, unit = "day" }) {
  const [series, setSeries] = useState([]);
  const [topZero, setTopZero] = useState([]);

  useEffect(() => {
    if (!start || !end) return;

    (async () => {
      const query = `/api/analytics/search/zero-results?start=${encodeURIComponent(
        start
      )}&end=${encodeURIComponent(end)}&unit=${unit}`;
      const res = await fetchDataFromApi(query);

      if (res?.success) {
        setSeries(
          (res.timeseries || []).map((item) => ({
            timeRaw: item.time,
            timeLabel: formatChartTime(item.time, unit),
            count: item.count,
          }))
        );
        setTopZero(res.topZero || []);
      }
    })();
  }, [start, end, unit]);

  return (
    <div className="w-full rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-[var(--admin-text)]">
          Zero Result Searches
        </h2>
        <p className="text-sm text-[var(--admin-muted)]">
          Searches returning no results
        </p>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={series}>
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
                  <p className="text-red-600">Searches: {payload[0].value}</p>
                </div>
              ) : null
            }
          />
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
        <h4 className="mb-2 text-sm font-semibold text-[var(--admin-text)]">
          Top Zero-Result Queries
        </h4>
        <div className="max-h-40 overflow-y-auto rounded-lg border border-[var(--admin-border)]">
          {topZero.length ? (
            topZero.map((keyword, index) => (
              <div
                key={`${keyword._id}-${index}`}
                className="flex justify-between border-b border-[var(--admin-border)] px-3 py-2 text-sm last:border-b-0"
              >
                <span className="truncate text-[var(--admin-text)]">{keyword._id}</span>
                <span className="text-[var(--admin-muted)]">({keyword.count})</span>
              </div>
            ))
          ) : (
            <div className="px-3 py-3 text-sm text-[var(--admin-muted)]">
              No zero-result searches in this range
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
