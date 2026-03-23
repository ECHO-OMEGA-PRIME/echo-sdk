import { describe, it, expect } from 'vitest';
import {
  EchoError,
  AuthError,
  RateLimitError,
  TimeoutError,
  NetworkError,
  ValidationError,
  NotFoundError,
  CircuitOpenError,
  ServerError,
  isRetryableStatus,
  isRetryableError,
  normalizeError,
} from '../errors.js';

// ── EchoError (base class) ──────────────────────────────────────────────────

describe('EchoError', () => {
  it('stores code, status, retryable, and timestamp', () => {
    const err = new EchoError('boom', 'TEST_CODE', 500, { retryable: true });
    expect(err.message).toBe('boom');
    expect(err.code).toBe('TEST_CODE');
    expect(err.status).toBe(500);
    expect(err.retryable).toBe(true);
    expect(err.name).toBe('EchoError');
    expect(err.timestamp).toBeTruthy();
  });

  it('defaults retryable to false', () => {
    const err = new EchoError('x', 'X', 0);
    expect(err.retryable).toBe(false);
    expect(err.context).toEqual({});
  });

  it('accepts optional context', () => {
    const err = new EchoError('x', 'X', 0, { context: { foo: 'bar' } });
    expect(err.context).toEqual({ foo: 'bar' });
  });

  it('serializes to JSON', () => {
    const err = new EchoError('test', 'T', 418);
    const json = err.toJSON();
    expect(json).toMatchObject({
      name: 'EchoError',
      message: 'test',
      code: 'T',
      status: 418,
      retryable: false,
    });
    expect(json.timestamp).toBeTruthy();
  });

  it('is instanceof Error', () => {
    const err = new EchoError('x', 'X', 0);
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(EchoError);
  });
});

// ── Subclasses ──────────────────────────────────────────────────────────────

describe('AuthError', () => {
  it('defaults to status 401, not retryable', () => {
    const err = new AuthError('bad key');
    expect(err.name).toBe('AuthError');
    expect(err.status).toBe(401);
    expect(err.code).toBe('AUTH_ERROR');
    expect(err.retryable).toBe(false);
  });

  it('accepts custom code and status', () => {
    const err = new AuthError('forbidden', 'FORBIDDEN', 403);
    expect(err.status).toBe(403);
    expect(err.code).toBe('FORBIDDEN');
  });
});

describe('RateLimitError', () => {
  it('stores retryAfterMs and is retryable', () => {
    const err = new RateLimitError('slow down', 30000);
    expect(err.name).toBe('RateLimitError');
    expect(err.status).toBe(429);
    expect(err.retryable).toBe(true);
    expect(err.retryAfterMs).toBe(30000);
  });

  it('defaults retryAfterMs to 60000', () => {
    const err = new RateLimitError('rate limited');
    expect(err.retryAfterMs).toBe(60000);
  });
});

describe('TimeoutError', () => {
  it('is retryable with status 408', () => {
    const err = new TimeoutError('timed out', 5000);
    expect(err.name).toBe('TimeoutError');
    expect(err.status).toBe(408);
    expect(err.retryable).toBe(true);
    expect(err.context).toEqual({ timeoutMs: 5000 });
  });

  it('has default message', () => {
    const err = new TimeoutError();
    expect(err.message).toBe('Request timed out');
  });
});

describe('NetworkError', () => {
  it('is retryable with status 0', () => {
    const cause = new Error('ECONNREFUSED');
    const err = new NetworkError('connection refused', cause);
    expect(err.name).toBe('NetworkError');
    expect(err.status).toBe(0);
    expect(err.retryable).toBe(true);
    expect(err.context).toEqual({ cause: 'ECONNREFUSED' });
  });
});

describe('ValidationError', () => {
  it('is not retryable, stores field', () => {
    const err = new ValidationError('bad input', 'email');
    expect(err.name).toBe('ValidationError');
    expect(err.status).toBe(400);
    expect(err.retryable).toBe(false);
    expect(err.field).toBe('email');
  });
});

