import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { SkeletonCard, EmptyState } from '../components/Skeleton';
import {
  Files,
  ExternalLink,
  Search,
  Filter,
  Clock,
  ArrowRight,
  FolderLock,
  RotateCw
} from 'lucide-react';

export const MyFiles = () => {
  const { error } = useToast();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const res = await api.get('/files');
      setFiles(res.data.files || []);
    } catch (err) {
      error('Could not load files vault.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSigned = async (fileId) => {
    try {
      const res = await api.get(`/evidence/${fileId}`);
      if (res.data.signedUrl) {
        window.open(res.data.signedUrl, '_blank', 'noopener,noreferrer');
      } else if (res.data.evidence?.pasted_text) {
        alert(res.data.evidence.pasted_text);
      }
    } catch (err) {
      error('Could not open file.');
    }
  };

  const filtered = files.filter((f) => {
    const matchesSearch =
      f.file_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.case_title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'ALL' || f.evidence_type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-navy-950 py-8 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Evidence Vault (My Files)
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Global repository of all multimodal evidence artifacts uploaded across your cases
            </p>
          </div>
          <button
            onClick={fetchFiles}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-2 rounded-xl bg-navy-900 border border-navy-800 text-xs text-slate-300 hover:text-white"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Refresh Vault</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl bg-navy-900/60 border border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search filenames or case titles..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-navy-950 border border-navy-700 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-navy-950 border border-navy-700 text-xs text-slate-300 outline-none"
            >
              <option value="ALL">All Types</option>
              <option value="IMAGE">Images</option>
              <option value="PDF">PDFs</option>
              <option value="AUDIO">Audio</option>
              <option value="VIDEO">Video</option>
              <option value="TEXT">Text</option>
              <option value="LINK">Links</option>
            </select>
          </div>
        </div>

        {loading ? (
          <SkeletonCard count={6} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Files}
            title={files.length === 0 ? 'No Evidence Uploaded' : 'No Files Match Filters'}
            description="Artifacts from your cases will appear in this unified forensic vault."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((file) => (
              <div
                key={file.id}
                className="p-5 rounded-2xl bg-navy-900/60 border border-navy-800 hover:border-teal-500/40 transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-navy-950 text-teal-400 border border-teal-500/20">
                      {file.evidence_type}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      file.verdict === 'SCAM' ? 'bg-red-500/20 text-red-300' : file.verdict === 'SUSPICIOUS' ? 'bg-amber-500/20 text-amber-300' : 'bg-teal-500/20 text-teal-300'
                    }`}>
                      {file.verdict || 'PENDING'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-1">
                    {file.file_name}
                  </h3>

                  <Link
                    to={`/cases/${file.case_id}`}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-teal-400 truncate"
                  >
                    <FolderLock className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Case: {file.case_title}</span>
                  </Link>
                </div>

                <div className="pt-3 border-t border-navy-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{new Date(file.created_at).toLocaleDateString()}</span>
                  </div>

                  <button
                    onClick={() => handleOpenSigned(file.id)}
                    className="flex items-center gap-1 text-xs font-semibold text-teal-400 hover:text-teal-300"
                  >
                    <span>View File</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
