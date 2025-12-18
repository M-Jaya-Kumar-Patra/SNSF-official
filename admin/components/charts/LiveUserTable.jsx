"use client";
import React, { useEffect, useState } from "react";
import { fetchDataFromApi } from "@/utils/api";
import UserDetailModal from "./UserDetailModal";

export default function LiveUserTable() {
  const [users, setUsers] = useState([]);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    const res = await fetchDataFromApi("/api/analytics/live/users", false);


    console.log("Ressssssssssssssssssss", res)
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
      <div className="p-4 bg-white rounded-2xl shadow w-full">
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-black mb-3">
          Live Users (Realtime)
        </h3>
            
        <p className="text-black flex gap-1 text-[20px]"><p className="font-semibold">{users.length} </p>active users</p>

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
                      <span className="font-medium text-black">
                        {u.name || "Guest"}
                      </span>
                    </td>

                    <td className="p-2 capitalize text-gray-700">
                      {u.device || "Unknown"}
                    </td>

                    <td className="p-2 text-blue-600 underline">
                      {u.currentPage}
                    </td>

                    <td className="p-2 text-gray-700">
                      {u.timeActive}s
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
