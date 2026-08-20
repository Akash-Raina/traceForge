import { TraceForge } from "@traceforge/sdk";
import "dotenv/config";

const traceforge = new TraceForge({
  apiKey: process.env.TRACEFORGE_API_KEY!,
  endpoint: process.env.TRACEFORGE_ENDPOINT!,
});

const trace = traceforge.startTrace("customer-support");

const retrieval = trace.startSpan("document-retrieval", "RETRIEVAL");

retrieval.end({
  input: {
    query: "What is the refund policy?",
  },
  output: {
    documents: ["refund-policy.pdf"],
  },
});

const llm = trace.startSpan("llm-call", "LLM");

llm.end({
  input: {
    prompt: "What is the refund policy?",
  },
  output: {
    response: "Customers can request a refund within 30 days.",
  },
  model: "test-model",
  provider: "test-provider",
  inputTokens: 20,
  outputTokens: 12,
  cost: 0.002,
});

await trace.end();

console.log("Trace sent successfully");
