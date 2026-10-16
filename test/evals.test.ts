import { describe, expect, it } from "bun:test";
import { app } from "../src/server.ts";
import { z } from "zod";

const ExpectedAiOutputSchema = z.object({
  id: z.string().startsWith("ai_"),
  prompt: z.string().min(1),
  topic: z.string(),
  response: z.string().min(10),
  latencyMs: z.number().max(2000), // Latency budget: must respond in under 2000ms
  runtime: z.string(),
  timestamp: z.string().datetime(),
});

describe("Edge AI Prompt & Schema Regression Evals", () => {
  const testPrompts = [
    { prompt: "Summarize quantum entanglement", topic: "quantum-physics" },
    { prompt: "Write a high-converting email subject line", topic: "marketing" },
    { prompt: "Draft a SQL query to find top 5 users by purchase volume", topic: "database" },
  ];

  for (const { prompt, topic } of testPrompts) {
    it(`evaluates prompt schema conformity for: [${topic}]`, async () => {
      const res = await app.request("/api/v1/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, topic }),
      });

      expect(res.status).toBe(200);
      const json = await res.json();

      // Validate output strictly adheres to contract schema
      const parseResult = ExpectedAiOutputSchema.safeParse(json);
      expect(parseResult.success).toBe(true);

      // Verify prompt regression guardrails
      expect(json.prompt).toBe(prompt);
      expect(json.topic).toBe(topic);
      expect(json.response.length).toBeGreaterThan(15);
    });
  }

  it("enforces edge latency budget (<= 150ms for local edge simulation)", async () => {
    const start = performance.now();
    const res = await app.request("/api/v1/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: "Benchmark latency", topic: "performance" }),
    });
    const duration = performance.now() - start;

    expect(res.status).toBe(200);
    expect(duration).toBeLessThan(150);
  });
});
