// app/layout.js
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AlertProvider } from "./context/AlertContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import SessionGuard from "@/components/SessionGuard";
import { CatProvider } from "./context/CategoryContext";
import { PrdProvider } from "./context/ProductContext";

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
      <body >
          {/* <SessionGuard> */}
            <AuthProvider>
              <PrdProvider>
                <CatProvider>
                    <AlertProvider>
                    <Navbar />
                    <main className="min-h-screen flex flex-col">
                      <Toaster position="top-right" reverseOrder={false} />
                      {children}
                    </main>
                </AlertProvider>
              </CatProvider>
              </PrdProvider>
            </AuthProvider>
          {/* </SessionGuard> */}
      </body>
    </html>
  );
}
