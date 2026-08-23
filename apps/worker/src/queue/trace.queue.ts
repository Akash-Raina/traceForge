import { Queue } from "bullmq";
import { redis } from "../lib/redis.js";

export const traceQueue = new Queue(
  "trace-ingestion",
  {
    connection: redis,
  },
);
