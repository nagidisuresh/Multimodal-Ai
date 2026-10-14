'use client';

import React, { useState } from 'react';
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
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

const PRIMARY_MOBILE_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/chat', label: 'Chat', icon: MessageSquare },
  { href: '/voice-assistant', label: 'Voice', icon: Mic },
  { href: '/translate', label: 'Translate', icon: Languages },
];

const ALL_ITEMS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/chat', label: 'AI Chat', icon: MessageSquare },
  { href: '/voice-assistant', label: 'Voice Assistant', icon: Mic },
  { href: '/translate', label: 'Text Translator', icon: Languages },
  { href: '/voice-translator', label: 'Voice Translator', icon: ArrowLeftRight },
  { href: '/transcribe', label: 'Transcribe', icon: FileText },
  { href: '/history', label: 'History Vault', icon: History },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* Mobile Drawer Modal */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-navy-950/80 backdrop-blur-md flex flex-col justify-end animate-in fade-in">
          <div className="bg-navy-900 border-t border-navy-800 rounded-t-3xl p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-navy-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span className="font-extrabold text-white text-base">All Features</span>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {ALL_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setDrawerOpen(false)}
                    className={`flex items-center gap-2.5 p-3 rounded-2xl text-xs font-bold border transition-all ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : 'bg-navy-950 text-slate-300 border-navy-800 hover:border-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Bar for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-navy-950/95 border-t border-navy-800/90 backdrop-blur-xl px-4 py-2 flex items-center justify-around">
        {PRIMARY_MOBILE_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${
                isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}

        {/* More Menu Trigger */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-slate-400 hover:text-cyan-400"
          aria-label="Open more menu"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">More</span>
        </button>
      </div>
    </>
  );
};
