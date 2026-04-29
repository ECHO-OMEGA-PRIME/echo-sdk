/** Echo Prime SDK v3.2 — LLM module
 * Unified interface for LLM completions across 29+ providers.
 * Supports streaming, model selection, and provider status.
 * Zero external dependencies.
 */
import { EchoHttpClient, type EchoClientConfig } from './client.js';

// ── Public interfaces ────────────────────────────────────────────────────────

/** Configuration for the LLMClient */
export interface LLMConfig {
  /** SDK Gateway base URL. Defaults to https://echo-sdk-gateway.bmcii1976.workers.dev */
  baseUrl?: string;
  /** Echo API key for authentication */
  apiKey: string;
  /** Default model to use when not specified per-request */
  defaultModel?: string;
}

/** Request payload for a completion */
export interface CompletionRequest {
  /** The prompt text to complete */
  prompt: string;
  /** Model identifier (e.g. 'claude-opus-4-20250514', 'gpt-4o'). Overrides defaultModel. */
  model?: string;
  /** Maximum tokens to generate */
  max_tokens?: number;
  /** Whether to stream the response token by token */
  stream?: boolean;
  /** System prompt / instruction */
  system?: string;
  /** Sampling temperature (0.0 - 2.0) */
  temperature?: number;
}

/** Response from a completion request */
export interface CompletionResponse {
  /** Generated text content */
  content: string;
  /** Model that produced the response */
  model: string;
  /** Token usage statistics */
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  /** End-to-end latency in milliseconds */
  latency_ms: number;
}

/** Information about an available model */
export interface ModelInfo {
  /** Unique model identifier */
  id: string;
  /** Human-readable model name */
  name: string;
  /** Provider name (e.g. 'anthropic', 'openai', 'groq') */
  provider: string;
  /** Maximum context window in tokens */
  max_tokens: number;
  /** List of capabilities (e.g. ['chat', 'code', 'vision', 'function_calling']) */
  capabilities: string[];
}

// ── Client implementation ────────────────────────────────────────────────────

/**
 * SDK client for LLM operations — completions, streaming, model discovery.
 * Routes through the SDK Gateway's AI Orchestrator (29+ LLM providers).
 *
 * @example
 * ```ts
 * const llm = new LLMClient({ apiKey: 'my-key', defaultModel: 'claude-opus-4-20250514' });
 *
 * // Simple completion
 * const resp = await llm.claude('Explain quantum computing in 3 sentences');
 *
 * // Streaming
 * for await (const chunk of llm.stream({ prompt: 'Write a poem about AI' })) {
 *   process.stdout.write(chunk);
 * }
 *
 * // List available models
 * const models = await llm.models();
 * ```
 */
export class LLMClient {
  private client: EchoHttpClient;
  private defaultModel: string;
  private baseUrl: string;
  private apiKey: string;

  constructor(config: LLMConfig) {
    const gatewayUrl = config.baseUrl || 'https://echo-sdk-gateway.bmcii1976.workers.dev';
    const clientConfig: EchoClientConfig = {
      apiKey: config.apiKey,
      gatewayUrl,
    };
    this.client = new EchoHttpClient(clientConfig);
    this.defaultModel = config.defaultModel || 'claude-opus-4-20250514';
    this.baseUrl = gatewayUrl.replace(/\/+$/, '');
    this.apiKey = config.apiKey;
  }

  /**
   * Send a prompt to Claude (convenience method).
   * Uses the Anthropic Claude model by default.
   * @param prompt - The text prompt
   * @param options - Optional overrides for model, temperature, max_tokens, etc.
   * @returns Completion response with content, usage, and latency
   */
  async claude(prompt: string, options?: Partial<CompletionRequest>): Promise<CompletionResponse> {
    return this.complete({
      prompt,
      model: options?.model || 'claude-opus-4-20250514',
      ...options,
    });
  }

  /**
   * Send a completion request to any supported model.
   * @param request - Full completion request with prompt, model, and options
   * @returns Completion response with content, usage, and latency
   */
  async complete(request: CompletionRequest): Promise<CompletionResponse> {
    const body: Record<string, unknown> = {
      prompt: request.prompt,
      model: request.model || this.defaultModel,
    };
    if (request.max_tokens !== undefined) body.max_tokens = request.max_tokens;
    if (request.system !== undefined) body.system = request.system;
    if (request.temperature !== undefined) body.temperature = request.temperature;
    // Force stream=false for non-streaming completions
    body.stream = false;

    return this.client.request<CompletionResponse>('/llm/complete', {
      method: 'POST',
      body,
    });
  }

  /**
   * Stream a completion response token by token.
   * Yields individual text chunks as they arrive from the model.
   *
   * @param request - Completion request (stream flag is set automatically)
   * @yields Individual text chunks as strings
   *
   * @example
   * ```ts
   * for await (const chunk of llm.stream({ prompt: 'Tell me a story' })) {
   *   process.stdout.write(chunk);
   * }
   * ```
   */
  async *stream(request: CompletionRequest): AsyncGenerator<string> {
    const body: Record<string, unknown> = {
      prompt: request.prompt,
      model: request.model || this.defaultModel,
      stream: true,
    };
    if (request.max_tokens !== undefined) body.max_tokens = request.max_tokens;
    if (request.system !== undefined) body.system = request.system;
    if (request.temperature !== undefined) body.temperature = request.temperature;

    const url = `${this.baseUrl}/llm/complete`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 120_000); // 2 min timeout for streaming

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'X-Echo-API-Key': this.apiKey,
          'Content-Type': 'application/json',
          'X-SDK-Version': '3.0.0',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!response.ok) {
        const text = await response.text();
        let errorMsg = `HTTP ${response.status}`;
        try {
          const json = JSON.parse(text);
          if (json.error?.message) errorMsg = json.error.message;
        } catch {
          // Use default error message
        }
        throw new Error(`LLM stream error: ${errorMsg}`);
      }

      if (!response.body) {
        throw new Error('LLM stream error: Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value, { stream: true });

          // Parse SSE format: lines starting with "data: "
          const lines = text.split('\n');
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed === 'data: [DONE]') continue;

            if (trimmed.startsWith('data: ')) {
              const jsonStr = trimmed.slice(6);
              try {
                const parsed = JSON.parse(jsonStr);
                if (parsed.content) {
                  yield parsed.content;
                } else if (parsed.text) {
                  yield parsed.text;
                } else if (typeof parsed === 'string') {
                  yield parsed;
                }
              } catch {
                // Non-JSON data line — yield as raw text
                yield jsonStr;
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * List all available LLM models across all providers.
   * @returns Array of model information objects
   */
  async models(): Promise<ModelInfo[]> {
    return this.client.request<ModelInfo[]>('/llm/models');
  }

  /**
   * Get health status of LLM providers.
   * @returns Health status with per-provider availability
   */
  async status(): Promise<{ healthy: boolean; providers: Record<string, string> }> {
    return this.client.request<{ healthy: boolean; providers: Record<string, string> }>('/llm/status');
  }
}

export { LLMClient as default };
