"use client";
import { createPortal } from "react-dom";

export default function SearchDropdownPortal({ children }) {
  if (typeof window === "undefined") return null;
  return createPortal(children, document.body);
}
