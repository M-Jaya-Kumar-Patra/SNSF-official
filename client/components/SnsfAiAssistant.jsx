"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Bot, Loader2, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { fetchDataFromApi, postData } from "@/utils/api";
import { createSnsfSocket } from "@/utils/socket";
import { useAuth } from "@/app/context/AuthContext";
import { getProductPath } from "@/utils/productUrl";

const suggestions = [
  "Find a sofa for my room",
  "Compare similar products",
  "Recommend from my wishlist",
  "Tell me about warranty",
  "Talk to SNSF Team",
  "Design Your Furniture",
];

const initialAssistantMessage = {
  senderType: "AI",
  content:
    "Hi, I am SNSF AI. I can help with product search, comparisons, wishlist recommendations, specifications, and enquiries. I will not guess prices.",
  metadata: {},
};

function ProductCards({ products = [] }) {
  if (!products.length) return null;

  return (
    <div className="mt-3 grid gap-2">
      {products.slice(0, 4).map((product) => (
        <Link
          key={product._id}
          href={getProductPath(product)}
          className="flex gap-3 rounded-lg border border-slate-200 bg-white p-2 text-left transition hover:border-slate-400"
        >
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-slate-100">
            {(product.image || product.images?.[0]) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.image || product.images[0]} alt={product.name} className="h-full w-full object-cover" />
            ) : null}
          </div>
          <div className="min-w-0">
            <p className="line-clamp-2 text-sm font-semibold text-slate-900">{product.name}</p>
            <p className="mt-1 text-xs text-slate-500">
              {product.reason || product.catName || product.subCat || "SNSF product"}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function SnsfAiAssistant() {
  const { isLogin, isCheckingToken } = useAuth();
  const [open, setOpen] = useState(false);
  const [loginPrompt, setLoginPrompt] = useState(false);
  const [message, setMessage] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [productContext, setProductContext] = useState(null);
  const [messages, setMessages] = useState([initialAssistantMessage]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const loadedConversationRef = useRef(false);

  const contextLabel = useMemo(() => productContext?.productName || productContext?.name, [productContext]);

  useEffect(() => {
    const handler = (event) => {
      if (!isLogin && !isCheckingToken) {
        setLoginPrompt(true);
        return;
      }
      const product = event.detail?.product || null;
      setProductContext(product);
      if (product?.productId) {
        loadedConversationRef.current = true;
        setConversationId(null);
        setMessages([initialAssistantMessage]);
      }
      setOpen(true);
      setLoginPrompt(false);
    };

    window.addEventListener("snsf-ai:open", handler);
    return () => window.removeEventListener("snsf-ai:open", handler);
  }, [isLogin, isCheckingToken]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!open || !isLogin || loadedConversationRef.current) return;

    loadedConversationRef.current = true;
    const loadLatestConversation = async () => {
      try {
        const listResponse = await fetchDataFromApi("/api/ai/conversations");
        const latest = listResponse?.data?.[0];
        if (!latest?._id) return;

        const detailResponse = await fetchDataFromApi(`/api/ai/conversations/${latest._id}`);
        if (!detailResponse?.success) return;

        setConversationId(latest._id);
        if (detailResponse.messages?.length) setMessages(detailResponse.messages);
      } catch {
        // The assistant can start a new conversation if history is unavailable.
      }
    };

    loadLatestConversation();
  }, [open, isLogin]);

  useEffect(() => {
    if (!open || !isLogin) return undefined;
    const socket = createSnsfSocket();
    if (!socket) return undefined;
    const appendMessage = (incoming) => {
      if (!incoming?._id) return;
      setMessages((current) => current.some((item) => item._id === incoming._id) ? current : [...current, incoming]);
    };
    const joinConversation = () => {
      if (conversationId) socket.emit("join_conversation", conversationId);
    };
    socket.on("connect", joinConversation);
    socket.on("conversation_message", ({ conversationId: eventConversationId, message: incoming }) => {
      if (!conversationId || eventConversationId === conversationId) appendMessage(incoming);
    });
    if (conversationId) joinConversation();
    return () => socket.disconnect();
  }, [open, isLogin, conversationId]);

  const openAssistant = () => {
    if (!isLogin && !isCheckingToken) {
      setLoginPrompt(true);
      return;
    }
    setOpen(true);
  };

  const sendMessage = async (text = message) => {
    const clean = text.trim();
    if (!clean || loading) return;

    if (!isLogin) {
      setLoginPrompt(true);
      return;
    }

    setMessage("");
    setLoading(true);
    setMessages((prev) => [...prev, { senderType: "USER", content: clean, metadata: {} }]);

    try {
      const res = await postData("/api/ai/chat", {
        message: clean,
        conversationId,
        productContext,
      });

      if (!res?.success) throw new Error(res?.message || "AI request failed");
      setConversationId(res.conversation?._id || conversationId);
      const incoming = (res.messages || []).filter((item) => item.senderType !== "USER");
      setMessages((prev) => [...prev, ...incoming]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          senderType: "AI",
          content:
            "SNSF AI is temporarily unavailable. You can still browse products or use WhatsApp/call enquiry.",
          metadata: {},
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const lastAi = [...messages].reverse().find((item) => item.senderType === "AI");
  const whatsappText = lastAi?.metadata?.whatsappText;
  const whatsappUrl = whatsappText
    ? `https://wa.me/919776501230?text=${encodeURIComponent(whatsappText)}`
    : null;

  return (
    <>
      <button
        type="button"
        onClick={openAssistant}
        className="fixed bottom-20 right-4 z-[900] flex items-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-slate-900/25 transition hover:bg-slate-800 sm:bottom-6 sm:right-6"
      >
        <Sparkles className="h-4 w-4" />
        <span>Ask SNSF AI</span>
      </button>

      {loginPrompt && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/40 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-slate-950">Please log in</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Please log in to use SNSF AI Assistant.
                </p>
              </div>
              <button type="button" onClick={() => setLoginPrompt(false)} className="rounded-md p-1 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <Link
              href="/login"
              className="mt-5 flex w-full items-center justify-center rounded-lg bg-slate-950 px-4 py-3 text-sm font-semibold text-white"
            >
              Log in
            </Link>
          </div>
        </div>
      )}

      {open && (
        <div className="fixed inset-x-0 bottom-0 z-[950] mx-auto flex h-[82vh] max-w-[460px] flex-col overflow-hidden rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:bottom-6 sm:right-6 sm:inset-x-auto sm:h-[640px] sm:w-[420px] sm:rounded-2xl">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-950 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <div>
                <p className="text-sm font-semibold">SNSF AI</p>
                <p className="text-xs text-slate-300">{contextLabel ? `Context: ${contextLabel}` : "Authenticated assistant"}</p>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="rounded-md p-1 hover:bg-white/10">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto bg-slate-50 px-3 py-4">
            <div className="space-y-3">
              {messages.map((item, index) => {
                const isUser = item.senderType === "USER";
                return (
                  <div key={`${item.senderType}-${index}`} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[86%] rounded-2xl px-3 py-2 text-sm leading-6 ${isUser ? "bg-slate-950 text-white" : "border border-slate-200 bg-white text-slate-700"}`}>
                      <p className="whitespace-pre-wrap">{item.content}</p>
                      {!isUser && <ProductCards products={item.metadata?.products || []} />}
                    </div>
                  </div>
                );
              })}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Thinking with SNSF data
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-slate-200 bg-white p-3">
            <div className="mb-2 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {suggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => item === "Design Your Furniture"
                    ? window.dispatchEvent(new CustomEvent("snsf-designer:open"))
                    : sendMessage(item)}
                  className="shrink-0 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-950"
                >
                  {item}
                </button>
              ))}
            </div>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="mb-2 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white"
              >
                <MessageCircle className="h-4 w-4" />
                Continue on WhatsApp
              </a>
            )}
            <form
              className="flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage();
              }}
            >
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={contextLabel ? "Ask about this product" : "Ask SNSF AI"}
                className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-950"
              />
              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
