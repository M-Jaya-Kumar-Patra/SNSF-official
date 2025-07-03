const refundCompletedEmail = (
  name = "Valued Customer",
  orderId = "ORD-XXXX",
  refundAmount = "₹0.00",
  refundMode = "Original Payment Method",
  refundDate = new Date().toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "long",
    day: "2-digit"
  })
) => `
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.1); border: 1px solid #ccc;">
    
    <!-- Header -->
   <div style="background: linear-gradient(to right, #1e1b4b, #1e1e80, #1e40af); padding: 24px; text-align: center;">
      <img src="https://snsteelfabrication.com/images/logo.png" alt="SNSF Logo" style="height: 60px; border-radius: 8px;" />
      <h2 style="color: #ffffff; margin: 16px 0 4px;">💸 Refund Completed</h2>
   <p style="color: #cbd5e1; font-size: 14px;">Your refund for Order <strong>${orderId}</strong> has been processed</p>
    </div>

    <!-- Body -->
    <div style="padding: 30px;">
      <p style="font-size: 16px; color: #1e293b;">
        Hi <strong>${name}</strong>,
      </p>

      <p style="font-size: 15px; color: #334155; line-height: 1.6;">
        We're writing to let you know that your refund for <strong>Order ${orderId}</strong> has been successfully processed. 🎉
      </p>

      <div style="background-color: #f0fdf4; padding: 16px; border-radius: 10px; margin: 20px 0;">
        <p style="margin: 6px 0; font-size: 16px; color: #065f46;">
          ✅ <strong>Refund Amount:</strong> ${refundAmount}
        </p>
        <p style="margin: 6px 0; font-size: 16px; color: #065f46;">
          💳 <strong>Refunded To:</strong> ${refundMode}
        </p>
        <p style="margin: 6px 0; font-size: 16px; color: #065f46;">
          📅 <strong>Refund Date:</strong> ${refundDate}
        </p>
      </div>

      <p style="font-size: 14px; color: #64748b;">
        Please note, depending on your bank, it may take 3–5 business days for the refund to appear in your account.
      </p>

      <div style="text-align: center; margin-top: 24px;">
        <a href="https://snsteelfabrication.com/orders" target="_blank" style="background-color: #059669; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
          🔍 View My Enquries
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f8fafc; padding: 20px; font-size: 12px; color: #64748b; text-align: center;">
      📍 S N Steel Fabrication, New Burupada, Near Hanuman Temple, Via-Hinjilicut, Ganjam, Odisha - 761146<br/>
      📞 +91 9776501230 | ✉️ snsteelfabrication010@gmail.com<br/><br/>
      You’re receiving this email because you made a purchase on our website.
    </div>
  </div>
`;

export default refundCompletedEmail;
