"use client";
import React, { useEffect, useState } from "react";
import { fetchDataFromApi } from "@/utils/api";

export default function ActiveUsersWidget() {
  const [count, setCount] = useState(0);

  const load = async () => {
    const res = await fetchDataFromApi("/api/analytics/active-users", false);
    console.log("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF", res)
    if (res.success) setCount(res.activeCount);
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 bg-blue-600 text-white rounded shadow w-full">
      <h3 className="font-semibold text-lg">Active Users (Live)</h3>
      <p className="text-4xl font-bold text-center mt-2">{count}</p>
    </div>
  );
}
