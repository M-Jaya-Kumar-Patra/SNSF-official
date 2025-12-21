const recommendedProductsTemplate = (
  name = "Valued Customer",
  subject = "You might like these",
  products = []
) => {
  const items = [...products].slice(0, 4);

  return `
<div style="
  max-width:600px;
  margin:0 auto;
  background:#ffffff;
  border-radius:14px;
  overflow:hidden;
  border:1px solid #e5e7eb;
  font-family:Arial,Helvetica,sans-serif;
">

  <!-- HEADER -->
  <div style="
    background:#0f172a;
    padding:28px 24px;
    text-align:center;
  ">
    <img
      src="https://snsteelfabrication.com/images/logo.png"
      alt="S N Steel Fabrication"
      style="height:56px;margin-bottom:14px;"
    />
    <h1 style="
      margin:0;
      font-size:22px;
      font-weight:600;
      color:#ffffff;
    ">
      ${subject}
    </h1>
    <p style="
      margin:6px 0 0;
      font-size:14px;
      color:#cbd5f5;
    ">
      Inspired by your recent browsing on our website
    </p>
  </div>

  <!-- BODY -->
  <div style="padding:32px 28px;color:#1f2937;">

    <p style="font-size:16px;margin:0 0 14px;">
      Hello <strong>${name}</strong>,
    </p>

    <p style="
      font-size:15px;
      line-height:1.7;
      margin:0 0 24px;
      color:#374151;
    ">
      Based on what you recently explored, we’ve selected a few furniture
      pieces that may suit your space and style.
    </p>

    <!-- PRODUCTS -->
    ${items
      .map((p) => {
        const url = `https://www.snsteelfabrication.com/product/${p.slug || p._id}`;
        const image =
          p.images?.[0] ||
          "https://snsteelfabrication.com/images/placeholder.png";

        return `
        <table width="100%" cellpadding="0" cellspacing="0"
          style="
            margin-bottom:18px;
            border:1px solid #e5e7eb;
            border-radius:10px;
            overflow:hidden;
          ">
          <tr>
            <td width="120" style="padding:10px;">
              <a href="${url}" target="_blank">
                <img
                  src="${image}"
                  alt="${p.name}"
                  style="
                    width:100px;
                    height:80px;
                    object-fit:cover;
                    border-radius:8px;
                  "
                />
              </a>
            </td>
            <td style="padding:10px 12px;vertical-align:middle;">
              <a
                href="${url}"
                target="_blank"
                style="
                  text-decoration:none;
                  color:#111827;
                  font-size:15px;
                  font-weight:600;
                "
              >
                ${p.name}
              </a>
              ${
                p.price
                  ? `<p style="margin:6px 0 0;font-size:14px;color:#374151;">
                       ₹${p.price.toLocaleString("en-IN")}
                     </p>`
                  : ""
              }
            </td>
          </tr>
        </table>
        `;
      })
      .join("")}

    <!-- CTA -->
    <div style="text-align:center;margin:28px 0 6px;">
      <a
        href="https://www.snsteelfabrication.com"
        target="_blank"
        style="
          display:inline-block;
          background:#0f172a;
          color:#ffffff;
          text-decoration:none;
          padding:12px 28px;
          border-radius:8px;
          font-size:14px;
          font-weight:600;
        "
      >
        View All Products
      </a>
    </div>

   

  </div>

  <!-- FOOTER -->
  <div style="
    background:#f9fafb;
    padding:22px 24px;
    text-align:center;
    font-size:12px;
    color:#6b7280;
  ">
    <div style="background:#f9fafb;padding:22px 24px;text-align:center;font-size:12px;color:#6b7280;">
    <p style="margin:0 0 6px;">
      S N Steel Fabrication — Crafted Furniture for Modern Living
    </p>
    <p style="margin:0;">
      New Burupada, Near Hanuman Temple, Via-Hinjilicut, Ganjam, Odisha – 761146
    </p>
    <p style="margin:6px 0 0;">
      📞 +91 9776501230 | ✉️ support@snsteelfabrication.com
    </p>
    <p style="margin-top:12px;font-size:11px;color:#9ca3af;">
      You’re receiving this email because you interacted with our website.
    </p>
  </div>

</div>
`;
};

export default recommendedProductsTemplate;
