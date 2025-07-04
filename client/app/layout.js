"use client";

import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AuthWrapper from "@/components/AuthWrapper";
import { AlertProvider } from "./context/AlertContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import { Inter } from "next/font/google";
import { CatProvider } from "./context/CategoryContext";
import { PrdProvider } from "./context/ProductContext";
import { ItemProvider } from "./context/ItemContext";
import { WishlistProvider } from "./context/WishlistContext";
import { NoticeProviders } from "./context/NotificationContext";
import GlobalLoader from "@/components/GlobalLoader";
import BottomNav from "@/components/BottomNav";

import { useEffect } from "react";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap", // ✅ Add this
});

export default function RootLayout({ children }) {
  // ✅ Register Service Worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("✅ Service Worker registered:", registration);
        })
        .catch((error) => {
          console.error("❌ Service Worker registration failed:", error);
        });
    }
  }, []);

  return (
    <html lang="en">
      <head>
  <title>S N Steel Fabrication – Premium Steel Furniture</title>
   <meta name="description" content="S N Steel Fabrication offers durable, modern, and customizable steel furniture for homes and businesses. Premium quality at affordable prices." />
  <link rel="manifest" href="/manifest.json" />
  

  <meta name="theme-color" content="#000000" />
  <link rel="icon" href="/favicon.ico" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
 <meta name="mobile-web-app-capable" content="yes" />

  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta name="apple-mobile-web-app-title" content="SNSF" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes"
  />
</head>


      <body className={`${inter.className} w-full`}>
        <AuthProvider>
          <AuthWrapper>
            <AlertProvider>
              <NoticeProviders>
                  <ItemProvider>
                    <CatProvider>
                      <WishlistProvider>
                        <PrdProvider>
                            <Navbar />
                            <GlobalLoader />
                            <main className="min-h-screen flex flex-col">
                              {children}
                            </main>
                            <BottomNav />
                            <Footer />
                            <Toaster position="top-right" />
                        </PrdProvider>
                      </WishlistProvider>
                    </CatProvider>
                  </ItemProvider>
              </NoticeProviders>
            </AlertProvider>
          </AuthWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
