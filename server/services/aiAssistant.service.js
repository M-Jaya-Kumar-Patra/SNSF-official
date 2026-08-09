import UserModel from "../models/user.model.js";
import { describeProduct } from "./aiProductTools.service.js";
import {
  createProductEnquiryTool,
  compareProductsTool,
  findSimilarProductsTool,
  getProductDetailsTool,
  getRecommendationsTool,
  getUserWishlistTool,
  searchKnowledgeBaseTool,
  searchProductsTool,
  requestHumanSupportTool,
} from "./aiTools.service.js";
import { completeOpenRouter, isOpenRouterConfigured } from "./openRouter.service.js";

const PRICE_REPLY =
  "SNSF does not display product prices on the website. Price is available through enquiry, and I can prepare a WhatsApp enquiry for you.";

function wantsEnquiry(text) {
  return /(enquire|inquire|whatsapp|price|cost|quotation|quote|availability)/i.test(text);
}

function wantsHuman(text) {
  return /(human|admin|team|person|someone|support|representative)/i.test(text);
}

function wantsCompare(text) {
  return /(compare|difference|versus| vs |better)/i.test(text);
}

function wantsWishlist(text) {
  return /(wishlist|saved)/i.test(text);
}

function wantsSimilar(text) {
  return /(similar|smaller|larger|like this|alternative|recommend)/i.test(text);
}

function buildProductCards(products = []) {
  return products.map((product) => ({
    _id: product._id,
    name: product.name,
    slug: product.slug,
    image: product.images?.[0],
    catName: product.catName,
    subCat: product.subCat,
    reason: product.catName
      ? `Matched from SNSF ${product.catName} catalogue.`
      : "Matched from SNSF product catalogue.",
  }));
}

function buildProviderMessages({ message, productContext, toolResult, knowledgeContext, history = [] }) {
  const safeHistory = history
    .filter((item) => ["USER", "AI", "ADMIN"].includes(item.senderType) && item.content)
    .slice(-12)
    .map((item) => ({
      role: item.senderType === "USER" ? "user" : "assistant",
      content: String(item.content).slice(0, 4_000),
    }));

  return [
    {
      role: "system",
      content:
        "You are SNSF AI Assistant for S N Steel Fabrication. Use only the verified SNSF catalogue data supplied in this request. Never invent products, prices, stock, specifications, warranty, delivery, or customization details. If a field is absent, say it is not specified. SNSF pricing is handled through enquiry. Keep replies concise and helpful.",
    },
    ...safeHistory,
    {
      role: "user",
      content: JSON.stringify({
        request: message,
        productContext,
        verifiedCatalogueToolResult: toolResult,
        verifiedKnowledgeContext: knowledgeContext || "",
      }),
    },
  ];
}

