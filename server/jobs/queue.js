import { Queue } from "bullmq";
import IORedis from "ioredis";

const queues = new Map();
let connection = null;

function queueEnabled() {
  return process.env.QUEUE_ENABLED !== "false" && Boolean(process.env.REDIS_URL);
}

function getConnection() {
  if (!queueEnabled()) return null;

  if (!connection) {
    connection = new IORedis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
    });
  }

  return connection;
}

export function getQueue(name) {
  const redisConnection = getConnection();
  if (!redisConnection) return null;

  if (!queues.has(name)) {
    queues.set(
      name,
      new Queue(name, {
        connection: redisConnection,
        defaultJobOptions: {
          attempts: 3,
          backoff: { type: "exponential", delay: 5000 },
          removeOnComplete: 1000,
          removeOnFail: 5000,
        },
      })
    );
  }

  return queues.get(name);
}

export async function addJob(queueName, jobName, payload, options = {}) {
  const queue = getQueue(queueName);

  if (queue) {
    const job = await queue.add(jobName, payload, options.jobOptions || {});
    return { queued: true, jobId: job.id };
  }

  if (typeof options.inline === "function") {
    await options.inline(payload);
    return { queued: false, inline: true };
  }

  return { queued: false, inline: false };
}

export async function closeQueues() {
  await Promise.all([...queues.values()].map((queue) => queue.close()));
  queues.clear();

  if (connection) {
    await connection.quit();
    connection = null;
  }
}
