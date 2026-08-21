export interface Trace {
  id: string;
  name: string;
  status: "RUNNING" | "SUCCESS" | "ERROR";
  startedAt: string;
  endedAt?: string;
}
