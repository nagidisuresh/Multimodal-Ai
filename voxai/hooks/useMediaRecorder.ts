'use client';

import { useState, useRef, useCallback } from 'react';

export function useMediaRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const startRecording = useCallback(async () => {
    setError(null);
    setAudioBlob(null);
    chunksRef.current = [];

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('MediaDevices API is not supported in this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : 'audio/ogg';

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const fullBlob = new Blob(chunksRef.current, { type: mimeType });
        setAudioBlob(fullBlob);
        setIsRecording(false);

        // Stop media tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start(250); // Slice data every 250ms
      setIsRecording(true);
    } catch (err: any) {
      const msg = err?.name === 'NotAllowedError'
        ? 'Microphone permission was denied.'
        : err?.message || 'Failed to start recording.';
      setError(msg);
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
        resolve(audioBlob);
        return;
      }

      const recorder = mediaRecorderRef.current;
      const originalOnStop = recorder.onstop;

      recorder.onstop = (ev) => {
        if (originalOnStop) (originalOnStop as any)(ev);
        const mimeType = recorder.mimeType || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        resolve(blob);
      };

      recorder.stop();
    });
  }, [audioBlob]);

  return {
    isRecording,
    audioBlob,
    error,
    startRecording,
    stopRecording,
  };
}
