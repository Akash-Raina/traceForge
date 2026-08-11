import { ingestionDataInput } from "../schema/ingestion.schema.js";
import { addToQueue } from "../utils/inMemoryQueue.js";

export async function ingestTelemetry(projectId: string, ingestBody: ingestionDataInput){
  addToQueue(projectId, ingestBody);
}
