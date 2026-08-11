import { z } from "zod";

export const apiKeyHeaderSchema = z.object({
  "x-api-key": z
    .string()
    .min(1, "API key is required"),
});
