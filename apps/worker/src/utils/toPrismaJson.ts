import { JsonValue } from "@traceforge/shared";
import { Prisma } from "../generated/prisma/client.js";

export function toPrismaJson(value: JsonValue | undefined) {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return Prisma.JsonNull;
  }

  return value;
}
