"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ForumIcon from "@mui/icons-material/Forum";
import PaletteIcon from "@mui/icons-material/Palette";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import { fetchDataFromApi, patchData, postData } from "@/utils/api";
import { createAdminSocket } from "@/utils/socket";

const tabs = [
  { label: "All Conversations", value: "all" },
  { label: "Waiting for Admin", value: "waiting" },
  { label: "Active Chats", value: "active" },
  { label: "Design Requests", value: "designs" },
  { label: "Product Enquiries", value: "enquiries" },
  { label: "Closed Chats", value: "closed" },
];

const statusLabels = {
  PENDING: "Pending",
  UNDER_REVIEW: "Under review",
  CAN_BE_MADE: "Can be made",
  CANNOT_BE_MADE: "Cannot be made",
  NEEDS_MODIFICATION: "Needs modification",
  COMPLETED: "Completed",
};

function conversationQuery(tab) {
  if (tab === "waiting") return "status=WAITING_FOR_ADMIN";
  if (tab === "active") return "status=OPEN&mode=HUMAN";
  if (tab === "closed") return "status=CLOSED";
  if (tab === "enquiries") return "type=PRODUCT_ENQUIRY";
  return "";
}

export default function AIChatPage() {
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [conversations, setConversations] = useState([]);
  const [designRequests, setDesignRequests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const socketRef = useRef(null);
  const typingTimerRef = useRef(null);

  const loadConversations = async () => {
    setLoading(true);
    const suffix = conversationQuery(tab);
    const search = query.trim() ? `${suffix ? `${suffix}&` : ""}q=${encodeURIComponent(query.trim())}` : suffix;
    const response = await fetchDataFromApi(`/api/ai-admin/conversations${search ? `?${search}` : ""}`);
    if (response?.success) setConversations(response.data || []);
    else setMessage(response?.message || "Unable to load conversations");
    setLoading(false);
  };

  const loadDesignRequests = async () => {
    const response = await fetchDataFromApi("/api/ai-admin/design-requests");
    if (response?.success) setDesignRequests(response.data || []);
  };

  const openConversation = async (conversation) => {
    setSelected(conversation);
    const response = await fetchDataFromApi(`/api/ai-admin/conversations/${conversation._id}`);
    if (response?.success) {
      setMessages(response.messages || []);
      await postData(`/api/ai-admin/conversations/${conversation._id}/read`, {});
    }
  };

  const runConversationAction = async (action) => {
    if (!selected) return;
    const response = await postData(`/api/ai-admin/conversations/${selected._id}/${action}`, {});
    if (!response?.success) {
      setMessage(response?.message || "Unable to update conversation");
      return;
    }
    setSelected(response.conversation);
    setMessage(action === "takeover" ? "Conversation taken over" : action === "return-to-ai" ? "Conversation returned to AI" : "Conversation closed");
    await openConversation(response.conversation);
    loadConversations();
  };

  const sendReply = async (event) => {
    event.preventDefault();
    if (!selected || !reply.trim()) return;
    const response = await postData(`/api/ai-admin/conversations/${selected._id}/messages`, { message: reply.trim() });
    if (!response?.success) {
      setMessage(response?.message || "Unable to send reply");
      return;
    }
    setReply("");
    setSelected(response.conversation);
    setMessages((current) => [...current, response.message]);
    loadConversations();
  };

  const updateDesignRequest = async (requestId, status) => {
    const response = await patchData(`/api/ai-admin/design-requests/${requestId}`, {
      status,
      adminResponse: `SNSF design request status: ${statusLabels[status] || status}.`,
    });
    if (!response?.success) setMessage(response?.message || "Unable to update design request");
    else {
      setMessage("Design request updated");
      loadDesignRequests();
      loadConversations();
    }
  };

  useEffect(() => {
    loadConversations();
    loadDesignRequests();
  }, [tab]);

  useEffect(() => {
    const socket = createAdminSocket();
    if (!socket) return undefined;
    socketRef.current = socket;
    const appendMessage = (incoming) => {
      if (!incoming?._id) return;
      setMessages((current) => current.some((item) => item._id === incoming._id) ? current : [...current, incoming]);
    };
    socket.on("conversation_message", ({ conversationId: eventConversationId, message: incoming }) => {
      if (selected?._id === eventConversationId) appendMessage(incoming);
      loadConversations();
    });
    socket.on("conversation_updated", ({ conversationId: eventConversationId, conversation }) => {
      if (selected?._id === eventConversationId && conversation) setSelected(conversation);
      loadConversations();
    });
    socket.on("design_request_updated", () => loadDesignRequests());
    socket.on("conversation_typing", ({ conversationId: eventConversationId, role, isTyping }) => {
      if (selected?._id !== eventConversationId || role === "ADMIN") return;
      setTyping(Boolean(isTyping));
    });
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [selected?._id]);

  useEffect(() => {
    if (selected?._id && socketRef.current) socketRef.current.emit("join_conversation", selected._id);
  }, [selected?._id]);

  const visibleDesignRequests = useMemo(() => tab === "designs" ? designRequests : [], [tab, designRequests]);

  return (
    <div className="admin-page space-y-6 p-6">
      <div className="admin-card flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <ForumIcon className="mt-1 text-[var(--admin-accent)]" />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--admin-accent)]">Customer operations</p>
            <h1 className="text-2xl font-bold text-[var(--admin-text)]">AI &amp; Customer Chat</h1>
            <p className="mt-1 text-sm text-[var(--admin-muted)]">Work in the same customer conversation used by SNSF AI.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--admin-muted)]"><PaletteIcon fontSize="small" /> {designRequests.length} design requests</div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((item) => (
          <button key={item.value} type="button" onClick={() => setTab(item.value)} className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition ${tab === item.value ? "bg-slate-950 text-white" : "border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-muted)] hover:text-[var(--admin-text)]"}`}>
            {item.label}
          </button>
        ))}
      </div>

      {message && <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-3 text-sm text-[var(--admin-text)]">{message}</div>}

      {tab === "designs" ? (
        <div className="admin-card overflow-hidden">
          <div className="border-b border-[var(--admin-border)] px-6 py-4"><h2 className="font-semibold text-[var(--admin-text)]">Design Requests</h2></div>
          <div className="divide-y divide-[var(--admin-border)]">
            {visibleDesignRequests.length === 0 ? <p className="p-6 text-sm text-[var(--admin-muted)]">No design requests.</p> : visibleDesignRequests.map((request) => (
              <div key={request._id} className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0"><p className="font-semibold text-[var(--admin-text)]">{request.userId?.name || request.userId?.email || "Customer"}</p><p className="mt-1 text-sm text-[var(--admin-muted)]">{request.prompt}</p><p className="mt-2 text-xs text-[var(--admin-muted)]">{statusLabels[request.status] || request.status}</p></div>
                <div className="flex flex-wrap gap-2"><button type="button" onClick={() => updateDesignRequest(request._id, "CAN_BE_MADE")} className="admin-button-primary">Approve</button><button type="button" onClick={() => updateDesignRequest(request._id, "NEEDS_MODIFICATION")} className="admin-button-secondary">Request modification</button><button type="button" onClick={() => updateDesignRequest(request._id, "CANNOT_BE_MADE")} className="rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-700">Reject</button></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(280px,360px)_1fr]">
          <div className="admin-card overflow-hidden">
            <div className="flex items-center gap-2 border-b border-[var(--admin-border)] p-4"><SearchIcon fontSize="small" /><input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === "Enter" && loadConversations()} placeholder="Search conversations" className="admin-input min-w-0 flex-1" /></div>
            <div className="max-h-[680px] overflow-y-auto divide-y divide-[var(--admin-border)]">
              {loading ? <p className="p-6 text-sm text-[var(--admin-muted)]">Loading conversations...</p> : conversations.length === 0 ? <p className="p-6 text-sm text-[var(--admin-muted)]">No conversations found.</p> : conversations.map((conversation) => (
                <button key={conversation._id} type="button" onClick={() => openConversation(conversation)} className={`w-full p-4 text-left transition hover:bg-[var(--admin-surface-soft)] ${selected?._id === conversation._id ? "bg-[var(--admin-surface-soft)]" : ""}`}>
                  <div className="flex items-start justify-between gap-2"><p className="truncate font-semibold text-[var(--admin-text)]">{conversation.title}</p><span className="shrink-0 text-[10px] font-bold uppercase text-[var(--admin-muted)]">{conversation.mode}</span></div>
                  <p className="mt-1 truncate text-xs text-[var(--admin-muted)]">{conversation.userId?.name || conversation.userId?.email || "Customer"}</p>
                  <div className="mt-2 flex gap-2 text-[11px] text-[var(--admin-muted)]"><span>{conversation.status}</span><span>•</span><span>{conversation.unreadForAdmin || 0} unread</span></div>
                </button>
              ))}
            </div>
          </div>

          <div className="admin-card flex min-h-[680px] flex-col overflow-hidden">
            {!selected ? <div className="flex flex-1 items-center justify-center p-8 text-sm text-[var(--admin-muted)]">Select a conversation to begin.</div> : <>
              <div className="flex flex-col gap-3 border-b border-[var(--admin-border)] p-5 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-lg font-bold text-[var(--admin-text)]">{selected.title}</p><p className="mt-1 text-sm text-[var(--admin-muted)]">{selected.userId?.name || selected.userId?.email || "Customer"} · {selected.mode} · {selected.status}</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => runConversationAction("takeover")} className="admin-button-primary">Take Over</button><button type="button" onClick={() => runConversationAction("return-to-ai")} className="admin-button-secondary">Return to AI</button><button type="button" onClick={() => runConversationAction("close")} className="rounded-xl border border-red-200 px-3 py-2 text-sm font-semibold text-red-700">Close</button></div></div>
              <div className="flex-1 space-y-3 overflow-y-auto bg-[var(--admin-bg)] p-5">{messages.map((item) => <div key={item._id} className={`flex ${item.senderType === "ADMIN" ? "justify-end" : "justify-start"}`}><div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm ${item.senderType === "ADMIN" ? "bg-slate-950 text-white" : "border border-[var(--admin-border)] bg-[var(--admin-surface)] text-[var(--admin-text)]"}`}><p className="mb-1 text-[10px] font-bold uppercase opacity-60">{item.senderType}</p><p className="whitespace-pre-wrap">{item.content}</p></div></div>)}{typing && <p className="text-xs text-[var(--admin-muted)]">Customer is typing...</p>}</div>
              <form onSubmit={sendReply} className="flex gap-2 border-t border-[var(--admin-border)] bg-[var(--admin-surface)] p-4"><textarea value={reply} onChange={(event) => { setReply(event.target.value); if (selected?._id && socketRef.current) { socketRef.current.emit("conversation_typing", { conversationId: selected._id, isTyping: Boolean(event.target.value.trim()) }); clearTimeout(typingTimerRef.current); typingTimerRef.current = setTimeout(() => socketRef.current?.emit("conversation_typing", { conversationId: selected._id, isTyping: false }), 900); } }} placeholder="Reply in this conversation" rows={2} className="admin-input min-w-0 flex-1 resize-none" /><button type="submit" title="Send reply" className="admin-button-primary self-end"><SendIcon fontSize="small" /></button></form>
            </>}
          </div>
        </div>
      )}
    </div>
  );
}
