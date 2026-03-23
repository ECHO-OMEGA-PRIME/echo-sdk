import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EchoEngines } from '../engines.js';
import type { EngineQueryResult, EngineInfo } from '../types.js';
import type { ApiEnvelope } from '../client.js';

// ── Global fetch mock ───────────────────────────────────────────────────────

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function okResponse<T>(data: T) {
  const envelope: ApiEnvelope<T> = {
    success: true,
    data,
    error: null,
    meta: { ts: new Date().toISOString(), version: '3.0.0', service: 'test' },
  };
  return {
    ok: true,
    status: 200,
    text: () => Promise.resolve(JSON.stringify(envelope)),
    headers: new Headers(),
  };
}

const API_KEY = 'test-engine-api-key-12345';

describe('EchoEngines', () => {
  let engines: EchoEngines;

  beforeEach(() => {
    mockFetch.mockReset();
    engines = new EchoEngines({
      apiKey: API_KEY,
      gatewayUrl: 'https://test.example.com',
      cache: false,
    });
  });

  // ── query ─────────────────────────────────────────────────────────────────

  describe('query', () => {
    it('sends GET to /engine/query with question param', async () => {
      const queryResult: EngineQueryResult = {
        engine_id: 'tax-macrs-v3',
        domain: 'tax',
        response: 'MACRS is Modified Accelerated Cost Recovery System',
        confidence: 0.95,
        doctrines_matched: 3,
        latency_ms: 142,
      };
      mockFetch.mockResolvedValueOnce(okResponse(queryResult));

      const result = await engines.query('What is MACRS?');
      expect(result).toEqual(queryResult);

      const url: string = mockFetch.mock.calls[0][0];
      expect(url).toContain('/engine/query');
      expect(url).toContain('q=What+is+MACRS');
    });

    it('includes domain param when specified', async () => {
      mockFetch.mockResolvedValueOnce(okResponse({ engine_id: 'test' }));

      await engines.query('depreciation', 'tax');

      const url: string = mockFetch.mock.calls[0][0];
      expect(url).toContain('domain=tax');
    });

    it('omits domain param when not specified', async () => {
      mockFetch.mockResolvedValueOnce(okResponse({ engine_id: 'test' }));

      await engines.query('general question');

      const url: string = mockFetch.mock.calls[0][0];
      expect(url).not.toContain('domain=');
    });
  });

  // ── queryBatch ────────────────────────────────────────────────────────────

  describe('queryBatch', () => {
    it('sends POST to /engine/query-batch with queries body', async () => {
      const batchResults: EngineQueryResult[] = [
        { engine_id: 'e1', domain: 'tax', response: 'r1', confidence: 0.9, doctrines_matched: 2, latency_ms: 100 },
        { engine_id: 'e2', domain: 'legal', response: 'r2', confidence: 0.8, doctrines_matched: 1, latency_ms: 150 },
      ];
      mockFetch.mockResolvedValueOnce(okResponse(batchResults));

      const queries = [
        { query: 'q1', domain: 'tax' },
        { query: 'q2', domain: 'legal' },
      ];
      const result = await engines.queryBatch(queries);

      expect(result).toEqual(batchResults);
      const [, fetchOpts] = mockFetch.mock.calls[0];
      expect(fetchOpts.method).toBe('POST');
      const body = JSON.parse(fetchOpts.body);
      expect(body.queries).toEqual(queries);
    });
  });

  // ── list ──────────────────────────────────────────────────────────────────

  describe('list', () => {
    it('sends GET to /engine/list', async () => {
      const engineList: EngineInfo[] = [
        { engine_id: 'tax-v1', domain: 'tax', name: 'Tax Engine', description: 'Tax analysis', doctrine_count: 50, status: 'active' },
      ];
      mockFetch.mockResolvedValueOnce(okResponse(engineList));

      const result = await engines.list();
      expect(result).toEqual(engineList);

      const url: string = mockFetch.mock.calls[0][0];
      expect(url).toContain('/engine/list');
    });

    it('passes domain filter when specified', async () => {
      mockFetch.mockResolvedValueOnce(okResponse([]));
      await engines.list('security');

      const url: string = mockFetch.mock.calls[0][0];
      expect(url).toContain('domain=security');
    });
  });

  // ── search ────────────────────────────────────────────────────────────────

  describe('search', () => {
    it('sends GET with query and default limit', async () => {
      mockFetch.mockResolvedValueOnce(okResponse([]));
      await engines.search('machine learning');

      const url: string = mockFetch.mock.calls[0][0];
      expect(url).toContain('q=machine+learning');
      expect(url).toContain('limit=10');
    });

    it('sends custom limit', async () => {
      mockFetch.mockResolvedValueOnce(okResponse([]));
      await engines.search('tax', 25);

      const url: string = mockFetch.mock.calls[0][0];
      expect(url).toContain('limit=25');
    });
  });

  // ── metadata ──────────────────────────────────────────────────────────────

  describe('metadata', () => {
    it('sends GET with engine_id param', async () => {
      const info: EngineInfo = {
        engine_id: 'tax-v3',
        domain: 'tax',
        name: 'Tax Engine v3',
        description: 'Advanced tax analysis',
        doctrine_count: 100,
        status: 'active',
      };
      mockFetch.mockResolvedValueOnce(okResponse(info));

      const result = await engines.metadata('tax-v3');
      expect(result).toEqual(info);

      const url: string = mockFetch.mock.calls[0][0];
      expect(url).toContain('engine_id=tax-v3');
    });
  });

  // ── capabilities ──────────────────────────────────────────────────────────

  describe('capabilities', () => {
    it('fetches engine capabilities', async () => {
      const caps = { supports_streaming: true, max_tokens: 8000 };
      mockFetch.mockResolvedValueOnce(okResponse(caps));

      const result = await engines.capabilities('tax-v3');
      expect(result).toEqual(caps);

      const url: string = mockFetch.mock.calls[0][0];
      expect(url).toContain('/engine/capabilities');
      expect(url).toContain('engine_id=tax-v3');
    });
  });

  // ── status ────────────────────────────────────────────────────────────────

  describe('status', () => {
    it('fetches engine runtime status', async () => {
      const status = { total_engines: 2632, healthy: 2630, unhealthy: 2 };
      mockFetch.mockResolvedValueOnce(okResponse(status));

      const result = await engines.status();
      expect(result).toEqual(status);

      const url: string = mockFetch.mock.calls[0][0];
      expect(url).toContain('/engine/status');
    });
  });
});
