import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const aiInferenceLogs = sqliteTable("ai_inference_logs", {
  id: text("id").primaryKey(),
  prompt: text("prompt").notNull(),
  topic: text("topic").notNull(),
  response: text("response").notNull(),
  latencyMs: integer("latency_ms").notNull(),
  runtime: text("runtime").notNull(),
  createdAt: text("created_at").notNull(),
});

export const items = sqliteTable("items", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  status: text("status").notNull().default("active"),
  createdAt: text("created_at").notNull(),
});

export type AiInferenceLog = typeof aiInferenceLogs.$inferSelect;
export type Item = typeof items.$inferSelect;
