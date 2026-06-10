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
    let sent = false;

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
      if (sent) return;
      sent = true;
      const timeSpent = Math.round((Date.now() - startTime) / 1000);

      trackVisitor(pathname, maxScrollDepth, timeSpent, userData?._id);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") sendTrackingData();
    };

    window.addEventListener("pagehide", sendTrackingData);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("pagehide", sendTrackingData);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pathname, userData?._id]);

  return null;
}