export async function answerAssistantMessage({
  userId,
  message,
  productContext,
  conversationId,
  history = [],
}) {
  const user = await UserModel.findById(userId).lean();
  const normalizedMessage = String(message || "").trim();
  let activeProduct = productContext?.productId
    ? await getProductDetailsTool({ userId, productId: productContext.productId })
    : null;

  const toolResult = {
    action: "general",
    products: [],
    enquiry: null,
    humanHandoff: false,
  };

  const knowledgeIntent = /(warranty|steel grade|grade 202|grade 304|care|maintenance|delivery|return|exchange|customiz|policy|faq|company|about sns|fabrication)/i.test(normalizedMessage);
  let knowledgeResults = [];
  if (knowledgeIntent) {
    try {
      knowledgeResults = await searchKnowledgeBaseTool({ userId, query: normalizedMessage, limit: 5 });
      toolResult.knowledgeResults = knowledgeResults;
    } catch (error) {
      toolResult.knowledgeError = error.code || "KNOWLEDGE_RETRIEVAL_FAILED";
    }
  }

  if (wantsHuman(normalizedMessage)) {
    const handoff = requestHumanSupportTool({ userId });
    toolResult.action = "human_handoff";
    toolResult.humanHandoff = handoff.humanHandoff;
    return {
      content:
        "I have marked this conversation for the SNSF team. AI replies should pause once an admin takes over.",
      metadata: toolResult,
    };
  }

  if (activeProduct && wantsEnquiry(normalizedMessage)) {
    const enquiry = await createProductEnquiryTool({
      userId,
      productId: activeProduct._id,
      user,
      conversationId,
      userMessage: normalizedMessage,
    });
    const text = `${PRICE_REPLY}\n\nI created an enquiry for ${activeProduct.name}. You can continue on WhatsApp with the product reference included.`;
    const verifiedSpecs = Object.entries(activeProduct.specifications || {})
      .filter(([, value]) => value !== undefined && value !== null && String(value).trim())
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");
    return {
      content: text,
      metadata: {
        ...toolResult,
        action: "product_enquiry",
        enquiryId: enquiry?._id,
        product: activeProduct,
        whatsappText: [
          `Hi SNSF, I am interested in ${activeProduct.name}.`,
          `Product ID: ${activeProduct._id}.`,
          `Customer requirement: ${normalizedMessage}.`,
          conversationId ? `Conversation reference: ${conversationId}.` : "",
          verifiedSpecs ? `Verified specifications: ${verifiedSpecs}.` : "",
          "Please share price, availability, delivery, and customization details.",
        ].filter(Boolean).join("\n"),
      },
      messageType: "ENQUIRY",
    };
  }

  if (wantsWishlist(normalizedMessage)) {
    const wishlistResult = await getUserWishlistTool({ userId, limit: 5 });
    toolResult.action = "wishlist_recommendations";
    toolResult.products = wishlistResult.recommendations;
    const names = wishlistResult.recommendations.map((product) => product.name).join(", ");
    return {
      content: names
        ? `Based on your wishlist categories and brands, these SNSF products may be relevant: ${names}.`
        : "I could not find enough wishlist signals yet. Add a few products to your wishlist and I can compare or recommend similar SNSF products.",
      metadata: { ...toolResult, wishlistCount: wishlistResult.wishlist.length },
      messageType: "PRODUCTS",
    };
  }

  if (activeProduct && (wantsSimilar(normalizedMessage) || wantsCompare(normalizedMessage))) {
    const similar = await findSimilarProductsTool({ userId, productId: activeProduct._id, limit: 5 });
    const comparison = wantsCompare(normalizedMessage)
      ? await compareProductsTool({
          userId,
          productIds: [activeProduct._id, ...similar.slice(0, 3).map((product) => product._id)],
        })
      : null;
    toolResult.action = wantsCompare(normalizedMessage) ? "compare_similar_products" : "similar_products";
    toolResult.products = similar;
    if (comparison) toolResult.comparison = comparison.fields;
    const productSummary = describeProduct(activeProduct);
    const similarSummary = similar.map(describeProduct).join("\n");
    return {
      content: similar.length
        ? `For the product you are viewing: ${productSummary}\n\nI found similar SNSF products you can compare:\n${similarSummary}\n\nAny missing specification should be treated as not specified.`
        : `I could not find a close alternative for ${activeProduct.name} in the current SNSF catalogue.`,
      metadata: toolResult,
      messageType: "PRODUCTS",
    };
  }

  const searchResult = await searchProductsTool({ userId, query: normalizedMessage, limit: 6 });
  toolResult.action = "product_search";
  toolResult.intent = searchResult.intent;
  toolResult.products = searchResult.products;

  let content;
  if (/price|cost/i.test(normalizedMessage)) {
    content = PRICE_REPLY;
  } else if (activeProduct) {
    content = `You are viewing ${describeProduct(activeProduct)}. I can explain its listed specifications, find similar SNSF products, or prepare an enquiry.`;
  } else if (searchResult.products.length) {
    content = `I found ${searchResult.products.length} SNSF product match${searchResult.products.length > 1 ? "es" : ""}. I used catalogue fields such as category, material, capacity, fabric, and product name.`;
  } else if (knowledgeIntent) {
    content = knowledgeResults.length
      ? "I found verified SNSF information for this question."
      : "I don't have verified information about that. I can connect you with the SNSF team for help.";
  } else {
    const recent = await getRecommendationsTool({ userId, limit: 4 });
    toolResult.products = recent;
    content = recent.length
      ? "I could not verify an exact match for that request, but here are SNSF products related to your recent browsing."
      : "I could not verify that information from SNSF product data. Would you like me to connect you with the SNSF team?";
  }

  if (isOpenRouterConfigured() && (!knowledgeIntent || knowledgeResults.length > 0)) {
    try {
      const providerResponse = await completeOpenRouter({
        messages: buildProviderMessages({
          message: normalizedMessage,
          productContext: activeProduct,
          toolResult,
          knowledgeContext: knowledgeResults
            .map((item) => `${item.metadata?.title || "SNSF knowledge"}: ${item.content}`)
            .join("\n\n"),
          history,
        }),
      });
      if (providerResponse.content) {
        content = providerResponse.content;
        toolResult.aiProvider = "openrouter";
        toolResult.aiModel = providerResponse.model;
      }
    } catch (error) {
      console.error("OpenRouter provider failed:", error.message);
      toolResult.aiProviderError = error.code || "OPENROUTER_REQUEST_FAILED";
    }
  } else {
    toolResult.aiProvider = "not_configured";
  }

  return {
    content,
    metadata: toolResult,
    messageType: toolResult.products?.length ? "PRODUCTS" : "TEXT",
  };
}
