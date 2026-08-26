import ProductModel from "../models/product.model.js";
import {
  buildRagProductDocument,
  sanitizePublicProduct,
  sanitizePublicProducts,
} from "../utils/publicProduct.js";
import { ingestRagKnowledge, retrieveRagContext } from "../services/rag.service.js";

const CONTACT = {
  phone: "+919776501230",
  whatsapp: "https://wa.me/919776501230",
  email: "support@snsteelfabrication.com",
  address:
    "S N Steel Fabrication, New Burupada, Near Hanuman Temple, Via - Hinjilicut, Ganjam, Odisha - 761102, India",
};

const STATIC_KNOWLEDGE = [
  {
    sourceType: "page",
    title: "About SNSF",
    text:
      "S N Steel Fabrication designs and manufactures stainless steel furniture in New Burupada, Hinjilicut, Odisha. Products include steel beds, almirahs, chairs, dining tables, sofa sets, office furniture, and custom fabrication for homes, institutions, offices, and businesses.",
  },
  {
    sourceType: "page",
    title: "Warranty Policy",
    text:
      "SNSF warranty covers the stainless steel structure only. 202 grade stainless steel has 5 years warranty and 304 grade stainless steel has 15 years warranty. Fabric, foam cushions, non-steel parts, negligent use, harsh chemicals, physical damage, improper maintenance, and modifications are not covered.",
  },
  {
    sourceType: "page",
    title: "Contact SNSF",
    text: `Customers can contact SNSF by phone or WhatsApp at ${CONTACT.phone}, email ${CONTACT.email}, or visit ${CONTACT.address}. Working hours are Sun - Sat, 9:00 AM - 8:00 PM.`,
  },
];

const PRICE_INTENT =
  /\b(price|prices|pricing|cost|costs|rate|rates|amount|mrp|rs\.?|rupees?|inr|₹|cheap|cheapest|expensive|most expensive|least expensive|budget|starting price|price range|quote|quotation|how much|kitna|kitne|daam|dam|paisa|paise|mulya|kimat|keemat|ଦାମ|ମୂଲ୍ୟ|କେତେ)\b/i;

const PRICE_OUTPUT =
  /(₹\s*\d|\b(?:rs\.?|inr)\s*\d|\d[\d,]*(?:\.\d+)?\s*(?:rupees?|rs\.?|inr)\b|\b(?:price|cost|rate|mrp)\s*(?:is|:|-)?\s*\d)/i;

const GREETING_INTENT =
  /^(hi|hii|hello|hey|heyy|namaste|namaskar|good morning|good afternoon|good evening|नमस्ते|नमस्कार|हेलो|हाय|ନମସ୍କାର|ହାଇ|ହେଲୋ)\s*[!.?।]*$/i;

const LINK_INTENT =
  /\b(link|links|url|urls|open|view|show page|product page|where can i see)\b/i;

const OWNER_INTENT =
  /\b(owner|proprietor|founder|shop owner|business owner|who owns|owned by)\b/i;

const PRODUCT_INTENT =
  /\b(product|products|catalogue|catalog|show|suggest|recommend|option|options|choose|compare|sofa|shofa|chair|bed|almirah|dining|table|stool|cabinet|storage|office|furniture|cover|kursi|कुर्सी|सोफा|बेड|फर्नीचर|ଆସବାବ|ଚେୟାର|ସୋଫା|ବେଡ୍|ଟେବୁଲ)\b/i;

const SYSTEM_PROMPT =
  "You are the S N Steel Fabrication website assistant. Answer only from the provided safe context. Never reveal, estimate, compare, rank, infer, summarize, or calculate product prices. If asked about price, tell the customer to contact SNSF on WhatsApp or phone. Do not invent product details. If asked for an owner name and it is not in the safe context, say you do not have a verified owner name and share official contact options. Reply in plain text only, without Markdown.";

const LANGUAGE_LABELS = {
  en: "English",
  hi: "Hindi or Hinglish",
  od: "Odia",
};

