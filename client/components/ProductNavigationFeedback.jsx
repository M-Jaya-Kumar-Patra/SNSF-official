"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LoaderCircle, PackageOpen } from "lucide-react";

const PRODUCT_PATH = /^\/product\/[^/?#]+/i;
const MAX_WAIT_MS = 12000;

function getProductPath(value) {
  if (!value || typeof window === "undefined") return null;

  try {
    const url = new URL(value, window.location.origin);
    if (url.origin !== window.location.origin || !PRODUCT_PATH.test(url.pathname)) {
      return null;
    }

    return `${url.pathname}${url.search}`;
  } catch {
    return null;
  }
}

export default function ProductNavigationFeedback() {
  const pathname = usePathname();
  const router = useRouter();
  const [pendingPath, setPendingPath] = useState(null);
  const pendingPathRef = useRef(null);
  const timeoutRef = useRef(null);
  const prefetchedPathsRef = useRef(new Set());

  const prefetch = useCallback((value) => {
    const path = getProductPath(value);
    if (!path || prefetchedPathsRef.current.has(path)) return;

    prefetchedPathsRef.current.add(path);
    router.prefetch(path);
  }, [router]);

  const finish = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    pendingPathRef.current = null;
    setPendingPath(null);
  }, []);

  const start = useCallback((value) => {
    const path = getProductPath(value);
    if (!path) return;

    prefetch(path);
    pendingPathRef.current = path;
    setPendingPath(path);

    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(finish, MAX_WAIT_MS);
  }, [finish, prefetch]);

  useEffect(() => {
    const handleProductClick = (event) => {
      start(event.detail?.path);
    };

    const handleDocumentClick = (event) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;

      const markedProduct = target.closest("[data-product-path]");
      const anchor = target.closest("a[href]");

      if (anchor?.target === "_blank" || anchor?.download) return;

      start(
        markedProduct?.getAttribute("data-product-path") ||
          anchor?.getAttribute("href"),
      );
    };

    const handlePointerOver = (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;

      const markedProduct = target.closest("[data-product-path]");
      const anchor = target.closest("a[href]");
      if (anchor?.target === "_blank" || anchor?.download) return;

      prefetch(
        markedProduct?.getAttribute("data-product-path") ||
          anchor?.getAttribute("href"),
      );
    };

    window.addEventListener("snsf:productClick", handleProductClick);
    document.addEventListener("click", handleDocumentClick, true);
    document.addEventListener("pointerover", handlePointerOver, { passive: true });

    return () => {
      window.removeEventListener("snsf:productClick", handleProductClick);
      document.removeEventListener("click", handleDocumentClick, true);
      document.removeEventListener("pointerover", handlePointerOver);
    };
  }, [prefetch, start]);

  useEffect(() => {
    if (!pendingPathRef.current || !pathname) return;
    if (pathname !== new URL(pendingPathRef.current, window.location.origin).pathname) {
      finish();
      return;
    }

    finish();
  }, [finish, pathname]);

  useEffect(() => () => finish(), [finish]);

  if (!pendingPath) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[250] flex justify-center px-3 pt-2 sm:pt-3"
      role="status"
      aria-live="polite"
      aria-label="Opening product"
    >
      <div className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white/95 px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-lg shadow-slate-950/10 backdrop-blur sm:px-4 sm:text-sm">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-950 text-white">
          <PackageOpen className="h-3.5 w-3.5" />
        </span>
        <span>Opening product…</span>
        <LoaderCircle className="h-4 w-4 animate-spin text-indigo-600" />
      </div>
      <div className="absolute inset-x-0 top-0 h-1 overflow-hidden bg-indigo-100">
        <div className="h-full w-1/3 animate-[product-progress_1.2s_ease-in-out_infinite] rounded-full bg-indigo-600" />
      </div>
    </div>
  );
}
