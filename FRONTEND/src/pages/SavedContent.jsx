import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { SkeletonCard, EmptyState } from '../components/Skeleton';
import {
  BookmarkCheck,
  Share2,
  Copy,
  Trash2,
  ExternalLink,
  Clock,
  Globe,
  Sparkles,
  RotateCw
} from 'lucide-react';

export const SavedContent = () => {
  const { success, error } = useToast();
  const [contentList, setContentList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const res = await api.get('/content');
      setContentList(res.data.content || []);
    } catch (err) {
      error('Could not load saved content.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    success('Post copied to clipboard!');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this generated post?')) return;
    try {
      await api.delete(`/content/${id}`);
      setContentList((prev) => prev.filter((c) => c.id !== id));
      success('Post deleted.');
    } catch (err) {
      error('Failed to delete post.');
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 text-white space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Community Defense Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Saved Social Media Posts
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access, copy, and disseminate all your PII-scrubbed awareness materials
          </p>
        </div>
        <button
          onClick={fetchContent}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-2 rounded-xl bg-navy-800 border border-navy-700 text-xs text-slate-300 hover:text-white"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <SkeletonCard count={4} />
      ) : contentList.length === 0 ? (
        <EmptyState
          icon={BookmarkCheck}
          title="No Saved Social Content Yet"
          description="Generate your first public awareness post inside any active case dossier under the 'Content Studio' tab."
          actionText="Browse Cases"
          onAction={() => window.location.href = '/cases'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contentList.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-navy-800/70 border border-navy-700/80 space-y-4 cyber-card flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-300 border border-teal-500/20">
                      {item.platform}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Format: {item.format}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-navy-950/70 text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap max-h-60 overflow-y-auto border border-navy-800/80">
                  {item.content}
                </div>
              </div>

              <div className="pt-3 border-t border-navy-700/80 flex items-center justify-between text-xs">
                {item.case_id ? (
                  <Link
                    to={`/cases/${item.case_id}`}
                    className="text-xs text-teal-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>View Origin Case</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                ) : (
                  <span className="text-[10px] text-slate-500">Standalone Studio Post</span>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(item.content)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 text-xs font-bold transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete"
                    aria-label="Delete saved content"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
