export async function designApi(path = "", { method = "GET", body, signal, publicRequest = false } = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (!publicRequest && !token) throw new Error("Please sign in to access your designs.");
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/designs${path}`, {
    method, cache: "no-store", signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(25000)]) : AbortSignal.timeout(25000),
    headers: { "Content-Type": "application/json", ...(!publicRequest && token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const result = await response.json();
  if (!response.ok || !result.success) throw new Error(result.message || "We could not complete that request. Please try again.");
  return result;
}
export const materialLabels = { fabric: "Fabric", foam: "Foam & cushioning", metal: "Metal & grade", ply: "Ply & boards", finish: "Surface finish", hardware: "Hardware & fittings", top: "Tabletop / worktop" };
export const categoryLabels = { sofa: "Sofa", chair: "Chair / stool", bed: "Bed", table: "Table / desk", storage: "Cabinet / storage", other: "Other furniture" };
export function inferDesignCategory(product) {
  const value = `${product?.name || ""} ${product?.category || ""}`.toLowerCase();
  if (/sofa|couch/.test(value)) return "sofa";
  if (/chair|stool/.test(value)) return "chair";
  if (/bed/.test(value)) return "bed";
  if (/table|desk/.test(value)) return "table";
  if (/cabinet|almirah|wardrobe|storage|shelf/.test(value)) return "storage";
  return "other";
}
