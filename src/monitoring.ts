/** Echo Prime SDK v3.0 — Monitoring & Telemetry module
 * Request metrics, circuit breaker status, cache stats, health checks.
 * Zero external dependencies.
 */

export interface RequestMetric {
  path: string;
  method: string;
  status: number;
  latencyMs: number;
  cached: boolean;
  retries: number;
  timestamp: string;
}

export interface MetricsSummary {
  totalRequests: number;
  successCount: number;
  errorCount: number;
  cacheHits: number;
  cacheMisses: number;
  avgLatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  errorRate: number;
  requestsPerSecond: number;
  byPath: Record<string, { count: number; avgMs: number; errors: number }>;
  circuitState: string;
  uptimeMs: number;
}

export class EchoMonitor {
  private metrics: RequestMetric[] = [];
  private readonly maxMetrics: number;
  private readonly startTime = Date.now();

  constructor(maxMetrics = 10_000) {
    this.maxMetrics = maxMetrics;
  }

  /** Record a request metric */
  record(metric: RequestMetric): void {
    this.metrics.push(metric);
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  /** Get a summary of all recorded metrics */
  summarize(windowMs?: number): MetricsSummary {
    const cutoff = windowMs ? Date.now() - windowMs : 0;
    const filtered = cutoff
      ? this.metrics.filter(m => new Date(m.timestamp).getTime() > cutoff)
      : this.metrics;

    if (filtered.length === 0) {
      return {
        totalRequests: 0, successCount: 0, errorCount: 0,
        cacheHits: 0, cacheMisses: 0, avgLatencyMs: 0,
        p95LatencyMs: 0, p99LatencyMs: 0, errorRate: 0,
        requestsPerSecond: 0, byPath: {}, circuitState: 'CLOSED',
        uptimeMs: Date.now() - this.startTime,
      };
    }

    const successes = filtered.filter(m => m.status >= 200 && m.status < 400);
    const errors = filtered.filter(m => m.status >= 400 || m.status === 0);
    const cacheHits = filtered.filter(m => m.cached).length;
    const latencies = filtered.map(m => m.latencyMs).sort((a, b) => a - b);

    const byPath: Record<string, { count: number; avgMs: number; errors: number }> = {};
    for (const m of filtered) {
      if (!byPath[m.path]) byPath[m.path] = { count: 0, avgMs: 0, errors: 0 };
      const entry = byPath[m.path];
      entry.avgMs = (entry.avgMs * entry.count + m.latencyMs) / (entry.count + 1);
      entry.count++;
      if (m.status >= 400 || m.status === 0) entry.errors++;
    }

    const spanMs = windowMs || (Date.now() - this.startTime);

    return {
      totalRequests: filtered.length,
      successCount: successes.length,
      errorCount: errors.length,
      cacheHits,
      cacheMisses: filtered.length - cacheHits,
      avgLatencyMs: Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length),
      p95LatencyMs: percentile(latencies, 0.95),
      p99LatencyMs: percentile(latencies, 0.99),
      errorRate: filtered.length > 0 ? errors.length / filtered.length : 0,
      requestsPerSecond: filtered.length / (spanMs / 1000),
      byPath,
      circuitState: 'CLOSED', // updated by caller
      uptimeMs: Date.now() - this.startTime,
    };
  }

  /** Get raw metrics (optionally filtered by path) */
  getMetrics(path?: string, limit = 100): RequestMetric[] {
    const filtered = path ? this.metrics.filter(m => m.path === path) : this.metrics;
    return filtered.slice(-limit);
  }

  /** Clear all recorded metrics */
  clear(): void {
    this.metrics = [];
  }

  /** Export metrics as JSON for external ingestion */
  export(): string {
    return JSON.stringify({
      summary: this.summarize(),
      recentErrors: this.metrics.filter(m => m.status >= 400).slice(-20),
      timestamp: new Date().toISOString(),
    });
  }
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.ceil(sorted.length * p) - 1;
  return sorted[Math.max(0, idx)];
}
