const promotionalTemplate = (
  name = "Valued Customer",
  subject,
  content,
  isHtml
) => `
<div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:14px;
overflow:hidden;border:1px solid #e5e7eb;font-family:Arial,Helvetica,sans-serif;">

  <!-- Header -->
  <div style="background:#0f172a;padding:28px 24px;text-align:center;">
    <img
      src="https://snsteelfabrication.com/images/logo.png"
      alt="S N Steel Fabrication"
      style="height:56px;margin-bottom:14px;"
    />
    <h1 style="margin:0;font-size:22px;font-weight:600;color:#ffffff;">
      ${subject}
    </h1>
  </div>

  <!-- Body -->
  <div style="padding:32px 28px;color:#1f2937;">

    <p style="font-size:16px;margin:0 0 14px;">
      Hello <strong>${name}</strong>,
    </p>

    ${
      isHtml
        ? content
        : `<p style="font-size:15px;line-height:1.7;color:#374151;">
            ${content}
          </p>`
    }

   


  </div>

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
    <p style="margin-top:14px;font-size:11px;color:#9ca3af;">
      This is an automated service email. Please do not reply.
    </p>
  </div>

</div>
`;


export default promotionalTemplate;
