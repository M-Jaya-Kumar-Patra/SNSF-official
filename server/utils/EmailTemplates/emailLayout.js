const STORE_URL = "https://www.snsteelfabrication.com";
// Gmail's image proxy does not reliably follow the apex-domain redirect.
// Keep this on the canonical www host and use the small dedicated asset.
const EMAIL_LOGO_URL = `${STORE_URL}/images/email-logo.png`;

export const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
})[char]);

export const emailButton = (label, url = STORE_URL) => `
  <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:28px auto 4px;">
    <tr><td bgcolor="#176483" style="border-radius:7px;text-align:center;">
      <a href="${escapeHtml(url)}" style="display:inline-block;padding:14px 24px;border:1px solid #176483;border-radius:7px;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;line-height:20px;text-decoration:none;">${escapeHtml(label)}</a>
    </td></tr>
  </table>`;

export const emailPanel = (content, accent = "#176483") => `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0;border:1px solid #dce6ea;border-left:4px solid ${accent};background:#f5f9fa;border-radius:6px;">
    <tr><td style="padding:18px 20px;color:#284255;font-size:14px;line-height:1.7;">${content}</td></tr>
  </table>`;

export const emailDetails = (rows, accent) => emailPanel(`
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#284255;">
    ${rows.map(([label, value]) => `<tr><td style="padding:5px 12px 5px 0;font-weight:700;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:5px 0;vertical-align:top;">${escapeHtml(value)}</td></tr>`).join("")}
  </table>`, accent);

export const emailCode = (code) => `
  <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:26px auto;">
    <tr><td style="padding:16px 26px;border:1px dashed #7ca8ba;border-radius:8px;background:#eff7fa;color:#123b52;font-family:Arial,Helvetica,sans-serif;font-size:28px;font-weight:700;letter-spacing:5px;text-align:center;">${escapeHtml(code)}</td></tr>
  </table>`;

/** A fixed brand shell for every transactional and promotional email. */
export function renderEmailLayout({ title, preheader = "", content, footerNote = "" }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>${escapeHtml(title)}</title>
  <style>
    @media only screen and (max-width:620px) {
      .snsf-shell { width:100% !important; }
      .snsf-pad { padding-left:22px !important; padding-right:22px !important; }
    }
    .snsf-email-content img { max-width:100% !important; height:auto !important; }
  </style>
</head>
<body style="margin:0;padding:0;background:#eef3f5;color:#243746;font-family:Arial,Helvetica,sans-serif;">
  <div style="display:none!important;font-size:1px;line-height:1px;color:#eef3f5;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeHtml(preheader || title)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#eef3f5" style="border-collapse:collapse;background:#eef3f5;">
    <tr><td align="center" style="padding:28px 12px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="snsf-shell" style="width:100%;max-width:600px;border-collapse:separate;background:#ffffff;border:1px solid #dce5e9;border-radius:12px;overflow:hidden;">
        <tr><td height="5" bgcolor="#176483" style="height:5px;background:#176483;font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr><td class="snsf-pad" style="padding:24px 32px 20px;background:#ffffff;">
          <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            <tr>
              <td style="padding-right:16px;vertical-align:middle;"><a href="${STORE_URL}" style="text-decoration:none;"><img src="${EMAIL_LOGO_URL}" width="64" height="66" alt="S N Steel Fabrication" style="display:block;width:64px;height:66px;border:0;"></a></td>
              <td style="vertical-align:middle;"><p style="margin:0;color:#17384c;font-size:17px;font-weight:700;line-height:1.25;letter-spacing:.3px;">S N Steel Fabrication</p><p style="margin:5px 0 0;color:#718594;font-size:11px;line-height:1.4;letter-spacing:1.4px;text-transform:uppercase;">Crafted for modern living</p></td>
            </tr>
          </table>
        </td></tr>
        <tr><td class="snsf-pad" bgcolor="#15384d" style="padding:26px 32px;background:#15384d;">
          <h1 style="margin:0;color:#ffffff;font-size:25px;line-height:1.3;font-weight:700;">${escapeHtml(title)}</h1>
          ${preheader ? `<p style="margin:9px 0 0;color:#c5dae4;font-size:14px;line-height:1.5;">${escapeHtml(preheader)}</p>` : ""}
        </td></tr>
        <tr><td class="snsf-pad snsf-email-content" style="padding:30px 32px 34px;background:#ffffff;color:#243746;font-size:15px;line-height:1.7;overflow-wrap:break-word;">${content}</td></tr>
        <tr><td class="snsf-pad" style="padding:24px 32px;background:#f4f8f9;border-top:1px solid #dce5e9;color:#657985;font-size:12px;line-height:1.6;">
          <p style="margin:0 0 8px;color:#17384c;font-size:13px;font-weight:700;">S N Steel Fabrication</p>
          <p style="margin:0;">New Burupada, Near Hanuman Temple, Via-Hinjilicut, Ganjam, Odisha 761146</p>
          <p style="margin:7px 0 0;"><a href="tel:+919776501230" style="color:#176483;text-decoration:none;">+91 9776501230</a> &nbsp;·&nbsp; <a href="mailto:support@snsteelfabrication.com" style="color:#176483;text-decoration:none;">support@snsteelfabrication.com</a></p>
          ${footerNote ? `<p style="margin:16px 0 0;color:#7b8f99;font-size:11px;">${escapeHtml(footerNote)}</p>` : ""}
        </td></tr>
      </table>
      <p style="margin:16px 0 0;color:#91a1aa;font-size:11px;">© ${new Date().getFullYear()} S N Steel Fabrication</p>
    </td></tr>
  </table>
</body>
</html>`;
}

export default renderEmailLayout;
