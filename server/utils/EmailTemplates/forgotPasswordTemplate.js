const forgotPasswordEmail = (name = "Valued Customer", otp = "XXXXXX") => `
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.1); border: 1px solid #ccc;">

    <!-- Header -->
    <div style="background: linear-gradient(to right, #1e1b4b, #1e1e80, #1e40af); padding: 24px; text-align: center;">
      <img src="https://snsteelfabrication.com/images/logo.png" alt="SNSF Logo" style="height: 60px; border-radius: 8px;" />
      <h2 style="color: #ffffff; margin: 16px 0 4px;">Reset Your Password</h2>
      <p style="color: #cbd5e1; font-size: 14px;">We received a request to reset your SNSF account password</p>
    </div>

    <!-- Body -->
    <div style="padding: 30px;">
      <p style="font-size: 16px; color: #1e293b;">
        Hello <strong>${name}</strong>,
      </p>
      <p style="font-size: 15px; color: #334155; line-height: 1.6;">
        To proceed with resetting your password, use the OTP below. If you didn’t request this, please ignore this message.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 24px; font-weight: bold; background-color: #f3f4f6; padding: 14px 30px; border-radius: 10px; display: inline-block; border: 2px dashed #1e40af; color: #1e3a8a;">
          ${otp}
        </span>
      </div>

      <p style="font-size: 14px; color: #64748b;">
        This OTP is valid for 10 minutes. Please do not share this code with anyone for security reasons.
      </p>

      <div style="text-align: center; margin-top: 24px;">
        <a href="https://snsteelfabrication.com" target="_blank" style="background-color: #1e40af; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
          Return to Website →
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f8fafc; padding: 20px; font-size: 12px; color: #64748b; text-align: center;">
      📍 S N Steel Fabrication, New Burupada, Near Hanuman Temple, Via-Hinjilicut, Ganjam, Odisha - 761146<br/>
      📞 +91 9776501230 | ✉️ snsteelfabrication010@gmail.com<br/><br/>
      You’re receiving this email because a password reset request was made for your SNSF account.
    </div>
  </div>  
`;

export default forgotPasswordEmail;
