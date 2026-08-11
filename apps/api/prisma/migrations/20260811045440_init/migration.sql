-- CreateEnum
CREATE TYPE "TraceStatus" AS ENUM ('RUNNING', 'SUCCESS', 'ERROR');

-- CreateEnum
CREATE TYPE "SpanStatus" AS ENUM ('RUNNING', 'SUCCESS', 'ERROR');

-- CreateEnum
CREATE TYPE "SpanType" AS ENUM ('AGENT', 'LLM', 'TOOL', 'RETRIEVAL', 'CUSTOM');

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "apiKeyHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trace" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "status" "TraceStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Span" (
    "id" TEXT NOT NULL,
    "traceId" TEXT NOT NULL,
    "parentSpanId" TEXT,
    "name" TEXT NOT NULL,
    "type" "SpanType" NOT NULL,
    "status" "SpanStatus" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "input" JSONB,
    "output" JSONB,
    "error" JSONB,
    "model" TEXT,
    "provider" TEXT,
    "inputTokens" INTEGER,
    "outputTokens" INTEGER,
    "cost" DECIMAL(12,8),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Span_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_apiKeyHash_key" ON "Project"("apiKeyHash");

-- CreateIndex
CREATE INDEX "Trace_projectId_idx" ON "Trace"("projectId");

-- CreateIndex
CREATE INDEX "Trace_projectId_startedAt_idx" ON "Trace"("projectId", "startedAt");

-- CreateIndex
CREATE INDEX "Span_traceId_idx" ON "Span"("traceId");

-- CreateIndex
CREATE INDEX "Span_traceId_startedAt_idx" ON "Span"("traceId", "startedAt");

-- CreateIndex
CREATE INDEX "Span_parentSpanId_idx" ON "Span"("parentSpanId");

-- AddForeignKey
ALTER TABLE "Trace" ADD CONSTRAINT "Trace_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Span" ADD CONSTRAINT "Span_traceId_fkey" FOREIGN KEY ("traceId") REFERENCES "Trace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Span" ADD CONSTRAINT "Span_parentSpanId_fkey" FOREIGN KEY ("parentSpanId") REFERENCES "Span"("id") ON DELETE SET NULL ON UPDATE CASCADE;
