import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AGIClient, type AGIStatus, type LearningRate, type Suggestion } from '../agi.js';
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

const API_KEY = 'test-agi-api-key-123456';

describe('AGIClient', () => {
  let agi: AGIClient;

  beforeEach(() => {
    mockFetch.mockReset();
    agi = new AGIClient({
      apiKey: API_KEY,
      baseUrl: 'https://test.example.com',
    });
  });

  // ── status ────────────────────────────────────────────────────────────────

  describe('status', () => {
    it('GETs /agi/status and returns AGIStatus', async () => {
      const statusData: AGIStatus = {
        total_feedback: 1500,
        avg_quality: 0.87,
        total_retrains: 42,
        engines_improved: 30,
        last_retrain: '2026-03-20T12:00:00Z',
      };
      mockFetch.mockResolvedValueOnce(okResponse(statusData));

      const result = await agi.status();
      expect(result).toEqual(statusData);

      const url: string = mockFetch.mock.calls[0][0];
      expect(url).toContain('/agi/status');
    });
  });

  // ── feedback ──────────────────────────────────────────────────────────────

  describe('feedback', () => {
    it('POSTs to /agi/feedback with required fields', async () => {
      mockFetch.mockResolvedValueOnce(okResponse({ recorded: true, auto_retrain_triggered: false }));

      const result = await agi.feedback({
        engine_id: 'tax-v3',
        quality_score: 0.95,
      });

      expect(result.recorded).toBe(true);
      expect(result.auto_retrain_triggered).toBe(false);

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.engine_id).toBe('tax-v3');
      expect(body.quality_score).toBe(0.95);
      expect(body.query).toBeUndefined();
      expect(body.feedback_text).toBeUndefined();
    });

    it('includes optional query and feedback_text', async () => {
      mockFetch.mockResolvedValueOnce(okResponse({ recorded: true, auto_retrain_triggered: true }));

      await agi.feedback({
        engine_id: 'legal-v2',
        quality_score: 0.3,
        query: 'What is indemnification?',
        feedback_text: 'Missed key clause',
      });

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.query).toBe('What is indemnification?');
      expect(body.feedback_text).toBe('Missed key clause');
    });

    it('triggers auto-retrain for low scores', async () => {
      mockFetch.mockResolvedValueOnce(okResponse({ recorded: true, auto_retrain_triggered: true }));

      const result = await agi.feedback({
        engine_id: 'struggling-engine',
        quality_score: 0.1,
      });

      expect(result.auto_retrain_triggered).toBe(true);
    });
  });

  // ── retrain ───────────────────────────────────────────────────────────────

  describe('retrain', () => {
    it('POSTs to /agi/retrain with engine_id', async () => {
      mockFetch.mockResolvedValueOnce(okResponse({ job_id: 'retrain-001', status: 'queued' }));

      const result = await agi.retrain('tax-v3');

      expect(result.job_id).toBe('retrain-001');
      expect(result.status).toBe('queued');

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.engine_id).toBe('tax-v3');
      expect(body.reason).toBeUndefined();
    });

    it('includes optional reason', async () => {
      mockFetch.mockResolvedValueOnce(okResponse({ job_id: 'retrain-002', status: 'queued' }));

      await agi.retrain('legal-v2', 'Low quality score on contracts');

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.reason).toBe('Low quality score on contracts');
    });
  });

  // ── learningRate ──────────────────────────────────────────────────────────

  describe('learningRate', () => {
    it('GETs /agi/learning-rate', async () => {
      const rateData: LearningRate = {
        daily_improvement: 2.5,
        weekly_trend: 'up',
        top_improving_engines: [
          { engine_id: 'tax-v3', improvement: 15.2 },
        ],
        struggling_engines: [
          { engine_id: 'legacy-v1', score: 0.3 },
        ],
      };
      mockFetch.mockResolvedValueOnce(okResponse(rateData));

      const result = await agi.learningRate();
      expect(result.daily_improvement).toBe(2.5);
      expect(result.weekly_trend).toBe('up');
      expect(result.top_improving_engines).toHaveLength(1);
      expect(result.struggling_engines).toHaveLength(1);

      const url: string = mockFetch.mock.calls[0][0];
      expect(url).toContain('/agi/learning-rate');
    });
  });

  // ── suggestions ───────────────────────────────────────────────────────────

  describe('suggestions', () => {
    it('GETs /agi/suggestions', async () => {
      const suggestions: Suggestion[] = [
        {
          engine_id: 'legacy-v1',
          reason: 'Consistently low quality scores',
          current_score: 0.35,
          recommended_action: 'Retrain with updated doctrines',
        },
        {
          engine_id: 'security-v2',
          reason: 'Declining accuracy trend',
          current_score: 0.6,
          recommended_action: 'Add more training data for CVE patterns',
        },
      ];
      mockFetch.mockResolvedValueOnce(okResponse(suggestions));

      const result = await agi.suggestions();
      expect(result).toHaveLength(2);
      expect(result[0].engine_id).toBe('legacy-v1');
      expect(result[1].recommended_action).toContain('CVE');
    });
  });
});
