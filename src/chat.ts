/** Echo Prime SDK v3.0 — Chat module
 * Conversational AI with 14 personalities, streaming, conversation history.
 * Zero external dependencies.
 */
import { EchoHttpClient, type EchoClientConfig } from './client.js';

export type Personality =
  | 'echo_prime' | 'bree' | 'raven' | 'sage' | 'thinker' | 'nexus' | 'gs343'
  | 'phoenix' | 'prometheus' | 'belle' | 'tech_expert' | 'warmaster' | 'r2' | 'third_person'
  | string;

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatOptions {
  /** AI personality. Default: 'echo_prime' */
  personality?: Personality;
  /** Domain hint for engine routing (e.g., 'tax', 'legal', 'oilfield') */
  domain?: string;
  /** Conversation history for context */
  history?: ChatMessage[];
  /** Maximum response tokens */
  maxTokens?: number;
  /** Temperature (0.0-1.0) */
  temperature?: number;
  /** Include engine doctrine enrichment */
  enrichWithEngines?: boolean;
  /** Include knowledge forge context */
  enrichWithKnowledge?: boolean;
}

export interface ChatResponse {
  message: string;
  personality: string;
  tokens_used: number;
  model: string;
  domain_detected?: string;
  engines_consulted?: number;
  knowledge_chunks?: number;
  latency_ms: number;
}

export interface ConversationSession {
  id: string;
  personality: Personality;
  messages: ChatMessage[];
  created_at: string;
  domain?: string;
}

export class EchoChat {
  private client: EchoHttpClient;
  private sessions = new Map<string, ConversationSession>();

  constructor(config: EchoClientConfig) {
    this.client = new EchoHttpClient(config);
  }

  /** Send a message and get an AI response */
  async send(message: string, opts: ChatOptions = {}): Promise<ChatResponse> {
    return this.client.request<ChatResponse>('/chat', {
      method: 'POST',
      body: {
        message,
        personality: opts.personality,
        domain: opts.domain,
        history: opts.history,
        max_tokens: opts.maxTokens,
        temperature: opts.temperature,
        enrich_engines: opts.enrichWithEngines,
        enrich_knowledge: opts.enrichWithKnowledge,
      },
    });
  }

  /** Start a conversation session with memory */
  createSession(personality: Personality = 'echo_prime', domain?: string): ConversationSession {
    const session: ConversationSession = {
      id: generateId(),
      personality,
      messages: [],
      created_at: new Date().toISOString(),
      domain,
    };
    this.sessions.set(session.id, session);
    return session;
  }

  /** Send a message within a session (auto-manages history) */
  async sendInSession(sessionId: string, message: string): Promise<ChatResponse> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error(`Session '${sessionId}' not found`);

    session.messages.push({ role: 'user', content: message });

    const response = await this.send(message, {
      personality: session.personality,
      domain: session.domain,
      history: session.messages.slice(-20), // Last 20 messages for context
      enrichWithEngines: true,
      enrichWithKnowledge: true,
    });

    session.messages.push({ role: 'assistant', content: response.message });
    return response;
  }

  /** Get a session by ID */
  getSession(sessionId: string): ConversationSession | undefined {
    return this.sessions.get(sessionId);
  }

  /** List all active sessions */
  listSessions(): ConversationSession[] {
    return Array.from(this.sessions.values());
  }

  /** Clear a session's history */
  clearSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) session.messages = [];
  }

  /** Delete a session */
  deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  /** List available personalities */
  async listPersonalities(): Promise<Array<{ id: string; name: string; description: string; color: string }>> {
    return this.client.request('/chat/personalities');
  }
}

function generateId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 12; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return `ses_${id}`;
}