describe('NotFoundError', () => {
  it('formats message with resource and id', () => {
    const err = new NotFoundError('Engine', 'tax-v3');
    expect(err.message).toBe("Engine 'tax-v3' not found");
    expect(err.name).toBe('NotFoundError');
    expect(err.status).toBe(404);
  });

  it('formats message without id', () => {
    const err = new NotFoundError('Widget');
    expect(err.message).toBe('Widget not found');
  });
});

describe('CircuitOpenError', () => {
  it('stores resetAtMs and ISO reset time in context', () => {
    const resetAt = Date.now() + 60000;
    const err = new CircuitOpenError(resetAt);
    expect(err.name).toBe('CircuitOpenError');
    expect(err.status).toBe(503);
    expect(err.retryable).toBe(false);
    expect(err.resetAtMs).toBe(resetAt);
    expect(err.context.resetAt).toBeTruthy();
  });
});

describe('ServerError', () => {
  it('is retryable for 5xx', () => {
    const err = new ServerError('internal', 500);
    expect(err.name).toBe('ServerError');
    expect(err.retryable).toBe(true);
    expect(err.code).toBe('HTTP_500');
  });

  it('is not retryable for 4xx-range status passed in', () => {
    const err = new ServerError('bad', 400);
    expect(err.retryable).toBe(false);
  });
});

// ── Utility functions ───────────────────────────────────────────────────────

describe('isRetryableStatus', () => {
  it('returns true for 429, 500, 502, 503, 504', () => {
    expect(isRetryableStatus(429)).toBe(true);
    expect(isRetryableStatus(500)).toBe(true);
    expect(isRetryableStatus(502)).toBe(true);
    expect(isRetryableStatus(503)).toBe(true);
    expect(isRetryableStatus(504)).toBe(true);
  });

  it('returns false for non-retryable statuses', () => {
    expect(isRetryableStatus(200)).toBe(false);
    expect(isRetryableStatus(400)).toBe(false);
    expect(isRetryableStatus(401)).toBe(false);
    expect(isRetryableStatus(404)).toBe(false);
    expect(isRetryableStatus(418)).toBe(false);
  });
});

describe('isRetryableError', () => {
  it('returns true for retryable EchoErrors', () => {
    expect(isRetryableError(new TimeoutError())).toBe(true);
    expect(isRetryableError(new NetworkError('fail'))).toBe(true);
    expect(isRetryableError(new RateLimitError('limit'))).toBe(true);
  });

  it('returns false for non-retryable EchoErrors', () => {
    expect(isRetryableError(new AuthError('bad'))).toBe(false);
    expect(isRetryableError(new ValidationError('x'))).toBe(false);
  });

  it('handles AbortError', () => {
    const abort = new Error('Aborted');
    abort.name = 'AbortError';
    expect(isRetryableError(abort)).toBe(true);
  });

  it('handles fetch failed errors', () => {
    expect(isRetryableError(new Error('fetch failed'))).toBe(true);
  });

  it('returns false for unknown errors', () => {
    expect(isRetryableError('string error')).toBe(false);
    expect(isRetryableError(42)).toBe(false);
  });
});

describe('normalizeError', () => {
  it('returns EchoError as-is', () => {
    const original = new AuthError('test');
    expect(normalizeError(original)).toBe(original);
  });

  it('converts AbortError to TimeoutError', () => {
    const abort = new Error('Aborted');
    abort.name = 'AbortError';
    const normalized = normalizeError(abort);
    expect(normalized).toBeInstanceOf(TimeoutError);
  });

  it('converts generic Error to NetworkError', () => {
    const err = new Error('ECONNRESET');
    const normalized = normalizeError(err);
    expect(normalized).toBeInstanceOf(NetworkError);
    expect(normalized.message).toBe('ECONNRESET');
  });

  it('converts non-Error to EchoError with UNKNOWN code', () => {
    const normalized = normalizeError('just a string');
    expect(normalized).toBeInstanceOf(EchoError);
    expect(normalized.code).toBe('UNKNOWN');
    expect(normalized.message).toBe('just a string');
  });

  it('converts null to EchoError', () => {
    const normalized = normalizeError(null);
    expect(normalized).toBeInstanceOf(EchoError);
    expect(normalized.code).toBe('UNKNOWN');
  });
});
