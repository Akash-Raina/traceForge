import { traceQueue } from "../queue/trace.queue.js";
import { ingestionDataInput } from "../schema/ingestion.schema.js";

export async function ingestTelemetry(projectId: string, ingestBody: ingestionDataInput){
  await traceQueue.add("ingest", {
    projectId,
    data: ingestBody
  })
}
