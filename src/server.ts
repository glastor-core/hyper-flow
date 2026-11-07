import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { db, rawClient, getEnv } from "./db/client.ts";
import { aiInferenceLogs } from "./db/schema.ts";
import { renderDashboardHtml } from "./views/dashboard.ts";
import { aiGateway } from "./ai/provider.ts";
import { apiKeyAuth } from "./middleware/auth.ts";
import { edgeRateLimiter } from "./middleware/rate-limit.ts";

const startTime = Date.now();

export function detectRuntime(): "bun" | "deno" | "cloudflare-worker" | "node" {
  if (typeof (globalThis as any).Deno !== "undefined") return "deno";
  if (typeof (globalThis as any).Bun !== "undefined") return "bun";
  if (typeof (globalThis as any).WebSocketPair !== "undefined") return "cloudflare-worker";
  return "node";
}

export const app = new OpenAPIHono();

// Security Middlewares & Headers with configurable CORS
const allowedOrigins = getEnv("ALLOWED_ORIGINS");
const corsOrigin = allowedOrigins
  ? allowedOrigins.split(",").map((o) => o.trim())
  : "*";

app.use("*", cors({ origin: corsOrigin }));
app.use(
  "*",
  secureHeaders({
    xFrameOptions: "SAMEORIGIN",
    xContentTypeOptions: "nosniff",
    referrerPolicy: "strict-origin-when-cross-origin",
  })
);

// Global Error Handler (Sanitizes stack traces in production to prevent CWE-209)
app.onError((err, c) => {
  const isProd = getEnv("NODE_ENV") === "production";
  if (isProd) {
    console.error(`[Unhandled Error] ${err.name}: ${err.message}`);
  } else {
    console.error(`[Unhandled Error] ${err.message}`, err.stack);
  }

  return c.json({
    error: isProd ? "Internal Server Error" : err.message,
    status: 500,
    timestamp: new Date().toISOString(),
  }, 500);
});

// ==========================================
// 1. Health & Readiness Routes (Liveness vs Readiness)
// ==========================================
const HealthResponseSchema = z.object({
  status: z.literal("healthy"),
  uptimeSeconds: z.number().openapi({ example: 42.5 }),
  runtime: z.string().openapi({ example: "deno" }),
  timestamp: z.string().openapi({ example: "2026-10-16T21:30:00.000Z" }),
  version: z.string().openapi({ example: "1.1.0" }),
});

const healthRoute = createRoute({
  method: "get",
  path: "/health",
  tags: ["System"],
  summary: "Liveness probe and runtime status",
  description: "Returns process health, uptime, and edge runtime executing this instance.",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: HealthResponseSchema,
        },
      },
      description: "Service process is healthy and responding",
    },
  },
});

app.openapi(healthRoute, (c) => {
  const uptime = (Date.now() - startTime) / 1000;
  return c.json({
    status: "healthy" as const,
    uptimeSeconds: Number(uptime.toFixed(2)),
    runtime: detectRuntime(),
    timestamp: new Date().toISOString(),
    version: "1.1.0",
  }, 200);
});

// Readiness Probe (Deep healthcheck verifying database connectivity)
const ReadinessResponseSchema = z.object({
  status: z.enum(["ready", "degraded"]),
  database: z.enum(["connected", "disconnected"]),
  uptimeSeconds: z.number().openapi({ example: 42.5 }),
  runtime: z.string().openapi({ example: "deno" }),
  timestamp: z.string(),
});

const readinessRoute = createRoute({
  method: "get",
  path: "/health/ready",
  tags: ["System"],
  summary: "Readiness probe with database connectivity check",
  description: "Checks if the Edge database connection is healthy and ready for queries.",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: ReadinessResponseSchema,
        },
      },
      description: "Service dependencies are healthy and ready to accept traffic",
    },
    503: {
      content: {
        "application/json": {
          schema: ReadinessResponseSchema,
        },
      },
      description: "Service is degraded due to dependency outage",
    },
  },
});

app.openapi(readinessRoute, async (c) => {
  const uptime = (Date.now() - startTime) / 1000;
  let dbConnected = false;

  try {
    await rawClient.execute("SELECT 1 AS ready");
    dbConnected = true;
  } catch (err: any) {
    console.error("[Readiness Check] Database ping failed:", err.message);
  }

  const statusCode = dbConnected ? 200 : 503;
  return c.json({
    status: dbConnected ? ("ready" as const) : ("degraded" as const),
    database: dbConnected ? ("connected" as const) : ("disconnected" as const),
    uptimeSeconds: Number(uptime.toFixed(2)),
    runtime: detectRuntime(),
    timestamp: new Date().toISOString(),
  }, statusCode);
});

// ==========================================
// 2. API Info Route
// ==========================================
const InfoResponseSchema = z.object({
  name: z.string().openapi({ example: "hyper-flow" }),
  description: z.string(),
  architecture: z.object({
    framework: z.string().openapi({ example: "Hono" }),
    testingRuntime: z.string().openapi({ example: "Bun" }),
    deploymentTarget: z.string().openapi({ example: "Deno Deploy" }),
    database: z.string().openapi({ example: "LibSQL / SQLite Edge" }),
  }),
  activeRuntime: z.string(),
  aiProvider: z.string().openapi({ example: "edge-synthetic" }),
});

