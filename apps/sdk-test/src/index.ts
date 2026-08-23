import { TraceForge } from "@traceforge/sdk";
import "dotenv/config";

const traceforge = new TraceForge({
  apiKey: process.env.TRACEFORGE_API_KEY!,
  endpoint: process.env.TRACEFORGE_ENDPOINT!,
});

const trace = traceforge.startTrace("technical-support");

const retrieval = trace.startSpan("knowledge-retrieval", "RETRIEVAL");

retrieval.end({
  input: {
    query: "How do I reset my password?",
  },
  output: {
    documents: ["account-security-guide.pdf", "password-reset-guide.pdf"],
  },
});

const llm = trace.startSpan("llm-call", "LLM");

llm.end({
  input: {
    prompt: "How do I reset my password?",
  },
  output: {
    response:
      "Go to Settings, select Security, click Reset Password, and follow the instructions sent to your email.",
  },
  model: "test-model",
  provider: "test-provider",
  inputTokens: 22,
  outputTokens: 24,
  cost: 0.0025,
});

await trace.end();

console.log("Trace sent successfully");
