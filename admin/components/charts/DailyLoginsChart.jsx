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
import { formatChartTime, formatTooltipTime } from "@/utils/chartTime";

export default function DailyLoginsChart({ type = "1day" }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await fetchDataFromApi(`/api/analytics/users/daily-logins?type=${type}`);
      if (res?.success) {
        setData(
          (res.data || []).map((row) => ({
            timeRaw: row.time,
            timeLabel: formatChartTime(row.time, type),
            count: row.count,
          }))
        );
      }
    })();
  }, [type]);

  return (
    <div className="w-full rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-[var(--admin-text)]">
          Daily Login Activity
        </h2>
        <p className="text-sm text-[var(--admin-muted)]">
          Number of user logins over time
        </p>
      </div>

      <ResponsiveContainer width="100%" height={260}>
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
                  <p className="text-emerald-600">Logins: {payload[0].value}</p>
                </div>
              ) : null
            }
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.25}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
