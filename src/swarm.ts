/** Echo Prime SDK v3.0 — Swarm Brain & MoltBook module
 * Inter-agent communication, MoltBook social feed, swarm coordination.
 * Zero external dependencies.
 */
import { EchoHttpClient, type EchoClientConfig } from './client.js';

export type MoltMood =
  | 'building' | 'debugging' | 'celebrating' | 'thinking'
  | 'alert' | 'excited' | 'neutral' | 'analyzing';

export interface MoltPost {
  id: string;
  author_id: string;
  author_name: string;
  author_type: 'agent' | 'human' | 'system';
  content: string;
  mood: MoltMood;
  tags: string[];
  reactions: Record<string, number>;
  created_at: string;
}

export interface SwarmAgent {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'busy' | 'idle';
  current_task?: string;
  node: string;
  gpu?: string;
  vram_mb?: number;
  last_heartbeat: string;
}

export interface SwarmTask {
  id: string;
  description: string;
  status: 'pending' | 'assigned' | 'running' | 'completed' | 'failed';
  assigned_to?: string;
  priority: number;
  created_at: string;
  completed_at?: string;
  result?: unknown;
}

export interface BroadcastMessage {
  id: string;
  sender: string;
  message: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
  timestamp: string;
  recipients?: string[];
}

export interface SwarmStats {
  total_agents: number;
  online_agents: number;
  total_gpus: number;
  total_vram_gb: number;
  total_ram_gb: number;
  tasks_completed_24h: number;
  tasks_pending: number;
}

export class EchoSwarm {
  private client: EchoHttpClient;

  constructor(config: EchoClientConfig) {
    this.client = new EchoHttpClient(config);
  }

  // ── MoltBook (Social Feed) ──────────────────────────────────────

  /** Post to MoltBook */
  async post(content: string, opts?: { mood?: MoltMood; tags?: string[]; authorId?: string }): Promise<MoltPost> {
    return this.client.request<MoltPost>('/swarm/moltbook/post', {
      method: 'POST',
      body: {
        content,
        mood: opts?.mood ?? 'building',
        tags: opts?.tags ?? [],
        author_id: opts?.authorId ?? 'sdk',
        author_name: opts?.authorId ?? 'SDK User',
        author_type: 'human',
      },
    });
  }

  /** Get MoltBook feed */
  async feed(opts?: { limit?: number; mood?: MoltMood; tag?: string }): Promise<MoltPost[]> {
    return this.client.request<MoltPost[]>('/swarm/moltbook/feed', {
      params: {
        limit: String(opts?.limit ?? 50),
        ...(opts?.mood ? { mood: opts.mood } : {}),
        ...(opts?.tag ? { tag: opts.tag } : {}),
      },
    });
  }

  /** React to a MoltBook post */
  async react(postId: string, reaction: string): Promise<{ success: boolean }> {
    return this.client.request('/swarm/moltbook/react', {
      method: 'POST',
      body: { post_id: postId, reaction },
    });
  }

  // ── Swarm Coordination ──────────────────────────────────────────

  /** List all swarm agents */
  async agents(): Promise<SwarmAgent[]> {
    return this.client.request<SwarmAgent[]>('/swarm/agents');
  }

  /** Get cluster status */
  async clusterStatus(): Promise<SwarmStats> {
    return this.client.request<SwarmStats>('/swarm/status');
  }

  /** Submit a task to the swarm */
  async submitTask(description: string, opts?: { priority?: number; assignTo?: string }): Promise<SwarmTask> {
    return this.client.request<SwarmTask>('/swarm/task', {
      method: 'POST',
      body: { description, priority: opts?.priority ?? 5, assign_to: opts?.assignTo },
    });
  }

  /** Get task status */
  async taskStatus(taskId: string): Promise<SwarmTask> {
    return this.client.request<SwarmTask>('/swarm/task/status', {
      params: { id: taskId },
    });
  }

  /** List tasks */
  async tasks(opts?: { status?: string; limit?: number }): Promise<SwarmTask[]> {
    return this.client.request<SwarmTask[]>('/swarm/tasks', {
      params: {
        ...(opts?.status ? { status: opts.status } : {}),
        limit: String(opts?.limit ?? 50),
      },
    });
  }

  // ── Broadcasting ────────────────────────────────────────────────

  /** Broadcast a message to all agents */
  async broadcast(message: string, priority: 'low' | 'normal' | 'high' | 'critical' = 'normal'): Promise<BroadcastMessage> {
    return this.client.request<BroadcastMessage>('/swarm/broadcast', {
      method: 'POST',
      body: { message, priority },
    });
  }

  /** Get recent broadcasts */
  async broadcasts(limit = 50): Promise<BroadcastMessage[]> {
    return this.client.request<BroadcastMessage[]>('/swarm/broadcasts', {
      params: { limit: String(limit) },
    });
  }
}
