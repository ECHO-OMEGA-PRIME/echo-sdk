/** Echo Prime SDK v3.0 — Agent Builder module
 * Create, configure, and run autonomous AI agents.
 * Zero external dependencies.
 */
import { EchoHttpClient, type EchoClientConfig } from './client.js';

export interface AgentConfig {
  name: string;
  personality?: string;
  domain?: string;
  instructions?: string;
  tools?: string[];
  maxTurns?: number;
  temperature?: number;
}

export interface AgentRun {
  id: string;
  agent_id: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  turns: number;
  output?: string;
  started_at: string;
  completed_at?: string;
  error?: string;
}

export interface AgentInfo {
  id: string;
  name: string;
  personality: string;
  domain: string;
  tools: string[];
  created_at: string;
  total_runs: number;
}

export class EchoAgent {
  private client: EchoHttpClient;

  constructor(config: EchoClientConfig) {
    this.client = new EchoHttpClient(config);
  }

  /** Create a new agent */
  async create(agentConfig: AgentConfig): Promise<AgentInfo> {
    return this.client.request<AgentInfo>('/agent/create', {
      method: 'POST',
      body: {
        name: agentConfig.name,
        personality: agentConfig.personality ?? 'echo_prime',
        domain: agentConfig.domain,
        instructions: agentConfig.instructions,
        tools: agentConfig.tools ?? [],
        max_turns: agentConfig.maxTurns ?? 10,
        temperature: agentConfig.temperature ?? 0.7,
      },
    });
  }

  /** Run an agent with a task */
  async run(agentId: string, task: string, input?: Record<string, unknown>): Promise<AgentRun> {
    return this.client.request<AgentRun>('/agent/run', {
      method: 'POST',
      body: { agent_id: agentId, task, input },
    });
  }

  /** Get the status of a running agent */
  async status(runId: string): Promise<AgentRun> {
    return this.client.request<AgentRun>('/agent/run/status', {
      params: { run_id: runId },
    });
  }

  /** Cancel a running agent */
  async cancel(runId: string): Promise<{ success: boolean }> {
    return this.client.request('/agent/run/cancel', {
      method: 'POST',
      body: { run_id: runId },
    });
  }

  /** List all agents */
  async list(): Promise<AgentInfo[]> {
    return this.client.request<AgentInfo[]>('/agent/list');
  }

  /** Get agent details by ID */
  async get(agentId: string): Promise<AgentInfo> {
    return this.client.request<AgentInfo>('/agent/info', {
      params: { agent_id: agentId },
    });
  }

  /** Delete an agent */
  async delete(agentId: string): Promise<{ success: boolean }> {
    return this.client.request('/agent/delete', {
      method: 'DELETE',
      params: { agent_id: agentId },
    });
  }

  /** Get run history for an agent */
  async history(agentId: string, limit = 20): Promise<AgentRun[]> {
    return this.client.request<AgentRun[]>('/agent/history', {
      params: { agent_id: agentId, limit: String(limit) },
    });
  }
}
