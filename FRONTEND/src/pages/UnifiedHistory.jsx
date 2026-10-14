import React, { useState, useEffect } from 'react';
import {
  History,
  MessageSquare,
  Languages,
  FileText,
  Search,
  Trash2,
  Download,
  FolderLock,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const UnifiedHistory = () => {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'cases' | 'translations' | 'transcripts'
  const [search, setSearch] = useState('');
  const [cases, setCases] = useState([]);
  const [translations, setTranslations] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('voxai_fav_translations') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    axios.get(`${API_BASE}/cases`).then((res) => {
      setCases(res.data?.cases || []);
    }).catch(() => {});
  }, []);

  const clearTranslations = () => {
    setTranslations([]);
    localStorage.removeItem('voxai_fav_translations');
  };

  const filteredCases = cases.filter(
    (c) =>
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredTranslations = translations.filter(
    (t) =>
      t.source?.toLowerCase().includes(search.toLowerCase()) ||
      t.translation?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold mb-2">
            <History className="w-3.5 h-3.5 text-teal-400" />
            <span>Unified Activity & Records Vault</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            History & Records
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access your cross-modal investigations, case dossiers, translations, and voice transcripts.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search records..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-navy-900 border border-navy-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-navy-800 pb-2">
        {[
          { id: 'all', label: 'All Records' },
          { id: 'cases', label: `Case Dossiers (${cases.length})` },
          { id: 'translations', label: `Translations (${translations.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-teal-500 text-navy-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cases Section */}
      {(activeTab === 'all' || activeTab === 'cases') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <FolderLock className="w-4 h-4 text-teal-400" />
              <span>Forensic Case Dossiers</span>
            </h3>
            <Link to="/cases" className="text-xs text-teal-400 hover:underline">
              View All Cases &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredCases.length === 0 ? (
              <p className="text-xs text-slate-500 col-span-2">No matching case dossiers found.</p>
            ) : (
              filteredCases.map((c) => (
                <Link
                  key={c.id}
                  to={`/cases/${c.id}`}
                  className="p-4 rounded-2xl bg-navy-900/80 border border-navy-800 hover:border-teal-500/40 text-xs space-y-2 transition-all block group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white group-hover:text-teal-300 transition-colors truncate">
                      {c.title}
                    </span>
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-400 border border-teal-500/20">
                      {c.status || 'Active'}
                    </span>
                  </div>
                  <p className="text-slate-400 line-clamp-2 leading-relaxed">{c.description}</p>
                </Link>
              ))
            )}
          </div>
        </div>
      )}

      {/* Translations Section */}
      {(activeTab === 'all' || activeTab === 'translations') && (
        <div className="space-y-3 pt-4 border-t border-navy-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Languages className="w-4 h-4 text-purple-400" />
              <span>Saved Translations</span>
            </h3>
            {translations.length > 0 && (
              <button onClick={clearTranslations} className="text-xs text-slate-500 hover:text-red-400">
                Clear Translations
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredTranslations.length === 0 ? (
              <p className="text-xs text-slate-500 col-span-2">No saved translations yet. Use the Translate tool to save items.</p>
            ) : (
              filteredTranslations.map((t, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-navy-900/80 border border-navy-800 text-xs space-y-1.5">
                  <p className="text-slate-400 italic truncate">"{t.source}"</p>
                  <p className="text-white font-bold truncate">&rarr; {t.translation}</p>
                  <span className="text-[10px] text-purple-400 block pt-1">Target: {t.target.toUpperCase()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
