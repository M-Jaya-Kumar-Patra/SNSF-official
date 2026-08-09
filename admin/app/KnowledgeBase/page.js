"use client";

import { useEffect, useMemo, useState } from "react";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { fetchDataFromApi, postData, putData, deleteData } from "@/utils/api";

const emptyForm = {
  title: "",
  category: "FAQ",
  sourceType: "MANUAL",
  status: "PUBLISHED",
  content: "",
};

const categories = [
  "WARRANTY",
  "STEEL_GRADES",
  "PRODUCT_CARE",
  "DELIVERY",
  "RETURNS",
  "CUSTOMIZATION",
  "FAQ",
  "COMPANY",
  "OTHER",
];

export default function KnowledgeBasePage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const indexedCount = useMemo(
    () => items.filter((item) => item.indexingStatus === "INDEXED").length,
    [items]
  );

  const loadItems = async () => {
    setLoading(true);
    const response = await fetchDataFromApi("/api/ai/knowledge");
    if (response?.success) setItems(response.data || []);
    else setMessage(response?.message || "Unable to load knowledge base");
    setLoading(false);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const response = editingId
      ? await putData(`/api/ai/knowledge/${editingId}`, form)
      : await postData("/api/ai/knowledge", form);
    setSaving(false);

    if (!response?.success) {
      setMessage(response?.message || "Unable to save knowledge entry");
      return;
    }

    setMessage(editingId ? "Knowledge entry updated" : "Knowledge entry created");
    resetForm();
    loadItems();
  };

  const edit = async (item) => {
    const detailResponse = await fetchDataFromApi(`/api/ai/knowledge/${item._id}`);
    const detail = detailResponse?.success ? detailResponse.data : item;
    setEditingId(item._id);
    setForm({
      title: detail.title || "",
      category: detail.category || "OTHER",
      sourceType: detail.sourceType || "MANUAL",
      status: detail.status || "PUBLISHED",
      content: detail.content || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this knowledge entry and its indexed chunks?")) return;
    const response = await deleteData(`/api/ai/knowledge/${id}`);
    if (!response?.success) {
      setMessage(response?.message || "Unable to delete knowledge entry");
      return;
    }
    setMessage("Knowledge entry deleted");
    loadItems();
  };

  const index = async (id) => {
    setMessage("Indexing knowledge entry...");
    const response = await postData(`/api/ai/knowledge/${id}/index`, {});
    setMessage(response?.success ? "Knowledge entry indexed" : response?.message || "Indexing failed");
    loadItems();
  };

  const reindex = async () => {
    setMessage("Re-indexing published knowledge...");
    const response = await postData("/api/ai/knowledge/reindex", {});
    setMessage(response?.success ? "Re-index request completed" : response?.message || "Re-indexing failed");
    loadItems();
  };

  return (
    <div className="admin-page space-y-6 p-6">
      <div className="admin-card flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <MenuBookIcon className="mt-1 text-[var(--admin-accent)]" />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--admin-accent)]">AI knowledge</p>
            <h1 className="text-2xl font-bold text-[var(--admin-text)]">Knowledge Base</h1>
            <p className="mt-1 text-sm text-[var(--admin-muted)]">Manage verified information used by SNSF AI answers.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={loadItems} className="admin-button-secondary inline-flex items-center gap-2">
            <RefreshIcon fontSize="small" /> Refresh
          </button>
          <button type="button" onClick={reindex} className="admin-button-primary inline-flex items-center gap-2">
            <PlayArrowIcon fontSize="small" /> Re-index published
          </button>
        </div>
      </div>

      {message && <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-3 text-sm text-[var(--admin-text)]">{message}</div>}

      <form onSubmit={submit} className="admin-card space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--admin-text)]">{editingId ? "Edit knowledge" : "Add knowledge"}</h2>
          {editingId && <button type="button" onClick={resetForm} className="text-sm font-semibold text-[var(--admin-muted)] hover:text-[var(--admin-text)]">Cancel edit</button>}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <input required value={form.title} onChange={(event) => updateField("title", event.target.value)} placeholder="Title" className="admin-input" />
          <select value={form.category} onChange={(event) => updateField("category", event.target.value)} className="admin-input">
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
          <select value={form.sourceType} onChange={(event) => updateField("sourceType", event.target.value)} className="admin-input">
            <option value="MANUAL">MANUAL</option>
            <option value="POLICY">POLICY</option>
            <option value="FAQ">FAQ</option>
            <option value="DOCUMENT">DOCUMENT</option>
          </select>
          <select value={form.status} onChange={(event) => updateField("status", event.target.value)} className="admin-input">
            <option value="PUBLISHED">PUBLISHED</option>
            <option value="DRAFT">DRAFT</option>
          </select>
        </div>
        <textarea required value={form.content} onChange={(event) => updateField("content", event.target.value)} placeholder="Write verified SNSF information..." rows={8} className="admin-input resize-y" />
        <button disabled={saving} type="submit" className="admin-button-primary inline-flex items-center gap-2 disabled:opacity-60">
          {editingId ? <EditOutlinedIcon fontSize="small" /> : <AddIcon fontSize="small" />}
          {saving ? "Saving..." : editingId ? "Update knowledge" : "Add knowledge"}
        </button>
      </form>

      <div className="admin-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--admin-border)] px-6 py-4">
          <div>
            <h2 className="font-semibold text-[var(--admin-text)]">Entries</h2>
            <p className="text-sm text-[var(--admin-muted)]">{indexedCount} of {items.length} entries indexed</p>
          </div>
        </div>
        {loading ? <div className="p-8 text-sm text-[var(--admin-muted)]">Loading knowledge...</div> : items.length === 0 ? <div className="p-8 text-sm text-[var(--admin-muted)]">No knowledge entries yet.</div> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-[var(--admin-surface-soft)] text-xs uppercase text-[var(--admin-muted)]">
                <tr><th className="px-6 py-3">Title</th><th className="px-3 py-3">Category</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Index</th><th className="px-6 py-3 text-right">Actions</th></tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className="border-t border-[var(--admin-border)] align-top">
                    <td className="px-6 py-4"><p className="font-semibold text-[var(--admin-text)]">{item.title}</p><p className="mt-1 max-w-md text-xs text-[var(--admin-muted)]">{item.chunkCount || 0} chunks{item.indexingError ? ` · ${item.indexingError}` : ""}</p></td>
                    <td className="px-3 py-4 text-[var(--admin-muted)]">{item.category}</td>
                    <td className="px-3 py-4 text-[var(--admin-muted)]">{item.status}</td>
                    <td className="px-3 py-4"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${item.indexingStatus === "INDEXED" ? "bg-emerald-100 text-emerald-700" : item.indexingStatus === "ERROR" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{item.indexingStatus}</span></td>
                    <td className="px-6 py-4"><div className="flex justify-end gap-1"><button title="Index" type="button" onClick={() => index(item._id)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"><PlayArrowIcon fontSize="small" /></button><button title="Edit" type="button" onClick={() => edit(item)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"><EditOutlinedIcon fontSize="small" /></button><button title="Delete" type="button" onClick={() => remove(item._id)} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><DeleteOutlineIcon fontSize="small" /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
