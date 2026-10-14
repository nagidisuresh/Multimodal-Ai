'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Globe, Check } from 'lucide-react';
import { LANGUAGES, AUTO_DETECT_OPTION, Language, getLanguageByCode } from '@/lib/languages';

interface LanguageSelectorProps {
  value: string;
  onChange: (code: string) => void;
  includeAuto?: boolean;
  label?: string;
  disabled?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  value,
  onChange,
  includeAuto = false,
  label,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLang = value === 'auto' ? AUTO_DETECT_OPTION : getLanguageByCode(value);

  const options: Language[] = includeAuto ? [AUTO_DETECT_OPTION, ...LANGUAGES] : LANGUAGES;

  const filtered = options.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(search.toLowerCase()) ||
      l.code.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {label && (
        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
          {label}
        </label>
      )}

      {/* Selector Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-navy-900 border border-slate-700/80 hover:border-cyan-400/60 focus:border-cyan-400 text-sm text-white transition-all shadow-sm disabled:opacity-50"
      >
        <div className="flex items-center gap-2 truncate">
          <span className="text-base leading-none">{selectedLang.flag}</span>
          <span className="font-semibold truncate">{selectedLang.name}</span>
          {selectedLang.code !== 'auto' && (
            <span className="text-xs text-slate-400 truncate hidden sm:inline">
              ({selectedLang.nativeName})
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-cyan-400' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl bg-navy-900 border border-navy-700 shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100">
          {/* Search Box */}
          <div className="p-2 border-b border-navy-800">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search language..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-navy-950 border border-navy-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                autoFocus
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto p-1 space-y-0.5">
            {filtered.length === 0 ? (
              <div className="p-3 text-center text-xs text-slate-500">No languages found</div>
            ) : (
              filtered.map((item) => {
                const isSelected = item.code.toLowerCase() === value.toLowerCase();
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      onChange(item.code);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                        : 'text-slate-200 hover:bg-navy-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{item.flag}</span>
                      <span>{item.name}</span>
                      <span className="text-[11px] text-slate-400">({item.nativeName})</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
