/** Echo Prime SDK v3.0 — Circuit Breaker
 * CONTRACT §6: CLOSED → OPEN after 5 failures → HALF-OPEN after 60s
 * Zero external dependencies.
 */

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerConfig {
  /** Failures before opening the circuit. Default: 5 */
  failureThreshold?: number;
  /** Milliseconds before attempting half-open probe. Default: 60000 */
  resetTimeoutMs?: number;
  /** Successes in half-open before fully closing. Default: 2 */
  halfOpenSuccesses?: number;
}

export class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime = 0;
  private readonly failureThreshold: number;
  private readonly resetTimeoutMs: number;
  private readonly halfOpenSuccesses: number;

  constructor(config: CircuitBreakerConfig = {}) {
    this.failureThreshold = config.failureThreshold ?? 5;
    this.resetTimeoutMs = config.resetTimeoutMs ?? 60000;
    this.halfOpenSuccesses = config.halfOpenSuccesses ?? 2;
  }

  /** Current circuit state */
  getState(): CircuitState {
    if (this.state === 'OPEN' && Date.now() - this.lastFailureTime >= this.resetTimeoutMs) {
      this.state = 'HALF_OPEN';
      this.successCount = 0;
    }
    return this.state;
  }

  /** Check if the circuit allows a request through */
  canExecute(): boolean {
    const currentState = this.getState();
    return currentState === 'CLOSED' || currentState === 'HALF_OPEN';
  }

  /** Timestamp when circuit will transition to HALF_OPEN (0 if not OPEN) */
  getResetTime(): number {
    if (this.state !== 'OPEN') return 0;
    return this.lastFailureTime + this.resetTimeoutMs;
  }

  /** Record a successful call */
  recordSuccess(): void {
    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= this.halfOpenSuccesses) {
        this.state = 'CLOSED';
        this.failureCount = 0;
        this.successCount = 0;
      }
    } else if (this.state === 'CLOSED') {
      this.failureCount = 0;
    }
  }

  /** Record a failed call */
  recordFailure(): void {
    this.lastFailureTime = Date.now();
    if (this.state === 'HALF_OPEN') {
      this.state = 'OPEN';
      this.failureCount = this.failureThreshold;
    } else if (this.state === 'CLOSED') {
      this.failureCount++;
      if (this.failureCount >= this.failureThreshold) {
        this.state = 'OPEN';
      }
    }
  }

  /** Reset to CLOSED (manual override) */
  reset(): void {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = 0;
  }

  /** Get diagnostic info */
  getInfo(): { state: CircuitState; failures: number; resetAt: number } {
    return {
      state: this.getState(),
      failures: this.failureCount,
      resetAt: this.getResetTime(),
    };
  }
}
