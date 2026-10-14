import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { SkeletonCard, EmptyState } from '../components/Skeleton';
import {
  FolderLock,
  PlusCircle,
  Search,
  Filter,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Trash2,
  ArrowRight,
  Globe,
  Compass
} from 'lucide-react';

export const CasesList = () => {
  const { t } = useLanguage();
  const { success, error } = useToast();

  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [verdictFilter, setVerdictFilter] = useState('ALL');

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const res = await api.get('/cases');
      setCases(res.data.cases || []);
    } catch (err) {
      console.error('Failed to fetch cases', err);
      error('Could not load cases list.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id, title) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete case "${title}"? All associated evidence, messages, and content will be permanently removed.`)) {
      return;
    }

    try {
      await api.delete(`/cases/${id}`);
      setCases((prev) => prev.filter((c) => c.id !== id));
      success('Case deleted successfully.');
    } catch (err) {
      error('Failed to delete case.');
    }
  };

  const filteredCases = cases.filter((c) => {
    const title = (c?.title || '').toLowerCase();
    const desc = (c?.description || '').toLowerCase();
    const query = (searchQuery || '').toLowerCase();
    const matchesSearch = title.includes(query) || desc.includes(query);

    const matchesStatus = statusFilter === 'ALL' || c?.status === statusFilter;
    const matchesVerdict = verdictFilter === 'ALL' || c?.verdict === verdictFilter;

    return matchesSearch && matchesStatus && matchesVerdict;
  });

  const getVerdictBadge = (verdict, score = 0) => {
    if (verdict === 'SCAM' || score >= 70) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-300 border border-red-500/30">
          <ShieldAlert className="w-3 h-3" /> SCAM
        </span>
      );
    }
    if (verdict === 'SUSPICIOUS' || score >= 35) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
          <AlertTriangle className="w-3 h-3" /> SUSPICIOUS
        </span>
      );
    }
    if (verdict === 'SAFE') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30">
          <ShieldCheck className="w-3 h-3" /> SAFE
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/15 text-slate-300 border border-slate-500/30">
        PENDING
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-navy-950 py-8 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Case Investigations
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Browse, filter, and inspect your ongoing and analyzed scam cases
            </p>
          </div>
          <Link
            to="/cases/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold text-xs shadow-lg shadow-teal-500/20 transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('newCase')}</span>
          </Link>
        </div>

        {/* Unified Multimodal Platform Linkage Banner */}
        <div className="p-4 rounded-3xl bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-navy-900 border border-teal-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-extrabold text-sm">OmniSense AI Multimodal Workspace</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Unified Platform
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Cross-modal reasoning for Education, Healthcare, E-Commerce, Accessibility, Simulation, and Cyber-Forensics.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Link
              to="/omnimind"
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-navy-950 font-black text-xs shadow-md transition-all hover:scale-105"
            >
              <span>Open Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/cases/deb3579d-db10-4382-b21c-b550ea6552ec"
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 font-bold text-xs transition-all hover:scale-105"
            >
              <span>Featured Dossier (deb3579d)</span>
            </Link>
          </div>
        </div>

        {/* Search & Filters Controls */}
        <div className="p-4 rounded-2xl bg-navy-900/60 border border-navy-800 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search case titles or descriptions..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-navy-950 border border-navy-700 focus:border-teal-400 text-xs text-white placeholder-slate-500 outline-none transition-all"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-1 text-xs text-slate-400 mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters:</span>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-navy-950 border border-navy-700 text-xs text-slate-300 outline-none focus:border-teal-400"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="ANALYZED">Analyzed</option>
              <option value="CLOSED">Closed</option>
            </select>

            {/* Verdict Filter */}
            <select
              value={verdictFilter}
              onChange={(e) => setVerdictFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-navy-950 border border-navy-700 text-xs text-slate-300 outline-none focus:border-teal-400"
            >
              <option value="ALL">All Verdicts</option>
              <option value="SCAM">Scam</option>
              <option value="SUSPICIOUS">Suspicious</option>
              <option value="SAFE">Safe</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
        </div>

        {/* Cases Grid */}
        {loading ? (
          <SkeletonCard count={6} />
        ) : filteredCases.length === 0 ? (
          <EmptyState
            icon={FolderLock}
            title={cases.length === 0 ? 'No Cases Yet' : 'No Matching Cases'}
            description={
              cases.length === 0
                ? 'Create your first investigation case to upload evidence files, run AI forensic analysis, and generate complaints.'
                : 'Try adjusting your search query or filter settings.'
            }
            actionText={cases.length === 0 ? 'Create First Case' : 'Clear Filters'}
            onAction={
              cases.length === 0
                ? () => window.location.href = '/cases/new'
                : () => {
                    setSearchQuery('');
                    setStatusFilter('ALL');
                    setVerdictFilter('ALL');
                  }
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCases.map((c) => (
              <Link
                key={c.id}
                to={`/cases/${c.id}`}
                className="p-5 rounded-2xl bg-navy-900/60 border border-navy-800 hover:border-teal-500/40 hover:bg-navy-900 transition-all flex flex-col justify-between group shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    {getVerdictBadge(c.verdict, c.risk_score)}
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/20">
                      <Globe className="w-3 h-3" />
                      <span>{c.language}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-1">
                      {c.title}
                    </h3>
                    {c.description && (
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {c.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-navy-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{c.created_at ? new Date(c.created_at).toLocaleDateString() : 'Recent'}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block leading-none">Risk</span>
                      <span className={`text-sm font-black leading-none ${c.risk_score >= 70 ? 'text-red-400' : c.risk_score >= 35 ? 'text-amber-400' : 'text-teal-400'}`}>
                        {c.risk_score}%
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleDelete(e, c.id, c.title)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete Case"
                      aria-label={`Delete ${c.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
