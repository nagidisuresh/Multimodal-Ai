'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  MessageSquare,
  Mic,
  Languages,
  ArrowLeftRight,
  FileText,
  History,
  Settings,
  Sparkles,
} from 'lucide-react';

export const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/chat', label: 'AI Chat', icon: MessageSquare },
  { href: '/voice-assistant', label: 'Voice Assistant', icon: Mic },
  { href: '/translate', label: 'Translate', icon: Languages },
  { href: '/voice-translator', label: 'Voice Translator', icon: ArrowLeftRight },
  { href: '/transcribe', label: 'Transcribe', icon: FileText },
  { href: '/history', label: 'History', icon: History },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-navy-950 border-r border-navy-800/80 p-4 shrink-0 select-none z-30">
      {/* Brand Header */}
      <Link href="/" className="flex items-center gap-3 px-2 py-3 mb-6 group">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
          <Sparkles className="w-5 h-5 text-white fill-current" />
        </div>
        <div>
          <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
            Vox<span className="text-cyan-400">AI</span>
          </span>
          <span className="text-[10px] text-slate-400 font-medium tracking-wide block">
            Language Companion
          </span>
        </div>
      </Link>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-navy-900 border border-transparent'
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-white'
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer Indicator */}
      <div className="pt-4 border-t border-navy-850">
        <div className="p-3 rounded-2xl bg-navy-900/60 border border-navy-800/80 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center justify-between font-bold text-slate-300">
            <span>Powered by Gemini</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-[10px] leading-tight text-slate-500">
            Multimodal Voice & Language Orchestration
          </p>
        </div>
      </div>
    </aside>
  );
};
