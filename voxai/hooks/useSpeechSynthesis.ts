'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { defaultTTSProvider, TTSProvider } from '@/lib/ttsAdapter';

export interface UseSpeechSynthesisOptions {
  provider?: TTSProvider;
  defaultLang?: string;
  defaultRate?: number;
  defaultPitch?: number;
}

export function useSpeechSynthesis({
  provider = defaultTTSProvider,
  defaultLang = 'en-US',
  defaultRate = 1.0,
  defaultPitch = 1.0,
}: UseSpeechSynthesisOptions = {}) {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState<number>(defaultRate);
  const [pitch, setPitch] = useState<number>(defaultPitch);
  const [isMuted, setIsMuted] = useState(false);

  const providerRef = useRef<TTSProvider>(provider);
  providerRef.current = provider;

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);

      const loadVoices = () => {
        const available = window.speechSynthesis.getVoices();
        setVoices(available);
        if (available.length > 0 && !selectedVoice) {
          // Find matching default lang voice or first available
          const match = available.find((v) => v.lang.startsWith(defaultLang.split('-')[0]));
          setSelectedVoice(match || available[0]);
        }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [defaultLang, selectedVoice]);

  const speak = useCallback(
    async (text: string, langOverride?: string) => {
      if (isMuted || !text.trim()) return;

      try {
        setIsSpeaking(true);
        await providerRef.current.speak(text, {
          voice: selectedVoice,
          rate,
          pitch,
          lang: langOverride || defaultLang,
          onStart: () => setIsSpeaking(true),
          onEnd: () => setIsSpeaking(false),
          onError: () => setIsSpeaking(false),
        });
      } catch (err) {
        setIsSpeaking(false);
      }
    },
    [isMuted, selectedVoice, rate, pitch, defaultLang]
  );

  const stop = useCallback(() => {
    providerRef.current.stop();
    setIsSpeaking(false);
  }, []);

  const toggleMute = useCallback(() => {
    if (!isMuted) {
      stop();
    }
    setIsMuted((prev) => !prev);
  }, [isMuted, stop]);

  return {
    isSupported,
    isSpeaking,
    voices,
    selectedVoice,
    setSelectedVoice,
    rate,
    setRate,
    pitch,
    setPitch,
    isMuted,
    toggleMute,
    speak,
    stop,
  };
}
