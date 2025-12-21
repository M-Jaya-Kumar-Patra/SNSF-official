const verificationEmail = (
  name = "Valued Customer",
  otp = "XXXXXX"
) => `
<div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb;font-family:Arial,Helvetica,sans-serif;">

  <!-- Header -->
  <div style="background:#0f172a;padding:28px 24px;text-align:center;">
    <img
      src="https://snsteelfabrication.com/images/logo.png"
      alt="SNSF"
      style="height:56px;margin-bottom:14px;"
    />
    <h1 style="margin:0;font-size:22px;font-weight:600;color:#ffffff;">
      Verify Your Email Address
    </h1>
    <p style="margin:6px 0 0;font-size:14px;color:#cbd5f5;">
      Welcome to S N Steel Fabrication
    </p>
  </div>

  <!-- Body -->
  <div style="padding:32px 28px;color:#1f2937;">

    <p style="font-size:16px;margin:0 0 14px;">
      Hello <strong>${name}</strong>,
    </p>

    <p style="font-size:15px;line-height:1.7;margin:0 0 22px;color:#374151;">
      Thank you for creating an account with
      <strong>S N Steel Fabrication</strong>.
      Please use the one-time password (OTP) below to verify your email address
      and activate your account.
    </p>

    <!-- OTP Box -->
    <div style="text-align:center;margin:26px 0;">
      <div style="
        display:inline-block;
        padding:16px 36px;
        border-radius:12px;
        background:#f8fafc;
        border:1px dashed #0f172a;
        font-size:26px;
        font-weight:700;
        letter-spacing:5px;
        color:#0f172a;
      ">
        ${otp}
      </div>
    </div>

    <p style="font-size:14px;line-height:1.6;color:#4b5563;margin:0 0 20px;">
      This OTP is valid for <strong>10 minutes</strong>.
      For security reasons, please do not share this code with anyone.
    </p>

    <p style="font-size:14px;line-height:1.6;color:#6b7280;margin:0 0 26px;">
      If you did not create an account with us, you can safely ignore this email.
    </p>

    <!-- CTA -->
    <div style="text-align:center;">
      <a
        href="https://snsteelfabrication.com"
        target="_blank"
        style="
          display:inline-block;
          background:#0f172a;
          color:#ffffff;
          text-decoration:none;
          padding:12px 28px;
          border-radius:8px;
          font-size:14px;
          font-weight:600;
          letter-spacing:0.3px;
        "
      >
        Visit Website
      </a>
    </div>

  </div>

  <!-- Footer -->
  <div style="background:#f9fafb;padding:22px 24px;text-align:center;font-size:12px;color:#6b7280;">
    <p style="margin:0 0 6px;">
      S N Steel Fabrication — Crafted Furniture for Modern Living
    </p>
    <p style="margin:0;">
      New Burupada, Near Hanuman Temple, Via-Hinjilicut, Ganjam, Odisha – 761146
    </p>
    <p style="margin:6px 0 0;">
      📞 +91 9776501230 | ✉️ support@snsteelfabrication.com
    </p>
    <p style="margin-top:14px;font-size:11px;color:#9ca3af;">
      This is an automated verification email.
    </p>
  </div>

</div>
`;

export default verificationEmail;
