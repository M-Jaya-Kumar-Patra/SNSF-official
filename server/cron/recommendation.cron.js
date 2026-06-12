import cron from "node-cron";
import { addJob } from "../jobs/queue.js";
import { sendDailyRecommendationEmails } from "../services/recommendation.service.js";

export async function runRecommendationJob() {
  return addJob("recommendations", "send-daily-recommendations", {}, {
    inline: sendDailyRecommendationEmails,
    jobOptions: {
      jobId: `recommendations-${new Date().toISOString().slice(0, 10)}`,
    },
  });
}

export function startRecommendationCron() {
  return cron.schedule(
    process.env.RECOMMENDATION_CRON || "30 4 * * *",
    async () => {
      try {
        const result = await runRecommendationJob();
        console.log("Recommendation job scheduled:", result);
      } catch (error) {
        console.error("Recommendation cron failed:", error);
      }
    }
  );
}
