import * as z from "zod";

const spanSchema = z.object({
  id: z.string(),
  parentSpanId: z.string().nullable().optional(),

  name: z.string(),
  type: z.enum(["AGENT", "LLM", "TOOL", "RETRIEVAL", "CUSTOM"]),

  status: z.enum(["RUNNING", "SUCCESS", "ERROR"]),

  startedAt: z.coerce.date(),
  endedAt: z.coerce.date().optional(),

  input: z.unknown().optional(),
  output: z.unknown().optional(),
  error: z.unknown().optional(),

  model: z.string().optional(),
  provider: z.string().optional(),

  inputTokens: z.number().int().nonnegative().optional(),
  outputTokens: z.number().int().nonnegative().optional(),

  cost: z.number().nonnegative().optional(),
});

const traceSchema = z.object({
  id: z.string(),
  name: z.string(),

  startedAt: z.coerce.date(),
  endedAt: z.coerce.date().optional(),

  status: z.enum(["RUNNING", "SUCCESS", "ERROR"]),
});

export const ingestionSchema = z.object({
  trace: traceSchema,
  spans: z.array(spanSchema).min(1),
});

export type ingestionDataInput = z.infer<typeof ingestionSchema>;
