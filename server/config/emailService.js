// emailService.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(to, subject, text, html) {
  try {
    const payload = {
      from: "SNSF <noreply@snsteelfabrication.com>", // VERIFIED DOMAIN ✅
      to,
      subject,
    };

    // IMPORTANT: never send empty strings
    if (text && text.trim().length > 0) {
      payload.text = text;
    }

    if (html && html.trim().length > 0) {
      payload.html = html;
    }

    // Safety check
    if (!payload.text && !payload.html) {
      throw new Error("Email must contain text or html");
    }

    const { data, error } = await resend.emails.send(payload);

    if (error) {
      console.error("❌ Resend error:", error);
      return { success: false, error };
    }

    console.log("✅ Resend email ID:", data.id);
    return { success: true, messageId: data.id };
  } catch (err) {
    console.error("❌ Resend exception:", err.message);
    return { success: false, error: err.message };
  }
}

export { sendEmail };
