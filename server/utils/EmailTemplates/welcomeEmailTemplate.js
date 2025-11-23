const welcomeEmail = (userName = "Valued Customer") => `
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.1); border: 1px solid #ccc;">

    <!-- Header -->
    <div style="background: linear-gradient(to right, #1e1b4b, #1e1e80, #1e40af); padding: 24px; text-align: center;">
      <img src="https://snsteelfabrication.com/images/logo.png" alt="SNSF Logo" style="height: 60px; border-radius: 8px;" />
      <h2 style="color: #ffffff; margin: 16px 0 4px;">Welcome to S N Steel Fabrication</h2>
      <p style="color: #cbd5e1; font-size: 14px;">We’re glad to have you with us!</p>
    </div>

    <!-- Body -->
    <div style="padding: 30px;">
      <p style="font-size: 16px; color: #1e293b;">
        Hi <strong>${userName}</strong>,
      </p>
      <p style="font-size: 15px; color: #334155; line-height: 1.6;">
        Thank you for joining <strong>S N Steel Fabrication</strong>! Whether you're furnishing a home, office, or commercial space, we're proud to offer durable and stylish steel furniture made with care and craftsmanship.
      </p>

      <div style="background-color: #f1f5f9; border: 1px dashed #cbd5e1; padding: 16px; margin: 24px 0; border-radius: 8px;">
        <p style="margin: 0; font-size: 14px; color: #475569;">
          🛒 <strong>What’s Next?</strong><br/>
          Explore our latest collections, enjoy exclusive offers, and stay tuned for exciting updates.
        </p>
      </div>

      <div style="text-align: center; margin-top: 20px;">
        <a href="https://snsteelfabrication.com" target="_blank" style="background-color: #1e40af; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
          Visit Our Store →
        </a>
      </div>

      <p style="font-size: 14px; color: #64748b; margin-top: 30px;">
        If you have any questions, feel free to reach out. We’re always here to help.
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f8fafc; padding: 20px; font-size: 12px; color: #64748b; text-align: center;">
      📍 S N Steel Fabrication, New Burupada, Near Hanuman Temple, Via-Hinjilicut, Ganjam, Odisha - 761146<br/>
      📞 +91 9776501230 | ✉️ support@snsteelfabrication.com<br/><br/>
      You’re receiving this email because you registered on our website.
    </div>
  </div>
`;

export default welcomeEmail;
