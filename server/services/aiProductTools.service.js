import mongoose from "mongoose";
import ProductModel from "../models/product.model.js";
import WishlistModel from "../models/wishlist.model.js";
import ProductEventModel from "../models/productEvent.model.js";
import enquiryModel from "../models/enquiry.model.js";

const SPEC_KEYS = [
  "material",
  "grade",
  "fabric",
  "fabricColor",
  "size",
  "capacity",
  "width",
  "depth",
  "length",
  "height",
  "seatHeight",
  "warranty",
  "thickness",
  "polish",
  "frameMaterial",
];

export function sanitizeProduct(product) {
  if (!product) return null;

  return {
    _id: product._id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    images: product.images || [],
    brand: product.brand,
    catId: product.catId,
    catName: product.catName,
    subCatId: product.subCatId,
    subCat: product.subCat,
    thirdSubCatId: product.thirdSubCatId,
    thirdSubCat: product.thirdSubCat,
    delivery_days: product.delivery_days,
    callOnlyDelivery: product.callOnlyDelivery,
    specifications: product.specifications || {},
  };
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function extractProductIntent(input = "") {
  const query = input.toLowerCase();
  const filters = {};
  const keywords = [];

  const categoryWords = [
    "sofa",
    "chair",
    "table",
    "bed",
    "rack",
    "almirah",
    "wardrobe",
    "stool",
    "bench",
  ];

  for (const word of categoryWords) {
    if (query.includes(word)) {
      filters.category = word;
      keywords.push(word);
      break;
    }
  }

  const capacityMatch = query.match(/(\d+)\s*[- ]?\s*(seater|seat|person)/i);
  if (capacityMatch) {
    filters.capacity = `${capacityMatch[1]} ${capacityMatch[2]}`;
    keywords.push(capacityMatch[1], capacityMatch[2]);
  }

  const materials = ["stainless steel", "steel", "wood", "iron", "metal"];
  for (const material of materials) {
    if (query.includes(material)) {
      filters.material = material;
      keywords.push(material);
      break;
    }
  }

  const colors = ["blue", "red", "green", "black", "white", "grey", "gray", "floral"];
  for (const color of colors) {
    if (query.includes(color)) {
      filters.fabricColor = color;
      keywords.push(color);
    }
  }

  return { filters, keywords: [...new Set(keywords)] };
}

export async function searchProducts({ query, limit = 6 }) {
  const safeLimit = Math.max(1, Math.min(12, Number(limit) || 6));
  const intent = extractProductIntent(query);
  const andConditions = [];

  if (intent.filters.category) {
    const regex = new RegExp(escapeRegex(intent.filters.category), "i");
    andConditions.push({
      $or: [{ catName: regex }, { subCat: regex }, { thirdSubCat: regex }, { name: regex }],
    });
  }

  if (intent.filters.material) {
    const regex = new RegExp(escapeRegex(intent.filters.material), "i");
    andConditions.push({
      $or: [{ "specifications.material": regex }, { "specifications.frameMaterial": regex }, { name: regex }],
    });
  }

  if (intent.filters.capacity) {
    const regex = new RegExp(escapeRegex(intent.filters.capacity.split(" ")[0]), "i");
    andConditions.push({
      $or: [{ "specifications.capacity": regex }, { name: regex }, { description: regex }],
    });
  }

  if (intent.filters.fabricColor) {
    const regex = new RegExp(escapeRegex(intent.filters.fabricColor), "i");
    andConditions.push({
      $or: [{ "specifications.fabric": regex }, { "specifications.fabricColor": regex }, { name: regex }],
    });
  }

  let products = [];
  if (andConditions.length) {
    products = await ProductModel.find({ $and: andConditions })
      .sort({ dateCreated: -1 })
      .limit(safeLimit)
      .lean();
  }

  if (!products.length && query) {
    try {
      products = await ProductModel.find(
        { $text: { $search: query } },
        { score: { $meta: "textScore" } }
      )
        .sort({ score: { $meta: "textScore" }, dateCreated: -1 })
        .limit(safeLimit)
        .lean();
    } catch {
      const words = query.split(/\s+/).filter(Boolean).slice(0, 8);
      const conditions = words.map((word) => {
        const regex = new RegExp(escapeRegex(word), "i");
        return {
          $or: [
            { name: regex },
            { catName: regex },
            { subCat: regex },
            { thirdSubCat: regex },
            { "specifications.material": regex },
            { "specifications.fabric": regex },
          ],
        };
      });
      products = conditions.length
        ? await ProductModel.find({ $and: conditions }).limit(safeLimit).lean()
        : [];
    }
  }

  return { intent, products: products.map(sanitizeProduct) };
}

export async function getProductDetails(productId) {
  if (!mongoose.Types.ObjectId.isValid(productId)) return null;
  const product = await ProductModel.findById(productId).lean();
  return sanitizeProduct(product);
}

export async function findSimilarProducts(productId, limit = 4) {
  const product = await getProductDetails(productId);
  if (!product) return [];

  const products = await ProductModel.find({
    _id: { $ne: product._id },
    $or: [
      { subCatId: product.subCatId },
      { catId: product.catId },
      { brand: product.brand },
      { "specifications.material": product.specifications?.material },
    ].filter((condition) => Object.values(condition)[0]),
  })
    .limit(Math.max(1, Math.min(10, Number(limit) || 4)))
    .lean();

  return products.map(sanitizeProduct);
}

export async function getWishlistRecommendations(userId, limit = 4) {
  const wishlist = await WishlistModel.find({ userId }).lean();
  const productIds = wishlist.map((item) => item.productId).filter(mongoose.Types.ObjectId.isValid);
  const wishedProducts = productIds.length
    ? await ProductModel.find({ _id: { $in: productIds } }).lean()
    : [];

  const categories = [...new Set(wishedProducts.map((product) => product.catId).filter(Boolean))];
  const brands = [...new Set(wishedProducts.map((product) => product.brand).filter(Boolean))];

  let products = [];
  if (categories.length || brands.length) {
    products = await ProductModel.find({
      _id: { $nin: productIds },
      $or: [{ catId: { $in: categories } }, { brand: { $in: brands } }],
    })
      .limit(Math.max(1, Math.min(10, Number(limit) || 4)))
      .lean();
  }

  return {
    wishlist: wishedProducts.map(sanitizeProduct),
    recommendations: products.map(sanitizeProduct),
  };
}

export async function createProductEnquiry({ userId, productId, user, conversationId, userMessage }) {
  const product = await getProductDetails(productId);
  if (!product) return null;

  const requirement = String(userMessage || "").trim();
  const requestedPrice = /price|cost|quote|quotation/i.test(requirement) ? requirement : "";
  const availabilityRequested = /availability|available|stock|delivery/i.test(requirement);
  const customizationRequest = /custom|customiz|measurement|size|colour|color/i.test(requirement)
    ? requirement
    : "";
  const specificationText = Object.entries(product.specifications || {})
    .filter(([, value]) => value !== undefined && value !== null && String(value).trim())
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");

  const message = [
    `AI-assisted enquiry for "${product.name}"`,
    `Product ID: ${product._id}`,
    conversationId ? `Conversation ID: ${conversationId}` : "",
    requirement ? `Customer requirement: ${requirement}` : "",
    requestedPrice ? "Requested price or quotation: yes" : "Requested price or quotation: not specified",
    availabilityRequested ? "Availability or delivery request: yes" : "Availability or delivery request: not specified",
    customizationRequest ? `Customization request: ${customizationRequest}` : "Customization request: not specified",
    specificationText ? `Verified product specifications: ${specificationText}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return enquiryModel.create({
    userId,
    productId: product._id,
    image: product.images?.[0],
    message,
    userMsg: requirement || `I want to enquire about ${product.name}`,
    conversationId: conversationId || null,
    source: "AI",
    aiContext: {
      customerRequirement: requirement,
      requestedPrice,
      availabilityRequested,
      customizationRequest,
      productSpecifications: product.specifications || {},
    },
    contactInfo: {
      name: user?.name,
      email: user?.email,
      phone: user?.phone,
    },
  });
}

export async function getRecentViewedRecommendations(userId, limit = 4) {
  const events = await ProductEventModel.find({ userId })
    .sort({ createdAt: -1 })
    .limit(20)
    .populate("productId")
    .lean();

  const viewed = events.map((event) => event.productId).filter(Boolean);
  const categories = [...new Set(viewed.map((product) => product.catId).filter(Boolean))];
  const viewedIds = viewed.map((product) => product._id);

  const products = categories.length
    ? await ProductModel.find({ _id: { $nin: viewedIds }, catId: { $in: categories } })
        .limit(Math.max(1, Math.min(10, Number(limit) || 4)))
        .lean()
    : [];

  return products.map(sanitizeProduct);
}

export function describeProduct(product) {
  if (!product) return "";
  const specs = SPEC_KEYS
    .map((key) => [key, product.specifications?.[key]])
    .filter(([, value]) => value !== undefined && value !== null && String(value).trim())
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");

  return `${product.name}${product.catName ? ` (${product.catName})` : ""}${specs ? `. Specs: ${specs}` : ""}`;
}
