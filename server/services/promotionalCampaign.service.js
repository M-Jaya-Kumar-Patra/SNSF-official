import sendEmailFun from "../config/sendEmail.js";
import { sendEmailBatch } from "../config/emailService.js";
import promotionalTemplate from "../utils/EmailTemplates/prommotionalEmail.js";
import {
  PROMOTIONAL_TEST_EMAIL,
  uniqueCampaignUsers,
} from "../utils/promotionalEmailPolicy.js";

const BATCH_SIZE = 100;

export async function deliverPromotionalCampaign({
  users = [],
  subject,
  content,
  isHtml,
  testMode,
  sendOne = sendEmailFun,
  sendBatch = sendEmailBatch,
  render = promotionalTemplate,
}) {
  if (testMode) {
    const accepted = await sendOne(
      PROMOTIONAL_TEST_EMAIL,
      `[Preview] ${subject}`,
      isHtml ? "" : content,
      render("Preview", subject, content, isHtml),
    );
    return {
      success: accepted,
      testMode: true,
      recipientCount: 1,
      sentCount: accepted ? 1 : 0,
      failedCount: accepted ? 0 : 1,
    };
  }

  const recipients = uniqueCampaignUsers(users);
  let sentCount = 0;
  let failure = null;

  for (let offset = 0; offset < recipients.length; offset += BATCH_SIZE) {
    const batch = recipients.slice(offset, offset + BATCH_SIZE).map((user) => ({
      to: user.email.trim(),
      subject,
      html: render(user.name || "Valued Customer", subject, content, isHtml),
      ...(isHtml ? {} : { text: content }),
    }));

    const result = await sendBatch(batch);
    sentCount += result.sentCount || 0;
    if (!result.success) {
      failure = result.error || "Email provider rejected a batch";
      break;
    }

    // Keep batch requests below the default provider request rate.
    if (offset + BATCH_SIZE < recipients.length) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  return {
    success: sentCount > 0,
    testMode: false,
    recipientCount: recipients.length,
    sentCount,
    failedCount: recipients.length - sentCount,
    ...(failure ? { message: "The provider did not accept every message. Please review counts before sending again." } : {}),
  };
}
