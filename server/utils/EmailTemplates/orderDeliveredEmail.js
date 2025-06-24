const orderDeliveredEmail = (
  name = "Valued Customer",
  orderId = "ORD-XXXX",
  deliveryDate = new Date().toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "long",
    day: "2-digit"
  }),
  itemsSummary = ""
) => `
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.1); border: 1px solid #ccc; font-family: Arial, sans-serif;">

    <!-- Header -->
   <div style="background: linear-gradient(to right, #1e1b4b, #1e1e80, #1e40af); padding: 24px; text-align: center;">
      <img src="https://snsteelfabrication.com/images/logo.png" alt="SNSF Logo" style="height: 60px; border-radius: 8px;" />
      <h2 style="color: #ffffff; margin: 16px 0 4px;">✅ Order Delivered</h2>
     <p style="color: #cbd5e1; font-size: 14px;">Thanks for shopping with S N Steel Fabrication</p>
    </div>

    <!-- Body -->
    <div style="padding: 30px;">
      <p style="font-size: 16px; color: #1e293b;">
        Hi <strong>${name}</strong> 👋,
      </p>

      <p style="font-size: 15px; color: #334155; line-height: 1.6;">
        Your order <strong>${orderId}</strong> was delivered on <strong>${deliveryDate}</strong> 📦.
      </p>

      ${
        itemsSummary
          ? `<div style="background-color: #f0fdf4; padding: 16px; border-left: 4px solid #15803d; margin-top: 20px; border-radius: 6px;">
              <h4 style="margin-bottom: 8px; color: #14532d;">🛍️ Items Delivered:</h4>
              ${itemsSummary}
            </div>`
          : ""
      }

      <p style="font-size: 14px; color: #64748b; margin-top: 20px;">
        We hope everything arrived safely. If you need any help, feel free to contact us.
      </p>

      <div style="text-align: center; margin-top: 30px;">
        <a href="https://snsteelfabrication.com" target="_blank" style="background-color: #15803d; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
          🛒 Shop Again
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f8fafc; padding: 20px; font-size: 12px; color: #64748b; text-align: center;">
      📍 S N Steel Fabrication, New Burupada, Near Hanuman Temple, Via-Hinjilicut, Ganjam, Odisha - 761146<br/>
      📞 +91 9776501230 | ✉️ snsteelfabrication010@gmail.com<br/><br/>
      You're receiving this email because you made a purchase on our website.
    </div>
  </div>
`;

export default orderDeliveredEmail;
