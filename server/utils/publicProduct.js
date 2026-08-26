const SENSITIVE_PRODUCT_FIELDS = new Set([
  "price",
  "oldPrice",
  "discount",
]);

export const PUBLIC_PRODUCT_SELECT =
  "-price -oldPrice -discount";

export function toPlainObject(value) {
  if (!value) return value;
  if (typeof value.toObject === "function") return value.toObject();
  return value;
}

export function sanitizePublicProduct(product) {
  const plain = toPlainObject(product);
  if (!plain || typeof plain !== "object") return plain;

  const sanitized = { ...plain };
  for (const field of SENSITIVE_PRODUCT_FIELDS) {
    delete sanitized[field];
  }

  if (sanitized.category && typeof sanitized.category === "object") {
    sanitized.category = { ...toPlainObject(sanitized.category) };
  }

  return sanitized;
}

export function sanitizePublicProducts(products = []) {
  return products.map((product) => sanitizePublicProduct(product));
}

export function buildRagProductDocument(product) {
  const safe = sanitizePublicProduct(product);
  if (!safe) return null;

  const specs = safe.specifications || {};
  const specLines = Object.entries(specs)
    .filter(([, value]) => value !== undefined && value !== null && String(value).trim())
    .map(([key, value]) => `${key}: ${value}`);

  return {
    id: String(safe._id),
    sourceType: "product",
    title: safe.name,
    slug: safe.slug,
    productId: String(safe._id),
    text: [
      `Product: ${safe.name || ""}`,
      safe.brand ? `Brand: ${safe.brand}` : "",
      safe.catName ? `Category: ${safe.catName}` : "",
      safe.subCat ? `Sub category: ${safe.subCat}` : "",
      safe.thirdSubCat ? `Third category: ${safe.thirdSubCat}` : "",
      safe.description ? `Description: ${safe.description}` : "",
      safe.size?.length ? `Available sizes: ${safe.size.join(", ")}` : "",
      specLines.length ? `Specifications: ${specLines.join("; ")}` : "",
      safe.delivery_days ? `Delivery information: ${safe.delivery_days}` : "",
      safe.callOnlyDelivery ? "For final purchase details, contact SNSF directly." : "",
    ]
      .filter(Boolean)
      .join("\n"),
    metadata: {
      productId: String(safe._id),
      slug: safe.slug,
      category: safe.catName || "",
      subCategory: safe.subCat || "",
      brand: safe.brand || "",
      sourceType: "product",
    },
  };
}
