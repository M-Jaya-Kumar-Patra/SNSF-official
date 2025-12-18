"use client";
import { useEffect, useState } from "react";

export default function InternetGuard({ children }) {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);

    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);

    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (!online) {
    return (
      <div className="h-screen flex items-center justify-center text-xl font-semibold">
        🚫 No Internet Connection
      </div>
    );
  }

  return children;
}