function normalizeLanguage(value) {
  const language = String(value || "").trim().toLowerCase();
  if (!language) return null;

  if (["en", "english"].includes(language)) return "en";
  if (["hi", "hindi", "hinglish"].includes(language)) return "hi";
  if (["od", "odia", "oriya", "or"].includes(language)) return "od";

  return null;
}

function detectLanguage(message) {
  if (/[\u0B00-\u0B7F]/.test(message)) return "od";
  if (/[\u0900-\u097F]/.test(message)) return "hi";

  const lower = message.toLowerCase();
  if (
    /\b(namaste|namaskar|kaise|kya|hai|hain|hindi|kursi|sofa|bed|kitna|kitne|daam|dam|keemat|kimat|chahiye|dikhao|dikhaiye|batao)\b/.test(
      lower,
    )
  ) {
    return "hi";
  }

  if (
    /\b(odia|namaskara|kana|kemiti|achhi|achanti|dama|mulya|dekhao|darkar)\b/.test(
      lower,
    )
  ) {
    return "od";
  }

  return "en";
}

function localizedText(language, key) {
  const copy = {
    price: {
      en: "For the latest price, please contact S N Steel Fabrication directly on WhatsApp or give us a call. Our team will be happy to provide the current price.",
      hi: "Latest price ke liye kripya S N Steel Fabrication se WhatsApp ya call par direct contact karein. Hamari team aapko current price bata degi.",
      od: "ନୂତନ ଦାମ ପାଇଁ ଦୟାକରି WhatsApp କିମ୍ବା call ଦ୍ୱାରା S N Steel Fabrication ସହିତ ସିଧାସଳଖ ଯୋଗାଯୋଗ କରନ୍ତୁ। ଆମ ଟିମ୍ ଆପଣଙ୍କୁ current price ଜଣାଇବ।",
    },
    greeting: {
      en: "Hi, I can help with SNSF products, materials, dimensions, customization, warranty, showroom details, and contact options. What are you looking for today?",
      hi: "Namaste, main SNSF products, materials, dimensions, customization, warranty, showroom details aur contact options mein madad kar sakta hoon. Aap aaj kya dekhna chahenge?",
      od: "ନମସ୍କାର, ମୁଁ SNSF products, materials, dimensions, customization, warranty, showroom details ଏବଂ contact options ବିଷୟରେ ସାହାଯ୍ୟ କରିପାରିବି। ଆପଣ ଆଜି କଣ ଖୋଜୁଛନ୍ତି?",
    },
    owner: {
      en: `This is the official assistant for S N Steel Fabrication. I do not have a verified owner name in the website information available to me. For owner or business enquiries, please contact SNSF directly at ${CONTACT.phone} or ${CONTACT.email}.`,
      hi: `Yeh S N Steel Fabrication ka official assistant hai. Mere paas website information mein verified owner name available nahi hai. Owner ya business enquiry ke liye SNSF se direct contact karein: ${CONTACT.phone} ya ${CONTACT.email}.`,
      od: `ଏହା S N Steel Fabrication ର official assistant। ମୋ ପାଖରେ website information ଭିତରେ verified owner name ନାହିଁ। owner କିମ୍ବା business enquiry ପାଇଁ SNSF ସହିତ direct contact କରନ୍ତୁ: ${CONTACT.phone} କିମ୍ବା ${CONTACT.email}.`,
    },
    links: {
      en: "Sure. You can open these product pages from the cards below. For final purchase details, please contact SNSF directly.",
      hi: "Bilkul. Neeche diye gaye product cards se aap product pages open kar sakte hain. Final purchase details ke liye SNSF se direct contact karein.",
      od: "ନିଶ୍ଚୟ। ତଳେ ଥିବା product cards ରୁ ଆପଣ product pages ଖୋଲିପାରିବେ। final purchase details ପାଇଁ SNSF ସହିତ direct contact କରନ୍ତୁ।",
    },
    fallback: {
      en: "I can help with SNSF products, materials, dimensions, customization, warranty, showroom details, and contact options. I could not find a matching product from the current catalogue for that question.",
      hi: "Main SNSF products, materials, dimensions, customization, warranty, showroom details aur contact options mein madad kar sakta hoon. Is question ke liye current catalogue mein matching product nahi mila.",
      od: "ମୁଁ SNSF products, materials, dimensions, customization, warranty, showroom details ଏବଂ contact options ବିଷୟରେ ସାହାଯ୍ୟ କରିପାରିବି। ଏହି question ପାଇଁ current catalogue ରେ matching product ମିଳିଲା ନାହିଁ।",
    },
  };

  return copy[key]?.[language] || copy[key]?.en || "";
}

