/** Echo Prime SDK v3.0 — Fleet Management module
 * Worker fleet monitoring, health checks, deployment orchestration.
 * Zero external dependencies.
 */
import { EchoHttpClient, type EchoClientConfig } from './client.js';

export type WorkerStatus = 'healthy' | 'degraded' | 'down' | 'unknown';

export interface FleetWorker {
  name: string;
  url: string;
  status: WorkerStatus;
  version?: string;
  uptime_ms?: number;
  last_check: string;
  latency_ms: number;
  error?: string;
}

export interface FleetDeployment {
  id: string;
  worker: string;
  version: string;
  status: 'deploying' | 'deployed' | 'failed' | 'rolled_back';
  deployed_at: string;
  deployed_by: string;
}

export interface ServiceRegistration {
  name: string;
  url: string;
  version: string;
  capabilities: string[];
  registered_at: string;
  last_heartbeat: string;
  healthy: boolean;
}

export interface FleetStats {
  total_workers: number;
  healthy: number;
  degraded: number;
  down: number;
  total_requests_24h: number;
  avg_latency_ms: number;
  deployments_24h: number;
}

export class EchoFleet {
  private client: EchoHttpClient;

  constructor(config: EchoClientConfig) {
    this.client = new EchoHttpClient(config);
  }

  /** Get fleet health overview */
  async health(): Promise<FleetWorker[]> {
    return this.client.request<FleetWorker[]>('/fleet/health');
  }

  /** Get single worker status */
  async workerStatus(workerName: string): Promise<FleetWorker> {
    return this.client.request<FleetWorker>('/fleet/worker', {
      params: { name: workerName },
    });
  }

  /** List all registered services */
  async services(): Promise<ServiceRegistration[]> {
    return this.client.request<ServiceRegistration[]>('/fleet/services');
  }

  /** Register a service */
  async register(name: string, url: string, capabilities: string[]): Promise<ServiceRegistration> {
    return this.client.request<ServiceRegistration>('/fleet/register', {
      method: 'POST',
      body: { name, url, capabilities },
    });
  }

  /** Get deployment history */
  async deployments(opts?: { worker?: string; limit?: number }): Promise<FleetDeployment[]> {
    return this.client.request<FleetDeployment[]>('/fleet/deployments', {
      params: {
        ...(opts?.worker ? { worker: opts.worker } : {}),
        limit: String(opts?.limit ?? 50),
      },
    });
  }

  /** Deploy a worker */
  async deploy(workerName: string, opts?: { version?: string }): Promise<FleetDeployment> {
    return this.client.request<FleetDeployment>('/fleet/deploy', {
      method: 'POST',
      body: { worker: workerName, version: opts?.version },
    });
  }

  /** Get fleet stats */
  async stats(): Promise<FleetStats> {
    return this.client.request<FleetStats>('/fleet/stats');
  }
}
