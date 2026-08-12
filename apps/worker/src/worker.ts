import {Worker} from "bullmq";
import {redis} from "./lib/redis";
import { addTelemetryToDB } from "./service/telemetry.service";

const worker = new Worker(
  "trace-ingestion",
  async(job) => {

    console.log(`Processing Job ${job.id}`);

    await addTelemetryToDB(job.data.projectId, job.data.data);

    console.log(`Job ${job.id} persisted successfully`)
  },
  {
    connection: redis
  },
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
  console.error(
    `Job ${job?.id} failed:`,
    error,
  );
});
