import { type ingestionDataInput } from "@traceforge/shared";
import { prisma } from "../lib/prisma.js";
import { toPrismaJson } from "../utils/toPrismaJson.js";

export async function addTelemetryToDB(
  projectId: string,
  data: ingestionDataInput,
) {
  const { trace, spans } = data;

  const storedTrace = await prisma.$transaction(async (txn) => {
    const traceData = await txn.trace.upsert({
      where: {
        id: trace.id,
      },

      create: {
        id: trace.id,
        name: trace.name,
        projectId,
        startedAt: trace.startedAt,
        endedAt: trace.endedAt,
        status: trace.status,
      },

      update: {},
    });
    await txn.span.createMany({
      data: spans.map((span) => ({
        id: span.id,
        traceId: trace.id,
        parentSpanId: span.parentSpanId,
        name: span.name,
        type: span.type,
        status: span.status,
        startedAt: span.startedAt,
        endedAt: span.endedAt,
        input: toPrismaJson(span.input),
        output: toPrismaJson(span.output),
        error: toPrismaJson(span.error),
        model: span.model,
        provider: span.provider,
        inputTokens: span.inputTokens,
        outputTokens: span.outputTokens,
        cost: span.cost,
      })),
      skipDuplicates: true,
    });
    return traceData;
  });

  return storedTrace;
}
