"use client";
import React, { useEffect, useState } from "react";
import { fetchDataFromApi } from "@/utils/api";

export default function ActiveUsersWidget() {
  const [count, setCount] = useState(0);

  const load = async () => {
    const res = await fetchDataFromApi("/api/analytics/active-users");
    if (res.success) setCount(res.activeCount);
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full rounded-2xl bg-blue-600 p-4 text-white shadow">
      <h3 className="font-semibold text-lg">Active Users (Live)</h3>
      <p className="text-4xl font-bold text-center mt-2">{count}</p>
    </div>
  );
}
