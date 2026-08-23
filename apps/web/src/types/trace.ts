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

export interface Evaluation {
  id: string;
  traceId: string;
  spanId?: string | null;
  name: string;
  score: number;
  reason: string;
  provider: string;
  model: string;
  createdAt: string;
}

export interface TraceDetail extends Trace {
  spans: Span[];
  evaluations: Evaluation[];
}
