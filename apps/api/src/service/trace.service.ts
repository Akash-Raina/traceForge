import { prisma } from "../lib/prisma.js";

export async function getTraces(projectId: string) {
  const traces = await prisma.trace.findMany({
    where: {
      projectId,
    },
    orderBy: {
      startedAt: "desc",
    },
  });
  return traces;
}

export async function getTrace(projectId: string, traceId: string) {
  const trace = await prisma.trace.findFirst({
    where: {
      id: traceId,
      projectId,
    },
    include: {
      spans: true,
      evaluations: true
    },
  });

  return trace;
}
