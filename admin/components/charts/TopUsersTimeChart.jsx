"use client";
import React, { useEffect, useState } from "react";
import { fetchDataFromApi } from "@/utils/api";
import UserPageAnalyticsPanel from "./UserPageAnalyticsPanel";

export default function TopUsersTimeChart() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetchDataFromApi(
        "/api/analytics/timeSpent/topUsers",
        false
      );
      if (res?.success) setUsers(res.data);
    })();
  }, []);

  return (
    <div className="w-full p-5 bg-white rounded-2xl border border-slate-200 shadow-sm relative">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Top Users by Time Spent
        </h2>
        <p className="text-sm text-slate-500">
          Users with highest engagement duration
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700">
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Total Time</th>
              <th className="p-3 text-left">Sessions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, i) => (
              <tr
                key={i}
                onClick={() => {
                  setSelectedUser(user.visitorId);
                  setPanelOpen(true);
                }}
                className="cursor-pointer hover:bg-slate-50 border-b last:border-b-0"
              >
                <td className="p-3">
                  <div className="font-medium text-blue-600">
                    {user.name || "Guest User"}
                  </div>
                  <div className="text-xs text-slate-500">
                    {user.email || "No email"}
                  </div>
                </td>

                <td className="p-3 font-semibold text-gray-700">
                  {user.totalTime}s
                </td>

                <td className="p-3 text-gray-700">
                  {user.sessions}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UserPageAnalyticsPanel
        open={panelOpen}
        visitorId={selectedUser}
        onClose={() => setPanelOpen(false)}
      />
    </div>
  );
}
