// emailService.js
import { Resend } from "resend";
import { outboundEmailRecipients } from "../utils/promotionalEmailPolicy.js";

let resend;
const getResend = () => {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
};
export const EMAIL_FROM = "SNSF <noreply@snsteelfabrication.com>";

async function sendEmail(to, subject, text, html) {
  try {
    const payload = {
      from: EMAIL_FROM,
      // A local server must never send any email to a customer address.
      to: outboundEmailRecipients(to),
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

    const { data, error } = await getResend().emails.send(payload);

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

async function sendEmailBatch(messages) {
  if (process.env.NODE_ENV !== "production") {
    return { success: false, sentCount: 0, error: "Bulk email is disabled outside production" };
  }

  if (!Array.isArray(messages) || messages.length < 1 || messages.length > 100) {
    return { success: false, sentCount: 0, error: "Batch must contain 1 to 100 emails" };
  }

  try {
    const payload = messages.map(({ to, subject, html, text }) => ({
      from: EMAIL_FROM,
      to,
      subject,
      ...(html ? { html } : {}),
      ...(text ? { text } : {}),
    }));
    const { data, error } = await getResend().batch.send(payload);
    if (error) {
      console.error("Resend promotional batch failed:", error);
      return { success: false, sentCount: 0, error };
    }

    const sentCount = data?.data?.length || 0;
    return {
      success: sentCount === messages.length,
      sentCount,
      error: sentCount === messages.length ? null : "Resend did not accept every email in the batch",
    };
  } catch (error) {
    console.error("Resend promotional batch exception:", error.message);
    return { success: false, sentCount: 0, error: error.message };
  }
}

export { sendEmail, sendEmailBatch };
