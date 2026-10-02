import renderEmailLayout, { emailButton, emailCode, escapeHtml } from "./emailLayout.js";

const verificationEmail = (name = "Valued Customer", otp = "XXXXXX") =>
  renderEmailLayout({
    title: "Verify your email address",
    preheader: "Use this code to activate your S N Steel Fabrication account.",
    content: `
      <p style="margin:0 0 16px;">Hello <strong>${escapeHtml(name)}</strong>,</p>
      <p style="margin:0;">Thank you for creating an account with S N Steel Fabrication. Enter this one-time code to verify your email address:</p>
      ${emailCode(otp)}
      <p style="margin:0 0 16px;color:#526b7a;font-size:14px;">This code is valid for <strong>10 minutes</strong>. Please do not share it with anyone.</p>
      <p style="margin:0;color:#526b7a;font-size:14px;">If you did not create an account, you can safely ignore this email.</p>
      ${emailButton("Visit our website")}`,
    footerNote: "This is an automated account verification email.",
  });

export default verificationEmail;
