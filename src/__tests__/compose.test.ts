import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ComposeClient, type CompoundEngine } from '../compose.js';
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

const API_KEY = 'test-compose-api-key-12';

describe('ComposeClient', () => {
  let compose: ComposeClient;

  beforeEach(() => {
    mockFetch.mockReset();
    compose = new ComposeClient({
      apiKey: API_KEY,
      baseUrl: 'https://test.example.com',
    });
  });

  const sampleCompound: CompoundEngine = {
    id: 'compound-1',
    name: 'tax-legal-combo',
    description: 'Tax + Legal analysis pipeline',
    engines: ['tax-v3', 'legal-v2'],
    strategy: 'chain',
    created_at: '2026-03-20T12:00:00Z',
    query_count: 0,
  };

  // ── create ────────────────────────────────────────────────────────────────

  describe('create', () => {
    it('POSTs to /compose/create with engines, name, and strategy', async () => {
      mockFetch.mockResolvedValueOnce(okResponse(sampleCompound));

      const result = await compose.create(
        ['tax-v3', 'legal-v2'],
        'tax-legal-combo',
        { strategy: 'chain', description: 'Tax + Legal analysis pipeline' },
      );

      expect(result).toEqual(sampleCompound);

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.engines).toEqual(['tax-v3', 'legal-v2']);
      expect(body.name).toBe('tax-legal-combo');
      expect(body.strategy).toBe('chain');
      expect(body.description).toBe('Tax + Legal analysis pipeline');
    });

    it('defaults strategy to merge when not specified', async () => {
      mockFetch.mockResolvedValueOnce(okResponse({ ...sampleCompound, strategy: 'merge' }));

      await compose.create(['e1', 'e2'], 'combo');

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.strategy).toBe('merge');
    });

    it('omits description when not provided', async () => {
      mockFetch.mockResolvedValueOnce(okResponse({ ...sampleCompound }));

      await compose.create(['e1'], 'test', { strategy: 'vote' });

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.description).toBeUndefined();
    });
  });

  // ── get ───────────────────────────────────────────────────────────────────

  describe('get', () => {
    it('GETs /compose/:id', async () => {
      mockFetch.mockResolvedValueOnce(okResponse(sampleCompound));

      const result = await compose.get('compound-1');
      expect(result).toEqual(sampleCompound);

      const url: string = mockFetch.mock.calls[0][0];
      expect(url).toContain('/compose/compound-1');
    });

    it('URL-encodes the id', async () => {
      mockFetch.mockResolvedValueOnce(okResponse(sampleCompound));

      await compose.get('id with spaces');

      const url: string = mockFetch.mock.calls[0][0];
      expect(url).toContain('/compose/id%20with%20spaces');
    });
  });

  // ── delete ────────────────────────────────────────────────────────────────

  describe('delete', () => {
    it('sends DELETE to /compose/:id', async () => {
      mockFetch.mockResolvedValueOnce(okResponse(null));

      await compose.delete('compound-1');

      const [url, opts] = mockFetch.mock.calls[0];
      expect(url).toContain('/compose/compound-1');
      expect(opts.method).toBe('DELETE');
    });
  });

  // ── query ─────────────────────────────────────────────────────────────────

  describe('query', () => {
    it('POSTs query to /compose/:id/query', async () => {
      const queryResult = { combined_response: 'Tax and legal analysis...' };
      mockFetch.mockResolvedValueOnce(okResponse(queryResult));

      const result = await compose.query('compound-1', 'What are 1031 exchange requirements?');
      expect(result).toEqual(queryResult);

      const [url, opts] = mockFetch.mock.calls[0];
      expect(url).toContain('/compose/compound-1/query');
      expect(opts.method).toBe('POST');

      const body = JSON.parse(opts.body);
      expect(body.query).toBe('What are 1031 exchange requirements?');
    });

    it('includes optional mode parameter', async () => {
      mockFetch.mockResolvedValueOnce(okResponse({}));

      await compose.query('compound-1', 'test', 'detailed');

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.mode).toBe('detailed');
    });

    it('omits mode when not specified', async () => {
      mockFetch.mockResolvedValueOnce(okResponse({}));

      await compose.query('compound-1', 'test');

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.mode).toBeUndefined();
    });
  });

  // ── list ──────────────────────────────────────────────────────────────────

  describe('list', () => {
    it('GETs /compose/list', async () => {
      const compounds: CompoundEngine[] = [
        sampleCompound,
        { ...sampleCompound, id: 'compound-2', name: 'security-ensemble', strategy: 'vote' },
      ];
      mockFetch.mockResolvedValueOnce(okResponse(compounds));

      const result = await compose.list();
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('tax-legal-combo');
      expect(result[1].strategy).toBe('vote');

      const url: string = mockFetch.mock.calls[0][0];
      expect(url).toContain('/compose/list');
    });

    it('returns empty array when no compound engines exist', async () => {
      mockFetch.mockResolvedValueOnce(okResponse([]));

      const result = await compose.list();
      expect(result).toEqual([]);
    });
  });
});
