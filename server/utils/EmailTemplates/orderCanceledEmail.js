import renderEmailLayout, { emailButton, emailPanel, escapeHtml } from "./emailLayout.js";

const orderCancelledEmail = (
  name = "Valued Customer",
  orderId = "ORD-XXXX",
  refundNote = ""
) => renderEmailLayout({
  title: "Order cancelled",
  preheader: "Your cancellation has been processed.",
  content: `
    <p style="margin:0 0 16px;">Hello <strong>${escapeHtml(name)}</strong>,</p>
    <p style="margin:0;">Your order <strong>${escapeHtml(orderId)}</strong> has been cancelled successfully.</p>
    ${refundNote ? emailPanel(`<strong>Refund update</strong><br>${escapeHtml(refundNote)}`, "#b2684b") : ""}
    <p style="margin:20px 0 0;color:#526b7a;font-size:14px;">If this was unintentional or you need help, please contact our support team.</p>
    ${emailButton("Browse more products")}`,
  footerNote: "You received this email because you placed an order with us.",
});

export default orderCancelledEmail;
