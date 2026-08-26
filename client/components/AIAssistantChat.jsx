"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Armchair,
  Bot,
  Languages,
  Loader2,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
  Volume2,
  X,
} from "lucide-react";
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
  od: ["ଆପଣଙ୍କ ପାଖରେ କେଉଁ products ଅଛି?", "ମୋତେ steel bed ଚୟନ କରିବାରେ ସାହାଯ୍ୟ କରନ୍ତୁ", "Warranty policy କ'ଣ?"],
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
  const [hydrated, setHydrated] = useState(false);

  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const panelRef = useRef(null);
  const openButtonRef = useRef(null);
  const ignorePopRef = useRef(false);
  const openedByUserRef = useRef(false);

  const apiUrl = useMemo(() => process.env.NEXT_PUBLIC_API_URL || "", []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setHydrated(true);

    const savedLanguage = window.localStorage.getItem("snsf-assistant-language");
    if (savedLanguage && LANGUAGE_OPTIONS.some((option) => option.value === savedLanguage)) {
      setSelectedLanguage(savedLanguage);
      setMessages([getWelcomeMessage(savedLanguage)]);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    setTimeout(() => {
      try {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      } catch (err) {}

      try {
        inputRef.current?.focus?.({ preventScroll: true });
      } catch (err) {
        try {
          inputRef.current?.focus?.();
        } catch (e) {}
      }
    }, 120);
  }, [messages, loading, open]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onPop = (e) => {
      if (ignorePopRef.current) {
        ignorePopRef.current = false;
        return;
      }

      if (open) {
        setOpen(false);
        try {
          history.pushState(null, '');
        } catch (err) {}
      }
    };

    if (open) {
      try {
        if (openedByUserRef.current) {
          if (!history.state || !history.state.snsfAssistant) {
            history.pushState({ snsfAssistant: true }, '');
          }
        }
      } catch (err) {}

      window.addEventListener('popstate', onPop);

      const onOutsidePointer = (e) => {
        try {
          const isMobile = window.matchMedia('(max-width: 767px)').matches;
          if (isMobile) return;
          const target = e.target;
          if (!panelRef.current) return;
          if (panelRef.current.contains(target)) return;
          if (openButtonRef.current && openButtonRef.current.contains(target)) return;
          setOpen(false);
        } catch (err) {}
      };

      document.addEventListener('pointerdown', onOutsidePointer);

      return () => {
        document.removeEventListener('pointerdown', onOutsidePointer);
        window.removeEventListener('popstate', onPop);
        try {
          if (openedByUserRef.current && history.state && history.state.snsfAssistant) {
            ignorePopRef.current = true;
            history.back();
          }
        } catch (err) {}
      };
    }

    return undefined;
  }, [open]);

  const focusInput = () => {
    if (typeof window === "undefined") return;
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

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
            ? "Abhi mujhe answer mil nahi रहा. Aap SNSF से direct contact कर सकते हैं."
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
      focusInput();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[1300] flex flex-col items-end pointer-events-none">
      {hydrated && (
        <section 
          ref={panelRef} 
          className={`chatbot-panel-wrapper fixed z-[1301] flex flex-col overflow-hidden border border-slate-200 bg-white text-slate-950 shadow-2xl shadow-slate-950/25 pointer-events-auto ${
            open ? "panel-enter" : "panel-exit"
          }`}
        >
          <header className="flex items-center justify-between border-b border-slate-200 bg-slate-950 px-4 py-3 text-white shrink-0">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 text-white shadow-inner border border-white/10">
                <Bot className="h-5 w-5 text-indigo-400 animate-pulse" />
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold tracking-wide">SNSF Expert</h2>
                <p className="truncate text-[11px] text-slate-400 font-medium">Online • Ready to assist</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/80 px-2.5 py-1 text-[11px] font-semibold text-slate-200 shadow-sm">
                <Languages className="h-3.5 w-3.5 text-indigo-400" />
                <select
                  aria-label="Choose assistant language"
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                  className="appearance-none bg-transparent pr-3 text-[11px] font-semibold text-slate-100 outline-none cursor-pointer"
                >
                  {LANGUAGE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} className="bg-slate-950 text-slate-100">
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                aria-label="Close assistant"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </header>

          <div className="assistant-scroll flex-1 overflow-y-auto bg-slate-50/70 p-4 min-h-0">
            <div className="space-y-3">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={message.role === "user" ? "flex justify-end" : "flex justify-start"}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
                      message.role === "user"
                        ? "bg-slate-950 text-white rounded-br-sm"
                        : "border border-slate-200/80 bg-white text-slate-800 rounded-bl-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="whitespace-pre-line">{message.content}</p>
                      {message.role === "assistant" && (
                        <button
                          type="button"
                          aria-label="Listen to assistant answer"
                          onClick={() => speakMessage(message.content, selectedLanguage)}
                          className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-slate-400 hover:text-slate-950"
                        >
                          <Volume2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                    {message.products?.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.products.map((product) => (
                          <Link
                            key={product._id}
                            href={getProductPath(product)}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white p-2 text-slate-900 transition hover:border-slate-400 hover:shadow-md"
                          >
                            <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                              <Image
                                src={getProductImage(product)}
                                alt={product.name || "SNSF product"}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block line-clamp-2 text-xs font-bold leading-tight">
                                {product.name}
                              </span>
                              <span className="mt-0.5 block line-clamp-1 text-[11px] text-slate-500 font-medium">
                                {[product.catName, product.brand].filter(Boolean).join(" • ")}
                              </span>
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {message.actions?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {message.actions.map((action) => (
                          <a
                            key={`${action.type}-${action.href}`}
                            href={action.href}
                            target={action.type === "whatsapp" ? "_blank" : undefined}
                            rel={action.type === "whatsapp" ? "noopener noreferrer" : undefined}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px] font-semibold text-slate-900 transition hover:bg-slate-950 hover:text-white hover:border-slate-950 shadow-xs"
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
                  <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-500 shadow-sm">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" />
                    Finding best details...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="border-t border-slate-200 bg-white p-3 shrink-0">
            <div className="mb-2.5 flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {(STARTER_MESSAGES[selectedLanguage] || STARTER_MESSAGES.en).map((starter) => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => sendMessage(starter)}
                  className="shrink-0 rounded-full border border-slate-200 bg-slate-50/60 px-3 py-1.5 text-[11px] font-medium text-slate-600 transition hover:border-slate-900 hover:bg-slate-900 hover:text-white"
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
                placeholder="Ask about products, warranty..."
                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium outline-none transition focus:border-slate-950 focus:bg-white focus:ring-2 focus:ring-slate-950/10"
              />
              <button
                type="submit"
                aria-label="Send message"
                onPointerDown={(e) => e.preventDefault()} 
                onMouseDown={(e) => e.preventDefault()} 
                onTouchStart={(e) => e.preventDefault()} 
                disabled={loading || !input.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 shadow-sm"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </form>
          </div>
        </section>
      )}

      <div className="chatbot-showroom pointer-events-auto">
        <div className={`chatbot-attention ${open ? "chatbot-attention-hidden" : ""}`}>
          <div className="chatbot-attention-icon">
            <Sparkles className="h-4 w-4 text-amber-400 animate-spin" />
          </div>
          <div className="chatbot-attention-content">
            <span className="chatbot-attention-title">Need help choosing furniture?</span>
            <span className="chatbot-attention-subtitle">Ask our Furniture Expert ✨</span>
          </div>
          <span className="chatbot-attention-arrow">→</span>
        </div>

        <span className={`chatbot-ring chatbot-ring-1 ${open ? "opacity-0" : ""}`} />
        <span className={`chatbot-ring chatbot-ring-2 ${open ? "opacity-0" : ""}`} />

        <button
          ref={openButtonRef}
          type="button"
          aria-label="Open SNSF Furniture Expert"
          onClick={() => {
            setOpen((value) => {
              const next = !value;
              if (next) openedByUserRef.current = true;
              return next;
            });
          }}
          className={`chatbot-launcher ${open ? "scale-90 rotate-90" : "scale-100 rotate-0"}`}
        >
          <span className="chatbot-launcher-inner">
            {open ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Armchair className="h-7 w-7 text-white animate-bounce" strokeWidth={1.8} />
            )}
          </span>
          <span className="chatbot-status-dot" />
        </button>
      </div>

      <style jsx>{`
        .chatbot-showroom {
          position: relative;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          /* Push it up on mobile to avoid bottom nav bars */
          bottom: env(safe-area-inset-bottom, 20px);
        }

        @media (max-width: 640px) {
          .chatbot-showroom {
            position: fixed;
            right: 20px;
            bottom: calc(75px + env(safe-area-inset-bottom, 0px)); /* Adjust 75px based on your bottom nav height */
            z-index: 1200;
          }
        }

        /* Desktop: 70% Height-Locked Proportional Width */
        .chatbot-panel-wrapper {
          right: 24px;
          bottom: 92px;
          height: 70vh;
          width: calc(70vh * 0.65);
          min-width: 300px;
          max-width: 420px;
          transform-origin: bottom right;
          transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1), opacity 300ms ease;
          border-radius: 24px;
        }

        /* Mobile: True Full Screen with dynamic viewport height & safe keyboard handling */
        @media (max-width: 640px) {
          .chatbot-panel-wrapper {
            inset: 0 !important;
            width: 100vw !important;
            height: 100dvh !important;
            max-width: none !important;
            max-height: none !important;
            border-radius: 0 !important;
            border: none !important;
          }
        }

        .panel-enter {
          opacity: 1;
          transform: scale(1) translateY(0);
          pointer-events: auto;
        }

        .panel-exit {
          opacity: 0;
          transform: scale(0.85) translateY(15px);
          pointer-events: none;
        }

        .chatbot-launcher {
          position: relative;
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          background: linear-gradient(135deg, #090d16 0%, #1e293b 100%);
          color: white;
          border: 1.5px solid rgba(255, 255, 255, 0.25);
          box-shadow: 0 14px 30px rgba(15, 23, 42, 0.4), 0 4px 10px rgba(15, 23, 42, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          cursor: pointer;
          transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 300ms ease;
          animation: showroomFloat 4s ease-in-out infinite;
          z-index: 5;
        }

        .chatbot-launcher-inner {
          position: relative;
          z-index: 3;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.02));
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.15);
          animation: chairRock 5s ease-in-out infinite;
        }

        .chatbot-ring {
          position: absolute;
          inset: -4px;
          border-radius: 9999px;
          border: 1px solid rgba(99, 102, 241, 0.4);
          opacity: 0;
          pointer-events: none;
          z-index: 1;
          transition: opacity 300ms ease;
        }

        .chatbot-ring-1 {
          animation: pulseRing 3s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }

        .chatbot-ring-2 {
          animation: pulseRing 3s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
          animation-delay: 1.5s;
        }

        .chatbot-status-dot {
          position: absolute;
          top: 2px;
          right: 2px;
          width: 10px;
          height: 10px;
          border-radius: 9999px;
          background: #22c55e;
          border: 2px solid #0f172a;
          box-shadow: 0 0 6px #22c55e;
          z-index: 6;
          animation: statusPulse 2s ease-in-out infinite;
        }

        .chatbot-attention {
          position: absolute;
          right: 68px;
          bottom: 6px;
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 240px;
          padding: 10px 12px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.96));
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: white;
          box-shadow: 0 16px 32px rgba(15, 23, 42, 0.35), 0 4px 10px rgba(0, 0, 0, 0.2);
          opacity: 0;
          transform: translateX(10px) scale(0.95);
          pointer-events: none;
          z-index: 10;
          animation: attentionCard 7s ease-in-out infinite;
          transition: opacity 250ms ease, transform 250ms ease;
        }

        .chatbot-attention-hidden {
          opacity: 0 !important;
          transform: translateX(10px) scale(0.9) !important;
          animation: none !important;
          pointer-events: none !important;
        }

        .chatbot-attention::after {
          content: "";
          position: absolute;
          right: -5px;
          bottom: 18px;
          width: 10px;
          height: 10px;
          background: #172033;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          border-right: 1px solid rgba(255, 255, 255, 0.12);
          transform: rotate(45deg);
        }

        .chatbot-attention-icon {
          width: 28px;
          height: 28px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .chatbot-attention-content {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .chatbot-attention-title {
          font-size: 12px;
          line-height: 15px;
          font-weight: 700;
          white-space: nowrap;
          color: #f8fafc;
        }

        .chatbot-attention-subtitle {
          margin-top: 1px;
          font-size: 11px;
          line-height: 13px;
          color: #cbd5e1;
          white-space: nowrap;
        }

        .chatbot-attention-arrow {
          margin-left: auto;
          font-size: 14px;
          color: #94a3b8;
          animation: arrowNudge 1.4s ease-in-out infinite;
        }

        .chatbot-showroom:hover .chatbot-launcher {
          transform: translateY(-3px) scale(1.06);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.5), 0 6px 14px rgba(15, 23, 42, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .chatbot-showroom:hover .chatbot-launcher-inner {
          animation: chairRockHover 650ms ease-in-out;
        }

        .chatbot-showroom:hover .chatbot-attention:not(.chatbot-attention-hidden) {
          animation-play-state: paused;
          opacity: 1;
          transform: translateX(0) scale(1);
        }

        @keyframes showroomFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        @keyframes chairRock {
          0%, 100% { transform: rotate(0deg); }
          46% { transform: rotate(-3deg); }
          54% { transform: rotate(3deg); }
        }

        @keyframes chairRockHover {
          0% { transform: rotate(0deg); }
          35% { transform: rotate(-8deg); }
          65% { transform: rotate(7deg); }
          100% { transform: rotate(0deg); }
        }

        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.4); opacity: 0; }
        }

        @keyframes statusPulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.2); opacity: 1; }
        }

        @keyframes attentionCard {
          0%, 8% { opacity: 0; transform: translateX(10px) scale(0.95); }
          14%, 40% { opacity: 1; transform: translateX(0) scale(1); }
          46%, 100% { opacity: 0; transform: translateX(10px) scale(0.95); }
        }

        @keyframes arrowNudge {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(3px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .chatbot-launcher, .chatbot-launcher-inner, .chatbot-ring, .chatbot-status-dot, .chatbot-attention, .chatbot-attention-arrow, .chatbot-panel-wrapper {
            animation: none !important;
            transition: none !important;
          }
          .chatbot-attention { opacity: 0; }
        }
      `}</style>
    </div>
  );
}