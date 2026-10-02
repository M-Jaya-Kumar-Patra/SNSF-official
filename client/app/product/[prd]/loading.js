export default function ProductLoading() {
  return (
    <main className="mx-auto min-h-[60vh] max-w-7xl px-4 py-8" role="status" aria-label="Loading product details">
      <div className="mb-6 h-4 w-40 animate-pulse rounded bg-slate-200" />
      <div className="grid gap-8 md:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-2xl bg-slate-100" />
        <div className="space-y-5">
          <div className="h-8 w-3/4 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-slate-100" />
          <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
          <div className="h-12 w-44 animate-pulse rounded-xl bg-slate-200" />
          <p className="text-sm text-slate-500">Loading product details…</p>
        </div>
      </div>
    </main>
  );
}
