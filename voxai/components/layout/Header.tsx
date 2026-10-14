'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sun, Moon, Sparkles, Activity, ShieldCheck } from 'lucide-react';
import { StorageService } from '@/lib/storage';

export const Header: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [healthStatus, setHealthStatus] = useState<'checking' | 'connected' | 'demo'>('checking');

  useEffect(() => {
    const s = StorageService.getSettings();
    setTheme(s.theme || 'dark');
    if (s.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }

    // Probe health API
    fetch('/api/health')
      .then((r) => r.json())
      .then((data) => {
        if (data.geminiConfigured) {
          setHealthStatus('connected');
        } else {
          setHealthStatus('demo');
        }
      })
      .catch(() => setHealthStatus('demo'));
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    const s = StorageService.getSettings();
    StorageService.saveSettings({ ...s, theme: nextTheme });
    if (nextTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-navy-950/80 backdrop-blur-xl border-b border-navy-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      {/* Mobile Brand Link */}
      <div className="flex items-center gap-2 md:hidden">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-purple-500 flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-white fill-current" />
          </div>
          <span className="text-base font-black text-white">
            Vox<span className="text-cyan-400">AI</span>
          </span>
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-400">
          Your AI Language Companion
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Health/Engine Indicator */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${
            healthStatus === 'connected'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : healthStatus === 'demo'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : 'bg-navy-900 border-navy-800 text-slate-400'
          }`}
          title={
            healthStatus === 'connected'
              ? 'Google Gemini API Connected'
              : 'Demo Mode Active (Mock Fallback Ready)'
          }
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              healthStatus === 'connected'
                ? 'bg-emerald-400'
                : healthStatus === 'demo'
                ? 'bg-amber-400 animate-pulse'
                : 'bg-slate-500'
            }`}
          />
          <span className="hidden sm:inline">
            {healthStatus === 'connected' ? 'Gemini Live' : 'Demo Mode'}
          </span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-navy-900 hover:bg-navy-850 border border-navy-800 text-slate-300 hover:text-white transition-colors"
          aria-label="Toggle theme"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
        </button>
      </div>
    </header>
  );
};
