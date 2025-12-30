import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

import GlobalLoader from "@/components/GlobalLoader";
import BottomNav from "@/components/BottomNav";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import AppToaster from "@/components/ToastProvider";

import { Inter, Montserrat, Poppins } from "next/font/google";
import MainWrapper from "@/components/MainWrapper";
import AppProviders from "@/components/AppProviders";
import ClientRuntime from "@/components/ClientRuntime";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-heading",
});


export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata = {
  metadataBase: new URL("https://snsteelfabrication.com"),
  title: "S N Steel Fabrication",
  description:
    "S N Steel Fabrication offers durable, modern, and customizable steel furniture for homes and businesses. Premium quality at affordable prices.",
  openGraph: {
    title: "S N Steel Fabrication",
    description: "Modern & customizable steel furniture.",
    url: "https://snsteelfabrication.com",
    siteName: "S N Steel Fabrication", // ✅ Updated here
    images: [
      {
        url: "/snsf-banner.jpg",
        width: 1200,
        height: 630,
        alt: "S N Steel Fabrication",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "S N Steel Fabrication",
    description: "Modern & customizable steel furniture.",
    images: ["/snsf-banner.jpg"],
  },
  keywords: [
    "steel furniture",
    "custom steel",
    "SNSF",
    "modern fabrication",
    "durable furniture",
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "S N Steel Fabrication", // ✅ Changed from "SNSF" to full name
    statusBarStyle: "default",
  },
};

export default function RootLayout({ children }) {


  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "S N Steel Fabrication",
              url: "https://snsteelfabrication.com",
              logo: "https://snsteelfabrication.com/images/logo.png", // ✅ Replace with actual logo URL
              sameAs: [
                // Optional: Add your real social links here
                "https://youtube.com/@snsteelfabrication6716?si=sNqOaFWnR9gMqziP",
              ],
            }),
          }}
        />
        <meta
          name="google-adsense-account"
          content="ca-pub-9814214172872974"
        ></meta>
      </head>
      <body className={`${inter.variable} ${montserrat.variable} `}>
        <ServiceWorkerRegister />

        <AppProviders>
          <Navbar />          {/* server + client split */}

          {/* 👇 runtime-only logic */}
          <ClientRuntime>
          <GlobalLoader />
            <MainWrapper>{children}</MainWrapper>
          </ClientRuntime>

          <BottomNav />
          <Footer />
          <AppToaster />
        </AppProviders>
      </body>
    </html>
  );
}
