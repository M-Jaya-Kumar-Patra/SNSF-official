"use client";
import { useEffect, useRef, useState } from "react";
import { designAdminApi } from "@/utils/designApi";

const empty = { name: "", code: "", kind: "fabric", description: "", categories: [], active: false };
const inputClass = "mt-1 w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:outline-indigo-600";
export default function CustomizationLibrary() {
  const [data, setData] = useState(null);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("");
  const [query, setQuery] = useState("");
  const formRef = useRef(null); const fileRef = useRef(null);
  const load = async () => { try { setData(await designAdminApi("/materials")); } catch (err) { setError(err.message); } };
  useEffect(() => { void load(); }, []);
  const reset = () => { setEditing(null); setForm(empty); setFile(null); if (fileRef.current) fileRef.current.value = ""; };
  const edit = (item) => { setEditing(item); setForm({ name: item.name, code: item.code, kind: item.kind, description: item.description || "", categories: item.categories || [], active: item.active !== false }); setFile(null); setError(""); setNotice(""); if (fileRef.current) fileRef.current.value = ""; formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const save = async (event) => {
    event.preventDefault(); if (saving) return;
    setSaving(true); setError(""); setNotice("");
    try {
      const result = await designAdminApi(`/materials${editing ? `/${editing._id}` : ""}`, { method: editing ? "PUT" : "POST", body: form });
      // Keep the created record selected if the optional photo upload needs a retry.
      setEditing(result.material);
      if (file) { const upload = new FormData(); upload.append("image", file); await designAdminApi(`/materials/${result.material._id}/image`, { method: "POST", body: upload }); }
      reset(); setNotice("Material saved. Existing customer designs retain their original material specifications."); await load();
    } catch (err) { setError(err.message); void load(); } finally { setSaving(false); }
  };
  return <div className="mx-auto max-w-7xl space-y-6 p-4 text-[var(--admin-text)] sm:p-8">
    <div><p className="text-xs font-bold uppercase tracking-widest text-indigo-500">Design studio</p><h1 className="mt-2 text-3xl font-semibold">Material library</h1><p className="mt-2 max-w-3xl text-sm opacity-75">Publish fabrics, foam specifications, metal grades, ply, finishes, fittings and tabletops. Use real supplier codes and verified specifications. Archived options remain in existing enquiries.</p></div>
    {data && !data.enabled && <p className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">Image generation is disabled or awaiting server configuration. Materials can be prepared now. See server/DESIGN_STUDIO_SETUP.md for activation.</p>}
    {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800">{error} {!data && <button onClick={load} className="underline">Retry</button>}</p>}
    {notice && <p role="status" className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">{notice}</p>}
    <div className="grid items-start gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <form ref={formRef} onSubmit={save} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 text-slate-900">
        <h2 className="text-lg font-semibold">{editing ? "Edit material" : "Add a material"}</h2>
        <label className="block text-sm font-medium">Name<input required maxLength={100} className={inputClass} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="304 stainless steel / Ocean blue fabric" /></label>
        <label className="block text-sm font-medium">Unique material code<input required maxLength={40} pattern="[A-Za-z0-9_-]+" className={inputClass} value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value.toUpperCase() })} placeholder="SS-304 / FAB-001" /></label>
        <label className="block text-sm font-medium">Type<select className={inputClass} value={form.kind} onChange={(event) => setForm({ ...form, kind: event.target.value })}>{(data?.kinds || ["fabric", "foam", "metal", "ply", "finish", "hardware", "top"]).map((kind) => <option key={kind} value={kind}>{kind}</option>)}</select></label>
        <label className="block text-sm font-medium">Verified specification / description<textarea maxLength={500} rows={4} className={inputClass} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Include grade, thickness, density, firmness, weave, finish or supplier details as appropriate." /></label>
        <fieldset><legend className="mb-2 text-sm font-medium">Applies to <span className="text-xs font-normal text-slate-500">(none selected = all types)</span></legend><div className="flex flex-wrap gap-3">{(data?.categories || []).map((category) => <label key={category} className="flex items-center gap-2 text-sm capitalize"><input type="checkbox" checked={form.categories.includes(category)} onChange={(event) => setForm({ ...form, categories: event.target.checked ? [...form.categories, category] : form.categories.filter((item) => item !== category) })} />{category}</label>)}</div></fieldset>
        <label className="block text-sm font-medium">Reference photo / fabric swatch<input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="mt-2 block w-full text-xs" onChange={(event) => { const selected = event.target.files?.[0]; if (selected && selected.size > 5 * 1024 * 1024) { setError("Choose an image under 5 MB."); event.target.value = ""; setFile(null); } else { setFile(selected || null); setError(""); } }} /><span className="mt-2 block text-xs font-normal text-slate-500">JPEG, PNG or WebP, up to 5 MB. Use a clear close-up with accurate colour. Existing photos are retained if no replacement is selected.</span></label>
        <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} />Published for customers</label>
        <div className="flex gap-2"><button disabled={saving} className="flex-1 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving…" : "Save material"}</button>{editing && <button type="button" disabled={saving} onClick={reset} className="rounded-xl border px-4 py-3 text-sm">Cancel edit</button>}</div>
      </form>
      <section className="min-w-0"><div className="mb-4 flex flex-wrap gap-3"><input aria-label="Search materials" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name or code…" className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900" /><select aria-label="Filter material type" value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900"><option value="">All types</option>{data?.kinds.map((kind) => <option key={kind} value={kind}>{kind}</option>)}</select></div>
        {!data ? <p role="status">Loading library…</p> : <div className="grid gap-3 sm:grid-cols-2">{data.materials.filter((item) => (!filter || item.kind === filter) && `${item.name} ${item.code}`.toLowerCase().includes(query.toLowerCase())).map((item) => <article key={item._id} className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {item.imageUrl && <img src={item.imageUrl} alt={item.name} loading="lazy" className="mb-3 h-36 w-full rounded-xl bg-slate-100 object-contain" />}
          <div className="mb-2 flex flex-wrap gap-2"><span className="rounded-full bg-slate-100 px-2 py-1 text-xs capitalize">{item.kind}</span><span className={`rounded-full px-2 py-1 text-xs ${item.active ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"}`}>{item.active ? "Published" : "Archived / draft"}</span></div><h3 className="font-semibold">{item.name}</h3><p className="mt-1 text-xs text-slate-500">{item.code}</p><p className="mt-3 whitespace-pre-line text-sm text-slate-600">{item.description}</p><p className="mt-2 text-xs text-slate-500">{item.categories?.length ? item.categories.join(", ") : "All product types"}</p><button onClick={() => edit(item)} className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold">Edit / archive</button>
        </article>)}</div>}
        {data && !data.materials.length && <p className="rounded-xl border border-dashed border-slate-300 p-6 text-sm">Add your first material. Start with your fabric swatches and 202 / 304 steel specifications.</p>}
      </section>
    </div>
  </div>;
}