function priceRedirectResponse(language = "en") {
  return {
    success: true,
    blocked: true,
    answer:
      localizedText(language, "price"),
    actions: [
      { type: "whatsapp", label: "Chat on WhatsApp", href: CONTACT.whatsapp },
      { type: "call", label: "Call Now", href: `tel:${CONTACT.phone}` },
    ],
    sources: [],
    products: [],
  };
}

function greetingResponse(language = "en") {
  return {
    success: true,
    answer:
      localizedText(language, "greeting"),
    actions: [
      { type: "whatsapp", label: "Chat on WhatsApp", href: CONTACT.whatsapp },
      { type: "call", label: "Call Now", href: `tel:${CONTACT.phone}` },
    ],
    sources: [],
    products: [],
  };
}

function ownerResponse(language = "en") {
  return {
    success: true,
    answer:
      localizedText(language, "owner"),
    actions: [
      { type: "whatsapp", label: "Chat on WhatsApp", href: CONTACT.whatsapp },
      { type: "call", label: "Call Now", href: `tel:${CONTACT.phone}` },
    ],
    sources: [],
    products: [],
  };
}

function cleanMessage(value) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, 1000);
}

function cleanRecentProducts(value) {
  if (!Array.isArray(value)) return [];
  return sanitizePublicProducts(value)
    .filter((product) => product?._id || product?.id || product?.slug)
    .slice(0, 6);
}

async function parseProviderError(response, label) {
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = { error: { message: await response.text() } };
  }

  const error = new Error(
    payload?.error?.message || `${label} provider error: ${response.status}`,
  );
  error.status = response.status;
  error.code = payload?.error?.code;
  error.type = payload?.error?.type;
  return error;
}

function productRegex(query) {
  return query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function retrieveProducts(query, limit = 5) {
  if (!query) return [];

  let products = [];
  try {
    products = await ProductModel.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } },
    )
      .sort({ score: { $meta: "textScore" }, dateCreated: -1 })
      .limit(limit)
      .lean();
  } catch (error) {
    console.warn("AI text search fallback used:", error.message);
  }

  if (!products.length) {
    const words = query
      .split(/\s+/)
      .map(productRegex)
      .filter((word) => word.length > 1)
      .slice(0, 5);

    if (words.length) {
      products = await ProductModel.find({
        $and: words.map((word) => ({
          $or: [
            { name: { $regex: word, $options: "i" } },
            { brand: { $regex: word, $options: "i" } },
            { catName: { $regex: word, $options: "i" } },
            { subCat: { $regex: word, $options: "i" } },
            { thirdSubCat: { $regex: word, $options: "i" } },
            { description: { $regex: word, $options: "i" } },
          ],
        })),
      })
        .sort({ dateCreated: -1 })
        .limit(limit)
        .lean();
    }
  }

  return sanitizePublicProducts(products);
}

