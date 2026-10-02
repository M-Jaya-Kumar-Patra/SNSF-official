import renderEmailLayout, { emailButton, emailPanel, escapeHtml } from "./emailLayout.js";

const welcomeEmail = (userName = "Valued Customer") =>
  renderEmailLayout({
    title: "Welcome to S N Steel Fabrication",
    preheader: "Furniture crafted for the way you live and work.",
    content: `
      <p style="margin:0 0 16px;">Hello <strong>${escapeHtml(userName)}</strong>,</p>
      <p style="margin:0;">Thank you for joining us. We design furniture with strength, precision and lasting quality for homes and workspaces.</p>
      ${emailPanel(`<strong>What you can expect</strong><br>Thoughtful steel furniture collections<br>Reliable craftsmanship and durability<br>New arrivals and exclusive updates`)}
      <p style="margin:0;color:#526b7a;font-size:14px;">Explore our collection whenever you're ready. If you need help, our team is happy to assist.</p>
      ${emailButton("Explore our store")}`,
    footerNote: "You received this email because you created an account with us.",
  });

export default welcomeEmail;
