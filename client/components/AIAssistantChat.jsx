"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bot, Languages, Loader2, MessageCircle, Phone, Send, Volume2, X } from "lucide-react";
import WhatsappIcon from "@/components/WhatsappIcon";
import { getCloudinaryImageUrl } from "@/utils/cloudinary";
import { getProductPath } from "@/utils/productUrl";

const CONTACT_ACTIONS = [
  {
    type: "whatsapp",
    label: "Chat on WhatsApp",
    href: "https://wa.me/919776501230",
  },
  {
    type: "call",
    label: "Call Now",
    href: "tel:+919776501230",
  },
];

const LANGUAGE_OPTIONS = [
  { value: "en", label: "English", nativeLabel: "English", speech: "en-US" },
  { value: "hi", label: "हिंदी", nativeLabel: "Hindi", speech: "hi-IN" },
  { value: "od", label: "ଓଡ଼ିଆ", nativeLabel: "Odia", speech: "hi-IN" },
];

const STARTER_MESSAGES = {
  en: ["What products do you provide?", "Help me choose a steel bed", "What is the warranty policy?"],
  hi: ["आपके पास कौन-कौन से products हैं?", "मुझे steel bed चुनने में मदद करें", "Warranty policy क्या है?"],
  od: ["ଆପଣଙ୍କ ପାଖରେ କେଉଁ products ଅଛନ୍ତି?", "ମୋତେ steel bed ଚୟନ କରିବାରେ ସାହାଯ୍ୟ କରନ୍ତୁ", "Warranty policy କ'ଣ?"],
};

function getLanguageMeta(language = "en") {
  return LANGUAGE_OPTIONS.find((option) => option.value === language) || LANGUAGE_OPTIONS[0];
}

function getWelcomeMessage(language = "en") {
  const copy = {
    en: "Hi, I can help with SNSF products, materials, warranty, customization, and contact details. For prices, I will connect you with the shop directly.",
    hi: "Namaste, main SNSF products, materials, warranty, customization aur contact details mein madad kar sakta hoon. Prices ke liye main aapko shop se direct connect kar dunga.",
    od: "ନମସ୍କାର, ମୁଁ SNSF products, materials, warranty, customization ଏବଂ contact details ରେ ସାହାଯ୍ୟ କରିପାରିବି। Price ପାଇଁ ମୁଁ ଆପଣଙ୍କୁ shop ସହିତ direct connect କରିବି।",
  };

  return {
    role: "assistant",
    content: copy[language] || copy.en,
    actions: CONTACT_ACTIONS,
    products: [],
  };
}

function ActionIcon({ type }) {
  if (type === "whatsapp") return <WhatsappIcon className="h-4 w-4" />;
  if (type === "call") return <Phone className="h-4 w-4" />;
  return <MessageCircle className="h-4 w-4" />;
}

