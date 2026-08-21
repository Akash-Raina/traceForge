import type { JsonValue } from "@traceforge/shared";

export type SpanType = "AGENT" | "LLM" | "TOOL" | "RETRIEVAL" | "CUSTOM";

export class Span {
  public readonly id: string;
  public readonly startedAt: Date;

  private endedAt?: Date;
  private status: "RUNNING" | "SUCCESS" | "ERROR" = "RUNNING";

  private input?: JsonValue;
  private output?: JsonValue;
  private error?: JsonValue;

  private model?: string;
  private provider?: string;
  private inputTokens?: number;
  private outputTokens?: number;
  private cost?: number;

  constructor(
    public readonly name: string,
    public readonly type: SpanType,
    private readonly parentSpanId?: string,
  ) {
    this.id = crypto.randomUUID();
    this.startedAt = new Date();
  }

  startSpan(name: string, type: SpanType){
    return new Span(name, type, this.id);
  }

  end(data?: {
    input?: JsonValue;
    output?: JsonValue;
    error?: JsonValue;
    model?: string;
    provider?: string;
    inputTokens?: number;
    outputTokens?: number;
    cost?: number;
    status?: "SUCCESS" | "ERROR";
  }) {
    this.endedAt = new Date();

    this.input = data?.input;
    this.output = data?.output;
    this.error = data?.error;

    this.model = data?.model;
    this.provider = data?.provider;
    this.inputTokens = data?.inputTokens;
    this.outputTokens = data?.outputTokens;
    this.cost = data?.cost;

    this.status = data?.status ?? "SUCCESS";
  }

  toJSON() {
    return {
      id: this.id,
      parentSpanId: this.parentSpanId ?? null,
      name: this.name,
      type: this.type,
      status: this.status,
      startedAt: this.startedAt,
      endedAt: this.endedAt,
      input: this.input,
      output: this.output,
      error: this.error,
      model: this.model,
      provider: this.provider,
      inputTokens: this.inputTokens,
      outputTokens: this.outputTokens,
      cost: this.cost,
    };
  }
}
