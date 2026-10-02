"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Download, Layers, Loader2, Palette, RefreshCw, Ruler, Sparkles } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { categoryLabels, designApi, inferDesignCategory, materialLabels } from "@/utils/designApi";
import DesignImage from "./DesignImage";
import ProductPicker from "./ProductPicker";

const DRAFT_KEY = "snsf-design-draft-v1";
const emptyDraft = { mode: "customize", category: "sofa", base: null, fabric: null, materials: {}, dimensions: {}, description: "", colour: "", requirements: "", quantity: 1 };
const fieldClass = "mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-950 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100";
const primaryClass = "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-300";
function Section({ icon: Icon, title, children }) { return <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><h2 className="mb-5 flex items-center gap-2 text-base font-semibold"><Icon className="h-5 w-5 text-indigo-600" aria-hidden="true" />{title}</h2>{children}</section>; }
export default function DesignStudio() {
  const { isLogin, isCheckingToken, userData } = useAuth();
  const [draft, setDraft] = useState(emptyDraft);
  const [ready, setReady] = useState(false);
  const [config, setConfig] = useState(null);
  const [configError, setConfigError] = useState("");
  const [reload, setReload] = useState(0);
  const [design, setDesign] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyMore, setHistoryMore] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [pollError, setPollError] = useState("");
  const [contact, setContact] = useState({ name: "", phone: "", note: "" });
  const [sharing, setSharing] = useState(false);
  const [share, setShare] = useState(null);
  const [fabricSource, setFabricSource] = useState("library");
  const requestRef = useRef(null);
  const resultRef = useRef(null);
  const formRef = useRef(null);
  const active = ["queued", "processing"].includes(design?.status);
  const update = (values) => setDraft((old) => ({ ...old, ...values }));

  useEffect(() => {
    let stopped = false;
    const load = async () => {
      setConfigError("");
      try {
        const data = await designApi("/config", { publicRequest: true });
        if (stopped) return;
        setConfig(data);
        if (!ready) {
          let saved = null;
          try { saved = JSON.parse(sessionStorage.getItem(DRAFT_KEY)); } catch {}
          const productId = new URLSearchParams(window.location.search).get("product");
          if (saved?.draft && data.categories.includes(saved.draft.category)) { setDraft({ ...emptyDraft, ...saved.draft }); requestRef.current = saved.request || null; setFabricSource(saved.draft.fabric ? "product" : "library"); }
          if (productId && productId !== saved?.draft?.base?.id) {
            const result = await designApi(`/products?id=${encodeURIComponent(productId)}`, { publicRequest: true });
            if (stopped) return;
            if (!result.products[0]) throw new Error("That product could not be found. Choose another product below.");
            setDraft({ ...emptyDraft, base: result.products[0], category: inferDesignCategory(result.products[0]) });
          }
          setReady(true);
        }
      } catch (err) { if (!stopped) { setConfigError(err.message); setReady(true); } }
    };
    void load();
    return () => { stopped = true; };
    // Initial draft restoration should not run again when a customer edits choices.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);
  useEffect(() => { if (ready) { try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ draft, request: requestRef.current })); } catch {} } }, [draft, ready]);
  useEffect(() => { setContact((old) => ({ ...old, name: old.name || userData?.name || "", phone: old.phone || (userData?.phone ? String(userData.phone) : "") })); }, [userData]);
  const loadHistory = useCallback(async () => {
    if (!isLogin) return;
    try { const result = await designApi(`?page=${historyPage}`); setHistory(result.designs); setHistoryMore(result.hasMore); setHistoryError(""); }
    catch (err) { setHistoryError(err.message); }
  }, [isLogin, historyPage]);
  useEffect(() => { if (isLogin) void loadHistory(); else { setHistory([]); setDesign(null); setShare(null); } }, [isLogin, loadHistory]);
  useEffect(() => {
    if (!active || !isLogin) return;
    const controller = new AbortController(); let timer;
    const poll = async () => {
      try {
        const result = await designApi(`/${design.id}`, { signal: controller.signal });
        if (controller.signal.aborted) return;
        setDesign(result.design); setPollError("");
        if (!["queued", "processing"].includes(result.design.status)) { void loadHistory(); return; }
      } catch (err) { if (!controller.signal.aborted) setPollError("Connection interrupted. Your preview is saved; we’ll keep checking."); }
      if (!controller.signal.aborted) timer = setTimeout(poll, 4000);
    };
    timer = setTimeout(poll, 1500);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [active, design?.id, isLogin, loadHistory]);

  const selectDesign = (item) => { setDesign(item); setShare(null); setError(""); setPollError(""); setContact((old) => ({ ...old, ...(item.enquiry ? { name: item.enquiry.name, phone: item.enquiry.phone, note: item.enquiry.note } : { note: "" }) })); resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const useChoices = () => {
    setDraft({ mode: design.mode, category: design.category, base: design.baseProduct || null, fabric: design.fabricProduct || null, materials: Object.fromEntries(design.materials.map((item) => [item.kind, item.id])), dimensions: design.dimensions || {}, description: design.description || "", colour: design.colour || "", requirements: design.requirements || "", quantity: design.quantity || 1 });
    if (design.status === "failed") requestRef.current = null;
    setFabricSource(design.fabricProduct ? "product" : "library"); setDesign(null); setShare(null); setError(""); formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const generate = async (event) => {
    event.preventDefault();
    if (submitting || active) return;
    setSubmitting(true); setError(""); setShare(null);
    const payload = { mode: draft.mode, category: draft.category, baseProductId: draft.base?.id, fabricProductId: draft.fabric?.id, materials: draft.materials, dimensions: draft.dimensions, description: draft.description, colour: draft.colour, requirements: draft.requirements, quantity: draft.quantity };
    const signature = JSON.stringify(payload);
    if (requestRef.current?.signature !== signature) requestRef.current = { signature, key: crypto.randomUUID() };
    try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ draft, request: requestRef.current })); } catch {}
    try {
      const result = await designApi("", { method: "POST", body: { ...payload, requestKey: requestRef.current.key } });
      setDesign(result.design); setPollError("");
      // Keep the idempotency key in the session draft until the customer changes a choice.
      // A refresh or a repeated click then returns the same saved generation instead of charging another preview.
      try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ draft, request: requestRef.current })); } catch {}
      void loadHistory(); resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) { setError(err.name === "TimeoutError" ? "The request is taking longer than expected. Try again to check the same request; it won’t create a duplicate." : err.message); }
    finally { setSubmitting(false); }
  };
  const saveEnquiry = async (event) => {
    event.preventDefault(); if (sharing) return;
    setSharing(true); setError("");
    try { const result = await designApi(`/${design.id}/enquiry`, { method: "POST", body: contact }); setDesign(result.design); setShare(result); void loadHistory(); }
    catch (err) { setError(err.message); } finally { setSharing(false); }
  };
  const download = async () => {
    setError("");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/designs/${design.id}/image`, { headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }, signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw new Error("The image could not be downloaded. Please try again.");
      const url = URL.createObjectURL(await response.blob()); const anchor = document.createElement("a"); anchor.href = url; anchor.download = `SNSF-design-${design.id.slice(-8)}.png`; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (err) { setError(err.message); }
  };

  return <div className="min-h-screen bg-[#f5f6f8] px-4 pb-28 pt-6 text-slate-900 sm:px-6 sm:pt-10">
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div><p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-700"><Sparkles className="h-4 w-4" />SNSF design studio</p><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Your furniture. Your way.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Start with a piece you love or an idea of your own. Explore materials, tailor the details and bring your design to life.</p></div>
        {isLogin && <a href="#saved-designs" className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold">My saved designs</a>}
      </div>
      {configError && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{configError} <button onClick={() => setReload((value) => value + 1)} className="ml-2 font-semibold underline">Try again</button></div>}
      {!config ? <div role="status" className="flex items-center gap-3 rounded-2xl bg-white p-8"><Loader2 className="h-5 w-5 animate-spin" />Loading the design studio…</div> : <>
        {!config.enabled && <p className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Preview generation is currently unavailable. You can explore materials and prepare your choices, or <a className="font-semibold underline" href="https://wa.me/919776501230" target="_blank" rel="noopener noreferrer">contact SNSF</a> for help.</p>}
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <form ref={formRef} onSubmit={generate} className="min-w-0 space-y-5 scroll-mt-36">
            <Section icon={Layers} title="1. Start your design">
              <div className="mb-5 grid grid-cols-2 gap-2">{[["customize", "Customize a product"], ["new", "Describe a new idea"]].map(([value, label]) => <button type="button" key={value} aria-pressed={draft.mode === value} onClick={() => update({ mode: value })} className={`rounded-xl border px-3 py-3 text-sm font-semibold ${draft.mode === value ? "border-indigo-600 bg-indigo-50 text-indigo-800" : "border-slate-200 text-slate-600"}`}>{label}</button>)}</div>
              {draft.mode === "customize" && <>
                {draft.base && <div className="mb-4 flex items-center gap-3 rounded-xl bg-slate-50 p-3"><DesignImage src={draft.base.image} alt={draft.base.name} className="h-14 w-14 rounded-lg object-contain" /><div className="min-w-0"><p className="text-xs text-slate-500">Selected product</p><p className="text-sm font-semibold">{draft.base.name}</p></div><Check className="ml-auto h-5 w-5 shrink-0 text-indigo-600" /></div>}
                <ProductPicker selected={draft.base} onSelect={(product) => update({ base: product, category: inferDesignCategory(product), materials: {}, dimensions: {}, fabric: null })} />
              </>}
              <label className="mt-5 block text-sm font-medium">Product type<select value={draft.category} onChange={(event) => update({ category: event.target.value, materials: {}, dimensions: {}, fabric: null })} className={fieldClass}>{config.categories.map((key) => <option key={key} value={key}>{categoryLabels[key]}</option>)}</select></label>
              <label className="mt-5 block text-sm font-medium">{draft.mode === "new" ? "Describe the furniture you want" : "What would you like to change?"}<textarea value={draft.description} onChange={(event) => update({ description: event.target.value })} required={draft.mode === "new"} minLength={draft.mode === "new" ? 12 : undefined} maxLength={1500} rows={4} placeholder="For example: a compact three-seat sofa with rounded arms, blue upholstery and a brushed steel frame." className={fieldClass} /></label>
            </Section>
            <Section icon={Palette} title="2. Materials & appearance">
              <p className="mb-5 text-sm leading-6 text-slate-500">Choose from SNSF’s material library. Leave an option unchanged to keep the original specification or discuss it with the team.</p>
              {config.categoryMaterials[draft.category].includes("fabric") && <div className="mb-5">
                <div className="mb-3 flex flex-wrap gap-2">{[["library", "Fabric swatches"], ["product", "Fabric from another product"]].map(([value, label]) => <button type="button" key={value} aria-pressed={fabricSource === value} onClick={() => { setFabricSource(value); const materials = { ...draft.materials }; delete materials.fabric; update({ fabric: null, materials }); }} className={`rounded-full border px-3 py-2 text-xs font-semibold ${fabricSource === value ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300"}`}>{label}</button>)}</div>
                {fabricSource === "product" && <><ProductPicker fabric selected={draft.fabric} onSelect={(fabric) => update({ fabric })} />{draft.fabric && <p className="mt-3 text-sm">Fabric reference: <strong>{draft.fabric.name}</strong> <button type="button" className="ml-2 underline" onClick={() => update({ fabric: null })}>Clear</button></p>}</>}
              </div>}
              <div className="grid gap-4 sm:grid-cols-2">{config.categoryMaterials[draft.category].filter((kind) => kind !== "fabric" || fabricSource === "library").map((kind) => {
                const options = config.materials.filter((item) => item.kind === kind && (!item.categories.length || item.categories.includes(draft.category)));
                const selected = options.find((item) => item._id === draft.materials[kind]);
                return <div key={kind}><label className="block text-sm font-medium">{materialLabels[kind]}<select value={draft.materials[kind] || ""} onChange={(event) => { const materials = { ...draft.materials }; if (event.target.value) materials[kind] = event.target.value; else delete materials[kind]; update({ materials }); }} className={fieldClass}><option value="">{draft.mode === "customize" ? "Keep original / discuss with SNSF" : "Discuss with SNSF"}</option>{draft.materials[kind] && !selected && <option value={draft.materials[kind]} disabled>Saved option no longer available</option>}{options.map((item) => <option key={item._id} value={item._id}>{item.name} · {item.code}</option>)}</select></label>
                  {kind === "fabric" && options.some((item) => item.imageUrl) && <div className="mt-3 grid max-h-64 grid-cols-3 gap-2 overflow-y-auto p-1">{options.filter((item) => item.imageUrl).map((item) => <button key={item._id} type="button" aria-label={`Select ${item.name}`} aria-pressed={selected?._id === item._id} onClick={() => update({ materials: { ...draft.materials, fabric: item._id } })} className={`rounded-lg border p-1 text-left ${selected?._id === item._id ? "border-indigo-600 ring-1 ring-indigo-600" : "border-slate-200"}`}><DesignImage src={item.imageUrl} alt={item.name} className="aspect-square w-full rounded-md object-cover" /><span className="mt-1 block break-words text-[11px] leading-4">{item.name}</span></button>)}</div>}
                  {selected && <div className="mt-2 flex gap-2 rounded-lg bg-slate-50 p-2">{selected.imageUrl && kind !== "fabric" && <DesignImage src={selected.imageUrl} alt={selected.name} className="h-14 w-14 shrink-0 rounded-md object-cover" />}<p className="text-xs leading-5 text-slate-600">{selected.description || selected.name}</p></div>}
                  {!options.length && <p className="mt-2 text-xs text-slate-500">No options published yet. Add your preference in the notes.</p>}
                </div>;
              })}</div>
              <label className="mt-5 block text-sm font-medium">Colour preference <span className="font-normal text-slate-400">(optional)</span><input value={draft.colour} onChange={(event) => update({ colour: event.target.value })} maxLength={80} placeholder="Keep the selected fabric colour, or describe a colour" className={fieldClass} /></label>
            </Section>
            <Section icon={Ruler} title="3. Size & construction">
              <p className="mb-4 text-sm leading-6 text-slate-500">Enter requested dimensions in millimetres. Blank fields keep the original size or remain to be confirmed.</p>
              <div className="grid grid-cols-2 gap-4">{config.fields[draft.category].map((field) => <label key={field.key} className="block text-sm font-medium">{field.label}{field.unit && <span className="block text-xs font-normal text-slate-500">{field.unit}</span>}<input type="number" min="1" max={field.max} step={field.unit === "mm" ? "0.1" : "1"} inputMode="decimal" value={draft.dimensions[field.key] || ""} onChange={(event) => update({ dimensions: { ...draft.dimensions, [field.key]: event.target.value } })} placeholder="Unchanged" className={fieldClass} /></label>)}</div>
              <label className="mt-5 block text-sm font-medium">Quantity<input type="number" required min="1" max="1000" step="1" value={draft.quantity} onChange={(event) => update({ quantity: event.target.value })} className={fieldClass} /></label>
              <label className="mt-5 block text-sm font-medium">Other requirements<textarea rows={3} maxLength={1000} value={draft.requirements} onChange={(event) => update({ requirements: event.target.value })} placeholder="Foam density or firmness, ply thickness, storage, armrests, wheels, load requirements, accessibility, delivery location…" className={fieldClass} /></label>
              <p className="mt-3 text-xs leading-5 text-slate-500">Foam quality, metal grade, ply and load requirements are saved as specifications. Their performance cannot be verified from an image.</p>
            </Section>
            {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5">
              <p className="mb-4 text-xs leading-5 text-slate-600">{config.notice} Each preview uses one of your {config.dailyLimit} daily generations.</p>
              {isCheckingToken ? <p role="status" className="text-sm">Checking your account…</p> : isLogin ? <button type="submit" disabled={submitting || active || !config.enabled || (draft.mode === "customize" && !draft.base)} className={`${primaryClass} w-full`}>{submitting || active ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}{submitting ? "Saving your design…" : active ? "Preview is being generated…" : "Generate my preview"}</button> : <Link href="/login?next=design-studio" className={`${primaryClass} w-full`}>Sign in to generate <ArrowRight className="h-4 w-4" /></Link>}
              {!isLogin && <p className="mt-3 text-center text-xs text-slate-500">Your choices are saved in this browser while you sign in.</p>}
            </div>
          </form>
          <aside ref={resultRef} className="min-w-0 scroll-mt-36 lg:sticky lg:top-36">
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-5"><h2 className="font-semibold">{design ? "Your saved concept" : "Preview workspace"}</h2><span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-indigo-700">AI concept</span></div>
              <div className="relative flex aspect-square items-center justify-center bg-[#edf0f3] p-4">
                {design?.imageUrl ? <DesignImage src={design.imageUrl} alt={`AI concept of ${design.category}`} className="h-full w-full rounded-xl object-contain" /> : draft.base?.image && draft.mode === "customize" ? <DesignImage src={draft.base.image} alt={`Original: ${draft.base.name}`} className="h-full w-full rounded-xl object-contain" /> : <div className="max-w-xs text-center"><Sparkles className="mx-auto mb-4 h-10 w-10 text-slate-400" /><p className="text-lg font-semibold">A new idea starts here.</p><p className="mt-2 text-sm leading-6 text-slate-500">Choose your details, then generate a concept to discuss with SNSF.</p></div>}
                {active && <div role="status" aria-live="polite" className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/95 p-8 text-center"><Loader2 className="h-10 w-10 animate-spin text-indigo-600" /><p className="text-lg font-semibold">{design.status === "queued" ? "Your design is in the queue" : "Creating your furniture preview"}</p><p className="max-w-xs text-sm leading-6 text-slate-500">This can take a few minutes. Your choices are saved, so you can return through My saved designs.</p>{pollError && <p className="text-xs text-amber-700">{pollError}</p>}</div>}
                {!design && draft.base && draft.mode === "customize" && <span className="absolute bottom-5 left-5 rounded-lg bg-white/90 px-3 py-2 text-xs font-semibold">Original product</span>}
              </div>
              <div className="p-5 sm:p-6">
                {design?.status === "failed" && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-800">{design.error || "The preview could not be generated."} Your selections are saved below.</p>}
                {design ? <>
                  <p className="mb-4 text-xs text-slate-500">Design {design.id.slice(-8).toUpperCase()} · {new Date(design.createdAt).toLocaleDateString()}</p>
                  <details open className="mb-5"><summary className="cursor-pointer text-sm font-semibold">Saved specifications</summary><ul className="mt-3 space-y-2 break-words text-sm leading-6 text-slate-600">{design.specifications.map((line, index) => <li key={index}>{line}</li>)}</ul></details>
                  <p className="mb-4 text-xs leading-5 text-slate-500">{design.notice}</p>
                  <div className="flex flex-wrap gap-2">{!active && <button type="button" onClick={useChoices} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-xs font-semibold"><RefreshCw className="h-4 w-4" />{design.status === "failed" ? "Try again with these choices" : "Edit these choices"}</button>}{design.status === "ready" && <button type="button" onClick={download} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-xs font-semibold"><Download className="h-4 w-4" />Download image</button>}</div>
                </> : <p className="text-sm leading-6 text-slate-500">Your generated image and a full specification summary will appear here. Send the saved concept to SNSF when you’re ready for a quote.</p>}
              </div>
            </section>
            {design?.status === "ready" && <form onSubmit={saveEnquiry} className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="font-semibold">Let’s make it yours.</h2><p className="mt-2 text-sm leading-6 text-slate-500">Save your enquiry, then open WhatsApp with the image link and specifications. SNSF will confirm the details and quote.</p>
              <label className="mt-4 block text-sm font-medium">Your name<input required maxLength={100} autoComplete="name" value={contact.name} disabled={!!design.enquiry} onChange={(event) => setContact({ ...contact, name: event.target.value })} className={fieldClass} /></label>
              <label className="mt-4 block text-sm font-medium">Phone / WhatsApp number<input required type="tel" autoComplete="tel" maxLength={20} placeholder="+91…" value={contact.phone} disabled={!!design.enquiry} onChange={(event) => setContact({ ...contact, phone: event.target.value })} className={fieldClass} /></label>
              <label className="mt-4 block text-sm font-medium">Message for SNSF<textarea rows={2} maxLength={1000} value={contact.note} disabled={!!design.enquiry} onChange={(event) => setContact({ ...contact, note: event.target.value })} className={fieldClass} /></label>
              <p className="mt-3 text-xs leading-5 text-slate-500">Your contact details are shared with SNSF. Anyone with your design link can view the preview and specifications, but not your contact details.</p>
              {share ? <div role="status" className="mt-4 space-y-3"><p className="text-sm font-medium text-emerald-700">Enquiry saved. Open WhatsApp to send your message.</p><a href={share.whatsappUrl} target="_blank" rel="noopener noreferrer" className={`${primaryClass} w-full !bg-emerald-700`}>Send on WhatsApp <ArrowRight className="h-4 w-4" /></a><a className="block text-center text-sm font-medium text-indigo-700 underline" href={share.shareUrl} target="_blank" rel="noopener noreferrer">View shareable design</a></div> : <button disabled={sharing} className={`${primaryClass} mt-4 w-full`}>{sharing ? "Saving enquiry…" : design.enquiry ? "Open saved WhatsApp enquiry" : "Save enquiry & continue"}</button>}
              {design.enquiry && <p className="mt-3 text-xs text-slate-500">Enquiry status: {design.enquiry.status}. For changes to this enquiry, contact SNSF.</p>}
              {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
            </form>}
          </aside>
        </div>
        {isLogin && <section id="saved-designs" className="mt-12 scroll-mt-36"><h2 className="text-xl font-semibold">My saved designs</h2><p className="mt-2 text-sm text-slate-500">Every preview keeps its original specifications. Select one to view, refine or enquire.</p>{historyError && <p role="alert" className="mt-4 text-sm text-red-700">{historyError} <button onClick={loadHistory} className="underline">Retry</button></p>}
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">{history.map((item) => <button key={item.id} onClick={() => selectDesign(item)} className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 text-left hover:border-indigo-500"><DesignImage src={item.imageUrl || item.baseProduct?.image} alt={item.baseProduct?.name || categoryLabels[item.category]} className="aspect-square w-full rounded-xl object-contain" /><p className="mt-3 truncate text-sm font-semibold">{item.baseProduct?.name || categoryLabels[item.category]}</p><p className="mt-1 text-xs capitalize text-slate-500">{item.status} · {new Date(item.createdAt).toLocaleDateString()}</p></button>)}</div>
          {!history.length && !historyError && <p className="mt-5 rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">Your first design will appear here after you generate a preview.</p>}
          {(historyPage > 1 || historyMore) && <div className="mt-4 flex justify-between gap-3 text-sm"><button disabled={historyPage === 1} onClick={() => setHistoryPage((page) => page - 1)} className="rounded-lg border px-4 py-2 disabled:opacity-40">Previous</button><span>Page {historyPage}</span><button disabled={!historyMore} onClick={() => setHistoryPage((page) => page + 1)} className="rounded-lg border px-4 py-2 disabled:opacity-40">Next</button></div>}
        </section>}
      </>}
    </div>
  </div>;
}
