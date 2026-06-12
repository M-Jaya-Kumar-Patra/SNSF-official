import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/connectDb.js";
import {
  runRecommendationJob,
  startRecommendationCron,
} from "../cron/recommendation.cron.js";

await connectDB();

if (process.env.RUN_RECOMMENDATION_ONCE === "true") {
  const result = await runRecommendationJob();
  console.log("Recommendation job executed:", result);
  process.exit(0);
}

startRecommendationCron();
console.log(
  `Recommendation cron is running with schedule ${
    process.env.RECOMMENDATION_CRON || "30 4 * * *"
  }`
);
