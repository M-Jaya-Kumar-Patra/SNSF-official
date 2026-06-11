"use client";

import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fetchDataFromApi } from "@/utils/api";
import { toApiDateTime } from "@/utils/chartTime";

const ranges = {
  "1hour": "1 Hour",
  "12hour": "12 Hours",
  "1day": "1 Day",
  "7day": "7 Days",
  "1month": "1 Month",
  "6month": "6 Months",
  "1year": "1 Year",
};

const MostActiveUsers = () => {
  const [data, setData] = useState([]);
  const [range, setRange] = useState("1day");
  const [loading, setLoading] = useState(false);
  const [totalLogins, setTotalLogins] = useState(0);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const fetchLogins = async (url) => {
    setLoading(true);
    try {
      const res = await fetchDataFromApi(url);
      if (res?.success) {
        setData(res.data || []);
        setTotalLogins(res.totalLogins || 0);
      } else {
        setData([]);
        setTotalLogins(0);
      }
    } catch {
      setData([]);
      setTotalLogins(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustom = () => {
    if (!customStart || !customEnd) {
      alert("Select both start and end dates");
      return;
    }

    fetchLogins(
      `/api/user/getMostActiveUsers?start=${encodeURIComponent(
        toApiDateTime(customStart)
      )}&end=${encodeURIComponent(toApiDateTime(customEnd))}`
    );
  };

  useEffect(() => {
    fetchLogins(`/api/user/getMostActiveUsers?type=${range}`);
  }, [range]);

  return (
    <div className="w-full rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--admin-text)]">
            Most Active Users
          </h2>
          <p className="text-sm text-[var(--admin-muted)]">
            Users with highest login frequency
          </p>
        </div>

        <p className="text-sm font-semibold text-[var(--admin-muted)]">
          Total Logins: <span className="text-[var(--admin-text)]">{totalLogins}</span>
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {Object.entries(ranges).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setRange(key)}
            className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition ${
              range === key
                ? "bg-[var(--admin-accent)] text-white"
                : "bg-[var(--admin-surface-soft)] text-[var(--admin-muted)] hover:text-[var(--admin-text)]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-end gap-3">
        <label className="text-xs font-semibold text-[var(--admin-muted)]">
          Start
          <input
            type="datetime-local"
            value={customStart}
            onChange={(event) => setCustomStart(event.target.value)}
            className="mt-1 block rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none"
          />
        </label>

        <label className="text-xs font-semibold text-[var(--admin-muted)]">
          End
          <input
            type="datetime-local"
            value={customEnd}
            onChange={(event) => setCustomEnd(event.target.value)}
            className="mt-1 block rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-soft)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none"
          />
        </label>

        <button
          onClick={fetchCustom}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Show Range
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-sm text-[var(--admin-muted)]">Loading...</div>
      ) : (
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" />
            <YAxis allowDecimals={false} />
            <Tooltip
              content={({ active, payload, label }) =>
                active && payload?.length ? (
                  <div className="rounded-lg border border-gray-300 bg-white p-2 text-sm shadow-md">
                    <p className="font-semibold text-gray-800">{label}</p>
                    <p className="text-blue-600">Logins: {payload[0].value}</p>
                  </div>
                ) : null
              }
            />
            <Bar dataKey="logins" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default MostActiveUsers;
