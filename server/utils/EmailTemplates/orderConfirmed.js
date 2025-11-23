const orderConfirmationEmail = (
  name = "Valued Customer",
  orderId = "ORD-000000",
  total = "₹0.00",
  deliveryDate = "Within 5–7 business days"
) => `
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.1); border: 1px solid #ccc;">

    <!-- Header -->
    <div style="background: linear-gradient(to right, #1e1b4b, #1e1e80, #1e40af); padding: 24px; text-align: center;">
      <img src="https://snsteelfabrication.com/images/logo.png" alt="SNSF Logo" style="height: 60px; border-radius: 8px;" />
      <h2 style="color: #ffffff; margin: 16px 0 4px;">🛒 Order Confirmed</h2>
     <p style="color: #cbd5e1; font-size: 14px;">Thank you for shopping with us, <strong>${name}</strong>!</p>
    </div>

    <!-- Body -->
    <div style="padding: 30px;">
      <p style="font-size: 16px; color: #1e293b;">
        Hello <strong>${name}</strong>,
      </p>
      <p style="font-size: 15px; color: #334155; line-height: 1.6;">
        We're excited to inform you that your order <strong>${orderId}</strong> has been successfully placed. 🎉
      </p>

      <div style="margin: 24px 0; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; background-color: #f9fafb;">
        <p style="margin: 8px 0; font-size: 15px; color: #475569;">📦 <strong>Order ID:</strong> ${orderId}</p>
        <p style="margin: 8px 0; font-size: 15px; color: #475569;">💰 <strong>Total Amount:</strong> ${total}</p>
        <p style="margin: 8px 0; font-size: 15px; color: #475569;">🚚 <strong>Estimated Delivery:</strong> ${deliveryDate}</p>
      </div>

      <div style="text-align: center; margin-top: 24px;">
        <a href="https://snsteelfabrication.com/orders" target="_blank" style="background-color: #1e40af; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
          🔍 View Your Orders →
        </a>
      </div>

      <p style="font-size: 14px; color: #64748b; margin-top: 30px;">
        If you have any questions or need help, feel free to reply to this email or reach out to our support team anytime.
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f8fafc; padding: 20px; font-size: 12px; color: #64748b; text-align: center;">
      📍 S N Steel Fabrication, New Burupada, Near Hanuman Temple, Via-Hinjilicut, Ganjam, Odisha - 761146<br/>
      📞 +91 9776501230 | ✉️ support@snsteelfabrication.com<br/><br/>
      You're receiving this email because you made a purchase at SNSF.
    </div>
  </div>
`;

export default orderConfirmationEmail;
