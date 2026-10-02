import renderEmailLayout, { emailButton, escapeHtml } from "./emailLayout.js";

const recommendedProductsTemplate = (
  name = "Valued Customer",
  subject = "You might like these",
  products = []
) => {
  const items = (Array.isArray(products) ? products : []).slice(0, 4);
  const productCards = items.map((product) => {
    const slug = product.slug || product._id;
    const url = `https://snsteelfabrication.com/product/${encodeURIComponent(String(slug ?? ""))}`;
    const image = product.images?.[0] || "https://snsteelfabrication.com/images/placeholder.jpg";
    const productName = escapeHtml(product.name || "View product");

    return `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 14px;border:1px solid #dce6ea;border-radius:8px;background:#ffffff;">
        <tr>
          <td width="112" style="width:112px;padding:12px;vertical-align:middle;"><a href="${escapeHtml(url)}"><img src="${escapeHtml(image)}" width="100" height="80" alt="${productName}" style="display:block;width:100px;height:80px;object-fit:cover;border:0;border-radius:5px;"></a></td>
          <td style="padding:12px 16px 12px 0;vertical-align:middle;"><a href="${escapeHtml(url)}" style="color:#17384c;font-size:15px;font-weight:700;line-height:1.5;text-decoration:none;">${productName}</a><p style="margin:5px 0 0;color:#718594;font-size:12px;">Explore this piece</p></td>
        </tr>
      </table>`;
  }).join("");

  return renderEmailLayout({
    title: subject,
    preheader: "Furniture ideas inspired by your recent browsing.",
    content: `
      <p style="margin:0 0 16px;">Hello <strong>${escapeHtml(name)}</strong>,</p>
      <p style="margin:0 0 24px;">Based on what you recently explored, we selected a few furniture pieces that may suit your space and style.</p>
      ${productCards}
      ${emailButton("View all products")}`,
    footerNote: "You received this email because you browsed products on our website.",
  });
};

export default recommendedProductsTemplate;
