import "./globals.css";
import AdminShellWrapper from "@/components/AdminShell";
import { AlertProvider } from "./context/AlertContext";
import { AuthProvider } from "./context/AuthContext";
import { CatProvider } from "./context/CategoryContext";
import { PrdProvider } from "./context/ProductContext";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "SNSF Admin",
  description: "Steel Furniture Admin Panel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <head>
        <link rel="icon" href="/favicon-32x32.png" type="image/png" />
      </head>
      <body className="bg-slate-100">
         <AuthProvider>
          <PrdProvider>
            <CatProvider>
              <AlertProvider>
                <AdminShellWrapper>
                  <Toaster position="top-right" />
                  {children}
                </AdminShellWrapper>
              </AlertProvider>
            </CatProvider>
          </PrdProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
