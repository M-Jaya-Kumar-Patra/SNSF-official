export async function GET() {
  // Use absolute URL or internal API fetching on server
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://snsteelfabrication.com";

  let products = [];
  try {
    const res = await fetch(`${baseUrl}/api/product/gaps`);
    const data = await res.json();
    products = data?.products || [];
  } catch (err) {
    console.error("Failed to fetch products for sitemap:", err);
  }

  const productUrls = products
    .map(p => `<url><loc>${baseUrl}/product/${p.slug}</loc></url>`)
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
