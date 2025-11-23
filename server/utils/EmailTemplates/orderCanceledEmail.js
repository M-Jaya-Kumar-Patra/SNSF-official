const orderCancelledEmail = (
  name = "Valued Customer",
  orderId = "ORD-XXXX",
  refundNote = ""
) => `
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.1); border: 1px solid #ccc;">

    <!-- Header -->
   <div style="background: linear-gradient(to right, #1e1b4b, #1e1e80, #1e40af); padding: 24px; text-align: center;">
      <img src="https://snsteelfabrication.com/images/logo.png" alt="SNSF Logo" style="height: 60px; border-radius: 8px;" />
      <h2 style="color: #ffffff; margin: 16px 0 4px;">❌ Order Cancelled</h2>
      <p style="color: #cbd5e1; font-size: 14px;">We’re sorry to see you cancel your order</p>
    </div>

    <!-- Body -->
    <div style="padding: 30px;">
      <p style="font-size: 16px; color: #1e293b;">
        Hi <strong>${name}</strong>,
      </p>
      <p style="font-size: 15px; color: #334155; line-height: 1.6;">
        Your order <strong>${orderId}</strong> has been successfully cancelled. 🗑️
      </p>

      ${
        refundNote
          ? `<div style="margin-top: 16px; background-color: #fef2f2; padding: 16px; border-left: 4px solid #dc2626; border-radius: 8px;">
              <p style="margin: 0; font-size: 14px; color: #991b1b;">💰 ${refundNote}</p>
            </div>`
          : ""
      }

      <p style="font-size: 14px; color: #64748b; margin-top: 20px;">
        If this was unintentional or you need any help, feel free to contact our support team anytime.
      </p>

      <div style="text-align: center; margin-top: 30px;">
        <a href="https://snsteelfabrication.com" target="_blank" style="background-color: #7f1d1d; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
          🔁 Browse More Products
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f8fafc; padding: 20px; font-size: 12px; color: #64748b; text-align: center;">
      📍 S N Steel Fabrication, New Burupada, Near Hanuman Temple, Via-Hinjilicut, Ganjam, Odisha - 761146<br/>
      📞 +91 9776501230 | ✉️ support@snsteelfabrication.com<br/><br/>
      You’re receiving this email because you placed an order on our website.
    </div>
  </div>
`;

export default orderCancelledEmail;
