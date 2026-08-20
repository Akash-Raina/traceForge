import { Span, type SpanType } from "./span.js";

export class Trace {
  public readonly id: string;
  public readonly startedAt: Date;

  private endedAt?: Date;
  private status: "RUNNING" | "SUCCESS" | "ERROR" = "RUNNING";
  private spans: Span[] = [];

  constructor(
    public readonly name: string,
    private readonly onEnd: (data: ReturnType<Trace["toJSON"]>) => Promise<void>,
  ) {
    this.id = crypto.randomUUID();
    this.startedAt = new Date();
  }

  startSpan(
    name: string,
    type: SpanType,
    parentSpanId?: string,
  ) {
    const span = new Span(name, type, parentSpanId);

    this.spans.push(span);

    return span;
  }

  async end(status: "SUCCESS" | "ERROR" = "SUCCESS") {
    this.endedAt = new Date();
    this.status = status;

    await this.onEnd(this.toJSON());
  }

  toJSON() {
    return {
      trace: {
        id: this.id,
        name: this.name,
        startedAt: this.startedAt,
        endedAt: this.endedAt,
        status: this.status,
      },
      spans: this.spans.map((span) => span.toJSON()),
    };
  }
}
