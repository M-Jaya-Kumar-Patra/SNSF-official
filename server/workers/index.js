import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { Worker } from "bullmq";
import IORedis from "ioredis";

import connectDB from "../config/connectDb.js";
import {
  recordProductEvent,
  recordVisitorActivity,
} from "../services/analytics.service.js";
import { sendDailyRecommendationEmails } from "../services/recommendation.service.js";

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is required to run background workers");
}

// Connect MongoDB
await connectDB();

// Connect Redis
const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

const concurrency = Number(process.env.WORKER_CONCURRENCY) || 5;

// BullMQ Workers
const workers = [
  new Worker(
    "analytics",
    async (job) => {
      if (job.name === "track-visitor") {
        await recordVisitorActivity(job.data);
        return;
      }

      if (job.name === "track-product-event") {
        await recordProductEvent(job.data);
        return;
      }

      throw new Error(`Unknown analytics job: ${job.name}`);
    },
    {
      connection,
      concurrency,
    }
  ),

  new Worker(
    "recommendations",
    async (job) => {
      if (job.name === "send-daily-recommendations") {
        return sendDailyRecommendationEmails();
      }

      throw new Error(`Unknown recommendation job: ${job.name}`);
    },
    {
      connection,
      concurrency: 1,
    }
  ),
];

// Worker Events
for (const worker of workers) {
  worker.on("completed", (job) => {
    console.log(
      `✅ Job completed: ${job.queueName}/${job.name}/${job.id}`
    );
  });

  worker.on("failed", (job, error) => {
    console.error(
      `❌ Job failed: ${job?.queueName}/${job?.name}/${job?.id}`,
      error.message
    );
  });
}

// Health server for Render Free Plan
const app = express();
const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SNSF Worker Running",
    uptime: process.uptime(),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Worker health server running on port ${PORT}`);
});

// Graceful shutdown
async function shutdown() {
  console.log("Shutting down workers...");

  await Promise.all(
    workers.map(async (worker) => {
      try {
        await worker.close();
      } catch (err) {
        console.error("Worker close error:", err.message);
      }
    })
  );

  try {
    await connection.quit();
  } catch (err) {
    console.error("Redis close error:", err.message);
  }

  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

console.log("✅ Background workers are running");