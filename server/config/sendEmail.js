import { sendEmail } from "./emailService.js"; // Adjust path accordingly


const sendEmailFun = async (to, subject, text, html) => {
  try {
    console.log("➡️ Sending email to:", to);
    const result = await sendEmail(to, subject, text, html);

    if (result.success) {
      console.log("✅ Email sent successfully.");
      return true;
    } else {
      console.warn("⚠️ Email send failed (from result):", result);
      return false;
    }
  } catch (error) {
    console.error("❌ Error in sendEmailFun:", error);
    return false;
  }
};


export default sendEmailFun;
