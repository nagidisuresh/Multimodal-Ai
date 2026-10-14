export interface StoredChat {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Array<{
    role: 'user' | 'assistant' | 'model';
    content: string;
    timestamp: number;
  }>;
}

export interface StoredTranslation {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  style: string;
  isFavorite: boolean;
  createdAt: number;
}

export interface StoredTranscript {
  id: string;
  text: string;
  language: string;
  createdAt: number;
}

export interface UserSettings {
  defaultSourceLang: string;
  defaultTargetLang: string;
  aiResponseLang: string;
  speechVoice: string;
  speechRate: number;
  speechPitch: number;
  autoPlaySpeech: boolean;
  theme: 'dark' | 'light';
  saveHistory: boolean;
}

export const DEFAULT_SETTINGS: UserSettings = {
  defaultSourceLang: 'auto',
  defaultTargetLang: 'es',
  aiResponseLang: 'en',
  speechVoice: '',
  speechRate: 1.0,
  speechPitch: 1.0,
  autoPlaySpeech: false,
  theme: 'dark',
  saveHistory: true,
};

const KEYS = {
  CHATS: 'voxai_chats',
  TRANSLATIONS: 'voxai_translations',
  TRANSCRIPTS: 'voxai_transcripts',
  SETTINGS: 'voxai_settings',
};

function safeGet<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function safeSet<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('[Storage] write failed:', err);
  }
}

export const StorageService = {
  getChats: (): StoredChat[] => safeGet(KEYS.CHATS, []),
  saveChats: (chats: StoredChat[]) => safeSet(KEYS.CHATS, chats),

  getTranslations: (): StoredTranslation[] => safeGet(KEYS.TRANSLATIONS, []),
  saveTranslations: (items: StoredTranslation[]) => safeSet(KEYS.TRANSLATIONS, items),

  getTranscripts: (): StoredTranscript[] => safeGet(KEYS.TRANSCRIPTS, []),
  saveTranscripts: (items: StoredTranscript[]) => safeSet(KEYS.TRANSCRIPTS, items),

  getSettings: (): UserSettings => safeGet(KEYS.SETTINGS, DEFAULT_SETTINGS),
  saveSettings: (settings: UserSettings) => safeSet(KEYS.SETTINGS, settings),

  clearAllHistory: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(KEYS.CHATS);
    localStorage.removeItem(KEYS.TRANSLATIONS);
    localStorage.removeItem(KEYS.TRANSCRIPTS);
  },
};
