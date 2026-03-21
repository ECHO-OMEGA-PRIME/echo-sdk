/** Echo Prime SDK v3.0 — Bot Factory module
 * Create, configure, and manage social media bots across platforms.
 * Zero external dependencies.
 */
import { EchoHttpClient, type EchoClientConfig } from './client.js';

export type BotPlatform = 'discord' | 'x' | 'telegram' | 'linkedin' | 'slack' | 'reddit' | 'whatsapp' | 'messenger' | 'instagram';

export interface BotConfig {
  name: string;
  platform: BotPlatform;
  personality?: string;
  /** Platform-specific credentials (stored encrypted) */
  credentials?: Record<string, string>;
  /** Cron schedule for autonomous posting */
  schedule?: string[];
  /** Content categories with weights (0-100) */
  contentWeights?: Record<string, number>;
  /** Domains for engine-backed responses */
  domains?: string[];
  /** Enable A/B testing */
  abTesting?: boolean;
}

export interface BotInfo {
  id: string;
  name: string;
  platform: BotPlatform;
  personality: string;
  status: 'active' | 'paused' | 'error' | 'pending_credentials';
  total_posts: number;
  total_interactions: number;
  created_at: string;
  last_active?: string;
}

export interface BotPost {
  id: string;
  bot_id: string;
  content: string;
  platform_post_id?: string;
  category: string;
  status: 'pending' | 'posted' | 'failed';
  engagement: { likes: number; comments: number; shares: number };
  posted_at?: string;
}

export interface BotStats {
  total_posts: number;
  total_interactions: number;
  engagement_rate: number;
  top_categories: Array<{ category: string; count: number; avg_engagement: number }>;
  posts_today: number;
  active_subscribers: number;
}

export class EchoBot {
  private client: EchoHttpClient;

  constructor(config: EchoClientConfig) {
    this.client = new EchoHttpClient(config);
  }

  /** Create a new bot */
  async create(botConfig: BotConfig): Promise<BotInfo> {
    return this.client.request<BotInfo>('/bot/create', {
      method: 'POST',
      body: {
        name: botConfig.name,
        platform: botConfig.platform,
        personality: botConfig.personality ?? 'echo_prime',
        credentials: botConfig.credentials,
        schedule: botConfig.schedule,
        content_weights: botConfig.contentWeights,
        domains: botConfig.domains,
        ab_testing: botConfig.abTesting ?? false,
      },
    });
  }

  /** List all bots */
  async list(platform?: BotPlatform): Promise<BotInfo[]> {
    return this.client.request<BotInfo[]>('/bot/list', {
      params: platform ? { platform } : {},
    });
  }

  /** Get bot details */
  async get(botId: string): Promise<BotInfo> {
    return this.client.request<BotInfo>('/bot/info', {
      params: { bot_id: botId },
    });
  }

  /** Trigger a manual post */
  async post(botId: string, content?: string, category?: string): Promise<BotPost> {
    return this.client.request<BotPost>('/bot/post', {
      method: 'POST',
      body: { bot_id: botId, content, category },
    });
  }

  /** Get bot statistics */
  async stats(botId: string): Promise<BotStats> {
    return this.client.request<BotStats>('/bot/stats', {
      params: { bot_id: botId },
    });
  }

  /** Get post history */
  async posts(botId: string, limit = 50): Promise<BotPost[]> {
    return this.client.request<BotPost[]>('/bot/posts', {
      params: { bot_id: botId, limit: String(limit) },
    });
  }

  /** Pause a bot */
  async pause(botId: string): Promise<{ success: boolean }> {
    return this.client.request('/bot/pause', {
      method: 'POST',
      body: { bot_id: botId },
    });
  }

  /** Resume a paused bot */
  async resume(botId: string): Promise<{ success: boolean }> {
    return this.client.request('/bot/resume', {
      method: 'POST',
      body: { bot_id: botId },
    });
  }

  /** Delete a bot */
  async delete(botId: string): Promise<{ success: boolean }> {
    return this.client.request('/bot/delete', {
      method: 'DELETE',
      params: { bot_id: botId },
    });
  }

  /** Update bot credentials */
  async updateCredentials(botId: string, credentials: Record<string, string>): Promise<{ success: boolean }> {
    return this.client.request('/bot/credentials', {
      method: 'PUT',
      body: { bot_id: botId, credentials },
    });
  }

  /** Get available bot templates */
  async templates(platform?: BotPlatform): Promise<Array<{ id: string; name: string; description: string; platform: BotPlatform; category: string }>> {
    return this.client.request('/bot/templates', {
      params: platform ? { platform } : {},
    });
  }
}
