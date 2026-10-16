import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema.ts";

const dbUrl = (typeof process !== "undefined" && process.env?.DATABASE_URL) 
  || "file:local.db";
const authToken = (typeof process !== "undefined" && process.env?.DATABASE_AUTH_TOKEN) 
  || undefined;

export const rawClient = createClient({
  url: dbUrl,
  authToken: authToken,
});

export const db = drizzle(rawClient, { schema });
