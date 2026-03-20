/** Echo Prime SDK v3.0 — HTTP Client with retry, envelope unwrapping, and error handling */
import { ApiEnvelope, EchoConfig, EchoError } from './types.js';

const DEFAULT_GATEWAY = 'https://echo-sdk-gateway.bmcii1976.workers.dev';
const DEFAULT_TIMEOUT = 30000;
const DEFAULT_RETRIES = 2;

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, unknown>;
  params?: Record<string, string>;
  timeout?: number;
}

export class EchoHttpClient {
  private baseUrl: string;
  private apiKey: string;
  private timeout: number;
  private retries: number;

  constructor(config: EchoConfig) {
    this.baseUrl = config.gatewayUrl || DEFAULT_GATEWAY;
    this.apiKey = config.apiKey;
    this.timeout = config.timeout || DEFAULT_TIMEOUT;
    this.retries = config.retries ?? DEFAULT_RETRIES;
  }

  async request<T = unknown>(path: string, opts: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, params, timeout = this.timeout } = opts;
    const url = new URL(path, this.baseUrl);
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        url.searchParams.set(k, v);
      }
    }

    let lastError: Error | null = null;
    for (let attempt = 0; attempt <= this.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeout);

        const fetchOpts: RequestInit = {
          method,
          headers: {
            'X-Echo-API-Key': this.apiKey,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        };
        if (body && method !== 'GET') {
          fetchOpts.body = JSON.stringify(body);
        }

        const resp = await fetch(url.toString(), fetchOpts);
        clearTimeout(timer);

        const json = await resp.json() as ApiEnvelope<T>;

        if (!resp.ok || !json.success) {
          const msg = json.error?.message || `HTTP ${resp.status}`;
          const code = json.error?.code || `HTTP_${resp.status}`;
          throw new EchoError(msg, code, resp.status);
        }

        return json.data as T;
      } catch (err) {
        if (err instanceof EchoError && err.status >= 400 && err.status < 500) {
          throw err; // Don't retry client errors
        }
        lastError = err instanceof Error ? err : new Error(String(err));
        if (attempt < this.retries) {
          await new Promise(r => setTimeout(r, 200 * (attempt + 1)));
        }
      }
    }

    if (lastError instanceof EchoError) throw lastError;
    if (lastError?.name === 'AbortError') {
      throw new EchoError('Request timed out', 'TIMEOUT', 408);
    }
    throw new EchoError(lastError?.message || 'Unknown error', 'NETWORK_ERROR', 0);
  }
}
