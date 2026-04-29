import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ForgeClient, type BuildResult, type ForgeStatus, type FullStackResult } from '../forge.js';
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

const API_KEY = 'test-forge-api-key-12345';

describe('ForgeClient', () => {
  let forge: ForgeClient;

  beforeEach(() => {
    mockFetch.mockReset();
    forge = new ForgeClient({ apiKey: API_KEY, baseUrl: 'https://test.example.com' });
  });

  // ── engine ────────────────────────────────────────────────────────────────

  describe('engine', () => {
    it('POSTs to /forge/engine with spec', async () => {
      const buildResult: BuildResult = { ok: true, forge: 'hephaestion', data: { id: 'e1' }, latency_ms: 500 };
      mockFetch.mockResolvedValueOnce(okResponse(buildResult));

      const result = await forge.engine({ domain: 'tax', name: 'IRS-Analyzer' });
      expect(result).toEqual(buildResult);

      const [url, opts] = mockFetch.mock.calls[0];
      expect(url).toContain('/forge/engine');
      expect(opts.method).toBe('POST');
      expect(JSON.parse(opts.body)).toEqual({ domain: 'tax', name: 'IRS-Analyzer' });
    });
  });

  // ── doctrine ──────────────────────────────────────────────────────────────

  describe('doctrine', () => {
    it('POSTs to /forge/doctrine', async () => {
      const result: BuildResult = { ok: true, forge: 'doctrine-forge', data: {}, latency_ms: 200 };
      mockFetch.mockResolvedValueOnce(okResponse(result));

      await forge.doctrine({ domain: 'legal', topic: 'contracts' });

      const [url, opts] = mockFetch.mock.calls[0];
      expect(url).toContain('/forge/doctrine');
      expect(opts.method).toBe('POST');
    });
  });

  // ── app ───────────────────────────────────────────────────────────────────

  describe('app', () => {
    it('includes type in the body', async () => {
      const result: BuildResult = { ok: true, forge: 'app-forge', data: {}, latency_ms: 300 };
      mockFetch.mockResolvedValueOnce(okResponse(result));

      await forge.app('web', { name: 'Dashboard', framework: 'next' });

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.type).toBe('web');
      expect(body.name).toBe('Dashboard');
      expect(body.framework).toBe('next');
    });
  });

  // ── worker ────────────────────────────────────────────────────────────────

  describe('worker', () => {
    it('includes name in the body', async () => {
      const result: BuildResult = { ok: true, forge: 'worker-forge', data: {}, latency_ms: 150 };
      mockFetch.mockResolvedValueOnce(okResponse(result));

      await forge.worker('echo-api', { routes: ['/api/*'] });

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.name).toBe('echo-api');
      expect(body.routes).toEqual(['/api/*']);
    });
  });

  // ── prompt ────────────────────────────────────────────────────────────────

  describe('prompt', () => {
    it('sends domain and task', async () => {
      const result: BuildResult = { ok: true, forge: 'prompt-forge', data: {}, latency_ms: 100 };
      mockFetch.mockResolvedValueOnce(okResponse(result));

      await forge.prompt('tax', 'Generate depreciation schedule');

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.domain).toBe('tax');
      expect(body.task).toBe('Generate depreciation schedule');
    });
  });

  // ── knowledge ─────────────────────────────────────────────────────────────

  describe('knowledge', () => {
    it('sends docs array', async () => {
      const result: BuildResult = { ok: true, forge: 'knowledge-forge', data: { count: 2 }, latency_ms: 800 };
      mockFetch.mockResolvedValueOnce(okResponse(result));

      const docs = [
        { title: 'IRC 1031', content: 'Like-kind exchanges...', category: 'tax' },
        { title: 'IRC 179', content: 'Section 179 deduction...', category: 'tax' },
      ];
      await forge.knowledge(docs);

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.docs).toEqual(docs);
    });
  });

  // ── hephaestion / daedalus / forgeX ───────────────────────────────────────

  describe('specialized forges', () => {
    it('hephaestion POSTs to /forge/hephaestion', async () => {
      mockFetch.mockResolvedValueOnce(okResponse({ ok: true, forge: 'hephaestion', data: {}, latency_ms: 100 }));
      await forge.hephaestion({ type: 'engine', domain: 'security' });

      const url: string = mockFetch.mock.calls[0][0];
      expect(url).toContain('/forge/hephaestion');
    });

    it('daedalus POSTs to /forge/daedalus', async () => {
      mockFetch.mockResolvedValueOnce(okResponse({ ok: true, forge: 'daedalus', data: {}, latency_ms: 100 }));
      await forge.daedalus({ prototype: true });

      const url: string = mockFetch.mock.calls[0][0];
      expect(url).toContain('/forge/daedalus');
    });

    it('forgeX POSTs to /forge/forge-x', async () => {
      mockFetch.mockResolvedValueOnce(okResponse({ ok: true, forge: 'forge-x', data: {}, latency_ms: 100 }));
      await forge.forgeX({ cross_platform: true });

      const url: string = mockFetch.mock.calls[0][0];
      expect(url).toContain('/forge/forge-x');
    });
  });

  // ── fullStack ─────────────────────────────────────────────────────────────

  describe('fullStack', () => {
    it('POSTs stages and payload to /forge/full-stack', async () => {
      const fsResult: FullStackResult = {
        pipeline: 'tax-pipeline',
        stages: ['doctrine', 'engine'],
        results: [
          { stage: 'doctrine', ok: true, data: {}, latency_ms: 200 },
          { stage: 'engine', ok: true, data: {}, latency_ms: 300 },
        ],
      };
      mockFetch.mockResolvedValueOnce(okResponse(fsResult));

      const result = await forge.fullStack(['doctrine', 'engine'], { domain: 'tax' });
      expect(result).toEqual(fsResult);

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.stages).toEqual(['doctrine', 'engine']);
      expect(body.payload).toEqual({ domain: 'tax' });
    });
  });

  // ── status ────────────────────────────────────────────────────────────────

  describe('status', () => {
    it('GETs /forge/status', async () => {
      const forgeStatus: ForgeStatus = {
        forges: {
          hephaestion: { status: 'healthy', latency_ms: 50 },
          daedalus: { status: 'healthy', latency_ms: 60 },
        },
        summary: { total: 2, healthy: 2, unhealthy: 0 },
      };
      mockFetch.mockResolvedValueOnce(okResponse(forgeStatus));

      const result = await forge.status();
      expect(result).toEqual(forgeStatus);

      const [url, opts] = mockFetch.mock.calls[0];
      expect(url).toContain('/forge/status');
      expect(opts.method).toBe('GET');
    });
  });

  // ── evolution ─────────────────────────────────────────────────────────────

  describe('evolution', () => {
    it('GETs /forge/evolution without forge_id', async () => {
      mockFetch.mockResolvedValueOnce(okResponse({ forges: {}, timestamp: '', forge_count: 0 }));

      await forge.evolution();

      const url: string = mockFetch.mock.calls[0][0];
      expect(url).toContain('/forge/evolution');
      expect(url).not.toContain('forge_id=');
    });

    it('passes forge_id when specified', async () => {
      mockFetch.mockResolvedValueOnce(okResponse({ forges: {}, timestamp: '', forge_count: 0 }));

      await forge.evolution('hephaestion');

      const url: string = mockFetch.mock.calls[0][0];
      expect(url).toContain('forge_id=hephaestion');
    });
  });
});
