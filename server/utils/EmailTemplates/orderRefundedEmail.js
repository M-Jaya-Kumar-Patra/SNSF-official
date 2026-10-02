import renderEmailLayout, { emailButton, emailDetails, escapeHtml } from "./emailLayout.js";

const refundCompletedEmail = (
  name = "Valued Customer",
  orderId = "ORD-XXXX",
  refundAmount = "₹0.00",
  refundMode = "Original Payment Method",
  refundDate = new Date().toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata", year: "numeric", month: "long", day: "2-digit",
  })
) => renderEmailLayout({
  title: "Refund completed",
  preheader: "Your refund has been processed.",
  content: `
    <p style="margin:0 0 16px;">Hello <strong>${escapeHtml(name)}</strong>,</p>
    <p style="margin:0;">Your refund for order <strong>${escapeHtml(orderId)}</strong> has been processed.</p>
    ${emailDetails([["Refund amount", refundAmount], ["Refunded to", refundMode], ["Refund date", refundDate]], "#3f8b78")}
    <p style="margin:0;color:#526b7a;font-size:14px;">Depending on your bank, it may take 3–5 business days for the refund to appear in your account.</p>
    ${emailButton("View your orders", "https://snsteelfabrication.com/orders")}`,
  footerNote: "You received this email because you made a purchase with us.",
});

export default refundCompletedEmail;
