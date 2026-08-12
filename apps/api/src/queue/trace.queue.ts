import { Queue } from "bullmq";
import {Redis} from "ioredis";

const connection = new Redis({
  host: "localhost",
  port: 6379
})

export const traceQueue = new Queue("trace-ingestion", {
  connection
})
