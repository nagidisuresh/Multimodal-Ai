'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseSpeechRecognitionOptions {
  lang?: string;
  continuous?: boolean;
  onTranscript?: (transcript: string, isFinal: boolean) => void;
  onError?: (err: string) => void;
}

export function useSpeechRecognition({
  lang = 'en-US',
  continuous = false,
  onTranscript,
  onError,
}: UseSpeechRecognitionOptions = {}) {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied' | 'unknown'>('unknown');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        setIsSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = continuous;
        recognition.interimResults = true;
        recognition.lang = lang;

        recognition.onstart = () => {
          setIsListening(true);
          setError(null);
          setPermissionStatus('granted');
        };

        recognition.onresult = (event: any) => {
          let currentInterim = '';
          let currentFinal = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const item = event.results[i];
            if (item.isFinal) {
              currentFinal += item[0].transcript;
            } else {
              currentInterim += item[0].transcript;
            }
          }

          if (currentFinal) {
            setTranscript((prev) => {
              const updated = prev ? `${prev} ${currentFinal}` : currentFinal;
              onTranscript?.(updated, true);
              return updated;
            });
          }

          setInterimTranscript(currentInterim);
          if (currentInterim) {
            onTranscript?.(currentInterim, false);
          }
        };

        recognition.onerror = (event: any) => {
          const errType = event.error || 'speech-recognition-error';
          if (errType === 'not-allowed') {
            setPermissionStatus('denied');
            setError('Microphone access denied. Please enable microphone permissions in your browser settings.');
          } else if (errType === 'no-speech') {
            setError('No speech detected. Please speak clearly into your microphone.');
          } else {
            setError(`Speech recognition notice: ${errType}`);
          }
          setIsListening(false);
          onError?.(errType);
        };

        recognition.onend = () => {
          setIsListening(false);
          setInterimTranscript('');
        };

        recognitionRef.current = recognition;
      } else {
        setIsSupported(false);
        setError('SpeechRecognition is not natively supported in this browser. Please use Google Chrome or Microsoft Edge for best results.');
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore cleanup abort error
        }
      }
    };
  }, [continuous, lang, onTranscript, onError]);

  const startListening = useCallback(() => {
    setError(null);
    if (!recognitionRef.current) {
      setError('Speech recognition not available.');
      return;
    }
    try {
      recognitionRef.current.lang = lang;
      recognitionRef.current.start();
    } catch (e: any) {
      if (e?.name !== 'InvalidStateError') {
        setError('Could not start microphone: ' + (e?.message || 'Unknown'));
      }
    }
  }, [lang]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    permissionStatus,
    error,
    startListening,
    stopListening,
    resetTranscript,
    setTranscript,
  };
}
