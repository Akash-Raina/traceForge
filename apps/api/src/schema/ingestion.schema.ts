import * as z from "zod";

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

const jsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonValueSchema),
    z.record(z.string(), jsonValueSchema),
  ]),
);

const spanSchema = z.object({
  id: z.string(),
  parentSpanId: z.string().nullable().optional(),

  name: z.string(),
  type: z.enum(["AGENT", "LLM", "TOOL", "RETRIEVAL", "CUSTOM"]),

  status: z.enum(["RUNNING", "SUCCESS", "ERROR"]),

  startedAt: z.coerce.date(),
  endedAt: z.coerce.date().optional(),

  input: jsonValueSchema.optional(),
  output: jsonValueSchema.optional(),
  error: jsonValueSchema.optional(),

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
