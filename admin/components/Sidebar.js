"use client";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Image from "next/image";

import DashboardIcon from "@mui/icons-material/Dashboard";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CategoryIcon from "@mui/icons-material/Category";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import ChairIcon from "@mui/icons-material/Chair";
import ImageIcon from "@mui/icons-material/Image";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary"; // 

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutBTN from "./LogoutBTN";

const navItems = [
  { label: "Dashboard", path: "/", icon: DashboardIcon },
  { label: "Products", path: "/Products", icon: Inventory2Icon },
  { label: "Categories", path: "/Categories", icon: CategoryIcon },
  { label: "Subcategories", path: "/Subcategories", icon: AccountTreeIcon },
  { label: "Users", path: "/Users", icon: PeopleAltIcon },
  { label: "Home Slider", path: "/HomeSlider", icon: SlideshowIcon },
  { label: "Homepage Manager", path: "/HomepageManager", icon: ViewQuiltIcon },
  { label: "Style Your Space", path: "/StyleYourSpace", icon: ChairIcon },
  { label: "Poster Manager", path: "/PosterManager", icon: ImageIcon },
  { label: "Video Manager", path: "/VideoManager", icon: VideoLibraryIcon }, // Added Video Manager
];

export default function Sidebar({ onNavigate }) {
  const router = useRouter();
  const pathname = usePathname();

  const getOptimizedCloudinaryUrl = (url) => {
    if (!url?.includes("res.cloudinary.com")) return url;
    return url.replace(
      "/upload/",
      "/upload/w_300,h_300,c_fit,fl_lossless,f_auto,q_100/"
    );
  };

  return (
    <aside className="flex h-full w-72 flex-col border-r border-white/10 bg-[var(--admin-sidebar)] text-slate-200">

      {/* LOGO */}
      <div className="border-b border-white/10 px-6 py-5">
        <div className="flex items-center gap-2">
          <Image
            src={getOptimizedCloudinaryUrl("/images/logo.png")}
            alt="Logo"
            width={50}
            height={50}
            className="object-contain"
            priority
          />
          <Image
            src={getOptimizedCloudinaryUrl("/images/snsf-text.png")}
            alt="SNSF"
            width={150}
            height={40}
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* MAIN NAV */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 scrollbar-hide">
        {navItems.map(({ label, path, icon: Icon }) => {
          const active = pathname === path;
          return (
          <button
            key={label}
            onClick={() => {
              router.push(path);
              onNavigate?.();
            }}
            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              active
                ? "bg-white text-slate-950 shadow-lg shadow-black/20"
                : "text-slate-300 hover:bg-[var(--admin-sidebar-soft)] hover:text-white"
            }`}
          >
            <Icon className={`h-5 w-5 ${active ? "text-slate-950" : "text-slate-400"}`} />
            <span>{label}</span>
          </button>
        )})}
      </nav>

      {/* DIVIDER */}
      <div className="border-t border-white/10" />

      {/* PROFILE & LOGOUT */}
      <div className="px-3 py-3">
        <button
          onClick={() => {
            router.push("/profile");
            onNavigate?.();
          }}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-[var(--admin-sidebar-soft)] hover:text-white"
        >
          <AccountCircleIcon className="w-5 h-5 text-slate-400" />
          <span>Profile</span>
        </button>

        <button
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/10"
        >
          <span> <LogoutBTN /></span>
        </button>
      </div>
    </aside>
  );
}
