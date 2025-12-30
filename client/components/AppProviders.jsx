"use client";

import { ScreenWidthProvider } from "@/app/context/ScreenWidthContext";
import { AuthProvider } from "@/app/context/AuthContext";
import { AlertProvider } from "@/app/context/AlertContext";
import { NoticeProviders } from "@/app/context/NotificationContext";
import { ItemProvider } from "@/app/context/ItemContext";
import { CatProvider } from "@/app/context/CategoryContext";
import { WishlistProvider } from "@/app/context/WishlistContext";
import { PrdProvider } from "@/app/context/ProductContext";

export default function AppProviders({ children }) {
  return (
    <ScreenWidthProvider>
      <AuthProvider>
        <AlertProvider>
          <NoticeProviders>
            <ItemProvider>
              <CatProvider>
                <WishlistProvider>
                  <PrdProvider>
                    {children}
                  </PrdProvider>
                </WishlistProvider>
              </CatProvider>
            </ItemProvider>
          </NoticeProviders>
        </AlertProvider>
      </AuthProvider>
    </ScreenWidthProvider>
  );
}   
