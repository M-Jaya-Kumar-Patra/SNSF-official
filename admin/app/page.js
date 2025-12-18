"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import { fetchDataFromApi } from "@/utils/api";

import KpiCards from "@/components/charts/KpiCards";
import VisitsOverTime from "@/components/charts/VisitChart";
import LoginActivityChart from "@/components/charts/LoginActivityChart";
import MostActiveUsers from "@/components/charts/MostActiveUsers";
import AnalyticsDashboard from "@/components/charts/AnalyticsDashboard";
import Enquiries from "@/components/Enquiries";



const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-2xl border border-slate-200 shadow-sm ${className}`}
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
    fetchDataFromApi("/api/admin/admin/stats", false).then((res) => {
      if (res?.success) setStats(res.stats);
    });
  }, []);

  if (!isLogin) return null;

  return (
    <div className="bg-slate-50 min-h-screen p-6 space-y-8">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Admin Dashboard
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Overview of platform activity & performance
        </p>
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
