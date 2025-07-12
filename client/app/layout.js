// app/layout.tsx

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
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister"; 

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://snsteelfabrication.com"),
  title: "S N Steel Fabrication – Strength You Can Trust. Style You Can See.",
  description: "S N Steel Fabrication offers durable, modern, and customizable steel furniture for homes and businesses. Premium quality at affordable prices.",
  openGraph: {
    title: "S N Steel Fabrication",
    description: "Modern & customizable steel furniture.",
    url: "https://snsteelfabrication.com",
    siteName: "SNSF",
    images: [
      {
        url: "https://snsteelfabrication.com/snsf-banner.jpg",
        secureUrl: "https://snsteelfabrication.com/snsf-banner.jpg",
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
    images: ["https://snsteelfabrication.com/snsf-banner.jpg"],
  },
  keywords: ["steel furniture", "custom steel", "SNSF", "modern fabrication", "durable furniture"],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "SNSF",
    statusBarStyle: "default",
  },
  themeColor: "#000000",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} w-full`}>
        <ServiceWorkerRegister />
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
