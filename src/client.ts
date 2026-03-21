/** Echo Prime SDK v3.0 — HTTP Client
 * CONTRACT §6: Exponential backoff with ±20% jitter, circuit breaker, timing-safe auth.
 * Zero external dependencies.
 */
import { EchoError, AuthError, RateLimitError, TimeoutError, NetworkError, ServerError,
  CircuitOpenError, ValidationError, isRetryableStatus, normalizeError } from './errors.js';
import { CircuitBreaker, type CircuitBreakerConfig } from './circuit-breaker.js';
import { EchoCache, cacheKey, type CacheConfig } from './cache.js';
import { validateApiKey, validatePayloadSize, redact } from './security.js';

const DEFAULT_GATEWAY = 'https://echo-sdk-gateway.bmcii1976.workers.dev';
const DEFAULT_TIMEOUT = 30_000;
const DEFAULT_RETRIES = 2;
const BASE_BACKOFF_MS = 500;
const JITTER_FACTOR = 0.2; // ±20%

export interface EchoClientConfig {
  apiKey: string;
  gatewayUrl?: string;
  timeout?: number;
  retries?: number;
  circuitBreaker?: CircuitBreakerConfig;
  cache?: CacheConfig | false;
  /** Log function — receives structured log objects. Default: no-op */
  logger?: (entry: LogEntry) => void;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, unknown>;
  params?: Record<string, string>;
  timeout?: number;
  /** Cache TTL in ms. Set to 0 to skip cache. Default: 60000 for GET, 0 for mutations. */
  cacheTtlMs?: number;
  /** Abort signal for external cancellation */
  signal?: AbortSignal;
}

export interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  event: string;
  data?: Record<string, unknown>;
  ts: string;
}

export interface ApiEnvelope<T = unknown> {
  success: boolean;
  data: T | null;
  error: { message: string; code: string } | null;
  meta: { ts: string; version: string; service: string; latency_ms?: number };
}

