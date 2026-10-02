"use client";
import { useEffect, useState } from "react";
import { Search, Loader2, Check } from "lucide-react";
import { designApi } from "@/utils/designApi";
import DesignImage from "./DesignImage";

export default function ProductPicker({ fabric = false, selected, onSelect }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ products: [], hasMore: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError("");
    const timer = setTimeout(async () => {
      try { const data = await designApi(`/products?q=${encodeURIComponent(query)}&page=${page}&fabric=${fabric}`, { publicRequest: true, signal: controller.signal }); if (!controller.signal.aborted) setResult(data); }
      catch (err) { if (!controller.signal.aborted) setError(err.message); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    }, 250);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query, page, fabric, retry]);
  return <div className="space-y-3">
    <label className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3">
      <Search className="h-4 w-4 text-slate-500" aria-hidden="true" />
      <input aria-label={fabric ? "Search products with fabric" : "Search catalogue products"} className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none" value={query} maxLength={80} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder={fabric ? "Search fabric reference products…" : "Search the catalogue…"} />
    </label>
    {error ? <p role="alert" className="text-sm text-red-700">{error} <button type="button" onClick={() => setRetry((value) => value + 1)} className="underline">Try again</button></p> : loading ? <p role="status" className="flex items-center gap-2 py-5 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" />Searching products…</p> : <>
      <div className="grid max-h-80 grid-cols-2 gap-2 overflow-y-auto p-1 sm:grid-cols-3">
        {result.products.map((product) => <button type="button" key={product.id} aria-pressed={selected?.id === product.id} onClick={() => onSelect(product)} className={`relative overflow-hidden rounded-xl border p-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600 ${selected?.id === product.id ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600" : "border-slate-200 bg-white hover:border-slate-400"}`}>
          <DesignImage src={product.image} alt={product.name} className="mb-2 aspect-square w-full rounded-lg object-contain" />
          <span className="block text-xs font-semibold leading-5">{product.name}</span>
          {selected?.id === product.id && <Check className="absolute right-2 top-2 h-5 w-5 rounded-full bg-indigo-600 p-0.5 text-white" aria-hidden="true" />}
        </button>)}
      </div>
      {!result.products.length && <p className="py-4 text-sm text-slate-500">{fabric ? "No matching products with a recorded fabric. Try the material library or describe your fabric below." : "No products found. Try another name or start from an idea."}</p>}
      {(page > 1 || result.hasMore) && <div className="flex items-center justify-between text-sm"><button type="button" disabled={page === 1} onClick={() => setPage((value) => value - 1)} className="rounded-lg border px-3 py-2 disabled:opacity-40">Previous</button><span>Page {page}</span><button type="button" disabled={!result.hasMore} onClick={() => setPage((value) => value + 1)} className="rounded-lg border px-3 py-2 disabled:opacity-40">Next</button></div>}
    </>}
  </div>;
}
