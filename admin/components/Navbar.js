"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FcShop } from "react-icons/fc";
import { Moon, Sun } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { fetchDataFromApi } from "@/utils/api";
import { useAuth } from "@/app/context/AuthContext";
import { useAdminTheme } from "@/app/context/ThemeContext";

const searchableRoutes = [
  { label: "Dashboard", path: "/", keywords: "home analytics stats enquiries" },
  { label: "Products", path: "/Products", keywords: "catalog product stock price" },
  { label: "Categories", path: "/Categories", keywords: "category parent" },
  { label: "Subcategories", path: "/Subcategories", keywords: "sub category child" },
  { label: "Users", path: "/Users", keywords: "customers accounts promo mail" },
  { label: "Home Slider", path: "/HomeSlider", keywords: "hero banner slides" },
  { label: "Homepage Manager", path: "/HomepageManager", keywords: "sections best sellers trending curated" },
  { label: "Style Your Space", path: "/StyleYourSpace", keywords: "looks inspiration" },
  { label: "Poster Manager", path: "/PosterManager", keywords: "poster image banners" },
  { label: "Video Manager", path: "/VideoManager", keywords: "video youtube media" },
  { label: "Profile", path: "/profile", keywords: "admin account password avatar" },
];

const formatNotificationTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export default function Navbar({ onMenuClick }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useRef(null);
  const noticeRef = useRef(null);
  const { adminData } = useAuth();
  const { isDark, toggleTheme } = useAdminTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [enquiries, setEnquiries] = useState([]);
  const [lastSeenAt, setLastSeenAt] = useState("");

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return searchableRoutes.slice(0, 6);

    return searchableRoutes.filter((route) =>
      `${route.label} ${route.keywords}`.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const latestEnquiries = useMemo(
    () =>
      [...enquiries]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6),
    [enquiries]
  );

  const unreadCount = useMemo(() => {
    if (!lastSeenAt) return enquiries.length;
    const seenDate = new Date(lastSeenAt);
    return enquiries.filter((item) => new Date(item.createdAt) > seenDate).length;
  }, [enquiries, lastSeenAt]);

  const loadNotifications = async () => {
    const res = await fetchDataFromApi("/api/enquiries/admin");
    if (res?.success) setEnquiries(res.data || []);
  };

  useEffect(() => {
    setLastSeenAt(localStorage.getItem("adminLastSeenEnquiryAt") || "");
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
      if (noticeRef.current && !noticeRef.current.contains(event.target)) {
        setNoticeOpen(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openRoute = (path) => {
    router.push(path);
    setSearchQuery("");
    setSearchOpen(false);
  };

  const openNotifications = () => {
    const now = new Date().toISOString();
    localStorage.setItem("adminLastSeenEnquiryAt", now);
    setLastSeenAt(now);
    setNoticeOpen((prev) => !prev);
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 shadow-sm sm:px-6">
      <div className="flex items-center gap-4">
        <button
          className="rounded-xl p-2 text-[var(--admin-muted)] transition hover:bg-[var(--admin-surface-soft)] hover:text-[var(--admin-text)] lg:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <MenuIcon />
        </button>

        <div ref={searchRef} className="relative hidden md:block">
          <div className="flex h-11 w-[390px] items-center rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface-soft)] px-3 transition focus-within:w-[470px]">
            <SearchIcon className="mr-2 text-[var(--admin-muted)]" />
            <input
              type="text"
              placeholder="Search pages, products, reports..."
              className="w-full bg-transparent text-sm font-medium text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-muted)]"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && searchResults[0]) {
                  openRoute(searchResults[0].path);
                }
              }}
            />
          </div>

          {searchOpen && (
            <div className="absolute left-0 top-full z-50 mt-2 w-[470px] overflow-hidden rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-2xl shadow-slate-900/15">
              {searchResults.length ? (
                searchResults.map((route) => (
                  <button
                    key={route.path}
                    type="button"
                    onClick={() => openRoute(route.path)}
                    className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition hover:bg-[var(--admin-surface-soft)] ${
                      pathname === route.path ? "text-[var(--admin-accent)]" : "text-[var(--admin-text)]"
                    }`}
                  >
                    <span className="font-semibold">{route.label}</span>
                    <span className="text-xs text-[var(--admin-muted)]">{route.path}</span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-5 text-sm text-[var(--admin-muted)]">
                  No admin page found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <FcShop
          size={26}
          className="cursor-pointer transition hover:scale-105"
          title="Visit Store"
          onClick={() =>
            window.open(process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000", "_blank")
          }
        />

        <button
          type="button"
          aria-label="Toggle admin theme"
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface-soft)] text-[var(--admin-text)] transition hover:scale-105"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <div ref={noticeRef} className="relative">
          <button
            type="button"
            onClick={openNotifications}
            aria-label="Open admin notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface-soft)]"
          >
            <NotificationsNoneIcon className="text-[var(--admin-text)]" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {noticeOpen && (
            <div className="absolute right-0 top-12 z-50 w-[360px] overflow-hidden rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-2xl shadow-slate-900/15">
              <div className="border-b border-[var(--admin-border)] px-4 py-3">
                <p className="text-sm font-bold text-[var(--admin-text)]">Latest enquiries</p>
                <p className="text-xs text-[var(--admin-muted)]">WhatsApp, call, and product enquiries</p>
              </div>

              <div className="max-h-[360px] overflow-auto">
                {latestEnquiries.length ? (
                  latestEnquiries.map((item) => {
                    const message = item.userMsg || item.message || "New enquiry";
                    const isWhatsApp = /whatsapp/i.test(message);

                    return (
                      <div
                        key={item._id}
                        className="border-b border-[var(--admin-border)] px-4 py-3 last:border-b-0"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[var(--admin-text)]">
                              {isWhatsApp ? "WhatsApp enquiry" : "Customer enquiry"}
                            </p>
                            <p className="mt-1 line-clamp-2 text-xs text-[var(--admin-muted)]">
                              {message}
                            </p>
                          </div>
                          <span className="shrink-0 rounded-full bg-[var(--admin-surface-soft)] px-2 py-1 text-[10px] font-semibold text-[var(--admin-muted)]">
                            {formatNotificationTime(item.createdAt)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="px-4 py-8 text-center text-sm text-[var(--admin-muted)]">
                    No enquiries yet.
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  router.push("/");
                  setNoticeOpen(false);
                }}
                className="w-full border-t border-[var(--admin-border)] px-4 py-3 text-sm font-semibold text-[var(--admin-accent)] hover:bg-[var(--admin-surface-soft)]"
              >
                View dashboard enquiries
              </button>
            </div>
          )}
        </div>

        <div
          className="flex cursor-pointer items-center gap-2 rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface-soft)] px-2 py-1 transition hover:scale-[1.01]"
          onClick={() => router.push("/profile")}
        >
          <img
            src={adminData?.avatar || "/images/account.png"}
            className="h-9 w-9 rounded-full border border-[var(--admin-border)] object-cover"
            alt="profile"
          />
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-semibold text-[var(--admin-text)]">
              {adminData?.name || "Admin"}
            </span>
            <span className="text-xs text-[var(--admin-muted)]">Administrator</span>
          </div>
          <ExpandMoreIcon className="hidden text-[var(--admin-muted)] sm:block" />
        </div>
      </div>
    </header>
  );
}
