import renderEmailLayout, { emailButton, emailPanel, escapeHtml } from "./emailLayout.js";

const passwordResetSuccessEmail = (name = "Valued Customer") =>
  renderEmailLayout({
    title: "Password updated successfully",
    preheader: "Your account security has been updated.",
    content: `
      <p style="margin:0 0 16px;">Hello <strong>${escapeHtml(name)}</strong>,</p>
      <p style="margin:0;">The password for your S N Steel Fabrication account has been changed successfully.</p>
      ${emailPanel("If you made this change, no further action is needed. Your account is ready to use.")}
      <p style="margin:0;color:#526b7a;font-size:14px;">If you do not recognize this activity, please contact our support team immediately and review your account.</p>
      ${emailButton("Log in to your account", "https://snsteelfabrication.com/login")}`,
    footerNote: "This is an automated security confirmation email.",
  });

export default passwordResetSuccessEmail;
