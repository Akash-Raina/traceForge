import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import { prisma } from "../lib/prisma";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function evaluateWithGemini(
  input: unknown,
  output: unknown,
  criteria: string,
) {
  const prompt = `
    You are evaluating an AI response.

    Evaluation criteria:
    ${criteria}

    Input:
    ${JSON.stringify(input)}

    Output:
    ${JSON.stringify(output)}

    Return a score from 0 to 1 and a concise reason.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          score: {
            type: "number",
          },
          reason: {
            type: "string",
          },
        },
        required: ["score", "reason"],
      },
    },
  });

  return JSON.parse(response.text ?? "{}");
}

export async function evaluateTrace(traceId: string) {
  const trace = await prisma.trace.findUnique({
    where: { id: traceId },
    include: {
      Span: true,
    },
  });

  if (!trace) {
    throw new Error("Trace not found");
  }

  // Find LLM span
  const llmSpans = trace.Span.filter((s) => s.type === "LLM");
  // get the last llm span
  const finalSpan = [...llmSpans].sort(
    (a, b) =>
      new Date(b.endedAt ?? 0).getTime() - new Date(a.endedAt ?? 0).getTime(),
  )[0];
  //check if finalSpan has input and output value present
  if (!finalSpan) {
    throw new Error("No LLM span found");
  }

  if (finalSpan.input != null && finalSpan.output != null) {
    const response = await evaluateWithGemini(
      finalSpan.input,
      finalSpan.output,
      "Evaluate the correctness of the answer.",
    );

    // Save Evaluation
    await prisma.evaluation.create({
      data: {
        traceId: trace.id,
        spanId: finalSpan.id,
        name: "answer-correctness",
        score: response.score,
        reason: response.reason,
        provider: "gemini",
        model: "gemini-3.6-flash",
      },
    });
  }
}
