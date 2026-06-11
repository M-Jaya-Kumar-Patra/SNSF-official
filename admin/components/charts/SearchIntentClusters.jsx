"use client";
import React, { useEffect, useState } from "react";
import { fetchDataFromApi } from "@/utils/api";

export default function SearchIntentClusters({ start, end }) {
  const [clusters, setClusters] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!start || !end) return;
    (async () => {
      const q = `/api/analytics/search/intents?start=${encodeURIComponent(
        start
      )}&end=${encodeURIComponent(end)}&limitClusters=50&minSize=2`;
      const res = await fetchDataFromApi(q);
      if (res?.success) setClusters(res.data || []);
    })();
  }, [start, end]);

  return (
    <div className="w-full rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-[var(--admin-text)]">
          Search Intent Clusters
        </h2>
        <p className="text-sm text-[var(--admin-muted)]">
          Grouped search intent patterns
        </p>
      </div>

      {/* Cluster pills */}
      <div className="flex gap-2 overflow-x-auto pb-3">
        {clusters.map((c, i) => (
          <button
            key={i}
            onClick={() => setSelected(c)}
            className="flex-shrink-0 px-4 py-2 rounded-full
                       bg-slate-100 border border-slate-200
                       hover:bg-slate-200 transition text-sm"
          >
            <div className="font-medium text-black">{c.signature || "misc"}</div>
            <div className="text-xs text-slate-600">{c.total} searches</div>
          </button>
        ))}
      </div>

      {/* Selected cluster */}
      <div className="mt-4">
        {selected ? (
          <>
            <h4 className="text-sm font-semibold text-slate-700 mb-2">
              Sample Queries ({selected.total})
            </h4>
            <ul className="max-h-48 overflow-y-auto text-sm border rounded-lg">
              {selected.queries.map((q, idx) => (
                <li
                  key={idx}
                  className="flex justify-between px-3 py-2 border-b last:border-b-0"
                >
                  <span className="truncate text-black">{q.query}</span>
                  <span className="text-slate-500">({q.count})</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-sm text-slate-500">
            Select a cluster to view queries
          </p>
        )}
      </div>
    </div>
  );
}
