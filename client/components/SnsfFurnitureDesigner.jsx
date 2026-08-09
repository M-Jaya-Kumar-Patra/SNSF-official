"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Loader2, Palette, Send, Sparkles, X } from "lucide-react";
import { fetchDataFromApi, postData } from "@/utils/api";
import { createSnsfSocket } from "@/utils/socket";
import { useAuth } from "@/app/context/AuthContext";

const EMPTY_DESIGN = {
  prompt: "",
  structuredRequirements: {},
  generatedImage: {},
  versions: [],
  currentVersion: 0,
  generationStatus: "PENDING",
};

function designImage(design) {
  return design?.generatedImage?.url || design?.versions?.at(-1)?.image?.url || "";
}

export default function SnsfFurnitureDesigner() {
  const { isLogin, isCheckingToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [modification, setModification] = useState("");
  const [design, setDesign] = useState(EMPTY_DESIGN);
  const [conversationId, setConversationId] = useState(null);
  const [requestStatus, setRequestStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [loginPrompt, setLoginPrompt] = useState(false);

  useEffect(() => {
    const openDesigner = () => {
      if (!isLogin && !isCheckingToken) {
        setLoginPrompt(true);
        return;
      }
      setOpen(true);
      setLoginPrompt(false);
    };
    window.addEventListener("snsf-designer:open", openDesigner);
    return () => window.removeEventListener("snsf-designer:open", openDesigner);
  }, [isLogin, isCheckingToken]);

  useEffect(() => {
    if (!open || !isLogin) return undefined;
    const socket = createSnsfSocket();
    if (!socket) return undefined;
    const onDesignUpdate = ({ conversationId: eventConversationId, design: nextDesign, designRequest }) => {
      if (eventConversationId && conversationId && eventConversationId !== conversationId) return;
      if (nextDesign?._id === design?._id) setDesign(nextDesign);
      if (designRequest?.status) setRequestStatus(designRequest.status);
    };
    socket.on("conversation_updated", onDesignUpdate);
    socket.on("design_request_updated", onDesignUpdate);
    if (conversationId) socket.emit("join_conversation", conversationId);
    return () => socket.disconnect();
  }, [open, isLogin, conversationId, design?._id]);

  const imageUrl = useMemo(() => designImage(design), [design]);

  const createDesign = async (event) => {
    event.preventDefault();
    if (!prompt.trim() || busy) return;
    setBusy(true);
    setRequestStatus("");
    const response = await postData("/api/ai/designs", { prompt: prompt.trim(), conversationId });
    setBusy(false);
    if (!response?.success) {
      setRequestStatus(response?.message || "Unable to create design");
      return;
    }
    setDesign(response.design || EMPTY_DESIGN);
    setConversationId(response.conversation?._id || conversationId);
    setRequestStatus(response.imageAvailable ? "Concept generated" : response.message || "Design saved; image generation is unavailable until configured.");
  };

  const editDesign = async (event) => {
    event.preventDefault();
    if (!modification.trim() || !design?._id || busy) return;
    setBusy(true);
    const response = await postData(`/api/ai/designs/${design._id}/edit`, { modification: modification.trim() });
    setBusy(false);
    if (!response?.success) {
      setRequestStatus(response?.message || "Image editing unavailable");
      return;
    }
    setDesign(response.data || design);
    setModification("");
    setRequestStatus("New design version created");
  };

  const submitForApproval = async () => {
    if (!design?._id || busy) return;
    setBusy(true);
    const response = await postData(`/api/ai/designs/${design._id}/request`, {});
    setBusy(false);
    setRequestStatus(response?.success ? "Sent to SNSF for feasibility approval" : response?.message || "Unable to submit design");
  };

  if (!open && !loginPrompt) return null;

  return (
    <>
      {loginPrompt && <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-950/40 px-4"><div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl"><div className="flex items-start justify-between gap-3"><div><p className="text-lg font-semibold text-slate-950">Please log in</p><p className="mt-2 text-sm leading-6 text-slate-600">Please log in to design furniture with SNSF AI.</p></div><button type="button" title="Close" onClick={() => setLoginPrompt(false)} className="rounded-md p-1 hover:bg-slate-100"><X className="h-5 w-5" /></button></div><a href="/login" className="mt-5 flex w-full items-center justify-center rounded-lg bg-slate-950 px-4 py-3 text-sm font-semibold text-white">Log in</a></div></div>}
      {open && <div className="fixed inset-0 z-[1050] flex items-end justify-center bg-slate-950/40 p-0 sm:items-center sm:p-4"><section className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"><header className="flex items-center justify-between border-b border-slate-200 bg-slate-950 px-5 py-4 text-white"><div className="flex items-center gap-3"><Palette className="h-5 w-5" /><div><h2 className="font-semibold">Design Your Furniture</h2><p className="text-xs text-slate-300">Create a concept for SNSF feasibility review</p></div></div><button type="button" title="Close designer" onClick={() => setOpen(false)} className="rounded-md p-1 hover:bg-white/10"><X className="h-5 w-5" /></button></header><div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-2"><div className="space-y-4 p-5"><form onSubmit={createDesign} className="space-y-3"><label className="block text-sm font-semibold text-slate-900" htmlFor="snsf-design-prompt">Describe your furniture</label><textarea id="snsf-design-prompt" value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={6} placeholder="I want a 3-seater stainless steel sofa with blue floral fabric, curved back and wooden armrests." className="w-full resize-y rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-slate-950" /><button type="submit" disabled={busy || !prompt.trim()} className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white disabled:bg-slate-300">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}Create concept</button></form>{Object.keys(design.structuredRequirements || {}).length > 0 && <div className="rounded-xl border border-slate-200 p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Extracted requirements</p><dl className="mt-3 grid grid-cols-2 gap-2 text-sm">{Object.entries(design.structuredRequirements).filter(([, value]) => value).map(([key, value]) => <div key={key}><dt className="text-xs text-slate-500">{key}</dt><dd className="font-semibold text-slate-900">{String(value)}</dd></div>)}</dl></div>}{design._id && <><form onSubmit={editDesign} className="space-y-2"><label htmlFor="snsf-design-edit" className="text-sm font-semibold text-slate-900">Modify this concept</label><div className="flex gap-2"><input id="snsf-design-edit" value={modification} onChange={(event) => setModification(event.target.value)} placeholder="Make the fabric blue" className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-950" /><button type="submit" title="Create modified version" disabled={busy || !modification.trim()} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white disabled:bg-slate-300"><Send className="h-4 w-4" /></button></div></form><button type="button" onClick={submitForApproval} disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-900 hover:border-slate-950 disabled:opacity-50"><Check className="h-4 w-4" />Ask SNSF if this can be made</button></>}</div><div className="border-t border-slate-200 bg-slate-50 p-5 lg:border-l lg:border-t-0">{imageUrl ? <img src={imageUrl} alt="AI-generated furniture concept" className="aspect-square w-full rounded-xl object-cover" /> : <div className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">{design._id ? "AI image generation is unavailable until an image model is configured." : "Your furniture concept will appear here."}</div>}<p className="mt-3 text-xs font-semibold leading-5 text-slate-600">AI-generated concept — subject to SNSF feasibility approval.</p>{design.versions?.length > 0 && <div className="mt-4 flex gap-2 overflow-x-auto">{design.versions.map((version) => <div key={version._id || version.versionNumber} className="shrink-0 text-center"><div className="h-14 w-14 overflow-hidden rounded-lg border border-slate-200 bg-white">{version.image?.url && <img src={version.image.url} alt={`Design version ${version.versionNumber}`} className="h-full w-full object-cover" />}</div><p className="mt-1 text-[10px] text-slate-500">V{version.versionNumber}</p></div>)}</div>}{requestStatus && <p className="mt-4 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs leading-5 text-slate-600">{requestStatus}</p>}</div></div></section></div>}
    </>
  );
}
