// admin/components/charts/TopSearchKeywords.jsx
"use client";
import React, { useEffect, useState } from "react";
import { fetchDataFromApi } from "@/utils/api";

export default function TopSearchKeywords() {
  const [data, setData] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await fetchDataFromApi("/api/analytics/search/top-keywords?limit=20", false);
      if (res?.success) setData(res.data);
    })();
  }, []);
  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="font-semibold mb-2">Top Search Keywords</h3>
      <ol className="list-decimal pl-5 space-y-1">
        {data.map((d, i) => <li key={i}>{d._id} — {d.count}</li>)}
      </ol>
    </div>
  );
}
