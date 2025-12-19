"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { fetchDataFromApi } from "@/utils/api";
import formatDurationUptoHour from "@/utils/timeFormat";

export default function TimeSpentByUserType() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    (async () => {
      const res = await fetchDataFromApi(
        `/api/analytics/timeSpent/userType`,
        false
      );
      if (res?.success) {
        const arr = res.data.map((x) => ({
          type: x.userType,
          time: x.totalTime,
        }));
        setData(arr);
        setTotal(arr.reduce((s, x) => s + x.time, 0));
      }
    })();
  }, []);

  return (
    <div className="w-full p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Time Spent by User Type
          </h2>
          <p className="text-sm text-slate-500">
            Engagement comparison by user segment
          </p>
        </div>
        <div className="text-lg font-bold text-slate-700">
          {formatDurationUptoHour(total)}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="type" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="time" fill="#10b981" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
