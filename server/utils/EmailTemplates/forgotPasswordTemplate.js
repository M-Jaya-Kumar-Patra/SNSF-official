import renderEmailLayout, { emailButton, emailCode, escapeHtml } from "./emailLayout.js";

const forgotPasswordEmail = (name = "Valued Customer", otp = "XXXXXX") =>
  renderEmailLayout({
    title: "Reset your password",
    preheader: "Your S N Steel Fabrication password reset code is inside.",
    content: `
      <p style="margin:0 0 16px;">Hello <strong>${escapeHtml(name)}</strong>,</p>
      <p style="margin:0;">We received a request to reset your account password. Enter this one-time code to continue:</p>
      ${emailCode(otp)}
      <p style="margin:0 0 16px;color:#526b7a;font-size:14px;">This code is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>
      <p style="margin:0;color:#526b7a;font-size:14px;">If you did not request a password reset, you can safely ignore this email. Your password will stay the same.</p>
      ${emailButton("Visit our website")}`,
    footerNote: "This is an automated account security email.",
  });

export default forgotPasswordEmail;
