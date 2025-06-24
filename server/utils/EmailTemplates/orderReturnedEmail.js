const orderReturnedEmail = (
  name = "Valued Customer",
  orderId = "ORD-XXXX",
  returnDate = new Date().toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "long",
    day: "2-digit",
  }),
  itemsHtml = ``
) => `
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.1); border: 1px solid #ccc;">
    
    <!-- Header -->
   <div style="background: linear-gradient(to right, #1e1b4b, #1e1e80, #1e40af); padding: 24px; text-align: center;">
      <img src="https://snsteelfabrication.com/images/logo.png" alt="SNSF Logo" style="height: 60px; border-radius: 8px;" />
      <h2 style="color: #ffffff; margin: 16px 0 4px;">🔄 Order Returned Successfully</h2>
    <p style="color: #cbd5e1; font-size: 14px;">We've received your return for Order <strong>${orderId}</strong></p>
    </div>

    <!-- Body -->
    <div style="padding: 30px;">
      <p style="font-size: 16px; color: #1e293b;">
        Hi <strong>${name}</strong>,
      </p>

      <p style="font-size: 15px; color: #334155; line-height: 1.6;">
        Your return request for <strong>Order ${orderId}</strong> has been successfully processed. We’ve received the following items:
      </p>

      ${itemsHtml || "<p style='color: #64748b;'>No item details available.</p>"}

      <div style="background-color: #f3f4f6; padding: 16px; border-radius: 10px; margin: 20px 0;">
        <p style="margin: 6px 0; font-size: 16px; color: #4f46e5;">
          📦 <strong>Return Received On:</strong> ${returnDate}
        </p>
        <p style="margin: 6px 0; font-size: 15px; color: #475569;">
          💰 Your refund will be initiated shortly and should reflect in your account within 3–5 business days.
        </p>
      </div>

      <div style="text-align: center; margin-top: 24px;">
        <a href="https://snsteelfabrication.com/orders" target="_blank" style="background-color: #4f46e5; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
          Track My Refund →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f8fafc; padding: 20px; font-size: 12px; color: #64748b; text-align: center;">
      📍 S N Steel Fabrication, New Burupada, Near Hanuman Temple, Via-Hinjilicut, Ganjam, Odisha - 761146<br/>
      📞 +91 9776501230 | ✉️ snsteelfabrication010@gmail.com<br/><br/>
      You're receiving this email because you placed and returned an order on our website.
    </div>
  </div>
`;

export default orderReturnedEmail;
