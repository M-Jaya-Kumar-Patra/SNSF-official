import renderEmailLayout, { emailButton, emailDetails, emailPanel, escapeHtml } from "./emailLayout.js";

const orderReturnedEmail = (
  name = "Valued Customer",
  orderId = "ORD-XXXX",
  returnDate = new Date().toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata", year: "numeric", month: "long", day: "2-digit",
  }),
  itemsHtml = ""
) => renderEmailLayout({
  title: "Return received",
  preheader: "We have received the items from your return.",
  content: `
    <p style="margin:0 0 16px;">Hello <strong>${escapeHtml(name)}</strong>,</p>
    <p style="margin:0;">We received the return for order <strong>${escapeHtml(orderId)}</strong>.</p>
    ${emailDetails([["Order ID", orderId], ["Return received on", returnDate]])}
    ${itemsHtml ? emailPanel(`<strong>Returned items</strong><br>${itemsHtml}`) : ""}
    <p style="margin:0;color:#526b7a;font-size:14px;">Your refund will be initiated shortly and should appear in your account within 3–5 business days.</p>
    ${emailButton("Track your refund", "https://snsteelfabrication.com/orders")}`,
  footerNote: "You received this email because you returned an order with us.",
});

export default orderReturnedEmail;
