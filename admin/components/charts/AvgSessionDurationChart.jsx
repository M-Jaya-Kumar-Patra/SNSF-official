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

const formatDurationSmart = (seconds) => {
  if (!seconds || seconds < 1) return "0s";

  const minute = 60;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 365 * day;

  if (seconds < minute) return `${seconds}s`;
  if (seconds < hour) {
    const minutes = Math.floor(seconds / minute);
    const remainingSeconds = seconds % minute;
    return remainingSeconds ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }
  if (seconds < day) {
    const hours = Math.floor(seconds / hour);
    const minutes = Math.floor((seconds % hour) / minute);
    return minutes ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  if (seconds < month) {
    const days = Math.floor(seconds / day);
    const hours = Math.floor((seconds % day) / hour);
    return hours ? `${days}d ${hours}h` : `${days}d`;
  }
  if (seconds < year) {
    const months = Math.floor(seconds / month);
    const days = Math.floor((seconds % month) / day);
    return days ? `${months}mo ${days}d` : `${months}mo`;
  }

  const years = Math.floor(seconds / year);
  const months = Math.floor((seconds % year) / month);
  return months ? `${years}y ${months}mo` : `${years}y`;
};

export default function AvgSessionDurationChart({ type = "1day" }) {
  const [data, setData] = useState([]);
  const [average, setAverage] = useState(0);

  useEffect(() => {
    (async () => {
      const res = await fetchDataFromApi(`/api/analytics/sessions/avg-duration?type=${type}`);

      if (res?.success) {
        const formatted = (res.data || []).map((row) => ({
          timeRaw: row.time,
          timeLabel: formatChartTime(row.time, type),
          avgSeconds: Math.round(row.avgSeconds),
        }));

        setData(formatted);

        if (formatted.length) {
          const sum = formatted.reduce((total, item) => total + item.avgSeconds, 0);
          setAverage(Math.round(sum / formatted.length));
        } else {
          setAverage(0);
        }
      }
    })();
  }, [type]);

  return (
    <div className="w-full rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--admin-text)]">
            Avg Session Duration
          </h2>
          <p className="text-sm text-[var(--admin-muted)]">
            Average time users spend per session
          </p>
        </div>
        <div className="text-lg font-semibold text-[var(--admin-text)]">
          {formatDurationSmart(average)}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
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
