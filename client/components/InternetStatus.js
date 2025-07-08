"use client";

import useInternetCheck from "@/hooks/useInternetCheck";
import NoInternet from "./noInternet";

export default function InternetStatus() {
  const isOnline = useInternetCheck();

  if (!isOnline) {
    return null;
  }

  return null; // Don't render anything when online
}
