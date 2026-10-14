import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import {
  Sparkles,
  PhoneCall,
  Globe,
  Sun,
  Moon,
  ChevronDown,
  Bot,
  Compass,
  FolderLock,
  PlusCircle,
  ShieldAlert,
  Mic,
  LogOut,
  User,
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { toggleTheme, isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  ];

  const isOmnimindActive = location.pathname === '/omnimind';
  const isCaseActive = location.pathname.includes('/cases/deb3579d-db10-4382-b21c-b550ea6552ec');
  const isCasesListActive = location.pathname === '/cases';
  const isNewCaseActive = location.pathname === '/cases/new';

  return (
    <header className="sticky top-0 z-40 bg-navy-950/90 backdrop-blur-xl border-b border-navy-800/60 px-4 sm:px-6">
      <div className="flex items-center justify-between gap-3 h-14 max-w-[1920px] mx-auto">
        {/* Left: Mobile & Desktop Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/omnimind" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center shadow-md shadow-teal-500/20 group-hover:scale-105 transition-all">
              <Sparkles className="w-4 h-4 text-navy-950 fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-black tracking-tight text-white leading-none">
                OmniSense<span className="text-teal-400">AI</span>
              </span>
              <span className="text-[9px] font-semibold text-slate-400 tracking-wider hidden sm:inline">
                One Input. Every Insight.
              </span>
            </div>
          </Link>

          {/* Network / Framework badge */}
          <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-400 font-medium pl-3 border-l border-navy-800/80">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400" />
            </span>
            <span>Multimodal Network Active · I4C Framework</span>
          </div>
        </div>

        {/* Center: Global One-Click Switcher Pills */}
        <div className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-navy-900/90 border border-navy-800/80 shadow-inner">
          {/* OmniSense Multimodal Workspace */}
          <Link
            to="/omnimind"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              isOmnimindActive
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-navy-950 shadow-md shadow-teal-500/25'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Workspace</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-navy-950/40 text-teal-300 border border-teal-500/30">
              5 Modes
            </span>
          </Link>

          {/* Active Case Dossier */}
          <Link
            to="/cases/deb3579d-db10-4382-b21c-b550ea6552ec"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isCaseActive
                ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>Case Dossier</span>
            <span className="px-1 py-0.2 rounded text-[9px] font-black bg-red-950/60 text-red-300 border border-red-500/40">
              deb3579d
            </span>
          </Link>

          {/* All Cases */}
          <Link
            to="/cases"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isCasesListActive
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <FolderLock className="w-3.5 h-3.5" />
            <span>All Cases</span>
          </Link>

          {/* Register Incident */}
          <Link
            to="/cases/new"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isNewCaseActive
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Case</span>
          </Link>
        </div>

        {/* Right Tools: Guide, Assistant, Helpline, Language, Theme */}
        <div className="flex items-center gap-2 shrink-0">
          {/* AI Voice Assistant Link */}
          <Link
            to="/assistant"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-teal-500/20 to-cyan-500/20 hover:from-teal-500/30 hover:to-cyan-500/30 text-teal-300 border border-teal-500/40 text-xs font-bold transition-all hover:scale-105"
            title="Multimodal AI Voice & Vision Assistant"
          >
            <Mic className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
            <span className="hidden sm:inline">Voice Assistant</span>
          </Link>

          {/* Hackathon Guide Link */}
          <Link
            to="/multimodal-ai"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold transition-all hover:scale-105"
            title="How Does Multimodal AI Help? Hackathon Guide"
          >
            <Bot className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden md:inline">Guide</span>
          </Link>

          {/* Emergency 1930 Helpline */}
          <a
            href="tel:1930"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/25 text-xs font-bold transition-all hover:border-red-500/40"
            title="Emergency National Cyber Crime Helpline: 1930"
          >
            <PhoneCall className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span className="hidden sm:inline">1930</span>
          </a>

          {/* Language Selector */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-navy-900/80 border border-navy-700/60 hover:border-teal-500/30 text-xs text-slate-300 transition-all"
              aria-label="Select language"
            >
              <Globe className="w-3.5 h-3.5 text-teal-400" />
              <span className="uppercase font-bold text-[10px] tracking-wider">{language}</span>
              <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-2 w-36 rounded-xl bg-navy-900 border border-navy-700/80 shadow-2xl p-1 z-50">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      language === l.code
                        ? 'bg-teal-500/15 text-teal-300 font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-navy-800'
                    }`}
                  >
                    <span>{l.label}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{l.native}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-xl bg-navy-900/80 border border-navy-700/60 hover:border-teal-500/30 text-slate-400 hover:text-teal-400 transition-all"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* User Profile & Logout */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-1.5 sm:gap-2 pl-2 border-l border-navy-800">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-navy-900/80 hover:bg-navy-800 border border-navy-700/60 hover:border-teal-500/30 transition-all group"
                title={`Profile: ${user.name || user.email}`}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.name || 'User'}
                    className="w-6 h-6 rounded-lg object-cover border border-teal-400"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-teal-500 to-cyan-400 text-navy-950 flex items-center justify-center font-bold text-xs">
                    {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden lg:inline text-xs font-bold text-slate-200 group-hover:text-teal-300 max-w-[120px] truncate">
                  {user.name || user.email?.split('@')[0]}
                </span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={async () => {
                  await logout();
                  navigate('/login');
                }}
                className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/25 transition-all"
                title="Log out of your account"
                aria-label="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-navy-950 font-extrabold text-xs shadow-md shadow-teal-500/20 transition-all flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
