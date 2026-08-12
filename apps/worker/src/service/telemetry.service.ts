import { ingestionDataInput } from "../../../api/src/schema/ingestion.schema";
import { prisma } from "../lib/prisma";
import { toPrismaJson } from "../utils/toPrismaJson";

export async function addTelemetryToDB(
  projectId: string,
  data: ingestionDataInput,
) {
  const { trace, spans } = data;

  await prisma.$transaction(async (txn) => {
    await txn.trace.create({
      data: {
        id: trace.id,
        name: trace.name,
        projectId,
        startedAt: trace.startedAt,
        endedAt: trace.endedAt,
        status: trace.status,
      },
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
    });
  });
}
