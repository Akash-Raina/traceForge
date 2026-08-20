import { ingestionDataInput } from "@traceforge/shared";
import { traceQueue } from "../queue/trace.queue.js";

export async function ingestTelemetry(
  projectId: string,
  ingestBody: ingestionDataInput,
) {
  await traceQueue.add(
    "ingest",
    {
      projectId,
      data: ingestBody,
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    },
  );
}
