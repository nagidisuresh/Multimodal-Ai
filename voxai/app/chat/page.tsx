'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Square,
  Plus,
  Trash2,
  Copy,
  Check,
  Download,
  RotateCcw,
  Sparkles,
  Bot,
  User,
  SlidersHorizontal,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useLocalHistory } from '@/hooks/useLocalHistory';
import { LanguageSelector } from '@/components/shared/LanguageSelector';
import { ErrorBanner } from '@/components/shared/ErrorBanner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Hello! I am **VoxAI**, your multilingual language companion. Ask me any question, request translations, or practice conversational dialogues in your preferred language.',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'general' | 'translation' | 'assistant'>('general');
  const [language, setLanguage] = useState('en');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { speak, stop, isSpeaking } = useSpeechSynthesis({ defaultLang: language });
  const { saveChat, settings } = useLocalHistory();

  const quickPrompts = [
    'How do I introduce myself in French and Telugu?',
    'Explain the cultural significance of the Diwali festival',
    'Translate: "Where is the nearest train station?" into Japanese',
    'Write a formal apology email to a colleague',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [input]);

  const handleSend = async (overridePrompt?: string) => {
    const textToSend = overridePrompt || input;
    if (!textToSend.trim() || isLoading) return;

    setErrorMessage(null);
    const userMsg: Message = {
      role: 'user',
      content: textToSend.trim(),
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    // Prepare assistant bubble
    const assistantIndex = newMessages.length;
    const assistantPlaceholder: Message = {
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };
    setMessages([...newMessages, assistantPlaceholder]);
    setIsLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          mode,
          language,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No stream body returned by server');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;

        setMessages((prev) => {
          const copy = [...prev];
          if (copy[assistantIndex]) {
            copy[assistantIndex] = {
              ...copy[assistantIndex],
              content: accumulated,
            };
          }
          return copy;
        });
      }

      // Save to local history
      if (settings.saveHistory) {
        saveChat({
          id: 'chat-' + Date.now(),
          title: textToSend.slice(0, 40) + '...',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          messages: [...newMessages, { role: 'assistant', content: accumulated, timestamp: Date.now() }],
        });
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // User clicked stop
      } else {
        setErrorMessage(err?.message || 'Chat generation failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    handleStop();
    setMessages([
      {
        role: 'assistant',
        content: 'New conversation started. How can I assist you with languages or questions today?',
        timestamp: Date.now(),
      },
    ]);
    setErrorMessage(null);
  };

  const handleClearAll = () => {
    handleStop();
    setMessages([]);
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(idx);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRegenerate = () => {
    const lastUserIndex = [...messages].reverse().findIndex((m) => m.role === 'user');
    if (lastUserIndex === -1) return;
    const realIndex = messages.length - 1 - lastUserIndex;
    const userMsg = messages[realIndex].content;
    const pruned = messages.slice(0, realIndex);
    setMessages(pruned);
    handleSend(userMsg);
  };

  const exportHistory = (format: 'txt' | 'json') => {
    const filename = `voxai-chat-${Date.now()}.${format}`;
    let content = '';

    if (format === 'json') {
      content = JSON.stringify(messages, null, 2);
    } else {
      content = messages
        .map((m) => `[${m.role.toUpperCase()}] ${new Date(m.timestamp).toLocaleTimeString()}:\n${m.content}\n`)
        .join('\n---\n\n');
    }

    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] max-w-5xl mx-auto p-3 sm:p-6 space-y-3">
      {/* Top Header / Mode Switch Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-navy-900/60 border border-navy-800 backdrop-blur-md">
        {/* Mode Selector */}
        <div className="flex items-center gap-1 bg-navy-950 p-1 rounded-xl border border-navy-800">
          {(['general', 'translation', 'assistant'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                mode === m
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-navy-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {m === 'general' ? 'General' : m === 'translation' ? 'Translation' : 'Assistant'}
            </button>
          ))}
        </div>

        {/* Language & Actions */}
        <div className="flex items-center gap-2">
          <div className="w-36">
            <LanguageSelector value={language} onChange={setLanguage} />
          </div>

          <button
            onClick={handleNewChat}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-navy-800 hover:bg-navy-750 text-xs font-bold text-white border border-navy-700 transition-colors"
            title="Start new conversation"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New</span>
          </button>

          <button
            onClick={() => exportHistory('json')}
            className="p-2 rounded-xl bg-navy-800 hover:bg-navy-750 text-slate-300 hover:text-white border border-navy-700 transition-colors"
            title="Export chat as JSON"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleClearAll}
            className="p-2 rounded-xl bg-navy-800 hover:bg-navy-750 text-slate-400 hover:text-red-400 border border-navy-700 transition-colors"
            title="Clear all messages"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <ErrorBanner message={errorMessage} onRetry={() => handleRegenerate()} onDismiss={() => setErrorMessage(null)} />
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 px-1 py-2">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3 text-slate-500">
            <Bot className="w-12 h-12 text-slate-600 animate-pulse" />
            <p className="text-sm font-semibold">No messages yet. Send a query below or pick a prompt idea!</p>
          </div>
        ) : (
          messages.map((m, idx) => {
            const isUser = m.role === 'user';
            return (
              <div key={idx} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-navy-950 font-bold shrink-0 mt-1 shadow-md shadow-cyan-500/20">
                    <Sparkles className="w-4 h-4 text-navy-950 fill-current" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[75%] space-y-1 ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                      isUser
                        ? 'bg-cyan-500 text-navy-950 font-semibold rounded-tr-none'
                        : 'bg-navy-900 border border-navy-800 text-slate-100 rounded-tl-none whitespace-pre-wrap'
                    }`}
                  >
                    {m.content ? (
                      m.content
                    ) : (
                      <span className="flex items-center gap-1.5 text-cyan-400 animate-pulse">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Thinking and streaming answer...</span>
                      </span>
                    )}
                  </div>

                  {!isUser && m.content && (
                    <div className="flex items-center gap-2 px-1 text-[11px] text-slate-400">
                      <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>&bull;</span>
                      <button
                        onClick={() => handleCopy(m.content, idx)}
                        className="hover:text-white flex items-center gap-1"
                        title="Copy message"
                      >
                        {copiedId === idx ? <Check className="w-3 h-3 text-cyan-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === idx ? 'Copied' : 'Copy'}</span>
                      </button>
                      <span>&bull;</span>
                      <button
                        onClick={() => speak(m.content, language)}
                        className="hover:text-cyan-400 flex items-center gap-1"
                        title="Read aloud"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Listen</span>
                      </button>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-navy-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar (when only welcome message is shown) */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 pt-1 pb-1">
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSend(qp)}
              className="px-3 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-850 border border-navy-800 hover:border-cyan-500/40 text-[11px] text-slate-300 hover:text-white transition-all text-left truncate max-w-xs"
            >
              💡 {qp}
            </button>
          ))}
        </div>
      )}

      {/* Input Tray */}
      <div className="p-2.5 rounded-2xl bg-navy-900 border border-navy-800 flex items-end gap-2 focus-within:border-cyan-500/60 transition-colors shadow-xl">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask anything, translate phrases, or request explanations..."
          rows={1}
          className="flex-1 bg-transparent border-0 outline-none resize-none text-xs sm:text-sm text-white placeholder-slate-500 py-2 px-2 max-h-36 overflow-y-auto"
        />

        {isLoading ? (
          <button
            onClick={handleStop}
            className="p-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 font-bold text-xs flex items-center gap-1.5 transition-all"
            title="Stop generation"
          >
            <Square className="w-4 h-4 fill-current" />
            <span className="hidden sm:inline">Stop</span>
          </button>
        ) : (
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 disabled:opacity-30 disabled:hover:scale-100 text-navy-950 font-bold transition-all hover:scale-105 active:scale-95 shadow-md shadow-cyan-500/20"
            title="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
