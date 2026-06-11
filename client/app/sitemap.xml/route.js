export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.snsteelfabrication.com"
  ).replace(/\/$/, "");

  const apiUrl = (
    process.env.RENDER_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_SERVER_URL ||
    "https://snsf-server.onrender.com"
  ).replace(/\/$/, "");

  let products = [];

  try {
    const res = await fetch(`${apiUrl}/api/product/gaps`, {
      next: { revalidate: 3600 },
    });

    const data = await res.json();
    products = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.products)
      ? data.products
      : Array.isArray(data)
      ? data
      : [];
  } catch (err) {
    console.error("Sitemap product fetch failed:", err);
  }

  const escapeXml = (value = "") =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

  const productUrls = products
    .map((p) => p?.slug || p?._id)
    .filter(Boolean)
    .map((slug) => `<url><loc>${escapeXml(`${baseUrl}/product/${encodeURIComponent(slug)}`)}</loc></url>`)
    .join("");

  const staticPages = [
    "/",
    "/ProductListing",
    "/BestSellersList",
    "/about",
    "/privacy",
    "/terms",
    "/warranty",
  ];

  const staticUrls = staticPages
    .map((path) => `<url><loc>${escapeXml(`${baseUrl}${path}`)}</loc></url>`)
    .join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls}
  ${productUrls}
</urlset>`;

  return new Response(sitemap, {
    headers: { "Content-Type": "application/xml" },
  });
}
