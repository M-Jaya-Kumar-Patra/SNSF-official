"use client";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { fetchDataFromApi } from "@/utils/api";
import formatDurationUptoHour from "@/utils/timeFormat";


const COLORS = ["#3b82f6", "#10b981", "#f97316"];

export default function TimeSpentByDevice() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const res = await fetchDataFromApi(
      "/api/analytics/timeSpent/device",
      false
    );

    if (res?.success) {
      setData(
        res.data.map((x) => ({
          name: x.device,
          value: x.totalTime, // seconds (raw)
        }))
      );
    } else {
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4 rounded-2xl bg-white shadow">
      <h3 className="font-semibold text-black mb-3">
        Time Spent by Device
      </h3>

      {data.length === 0 ? (
        <div className="h-[260px] flex items-center justify-center text-slate-400">
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, value }) =>
                `${name}: ${formatDurationUptoHour(value)}`
              }
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip
              formatter={(value, name) => [
                formatDurationUptoHour(value),
                name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
