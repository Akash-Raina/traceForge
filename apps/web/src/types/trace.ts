export interface Trace {
  id: string;
  name: string;
  status: "RUNNING" | "SUCCESS" | "ERROR";
  startedAt: string;
  endedAt?: string;
}

export interface Span {
  id: string;
  parentSpanId: string | null;
  name: string;
  type: "AGENT" | "LLM" | "TOOL" | "RETRIEVAL" | "CUSTOM";
  status: "RUNNING" | "SUCCESS" | "ERROR";
  startedAt: string;
  endedAt?: string;
  input?: unknown;
  output?: unknown;
  error?: unknown;
  model?: string;
  provider?: string;
  inputTokens?: number;
  outputTokens?: number;
  cost?: number;
}

export interface TraceDetail extends Trace {
  spans: Span[];
}

export interface TracesResponse {
  success: boolean;
  traces: Trace[];
}

export interface TraceDetailResponse {
  success: boolean;
  trace: TraceDetail;
}
