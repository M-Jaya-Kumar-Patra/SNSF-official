"use client";

import React, { useState } from "react";

/* VISITOR */
import LoginActivityChart from "./LoginActivityChart";
import UniqueVisitorsChart from "./UniqueVisitorsChart";
import NewVsReturningChart from "./NewVsReturningChart";
import DevicePieChart from "./DevicePieChart";
import BrowserPieChart from "./BrowserPieChart";
import CountryBarChart from "./CountryBarChart";
import TimeSpentByDevice from "./TimeSpentByDevice";
import ScrollDepthChart from "./ScrollDepthChart";

/* SESSION */
import AvgSessionDurationChart from "./AvgSessionDurationChart";
import PagesPerSessionChart from "./PagesPerSessionChart";
import BounceRateCard from "./BounceRateCard";

/* PAGES */
import MostViewedPagesChart from "./MostViewedPagesChart";
import MostTimeSpentPages from "./MostTimeSpentPages";
import TimeSpentByUserType from "./TimeSpentByUserType";

/* PRODUCT */
import ProductFunnelChart from "./ProductFunnelChart";
import MostViewedProductsChart from "./MostViewedProductsChart";
import WishlistLeaderboard from "./WishlistLeaderboard";
import MostTimeSpentProducts from "./MostTimeSpentProducts";

/* SEARCH */
import MostSearchedKeywords from "./MostSearchedKeywords";
import TopSearchedCategories from "./TopSearchedCategories";
import SearchIntentClusters from "./SearchIntentClusters";
import SearchConversionFunnel from "./SearchConversionFunnel";
import ZeroResultSearches from "./ZeroResultSearches";

/* USERS */
import DailyLoginsChart from "./DailyLoginsChart";
import NewSignupsChart from "./NewSignupsChart";
import TopUsersTimeChart from "./TopUsersTimeChart";

/* LIVE */
import ActiveUsersWidget from "./ActiveUsersWidget";
import LiveTopPages from "./LiveTopPages";
import LiveUserTable from "./LiveUserTable";

const tabs = [
  { id: "live", label: "Live" },
  { id: "visitor", label: "Visitors" },
  { id: "session", label: "Sessions" },
  { id: "pages", label: "Pages" },
  { id: "product", label: "Products" },
  { id: "search", label: "Search" },
  { id: "users", label: "Users" },
];

export default function AnalyticsDashboard() {
  const [active, setActive] = useState("visitor");

  const now = new Date();
  const prior = new Date();
  prior.setDate(prior.getDate() - 7);

  return (
    <div className="bg-slate-50 rounded-xl p-6">

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition
              ${
                active === t.id
                  ? "bg-slate-900 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ================= LIVE ================= */}
      {active === "live" && (
        <>
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Live Activity
          </h3>

          <div className="md:col-span-2 space-y-6">
    
             <LiveUserTable />

            <div className=" grid grid-cols-1 md:grid-cols-2 gap-6">
             
              <DevicePieChart />
              <LiveTopPages />
            </div>
          </div>
        </>
      )}

      {/* ================= VISITOR ================= */}
      {active === "visitor" && (
        <>
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Visitor Overview
          </h3>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <LoginActivityChart />
            <UniqueVisitorsChart />
            <ScrollDepthChart />
            <CountryBarChart />
            <NewVsReturningChart />
            <DevicePieChart />
            <BrowserPieChart />
            <TimeSpentByDevice />
          </div>
        </>
      )}

      {/* ================= SESSION ================= */}
      {active === "session" && (
        <>
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Session Quality
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AvgSessionDurationChart />
            <PagesPerSessionChart />
            <BounceRateCard />
          </div>
        </>
      )}

      {/* ================= PAGES ================= */}
      {active === "pages" && (
        <>
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Page Engagement
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MostViewedPagesChart />
            <MostTimeSpentPages />
            <TimeSpentByUserType />
          </div>
        </>
      )}

      {/* ================= PRODUCT ================= */}
      {active === "product" && (
        <>
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Product Performance
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProductFunnelChart />
            <MostViewedProductsChart />
            <WishlistLeaderboard />
            <MostTimeSpentProducts />
          </div>
        </>
      )}

      {/* ================= SEARCH ================= */}
      {active === "search" && (
        <>
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Search Analytics
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MostSearchedKeywords />
            <TopSearchedCategories start={prior} end={now} />
            <SearchIntentClusters start={prior} end={now} />
            <SearchConversionFunnel start={prior} end={now} />
            <ZeroResultSearches start={prior} end={now} />
          </div>
        </>
      )}

      {/* ================= USERS ================= */}
      {active === "users" && (
        <>
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            User Growth
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DailyLoginsChart />
            <NewSignupsChart />
            <TopUsersTimeChart />
          </div>
        </>
      )}
    </div>
  );
}
