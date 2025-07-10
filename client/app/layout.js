// app/layout.tsx or layout.js
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
  display: "swap",
});

// ✅ ✅ TOP-LEVEL export for SEO
export const metadata = {
  title: "S N Steel Fabrication – Steel Furniture, Customized for Comfort and Class",
  description: "S N Steel Fabrication offers durable, modern, and customizable steel furniture for homes and businesses. Premium quality at affordable prices.",
  openGraph: {
    title: "S N Steel Fabrication",
    description: "Modern & customizable steel furniture.",
    url: "https://snsteelfabrication.com",
    siteName: "SNSF",
    images: [
      {
        url: "https://snsteelfabrication.com/images/logo.png",
        width: 1200,
        height: 630,
        alt: "S N Steel Fabrication Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "S N Steel Fabrication",
    description: "Modern & customizable steel furniture.",
    images: ["https://snsteelfabrication.com/images/logo.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
  themeColor: "#000000",
  manifest: "/manifest.json",
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes",
  appleWebApp: {
    capable: true,
    title: "SNSF",
    statusBarStyle: "default",
  },
};

export default function RootLayout({ children }) {
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
