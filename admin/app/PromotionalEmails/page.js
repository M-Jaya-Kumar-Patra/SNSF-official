"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { fetchDataFromApi, postData, uploadImages } from "@/utils/api";

const CAMPAIGN_ENDPOINT = "/api/admin/send-promotional-email";
const IMAGE_ENDPOINT = "/api/admin/promotional-image";
const PRODUCTION_ORIGIN = "https://admin.snsteelfabrication.com";

const escapeAttribute = (value) =>
  value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

export default function PromotionalEmailsPage() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState("");
  const [audience, setAudience] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isHtml, setIsHtml] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [sending, setSending] = useState(false);
  const [confirmAll, setConfirmAll] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [testMode, setTestMode] = useState(true);
  const contentRef = useRef(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    setTestMode(window.location.origin !== PRODUCTION_ORIGIN);
    const requestedUserId = new URLSearchParams(window.location.search).get("userId");
    if (requestedUserId) {
      setAudience("selected");
      setSelectedIds([requestedUserId]);
    }

    let active = true;
    fetchDataFromApi("/api/admin/promotional-recipients").then((response) => {
      if (!active) return;
      if (response?.success && Array.isArray(response.users)) {
        setUsers(response.users.filter((user) => user._id && user.email));
        if (typeof response.testMode === "boolean") setTestMode(response.testMode);
      } else {
        setUsersError(response?.message || "Could not load users.");
      }
      setLoadingUsers(false);
    });
    return () => { active = false; };
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) =>
      !query || `${user.name || ""} ${user.email}`.toLowerCase().includes(query)
    );
  }, [search, users]);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const selectedUsers = users.filter((user) => selectedSet.has(user._id));
  const allFilteredSelected = filteredUsers.length > 0 && filteredUsers.every((user) => selectedSet.has(user._id));
  const recipientCount = audience === "all" ? users.length : selectedUsers.length;

  const updateSelection = (userId) => {
    setSelectedIds((current) => current.includes(userId)
      ? current.filter((id) => id !== userId)
      : [...current, userId]);
  };

  const toggleFilteredUsers = () => {
    setSelectedIds((current) => {
      const next = new Set(current);
      for (const user of filteredUsers) {
        if (allFilteredSelected) next.delete(user._id);
        else next.add(user._id);
      }
      return [...next];
    });
  };

  const insertAtCursor = (snippet) => {
    const editor = contentRef.current;
    const start = editor?.selectionStart ?? content.length;
    const end = editor?.selectionEnd ?? content.length;
    setContent((current) => current.slice(0, start) + snippet + current.slice(end));
    requestAnimationFrame(() => {
      editor?.focus();
      editor?.setSelectionRange(start + snippet.length, start + snippet.length);
    });
  };

  const insertImage = (url) => {
    let parsed;
    try { parsed = new URL(url.trim()); } catch { /* handled below */ }
    if (!parsed || parsed.protocol !== "https:") {
      setError("Use a public HTTPS image URL so email recipients can see the image.");
      return;
    }
    const alt = imageAlt.trim() || "Promotional image";
    insertAtCursor(`\n<img src="${escapeAttribute(parsed.href)}" alt="${escapeAttribute(alt)}" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0;" />\n`);
    setImageUrl("");
    setImageAlt("");
    setError("");
  };

  const uploadImage = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Choose an image smaller than 5 MB.");
      return;
    }

    setUploadingImage(true);
    setError("");
    const data = new FormData();
    data.append("image", file);
    const response = await uploadImages(IMAGE_ENDPOINT, data);
    setUploadingImage(false);
    if (!response?.success || !response.url) {
      setError(response?.message || "Image upload failed. Try again.");
      return;
    }
    insertImage(response.url);
  };

  const validate = () => {
    if (!subject.trim()) return "Enter a subject.";
    if (!content.trim()) return "Write the email content.";
    if (testMode) return "";
    if (loadingUsers || usersError) return "Wait for the user list to load, then try again.";
    if (!recipientCount) return audience === "all" ? "There are no users to email." : "Select at least one user.";
    return "";
  };

  const requestSend = () => {
    setResult(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    if (audience === "all" && !testMode) {
      setConfirmAll(true);
      return;
    }
    sendCampaign();
  };

  const sendCampaign = async () => {
    if (sending) return;
    setConfirmAll(false);
    setSending(true);
    setError("");
    const response = await postData(CAMPAIGN_ENDPOINT, {
      audience,
      userIds: audience === "selected" ? selectedIds : [],
      subject: subject.trim(),
      content,
      isHtml,
    });
    setSending(false);
    if (!response?.success) {
      setError(response?.message || "Email could not be sent. Please try again.");
      return;
    }
    setResult(response);
  };

  return (
    <div className="admin-page mx-auto max-w-7xl space-y-6 p-5 pb-12 md:p-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">Communications</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900">Promotional emails</h1>
        <p className="mt-2 text-sm text-slate-600">Create an email for selected users or everyone. The SNSF header and footer are added automatically.</p>
      </div>

      {testMode && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-950" role="status">
          <strong>Test mode:</strong> Sending will deliver one preview email to <strong>jayapatra2004@gmail.com</strong> only, regardless of the selected audience.
        </div>
      )}

      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">{error}</div>}
      {result && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900" role="status">
          {result.testMode
            ? "Preview email accepted by the email provider for jayapatra2004@gmail.com only."
            : `Campaign complete: ${result.sentCount ?? 0} accepted by the email provider${result.failedCount ? `, ${result.failedCount} failed` : ""}.`}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-lg font-semibold text-slate-900">Recipients</h2>
            <p className="mt-1 text-sm text-slate-500">Choose who should receive this email.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className={`cursor-pointer rounded-xl border p-4 ${audience === "all" ? "border-blue-500 bg-blue-50" : "border-slate-200"}`}>
                <input type="radio" name="audience" value="all" checked={audience === "all"} onChange={() => setAudience("all")} className="mr-2 accent-blue-600" />
                <span className="font-semibold">All users</span>
                <span className="mt-1 block pl-5 text-xs text-slate-600">{loadingUsers ? "Loading users…" : `${users.length} users with email addresses`}</span>
              </label>
              <label className={`cursor-pointer rounded-xl border p-4 ${audience === "selected" ? "border-blue-500 bg-blue-50" : "border-slate-200"}`}>
                <input type="radio" name="audience" value="selected" checked={audience === "selected"} onChange={() => setAudience("selected")} className="mr-2 accent-blue-600" />
                <span className="font-semibold">Selected users</span>
                <span className="mt-1 block pl-5 text-xs text-slate-600">{selectedUsers.length} selected</span>
              </label>
            </div>

            {audience === "selected" && (
              <div className="mt-5">
                <div className="flex flex-wrap items-center gap-2">
                  <input aria-label="Search users" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or email" className="min-w-48 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500" />
                  <button type="button" onClick={toggleFilteredUsers} disabled={!filteredUsers.length} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">{allFilteredSelected ? "Clear results" : "Select results"}</button>
                </div>
                {usersError && <p className="mt-3 text-sm text-rose-600">{usersError}</p>}
                <div className="mt-3 max-h-64 overflow-y-auto rounded-lg border border-slate-200">
                  {filteredUsers.map((user) => (
                    <label key={user._id} className="flex cursor-pointer items-center gap-3 border-b border-slate-100 px-3 py-2.5 last:border-0 hover:bg-slate-50">
                      <input type="checkbox" checked={selectedSet.has(user._id)} onChange={() => updateSelection(user._id)} className="h-4 w-4 accent-blue-600" />
                      <span className="min-w-0 text-sm"><span className="block truncate font-medium text-slate-800">{user.name || "Unnamed user"}</span><span className="block truncate text-slate-500">{user.email}</span></span>
                    </label>
                  ))}
                  {!loadingUsers && !filteredUsers.length && <p className="px-3 py-5 text-sm text-slate-500">No matching users.</p>}
                  {loadingUsers && <p className="px-3 py-5 text-sm text-slate-500">Loading users…</p>}
                </div>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-lg font-semibold text-slate-900">Email content</h2>
            <label htmlFor="campaign-subject" className="mt-5 block text-sm font-semibold text-slate-700">Subject</label>
            <input id="campaign-subject" value={subject} onChange={(event) => setSubject(event.target.value)} maxLength={200} placeholder="A new collection is here" className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none focus:border-blue-500" />
            <div className="mt-5 flex gap-5 text-sm font-medium text-slate-700">
              <label className="flex cursor-pointer items-center gap-2"><input type="radio" checked={isHtml} onChange={() => setIsHtml(true)} className="accent-blue-600" />HTML</label>
              <label className="flex cursor-pointer items-center gap-2"><input type="radio" checked={!isHtml} onChange={() => setIsHtml(false)} className="accent-blue-600" />Plain text</label>
            </div>
            <label htmlFor="campaign-content" className="mt-5 block text-sm font-semibold text-slate-700">Message {isHtml ? "HTML" : "text"}</label>
            <textarea id="campaign-content" ref={contentRef} value={content} onChange={(event) => setContent(event.target.value)} rows={15} spellCheck={!isHtml} placeholder={isHtml ? '<h1>Something new for your space</h1>\n<p>Explore our latest collection.</p>' : "Write your message here…"} className="mt-2 w-full resize-y rounded-lg border border-slate-300 px-3 py-3 font-mono text-sm outline-none focus:border-blue-500" />
            <p className="mt-2 text-xs text-slate-500">You can edit all body HTML and inline styles. The branded header and footer are added when the email is sent.</p>

            {isHtml && (
              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-800">Add an image</h3>
                <p className="mt-1 text-xs text-slate-500">Upload an image or use a public HTTPS URL. The image tag is inserted at the cursor.</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <input aria-label="Image URL" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} placeholder="https://example.com/image.jpg" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  <input aria-label="Image description" value={imageAlt} onChange={(event) => setImageAlt(event.target.value)} placeholder="Image description" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" onClick={() => insertImage(imageUrl)} disabled={!imageUrl.trim()} className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">Insert URL</button>
                  <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={uploadImage} className="hidden" />
                  <button type="button" onClick={() => imageInputRef.current?.click()} disabled={uploadingImage} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50">{uploadingImage ? "Uploading…" : "Upload image"}</button>
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-center justify-between gap-2"><h2 className="text-lg font-semibold text-slate-900">Preview</h2><span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">Body only</span></div>
            <p className="mt-1 text-xs text-slate-500">Your email will also include the default SNSF header and footer.</p>
            <div className="mt-4 rounded-xl border border-slate-200 bg-white">
              <div className="border-b border-slate-200 px-4 py-3 text-sm"><span className="text-slate-500">Subject: </span><strong className="text-slate-900">{subject || "Your subject will appear here"}</strong></div>
              {isHtml ? (
                <iframe title="Email body preview" sandbox="" referrerPolicy="no-referrer" srcDoc={content || '<p style="color:#64748b;font-family:Arial,sans-serif">Your HTML preview will appear here.</p>'} className="h-96 w-full rounded-b-xl bg-white" />
              ) : (
                <div className="h-96 overflow-y-auto whitespace-pre-wrap break-words p-4 text-sm text-slate-800">{content || "Your message preview will appear here."}</div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-lg font-semibold text-slate-900">Ready to send?</h2>
            <p className="mt-2 text-sm text-slate-600">{testMode ? "One preview email will go to jayapatra2004@gmail.com." : `This email will go to ${recipientCount} ${recipientCount === 1 ? "user" : "users"}.`}</p>
            <button type="button" onClick={requestSend} disabled={sending || uploadingImage || loadingUsers} className="mt-5 w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">{sending ? "Sending…" : testMode ? "Send test email" : audience === "all" ? "Send to all users" : `Send to ${recipientCount} ${recipientCount === 1 ? "user" : "users"}`}</button>
          </section>
        </div>
      </div>

      {confirmAll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-campaign-title">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 id="confirm-campaign-title" className="text-xl font-bold text-slate-900">Send to all users?</h2>
            <p className="mt-3 text-sm text-slate-600">This will send the promotional email to every user with an email address. The current list has {users.length} users.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setConfirmAll(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">Cancel</button>
              <button type="button" onClick={sendCampaign} disabled={sending} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{sending ? "Sending…" : "Send campaign"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
