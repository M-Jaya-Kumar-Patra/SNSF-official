"use client";
import { useState } from "react";
import { Armchair } from "lucide-react";

export default function DesignImage({ src, alt, className = "" }) {
  const [failed, setFailed] = useState("");
  return src && failed !== src ? (
    // Catalogue, swatch and generated images come from the validated design API.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(src)} />
  ) : <span role="img" aria-label={alt || "Product image unavailable"} className={`flex items-center justify-center bg-slate-100 text-slate-400 ${className}`}><Armchair className="h-9 w-9" /></span>;
}
