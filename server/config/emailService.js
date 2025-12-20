// emailService.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);




async function sendEmail(to, subject, text, html) {
  try {
    const { data, error } = await resend.emails.send({
      from: "SNSF <noreply@snsteelfabrication.com>",
      to,
      subject,
      text,
      html,
    });

    if (error) {
      console.error("❌ Resend error:", data);
      return { success: false, error };
    }

    console.log("✅ Resend email ID:", data.id);

    return { success: true, messageId: data.id };
  } catch (err) {
    console.error("❌ Resend exception:", err);
    return { success: false, error: err.message };
  }
}

export { sendEmail };
