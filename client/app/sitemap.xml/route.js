import { fetchDataFromApi } from "@/utils/api";

export async function GET() {
  // Fetch all products
  const res = await fetchDataFromApi("/api/product/gaps"); // your existing API
  const products = res?.products || [];

  // Create product URLs
  const productUrls = products.map(
    (p) => `
    <url>
      <loc>https://snsteelfabrication.com/product/${p.slug}</loc>
    </url>`
  ).join("");

  // Add static pages
  const staticUrls = `
    <url><loc>https://snsteelfabrication.com/</loc></url>
    <url><loc>https://snsteelfabrication.com/about</loc></url>
    <url><loc>https://snsteelfabrication.com/privacy</loc></url>
    <url><loc>https://snsteelfabrication.com/terms</loc></url>
    <url><loc>https://snsteelfabrication.com/ProductListing</loc></url>
  `;

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls}
  ${productUrls}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
