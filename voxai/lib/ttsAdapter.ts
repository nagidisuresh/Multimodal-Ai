/**
 * Pluggable TTS Adapter Interface.
 * Allows seamless switching between browser SpeechSynthesis and future Cloud/Gemini TTS APIs.
 */

export interface TTSOptions {
  voice?: SpeechSynthesisVoice | null;
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export interface TTSProvider {
  speak(text: string, options?: TTSOptions): Promise<void>;
  stop(): void;
  isSpeaking(): boolean;
  getVoices(): SpeechSynthesisVoice[];
}

export class BrowserTTSProvider implements TTSProvider {
  speak(text: string, options: TTSOptions = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        options.onError?.(new Error('SpeechSynthesis not supported in this environment'));
        return reject(new Error('SpeechSynthesis not supported'));
      }

      window.speechSynthesis.cancel();

      // Strip markdown syntax for natural voice reading
      const clean = text
        .replace(/[#*`_~\[\]]/g, ' ')
        .replace(/\(http[^)]+\)/g, '')
        .replace(/•|-/g, '')
        .trim();

      if (!clean) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(clean);
      if (options.voice) utterance.voice = options.voice;
      if (options.rate) utterance.rate = options.rate;
      if (options.pitch) utterance.pitch = options.pitch;
      if (options.volume !== undefined) utterance.volume = options.volume;
      if (options.lang) utterance.lang = options.lang;

      utterance.onstart = () => {
        options.onStart?.();
      };

      utterance.onend = () => {
        options.onEnd?.();
        resolve();
      };

      utterance.onerror = (e) => {
        options.onError?.(e);
        reject(e);
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  isSpeaking(): boolean {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      return window.speechSynthesis.speaking;
    }
    return false;
  }

  getVoices(): SpeechSynthesisVoice[] {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      return window.speechSynthesis.getVoices();
    }
    return [];
  }
}

export const defaultTTSProvider: TTSProvider = new BrowserTTSProvider();
