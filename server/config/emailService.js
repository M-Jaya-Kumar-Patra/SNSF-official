// emailService.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Function to send email using Resend API
async function sendEmail(to, subject, text, html) {
  try {
    const response = await resend.emails.send({
      from: process.env.EMAIL || "SNSF <noreply@snsf.com>",
      to,
      subject,
      text,
      html,
    });

    return { success: true, messageId: response?.id || null };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
}

export { sendEmail };
