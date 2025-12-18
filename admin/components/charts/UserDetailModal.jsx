"use client";
import React, { useEffect, useState } from "react";
import { fetchDataFromApi } from "@/utils/api";

export default function UserDetailModal({ visitorId, onClose }) {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    if (visitorId) load();
  }, [visitorId]);

  const load = async () => {
    const res = await fetchDataFromApi(`/api/analytics/user/pages?visitorId=${visitorId}`, false);
    if (res.success) setPages(res.pages);
  };

  if (!visitorId) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-10 ">
      <div className="bg-white p-6 rounded-lg w-[400px] max-h-[90%] overflow-y-auto">
        <h3 className="font-semibold mb-4 text-black">User Page Engagement</h3>

        <ul className="space-y-2 overflow-auto ">
          {pages.map((p) => (
            <li key={p._id} className="p-2 bg-gray-100 rounded">
              <div className="font-medium text-black">{p._id}</div>
              <div className="text-sm text-gray-600">
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
