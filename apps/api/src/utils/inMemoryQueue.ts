import { ingestionDataInput } from "../schema/ingestion.schema.js";
import { QueueItem } from "../types/queue.type.js";

let queue: QueueItem[] = []

export function addToQueue(projectId: string, data: ingestionDataInput){
  queue.push({data, projectId})
}

