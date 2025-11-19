export async function GET() {
  // Use known domain OR Render internal URL to avoid build fetch issues
  const baseUrl =
    process.env.RENDER_EXTERNAL_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://snsteelfabrication.com";

  const internalUrl =
    process.env.RENDER_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://snsteelfabrication.com";

  let products = [];

  try {
    // Use INTERNAL URL so the build never hangs
    const res = await fetch(`${internalUrl}/api/product/gaps`, {
      cache: "no-cache",
    });

    const data = await res.json();
    products = data?.products || [];
  } catch (err) {
    console.error("Sitemap product fetch failed:", err);
  }

  const productUrls = products
    .map(
      (p) => `<url><loc>${baseUrl}/product/${p.slug}</loc></url>`
    )
    .join("");

  const staticUrls = `
    <url><loc>${baseUrl}/</loc></url>
    <url><loc>${baseUrl}/about</loc></url>
    <url><loc>${baseUrl}/privacy</loc></url>
    <url><loc>${baseUrl}/terms</loc></url>
    <url><loc>${baseUrl}/productlisting</loc></url>
  `;

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls}
  ${productUrls}
</urlset>`;

  return new Response(sitemap, {
    headers: { "Content-Type": "application/xml" },
  });
}
