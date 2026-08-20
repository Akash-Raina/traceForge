import { TraceForge } from "@traceforge/sdk";

const traceforge = new TraceForge({
  apiKey:
    "tf_live_3ba210af9380d852c90073e503d823a3b60d168ae2b11ea7b5f21017a061d1de",
  endpoint: "http://localhost:8000/api/v1",
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
