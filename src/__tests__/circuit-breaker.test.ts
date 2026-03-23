import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CircuitBreaker, type CircuitState } from '../circuit-breaker.js';

describe('CircuitBreaker', () => {
  let breaker: CircuitBreaker;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ── Default configuration ────────────────────────────────────────────────

  describe('defaults', () => {
    beforeEach(() => {
      breaker = new CircuitBreaker();
    });

    it('starts in CLOSED state', () => {
      expect(breaker.getState()).toBe('CLOSED');
    });

    it('allows execution when CLOSED', () => {
      expect(breaker.canExecute()).toBe(true);
    });

    it('has zero failures initially', () => {
      const info = breaker.getInfo();
      expect(info.state).toBe('CLOSED');
      expect(info.failures).toBe(0);
      expect(info.resetAt).toBe(0);
    });
  });

  // ── CLOSED → OPEN transition ─────────────────────────────────────────────

  describe('CLOSED → OPEN', () => {
    beforeEach(() => {
      breaker = new CircuitBreaker({ failureThreshold: 3 });
    });

    it('stays CLOSED below failure threshold', () => {
      breaker.recordFailure();
      breaker.recordFailure();
      expect(breaker.getState()).toBe('CLOSED');
      expect(breaker.canExecute()).toBe(true);
    });

    it('opens after reaching failure threshold', () => {
      breaker.recordFailure();
      breaker.recordFailure();
      breaker.recordFailure();
      expect(breaker.getState()).toBe('OPEN');
      expect(breaker.canExecute()).toBe(false);
    });

    it('tracks failure count in getInfo', () => {
      breaker.recordFailure();
      breaker.recordFailure();
      expect(breaker.getInfo().failures).toBe(2);
    });
  });

  // ── Success resets failure count in CLOSED ────────────────────────────────

  describe('success resets failures when CLOSED', () => {
    beforeEach(() => {
      breaker = new CircuitBreaker({ failureThreshold: 3 });
    });

    it('resets failure count on success', () => {
      breaker.recordFailure();
      breaker.recordFailure();
      breaker.recordSuccess();
      // Failure count should be 0 after success in CLOSED state
      expect(breaker.getInfo().failures).toBe(0);
      // Now even 2 more failures won't open it
      breaker.recordFailure();
      breaker.recordFailure();
      expect(breaker.getState()).toBe('CLOSED');
    });
  });

  // ── OPEN → HALF_OPEN transition ──────────────────────────────────────────

  describe('OPEN → HALF_OPEN', () => {
    beforeEach(() => {
      breaker = new CircuitBreaker({
        failureThreshold: 2,
        resetTimeoutMs: 5000,
      });
    });

    it('transitions to HALF_OPEN after reset timeout', () => {
      breaker.recordFailure();
      breaker.recordFailure();
      expect(breaker.getState()).toBe('OPEN');

      // Advance past the reset timeout
      vi.advanceTimersByTime(5001);
      expect(breaker.getState()).toBe('HALF_OPEN');
      expect(breaker.canExecute()).toBe(true);
    });

    it('stays OPEN before timeout expires', () => {
      breaker.recordFailure();
      breaker.recordFailure();
      vi.advanceTimersByTime(3000);
      expect(breaker.getState()).toBe('OPEN');
      expect(breaker.canExecute()).toBe(false);
    });

    it('reports resetAt time when OPEN', () => {
      vi.setSystemTime(10000);
      breaker.recordFailure();
      breaker.recordFailure();
      const info = breaker.getInfo();
      // resetAt = lastFailureTime + resetTimeoutMs = 10000 + 5000
      expect(info.resetAt).toBe(15000);
    });

    it('reports resetAt = 0 when not OPEN', () => {
      expect(breaker.getResetTime()).toBe(0);
    });
  });

  // ── HALF_OPEN → CLOSED transition ────────────────────────────────────────

  describe('HALF_OPEN → CLOSED', () => {
    beforeEach(() => {
      breaker = new CircuitBreaker({
        failureThreshold: 2,
        resetTimeoutMs: 1000,
        halfOpenSuccesses: 2,
      });
      // Open the breaker
      breaker.recordFailure();
      breaker.recordFailure();
      // Move to HALF_OPEN
      vi.advanceTimersByTime(1001);
    });

    it('closes after enough consecutive successes in HALF_OPEN', () => {
      expect(breaker.getState()).toBe('HALF_OPEN');
      breaker.recordSuccess();
      expect(breaker.getState()).toBe('HALF_OPEN');
      breaker.recordSuccess();
      expect(breaker.getState()).toBe('CLOSED');
    });

    it('resets failure count when closing from HALF_OPEN', () => {
      // Ensure state has transitioned to HALF_OPEN (getState triggers the transition)
      expect(breaker.getState()).toBe('HALF_OPEN');
      breaker.recordSuccess();
      breaker.recordSuccess();
      expect(breaker.getInfo().failures).toBe(0);
    });
  });

  // ── HALF_OPEN → OPEN (failure during probe) ──────────────────────────────

  describe('HALF_OPEN → OPEN on failure', () => {
    beforeEach(() => {
      breaker = new CircuitBreaker({
        failureThreshold: 2,
        resetTimeoutMs: 1000,
        halfOpenSuccesses: 3,
      });
      breaker.recordFailure();
      breaker.recordFailure();
      vi.advanceTimersByTime(1001);
    });

    it('reopens immediately on any failure during HALF_OPEN', () => {
      expect(breaker.getState()).toBe('HALF_OPEN');
      breaker.recordFailure();
      expect(breaker.getState()).toBe('OPEN');
      expect(breaker.canExecute()).toBe(false);
    });

    it('sets failure count to threshold after re-opening from HALF_OPEN', () => {
      breaker.recordFailure();
      expect(breaker.getInfo().failures).toBe(2);
    });
  });

  // ── Manual reset ─────────────────────────────────────────────────────────

  describe('manual reset', () => {
    it('resets from OPEN to CLOSED', () => {
      breaker = new CircuitBreaker({ failureThreshold: 1 });
      breaker.recordFailure();
      expect(breaker.getState()).toBe('OPEN');
      breaker.reset();
      expect(breaker.getState()).toBe('CLOSED');
      expect(breaker.getInfo().failures).toBe(0);
      expect(breaker.canExecute()).toBe(true);
    });
  });

  // ── Custom configuration ─────────────────────────────────────────────────

  describe('custom configuration', () => {
    it('uses custom failure threshold', () => {
      breaker = new CircuitBreaker({ failureThreshold: 10 });
      for (let i = 0; i < 9; i++) breaker.recordFailure();
      expect(breaker.getState()).toBe('CLOSED');
      breaker.recordFailure();
      expect(breaker.getState()).toBe('OPEN');
    });

    it('uses custom halfOpenSuccesses', () => {
      breaker = new CircuitBreaker({
        failureThreshold: 1,
        resetTimeoutMs: 100,
        halfOpenSuccesses: 5,
      });
      breaker.recordFailure();
      vi.advanceTimersByTime(101);
      // Must call getState() to trigger OPEN -> HALF_OPEN transition
      expect(breaker.getState()).toBe('HALF_OPEN');
      for (let i = 0; i < 4; i++) {
        breaker.recordSuccess();
        expect(breaker.getState()).toBe('HALF_OPEN');
      }
      breaker.recordSuccess();
      expect(breaker.getState()).toBe('CLOSED');
    });
  });
});
