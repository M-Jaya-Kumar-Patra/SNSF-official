"use client";

import { usePathname } from "next/navigation";
import { useScreen } from "@/app/context/ScreenWidthContext";

const PROFILE_ROUTES = [
  "/profile",
  "/address",
  "/enquiries",
  "/notifications",
  "/payments",
  "/wishlist",
];

export default function MainWrapper({ children }) {
  const pathname = usePathname();
  const { isMd } = useScreen();

  let extraPadding = "sm:pt-[90px]"; // default (home)

  if (isMd) {
    if (PROFILE_ROUTES.includes(pathname)) {
      extraPadding = "sm:pt-[120px]";
    } else if (pathname !== "/") {
      extraPadding = "sm:pt-[138px]";
    }
  }

  return (
    <main
      className={` 
        pt-[70px]
        mt-[10px]
        sm:mt-0
        ${extraPadding}
        min-h-screen
        flex
        flex-col
      `}
    >
      {children}
    </main>
  );
}
