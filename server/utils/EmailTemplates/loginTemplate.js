const newLoginEmail = (name = "Valued Customer",  time = new Date().toLocaleString()) => `
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.1); border: 1px solid #ccc;">
    
    <!-- Header -->
    <div style="background: linear-gradient(to right, #1e1b4b, #1e1e80, #1e40af); padding: 24px; text-align: center;">
      <img src="https://snsteelfabrication.com/images/logo.png" alt="SNSF Logo" style="height: 60px; border-radius: 8px;" />
      <h2 style="color: #ffffff; margin: 16px 0 4px;">New Login Detected</h2>
      <p style="color: #cbd5e1; font-size: 14px;">Your account was just accessed</p>
    </div>

    <!-- Body -->
    <div style="padding: 30px;">
      <p style="font-size: 16px; color: #1e293b;">
        Hi <strong>${name}</strong>,
      </p>
      <p style="font-size: 15px; color: #334155; line-height: 1.6;">
        A new login to your SNSF account was detected. Below are the details:
      </p>

      <div style="margin: 24px 0; padding: 16px; background-color: #f1f5f9; border-radius: 8px;">
        <p style="margin: 6px 0; font-size: 15px;"><strong>Time:</strong> ${time}</p>
        <p style="margin: 6px 0; font-size: 15px;"><strong>Device:</strong> Web Browser</p>
      </div>

      <p style="font-size: 14px; color: #64748b;">
        If this was you, no action is needed. If not, please secure your account immediately by resetting your password.
      </p>

      <div style="text-align: center; margin-top: 24px;">
        <a href="https://snsteelfabrication.com/profile" target="_blank" style="background-color: #1e40af; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
          Reset Password
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f8fafc; padding: 20px; font-size: 12px; color: #64748b; text-align: center;">
      📍 S N Steel Fabrication, New Burupada, Near Hanuman Temple, Via-Hinjilicut, Ganjam, Odisha - 761146<br/>
      📞 +91 9776501230 | ✉️ support@snsteelfabrication.com<br/><br/>
      You’re receiving this email because your SNSF account was accessed.
    </div>
  </div>
`;

export default newLoginEmail;
