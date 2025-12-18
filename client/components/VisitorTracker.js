"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackVisitor } from "@/lib/tracking";
import { useAuth } from "@/app/context/AuthContext";


export default function VisitorTracker() {
  const pathname = usePathname();

  const {userData} = useAuth()

  useEffect(() => {
    let startTime = Date.now();
    let maxScrollDepth = 0;

    const getScrollPercentage = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (docHeight <= 0) return 100;
      return Math.round((scrollTop / docHeight) * 100);
    };

    const updateScroll = () => {
      const currentDepth = getScrollPercentage();
      maxScrollDepth = Math.max(maxScrollDepth, currentDepth);
    };

    window.addEventListener("scroll", updateScroll);

    const sendTrackingData = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);

      trackVisitor(pathname, maxScrollDepth, timeSpent, userData?._id);
    };

    window.addEventListener("beforeunload", sendTrackingData);

    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("beforeunload", sendTrackingData);
    };
  }, [pathname]);

  return null;
}