const infoRoute = createRoute({
  method: "get",
  path: "/api/v1/info",
  tags: ["System"],
  summary: "Architecture and platform information",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: InfoResponseSchema,
        },
      },
      description: "Architecture information",
    },
  },
});

app.openapi(infoRoute, (c) => {
  return c.json({
    name: "hyper-flow",
    description: "Ultra-fast Edge AI API built with Hono, tested with Bun, and deployed to Deno Deploy",
    architecture: {
      framework: "Hono",
      testingRuntime: "Bun",
      deploymentTarget: "Deno Deploy",
      database: "LibSQL / SQLite Edge",
    },
    activeRuntime: detectRuntime(),
    aiProvider: aiGateway.getActiveProviderName(),
  }, 200);
});

// ==========================================
// 3. AI Inference Endpoint (Edge AI Gateway)
// ==========================================
const AiGenerateRequestSchema = z.object({
  prompt: z.string().min(1, "Prompt cannot be empty").openapi({ example: "Explain quantum computing in 1 sentence" }),
  topic: z.string().default("general").openapi({ example: "physics" }),
  temperature: z.number().min(0).max(2).default(0.7).openapi({ example: 0.7 }),
});

const AiGenerateResponseSchema = z.object({
  id: z.string().openapi({ example: "req_123456" }),
  prompt: z.string(),
  topic: z.string(),
  response: z.string().openapi({ example: "Quantum computing leverages qubits..." }),
  latencyMs: z.number().openapi({ example: 12 }),
  runtime: z.string().openapi({ example: "deno" }),
  provider: z.string().optional().openapi({ example: "groq" }),
  model: z.string().optional().openapi({ example: "llama-3.3-70b-versatile" }),
  timestamp: z.string(),
});

const aiGenerateRoute = createRoute({
  method: "post",
  path: "/api/v1/ai/generate",
  tags: ["AI"],
  summary: "Execute Edge AI inference",
  description: "Validates input prompt and returns structured Edge AI completion via active LLM provider or Edge synthetic fallback.",
  request: {
    body: {
      content: {
        "application/json": {
          schema: AiGenerateRequestSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: AiGenerateResponseSchema,
        },
      },
      description: "AI generation response",
    },
    400: {
      description: "Invalid input or empty prompt",
    },
    401: {
      description: "Unauthorized: Invalid or missing API Key",
    },
    429: {
      description: "Too Many Requests: Rate limit exceeded",
    },
  },
});

// Protect AI route with Rate Limiter and API Key auth
app.use("/api/v1/ai/*", edgeRateLimiter());
app.use("/api/v1/ai/*", apiKeyAuth());

app.openapi(aiGenerateRoute, async (c) => {
  const body = c.req.valid("json");
  const runtime = detectRuntime();

  // Execute inference via Edge AI Gateway (supports Groq, OpenAI, or Edge synthetic fallback)
  const aiResult = await aiGateway.generate(
    {
      prompt: body.prompt,
      topic: body.topic,
      temperature: body.temperature,
    },
    runtime
  );

  // Privacy & Data retention control: redact plain prompt/response if configured
  const shouldStoreContent = getEnv("STORE_PROMPTS_CONTENT") !== "false";
  const promptToStore = shouldStoreContent ? body.prompt : "[REDACTED_FOR_PRIVACY]";
  const responseToStore = shouldStoreContent ? aiResult.response : "[REDACTED_FOR_PRIVACY]";

  // Non-blocking telemetry log to Edge database
  try {
    await db.insert(aiInferenceLogs).values({
      id: aiResult.id,
      prompt: promptToStore,
      topic: aiResult.topic,
      response: responseToStore,
      latencyMs: aiResult.latencyMs,
      runtime: runtime,
      createdAt: aiResult.timestamp,
    }).catch(() => {
      // Graceful fallback if table is not yet created in memory
    });
  } catch {
    // Edge-resilient: Never fail client requests on background telemetry failure
  }

  return c.json(aiResult, 200);
});

// ==========================================
// 4. OpenAPI Specification & Interactive Documentation (Scalar)
// ==========================================
app.doc("/api/v1/openapi.json", {
  openapi: "3.1.0",
  info: {
    version: "1.1.0",
    title: "Hyper-Flow Edge API",
    description: "High-performance AI Edge API combining Bun, Deno Deploy, and Hono.",
  },
});

app.get(
  "/doc",
  apiReference({
    theme: "purple",
    pageTitle: "Hyper-Flow Edge API Documentation",
    spec: {
      url: "/api/v1/openapi.json",
    },
  })
);

// Serve interactive Web Dashboard on root
app.get("/", (c) => c.html(renderDashboardHtml()));

// ==========================================
// 5. Server Bootstrap (Multi-Runtime Compatible)
// ==========================================
const port = Number(getEnv("PORT") || 8000);

// If executing inside Deno runtime
if (typeof (globalThis as any).Deno !== "undefined" && (globalThis as any).Deno?.serve) {
  (globalThis as any).Deno.serve({ port }, app.fetch);
}

// Bun automatic entry point export
export default {
  port,
  fetch: app.fetch,
};
