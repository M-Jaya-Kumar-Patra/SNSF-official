const passwordResetSuccessEmail = (name = "Valued Customer") => `
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.1); border: 1px solid #ccc;">

    <!-- Header -->
    <div style="background: linear-gradient(to right, #1e1b4b, #1e1e80, #1e40af); padding: 24px; text-align: center;">
      <img src="https://snsteelfabrication.com/images/logo.png" alt="SNSF Logo" style="height: 60px; border-radius: 8px;" />
      <h2 style="color: #ffffff; margin: 16px 0 4px;">Password Changed Successfully</h2>
      <p style="color: #cbd5e1; font-size: 14px;">Your SNSF account password has been updated</p>
    </div>

    <!-- Body -->
    <div style="padding: 30px;">
      <p style="font-size: 16px; color: #1e293b;">
        Hello <strong>${name}</strong>,
      </p>
      <p style="font-size: 15px; color: #334155; line-height: 1.6;">
        This is a confirmation that your SNSF account password has been successfully changed.
      </p>

      <p style="font-size: 14px; color: #64748b; margin-top: 20px;">
        If you did not make this change, please contact our support team immediately.
      </p>

      <div style="text-align: center; margin-top: 24px;">
        <a href="https://snsteelfabrication.com/login" target="_blank" style="background-color: #1e40af; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
          Log In to Your Account →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f8fafc; padding: 20px; font-size: 12px; color: #64748b; text-align: center;">
      📍 S N Steel Fabrication, New Burupada, Near Hanuman Temple, Via-Hinjilicut, Ganjam, Odisha - 761146<br/>
      📞 +91 9776501230 | ✉️ support@snsteelfabrication.com<br/><br/>
      You’re receiving this email because you requested to reset your SNSF account password.
    </div>
  </div>  
`;

export default passwordResetSuccessEmail;
