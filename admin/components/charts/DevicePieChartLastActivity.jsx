"use client";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { fetchDataFromApi } from "@/utils/api";

const COLORS = ["#3b82f6", "#10b981", "#f97316"];

export default function DevicePieChartLastActivity() {
  const [data, setData] = useState([]);

  const load = async () => {
    const res = await fetchDataFromApi("/api/analytics/active-users/device", false);
    if (res.success) {
      setData(
        res.deviceStats.map((d, i) => ({
          name: d._id || "Unknown",
          value: d.count
        }))
      );
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="p-4 bg-white rounded shadow w-full">
      <h3 className="font-semibold mb-2 text-black">Devices (Live)</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            dataKey="value"
            data={data}
            outerRadius={100}
            label
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
