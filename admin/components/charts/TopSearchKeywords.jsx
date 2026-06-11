// admin/components/charts/TopSearchKeywords.jsx
"use client";
import React, { useEffect, useState } from "react";
import { fetchDataFromApi } from "@/utils/api";

export default function TopSearchKeywords() {
  const [data, setData] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await fetchDataFromApi("/api/analytics/search/top-keywords?limit=20");
      if (res?.success) setData(res.data);
    })();
  }, []);
  return (
    <div className="rounded-2xl bg-[var(--admin-surface)] p-4 shadow">
      <h3 className="mb-2 font-semibold text-[var(--admin-text)]">Top Search Keywords</h3>
      <ol className="list-decimal pl-5 space-y-1">
        {data.map((d, i) => <li key={i}>{d._id} — {d.count}</li>)}
      </ol>
    </div>
  );
}
