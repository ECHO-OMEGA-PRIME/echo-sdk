/** Echo Prime SDK v3.0 — Workflows module
 * Multi-step workflow orchestration, cron scheduling, job management.
 * Zero external dependencies.
 */
import { EchoHttpClient, type EchoClientConfig } from './client.js';

export type WorkflowStatus = 'active' | 'paused' | 'completed' | 'failed' | 'draft';
export type StepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped';

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  steps: WorkflowStep[];
  schedule?: string;
  last_run?: string;
  run_count: number;
  created_at: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'api_call' | 'transform' | 'condition' | 'parallel' | 'delay' | 'notification';
  config: Record<string, unknown>;
  status: StepStatus;
  output?: unknown;
  duration_ms?: number;
}

export interface WorkflowRun {
  id: string;
  workflow_id: string;
  status: WorkflowStatus;
  steps_completed: number;
  steps_total: number;
  started_at: string;
  completed_at?: string;
  error?: string;
  outputs: Record<string, unknown>;
}

export interface CronJob {
  id: string;
  name: string;
  schedule: string;
  workflow_id?: string;
  command?: string;
  active: boolean;
  last_run?: string;
  next_run: string;
  run_count: number;
}

export interface WorkflowStats {
  total_workflows: number;
  active_workflows: number;
  total_runs: number;
  runs_24h: number;
  success_rate: number;
  active_crons: number;
}

export class EchoWorkflows {
  private client: EchoHttpClient;

  constructor(config: EchoClientConfig) {
    this.client = new EchoHttpClient(config);
  }

  /** Create a workflow */
  async create(name: string, steps: Omit<WorkflowStep, 'id' | 'status' | 'output' | 'duration_ms'>[], opts?: { description?: string; schedule?: string }): Promise<Workflow> {
    return this.client.request<Workflow>('/workflows/create', {
      method: 'POST',
      body: { name, steps, description: opts?.description, schedule: opts?.schedule },
    });
  }

  /** Run a workflow */
  async run(workflowId: string, inputs?: Record<string, unknown>): Promise<WorkflowRun> {
    return this.client.request<WorkflowRun>('/workflows/run', {
      method: 'POST',
      body: { workflow_id: workflowId, inputs },
    });
  }

  /** Get workflow run status */
  async runStatus(runId: string): Promise<WorkflowRun> {
    return this.client.request<WorkflowRun>('/workflows/run/status', {
      params: { id: runId },
    });
  }

  /** List workflows */
  async list(opts?: { status?: WorkflowStatus; limit?: number }): Promise<Workflow[]> {
    return this.client.request<Workflow[]>('/workflows/list', {
      params: {
        ...(opts?.status ? { status: opts.status } : {}),
        limit: String(opts?.limit ?? 50),
      },
    });
  }

  /** List cron jobs */
  async crons(opts?: { active?: boolean }): Promise<CronJob[]> {
    return this.client.request<CronJob[]>('/workflows/crons', {
      params: opts?.active !== undefined ? { active: String(opts.active) } : {},
    });
  }

  /** Create a cron job */
  async createCron(name: string, schedule: string, opts?: { workflowId?: string; command?: string }): Promise<CronJob> {
    return this.client.request<CronJob>('/workflows/cron', {
      method: 'POST',
      body: { name, schedule, workflow_id: opts?.workflowId, command: opts?.command },
    });
  }

  /** Get workflow stats */
  async stats(): Promise<WorkflowStats> {
    return this.client.request<WorkflowStats>('/workflows/stats');
  }
}
