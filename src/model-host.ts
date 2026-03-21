/** Echo Prime SDK v3.0 — Model Hosting module
 * Custom LoRA model inference, adapter management, inference routing.
 * Zero external dependencies.
 */
import { EchoHttpClient, type EchoClientConfig } from './client.js';

export interface ModelAdapter {
  id: string;
  name: string;
  base_model: string;
  adapter_size_mb: number;
  domain: string;
  loaded: boolean;
  requests_total: number;
  avg_latency_ms: number;
}

export interface InferenceRequest {
  model: string;
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
}

export interface InferenceResponse {
  id: string;
  model: string;
  choices: Array<{
    message: { role: string; content: string };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  latency_ms: number;
}

export interface ModelStats {
  models_available: number;
  models_loaded: number;
  total_requests: number;
  avg_latency_ms: number;
  vram_used_gb: number;
  vram_total_gb: number;
}

export class EchoModelHost {
  private client: EchoHttpClient;

  constructor(config: EchoClientConfig) {
    this.client = new EchoHttpClient(config);
  }

  /** Run inference on a model (OpenAI-compatible) */
  async chat(request: InferenceRequest): Promise<InferenceResponse> {
    return this.client.request<InferenceResponse>('/models/chat/completions', {
      method: 'POST',
      body: request,
    });
  }

  /** List available models */
  async list(): Promise<ModelAdapter[]> {
    return this.client.request<ModelAdapter[]>('/models/list');
  }

  /** Get model info */
  async info(modelId: string): Promise<ModelAdapter> {
    return this.client.request<ModelAdapter>('/models/info', {
      params: { model: modelId },
    });
  }

  /** Switch active model/adapter */
  async switchModel(modelId: string): Promise<{ success: boolean; model: string }> {
    return this.client.request('/models/switch', {
      method: 'POST',
      body: { model: modelId },
    });
  }

  /** Get model hosting stats */
  async stats(): Promise<ModelStats> {
    return this.client.request<ModelStats>('/models/stats');
  }

  /** Health check */
  async health(): Promise<{ status: string; models: number; vram_used_gb: number }> {
    return this.client.request('/models/health');
  }
}
