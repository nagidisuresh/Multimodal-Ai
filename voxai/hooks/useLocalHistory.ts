'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  StorageService,
  StoredChat,
  StoredTranslation,
  StoredTranscript,
  UserSettings,
} from '@/lib/storage';

export function useLocalHistory() {
  const [chats, setChats] = useState<StoredChat[]>([]);
  const [translations, setTranslations] = useState<StoredTranslation[]>([]);
  const [transcripts, setTranscripts] = useState<StoredTranscript[]>([]);
  const [settings, setSettings] = useState<UserSettings>(StorageService.getSettings());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setChats(StorageService.getChats());
    setTranslations(StorageService.getTranslations());
    setTranscripts(StorageService.getTranscripts());
    setSettings(StorageService.getSettings());
    setIsLoaded(true);
  }, []);

  const saveChat = useCallback(
    (chat: StoredChat) => {
      if (!settings.saveHistory) return;
      setChats((prev) => {
        const index = prev.findIndex((c) => c.id === chat.id);
        const updated = index >= 0
          ? prev.map((c) => (c.id === chat.id ? chat : c))
          : [chat, ...prev];
        StorageService.saveChats(updated);
        return updated;
      });
    },
    [settings.saveHistory]
  );

  const deleteChat = useCallback((id: string) => {
    setChats((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      StorageService.saveChats(updated);
      return updated;
    });
  }, []);

  const saveTranslation = useCallback(
    (item: Omit<StoredTranslation, 'id' | 'createdAt'>) => {
      if (!settings.saveHistory) return;
      const newEntry: StoredTranslation = {
        ...item,
        id: 'trans-' + Date.now(),
        createdAt: Date.now(),
      };
      setTranslations((prev) => {
        const updated = [newEntry, ...prev];
        StorageService.saveTranslations(updated);
        return updated;
      });
    },
    [settings.saveHistory]
  );

  const toggleFavoriteTranslation = useCallback((id: string) => {
    setTranslations((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, isFavorite: !t.isFavorite } : t));
      StorageService.saveTranslations(updated);
      return updated;
    });
  }, []);

  const deleteTranslation = useCallback((id: string) => {
    setTranslations((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      StorageService.saveTranslations(updated);
      return updated;
    });
  }, []);

  const saveTranscript = useCallback(
    (text: string, language: string) => {
      if (!settings.saveHistory || !text.trim()) return;
      const newEntry: StoredTranscript = {
        id: 'tr-' + Date.now(),
        text,
        language,
        createdAt: Date.now(),
      };
      setTranscripts((prev) => {
        const updated = [newEntry, ...prev];
        StorageService.saveTranscripts(updated);
        return updated;
      });
    },
    [settings.saveHistory]
  );

  const deleteTranscript = useCallback((id: string) => {
    setTranscripts((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      StorageService.saveTranscripts(updated);
      return updated;
    });
  }, []);

  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    setSettings((prev) => {
      const merged = { ...prev, ...newSettings };
      StorageService.saveSettings(merged);
      return merged;
    });
  }, []);

  const clearAll = useCallback(() => {
    StorageService.clearAllHistory();
    setChats([]);
    setTranslations([]);
    setTranscripts([]);
  }, []);

  return {
    isLoaded,
    chats,
    translations,
    transcripts,
    settings,
    saveChat,
    deleteChat,
    saveTranslation,
    toggleFavoriteTranslation,
    deleteTranslation,
    saveTranscript,
    deleteTranscript,
    updateSettings,
    clearAll,
  };
}
