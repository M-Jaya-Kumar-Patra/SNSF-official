import renderEmailLayout, { escapeHtml } from "./emailLayout.js";

// `content` is an email-ready HTML fragment only when isHtml is true.
// The shared brand header and footer always surround the campaign body.
const promotionalTemplate = (
  name = "Valued Customer",
  subject,
  content,
  isHtml
) => renderEmailLayout({
  title: subject || "A note from S N Steel Fabrication",
  preheader: "News and offers from S N Steel Fabrication.",
  content: `
    <p style="margin:0 0 18px;">Hello <strong>${escapeHtml(name)}</strong>,</p>
    ${isHtml
      ? String(content ?? "")
      : `<p style="margin:0;white-space:normal;">${escapeHtml(content).replace(/\r?\n/g, "<br>")}</p>`}
  `,
  footerNote: "You received this email because you have an account with us.",
});

export default promotionalTemplate;
