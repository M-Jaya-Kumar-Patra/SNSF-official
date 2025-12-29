"use client";

import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

export default function AppToaster() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <Toaster
      position={"top-right"}
      containerStyle={{
        top: isMobile ? 85 : 105, // adjust to your navbar height
      }}
      toastOptions={{
        duration: 4000,
      }}
    />
  );
}
