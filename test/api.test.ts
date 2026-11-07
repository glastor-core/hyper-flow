import { describe, expect, it } from "bun:test";
import { app } from "../src/server.ts";

describe("Hyper-Flow Edge API Endpoints", () => {
  it("GET /health returns 200 with runtime and uptime metadata", async () => {
    const res = await app.request("/health");
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.status).toBe("healthy");
    expect(typeof data.uptimeSeconds).toBe("number");
    expect(data.runtime).toBe("bun"); // Executed via bun:test
    expect(data.version).toBe("1.1.0");
    expect(data.timestamp).toBeDefined();
  });

  it("GET /health/ready returns 200 and confirms Edge database connectivity", async () => {
    const res = await app.request("/health/ready");
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.status).toBe("ready");
    expect(data.database).toBe("connected");
    expect(typeof data.uptimeSeconds).toBe("number");
  });

  it("GET /api/v1/info returns system architecture and active AI provider", async () => {
    const res = await app.request("/api/v1/info");
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.name).toBe("hyper-flow");
    expect(data.architecture.framework).toBe("Hono");
    expect(data.architecture.testingRuntime).toBe("Bun");
    expect(data.architecture.deploymentTarget).toBe("Deno Deploy");
    expect(data.aiProvider).toBeDefined();
  });

  it("POST /api/v1/ai/generate succeeds with valid payload and reports provider", async () => {
    const payload = {
      prompt: "Explain edge computing in one sentence",
      topic: "infrastructure",
      temperature: 0.5,
    };

    const res = await app.request("/api/v1/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.id).toBeDefined();
    expect(data.prompt).toBe(payload.prompt);
    expect(data.topic).toBe(payload.topic);
    expect(typeof data.latencyMs).toBe("number");
    expect(data.provider).toBeDefined();
    expect(data.model).toBeDefined();
    expect(data.response).toContain("infrastructure");
  });

  it("POST /api/v1/ai/generate rejects invalid/empty prompt with 400", async () => {
    const res = await app.request("/api/v1/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: "" }),
    });

    expect(res.status).toBe(400);
  });

  it("GET /api/v1/openapi.json returns valid OpenAPI 3.1 schema including readiness probe", async () => {
    const res = await app.request("/api/v1/openapi.json");
    expect(res.status).toBe(200);

    const spec = await res.json();
    expect(spec.openapi).toBe("3.1.0");
    expect(spec.paths["/health"]).toBeDefined();
    expect(spec.paths["/health/ready"]).toBeDefined();
    expect(spec.paths["/api/v1/ai/generate"]).toBeDefined();
  });

  it("GET / returns 200 and renders the interactive dashboard HTML", async () => {
    const res = await app.request("/");
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("Hyper-Flow");
    expect(html).toContain("Edge AI & Pipeline Control Center");
  });

  it("applies OWASP security headers and CORS", async () => {
    const res = await app.request("/health");
    expect(res.status).toBe(200);
    expect(res.headers.get("x-content-type-options")).toBe("nosniff");
    expect(res.headers.get("x-frame-options")).toBe("SAMEORIGIN");
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
  });

  it("enforces API Key protection when HYPERFLOW_API_KEY is configured", async () => {
    process.env.HYPERFLOW_API_KEY = "secret-test-key-123"; // gitleaks:allow

    // 1. Without credentials -> 401 Unauthorized
    const unauthorizedRes = await app.request("/api/v1/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: "Hello unauthorized" }),
    });
    expect(unauthorizedRes.status).toBe(401);

    // 2. With Bearer token -> 200 OK
    const authorizedRes = await app.request("/api/v1/ai/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer secret-test-key-123", // gitleaks:allow
      },
      body: JSON.stringify({ prompt: "Hello authorized" }),
    });
    expect(authorizedRes.status).toBe(200);

    // Clean up env
    delete process.env.HYPERFLOW_API_KEY;
  });
});
