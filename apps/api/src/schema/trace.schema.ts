import * as z from "zod";

export const traceParamsSchema = z.object({
  traceId: z.string().min(1),
});