function buildFallbackAnswer(message, products, language = "en") {
  const lower = message.toLowerCase();

  if (OWNER_INTENT.test(lower)) {
    return localizedText(language, "owner");
  }

  if (/\b(contact|phone|call|whatsapp|location|address|visit|hours|email)\b/.test(lower)) {
    if (language === "hi") {
      return `Aap S N Steel Fabrication se WhatsApp ya phone par ${CONTACT.phone} par contact kar sakte hain. Showroom address: ${CONTACT.address}. Working hours: Sun - Sat, 9:00 AM - 8:00 PM.`;
    }
    if (language === "od") {
      return `ଆପଣ S N Steel Fabrication ସହିତ WhatsApp କିମ୍ବା phone ରେ ${CONTACT.phone} ରେ contact କରିପାରିବେ। Showroom address: ${CONTACT.address}. Working hours: Sun - Sat, 9:00 AM - 8:00 PM.`;
    }
    return `You can contact S N Steel Fabrication on WhatsApp or phone at ${CONTACT.phone}. The showroom is at ${CONTACT.address}. Working hours are Sun - Sat, 9:00 AM - 8:00 PM.`;
  }

  if (/\b(warranty|guarantee|rust|grade|304|202)\b/.test(lower)) {
    if (language === "hi") {
      return "SNSF warranty sirf stainless steel structure ko cover karti hai. 202 grade stainless steel par 5 years warranty hai, aur 304 grade stainless steel par 15 years warranty hai. Fabric, foam, misuse, harsh chemicals, physical damage aur modifications cover nahi hote.";
    }
    if (language === "od") {
      return "SNSF warranty କେବଳ stainless steel structure କୁ cover କରେ। 202 grade stainless steel ପାଇଁ 5 years warranty ଏବଂ 304 grade stainless steel ପାଇଁ 15 years warranty ଅଛି। Fabric, foam, misuse, harsh chemicals, physical damage ଏବଂ modifications cover ହୁଏ ନାହିଁ।";
    }
    return "SNSF warranty covers the stainless steel structure only. 202 grade stainless steel has 5 years warranty, and 304 grade stainless steel has 15 years warranty. Fabric, foam, misuse, harsh chemicals, physical damage, and modifications are not covered.";
  }

  if (products.length) {
    const names = products.map((product) => product.name).filter(Boolean).slice(0, 3);
    if (language === "hi") {
      return `Mujhe ${names.length === 1 ? "ek matching product" : "kuch matching products"} mile: ${names.join(", ")}. Main materials, dimensions, categories aur features compare karne mein madad kar sakta hoon. Current pricing ke liye SNSF se direct contact karein.`;
    }
    if (language === "od") {
      return `ମୁଁ ${names.length === 1 ? "ଗୋଟିଏ matching product" : "କିଛି matching products"} ପାଇଲି: ${names.join(", ")}. ମୁଁ materials, dimensions, categories ଏବଂ features compare କରିବାରେ ସାହାଯ୍ୟ କରିପାରିବି। current pricing ପାଇଁ SNSF ସହିତ direct contact କରନ୍ତୁ।`;
    }
    return `I found ${names.length === 1 ? "a matching product" : "some matching products"}: ${names.join(", ")}. I can help compare materials, dimensions, categories, and features. For current pricing, please contact SNSF directly.`;
  }

  return localizedText(language, "fallback");
}

async function callLlm({ message, contextDocuments, products, language }) {
  const provider = (process.env.AI_PROVIDER || "openai").toLowerCase();
  if (provider === "openrouter") {
    return callOpenRouterLlm({ message, contextDocuments, products, language });
  }

  return callOpenAiLlm({ message, contextDocuments, products, language });
}

