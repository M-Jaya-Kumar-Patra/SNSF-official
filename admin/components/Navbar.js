"use client";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FcShop } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export default function Navbar({ onMenuClick }) {
  const router = useRouter();
  const { adminData } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">

      {/* LEFT */}
      <div className="lg:hidden flex items-center gap-4">
        {/* Mobile menu */}
        <button
          className="lg:hidden text-slate-600 hover:text-slate-900"
          onClick={onMenuClick}
        >
          <MenuIcon />
        </button>

        {/* Page title */}
        
      </div>

      {/* CENTER (Search – dummy) */}
      <div className="hidden md:flex items-center bg-slate-200 px-3 py-2 rounded-lg w-[320px]">
        <SearchIcon className="text-slate-500 mr-2" />
        <input
          type="text"
          placeholder="Search anything..."
          className="bg-transparent outline-none text-sm w-full text-slate-800 placeholder-slate-500"
        />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-5">

        {/* Visit Store */}
        <FcShop
          size={26}
          className="cursor-pointer hover:scale-105 transition"
          title="Visit Store"
          onClick={() => router.push("/")}
        />

        {/* Notifications */}
        <div className="relative cursor-pointer">
          <NotificationsNoneIcon className="text-slate-700" />
          {/* dummy badge */}
          <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] bg-red-500 text-white rounded-full flex items-center justify-center">
            3
          </span>
        </div>

        {/* Profile */}
        <div
          className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 px-2 py-1 rounded-lg transition"
          onClick={() => router.push("/profile")}
        >
          <img
            src={adminData?.avatar || "/images/account.png"}
            className="w-9 h-9 rounded-full border object-cover"
            alt="profile"
          />
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-sm font-semibold text-slate-800">
              {adminData?.name || "Admin"}
            </span>
            <span className="text-xs text-slate-500">Administrator</span>
          </div>
          <ExpandMoreIcon className="text-slate-500 hidden sm:block" />
        </div>
      </div>
    </header>
  );
}
