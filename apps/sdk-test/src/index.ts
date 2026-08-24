import { TraceForge } from "@traceforge/sdk";
import "dotenv/config";

const traceforge = new TraceForge({
  apiKey: process.env.TRACEFORGE_API_KEY!,
  endpoint: process.env.TRACEFORGE_ENDPOINT!,
});

const trace = traceforge.startTrace("code-generation");

const retrieval = trace.startSpan("documentation-search", "RETRIEVAL");

retrieval.end({
  input: {
    query: "How do I implement JWT authentication in Express?",
  },
  output: {
    documents: [
      "express-authentication.md",
      "jwt-best-practices.md",
      "auth-middleware.md",
    ],
  },
});

const llm = trace.startSpan("code-generation", "LLM");

llm.end({
  input: {
    prompt: "Create an Express middleware that validates a JWT access token.",
  },
  output: {
    response: `const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  // validate token...
  next();
};`,
  },
  model: "gemini-3.6-flash",
  provider: "gemini",
  inputTokens: 145,
  outputTokens: 312,
  cost: 0.0087,
});

await trace.end();

console.log("Trace sent successfully");
