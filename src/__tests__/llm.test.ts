import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LLMClient, type CompletionResponse, type ModelInfo } from '../llm.js';
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

const API_KEY = 'test-llm-api-key-12345678';

describe('LLMClient', () => {
  let llm: LLMClient;

  beforeEach(() => {
    mockFetch.mockReset();
    llm = new LLMClient({
      apiKey: API_KEY,
      baseUrl: 'https://test.example.com',
      defaultModel: 'claude-opus-4-20250514',
    });
  });

  // ── complete ──────────────────────────────────────────────────────────────

  describe('complete', () => {
    it('POSTs to /llm/complete with prompt and model', async () => {
      const response: CompletionResponse = {
        content: 'Hello world',
        model: 'claude-opus-4-20250514',
        usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
        latency_ms: 200,
      };
      mockFetch.mockResolvedValueOnce(okResponse(response));

      const result = await llm.complete({ prompt: 'Say hello' });
      expect(result).toEqual(response);

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.prompt).toBe('Say hello');
      expect(body.model).toBe('claude-opus-4-20250514');
      expect(body.stream).toBe(false);
    });

    it('uses custom model when specified', async () => {
      mockFetch.mockResolvedValueOnce(okResponse({
        content: 'Hi',
        model: 'gpt-4o',
        usage: { prompt_tokens: 5, completion_tokens: 2, total_tokens: 7 },
        latency_ms: 100,
      }));

      await llm.complete({ prompt: 'Hi', model: 'gpt-4o' });

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.model).toBe('gpt-4o');
    });

    it('passes optional parameters', async () => {
      mockFetch.mockResolvedValueOnce(okResponse({
        content: 'Response',
        model: 'claude-opus-4-20250514',
        usage: { prompt_tokens: 10, completion_tokens: 50, total_tokens: 60 },
        latency_ms: 300,
      }));

      await llm.complete({
        prompt: 'Write a poem',
        max_tokens: 500,
        temperature: 0.7,
        system: 'You are a poet',
      });

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.max_tokens).toBe(500);
      expect(body.temperature).toBe(0.7);
      expect(body.system).toBe('You are a poet');
    });
  });

  // ── claude (convenience method) ───────────────────────────────────────────

  describe('claude', () => {
    it('uses claude-opus-4-20250514 model by default', async () => {
      mockFetch.mockResolvedValueOnce(okResponse({
        content: 'Claude response',
        model: 'claude-opus-4-20250514',
        usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
        latency_ms: 200,
      }));

      const result = await llm.claude('Hello Claude');
      expect(result.content).toBe('Claude response');

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.model).toBe('claude-opus-4-20250514');
    });

    it('accepts model override through options', async () => {
      mockFetch.mockResolvedValueOnce(okResponse({
        content: 'Sonnet response',
        model: 'claude-sonnet-4-20250514',
        usage: { prompt_tokens: 5, completion_tokens: 5, total_tokens: 10 },
        latency_ms: 100,
      }));

      await llm.claude('Hello', { model: 'claude-sonnet-4-20250514' });

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.model).toBe('claude-sonnet-4-20250514');
    });
  });

  // ── stream ────────────────────────────────────────────────────────────────

  describe('stream', () => {
    it('yields content chunks from SSE response', async () => {
      const sseData = [
        'data: {"content":"Hello"}\n\n',
        'data: {"content":" world"}\n\n',
        'data: [DONE]\n\n',
      ].join('');

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(sseData));
          controller.close();
        },
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        body: stream,
        headers: new Headers(),
      });

      const chunks: string[] = [];
      for await (const chunk of llm.stream({ prompt: 'Say hello world' })) {
        chunks.push(chunk);
      }

      expect(chunks).toEqual(['Hello', ' world']);

      // Verify stream=true is in the body
      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.stream).toBe(true);
    });

    it('yields text field as fallback', async () => {
      const sseData = 'data: {"text":"fallback"}\n\n';
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(sseData));
          controller.close();
        },
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        body: stream,
        headers: new Headers(),
      });

      const chunks: string[] = [];
      for await (const chunk of llm.stream({ prompt: 'test' })) {
        chunks.push(chunk);
      }

      expect(chunks).toContain('fallback');
    });

    it('throws on HTTP error response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: () => Promise.resolve(JSON.stringify({ error: { message: 'Server down' } })),
        headers: new Headers(),
      });

      const chunks: string[] = [];
      await expect(async () => {
        for await (const chunk of llm.stream({ prompt: 'fail' })) {
          chunks.push(chunk);
        }
      }).rejects.toThrow('Server down');
    });

    it('throws on null response body', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        body: null,
        headers: new Headers(),
      });

      await expect(async () => {
        for await (const _chunk of llm.stream({ prompt: 'null body' })) {
          // empty
        }
      }).rejects.toThrow('Response body is null');
    });

    it('sends auth headers', async () => {
      const stream = new ReadableStream({
        start(controller) { controller.close(); },
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        body: stream,
        headers: new Headers(),
      });

      for await (const _chunk of llm.stream({ prompt: 'test' })) {
        // empty
      }

      const headers = mockFetch.mock.calls[0][1].headers;
      expect(headers['X-Echo-API-Key']).toBe(API_KEY);
      expect(headers['X-SDK-Version']).toBe('3.0.0');
    });
  });

  // ── models ────────────────────────────────────────────────────────────────

  describe('models', () => {
    it('GETs /llm/models', async () => {
      const modelList: ModelInfo[] = [
        { id: 'claude-opus-4-20250514', name: 'Claude Opus', provider: 'anthropic', max_tokens: 200000, capabilities: ['chat', 'code'] },
        { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai', max_tokens: 128000, capabilities: ['chat', 'vision'] },
      ];
      mockFetch.mockResolvedValueOnce(okResponse(modelList));

      const result = await llm.models();
      expect(result).toEqual(modelList);
      expect(result).toHaveLength(2);
    });
  });

  // ── status ────────────────────────────────────────────────────────────────

  describe('status', () => {
    it('GETs /llm/status', async () => {
      const statusResult = { healthy: true, providers: { anthropic: 'up', openai: 'up' } };
      mockFetch.mockResolvedValueOnce(okResponse(statusResult));

      const result = await llm.status();
      expect(result.healthy).toBe(true);
      expect(result.providers.anthropic).toBe('up');
    });
  });

  // ── default model fallback ────────────────────────────────────────────────

  describe('default model', () => {
    it('uses claude-opus-4-20250514 when no defaultModel configured', async () => {
      const client = new LLMClient({ apiKey: API_KEY, baseUrl: 'https://test.example.com' });
      mockFetch.mockResolvedValueOnce(okResponse({
        content: 'ok',
        model: 'claude-opus-4-20250514',
        usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
        latency_ms: 50,
      }));

      await client.complete({ prompt: 'test' });

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.model).toBe('claude-opus-4-20250514');
    });
  });
});
