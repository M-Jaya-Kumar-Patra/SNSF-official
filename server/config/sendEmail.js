// sendEmailFun.js
import { sendEmail } from "./emailService.js";





const sendEmailFun = async (to, subject, text, html) => {
  try {
    console.log("➡️ Sending email to:", to);

    const result = await sendEmail(to, subject, text, html);

    if (!result.success) {
      console.error("❌ Email failed:", result.error);
      return false;
    }
    
    console.log("✅ Email sent successfully:", result.messageId);
    return true;
  } catch (error) {
    console.error("❌ Error in sendEmailFun:", error);
    return false;
  }
};


export default sendEmailFun;
