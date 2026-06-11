"use client";
import React, { useEffect, useState } from "react";
import { fetchDataFromApi } from "@/utils/api";

export default function UserDetailModal({ visitorId, onClose }) {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    if (visitorId) load();
  }, [visitorId]);

  const load = async () => {
    const res = await fetchDataFromApi(`/api/analytics/user/pages?visitorId=${visitorId}`);
    if (res.success) setPages(res.pages);
  };

  if (!visitorId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90%] w-[400px] overflow-y-auto rounded-2xl bg-[var(--admin-surface)] p-6">
        <h3 className="mb-4 font-semibold text-[var(--admin-text)]">User Page Engagement</h3>

        <ul className="space-y-2 overflow-auto ">
          {pages.map((p) => (
            <li key={p._id} className="rounded bg-[var(--admin-surface-soft)] p-2">
              <div className="font-medium text-[var(--admin-text)]">{p._id}</div>
              <div className="text-sm text-[var(--admin-muted)]">
                Views: {p.views} — Time: {p.totalTime}s
              </div>
            </li>
          ))}
        </ul>

        <button
          onClick={onClose}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
