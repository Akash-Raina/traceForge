import { traceQueue } from "../queue/trace.queue.js";
import { ingestionDataInput } from "@traceforge/shared";

export async function ingestTelemetry(projectId: string, ingestBody: ingestionDataInput){
  await traceQueue.add("ingest", {
    projectId,
    data: ingestBody
  })
}
