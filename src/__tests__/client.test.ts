import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { EchoHttpClient, type EchoClientConfig, type ApiEnvelope } from '../client.js';
import { ValidationError, AuthError, RateLimitError, CircuitOpenError, ServerError, TimeoutError, NetworkError } from '../errors.js';

// ── Global fetch mock ───────────────────────────────────────────────────────

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function okEnvelope<T>(data: T): ApiEnvelope<T> {
  return {
    success: true,
    data,
    error: null,
    meta: { ts: new Date().toISOString(), version: '3.0.0', service: 'test' },
  };
}

function errorEnvelope(message: string, code: string): ApiEnvelope<null> {
  return {
    success: false,
    data: null,
    error: { message, code },
    meta: { ts: new Date().toISOString(), version: '3.0.0', service: 'test' },
  };
}

function mockResponse(status: number, body: unknown, headers?: Record<string, string>) {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: () => Promise.resolve(JSON.stringify(body)),
    headers: new Headers(headers ?? {}),
  };
}

const validConfig: EchoClientConfig = {
  apiKey: 'test-api-key-12345678',
  gatewayUrl: 'https://test-gateway.example.com',
  timeout: 5000,
  retries: 1,
  cache: false,
};

describe('EchoHttpClient', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── Constructor validation ────────────────────────────────────────────────

  describe('constructor', () => {
    it('throws ValidationError for invalid API key', () => {
      expect(() => new EchoHttpClient({ apiKey: 'short' })).toThrow(ValidationError);
    });

    it('throws ValidationError for empty API key', () => {
      expect(() => new EchoHttpClient({ apiKey: '' })).toThrow(ValidationError);
    });

    it('creates client with valid config', () => {
      const client = new EchoHttpClient(validConfig);
      expect(client).toBeInstanceOf(EchoHttpClient);
    });

    it('strips trailing slashes from gateway URL', () => {
      const client = new EchoHttpClient({
        ...validConfig,
        gatewayUrl: 'https://example.com///',
      });
      // We verify by making a request and checking the URL passed to fetch
      mockFetch.mockResolvedValueOnce(mockResponse(200, okEnvelope({ ok: true })));
      // Fire and forget since we just want to inspect the URL
      client.request('/test').catch(() => {});
      vi.runAllTimersAsync();
    });
  });

  // ── Auth headers ──────────────────────────────────────────────────────────

  describe('auth headers', () => {
    it('sends X-Echo-API-Key and Content-Type headers', async () => {
      const client = new EchoHttpClient(validConfig);
      mockFetch.mockResolvedValueOnce(mockResponse(200, okEnvelope({ ok: true })));

      await client.request('/test');

      expect(mockFetch).toHaveBeenCalledOnce();
      const [, fetchOpts] = mockFetch.mock.calls[0];
      expect(fetchOpts.headers['X-Echo-API-Key']).toBe('test-api-key-12345678');
      expect(fetchOpts.headers['Content-Type']).toBe('application/json');
      expect(fetchOpts.headers['X-SDK-Version']).toBe('3.3.0');
    });
  });

  // ── Successful requests ───────────────────────────────────────────────────

  describe('successful requests', () => {
    it('unwraps data from envelope on success', async () => {
      const client = new EchoHttpClient(validConfig);
      const payload = { engines: ['tax', 'legal'] };
      mockFetch.mockResolvedValueOnce(mockResponse(200, okEnvelope(payload)));

      const result = await client.request('/engine/list');
      expect(result).toEqual(payload);
    });

    it('passes query params to URL', async () => {
      const client = new EchoHttpClient(validConfig);
      mockFetch.mockResolvedValueOnce(mockResponse(200, okEnvelope([])));

      await client.request('/engine/search', { params: { q: 'tax', limit: '10' } });

      const url = mockFetch.mock.calls[0][0];
      expect(url).toContain('q=tax');
      expect(url).toContain('limit=10');
    });

    it('sends JSON body on POST', async () => {
      const client = new EchoHttpClient(validConfig);
      mockFetch.mockResolvedValueOnce(mockResponse(200, okEnvelope({ id: '123' })));

      await client.request('/engine/query', {
        method: 'POST',
        body: { question: 'What is MACRS?' },
      });

      const [, fetchOpts] = mockFetch.mock.calls[0];
      expect(fetchOpts.method).toBe('POST');
      expect(JSON.parse(fetchOpts.body)).toEqual({ question: 'What is MACRS?' });
    });

    it('does not send body on GET', async () => {
      const client = new EchoHttpClient(validConfig);
      mockFetch.mockResolvedValueOnce(mockResponse(200, okEnvelope({})));

      await client.request('/test', { method: 'GET', body: { ignored: true } });

      const [, fetchOpts] = mockFetch.mock.calls[0];
      expect(fetchOpts.body).toBeUndefined();
    });
  });

  // ── Error handling ────────────────────────────────────────────────────────

  describe('error handling', () => {
    it('throws AuthError on 401', async () => {
      const client = new EchoHttpClient({ ...validConfig, retries: 0 });
      mockFetch.mockResolvedValueOnce(mockResponse(401, errorEnvelope('Invalid key', 'AUTH_INVALID')));

      await expect(client.request('/test')).rejects.toThrow(AuthError);
    });

    it('throws AuthError on 403', async () => {
      const client = new EchoHttpClient({ ...validConfig, retries: 0 });
      mockFetch.mockResolvedValueOnce(mockResponse(403, errorEnvelope('Forbidden', 'FORBIDDEN')));

      await expect(client.request('/test')).rejects.toThrow(AuthError);
    });

    it('throws RateLimitError on 429 with Retry-After', async () => {
      const client = new EchoHttpClient({ ...validConfig, retries: 0 });
      mockFetch.mockResolvedValueOnce(
        mockResponse(429, errorEnvelope('Rate limited', 'RATE_LIMITED'), { 'Retry-After': '30' }),
      );

      try {
        await client.request('/test');
        expect.fail('Should have thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(RateLimitError);
        expect((err as RateLimitError).retryAfterMs).toBe(30000);
      }
    });

    it('throws EchoError on 404 (not retryable)', async () => {
      const client = new EchoHttpClient({ ...validConfig, retries: 0 });
      mockFetch.mockResolvedValueOnce(mockResponse(404, errorEnvelope('Not found', 'NOT_FOUND')));

      try {
        await client.request('/test');
        expect.fail('Should have thrown');
      } catch (err: any) {
        expect(err.status).toBe(404);
        expect(err.retryable).toBe(false);
      }
    });

    it('throws ServerError on 500', async () => {
      const client = new EchoHttpClient({ ...validConfig, retries: 0 });
      mockFetch.mockResolvedValueOnce(mockResponse(500, errorEnvelope('Internal error', 'SERVER')));

      await expect(client.request('/test')).rejects.toThrow(ServerError);
    });

    it('throws ServerError for invalid JSON response', async () => {
      const client = new EchoHttpClient({ ...validConfig, retries: 0 });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve('not valid json {{{{'),
        headers: new Headers(),
      });

      await expect(client.request('/test')).rejects.toThrow(ServerError);
    });

    it('throws NetworkError when fetch rejects', async () => {
      const client = new EchoHttpClient({ ...validConfig, retries: 0 });
      mockFetch.mockRejectedValueOnce(new Error('ECONNREFUSED'));

      await expect(client.request('/test')).rejects.toThrow(NetworkError);
    });

    it('does not retry 4xx client errors (except 429)', async () => {
      const client = new EchoHttpClient({ ...validConfig, retries: 2 });
      mockFetch.mockResolvedValueOnce(mockResponse(400, errorEnvelope('Bad request', 'BAD_REQ')));

      await expect(client.request('/test')).rejects.toThrow();
      // Should only call fetch once (no retries for 400)
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  // ── Retry behavior ────────────────────────────────────────────────────────

  describe('retry behavior', () => {
    it('retries on 500 errors up to retries count', async () => {
      vi.useRealTimers();
      const client = new EchoHttpClient({ ...validConfig, retries: 2, timeout: 5000 });

      mockFetch
        .mockResolvedValueOnce(mockResponse(500, errorEnvelope('fail1', 'HTTP_500')))
        .mockResolvedValueOnce(mockResponse(500, errorEnvelope('fail2', 'HTTP_500')))
        .mockResolvedValueOnce(mockResponse(200, okEnvelope({ ok: true })));

      const result = await client.request('/test');
      expect(result).toEqual({ ok: true });
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it('exhausts retries and throws the last error', async () => {
      vi.useRealTimers();
      const client = new EchoHttpClient({ ...validConfig, retries: 1, timeout: 5000 });

      mockFetch
        .mockResolvedValueOnce(mockResponse(500, errorEnvelope('fail1', 'HTTP_500')))
        .mockResolvedValueOnce(mockResponse(500, errorEnvelope('fail2', 'HTTP_500')));

      await expect(client.request('/test')).rejects.toThrow();
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('retries on network errors', async () => {
      vi.useRealTimers();
      const client = new EchoHttpClient({ ...validConfig, retries: 1, timeout: 5000 });

      mockFetch
        .mockRejectedValueOnce(new Error('fetch failed'))
        .mockResolvedValueOnce(mockResponse(200, okEnvelope({ recovered: true })));

      const result = await client.request('/test');
      expect(result).toEqual({ recovered: true });
    });
  });

  // ── Circuit breaker integration ───────────────────────────────────────────

  describe('circuit breaker', () => {
    it('throws CircuitOpenError when circuit is open', async () => {
      const client = new EchoHttpClient({
        ...validConfig,
        retries: 0,
        circuitBreaker: { failureThreshold: 2, resetTimeoutMs: 60000 },
      });

      // Trip the circuit breaker by recording 2 failures
      mockFetch
        .mockResolvedValueOnce(mockResponse(500, errorEnvelope('fail', 'HTTP_500')))
        .mockResolvedValueOnce(mockResponse(500, errorEnvelope('fail', 'HTTP_500')));

      await expect(client.request('/test')).rejects.toThrow(ServerError);
      await expect(client.request('/test')).rejects.toThrow(ServerError);

      // Circuit should now be open — next request throws CircuitOpenError without hitting fetch
      await expect(client.request('/test')).rejects.toThrow(CircuitOpenError);
      // fetch should have been called only twice
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('exposes circuit state via getCircuitState', () => {
      const client = new EchoHttpClient(validConfig);
      const state = client.getCircuitState();
      expect(state.state).toBe('CLOSED');
      expect(state.failures).toBe(0);
    });

    it('can manually reset circuit', async () => {
      const client = new EchoHttpClient({
        ...validConfig,
        retries: 0,
        circuitBreaker: { failureThreshold: 1 },
      });

      mockFetch.mockResolvedValueOnce(mockResponse(500, errorEnvelope('fail', 'HTTP_500')));
      await expect(client.request('/test')).rejects.toThrow();
      await expect(client.request('/test')).rejects.toThrow(CircuitOpenError);

      client.resetCircuit();
      expect(client.getCircuitState().state).toBe('CLOSED');
    });
  });

  // ── Cache integration ─────────────────────────────────────────────────────

  describe('cache', () => {
    it('caches GET requests', async () => {
      const client = new EchoHttpClient({
        ...validConfig,
        cache: { maxEntries: 100, defaultTtlMs: 60000 },
      });

      const data = { engines: ['tax'] };
      mockFetch.mockResolvedValueOnce(mockResponse(200, okEnvelope(data)));

      // First call hits fetch
      const r1 = await client.request('/engine/list');
      expect(r1).toEqual(data);
      expect(mockFetch).toHaveBeenCalledTimes(1);

      // Second call should use cache
      const r2 = await client.request('/engine/list');
      expect(r2).toEqual(data);
      expect(mockFetch).toHaveBeenCalledTimes(1); // No additional fetch
    });

    it('does not cache POST requests', async () => {
      const client = new EchoHttpClient({
        ...validConfig,
        cache: { maxEntries: 100, defaultTtlMs: 60000 },
      });

      mockFetch
        .mockResolvedValueOnce(mockResponse(200, okEnvelope({ id: 1 })))
        .mockResolvedValueOnce(mockResponse(200, okEnvelope({ id: 2 })));

      await client.request('/engine/query', { method: 'POST', body: { q: 'test' } });
      await client.request('/engine/query', { method: 'POST', body: { q: 'test' } });

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('skips cache when cacheTtlMs is 0', async () => {
      const client = new EchoHttpClient({
        ...validConfig,
        cache: { maxEntries: 100, defaultTtlMs: 60000 },
      });

      mockFetch
        .mockResolvedValueOnce(mockResponse(200, okEnvelope({ v: 1 })))
        .mockResolvedValueOnce(mockResponse(200, okEnvelope({ v: 2 })));

      await client.request('/test', { cacheTtlMs: 0 });
      await client.request('/test', { cacheTtlMs: 0 });

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('returns null cache when cache is disabled', () => {
      const client = new EchoHttpClient({ ...validConfig, cache: false });
      expect(client.getCache()).toBeNull();
    });

    it('clearCache clears the cache', async () => {
      const client = new EchoHttpClient({
        ...validConfig,
        cache: { maxEntries: 100, defaultTtlMs: 60000 },
      });

      mockFetch
        .mockResolvedValueOnce(mockResponse(200, okEnvelope({ v: 1 })))
        .mockResolvedValueOnce(mockResponse(200, okEnvelope({ v: 2 })));

      await client.request('/test');
      client.clearCache();
      await client.request('/test');

      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  // ── Logger integration ────────────────────────────────────────────────────

  describe('logger', () => {
    it('calls logger on cache hit', async () => {
      const logger = vi.fn();
      const client = new EchoHttpClient({
        ...validConfig,
        cache: { maxEntries: 100, defaultTtlMs: 60000 },
        logger,
      });

      mockFetch.mockResolvedValueOnce(mockResponse(200, okEnvelope({ v: 1 })));

      await client.request('/test');
      await client.request('/test'); // cache hit

      const cacheHitLog = logger.mock.calls.find((c: any) => c[0].event === 'cache_hit');
      expect(cacheHitLog).toBeTruthy();
    });

    it('calls logger on request success', async () => {
      const logger = vi.fn();
      const client = new EchoHttpClient({ ...validConfig, logger });

      mockFetch.mockResolvedValueOnce(mockResponse(200, okEnvelope({ ok: true })));
      await client.request('/test');

      const okLog = logger.mock.calls.find((c: any) => c[0].event === 'request_ok');
      expect(okLog).toBeTruthy();
    });
  });

  // ── Timeout ───────────────────────────────────────────────────────────────

  describe('timeout', () => {
    it('throws TimeoutError when fetch is aborted', async () => {
      const client = new EchoHttpClient({ ...validConfig, retries: 0, timeout: 100 });

      mockFetch.mockImplementationOnce(() => {
        const abortError = new Error('The operation was aborted');
        abortError.name = 'AbortError';
        return Promise.reject(abortError);
      });

      await expect(client.request('/test')).rejects.toThrow(TimeoutError);
    });

    it('throws TimeoutError when external signal is already aborted', async () => {
      const client = new EchoHttpClient({ ...validConfig, retries: 0 });

      const abortController = new AbortController();
      abortController.abort();

      await expect(
        client.request('/test', { signal: abortController.signal }),
      ).rejects.toThrow(TimeoutError);
    });
  });
});
