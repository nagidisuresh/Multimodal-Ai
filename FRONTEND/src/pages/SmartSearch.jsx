import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { EmptyState } from '../components/Skeleton';
import {
  Search,
  FolderLock,
  FileText,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Layers
} from 'lucide-react';

export const SmartSearch = () => {
  const { error } = useToast();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim() || query.trim().length < 2) return;

    try {
      setLoading(true);
      setSearched(true);
      const res = await api.get(`/search?q=${encodeURIComponent(query.trim())}`);
      setResults(res.data.results || []);
    } catch (err) {
      error('Search query failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 py-8 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Full-Text &amp; Forensic Entity Search</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Smart Evidence Search
          </h1>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Search phone numbers, UPI IDs, URLs, bank accounts, or forensic text across all case files
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search phone number (e.g. 9876543210), UPI ID (@okaxis), or keyword..."
            className="w-full pl-12 pr-28 py-3 rounded-2xl bg-navy-900 border border-navy-700 focus:border-teal-400 text-sm text-white placeholder-slate-500 outline-none shadow-xl"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 top-2 px-4 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-navy-950 font-bold text-xs transition-colors"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Results Container */}
        <div className="space-y-4">
          {searched && (
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Found {results.length} matching evidence artifacts</span>
              <span className="font-mono">Query: "{query}"</span>
            </div>
          )}

          {searched && results.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No Matching Artifacts Found"
              description="No evidence files or extracted forensic entities matched your search query."
            />
          ) : (
            <div className="space-y-3">
              {results.map((res) => (
                <div
                  key={res.id}
                  className="p-5 rounded-2xl bg-navy-900/60 border border-navy-800 hover:border-teal-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-navy-950 text-teal-400 border border-teal-500/20">
                        {res.evidence_type}
                      </span>
                      <h3 className="text-sm font-bold text-white">
                        {res.file_name}
                      </h3>
                      {res.verdict && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          res.verdict === 'SCAM' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {res.verdict}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <FolderLock className="w-3.5 h-3.5 text-slate-500" />
                      <span>Case: <strong className="text-slate-300">{res.case_title}</strong></span>
                      <span>&bull;</span>
                      <span>{new Date(res.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <Link
                    to={`/cases/${res.case_id}`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy-800 hover:bg-teal-500 hover:text-navy-950 text-xs font-bold text-teal-300 transition-colors shrink-0 self-start sm:self-auto"
                  >
                    <span>Open Case</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