function buildUserPrompt({ message, contextDocuments, products, language }) {
  return [
    `Customer question: ${message}`,
    `Reply language: ${LANGUAGE_LABELS[language] || LANGUAGE_LABELS.en}. Use the same language style as the customer. Keep product names, brand names, phone numbers, and addresses unchanged.`,
    "Safe SNSF context:",
    ...contextDocuments.map((doc) => `${doc.title}\n${doc.text}`),
    products.length
      ? `Matching public products: ${products
          .map((product) => product.name)
          .join(", ")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

async function callOpenRouterLlm({ message, contextDocuments, products, language }) {
  if (!process.env.OPENROUTER_API_KEY) return null;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer":
        process.env.OPENROUTER_SITE_URL ||
        process.env.NEXT_PUBLIC_SITE_URL ||
        "https://www.snsteelfabrication.com",
      "X-OpenRouter-Title": process.env.OPENROUTER_APP_NAME || "SNSF Assistant",
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_CHAT_MODEL || process.env.AI_CHAT_MODEL || "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: buildUserPrompt({ message, contextDocuments, products, language }),
        },
      ],
      temperature: 0.2,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const error = await parseProviderError(response, "OpenRouter AI");
    error.provider = "openrouter";
    throw error;
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || null;
}

async function callOpenAiLlm({ message, contextDocuments, products, language }) {
  if (!process.env.OPENAI_API_KEY) return null;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.AI_CHAT_MODEL || "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: buildUserPrompt({ message, contextDocuments, products, language }),
        },
      ],
      temperature: 0.2,
      max_output_tokens: 500,
    }),
  });

  if (!response.ok) {
    const error = await parseProviderError(response, "OpenAI AI");
    error.provider = "openai";
    throw error;
  }

  const data = await response.json();
  return data.output_text || null;
}

export async function chatWithAssistant(req, res) {
  try {
    const message = cleanMessage(req.body?.message);
    const language = normalizeLanguage(req.body?.language) || detectLanguage(message);
    const recentProducts = cleanRecentProducts(req.body?.recentProducts);
    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    if (PRICE_INTENT.test(message)) {
      return res.status(200).json(priceRedirectResponse(language));
    }

    if (GREETING_INTENT.test(message)) {
      return res.status(200).json(greetingResponse(language));
    }

    if (OWNER_INTENT.test(message)) {
      return res.status(200).json(ownerResponse(language));
    }

    if (LINK_INTENT.test(message) && recentProducts.length) {
      return res.status(200).json({
        success: true,
        answer: localizedText(language, "links"),
        actions: [
          { type: "whatsapp", label: "Chat on WhatsApp", href: CONTACT.whatsapp },
          { type: "call", label: "Call Now", href: `tel:${CONTACT.phone}` },
        ],
        sources: recentProducts.map((product) => ({
          title: product.name,
          sourceType: "product",
          slug: product.slug,
          productId: product._id || product.id,
        })),
        products: recentProducts.map(sanitizePublicProduct),
      });
    }

    const shouldReturnProducts = PRODUCT_INTENT.test(message);
    const products = shouldReturnProducts ? await retrieveProducts(message) : [];
    const ragDocuments = await retrieveRagContext(message, { limit: 6 });
    const productDocuments = products.map(buildRagProductDocument).filter(Boolean);
    const contextDocuments = [...ragDocuments, ...STATIC_KNOWLEDGE, ...productDocuments]
      .filter((doc, index, all) => {
        const key = `${doc.sourceType}:${doc.sourceId || doc.id || doc.title}`;
        return all.findIndex((item) => `${item.sourceType}:${item.sourceId || item.id || item.title}` === key) === index;
      })
      .slice(0, 8);

    let answer = null;
    try {
      answer = await callLlm({ message, contextDocuments, products, language });
    } catch (error) {
      const reason =
        error.code === "insufficient_quota"
          ? "OpenAI quota is exhausted"
          : error.message;
      console.error("AI provider failed:", reason);
    }

    answer = answer || buildFallbackAnswer(message, products, language);

    if (PRICE_OUTPUT.test(answer)) {
      return res.status(200).json(priceRedirectResponse(language));
    }

    return res.status(200).json({
      success: true,
      answer,
      actions: [
        { type: "whatsapp", label: "Chat on WhatsApp", href: CONTACT.whatsapp },
        { type: "call", label: "Call Now", href: `tel:${CONTACT.phone}` },
      ],
      sources: contextDocuments.map((doc) => ({
        title: doc.title,
        sourceType: doc.sourceType,
        slug: doc.slug,
        productId: doc.productId || doc.metadata?.productId,
        score: doc.score,
      })),
      products: shouldReturnProducts ? products.slice(0, 4) : [],
    });
  } catch (error) {
    console.error("Assistant chat error:", error);
    return res.status(500).json({
      success: false,
      message: "Assistant is temporarily unavailable.",
    });
  }
}

export async function ingestAssistantKnowledge(req, res) {
  try {
    const result = await ingestRagKnowledge();
    return res.status(200).json({
      success: true,
      message: "RAG knowledge ingestion completed.",
      data: result,
    });
  } catch (error) {
    const reason =
      error.code === "insufficient_quota"
        ? "OpenAI quota is exhausted. Add billing/credits or use another API key, then run ingestion again."
        : error.message;
    console.error("RAG ingestion error:", reason);
    return res.status(500).json({
      success: false,
      message: reason || "RAG ingestion failed.",
    });
  }
}
