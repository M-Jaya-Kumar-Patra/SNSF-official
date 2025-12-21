const verificationAdminEmail = (
  name = "Administrator",
  otp = "XXXXXX"
) => `
<div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb;font-family:Arial,Helvetica,sans-serif;">

  <!-- Header -->
  <div style="background:#0f172a;padding:26px 24px;text-align:center;">
    <img
      src="https://snsteelfabrication.com/images/logo.png"
      alt="SNSF Admin"
      style="height:52px;margin-bottom:12px;"
    />
    <h1 style="margin:0;font-size:21px;font-weight:600;color:#ffffff;">
      Admin Email Verification
    </h1>
    <p style="margin:6px 0 0;font-size:13px;color:#cbd5f5;">
      Secure access to the Admin Panel
    </p>
  </div>

  <!-- Body -->
  <div style="padding:30px 28px;color:#1f2937;">

    <p style="font-size:15px;margin:0 0 14px;">
      Hello <strong>${name}</strong>,
    </p>

    <p style="font-size:14.5px;line-height:1.7;margin:0 0 22px;color:#374151;">
      Welcome to the <strong>S N Steel Fabrication Admin Panel</strong>.
      To verify your email address and complete the setup, please use the
      one-time password (OTP) below.
    </p>

    <!-- OTP Box -->
    <div style="text-align:center;margin:26px 0;">
      <div style="
        display:inline-block;
        padding:14px 34px;
        border-radius:10px;
        background:#f8fafc;
        border:1px dashed #0f172a;
        font-size:26px;
        font-weight:700;
        letter-spacing:6px;
        color:#0f172a;
      ">
        ${otp}
      </div>
    </div>

    <p style="font-size:13.5px;line-height:1.6;color:#4b5563;margin:0 0 18px;">
      This OTP is valid for <strong>10 minutes</strong>.
      For security reasons, do not share this code with anyone.
    </p>

    <p style="font-size:13.5px;line-height:1.6;color:#6b7280;margin:0;">
      If you did not request admin access, please ignore this email or
      contact support immediately.
    </p>

  </div>

  <!-- Footer -->
  <<div style="background:#f9fafb;padding:22px 24px;text-align:center;font-size:12px;color:#6b7280;">
    <p style="margin:0 0 6px;">
      S N Steel Fabrication — Crafted Furniture for Modern Living
    </p>
    <p style="margin:0;">
      New Burupada, Near Hanuman Temple, Via-Hinjilicut, Ganjam, Odisha – 761146
    </p>
    <p style="margin:6px 0 0;">
      📞 +91 9776501230 | ✉️ support@snsteelfabrication.com
    </p>
    <p style="margin-top:12px;font-size:11px;color:#9ca3af;">
      © ${new Date().getFullYear()} S N Steel Fabrication. All rights reserved.
    </p>
  </div>

</div>
`;

export default verificationAdminEmail;
