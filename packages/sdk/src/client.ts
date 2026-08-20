import { Trace } from "./trace.js";

export interface TraceForgeOptions {
  apiKey: string;
  endpoint: string;
}

export class TraceForge {
  constructor(private options: TraceForgeOptions) {}

  startTrace(name: string) {
    return new Trace(name, async (data) => {
      const response = await fetch(
        `${this.options.endpoint}/ingest`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": this.options.apiKey,
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        throw new Error(
          `TraceForge ingestion failed: ${response.status}`,
        );
      }
    });
  }
}
