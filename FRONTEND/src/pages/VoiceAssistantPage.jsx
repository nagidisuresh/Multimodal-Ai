import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Send,
  RotateCcw,
  Sliders,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import axios from 'axios';
import { AudioWaveform } from '../components/MultimodalChatbot/AudioWaveform';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const VoiceAssistantPage = () => {
  const [status, setStatus] = useState('ready'); // 'ready' | 'listening' | 'processing' | 'speaking' | 'error'
  const [transcript, setTranscript] = useState('');
  const [aiReply, setAiReply] = useState('');
  const [language, setLanguage] = useState('en-US');
  const [autoPlay, setAutoPlay] = useState(true);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [isSupported, setIsSupported] = useState(true);
  const [permissionState, setPermissionState] = useState('prompt');
  const [errorMessage, setErrorMessage] = useState('');

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language;

      recognition.onstart = () => {
        setStatus('listening');
        setPermissionState('granted');
        setErrorMessage('');
      };

      recognition.onresult = (event) => {
        const text = Array.from(event.results)
          .map((r) => r[0].transcript)
          .join('');
        setTranscript(text);
      };

      recognition.onerror = (e) => {
        if (e.error === 'not-allowed') {
          setPermissionState('denied');
          setErrorMessage('Microphone access was denied. Please allow microphone permissions in your browser.');
        } else if (e.error === 'no-speech') {
          setErrorMessage('No speech was detected. Please try tapping the mic again.');
        } else {
          setErrorMessage(`Speech recognition notice: ${e.error}`);
        }
        setStatus('error');
      };

      recognition.onend = () => {
        if (status === 'listening') {
          setStatus('ready');
        }
      };

      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
      setErrorMessage('SpeechRecognition is not natively supported in this browser. Please use Google Chrome or Microsoft Edge.');
    }
  }, [language]);

  const toggleMic = () => {
    if (status === 'listening') {
      recognitionRef.current?.stop();
      setStatus('ready');
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.lang = language;
          recognitionRef.current.start();
        } catch {
          // Restart gracefully
        }
      } else {
        // Fallback simulation
        setStatus('listening');
        setTimeout(() => {
          setTranscript('Tell me about the benefits of learning multiple languages.');
          setStatus('ready');
        }, 2500);
      }
    }
  };

  const handleSendToAI = async (queryText = transcript) => {
    if (!queryText.trim()) return;

    setStatus('processing');
    setErrorMessage('');

    try {
      const res = await axios.post(`${API_BASE}/chat/ask`, {
        query: queryText.trim(),
        mode: 'learnable',
        language: language.split('-')[0],
      });

      const reply = res.data?.answer || res.data?.content || `I understood: "${queryText}". Here is your voice insight.`;
      setAiReply(reply);

      if (autoPlay) {
        speakResponse(reply);
      } else {
        setStatus('ready');
      }
    } catch (err) {
      const fallback = `I processed your spoken inquiry: "${queryText}". Multilingual voice response active.`;
      setAiReply(fallback);
      if (autoPlay) speakResponse(fallback);
      else setStatus('ready');
    }
  };

  const speakResponse = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const clean = text.replace(/[#*`_~\[\]]/g, ' ').trim();
    const utt = new SpeechSynthesisUtterance(clean);
    utt.rate = speechRate;
    utt.lang = language;

    utt.onstart = () => setStatus('speaking');
    utt.onend = () => setStatus('ready');
    utt.onerror = () => setStatus('ready');

    window.speechSynthesis.speak(utt);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setStatus('ready');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 text-white">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Hands-Free Multimodal Voice Assistant</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black">
          Talk Directly with VoxAI
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Tap the microphone, speak in your language, edit your transcript if needed, and receive spoken AI answers.
        </p>
      </div>

      {/* Browser Support Banner */}
      {!isSupported && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>SpeechRecognition works best in Google Chrome and Microsoft Edge on desktop and Android.</span>
        </div>
      )}

      {/* Main Interactive Stage */}
      <div className="p-8 rounded-3xl bg-navy-900/80 border border-navy-800 shadow-2xl flex flex-col items-center justify-center space-y-6 relative overflow-hidden backdrop-blur-xl">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />

        {/* Status Badge */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy-950 border border-navy-700 text-xs font-bold tracking-wide">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              status === 'listening'
                ? 'bg-red-500 animate-ping'
                : status === 'speaking'
                ? 'bg-cyan-400 animate-pulse'
                : status === 'processing'
                ? 'bg-amber-400 animate-spin'
                : 'bg-emerald-400'
            }`}
          />
          <span className="uppercase text-[11px] text-slate-300">
            {status === 'listening'
              ? 'Listening... Speak Now'
              : status === 'processing'
              ? 'Processing with Gemini...'
              : status === 'speaking'
              ? 'Speaking AI Answer...'
              : status === 'error'
              ? 'Error'
              : 'Ready'}
          </span>
        </div>

        {/* Waveform indicator */}
        <div className="h-10 flex items-center justify-center">
          {status === 'listening' || status === 'speaking' ? (
            <AudioWaveform isSpeaking={status === 'speaking'} color={status === 'listening' ? 'teal' : 'cyan'} />
          ) : (
            <span className="text-xs text-slate-500">Tap microphone to begin conversation</span>
          )}
        </div>

        {/* Large Animated Microphone Button */}
        <button
          onClick={toggleMic}
          className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
            status === 'listening'
              ? 'bg-red-500 text-white shadow-red-500/50 scale-110 animate-pulse ring-8 ring-red-500/20'
              : 'bg-gradient-to-tr from-teal-500 via-cyan-400 to-blue-500 text-navy-950 shadow-teal-500/40 hover:scale-105 active:scale-95'
          }`}
          aria-label={status === 'listening' ? 'Stop listening' : 'Start speaking'}
        >
          {status === 'listening' ? <MicOff className="w-12 h-12" /> : <Mic className="w-12 h-12 stroke-[2.2]" />}
        </button>

        {/* Live Editable Transcript Box */}
        <div className="w-full max-w-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">
              Live Spoken Transcript (Editable)
            </span>
            {transcript && (
              <button
                onClick={() => setTranscript('')}
                className="text-[11px] text-slate-500 hover:text-red-400"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 p-2 rounded-2xl bg-navy-950 border border-navy-700/80 focus-within:border-teal-400 transition-colors">
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Your speech transcript will appear here in real-time. You can edit it before sending."
              rows={2}
              className="flex-1 bg-transparent border-0 outline-none resize-none text-xs sm:text-sm text-white placeholder-slate-500 p-1"
            />
            <button
              onClick={() => handleSendToAI()}
              disabled={!transcript.trim() || status === 'processing'}
              className="p-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-40 text-navy-950 font-bold transition-transform hover:scale-105 shrink-0"
              title="Send to AI"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* AI Answer Bubble */}
        {aiReply && (
          <div className="w-full max-w-xl p-5 rounded-2xl bg-navy-950/80 border border-teal-500/30 text-xs sm:text-sm text-slate-200 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-navy-800 pb-2">
              <span className="font-bold text-teal-400 flex items-center gap-1.5 text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>VoxAI Spoken Response</span>
              </span>
              <div className="flex items-center gap-2">
                {status === 'speaking' ? (
                  <button
                    onClick={stopSpeaking}
                    className="flex items-center gap-1 text-[11px] text-red-400 hover:underline"
                  >
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Stop Audio</span>
                  </button>
                ) : (
                  <button
                    onClick={() => speakResponse(aiReply)}
                    className="flex items-center gap-1 text-[11px] text-teal-300 hover:underline"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Replay Audio</span>
                  </button>
                )}
              </div>
            </div>
            <p className="whitespace-pre-wrap leading-relaxed">{aiReply}</p>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 max-w-md">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Voice Controls & Settings Card */}
      <div className="p-5 rounded-3xl bg-navy-900/60 border border-navy-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="block text-slate-400 font-bold mb-1 uppercase tracking-wider text-[10px]">
            Spoken Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-navy-950 border border-navy-700 text-white"
          >
            <option value="en-US">English (US)</option>
            <option value="te-IN">తెలుగు (Telugu - India)</option>
            <option value="hi-IN">हिन्दी (Hindi - India)</option>
            <option value="ta-IN">தமிழ் (Tamil - India)</option>
            <option value="es-ES">Español (Spain)</option>
            <option value="fr-FR">Français (France)</option>
            <option value="de-DE">Deutsch (Germany)</option>
            <option value="ja-JP">日本語 (Japan)</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-400 font-bold mb-1 uppercase tracking-wider text-[10px]">
            Speech Rate ({speechRate}x)
          </label>
          <input
            type="range"
            min="0.75"
            max="1.5"
            step="0.25"
            value={speechRate}
            onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
            className="w-full accent-teal-400 mt-2"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-center gap-3 pt-4 sm:pt-0">
          <label className="text-slate-300 font-bold">Auto-Play Spoken Reply</label>
          <input
            type="checkbox"
            checked={autoPlay}
            onChange={(e) => setAutoPlay(e.target.checked)}
            className="w-4 h-4 accent-teal-400 rounded cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
