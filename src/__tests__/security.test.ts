import { describe, it, expect } from 'vitest';
import {
  redact,
  validateApiKey,
  validatePayloadSize,
  sanitizeInput,
  maskKey,
  timingSafeEqual,
  safeHeaders,
} from '../security.js';

// ── redact ──────────────────────────────────────────────────────────────────

describe('redact', () => {
  it('redacts X-Echo-API-Key header values', () => {
    const input = 'X-Echo-API-Key: my-secret-key-12345';
    expect(redact(input)).toBe('[REDACTED]');
  });

  it('redacts apiKey assignments', () => {
    const input = 'apiKey="my-secret-key-12345"';
    expect(redact(input)).toBe('[REDACTED]');
  });

  it('redacts Bearer tokens', () => {
    const input = 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.test';
    expect(redact(input)).toContain('[REDACTED]');
  });

  it('redacts password values', () => {
    const input = 'password="hunter2"';
    expect(redact(input)).toBe('[REDACTED]');
  });

  it('redacts secret values', () => {
    const input = 'secret="s3cr3t-value"';
    expect(redact(input)).toBe('[REDACTED]');
  });

  it('redacts token values', () => {
    const input = 'token="abc123def456"';
    expect(redact(input)).toBe('[REDACTED]');
  });

  it('leaves non-sensitive strings untouched', () => {
    const input = 'Just a normal log message about engines';
    expect(redact(input)).toBe(input);
  });

  it('handles multiple sensitive values in one string', () => {
    const input = 'X-Echo-API-Key: key123 and token="abc"';
    const result = redact(input);
    expect(result).not.toContain('key123');
    expect(result).not.toContain('abc');
  });
});

// ── validateApiKey ──────────────────────────────────────────────────────────

describe('validateApiKey', () => {
  it('accepts valid keys (8-256 chars)', () => {
    expect(validateApiKey('12345678')).toBe(true);
    expect(validateApiKey('echo-omega-prime-forge-x-2026')).toBe(true);
    expect(validateApiKey('a'.repeat(256))).toBe(true);
  });

  it('rejects keys shorter than 8 characters', () => {
    expect(validateApiKey('short')).toBe(false);
    expect(validateApiKey('1234567')).toBe(false);
    expect(validateApiKey('')).toBe(false);
  });

  it('rejects keys longer than 256 characters', () => {
    expect(validateApiKey('a'.repeat(257))).toBe(false);
  });

  it('rejects non-string values', () => {
    expect(validateApiKey(undefined)).toBe(false);
    expect(validateApiKey(null)).toBe(false);
    expect(validateApiKey(12345678)).toBe(false);
    expect(validateApiKey({})).toBe(false);
    expect(validateApiKey([])).toBe(false);
  });
});

// ── validatePayloadSize ─────────────────────────────────────────────────────

describe('validatePayloadSize', () => {
  it('allows payloads under 1MB', () => {
    expect(() => validatePayloadSize({ data: 'small' })).not.toThrow();
    expect(() => validatePayloadSize('a'.repeat(1000))).not.toThrow();
  });

  it('throws for payloads over 1MB', () => {
    const big = { data: 'x'.repeat(1_048_577) };
    expect(() => validatePayloadSize(big)).toThrow(/exceeds/);
  });

  it('does not throw for null/undefined', () => {
    expect(() => validatePayloadSize(null)).not.toThrow();
    expect(() => validatePayloadSize(undefined)).not.toThrow();
  });

  it('handles string body', () => {
    expect(() => validatePayloadSize('a'.repeat(500_000))).not.toThrow();
  });
});

// ── sanitizeInput ───────────────────────────────────────────────────────────

describe('sanitizeInput', () => {
  it('strips control characters', () => {
    const input = 'hello\x00\x01\x02world';
    expect(sanitizeInput(input)).toBe('helloworld');
  });

  it('preserves normal whitespace (tab, newline, CR)', () => {
    const input = 'line1\nline2\tindented\r\nline3';
    expect(sanitizeInput(input)).toBe(input);
  });

  it('truncates to max length', () => {
    const long = 'a'.repeat(200);
    expect(sanitizeInput(long, 50)).toBe('a'.repeat(50));
  });

  it('uses default max length of 10000', () => {
    const long = 'b'.repeat(15000);
    expect(sanitizeInput(long).length).toBe(10000);
  });

  it('returns empty string for empty input', () => {
    expect(sanitizeInput('')).toBe('');
  });
});

// ── maskKey ─────────────────────────────────────────────────────────────────

describe('maskKey', () => {
  it('masks long keys (show first 4 and last 4)', () => {
    const key = 'echo-omega-prime-forge-x-2026'; // 29 chars
    const result = maskKey(key);
    // first 4 + (29-8)=21 stars + last 4
    expect(result).toBe('echo' + '*'.repeat(key.length - 8) + '2026');
    expect(result.startsWith('echo')).toBe(true);
    expect(result.endsWith('2026')).toBe(true);
  });

  it('returns **** for short keys (<=12 chars)', () => {
    expect(maskKey('123456789012')).toBe('****');
    expect(maskKey('short')).toBe('****');
    expect(maskKey('')).toBe('****');
  });

  it('works for exactly 13-char key', () => {
    const key = 'abcdefghijklm';
    const result = maskKey(key);
    expect(result).toBe('abcd*****jklm');
  });
});

// ── timingSafeEqual ─────────────────────────────────────────────────────────

describe('timingSafeEqual', () => {
  it('returns true for identical strings', () => {
    expect(timingSafeEqual('hello', 'hello')).toBe(true);
    expect(timingSafeEqual('echo-key-123', 'echo-key-123')).toBe(true);
  });

  it('returns false for different strings', () => {
    expect(timingSafeEqual('hello', 'world')).toBe(false);
    expect(timingSafeEqual('abc', 'abd')).toBe(false);
  });

  it('returns false for different lengths', () => {
    expect(timingSafeEqual('short', 'longer')).toBe(false);
    expect(timingSafeEqual('', 'notempty')).toBe(false);
  });

  it('returns true for empty strings', () => {
    expect(timingSafeEqual('', '')).toBe(true);
  });
});

// ── safeHeaders ─────────────────────────────────────────────────────────────

describe('safeHeaders', () => {
  it('masks X-Echo-API-Key header', () => {
    const result = safeHeaders({
      'X-Echo-API-Key': 'echo-omega-prime-forge-x-2026',
      'Content-Type': 'application/json',
    });
    expect(result['X-Echo-API-Key']).not.toBe('echo-omega-prime-forge-x-2026');
    expect(result['X-Echo-API-Key']).toContain('*');
    expect(result['Content-Type']).toBe('application/json');
  });

  it('masks Authorization header', () => {
    const result = safeHeaders({
      'Authorization': 'Bearer my-long-jwt-token-here',
    });
    expect(result['Authorization']).toContain('*');
    expect(result['Authorization']).not.toContain('jwt');
  });

  it('handles case-insensitive header names', () => {
    const result = safeHeaders({
      'x-echo-api-key': 'my-secret-api-key-value',
      'authorization': 'Bearer token12345678',
    });
    expect(result['x-echo-api-key']).toContain('*');
    expect(result['authorization']).toContain('*');
  });

  it('passes through non-sensitive headers', () => {
    const result = safeHeaders({
      'Content-Type': 'application/json',
      'X-SDK-Version': '3.0.0',
      'Accept': 'application/json',
    });
    expect(result['Content-Type']).toBe('application/json');
    expect(result['X-SDK-Version']).toBe('3.0.0');
    expect(result['Accept']).toBe('application/json');
  });
});
