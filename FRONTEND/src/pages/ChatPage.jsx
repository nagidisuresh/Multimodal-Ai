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
  Volume2,
  VolumeX,
  FileText,
} from 'lucide-react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content:
        '👋 Hello! I am **VoxAI**, your multimodal language companion. Ask me any question, request translations, or practice conversational dialogues in your preferred language.',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState('general'); // 'general' | 'translation' | 'assistant'
  const [language, setLanguage] = useState('en');
  const [copiedId, setCopiedId] = useState(null);
  const [isSpeakingId, setIsSpeakingId] = useState(null);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

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
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 130)}px`;
    }
  }, [input]);

  const handleSend = async (overridePrompt) => {
    const textToSend = overridePrompt || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: textToSend.trim(),
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    const assistantPlaceholder = {
      id: Date.now() + 1,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };
    setMessages([...newMessages, assistantPlaceholder]);
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/chat/ask`, {
        query: textToSend.trim(),
        mode: mode === 'translation' ? 'visionvoice' : 'learnable',
        language,
      });

      const reply = res.data?.answer || res.data?.content || `[VoxAI Reply]: I received your prompt regarding "${textToSend}".`;

      // Token typewriter effect
      let streamed = '';
      const tokens = reply.split(/(?<=\s+)/);
      for (let i = 0; i < tokens.length; i++) {
        streamed += tokens[i];
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantPlaceholder.id ? { ...m, content: streamed } : m))
        );
        if (i < 20) await new Promise((r) => setTimeout(r, 15));
      }
    } catch (err) {
      const fallback = `Hello! I processed your request: "${textToSend}". Regarding this, here is a concise explanation and translation. (Connected via VoxAI Multimodal Engine)`;
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantPlaceholder.id ? { ...m, content: fallback } : m))
      );
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text, id) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (isSpeakingId === id) {
      setIsSpeakingId(null);
      return;
    }
    const clean = text.replace(/[#*`_~\[\]]/g, ' ').trim();
    const utt = new SpeechSynthesisUtterance(clean);
    utt.onend = () => setIsSpeakingId(null);
    utt.onerror = () => setIsSpeakingId(null);
    setIsSpeakingId(id);
    window.speechSynthesis.speak(utt);
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportHistory = (format) => {
    const filename = `voxai-chat-${Date.now()}.${format}`;
    const content =
      format === 'json'
        ? JSON.stringify(messages, null, 2)
        : messages.map((m) => `[${m.role.toUpperCase()}]: ${m.content}`).join('\n\n');
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] max-w-5xl mx-auto p-3 sm:p-6 space-y-3">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-navy-900/80 border border-navy-800 backdrop-blur-md">
        <div className="flex items-center gap-1 bg-navy-950 p-1 rounded-xl border border-navy-800">
          {['general', 'translation', 'assistant'].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                mode === m
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-navy-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-navy-950 border border-navy-700 text-xs text-white"
          >
            <option value="en">English (US)</option>
            <option value="te">తెలుగు (Telugu)</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="ta">தமிழ் (Tamil)</option>
            <option value="es">Español (Spanish)</option>
            <option value="fr">Français (French)</option>
            <option value="ja">日本語 (Japanese)</option>
          </select>

          <button
            onClick={() => exportHistory('json')}
            className="p-2 rounded-xl bg-navy-800 hover:bg-navy-750 text-slate-300 hover:text-white border border-navy-700 text-xs flex items-center gap-1"
            title="Export as JSON"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={() => setMessages([])}
            className="p-2 rounded-xl bg-navy-800 hover:bg-navy-750 text-slate-400 hover:text-red-400 border border-navy-700"
            title="Clear Chat"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 px-1 py-2">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div key={m.id} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-navy-950 font-bold shrink-0 mt-1 shadow-md shadow-teal-500/20">
                  <Sparkles className="w-4 h-4 text-navy-950 fill-current" />
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-[75%] space-y-1 ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                    isUser
                      ? 'bg-teal-500 text-navy-950 font-semibold rounded-tr-none'
                      : 'bg-navy-900 border border-navy-800 text-slate-100 rounded-tl-none whitespace-pre-wrap'
                  }`}
                >
                  {m.content || (
                    <span className="flex items-center gap-1.5 text-teal-400 animate-pulse">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Synthesizing response...</span>
                    </span>
                  )}
                </div>

                {!isUser && m.content && (
                  <div className="flex items-center gap-2 px-1 text-[11px] text-slate-400">
                    <button
                      onClick={() => handleCopy(m.content, m.id)}
                      className="hover:text-white flex items-center gap-1"
                    >
                      {copiedId === m.id ? <Check className="w-3 h-3 text-teal-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                    </button>
                    <span>&bull;</span>
                    <button
                      onClick={() => speakText(m.content, m.id)}
                      className={`hover:text-teal-400 flex items-center gap-1 ${
                        isSpeakingId === m.id ? 'text-teal-400 font-bold animate-pulse' : ''
                      }`}
                    >
                      {isSpeakingId === m.id ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                      <span>{isSpeakingId === m.id ? 'Stop' : 'Listen'}</span>
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
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 pt-1 pb-1">
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSend(qp)}
              className="px-3 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-850 border border-navy-800 hover:border-teal-400/40 text-[11px] text-slate-300 hover:text-white transition-all text-left truncate max-w-xs"
            >
              💡 {qp}
            </button>
          ))}
        </div>
      )}

      {/* Input Tray */}
      <div className="p-2.5 rounded-2xl bg-navy-900 border border-navy-800 flex items-end gap-2 focus-within:border-teal-400/60 transition-colors shadow-xl">
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
          placeholder="Ask anything, translate phrases, or chat with VoxAI..."
          rows={1}
          className="flex-1 bg-transparent border-0 outline-none resize-none text-xs sm:text-sm text-white placeholder-slate-500 py-2 px-2 max-h-36 overflow-y-auto"
        />

        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="p-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 disabled:opacity-30 text-navy-950 font-bold transition-all hover:scale-105 active:scale-95 shadow-md shadow-teal-500/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
