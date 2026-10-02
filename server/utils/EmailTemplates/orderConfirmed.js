import renderEmailLayout, { emailButton, emailDetails, escapeHtml } from "./emailLayout.js";

const orderConfirmationEmail = (
  name = "Valued Customer",
  orderId = "ORD-000000",
  total = "₹0.00",
  deliveryDate = "Within 5–7 business days"
) => renderEmailLayout({
  title: "Order confirmed",
  preheader: "Thank you for shopping with S N Steel Fabrication.",
  content: `
    <p style="margin:0 0 16px;">Hello <strong>${escapeHtml(name)}</strong>,</p>
    <p style="margin:0;">Your order <strong>${escapeHtml(orderId)}</strong> has been placed successfully. We are getting it ready for you.</p>
    ${emailDetails([["Order ID", orderId], ["Total amount", total], ["Estimated delivery", deliveryDate]])}
    <p style="margin:0;color:#526b7a;font-size:14px;">Questions about your order? Our support team is here to help.</p>
    ${emailButton("View your orders", "https://snsteelfabrication.com/orders")}`,
  footerNote: "You received this email because you made a purchase with us.",
});

export default orderConfirmationEmail;
