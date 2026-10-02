"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { designApi } from "@/utils/designApi";
import DesignImage from "./DesignImage";
export default function SharedDesign({ token }) {
  const [design, setDesign] = useState(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController(); setError("");
    designApi(`/shared/${encodeURIComponent(token)}`, { publicRequest: true, signal: controller.signal }).then((result) => { if (!controller.signal.aborted) setDesign(result.design); }).catch((err) => { if (!controller.signal.aborted) setError(err.message); });
    return () => controller.abort();
  }, [token, retry]);
  return <div className="mx-auto w-full max-w-6xl px-4 py-10 pb-28 text-slate-900">
    <p className="mb-3 text-xs font-bold uppercase tracking-widest text-indigo-700">SNSF · AI concept preview</p>
    <h1 className="mb-6 text-3xl font-semibold">A design made personal.</h1>
    {error ? <p role="alert" className="rounded-xl bg-red-50 p-5 text-red-800">{error} <button onClick={() => setRetry((value) => value + 1)} className="underline">Try again</button></p> : !design ? <p role="status" className="flex gap-2"><Loader2 className="h-5 w-5 animate-spin" />Loading design…</p> : <div className="grid gap-8 md:grid-cols-2">
      <div><DesignImage src={design.imageUrl} alt={`AI concept: ${design.baseProduct?.name || design.category}`} className="aspect-square w-full rounded-2xl border border-slate-200 bg-slate-50 object-contain" /><a href={design.imageUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-semibold text-indigo-700 underline">Open full-size image</a>{design.baseProduct && <div className="mt-5 flex items-center gap-3 rounded-xl bg-slate-50 p-3"><DesignImage src={design.baseProduct.image} alt="Original product" className="h-20 w-20 rounded-lg object-contain" /><div><p className="text-xs text-slate-500">Original product</p><p className="text-sm font-semibold">{design.baseProduct.name}</p></div></div>}</div>
      <div><p className="text-xs text-slate-500">Design {design.id.slice(-8).toUpperCase()} · {new Date(design.createdAt).toLocaleDateString()}</p><h2 className="mt-3 text-xl font-semibold">Requested specifications</h2><ul className="mt-4 space-y-3 break-words text-sm leading-6 text-slate-700">{design.specifications.map((line, index) => <li key={index} className="border-b border-slate-100 pb-3">{line}</li>)}</ul><p className="mt-6 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">{design.notice}</p><Link href="/design-studio" className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white">Create your own design</Link></div>
    </div>}
  </div>;
}
