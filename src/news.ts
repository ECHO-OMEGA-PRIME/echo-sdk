/** Echo Prime SDK v3.0 — News Scraper module
 * Multi-source news aggregation, sentiment analysis, topic tracking.
 * Zero external dependencies.
 */
import { EchoHttpClient, type EchoClientConfig } from './client.js';

export type NewsSentiment = 'bullish' | 'bearish' | 'neutral' | 'mixed';
export type NewsSource = 'rss' | 'api' | 'scrape' | 'social';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  source_type: NewsSource;
  category: string;
  sentiment: NewsSentiment;
  sentiment_score: number;
  published_at: string;
  scraped_at: string;
}

export interface NewsTopic {
  id: string;
  name: string;
  keywords: string[];
  article_count: number;
  avg_sentiment: number;
  trending: boolean;
}

export interface NewsAlert {
  id: string;
  name: string;
  keywords: string[];
  sentiment_filter?: NewsSentiment;
  active: boolean;
  last_triggered?: string;
  trigger_count: number;
}

export interface NewsStats {
  total_articles: number;
  articles_24h: number;
  sources_monitored: number;
  topics_tracked: number;
  avg_sentiment: number;
}

export class EchoNews {
  private client: EchoHttpClient;

  constructor(config: EchoClientConfig) {
    this.client = new EchoHttpClient(config);
  }

  /** Search news articles */
  async search(query: string, opts?: { sentiment?: NewsSentiment; source?: string; limit?: number; hours?: number }): Promise<NewsArticle[]> {
    return this.client.request<NewsArticle[]>('/news/search', {
      params: {
        q: query,
        ...(opts?.sentiment ? { sentiment: opts.sentiment } : {}),
        ...(opts?.source ? { source: opts.source } : {}),
        limit: String(opts?.limit ?? 20),
        hours: String(opts?.hours ?? 24),
      },
    });
  }

  /** Get latest news feed */
  async feed(opts?: { category?: string; limit?: number }): Promise<NewsArticle[]> {
    return this.client.request<NewsArticle[]>('/news/feed', {
      params: {
        ...(opts?.category ? { category: opts.category } : {}),
        limit: String(opts?.limit ?? 50),
      },
    });
  }

  /** Analyze sentiment of text */
  async analyzeSentiment(text: string): Promise<{ sentiment: NewsSentiment; score: number; keywords: string[] }> {
    return this.client.request('/news/sentiment', {
      method: 'POST',
      body: { text },
    });
  }

  /** Track a topic */
  async trackTopic(name: string, keywords: string[]): Promise<NewsTopic> {
    return this.client.request<NewsTopic>('/news/topic', {
      method: 'POST',
      body: { name, keywords },
    });
  }

  /** List tracked topics */
  async topics(): Promise<NewsTopic[]> {
    return this.client.request<NewsTopic[]>('/news/topics');
  }

  /** Create a news alert */
  async createAlert(name: string, keywords: string[], sentimentFilter?: NewsSentiment): Promise<NewsAlert> {
    return this.client.request<NewsAlert>('/news/alert', {
      method: 'POST',
      body: { name, keywords, sentiment_filter: sentimentFilter },
    });
  }

  /** Get news stats */
  async stats(): Promise<NewsStats> {
    return this.client.request<NewsStats>('/news/stats');
  }
}
