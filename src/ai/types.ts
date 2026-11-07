export interface AiGenerationOptions {
  prompt: string;
  topic?: string;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}

export type AiProviderName = "groq" | "openai" | "custom" | "edge-synthetic";

export interface AiGenerationResult {
  id: string;
  prompt: string;
  topic: string;
  response: string;
  latencyMs: number;
  runtime: string;
  provider: AiProviderName;
  model: string;
  timestamp: string;
}

export interface AiProvider {
  readonly name: AiProviderName;
  isAvailable(): boolean;
  generate(options: AiGenerationOptions, runtime: string): Promise<AiGenerationResult>;
}