export class EchoHttpClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly timeout: number;
  private readonly retries: number;
  private readonly breaker: CircuitBreaker;
  private readonly cache: EchoCache | null;
  private readonly log: (entry: LogEntry) => void;

  constructor(config: EchoClientConfig) {
    if (!validateApiKey(config.apiKey)) {
      throw new ValidationError('Invalid API key — must be 8-256 characters', 'apiKey');
    }
    this.baseUrl = (config.gatewayUrl || DEFAULT_GATEWAY).replace(/\/+$/, '');
    this.apiKey = config.apiKey;
    this.timeout = config.timeout ?? DEFAULT_TIMEOUT;
    this.retries = config.retries ?? DEFAULT_RETRIES;
    this.breaker = new CircuitBreaker(config.circuitBreaker);
    this.cache = config.cache === false ? null : new EchoCache(config.cache);
    this.log = config.logger ?? (() => {});
  }

  /** Make an authenticated request with retry, circuit breaker, and caching */
  async request<T = unknown>(path: string, opts: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, params, timeout = this.timeout, signal } = opts;

    // Validate payload size — CONTRACT §SEC-5
    if (body) validatePayloadSize(body);

    // Check circuit breaker
    if (!this.breaker.canExecute()) {
      const resetAt = this.breaker.getResetTime();
      this.log({ level: 'warn', event: 'circuit_open', data: { path, resetAt }, ts: now() });
      throw new CircuitOpenError(resetAt);
    }

    // Check cache for GET requests
    const isRead = method === 'GET';
    const cacheTtl = opts.cacheTtlMs ?? (isRead ? 60_000 : 0);
    if (isRead && cacheTtl > 0 && this.cache) {
      const key = cacheKey(path, params);
      const cached = this.cache.get<T>(key);
      if (cached !== undefined) {
        this.log({ level: 'debug', event: 'cache_hit', data: { path }, ts: now() });
        return cached;
      }
    }

    // Build URL
    const url = new URL(path, this.baseUrl);
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        url.searchParams.set(k, v);
      }
    }

    // Retry loop with exponential backoff + ±20% jitter
    let lastError: Error | null = null;
    const maxAttempts = this.retries + 1; // 1 initial + N retries

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      if (attempt > 0) {
        const delay = backoffWithJitter(attempt);
        this.log({
          level: 'debug', event: 'retry',
          data: { path, attempt, delayMs: Math.round(delay) },
          ts: now(),
        });
        await sleep(delay);

        // Re-check circuit breaker before retry
        if (!this.breaker.canExecute()) {
          throw new CircuitOpenError(this.breaker.getResetTime());
        }
      }

      try {
        const result = await this.executeRequest<T>(url.toString(), method, body, timeout, signal);

        // Success — record in circuit breaker + cache
        this.breaker.recordSuccess();
        if (isRead && cacheTtl > 0 && this.cache) {
          this.cache.set(cacheKey(path, params), result, cacheTtl);
        }

        this.log({
          level: 'debug', event: 'request_ok',
          data: { path, method, attempt },
          ts: now(),
        });

        return result;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));

        // Don't retry client errors (4xx except 429)
        if (err instanceof EchoError && err.status >= 400 && err.status < 500 && err.status !== 429) {
          this.log({
            level: 'warn', event: 'client_error',
            data: { path, status: err.status, code: err.code },
            ts: now(),
          });
          throw err;
        }

        // Record failure in circuit breaker
        if (isRetryableStatus((err as EchoError)?.status ?? 0) || !(err instanceof EchoError)) {
          this.breaker.recordFailure();
        }

        this.log({
          level: 'warn', event: 'request_failed',
          data: { path, attempt, error: redact(lastError.message) },
          ts: now(),
        });
      }
    }

    // All retries exhausted
    throw normalizeError(lastError);
  }

  /** Single fetch attempt with timeout and envelope unwrapping */
  private async executeRequest<T>(
    url: string,
    method: string,
    body: Record<string, unknown> | undefined,
    timeout: number,
    externalSignal?: AbortSignal,
  ): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    // Link external signal
    if (externalSignal) {
      if (externalSignal.aborted) {
        clearTimeout(timer);
        throw new TimeoutError('Request cancelled by caller');
      }
      externalSignal.addEventListener('abort', () => controller.abort(), { once: true });
    }

    try {
      const fetchOpts: RequestInit = {
        method,
        headers: {
          'X-Echo-API-Key': this.apiKey,
          'Content-Type': 'application/json',
          'X-SDK-Version': '3.0.0',
        },
        signal: controller.signal,
      };
      if (body && method !== 'GET') {
        fetchOpts.body = JSON.stringify(body);
      }

      const resp = await fetch(url, fetchOpts);

      // Parse response
      const text = await resp.text();
      let json: ApiEnvelope<T>;
      try {
        json = JSON.parse(text) as ApiEnvelope<T>;
      } catch {
        throw new ServerError(`Invalid JSON response: ${text.slice(0, 200)}`, resp.status);
      }

      // Handle error responses
      if (!resp.ok || !json.success) {
        const msg = json.error?.message || `HTTP ${resp.status}`;
        const code = json.error?.code || `HTTP_${resp.status}`;

        if (resp.status === 401 || resp.status === 403) {
          throw new AuthError(msg, code, resp.status);
        }
        if (resp.status === 429) {
          const retryAfter = parseInt(resp.headers.get('Retry-After') || '60', 10) * 1000;
          throw new RateLimitError(msg, retryAfter);
        }
        if (resp.status === 404) {
          throw new EchoError(msg, code, 404, { retryable: false });
        }
        if (resp.status >= 500) {
          throw new ServerError(msg, resp.status);
        }
        throw new EchoError(msg, code, resp.status);
      }

      return json.data as T;
    } catch (err) {
      if (err instanceof EchoError) throw err;
      if (err instanceof Error && err.name === 'AbortError') {
        throw new TimeoutError('Request timed out', timeout);
      }
      throw new NetworkError(
        err instanceof Error ? err.message : String(err),
        err instanceof Error ? err : undefined,
      );
    } finally {
      clearTimeout(timer);
    }
  }

  /** Get circuit breaker diagnostics */
  getCircuitState() {
    return this.breaker.getInfo();
  }

  /** Get cache instance (for manual management) */
  getCache(): EchoCache | null {
    return this.cache;
  }

  /** Clear all cached data */
  clearCache(): void {
    this.cache?.clear();
  }

  /** Reset circuit breaker to CLOSED */
  resetCircuit(): void {
    this.breaker.reset();
  }
}

/** Exponential backoff with ±20% jitter — CONTRACT §6 */
function backoffWithJitter(attempt: number): number {
  const base = BASE_BACKOFF_MS * Math.pow(2, attempt - 1);
  const jitter = base * JITTER_FACTOR * (2 * Math.random() - 1); // ±20%
  return Math.max(100, base + jitter);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function now(): string {
  return new Date().toISOString();
}
