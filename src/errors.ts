/** Echo Prime SDK v3.0 — Error hierarchy
 * Zero external dependencies. All errors carry structured context for debugging.
 */

/** Base SDK error — all Echo errors extend this */
export class EchoError extends Error {
  readonly code: string;
  readonly status: number;
  readonly retryable: boolean;
  readonly context: Record<string, unknown>;
  readonly timestamp: string;

  constructor(
    message: string,
    code: string,
    status: number,
    opts?: { retryable?: boolean; context?: Record<string, unknown> },
  ) {
    super(message);
    this.name = 'EchoError';
    this.code = code;
    this.status = status;
    this.retryable = opts?.retryable ?? false;
    this.context = opts?.context ?? {};
    this.timestamp = new Date().toISOString();
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      status: this.status,
      retryable: this.retryable,
      context: this.context,
      timestamp: this.timestamp,
    };
  }
}

/** Auth errors — invalid/expired API key, rate limited */
export class AuthError extends EchoError {
  constructor(message: string, code = 'AUTH_ERROR', status = 401) {
    super(message, code, status, { retryable: false });
    this.name = 'AuthError';
  }
}

/** Rate limit exceeded */
export class RateLimitError extends EchoError {
  readonly retryAfterMs: number;

  constructor(message: string, retryAfterMs = 60000) {
    super(message, 'RATE_LIMITED', 429, { retryable: true, context: { retryAfterMs } });
    this.name = 'RateLimitError';
    this.retryAfterMs = retryAfterMs;
  }
}

/** Request timed out */
export class TimeoutError extends EchoError {
  constructor(message = 'Request timed out', timeoutMs?: number) {
    super(message, 'TIMEOUT', 408, { retryable: true, context: { timeoutMs } });
    this.name = 'TimeoutError';
  }
}

/** Network/connection error */
export class NetworkError extends EchoError {
  constructor(message: string, cause?: Error) {
    super(message, 'NETWORK_ERROR', 0, {
      retryable: true,
      context: { cause: cause?.message },
    });
    this.name = 'NetworkError';
  }
}

/** Validation error — bad input from the caller */
export class ValidationError extends EchoError {
  readonly field?: string;

  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR', 400, { retryable: false, context: { field } });
    this.name = 'ValidationError';
    this.field = field;
  }
}

/** Resource not found */
export class NotFoundError extends EchoError {
  constructor(resource: string, id?: string) {
    const msg = id ? `${resource} '${id}' not found` : `${resource} not found`;
    super(msg, 'NOT_FOUND', 404, { retryable: false, context: { resource, id } });
    this.name = 'NotFoundError';
  }
}

/** Circuit breaker is open — calls are being rejected */
export class CircuitOpenError extends EchoError {
  readonly resetAtMs: number;

  constructor(resetAtMs: number) {
    super('Circuit breaker is open — service temporarily unavailable', 'CIRCUIT_OPEN', 503, {
      retryable: false,
      context: { resetAtMs, resetAt: new Date(resetAtMs).toISOString() },
    });
    this.name = 'CircuitOpenError';
    this.resetAtMs = resetAtMs;
  }
}

/** Server returned an unexpected response */
export class ServerError extends EchoError {
  constructor(message: string, status: number) {
    super(message, `HTTP_${status}`, status, {
      retryable: status >= 500,
    });
    this.name = 'ServerError';
  }
}

/** Determine if an error is retryable per CONTRACT §6 */
export function isRetryableStatus(status: number): boolean {
  return status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
}

/** Determine if a caught error is retryable */
export function isRetryableError(err: unknown): boolean {
  if (err instanceof EchoError) return err.retryable;
  if (err instanceof Error) {
    return err.name === 'AbortError' || err.message.includes('fetch failed');
  }
  return false;
}

/** Convert any unknown error into an EchoError */
export function normalizeError(err: unknown): EchoError {
  if (err instanceof EchoError) return err;
  if (err instanceof Error) {
    if (err.name === 'AbortError') return new TimeoutError();
    return new NetworkError(err.message, err);
  }
  return new EchoError(String(err), 'UNKNOWN', 0);
}
