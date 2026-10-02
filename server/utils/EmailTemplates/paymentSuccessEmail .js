import renderEmailLayout, { emailButton, emailDetails, emailPanel, escapeHtml } from "./emailLayout.js";

const paymentSuccessEmail = (
  name = "Valued Customer",
  orderId = "ORD-000000",
  total = "₹0.00",
  paymentMethod = "Cash on Delivery",
  itemsHtml = "<li>Item list not available</li>"
) => renderEmailLayout({
  title: "Payment successful",
  preheader: "We have received your payment. Thank you.",
  content: `
    <p style="margin:0 0 16px;">Hello <strong>${escapeHtml(name)}</strong>,</p>
    <p style="margin:0;">The payment for your order <strong>${escapeHtml(orderId)}</strong> has been received successfully.</p>
    ${emailDetails([["Order ID", orderId], ["Amount paid", total], ["Payment method", paymentMethod]], "#3f8b78")}
    ${emailPanel(`<strong>Items in your order</strong><br>${itemsHtml}`)}
    <p style="margin:0;color:#526b7a;font-size:14px;">If you have questions about your payment, please contact our support team.</p>
    ${emailButton("View your order", "https://snsteelfabrication.com/orders")}`,
  footerNote: "You received this email because you made a purchase with us.",
});

export default paymentSuccessEmail;
