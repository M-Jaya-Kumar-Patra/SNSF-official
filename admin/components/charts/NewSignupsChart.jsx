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

export default function NewSignupsChart({ type = "1day" }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await fetchDataFromApi(
        `/api/analytics/users/new-signups?type=${type}`,
        false
      );
      if (res?.success) {
        setData(
          res.data.map((r) => ({
            time: new Date(r.time).toLocaleString(),
            count: r.count,
          }))
        );
      }
    })();
  }, [type]);

  return (
    <div className="w-full p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-800">
          New User Signups
        </h2>
        <p className="text-sm text-slate-500">
          User registrations over time
        </p>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#7c3aed"
            fill="#7c3aed"
            fillOpacity={0.25}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
