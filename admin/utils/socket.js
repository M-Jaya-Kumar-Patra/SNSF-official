"use client";

import { io } from "socket.io-client";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export function createAdminSocket() {
  if (typeof window === "undefined" || !apiUrl) return null;
  const token = localStorage.getItem("accessToken");
  if (!token) return null;
  return io(apiUrl, {
    auth: { token },
    withCredentials: true,
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 8,
  });
}
