import { ingestionDataInput } from "../schema/ingestion.schema.js";

export type QueueItem = {
  projectId: string;
  data: ingestionDataInput;
};
