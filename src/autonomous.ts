/** Echo Prime SDK v3.0 — Autonomous Daemon module
 * 24/7 health monitoring, auto-tasks, pattern detection, fleet oversight.
 * Zero external dependencies.
 */
import { EchoHttpClient, type EchoClientConfig } from './client.js';

export type DaemonTaskStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
export type HealthGrade = 'A' | 'B' | 'C' | 'D' | 'F';

export interface DaemonStatus {
  running: boolean;
  uptime_ms: number;
  workers_monitored: number;
  tasks_completed_24h: number;
  patterns_detected: number;
  health_grade: HealthGrade;
  last_check: string;
}

export interface AutoTask {
  id: string;
  type: string;
  description: string;
  status: DaemonTaskStatus;
  priority: number;
  trigger: string;
  result?: unknown;
  created_at: string;
  completed_at?: string;
}

export interface DetectedPattern {
  id: string;
  type: string;
  description: string;
  occurrences: number;
  first_seen: string;
  last_seen: string;
  action_taken?: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface WorkerHealthReport {
  worker: string;
  status: 'healthy' | 'degraded' | 'down';
  latency_ms: number;
  error_rate_1h: number;
  uptime_percent: number;
  last_check: string;
  issues: string[];
}

export interface DaemonStats {
  uptime_hours: number;
  total_checks: number;
  issues_found: number;
  issues_resolved: number;
  auto_tasks_run: number;
  patterns_detected: number;
}

export class EchoAutonomous {
  private client: EchoHttpClient;

  constructor(config: EchoClientConfig) {
    this.client = new EchoHttpClient(config);
  }

  /** Get daemon status */
  async status(): Promise<DaemonStatus> {
    return this.client.request<DaemonStatus>('/daemon/status');
  }

  /** Get worker health reports */
  async healthReport(): Promise<WorkerHealthReport[]> {
    return this.client.request<WorkerHealthReport[]>('/daemon/health');
  }

  /** List auto-tasks */
  async tasks(opts?: { status?: DaemonTaskStatus; limit?: number }): Promise<AutoTask[]> {
    return this.client.request<AutoTask[]>('/daemon/tasks', {
      params: {
        ...(opts?.status ? { status: opts.status } : {}),
        limit: String(opts?.limit ?? 50),
      },
    });
  }

  /** Create a manual task */
  async createTask(description: string, opts?: { priority?: number; type?: string }): Promise<AutoTask> {
    return this.client.request<AutoTask>('/daemon/task', {
      method: 'POST',
      body: { description, priority: opts?.priority ?? 5, type: opts?.type ?? 'manual' },
    });
  }

  /** Get detected patterns */
  async patterns(opts?: { severity?: string; limit?: number }): Promise<DetectedPattern[]> {
    return this.client.request<DetectedPattern[]>('/daemon/patterns', {
      params: {
        ...(opts?.severity ? { severity: opts.severity } : {}),
        limit: String(opts?.limit ?? 50),
      },
    });
  }

  /** Get daemon stats */
  async stats(): Promise<DaemonStats> {
    return this.client.request<DaemonStats>('/daemon/stats');
  }

  /** Trigger a full health sweep */
  async sweep(): Promise<{ success: boolean; workers_checked: number; issues_found: number }> {
    return this.client.request('/daemon/sweep', { method: 'POST' });
  }
}
