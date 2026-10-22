import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema.ts";

export function getEnv(key: string): string | undefined {
  if (typeof process !== "undefined" && process.env?.[key]) {
    return process.env[key];
  }
  if (typeof (globalThis as any).Deno !== "undefined" && typeof (globalThis as any).Deno?.env?.get === "function") {
    return (globalThis as any).Deno.env.get(key);
  }
  return undefined;
}

const dbUrl = getEnv("DATABASE_URL") || "file:local.db";
const authToken = getEnv("DATABASE_AUTH_TOKEN") || undefined;

export const rawClient = createClient({
  url: dbUrl,
  authToken: authToken,
});

export const db = drizzle(rawClient, { schema });
