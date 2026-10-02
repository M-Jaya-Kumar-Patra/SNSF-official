import renderEmailLayout, { emailButton, emailPanel, escapeHtml } from "./emailLayout.js";

const defaultTime = () => new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

function loginEmail(name, time, method) {
  const google = method === "Google account";
  return renderEmailLayout({
    title: google ? "Google sign-in successful" : "New account login",
    preheader: google ? "Your account was accessed using Google." : "A sign-in to your account was detected.",
    content: `
      <p style="margin:0 0 16px;">Hello <strong>${escapeHtml(name)}</strong>,</p>
      <p style="margin:0;">Your S N Steel Fabrication account was signed in to successfully. We sent this message to help keep your account secure.</p>
      ${emailPanel(`
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#284255;">
          <tr><td style="padding:4px 8px 4px 0;font-weight:700;">Login method</td><td style="padding:4px 0;">${escapeHtml(method)}</td></tr>
          <tr><td style="padding:4px 8px 4px 0;font-weight:700;">Date and time</td><td style="padding:4px 0;">${escapeHtml(time)}</td></tr>
          <tr><td style="padding:4px 8px 4px 0;font-weight:700;">Access type</td><td style="padding:4px 0;">Web browser</td></tr>
        </table>`)}
      <p style="margin:0;color:#526b7a;font-size:14px;">If this was you, no action is needed. If you do not recognize this activity, please review your account immediately.</p>
      ${emailButton("Review your account", "https://snsteelfabrication.com/profile")}
      ${google ? "" : `<p style="margin:12px 0 0;text-align:center;font-size:13px;"><a href="https://snsteelfabrication.com/address" style="color:#176483;text-decoration:underline;">Add a delivery address</a></p>`}`,
    footerNote: "You received this email because your account was accessed.",
  });
}

const newLoginEmail = (name = "Valued Customer", time = defaultTime()) =>
  loginEmail(name, time, "Email and password");

const newGoogleLoginEmail = (name = "Valued Customer", time = defaultTime()) =>
  loginEmail(name, time, "Google account");

export { newLoginEmail, newGoogleLoginEmail };
