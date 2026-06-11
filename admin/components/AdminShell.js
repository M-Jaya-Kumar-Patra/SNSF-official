"use client";
import { useState } from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export default function AdminShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--admin-bg)] text-[var(--admin-text)]">

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      <SwipeableDrawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onOpen={() => setMobileOpen(true)}
      >
        <Sidebar onNavigate={() => setMobileOpen(false)} />
      </SwipeableDrawer>

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 overflow-y-auto bg-[var(--admin-bg)]">
          {children}
        </main>
      </div>

    </div>
  );
}
