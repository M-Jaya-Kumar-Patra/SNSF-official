import renderEmailLayout, { emailCode, escapeHtml } from "./emailLayout.js";

const verificationAdminEmail = (name = "Administrator", otp = "XXXXXX") =>
  renderEmailLayout({
    title: "Admin email verification",
    preheader: "Secure access to your admin account.",
    content: `
      <p style="margin:0 0 16px;">Hello <strong>${escapeHtml(name)}</strong>,</p>
      <p style="margin:0;">Use this one-time code to verify your email address and complete your S N Steel Fabrication admin setup:</p>
      ${emailCode(otp)}
      <p style="margin:0 0 16px;color:#526b7a;font-size:14px;">This code is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>
      <p style="margin:0;color:#526b7a;font-size:14px;">If you did not request admin access, please contact support.</p>`,
    footerNote: "This is an automated admin security email.",
  });

export default verificationAdminEmail;
