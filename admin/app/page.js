"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import { fetchDataFromApi } from "@/utils/api";

import KpiCards from "@/components/charts/KpiCards";
import VisitsOverTime from "@/components/charts/VisitChart";
import MostActiveUsers from "@/components/charts/MostActiveUsers";
import AnalyticsDashboard from "@/components/charts/AnalyticsDashboard";
import Enquiries from "@/components/Enquiries";



const Card = ({ children, className = "" }) => (
  <div
    className={`admin-card ${className}`}
  >
    {children}
  </div>

);

export default function Home() {
  const { isLogin } = useAuth();

  const [stats, setStats] = useState({
    visits: 0,
    users: 0,
    enquiries: 0,
    products: 0,
  });

  useEffect(() => {
    if (!isLogin) return;

    fetchDataFromApi("/api/admin/admin/stats").then((res) => {
      if (res?.success) setStats(res.stats);
    });
  }, [isLogin]);

  if (!isLogin) return null;

  return (
    <div className="admin-page p-6 space-y-8">

      {/* Page Header */}
      <div className="admin-card overflow-hidden p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-[var(--admin-accent)]">
              Control center
            </p>
            <h1 className="text-3xl font-bold text-[var(--admin-text)]">
              Admin Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[var(--admin-muted)]">
              Track sales activity, product health, visitors, enquiries, and user behaviour from one clean workspace.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface-soft)] px-4 py-3 text-sm text-[var(--admin-muted)]">
            Live analytics are shown in Indian time
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <KpiCards stats={stats} />

      {/* Primary Chart */}
      
        <VisitsOverTime />
      
          <MostActiveUsers />


      {/* Deep Analytics */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Advanced Analytics
        </h2>
        <AnalyticsDashboard />
      </Card>

        <Enquiries />
    </div>
  );
}
