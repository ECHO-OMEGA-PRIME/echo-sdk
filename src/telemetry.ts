/** Echo Prime SDK v3.3 -- Telemetry Module
 * Lightweight request metrics collection with percentile computation.
 * Zero external dependencies.
 */

export interface TelemetryRecord {
  method: string;
  path: string;
  duration: number;
  status: number;
  timestamp: number;
}

export interface TelemetrySummary {
  totalRequests: number;
  avgLatency: number;
  errorRate: number;
  topEndpoints: { path: string; count: number }[];
  p50: number;
  p95: number;
  p99: number;
}

/**
 * Collects per-request telemetry and computes real-time summary
 * statistics including latency percentiles and error rates.
 */
export class Telemetry {
  private records: TelemetryRecord[] = [];
  private readonly maxRecords: number;

  constructor(maxRecords = 50_000) {
    this.maxRecords = maxRecords;
  }

  /** Track a completed request */
  trackRequest(method: string, path: string, duration: number, status: number): void {
    this.records.push({
      method,
      path,
      duration,
      status,
      timestamp: Date.now(),
    });

    // Circular buffer eviction
    if (this.records.length > this.maxRecords) {
      this.records = this.records.slice(-this.maxRecords);
    }
  }

  /** Get summary statistics across all recorded requests */
  summary(): TelemetrySummary {
    if (this.records.length === 0) {
      return {
        totalRequests: 0,
        avgLatency: 0,
        errorRate: 0,
        topEndpoints: [],
        p50: 0,
        p95: 0,
        p99: 0,
      };
    }

    const durations = this.records.map((r) => r.duration).sort((a, b) => a - b);
    const errorCount = this.records.filter((r) => r.status >= 400 || r.status === 0).length;

    // Endpoint frequency map
    const endpointCounts = new Map<string, number>();
    for (const r of this.records) {
      endpointCounts.set(r.path, (endpointCounts.get(r.path) ?? 0) + 1);
    }

    // Sort by count descending, take top 10
    const topEndpoints = Array.from(endpointCounts.entries())
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const totalDuration = durations.reduce((sum, d) => sum + d, 0);

    return {
      totalRequests: this.records.length,
      avgLatency: Math.round(totalDuration / durations.length),
      errorRate: this.records.length > 0 ? errorCount / this.records.length : 0,
      topEndpoints,
      p50: percentile(durations, 0.50),
      p95: percentile(durations, 0.95),
      p99: percentile(durations, 0.99),
    };
  }

  /** Get summary for a specific time window (ms) */
  summaryWindow(windowMs: number): TelemetrySummary {
    const cutoff = Date.now() - windowMs;
    const original = this.records;
    this.records = this.records.filter((r) => r.timestamp >= cutoff);
    const result = this.summary();
    this.records = original;
    return result;
  }

  /** Get raw records, optionally filtered by path */
  getRecords(path?: string, limit = 100): TelemetryRecord[] {
    const filtered = path ? this.records.filter((r) => r.path === path) : this.records;
    return filtered.slice(-limit);
  }

  /** Reset all counters and records */
  reset(): void {
    this.records = [];
  }

  /** Current record count */
  get size(): number {
    return this.records.length;
  }
}

/** Compute a percentile from a pre-sorted array */
function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.ceil(sorted.length * p) - 1;
  return sorted[Math.max(0, idx)];
}

export { Telemetry as default };
