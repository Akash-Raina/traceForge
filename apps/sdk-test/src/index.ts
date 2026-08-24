import { TraceForge } from "@traceforge/sdk";
import "dotenv/config";

const traceforge = new TraceForge({
  apiKey: process.env.TRACEFORGE_API_KEY!,
  endpoint: process.env.TRACEFORGE_ENDPOINT!,
});

const trace = traceforge.startTrace("order-support");

const retrieval = trace.startSpan(
  "order-history-search",
  "RETRIEVAL",
);

retrieval.end({
  input: {
    query: "Find the latest order for customer #48291",
  },
  output: {
    documents: [
      "order-98231.json",
      "customer-48291.json",
    ],
  },
});

const tool = trace.startSpan(
  "order-status-api",
  "TOOL",
);

tool.end({
  input: {
    orderId: "ORD-98231",
  },
  output: {
    orderId: "ORD-98231",
    status: "SHIPPED",
    estimatedDelivery: "2026-08-27",
    carrier: "Delivery",
  },
});

const llm = trace.startSpan(
  "support-response",
  "LLM",
);

llm.end({
  input: {
    customerMessage:
      "Where is my order? I placed it three days ago.",
    orderStatus: "SHIPPED",
    estimatedDelivery: "2026-08-27",
  },
  output: {
    response:
      "Your order has been shipped and is currently in transit. It is expected to arrive by August 27, 2026.",
  },
  model: "gemini-3.6-flash",
  provider: "gemini",
  inputTokens: 118,
  outputTokens: 67,
  cost: 0.0041,
});

await trace.end();

console.log("Order-support trace sent successfully");