function cleanAssistantText(value) {
  return String(value || "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .trim();
}

function getProductImage(product) {
  return getCloudinaryImageUrl(product?.images?.[0] || "/images/placeholder.jpg", {
    width: 96,
    height: 96,
  });
}

export default function AIAssistantChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [messages, setMessages] = useState(() => [getWelcomeMessage("en")]);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const apiUrl = useMemo(() => process.env.NEXT_PUBLIC_API_URL || "", []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedLanguage = window.localStorage.getItem("snsf-assistant-language");
    if (savedLanguage && LANGUAGE_OPTIONS.some((option) => option.value === savedLanguage)) {
      setSelectedLanguage(savedLanguage);
      setMessages([getWelcomeMessage(savedLanguage)]);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, open]);

  const handleLanguageChange = (event) => {
    const nextLanguage = event.target.value;
    setSelectedLanguage(nextLanguage);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("snsf-assistant-language", nextLanguage);
    }

    setMessages((current) => {
      if (current.length === 1 && current[0].role === "assistant") {
        return [getWelcomeMessage(nextLanguage)];
      }
      return current;
    });
  };

  const speakMessage = (text, language = selectedLanguage) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const languageMeta = getLanguageMeta(language);
    const preferredVoice =
      window.speechSynthesis
        .getVoices()
        .find((voice) => voice.lang.toLowerCase().startsWith(languageMeta.speech.toLowerCase().slice(0, 2))) ||
      window.speechSynthesis
        .getVoices()
        .find((voice) => voice.lang.toLowerCase().startsWith("en")) ||
      null;

    utterance.lang = languageMeta.speech;
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async (text = input) => {
    const message = text.trim();
    if (!message || loading) return;
    const recentProducts =
      [...messages]
        .reverse()
        .find((item) => item.role === "assistant" && item.products?.length)
        ?.products?.slice(0, 6) || [];

    setInput("");
    setLoading(true);
    setMessages((current) => [...current, { role: "user", content: message }]);

    try {
      const response = await fetch(`${apiUrl}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, recentProducts, language: selectedLanguage }),
      });
      const data = await response.json();

      const assistantContent = cleanAssistantText(
        data?.answer ||
          (selectedLanguage === "hi"
            ? "Abhi mujhe answer mil nahi raha. Aap SNSF se direct contact kar sakte hain."
            : selectedLanguage === "od"
              ? "ବର୍ତ୍ତମାନ ମୁଁ ଉତ୍ତର ପାଇପାରିବି ନାହିଁ। ଆପଣ SNSF ସହିତ direct contact କରିପାରିବେ।"
              : "I could not answer that right now. Please contact SNSF directly."),
      );

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: assistantContent,
          actions: data?.actions?.length ? data.actions : CONTACT_ACTIONS,
          products: data?.products || [],
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            selectedLanguage === "hi"
              ? "Assistant अस्थायी रूप से उपलब्ध नहीं है। आप SNSF से direct contact कर सकते हैं."
              : selectedLanguage === "od"
                ? "Assistant କ୍ଷଣିକ ସମୟରେ ଉପଲବ୍ଧ ନାହିଁ। ଆପଣ SNSF ସହିତ direct contact କରିପାରିବେ।"
                : "Assistant is temporarily unavailable. You can still contact SNSF directly.",
          actions: CONTACT_ACTIONS,
          products: [],
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  return (
    <div className="fixed bottom-[88px] right-4 z-[1300] md:bottom-6">
      {open && (
        <section className="mb-3 flex h-[min(620px,calc(100vh-120px))] w-[calc(100vw-32px)] max-w-[390px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-950 shadow-2xl shadow-slate-950/25">
          <header className="flex items-center justify-between border-b border-slate-200 bg-slate-950 px-4 py-3 text-white">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-slate-950">
                <Bot className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold">SNSF Assistant</h2>
                <p className="truncate text-xs text-slate-300">Products and support</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-2 py-1.5 text-[10px] font-semibold text-slate-200">
                <Languages className="h-3.5 w-3.5" />
                <select
                  aria-label="Choose assistant language"
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                  className="appearance-none bg-transparent pr-4 text-[10px] font-semibold text-slate-100 outline-none"
                >
                  {LANGUAGE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} className="bg-slate-900 text-slate-100">
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                aria-label="Close assistant"
                onClick={() => setOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </header>

          <div className="assistant-scroll flex-1 overflow-y-auto bg-slate-50 p-3">
            <div className="space-y-3">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={message.role === "user" ? "flex justify-end" : "flex justify-start"}
                >
                  <div
                    className={`max-w-[86%] rounded-2xl px-3 py-2 text-sm leading-6 ${
                      message.role === "user"
                        ? "bg-slate-950 text-white"
                        : "border border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="whitespace-pre-line">{message.content}</p>
                      {message.role === "assistant" && (
                        <button
                          type="button"
                          aria-label="Listen to assistant answer"
                          onClick={() => speakMessage(message.content, selectedLanguage)}
                          className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-slate-400 hover:text-slate-950"
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    {message.products?.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.products.map((product) => (
                          <Link
                            key={product._id}
                            href={getProductPath(product)}
                            className="flex min-h-16 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-900 transition hover:border-slate-400 hover:bg-white"
                          >
                            <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
                              <Image
                                src={getProductImage(product)}
                                alt={product.name || "SNSF product"}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block line-clamp-2 text-sm font-semibold leading-5">
                                {product.name}
                              </span>
                              <span className="mt-1 block line-clamp-1 text-xs text-slate-500">
                                {[product.catName, product.brand].filter(Boolean).join(" - ")}
                              </span>
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {message.actions?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.actions.map((action) => (
                          <a
                            key={`${action.type}-${action.href}`}
                            href={action.href}
                            target={action.type === "whatsapp" ? "_blank" : undefined}
                            rel={action.type === "whatsapp" ? "noopener noreferrer" : undefined}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 transition hover:border-slate-950"
                          >
                            <ActionIcon type={action.type} />
                            {action.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Thinking
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="border-t border-slate-200 bg-white p-3">
            <div className="mb-2 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {(STARTER_MESSAGES[selectedLanguage] || STARTER_MESSAGES.en).map((starter) => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => sendMessage(starter)}
                  className="shrink-0 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-950 hover:text-slate-950"
                >
                  {starter}
                </button>
              ))}
            </div>
            <form
              className="flex items-center gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage();
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about products..."
                className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium outline-none transition focus:border-slate-950 focus:bg-white"
              />
              <button
                type="submit"
                aria-label="Send message"
                disabled={loading || !input.trim()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </button>
            </form>
          </div>
        </section>
      )}

      <button
        type="button"
        aria-label="Open SNSF assistant"
        onClick={() => setOpen((value) => !value)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-white shadow-2xl shadow-slate-950/30 transition hover:-translate-y-0.5 hover:bg-slate-800"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      <style jsx>{`
        .assistant-scroll {
          scrollbar-width: thin;
          scrollbar-color: #94a3b8 #f8fafc;
        }

        .assistant-scroll::-webkit-scrollbar {
          width: 8px;
        }

        .assistant-scroll::-webkit-scrollbar-track {
          background: #f8fafc;
        }

        .assistant-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border: 2px solid #f8fafc;
          border-radius: 999px;
        }

        .assistant-scroll::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
