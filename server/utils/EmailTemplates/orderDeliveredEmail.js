import renderEmailLayout, { emailButton, emailDetails, emailPanel, escapeHtml } from "./emailLayout.js";

const orderDeliveredEmail = (
  name = "Valued Customer",
  orderId = "ORD-XXXX",
  deliveryDate = new Date().toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata", year: "numeric", month: "long", day: "2-digit",
  }),
  itemsSummary = ""
) => renderEmailLayout({
  title: "Order delivered",
  preheader: "Your order has arrived. We hope you enjoy it.",
  content: `
    <p style="margin:0 0 16px;">Hello <strong>${escapeHtml(name)}</strong>,</p>
    <p style="margin:0;">Your order <strong>${escapeHtml(orderId)}</strong> was delivered successfully.</p>
    ${emailDetails([["Order ID", orderId], ["Delivered on", deliveryDate]], "#3f8b78")}
    ${itemsSummary ? emailPanel(`<strong>Items delivered</strong><br>${itemsSummary}`, "#3f8b78") : ""}
    <p style="margin:0;color:#526b7a;font-size:14px;">We hope everything arrived safely. Please contact us if you need help.</p>
    ${emailButton("Shop again")}`,
  footerNote: "You received this email because you made a purchase with us.",
});

export default orderDeliveredEmail;
