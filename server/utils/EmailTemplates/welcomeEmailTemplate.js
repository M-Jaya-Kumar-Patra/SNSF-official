const welcomeEmail = (
  userName = "Valued Customer"
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
      Welcome to S N Steel Fabrication
    </h1>
    <p style="margin:6px 0 0;font-size:14px;color:#cbd5f5;">
      Crafted furniture for modern living
    </p>
  </div>

  <!-- Body -->
  <div style="padding:32px 28px;color:#1f2937;">

    <p style="font-size:16px;margin:0 0 14px;">
      Hello <strong>${userName}</strong>,
    </p>

    <p style="font-size:15px;line-height:1.7;margin:0 0 22px;color:#374151;">
      Thank you for joining <strong>S N Steel Fabrication</strong>.
      We’re delighted to have you with us.
      Our furniture is thoughtfully designed and built with strength,
      precision, and long-lasting quality—crafted to elevate both homes
      and workspaces.
    </p>

    <!-- Info Box -->
    <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:10px;padding:18px 20px;margin-bottom:24px;">
      <p style="margin:0;font-size:14px;line-height:1.6;color:#374151;">
        <strong>What you can expect:</strong><br/>
        • Premium steel furniture collections<br/>
        • Reliable craftsmanship & durability<br/>
        • New arrivals and exclusive updates
      </p>
    </div>

    <p style="font-size:14px;line-height:1.6;color:#6b7280;margin:0 0 26px;">
      We invite you to explore our collection and discover furniture
      designed to stand the test of time.
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
        Visit Our Store
      </a>
    </div>

    <p style="font-size:13.5px;line-height:1.6;color:#6b7280;margin-top:28px;">
      If you have any questions or need assistance, our team is always happy to help.
    </p>

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
      You’re receiving this email because you created an account with us.
    </p>
  </div>

</div>
`;

export default welcomeEmail;
