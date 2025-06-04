// app/layout.js
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionWrapper from "./components/SessionWrapper";
import { CartProvider } from "./context/CartContext";
import { AlertProvider } from "./context/AlertContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import SessionGuard from "@/components/SessionGuard";

// Fonts
import { Inter, Geist, Geist_Mono, Righteous } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "700"] });
const geistSans = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });
const righteous = Righteous({ subsets: ["latin"], weight: "400" });

export const metadata = {
  title: "SNSF",
  description: "Steel Furniture Manufacturer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon-32x32.png" type="image/png" />
      </head>
      <body className={inter.className}>
        <SessionWrapper>
          {/* <SessionGuard> */}
            <AuthProvider>
            <AlertProvider>
              <CartProvider>
                <Navbar />
                <main className="min-h-screen flex flex-col">
                  {children}
                </main>
              </CartProvider>
            </AlertProvider>
          </AuthProvider>
          {/* </SessionGuard> */}
        </SessionWrapper>
      </body>
    </html>
  );
}
