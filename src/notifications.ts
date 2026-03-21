/** Echo Prime SDK v3.0 — Notifications module
 * Multi-channel notifications: email, SMS, Telegram, Discord, Slack, MoltBook.
 * Zero external dependencies.
 */
import { EchoHttpClient, type EchoClientConfig } from './client.js';

export type NotificationChannel = 'email' | 'sms' | 'telegram' | 'discord' | 'slack' | 'moltbook' | 'webhook';
export type NotificationPriority = 'low' | 'normal' | 'high' | 'critical';
export type NotificationStatus = 'pending' | 'sent' | 'delivered' | 'failed';

export interface Notification {
  id: string;
  channel: NotificationChannel;
  recipient: string;
  subject?: string;
  message: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  sent_at?: string;
  created_at: string;
}

export interface NotificationRule {
  id: string;
  name: string;
  condition: string;
  channels: NotificationChannel[];
  priority: NotificationPriority;
  active: boolean;
  trigger_count: number;
  last_triggered?: string;
}

export interface NotificationStats {
  total_sent: number;
  sent_24h: number;
  by_channel: Record<NotificationChannel, number>;
  delivery_rate: number;
  active_rules: number;
}

export class EchoNotifications {
  private client: EchoHttpClient;

  constructor(config: EchoClientConfig) {
    this.client = new EchoHttpClient(config);
  }

  /** Send a notification */
  async send(channel: NotificationChannel, recipient: string, message: string, opts?: { subject?: string; priority?: NotificationPriority }): Promise<Notification> {
    return this.client.request<Notification>('/notifications/send', {
      method: 'POST',
      body: {
        channel,
        recipient,
        message,
        subject: opts?.subject,
        priority: opts?.priority ?? 'normal',
      },
    });
  }

  /** Send to multiple channels */
  async broadcast(channels: NotificationChannel[], message: string, opts?: { subject?: string; priority?: NotificationPriority }): Promise<Notification[]> {
    return this.client.request<Notification[]>('/notifications/broadcast', {
      method: 'POST',
      body: {
        channels,
        message,
        subject: opts?.subject,
        priority: opts?.priority ?? 'normal',
      },
    });
  }

  /** Create a notification rule */
  async createRule(name: string, condition: string, channels: NotificationChannel[], priority: NotificationPriority = 'normal'): Promise<NotificationRule> {
    return this.client.request<NotificationRule>('/notifications/rule', {
      method: 'POST',
      body: { name, condition, channels, priority },
    });
  }

  /** List notification rules */
  async rules(): Promise<NotificationRule[]> {
    return this.client.request<NotificationRule[]>('/notifications/rules');
  }

  /** Get notification history */
  async history(opts?: { channel?: NotificationChannel; limit?: number }): Promise<Notification[]> {
    return this.client.request<Notification[]>('/notifications/history', {
      params: {
        ...(opts?.channel ? { channel: opts.channel } : {}),
        limit: String(opts?.limit ?? 50),
      },
    });
  }

  /** Get notification stats */
  async stats(): Promise<NotificationStats> {
    return this.client.request<NotificationStats>('/notifications/stats');
  }
}
