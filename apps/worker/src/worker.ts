import { Worker } from "bullmq";
import { redis } from "./lib/redis.js";
import { traceQueue } from "./queue/trace.queue.js";
import { addTelemetryToDB } from "./service/telemetry.service.js";
import { evaluateTrace } from "./service/evaluation.service.js";


const worker = new Worker(
  "trace-ingestion",
  async (job) => {
    console.log(
      `Processing Job ${job.id} (${job.name})`,
    );

    switch (job.name) {
      case "ingest": {
        const trace = await addTelemetryToDB(
          job.data.projectId,
          job.data.data,
        );

        await traceQueue.add("evaluate", {
          traceId: trace.id,
        });

        console.log(
          `Job ${job.id} persisted successfully`,
        );

        break;
      }

      case "evaluate": {
        await evaluateTrace(job.data.traceId);

        console.log(
          `Evaluation for trace ${job.data.traceId} completed`,
        );

        break;
      }

      default:
        throw new Error(
          `Unknown job type: ${job.name}`,
        );
    }
  },
  {
    connection: redis,
  },
);

worker.on("completed", (job) => {
  console.log(
    `Job ${job.id} (${job.name}) completed`,
  );
});

worker.on("failed", (job, error) => {
  console.error(
    `Job ${job?.id} (${job?.name}) failed:`,
    error,
  );
});
