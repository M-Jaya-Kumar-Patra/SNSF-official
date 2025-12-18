"use client";
import React, { useEffect, useState } from "react";
import { fetchDataFromApi } from "@/utils/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function UserPageAnalyticsPanel({ open, visitorId, onClose }) {
  const [pages, setPages] = useState([]);

  const loadPages = async () => {
    if (!visitorId) return;

    const res = await fetchDataFromApi(
      `/api/analytics/timeSpent/userPages?visitorId=${visitorId}`,
      false
    );

    if (res?.success) {
      setPages(
        res.data.map((p) => ({
          page: p.page,
          time: p.time,
        }))
      );
    }
  };

  useEffect(() => {
    if (open) loadPages();
  }, [open]);

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[380px] bg-white shadow-xl transform transition-all duration-300 z-50
      ${open ? "translate-x-0" : "translate-x-full"}`}
    >
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-semibold text-lg text-black">User Page Activity</h3>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-black text-xl font-bold"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
        {pages.length === 0 ? (
          <p className="text-gray-500">No data for this user.</p>
        ) : (
          <div>
            <h4 className="text-black font-semibold mb-3">Most Time Spent Pages</h4>

            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={pages}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="page" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="time" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>

            {/* Table also */}
            <table className="w-full text-sm text-left mt-4">
              <thead>
                <tr className="bg-gray-100 text-black">
                  <th className="p-2">Page</th>
                  <th className="p-2">Time (s)</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((p, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-2">{p.page}</td>
                    <td className="p-2 font-semibold">{p.time}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
