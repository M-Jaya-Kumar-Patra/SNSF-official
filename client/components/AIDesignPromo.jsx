import Link from "next/link";
import {
  ArrowRight,
  Check,
  ImagePlus,
  Palette,
  Ruler,
  Sparkles,
} from "lucide-react";

const featureLabels = [
  "Fabric, colour & finish",
  "Size, capacity & comfort",
  "Steel, ply & construction",
];

function ConceptPreview({ compact = false }) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden rounded-[28px] border border-white/15 bg-white/10 p-3 shadow-2xl shadow-slate-950/20 backdrop-blur-sm ${
        compact ? "w-full max-w-[210px]" : "w-full max-w-[360px]"
      }`}
    >
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-indigo-400/30 blur-2xl" />
      <div className="relative rounded-2xl border border-slate-200/80 bg-white p-3 text-slate-900 shadow-lg">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Concept preview
          </span>
          <span className="rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-semibold text-indigo-700">
            AI draft
          </span>
        </div>
        <div className="mt-3 flex items-end gap-3">
          <div className="relative h-20 flex-1 overflow-hidden rounded-xl bg-gradient-to-br from-slate-200 via-slate-100 to-slate-300">
            <div className="absolute bottom-3 left-1/2 h-9 w-[68%] -translate-x-1/2 rounded-[45%_45%_22%_22%] bg-gradient-to-b from-indigo-900 to-indigo-950 shadow-[0_8px_0_rgba(15,23,42,0.18)]" />
            <div className="absolute bottom-2 left-[23%] h-8 w-2 rounded-full bg-slate-800" />
            <div className="absolute bottom-2 right-[23%] h-8 w-2 rounded-full bg-slate-800" />
          </div>
          <div className="flex shrink-0 flex-col gap-2">
            <span className="h-4 w-4 rounded-full bg-indigo-900 ring-2 ring-indigo-100" />
            <span className="h-4 w-4 rounded-full bg-amber-700 ring-2 ring-amber-100" />
            <span className="h-4 w-4 rounded-full bg-emerald-700 ring-2 ring-emerald-100" />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-[10px] font-medium text-slate-500">
          <span>Fabric + size adjusted</span>
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
        </div>
      </div>
    </div>
  );
}

export default function AIDesignPromo({ compact = false, productId }) {
  const href = productId
    ? `/design-studio?product=${encodeURIComponent(productId)}`
    : "/design-studio";

  if (compact) {
    return (
      <aside
        aria-labelledby="product-ai-design-title"
        className="relative mt-5 overflow-hidden rounded-2xl border border-indigo-200/80 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-3 text-white shadow-lg shadow-indigo-950/10 sm:mt-5 sm:p-3.5"
      >
        <div className="pointer-events-none absolute -right-10 -top-12 h-28 w-28 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-200">
              <Sparkles className="h-4 w-4" />
              <span>AI design studio</span>
              <span className="rounded-full border border-emerald-300/30 bg-emerald-400/15 px-2 py-0.5 text-[9px] tracking-[0.12em] text-emerald-200">
                NEW
              </span>
              <span className="hidden text-slate-500 sm:inline">·</span>
              <h2 id="product-ai-design-title" className="text-base font-semibold normal-case tracking-tight text-white sm:text-lg">
                Make this piece yours
              </h2>
            </div>
            <p className="mt-1 max-w-2xl truncate text-xs leading-5 text-slate-300 sm:text-[13px]">
              Explore fabric, colour, size and construction options, then generate a concept preview for this product.
            </p>
            <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-medium text-slate-300 sm:text-[11px]">
              {featureLabels.slice(0, 2).map((label) => (
                <span key={label} className="inline-flex items-center gap-1">
                  <Check className="h-3 w-3 text-emerald-300" />
                  {label}
                </span>
              ))}
            </div>
          </div>
          <Link
            href={href}
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-slate-950 transition hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:self-center sm:text-sm"
          >
            Customize with AI
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </aside>
    );
  }

  return (
    <section
      aria-labelledby="home-ai-design-title"
      className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4 py-4 text-white shadow-xl shadow-slate-300/50 sm:rounded-[28px] sm:px-8 sm:py-8 lg:px-10 lg:py-10"
    >
      <div className="pointer-events-none absolute -left-16 -top-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 right-1/4 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="relative grid items-center gap-4 sm:gap-8 lg:grid-cols-[1fr_auto] lg:gap-12">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-200 sm:gap-2 sm:text-[11px] sm:tracking-[0.18em]">
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>NEW · AI design studio</span>
          </div>
          <h2 id="home-ai-design-title" className="mt-2 max-w-2xl text-xl font-semibold leading-tight tracking-tight sm:mt-3 sm:text-4xl">
            Design it before you build it.
          </h2>
          <p className="mt-2 line-clamp-2 max-w-2xl text-xs leading-5 text-slate-300 sm:mt-3 sm:line-clamp-none sm:text-base sm:leading-6">
            Change the fabric, colour, dimensions, foam, ply, metal grade and more. Generate an AI concept preview, then send your exact choices to SNSF for a quote.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-5 sm:grid-cols-3 sm:gap-3">
            {[
              { icon: Palette, label: "Materials & finish" },
              { icon: Ruler, label: "Size & capacity" },
              { icon: ImagePlus, label: "Concept preview" },
            ].map(({ icon: Icon, label }, index) => (
              <div
                key={label}
                className={`${index === 2 ? "hidden sm:flex" : "flex"} items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 text-[10px] font-semibold text-slate-200 sm:gap-2 sm:px-3 sm:py-2.5 sm:text-xs`}
              >
                <Icon className="h-3.5 w-3.5 shrink-0 text-indigo-200 sm:h-4 sm:w-4" />
                {label}
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3 sm:mt-6">
            <Link
              href="/design-studio"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:min-h-11 sm:px-5 sm:py-3 sm:text-sm"
            >
              Try AI Design Studio
              <ArrowRight className="h-4 w-4" />
            </Link>
            <span className="hidden text-xs font-medium text-slate-400 sm:inline">Start with a product or describe your idea</span>
          </div>
          <p className="mt-2 line-clamp-1 max-w-2xl text-[10px] leading-4 text-slate-400 sm:mt-4 sm:line-clamp-none sm:text-[11px] sm:leading-5">
            AI previews help you explore possibilities. SNSF confirms production-ready specifications and pricing before manufacture.
          </p>
        </div>
        <div className="hidden justify-center lg:flex lg:justify-end">
          <ConceptPreview />
        </div>
      </div>
    </section>
  );
}
