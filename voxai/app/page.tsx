'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Mic,
  Languages,
  ArrowLeftRight,
  ArrowRight,
  Sparkles,
  Zap,
  Globe2,
  Clock,
  ShieldCheck,
  Headphones,
} from 'lucide-react';
import { StorageService, StoredChat, StoredTranslation } from '@/lib/storage';
import { LANGUAGES } from '@/lib/languages';

export default function HomePage() {
  const [recentChats, setRecentChats] = useState<StoredChat[]>([]);
  const [recentTranslations, setRecentTranslations] = useState<StoredTranslation[]>([]);

  useEffect(() => {
    setRecentChats(StorageService.getChats().slice(0, 3));
    setRecentTranslations(StorageService.getTranslations().slice(0, 3));
  }, []);

  const featureCards = [
    {
      title: 'Chat with AI',
      desc: 'Multi-turn intelligent conversations with streaming responses and multilingual cultural depth.',
      href: '/chat',
      icon: MessageSquare,
      gradient: 'from-blue-600 to-cyan-500',
      badge: 'Streaming AI',
    },
    {
      title: 'Talk to AI',
      desc: 'Hands-free voice assistant with live speech recognition, real-time waveform, and spoken responses.',
      href: '/voice-assistant',
      icon: Mic,
      gradient: 'from-cyan-500 to-teal-400',
      badge: 'Voice Assistant',
    },
    {
      title: 'Translate Text',
      desc: 'Precision translation across 21+ languages with nuance and style modes (Formal, Casual, Simple).',
      href: '/translate',
      icon: Languages,
      gradient: 'from-purple-600 to-pink-500',
      badge: '21+ Languages',
    },
    {
      title: 'Translate Voice',
      desc: 'Real-time spoken translation with one-way and two-way split-screen bilingual conversation mode.',
      href: '/voice-translator',
      icon: ArrowLeftRight,
      gradient: 'from-indigo-600 to-blue-500',
      badge: 'Two-Way Live',
    },
  ];

  const quickPrompts = [
    { text: 'Explain quantum computing in simple Telugu', lang: 'te', href: '/chat' },
    { text: 'How do you say "Nice to meet you" politely in Japanese?', lang: 'ja', href: '/translate' },
    { text: 'Translate this recipe from Hindi to English', lang: 'hi', href: '/translate' },
    { text: 'Practice conversational Spanish interview questions', lang: 'es', href: '/voice-assistant' },
  ];

  const featuredLanguages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'te', name: 'Telugu', flag: '🇮🇳' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-4 sm:pt-8 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Next-Gen Multimodal Voice & Language Suite</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
          Break Language Barriers with <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">AI</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          Chat, speak, translate, and understand the world in your own language. Powered by Gemini multimodal intelligence and real-time speech engineering.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/chat"
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-navy-950 font-black text-sm shadow-xl shadow-cyan-500/25 hover:scale-105 active:scale-95 transition-all"
          >
            <MessageSquare className="w-4 h-4 text-navy-950" />
            <span>Start Chatting</span>
            <ArrowRight className="w-4 h-4 text-navy-950" />
          </Link>
          <Link
            href="/voice-assistant"
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-navy-900 hover:bg-navy-850 text-white border border-slate-700/80 font-bold text-sm hover:border-cyan-400/50 transition-all"
          >
            <Mic className="w-4 h-4 text-cyan-400" />
            <span>Launch Voice Assistant</span>
          </Link>
        </div>
      </section>

      {/* 4 Feature Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {featureCards.map((feat) => {
          const Icon = feat.icon;
          return (
            <Link
              key={feat.href}
              href={feat.href}
              className="group p-6 rounded-3xl bg-navy-900/60 border border-navy-800 hover:border-cyan-500/40 transition-all duration-200 flex flex-col justify-between space-y-4 hover:shadow-xl hover:shadow-cyan-500/5 hover:-translate-y-1 backdrop-blur-md"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                    {feat.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>

              <div className="flex items-center text-xs font-bold text-cyan-400 pt-2 group-hover:translate-x-1 transition-transform">
                <span>Explore Feature</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </Link>
          );
        })}
      </section>

      {/* Quick Start Examples */}
      <section className="p-6 rounded-3xl bg-navy-900/40 border border-navy-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
              Quick-Start Prompt Ideas
            </h2>
          </div>
          <span className="text-[11px] text-slate-500">Click to start</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickPrompts.map((p, idx) => (
            <Link
              key={idx}
              href={p.href}
              className="p-3.5 rounded-2xl bg-navy-950/80 border border-navy-800/80 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-white flex items-center justify-between group transition-all"
            >
              <span className="truncate pr-2">"{p.text}"</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          ))}
        </div>
      </section>

      {/* Recently Used / Supported Languages Row */}
      <section className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-2 font-bold text-white uppercase tracking-wider text-[11px]">
            <Globe2 className="w-4 h-4 text-cyan-400" />
            <span>Supported Languages (21+)</span>
          </span>
          <Link href="/translate" className="text-cyan-400 hover:underline">
            View All Languages &rarr;
          </Link>
        </div>

        <div className="flex flex-wrap gap-2">
          {featuredLanguages.map((l) => (
            <Link
              key={l.code}
              href={`/translate?target=${l.code}`}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-850 border border-navy-800 text-xs font-semibold text-slate-200 hover:border-cyan-400 transition-colors"
            >
              <span>{l.flag}</span>
              <span>{l.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Activity (If available) */}
      {(recentChats.length > 0 || recentTranslations.length > 0) && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-navy-850">
          {recentChats.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Recent Conversations</span>
              </h3>
              <div className="space-y-2">
                {recentChats.map((c) => (
                  <Link
                    key={c.id}
                    href="/chat"
                    className="block p-3 rounded-2xl bg-navy-900 border border-navy-800 hover:border-slate-700 text-xs text-slate-200 transition-all truncate"
                  >
                    <p className="font-bold truncate">{c.title || 'Conversation'}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {c.messages.length} messages &bull; {new Date(c.updatedAt).toLocaleTimeString()}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {recentTranslations.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Languages className="w-3.5 h-3.5 text-purple-400" />
                <span>Recent Translations</span>
              </h3>
              <div className="space-y-2">
                {recentTranslations.map((t) => (
                  <Link
                    key={t.id}
                    href="/translate"
                    className="block p-3 rounded-2xl bg-navy-900 border border-navy-800 hover:border-slate-700 text-xs text-slate-200 transition-all truncate"
                  >
                    <p className="font-bold truncate">"{t.sourceText}"</p>
                    <p className="text-[10px] text-purple-400 mt-0.5">
                      &rarr; {t.translatedText}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
