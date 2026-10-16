import { rawClient } from "./client.ts";

export async function runMigrations() {
  console.log("⚡ Executing Edge Database migrations...");

  await rawClient.execute(`
    CREATE TABLE IF NOT EXISTS ai_inference_logs (
      id TEXT PRIMARY KEY,
      prompt TEXT NOT NULL,
      topic TEXT NOT NULL,
      response TEXT NOT NULL,
      latency_ms INTEGER NOT NULL,
      runtime TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  await rawClient.execute(`
    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL
    );
  `);

  console.log("✅ Edge Database migrations applied successfully!");
}

if (import.meta.main || (typeof process !== "undefined" && process.argv[1]?.endsWith("migrate.ts"))) {
  runMigrations()
    .then(() => {
      console.log("🚀 Migration process completed.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Migration failed:", err);
      process.exit(1);
    });
}
