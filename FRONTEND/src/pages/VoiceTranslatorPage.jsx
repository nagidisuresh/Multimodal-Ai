import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ArrowRight,
  ArrowLeftRight,
  Sparkles,
  RotateCcw,
  User,
  Users,
  Copy,
  Check,
  Trash2,
} from 'lucide-react';
import axios from 'axios';
import { AudioWaveform } from '../components/MultimodalChatbot/AudioWaveform';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const CONVERSATION_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
];

export const VoiceTranslatorPage = () => {
  const [mode, setMode] = useState('two-way'); // 'one-way' | 'two-way'

  // Mode A: One-way state
  const [oneWaySrcLang, setOneWaySrcLang] = useState('en');
  const [oneWayTgtLang, setOneWayTgtLang] = useState('te');
  const [oneWayTranscript, setOneWayTranscript] = useState('');
  const [oneWayTranslation, setOneWayTranslation] = useState('');
  const [isRecordingOneWay, setIsRecordingOneWay] = useState(false);

  // Mode B: Two-way conversation state
  const [langA, setLangA] = useState('en');
  const [langB, setLangB] = useState('te');
  const [activeSpeaker, setActiveSpeaker] = useState(null); // 'A' | 'B' | null
  const [turns, setTurns] = useState([
    {
      id: 1,
      speaker: 'A',
      lang: 'en',
      targetLang: 'te',
      original: 'Hello! Welcome to our multimodal translation clinic. How can I assist you?',
      translated: 'హలో! మా మల్టీమోడల్ అనువాద కేంద్రానికి స్వాగతం. నేను మీకు ఎలా సహాయపడగలను?',
      timestamp: Date.now() - 60000,
    },
    {
      id: 2,
      speaker: 'B',
      lang: 'te',
      targetLang: 'en',
      original: 'నాకు డాక్టర్ రిపోర్టు మరియు మందుల వివరాలు ఇంగ్లీషులో అనువదించి చెప్పగలరా?',
      translated: 'Can you translate the doctor\'s report and medicine details into English for me?',
      timestamp: Date.now() - 30000,
    },
  ]);

  const recognitionRef = useRef(null);

  const startListeningSpeaker = (speakerId) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const spokenLangCode = speakerId === 'A' ? langA : langB;
    const targetLangCode = speakerId === 'A' ? langB : langA;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = spokenLangCode === 'te' ? 'te-IN' : spokenLangCode === 'hi' ? 'hi-IN' : 'en-US';

      recognition.onstart = () => {
        setActiveSpeaker(speakerId);
      };

      recognition.onresult = async (event) => {
        const spoken = event.results[0][0].transcript;
        await handleProcessSpokenTurn(speakerId, spoken, spokenLangCode, targetLangCode);
      };

      recognition.onerror = () => {
        setActiveSpeaker(null);
      };

      recognition.onend = () => {
        setActiveSpeaker(null);
      };

      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch {
        setActiveSpeaker(null);
      }
    } else {
      // Fallback simulated speech
      setActiveSpeaker(speakerId);
      setTimeout(async () => {
        const testSpoken = speakerId === 'A' ? 'What are your symptoms today?' : 'నాకు రెండు రోజులుగా తీవ్రమైన జ్వరం ఉంది.';
        await handleProcessSpokenTurn(speakerId, testSpoken, spokenLangCode, targetLangCode);
        setActiveSpeaker(null);
      }, 2500);
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setActiveSpeaker(null);
    setIsRecordingOneWay(false);
  };

  const handleProcessSpokenTurn = async (speakerId, spokenText, srcLang, tgtLang) => {
    try {
      const res = await axios.post(`${API_BASE}/voice-translate`, {
        text: spokenText,
        sourceLang: srcLang,
        targetLang: tgtLang,
        speaker: speakerId === 'A' ? 'personA' : 'personB',
      });

      const translated = res.data?.translatedText || `[Translated to ${tgtLang}]: ${spokenText}`;
      const newTurn = {
        id: Date.now(),
        speaker: speakerId,
        lang: srcLang,
        targetLang: tgtLang,
        original: spokenText,
        translated,
        timestamp: Date.now(),
      };

      setTurns((prev) => [...prev, newTurn]);

      // Speak aloud immediately
      speakAudio(translated, tgtLang);
    } catch {
      const fallbackTurn = {
        id: Date.now(),
        speaker: speakerId,
        lang: srcLang,
        targetLang: tgtLang,
        original: spokenText,
        translated: `[Spoken in ${tgtLang}]: ${spokenText}`,
        timestamp: Date.now(),
      };
      setTurns((prev) => [...prev, fallbackTurn]);
    }
  };

  const speakAudio = (text, lang) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang === 'te' ? 'te-IN' : lang === 'hi' ? 'hi-IN' : 'en-US';
    window.speechSynthesis.speak(utt);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 text-white">
      {/* Title & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold mb-2">
            <ArrowLeftRight className="w-3.5 h-3.5 text-teal-400" />
            <span>Real-Time Voice-to-Voice Translation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Bilingual Voice Translator
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Conduct seamless face-to-face cross-language dialogues or one-way speech translation.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-navy-900 p-1.5 rounded-2xl border border-navy-800">
          <button
            onClick={() => setMode('two-way')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'two-way' ? 'bg-teal-500 text-navy-950 font-extrabold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Two-Way Conversation</span>
          </button>
          <button
            onClick={() => setMode('one-way')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'one-way' ? 'bg-teal-500 text-navy-950 font-extrabold shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>One-Way Solo</span>
          </button>
        </div>
      </div>

      {/* Mode B: Two-Way Split Conversation Interface */}
      {mode === 'two-way' && (
        <div className="space-y-6">
          {/* Split Screen Speakers Control Deck */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Person A Deck */}
            <div
              className={`p-5 rounded-3xl border transition-all ${
                activeSpeaker === 'A'
                  ? 'bg-blue-950/40 border-cyan-400 shadow-xl shadow-cyan-500/10'
                  : 'bg-navy-900/80 border-navy-800'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                    A
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Person A</h3>
                    <span className="text-[10px] text-slate-400">Speaks in primary language</span>
                  </div>
                </div>

                <select
                  value={langA}
                  onChange={(e) => setLangA(e.target.value)}
                  className="bg-navy-950 border border-navy-700 rounded-xl px-2.5 py-1 text-xs text-white"
                >
                  {CONVERSATION_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col items-center justify-center py-6 space-y-3">
                <button
                  onClick={() => (activeSpeaker === 'A' ? stopListening() : startListeningSpeaker('A'))}
                  disabled={activeSpeaker === 'B'}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                    activeSpeaker === 'A'
                      ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/40'
                      : 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-navy-950 shadow-lg shadow-cyan-500/25 hover:scale-105 active:scale-95 disabled:opacity-30'
                  }`}
                  aria-label="Person A Mic"
                >
                  {activeSpeaker === 'A' ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </button>
                <span className="text-xs font-bold text-slate-300">
                  {activeSpeaker === 'A' ? 'Listening to Person A...' : 'Tap to Speak (Person A)'}
                </span>
              </div>
            </div>

            {/* Person B Deck */}
            <div
              className={`p-5 rounded-3xl border transition-all ${
                activeSpeaker === 'B'
                  ? 'bg-purple-950/40 border-purple-400 shadow-xl shadow-purple-500/10'
                  : 'bg-navy-900/80 border-navy-800'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                    B
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Person B</h3>
                    <span className="text-[10px] text-slate-400">Speaks in response language</span>
                  </div>
                </div>

                <select
                  value={langB}
                  onChange={(e) => setLangB(e.target.value)}
                  className="bg-navy-950 border border-navy-700 rounded-xl px-2.5 py-1 text-xs text-white"
                >
                  {CONVERSATION_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col items-center justify-center py-6 space-y-3">
                <button
                  onClick={() => (activeSpeaker === 'B' ? stopListening() : startListeningSpeaker('B'))}
                  disabled={activeSpeaker === 'A'}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                    activeSpeaker === 'B'
                      ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/40'
                      : 'bg-gradient-to-tr from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25 hover:scale-105 active:scale-95 disabled:opacity-30'
                  }`}
                  aria-label="Person B Mic"
                >
                  {activeSpeaker === 'B' ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </button>
                <span className="text-xs font-bold text-slate-300">
                  {activeSpeaker === 'B' ? 'Listening to Person B...' : 'Tap to Speak (Person B)'}
                </span>
              </div>
            </div>
          </div>

          {/* Chronological Turn History */}
          <div className="p-6 rounded-3xl bg-navy-900/50 border border-navy-800 space-y-4">
            <div className="flex items-center justify-between border-b border-navy-800 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>Conversation Timeline ({turns.length} turns)</span>
              </h3>
              <button
                onClick={() => setTurns([])}
                className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Transcript</span>
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {turns.map((turn) => {
                const isPersonA = turn.speaker === 'A';
                return (
                  <div
                    key={turn.id}
                    className={`p-4 rounded-2xl border text-xs space-y-2 ${
                      isPersonA
                        ? 'bg-blue-950/20 border-cyan-500/30'
                        : 'bg-purple-950/20 border-purple-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className={`font-bold ${isPersonA ? 'text-cyan-400' : 'text-purple-400'}`}>
                        Speaker {turn.speaker} ({turn.lang.toUpperCase()} &rarr; {turn.targetLang.toUpperCase()})
                      </span>
                      <button
                        onClick={() => speakAudio(turn.translated, turn.targetLang)}
                        className="flex items-center gap-1 text-slate-400 hover:text-white"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Replay</span>
                      </button>
                    </div>

                    <p className="text-slate-300 italic">"{turn.original}"</p>
                    <p className="text-white font-bold bg-black/20 p-2.5 rounded-xl border border-white/5">
                      {turn.translated}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mode A: One-Way Solo */}
      {mode === 'one-way' && (
        <div className="p-8 rounded-3xl bg-navy-900/80 border border-navy-800 flex flex-col items-center space-y-6 text-center">
          <div className="flex items-center gap-3">
            <select
              value={oneWaySrcLang}
              onChange={(e) => setOneWaySrcLang(e.target.value)}
              className="bg-navy-950 border border-navy-700 rounded-xl px-3 py-1.5 text-xs text-white"
            >
              {CONVERSATION_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.name}
                </option>
              ))}
            </select>
            <ArrowRight className="w-4 h-4 text-teal-400" />
            <select
              value={oneWayTgtLang}
              onChange={(e) => setOneWayTgtLang(e.target.value)}
              className="bg-navy-950 border border-teal-500/40 rounded-xl px-3 py-1.5 text-xs text-teal-300 font-bold"
            >
              {CONVERSATION_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => (isRecordingOneWay ? stopListening() : startListeningSpeaker('A'))}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
              activeSpeaker === 'A'
                ? 'bg-red-500 text-white animate-pulse shadow-xl shadow-red-500/50'
                : 'bg-gradient-to-tr from-teal-500 to-cyan-500 text-navy-950 shadow-xl shadow-teal-500/40 hover:scale-105 active:scale-95'
            }`}
          >
            {activeSpeaker === 'A' ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
          </button>

          <p className="text-xs text-slate-400">
            {activeSpeaker === 'A' ? 'Listening to your speech...' : 'Tap to start one-way voice translation'}
          </p>
        </div>
      )}
    </div>
  );
};
