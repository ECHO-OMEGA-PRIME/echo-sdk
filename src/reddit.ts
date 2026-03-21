/** Echo Prime SDK v3.0 — Reddit Monitor module
 * Subreddit monitoring, keyword alerts, sentiment tracking.
 * Zero external dependencies.
 */
import { EchoHttpClient, type EchoClientConfig } from './client.js';

export type RedditPostType = 'text' | 'link' | 'image' | 'video';

export interface RedditPost {
  id: string;
  subreddit: string;
  title: string;
  content: string;
  author: string;
  url: string;
  post_type: RedditPostType;
  score: number;
  comments: number;
  sentiment: number;
  matched_keywords: string[];
  created_at: string;
  scraped_at: string;
}

export interface SubredditWatch {
  id: string;
  subreddit: string;
  keywords: string[];
  min_score: number;
  active: boolean;
  post_count: number;
  last_checked: string;
}

export interface RedditAlert {
  id: string;
  subreddit: string;
  post_id: string;
  title: string;
  matched_keywords: string[];
  score: number;
  triggered_at: string;
}

export interface RedditStats {
  subreddits_monitored: number;
  total_posts: number;
  posts_24h: number;
  alerts_triggered: number;
  avg_sentiment: number;
}

export class EchoReddit {
  private client: EchoHttpClient;

  constructor(config: EchoClientConfig) {
    this.client = new EchoHttpClient(config);
  }

  /** Search monitored Reddit posts */
  async search(query: string, opts?: { subreddit?: string; minScore?: number; limit?: number }): Promise<RedditPost[]> {
    return this.client.request<RedditPost[]>('/reddit/search', {
      params: {
        q: query,
        ...(opts?.subreddit ? { subreddit: opts.subreddit } : {}),
        ...(opts?.minScore ? { min_score: String(opts.minScore) } : {}),
        limit: String(opts?.limit ?? 20),
      },
    });
  }

  /** Watch a subreddit */
  async watch(subreddit: string, keywords: string[], minScore = 0): Promise<SubredditWatch> {
    return this.client.request<SubredditWatch>('/reddit/watch', {
      method: 'POST',
      body: { subreddit, keywords, min_score: minScore },
    });
  }

  /** List watched subreddits */
  async watchlist(): Promise<SubredditWatch[]> {
    return this.client.request<SubredditWatch[]>('/reddit/watchlist');
  }

  /** Stop watching a subreddit */
  async unwatch(subreddit: string): Promise<{ success: boolean }> {
    return this.client.request('/reddit/watch', {
      method: 'DELETE',
      params: { subreddit },
    });
  }

  /** Get recent alerts */
  async alerts(opts?: { subreddit?: string; limit?: number }): Promise<RedditAlert[]> {
    return this.client.request<RedditAlert[]>('/reddit/alerts', {
      params: {
        ...(opts?.subreddit ? { subreddit: opts.subreddit } : {}),
        limit: String(opts?.limit ?? 50),
      },
    });
  }

  /** Get Reddit monitoring stats */
  async stats(): Promise<RedditStats> {
    return this.client.request<RedditStats>('/reddit/stats');
  }
}
