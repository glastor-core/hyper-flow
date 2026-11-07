import type { MiddlewareHandler } from "hono";
import { getEnv } from "../db/client.ts";

export function apiKeyAuth(): MiddlewareHandler {
  return async (c, next) => {
    const configuredKey = getEnv("HYPERFLOW_API_KEY");

    // If no key is set, the API runs in open mode (useful for local dev and demo dashboards)
    if (!configuredKey) {
      return next();
    }

    const authHeader = c.req.header("Authorization");
    const customHeader = c.req.header("x-api-key");

    let providedKey: string | null = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      providedKey = authHeader.substring(7).trim();
    } else if (customHeader) {
      providedKey = customHeader.trim();
    }

    if (!providedKey || providedKey !== configuredKey) {
      return c.json(
        {
          error: "Unauthorized: Invalid or missing API Key",
          status: 401,
          timestamp: new Date().toISOString(),
        },
        401
      );
    }

    return next();
  };
}
