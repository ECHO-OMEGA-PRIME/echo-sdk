/** Echo Prime SDK v3.0 — Voice module (Echo Speak Cloud)
 * TTS synthesis, STT transcription, voice cloning, emotion tags.
 * Zero external dependencies.
 */
import { EchoHttpClient, type EchoClientConfig } from './client.js';

export type VoiceId = 'echo' | 'bree' | 'gs343' | 'prometheus' | 'phoenix' | 'commander' | string;

export type Emotion =
  | 'laughs' | 'whispers' | 'sighs' | 'sarcastic' | 'excited'
  | 'crying' | 'curious' | 'angry' | 'neutral' | 'warm' | 'stern' | 'playful';

export interface SynthesizeOptions {
  /** Voice to use. Default: 'echo' */
  voice?: VoiceId;
  /** Emotion tag to inject. Default: none */
  emotion?: Emotion;
  /** Audio format. Default: 'mp3' */
  format?: 'mp3' | 'wav' | 'ogg';
  /** Speaking speed multiplier. Default: 1.0 */
  speed?: number;
}

export interface TranscribeOptions {
  /** Language hint (ISO 639-1). Default: 'en' */
  language?: string;
}

export interface VoiceInfo {
  id: string;
  name: string;
  description: string;
  gender: string;
  engine: string;
}

export interface EmotionAnalysis {
  dominant_emotion: string;
  confidence: number;
  layers: Record<string, unknown>;
}

export class EchoVoice {
  private client: EchoHttpClient;

  constructor(config: EchoClientConfig) {
    this.client = new EchoHttpClient(config);
  }

  /** Synthesize text to speech. Returns audio as ArrayBuffer. */
  async synthesize(text: string, opts: SynthesizeOptions = {}): Promise<ArrayBuffer> {
    const { voice = 'echo', emotion, format = 'mp3', speed = 1.0 } = opts;

    // Apply emotion tag if specified
    const processedText = emotion ? `[${emotion}] ${text}` : text;

    return this.client.request<ArrayBuffer>('/voice/tts', {
      method: 'POST',
      body: {
        text: processedText,
        voice,
        format,
        speed,
      },
    });
  }

  /** Transcribe audio to text (STT). */
  async transcribe(
    audioBase64: string,
    opts: TranscribeOptions = {},
  ): Promise<{ text: string; confidence: number; language: string }> {
    return this.client.request('/voice/stt', {
      method: 'POST',
      body: {
        audio: audioBase64,
        language: opts.language ?? 'en',
      },
    });
  }

  /** Analyze emotion in text using the 4-layer emotion engine. */
  async analyzeEmotion(text: string, personality?: string): Promise<EmotionAnalysis> {
    return this.client.request<EmotionAnalysis>('/voice/emotion/analyze', {
      method: 'POST',
      body: { text, ...(personality ? { personality } : {}) },
    });
  }

  /** Apply emotion tags to text for TTS. */
  async applyEmotionTags(text: string, personality?: string): Promise<{ text: string; tags_applied: string[] }> {
    return this.client.request('/voice/emotion/apply-tags', {
      method: 'POST',
      body: { text, ...(personality ? { personality } : {}) },
    });
  }

  /** Orchestrated TTS with quota-aware provider blending. */
  async orchestrate(
    text: string,
    voice: VoiceId = 'echo',
    opts?: { emotion?: Emotion; priority?: 'quality' | 'speed' | 'cost' },
  ): Promise<ArrayBuffer> {
    return this.client.request<ArrayBuffer>('/voice/tts/orchestrate', {
      method: 'POST',
      body: {
        text,
        voice,
        emotion: opts?.emotion,
        priority: opts?.priority ?? 'quality',
      },
    });
  }

  /** List available voices. */
  async listVoices(): Promise<VoiceInfo[]> {
    return this.client.request<VoiceInfo[]>('/voice/voices');
  }

  /** Clone a voice from audio samples. Returns new voice ID. */
  async cloneVoice(
    name: string,
    samplesBase64: string[],
    description?: string,
  ): Promise<{ voice_id: string; name: string }> {
    return this.client.request('/voice/voices/clone', {
      method: 'POST',
      body: { name, samples: samplesBase64, description },
    });
  }

  /** Prepare text for TTS (strip markdown, expand abbreviations, etc.) */
  async prepareText(text: string): Promise<{ text: string; changes: string[] }> {
    return this.client.request('/voice/text/prepare', {
      method: 'POST',
      body: { text },
    });
  }
}
