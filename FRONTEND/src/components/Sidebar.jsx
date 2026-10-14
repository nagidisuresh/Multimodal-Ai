import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Sparkles,
  Compass,
  FolderLock,
  PlusCircle,
  LayoutDashboard,
  Search,
  BookOpen,
  Files,
  Bot,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
  ShieldAlert,
  PanelLeftClose,
  PanelLeftOpen,
  Activity,
  ShoppingBag,
  Utensils,
  Eye,
  GraduationCap,
  Mic,
  MessageSquare,
  Languages,
  ArrowLeftRight,
  FileText,
  History,
} from 'lucide-react';

export const Sidebar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path) =>
    location.pathname === path || (path !== '/' && location.pathname.startsWith(`${path}/`));

  const workspaceItems = [
    {
      name: 'OmniSense Workspace',
      badge: '5 Modules',
      path: '/omnimind',
      icon: Compass,
      highlight: true
    }
  ];

  const caseItems = [
    {
      name: 'Active Dossier (deb3579d)',
      path: '/cases/deb3579d-db10-4382-b21c-b550ea6552ec',
      icon: ShieldAlert,
      badge: 'Live Scam',
      badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30'
    },
    {
      name: 'All Investigation Cases',
      path: '/cases',
      icon: FolderLock
    },
    {
      name: 'Register Incident',
      path: '/cases/new',
      icon: PlusCircle,
      isAction: true
    }
  ];

  const voxaiItems = [
    { name: 'AI Chatbot', path: '/chat', icon: MessageSquare, badge: 'Streaming' },
    { name: 'Voice Assistant', path: '/voice-assistant', icon: Mic, badge: 'Live Wave' },
    { name: 'Text Translator', path: '/translate', icon: Languages, badge: '21+ Langs' },
    { name: 'Voice-to-Voice', path: '/voice-translator', icon: ArrowLeftRight, badge: 'Two-Way' },
    { name: 'Voice Transcriber', path: '/transcribe', icon: FileText },
    { name: 'History & Vault', path: '/history', icon: History },
  ];

  const intelligenceItems = [
    { name: t('dashboard') || 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: t('search') || 'Smart Search', path: '/search', icon: Search },
    { name: 'Attack Flow Quiz', path: '/learn', icon: BookOpen },
    { name: 'Evidence Vault', path: '/files', icon: Files },
    { name: 'Multimodal AI Guide', path: '/multimodal-ai', icon: Bot },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col ${
        collapsed ? 'w-20' : 'w-[275px]'
      } bg-navy-950/95 backdrop-blur-2xl border-r border-navy-800/80 shrink-0 h-screen sticky top-0 z-30 select-none overflow-hidden transition-all duration-300 shadow-2xl`}
    >
      {/* Sidebar Control Header */}
      <div className="px-3.5 py-3 flex items-center justify-between border-b border-navy-800/60 bg-navy-900/30">
        {!collapsed ? (
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <Compass className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Workspace Nav
            </span>
          </div>
        ) : (
          <div className="w-4" />
        )}

        {/* Toggle Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800/60 transition-colors"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          aria-label="Toggle Sidebar"
        >
          {collapsed ? <PanelLeftOpen className="w-4 h-4 text-teal-400" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Area */}
      <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto scrollbar-thin">
        {/* SECTION 1: WORKSPACE */}
        <div>
          {!collapsed && (
            <div className="px-2 mb-1.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center justify-between">
              <span>Multimodal Platform</span>
              <span className="text-teal-400 text-[9px]">Active</span>
            </div>
          )}
          {workspaceItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                title={item.name}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
                  active
                    ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/10 text-teal-300 border border-teal-500/40 shadow-lg shadow-teal-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.05] border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${active ? 'text-teal-400' : 'text-slate-400 group-hover:text-teal-300'}`} />
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{item.name}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {active && collapsed && <div className="w-1.5 h-1.5 rounded-full bg-teal-400 absolute right-2" />}
              </Link>
            );
          })}
        </div>

        {/* SECTION 2: VOXAI MULTIMODAL LANGUAGE SUITE */}
        <div className="pt-2 border-t border-navy-850">
          {!collapsed && (
            <div className="px-2 mb-1.5 text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 flex items-center justify-between">
              <span>VoxAI Language Suite</span>
              <span className="text-[9px] bg-cyan-500/20 px-1.5 py-0.2 rounded text-cyan-300">Live</span>
            </div>
          )}
          <div className="space-y-1">
            {voxaiItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={item.name}
                  className={`group flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all relative ${
                    active
                      ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30 shadow-md shadow-cyan-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.05] border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${active ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-300'}`} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate">{item.name}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {active && collapsed && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 absolute right-2" />}
                </Link>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: INVESTIGATION CASES */}
        <div className="pt-2 border-t border-navy-850">
          {!collapsed && (
            <div className="px-2 mb-1.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Cyber-Forensics & Cases
            </div>
          )}
          <div className="space-y-1">
            {caseItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              if (item.isAction) {
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    title={item.name}
                    className={`flex items-center justify-between px-3 py-2.5 my-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-navy-950 font-extrabold text-xs shadow-md shadow-teal-500/20 transition-all hover:scale-[1.02] ${
                      collapsed ? 'justify-center px-0' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 shrink-0 font-bold" />
                      {!collapsed && <span>{item.name}</span>}
                    </div>
                    {!collapsed && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
                  </Link>
                );
              }

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={item.name}
                  className={`group flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all relative ${
                    active
                      ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${active ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate">{item.name}</span>
                      {item.badge && (
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${item.badgeColor || 'bg-navy-800 text-slate-300'}`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {active && collapsed && <div className="w-1.5 h-1.5 rounded-full bg-teal-400 absolute right-2" />}
                </Link>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: INTELLIGENCE SUITE */}
        <div className="pt-2 border-t border-navy-850">
          {!collapsed && (
            <div className="px-2 mb-1.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Intelligence Suite
            </div>
          )}
          <div className="space-y-1">
            {intelligenceItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={item.name}
                  className={`group flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all relative ${
                    active
                      ? 'bg-teal-500/12 text-teal-300 font-semibold border border-teal-500/25'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${active ? 'text-teal-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  {!collapsed && <span className="flex-1 truncate">{item.name}</span>}
                  {active && collapsed && <div className="w-1.5 h-1.5 rounded-full bg-teal-400 absolute right-2" />}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* User profile / session footer */}
      <div className="p-3 border-t border-navy-800/60 bg-navy-950/70">
        <div className="flex items-center gap-2.5 p-2 rounded-xl bg-navy-900/80 border border-navy-800/60">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500/20 to-teal-500/5 border border-teal-500/30 flex items-center justify-center text-teal-400 font-black text-xs shrink-0">
            {user?.name?.[0]?.toUpperCase() || 'O'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Investigator'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email || 'demo@omnimind.ai'}</p>
            </div>
          )}
          {isAuthenticated && !collapsed && (
            <button
              onClick={logout}
              className="p-1 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0"
              title="Log Out"
              aria-label="Log Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
