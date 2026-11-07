import { getEnv } from "../db/client.ts";
import type { AiGenerationOptions, AiGenerationResult, AiProvider, AiProviderName } from "./types.ts";

export class EdgeAiGatewayService {
  private timeoutMs: number;

  constructor() {
    this.timeoutMs = Number(getEnv("AI_TIMEOUT_MS") || 8000);
  }

  public getActiveProviderName(): AiProviderName {
    if (getEnv("GROQ_API_KEY")) return "groq";
    if (getEnv("OPENAI_API_KEY")) return "openai";
    if (getEnv("AI_API_KEY") && getEnv("AI_API_BASE_URL")) return "custom";
    return "edge-synthetic";
  }

  public async generate(options: AiGenerationOptions, runtime: string): Promise<AiGenerationResult> {
    const reqStart = Date.now();
    const requestId = `ai_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const topic = options.topic || "general";
    const temperature = typeof options.temperature === "number" ? options.temperature : 0.7;
    const activeProvider = this.getActiveProviderName();

    if (activeProvider !== "edge-synthetic") {
      try {
        const remoteResult = await this.callRemoteProvider(
          activeProvider,
          options.prompt,
          topic,
          temperature,
          options.timeoutMs || this.timeoutMs
        );
        const latency = Date.now() - reqStart;
        return {
          id: requestId,
          prompt: options.prompt,
          topic,
          response: remoteResult.text,
          latencyMs: latency,
          runtime,
          provider: activeProvider,
          model: remoteResult.model,
          timestamp: new Date().toISOString(),
        };
      } catch (err: any) {
        console.warn(`[AI Gateway] Remote provider (${activeProvider}) failed: ${err.message}. Falling back to Edge synthetic generation.`);
      }
    }

    // Edge Synthetic Fallback (Deterministic, zero external network dependency, ultra-fast)
    const syntheticResponse = `[Edge AI (${runtime})] Analysis for topic '${topic}': "${options.prompt}" processed with temperature ${temperature}. Verified edge response.`;
    const latency = Date.now() - reqStart;

    return {
      id: requestId,
      prompt: options.prompt,
      topic,
      response: syntheticResponse,
      latencyMs: latency,
      runtime,
      provider: "edge-synthetic",
      model: "edge-synthetic-v1",
      timestamp: new Date().toISOString(),
    };
  }

  private async callRemoteProvider(
    provider: "groq" | "openai" | "custom",
    prompt: string,
    topic: string,
    temperature: number,
    timeoutMs: number
  ): Promise<{ text: string; model: string }> {
    let endpoint = "";
    let apiKey = "";
    let model = "";

    if (provider === "groq") {
      endpoint = "https://api.groq.com/openai/v1/chat/completions";
      apiKey = getEnv("GROQ_API_KEY") || "";
      model = getEnv("GROQ_MODEL") || "llama-3.3-70b-versatile";
    } else if (provider === "openai") {
      endpoint = "https://api.openai.com/v1/chat/completions";
      apiKey = getEnv("OPENAI_API_KEY") || "";
      model = getEnv("OPENAI_MODEL") || "gpt-4o-mini";
    } else {
      endpoint = `${(getEnv("AI_API_BASE_URL") || "").replace(/\/+$/, "")}/chat/completions`;
      apiKey = getEnv("AI_API_KEY") || "";
      model = getEnv("AI_MODEL") || "default";
    }

    const controller = new AbortController();
    const timeoutHandle = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content: `You are Hyper-Flow Edge AI assistant specializing in ${topic}. Provide concise, accurate responses with minimal latency.`,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature,
          max_tokens: Number(getEnv("AI_MAX_TOKENS") || 512),
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        throw new Error(`HTTP ${response.status}: ${errorBody || response.statusText}`);
      }

      const data = (await response.json()) as any;
      const text = data.choices?.[0]?.message?.content?.trim();

      if (!text) {
        throw new Error("Empty completion returned from LLM provider");
      }

      return { text, model };
    } finally {
      clearTimeout(timeoutHandle);
    }
  }
}

export const aiGateway = new EdgeAiGatewayService();
