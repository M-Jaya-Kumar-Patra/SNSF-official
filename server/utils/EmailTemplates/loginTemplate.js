const newLoginEmail = (
  name = "Valued Customer",
  time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
) => `
<div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb;font-family:Arial,Helvetica,sans-serif;">

  <!-- Header -->
  <div style="background:#0f172a;padding:28px 24px;text-align:center;">
    <img src="https://snsteelfabrication.com/images/logo.png" alt="SNSF" style="height:56px;margin-bottom:14px;" />
    <h1 style="margin:0;font-size:22px;font-weight:600;color:#ffffff;">
      New Account Login
    </h1>
    <p style="margin:6px 0 0;font-size:14px;color:#cbd5f5;">
      A sign-in to your account was detected
    </p>
  </div>

  <!-- Body -->
  <div style="padding:32px 28px;color:#1f2937;">

    <p style="font-size:16px;margin:0 0 14px;">
      Hello <strong>${name}</strong>,
    </p>

    <p style="font-size:15px;line-height:1.7;margin:0 0 20px;color:#374151;">
      We noticed a successful login to your <strong>S N Steel Fabrication</strong> account.
      This message is sent to help keep your account secure.
    </p>

    <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:10px;padding:18px 20px;margin-bottom:22px;">
      <table width="100%" style="font-size:14px;color:#374151;">
        <tr>
          <td style="padding:6px 0;"><strong>Login Method</strong></td>
          <td style="padding:6px 0;">Email & Password</td>
        </tr>
        <tr>
          <td style="padding:6px 0;"><strong>Date & Time</strong></td>
          <td style="padding:6px 0;">${time}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;"><strong>Access Type</strong></td>
          <td style="padding:6px 0;">Web Browser</td>
        </tr>
      </table>
    </div>

    <p style="font-size:14px;line-height:1.6;color:#4b5563;margin:0 0 24px;">
      If this was you, no action is needed.  
      If you don’t recognize this activity, please secure your account immediately.
    </p>

    <!-- CTA Buttons -->
    <div style="text-align:center;">
      <a href="https://snsteelfabrication.com/profile" target="_blank"
        style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;
        padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;margin-bottom:10px;">
        Review Account Activity
      </a>

      <br />

      <a href="https://snsteelfabrication.com/address" target="_blank"
        style="display:inline-block;background:#ffffff;color:#0f172a;text-decoration:none;
        padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;
        border:1px solid #0f172a;">
        Add Delivery Address
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
      You’re receiving this email because your SNSF account was accessed.
    </p>
  </div>

</div>
`;



// =====================
// GOOGLE LOGIN EMAIL
// =====================
const newGoogleLoginEmail = (
  name = "Valued Customer",
  time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
) => `
<div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb;font-family:Arial,Helvetica,sans-serif;">

  <!-- Header -->
  <div style="background:#0f172a;padding:28px 24px;text-align:center;">
    <img src="https://snsteelfabrication.com/images/logo.png" alt="SNSF" style="height:56px;margin-bottom:14px;" />
    <h1 style="margin:0;font-size:22px;font-weight:600;color:#ffffff;">
      Google Sign-In Successful
    </h1>
    <p style="margin:6px 0 0;font-size:14px;color:#cbd5f5;">
      Your account was accessed using Google
    </p>
  </div>

  <!-- Body -->
  <div style="padding:32px 28px;color:#1f2937;">

    <p style="font-size:16px;margin:0 0 14px;">
      Hello <strong>${name}</strong>,
    </p>

    <p style="font-size:15px;line-height:1.7;margin:0 0 20px;color:#374151;">
      You successfully signed in to your <strong>S N Steel Fabrication</strong> account using
      <strong>Google Sign-In</strong>.
    </p>

    <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:10px;padding:18px 20px;margin-bottom:22px;">
      <table width="100%" style="font-size:14px;color:#374151;">
        <tr>
          <td style="padding:6px 0;"><strong>Login Method</strong></td>
          <td style="padding:6px 0;">Google Account</td>
        </tr>
        <tr>
          <td style="padding:6px 0;"><strong>Date & Time</strong></td>
          <td style="padding:6px 0;">${time}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;"><strong>Access Type</strong></td>
          <td style="padding:6px 0;">Web Browser</td>
        </tr>
      </table>
    </div>

    <p style="font-size:14px;line-height:1.6;color:#4b5563;margin:0 0 24px;">
      If this was you, no action is required.  
      If you don’t recognize this activity, please review your account.
    </p>

    <div style="text-align:center;">
      <a href="https://snsteelfabrication.com/profile" target="_blank"
        style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;
        padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;">
        Review Account Activity
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
      You’re receiving this email because your SNSF account was accessed.
    </p>
  </div>

</div>
`;

export { newLoginEmail, newGoogleLoginEmail };
