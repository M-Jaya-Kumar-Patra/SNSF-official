"use client";
import React, { useEffect, useState } from "react";
import { fetchDataFromApi } from "@/utils/api";
import UserDetailModal from "./UserDetailModal";
import formatDurationUptoHour from "@/utils/timeFormat";

export default function LiveUserTable() {
  const [users, setUsers] = useState([]);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    const res = await fetchDataFromApi("/api/analytics/live/users");

    if (res?.success) {
      setUsers(res.users);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadUsers();

    // Auto refresh every 5 seconds
    const interval = setInterval(loadUsers, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="w-full rounded-2xl bg-[var(--admin-surface)] p-4 shadow">
        <div className="flex justify-between items-center">
            <h3 className="mb-3 text-lg font-semibold text-[var(--admin-text)]">
          Live Users (Realtime)
        </h3>
            
        <p className="flex gap-1 text-[20px] text-[var(--admin-text)]"><span className="font-semibold">{users.length} </span>active users</p>

        </div>
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-2 text-left">User</th>
                <th className="p-2 text-left">Device</th>
                <th className="p-2 text-left">Current Page</th>
                <th className="p-2 text-left">Active</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center p-4">
                    Loading...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-500">
                    No active users right now.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.visitorId}
                    onClick={() => setSelectedVisitor(u.visitorId)}
                    className="cursor-pointer border-b hover:bg-blue-50 transition"
                  >
                    <td className="p-2 flex items-center gap-2">
                      <img
                        src={u.avatar || "/default-avatar.png"}
                        className="w-8 h-8 rounded-full border"
                        alt="avatar"
                      />
                      <span className="font-medium text-[var(--admin-text)]">
                        {u.name || "Guest"}
                      </span>
                    </td>

                    <td className="p-2 capitalize text-[var(--admin-muted)]">
                      {u.device || "Unknown"}
                    </td>

                    <td className="p-2 text-blue-600 underline">
                      {u.currentPage}
                    </td>

                    <td className="p-2 text-[var(--admin-muted)]">
  {formatDurationUptoHour(u.timeActive)}
</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedVisitor && (
        <UserDetailModal
          visitorId={selectedVisitor}
          onClose={() => setSelectedVisitor(null)}
        />
      )}
    </>
  );
}
