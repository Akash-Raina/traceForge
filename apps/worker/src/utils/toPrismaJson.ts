import { Prisma } from "../generated/prisma/client.js";
import { JsonValue } from "../../../api/src/schema/ingestion.schema.js";

export function toPrismaJson(value: JsonValue | undefined) {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return Prisma.JsonNull;
  }

  return value;
}
