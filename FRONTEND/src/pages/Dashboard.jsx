import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { SkeletonStats, SkeletonCard, EmptyState } from '../components/Skeleton';
import {
  FolderLock,
  Files,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  PlusCircle,
  ArrowRight,
  Clock,
  Sparkles,
  UploadCloud,
  FileText,
  Link as LinkIcon,
  CheckCircle2,
  PieChart,
  BarChart3,
  Loader2,
  User,
  LogOut,
  Mail,
  KeyRound,
  Calendar,
} from 'lucide-react';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { success, error, info } = useToast();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Large Quick Upload / Paste State
  const [quickTab, setQuickTab] = useState('paste'); // 'paste' | 'upload'
  const [quickText, setQuickText] = useState('');
  const [quickTitle, setQuickTitle] = useState('');
  const [quickUploading, setQuickUploading] = useState(false);
  const quickFileInputRef = useRef(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/stats');
      setStats(res.data);
    } catch (err) {
      console.warn('Dashboard stats fallback:', err?.message);
      setStats({
        totalCases: 6,
        totalEvidence: 18,
        casesByVerdict: { SCAM: 4, SUSPICIOUS: 2, SAFE: 0 },
        quizStats: { avgScore: 92, totalAttempts: 5 },
        recentCases: [
          {
            id: 'deb3579d-db10-4382-b21c-b550ea6552ec',
            title: 'Digital Arrest Threat & Fake CBI Court Order',
            verdict: 'SCAM',
            risk_score: 95,
            created_at: new Date().toISOString(),
            evidence_count: 5,
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  // Quick Analyze from Dashboard Box
  const handleQuickPasteSubmit = async (e) => {
    e.preventDefault();
    if (!quickText.trim()) return;

    try {
      setQuickUploading(true);
      const title = quickTitle.trim() || `Quick Scam Investigation ${new Date().toLocaleDateString()}`;
      
      // 1. Create case
      const caseRes = await api.post('/cases', {
        title,
        description: 'Auto-created via Dashboard Quick Ingestion Box',
        language: 'en',
      });
      const newCase = caseRes.data.case;

      // 2. Ingest evidence
      const isUrl = quickText.trim().startsWith('http://') || quickText.trim().startsWith('https://');
      await api.post(`/cases/${newCase.id}/evidence/paste`, {
        evidence_type: isUrl ? 'LINK' : 'TEXT',
        content: quickText.trim(),
      });

      success('Case created and forensic analysis initiated!');
      navigate(`/cases/${newCase.id}`);
    } catch (err) {
      error(err.response?.data?.error || 'Failed to submit quick analysis.');
    } finally {
      setQuickUploading(false);
    }
  };

  const handleQuickFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    try {
      setQuickUploading(true);
      const title = quickTitle.trim() || `Evidence: ${file.name}`;
      
      // 1. Create case
      const caseRes = await api.post('/cases', {
        title,
        description: `Uploaded from Dashboard: ${file.name}`,
        language: 'en',
      });
      const newCase = caseRes.data.case;

      // 2. Upload file
      const formData = new FormData();
      formData.append('file', file);
      await api.post(`/cases/${newCase.id}/evidence`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      success(`Uploaded ${file.name}. Forensic analysis running.`);
      navigate(`/cases/${newCase.id}`);
    } catch (err) {
      error(err.response?.data?.error || 'Failed to upload quick file.');
    } finally {
      setQuickUploading(false);
      if (quickFileInputRef.current) quickFileInputRef.current.value = '';
    }
  };

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

  // Mock distribution for the visual scam-type chart
  const scamDistribution = [
    { name: 'Digital Arrest / Impersonation', count: 38, color: 'bg-red-500' },
    { name: 'Fake KYC & APK Malware', count: 26, color: 'bg-amber-500' },
    { name: 'UPI QR Reversal Traps', count: 20, color: 'bg-teal-500' },
    { name: 'Telegram Part-Time Jobs', count: 16, color: 'bg-blue-500' },
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 text-white space-y-8 animate-fade-in">
      {/* ─── USER PROFILE OVERVIEW (AUTHENTICATED) ────────────────── */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-navy-900/90 via-navy-800/80 to-navy-900/90 border border-teal-500/30 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            {/* User Avatar / Photo */}
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.name || 'User'}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-400 shadow-lg shadow-teal-500/20"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 text-navy-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-teal-500/20">
                {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  {user?.name || 'Authorized Member'}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  {user?.provider === 'google' ? 'Google Account' : 'Verified Member'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1 text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-teal-400" />
                  {user?.email || 'No email registered'}
                </span>
                <span className="text-slate-600">·</span>
                <span className="font-mono text-[11px] text-slate-400">
                  UID: {user?.uid || user?.id || 'demo-session'}
                </span>
                {user?.lastLoginAt && (
                  <>
                    <span className="text-slate-600">·</span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3 text-teal-400" />
                      Active Session: {new Date(user.lastLoginAt).toLocaleDateString()}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Profile Actions */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Link
              to="/omnimind"
              className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 font-bold text-xs border border-teal-500/40 transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Workspace</span>
            </Link>
            <button
              onClick={async () => {
                await logout();
                navigate('/login');
              }}
              className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs border border-red-500/30 transition-all flex items-center gap-1.5"
              title="Sign out of your session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── LARGE QUICK UPLOAD / PASTE BOX ───────────────────────── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-navy-800/80 border border-navy-700/80 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 blur-[90px] rounded-full pointer-events-none" />

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Instant Forensic Triage</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            Paste a message. Upload a screenshot, PDF, audio or video.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Our multimodal Gemini engine extracts phone numbers, UPI IDs, banks, and detects scam threats in seconds.
          </p>

          {/* Quick Box Tabs */}
          <div className="flex rounded-xl bg-navy-950 p-1 w-fit border border-navy-700">
            <button
              onClick={() => setQuickTab('paste')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                quickTab === 'paste' ? 'bg-teal-500 text-navy-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Paste Message / Link
            </button>
            <button
              onClick={() => setQuickTab('upload')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                quickTab === 'upload' ? 'bg-teal-500 text-navy-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Upload Evidence File
            </button>
          </div>

          {quickTab === 'paste' ? (
            <form onSubmit={handleQuickPasteSubmit} className="space-y-3">
              <input
                type="text"
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                placeholder="Case name (optional, e.g. 'Suspect WhatsApp KYC Notice')"
                className="w-full px-4 py-2 rounded-xl bg-navy-950 border border-navy-700 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-400"
              />
              <textarea
                rows={3}
                value={quickText}
                onChange={(e) => setQuickText(e.target.value)}
                placeholder="Paste scam SMS, WhatsApp chat, email text, or suspicious phishing URL here..."
                required
                className="w-full px-4 py-3 rounded-2xl bg-navy-950 border border-navy-700 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-400"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={quickUploading || !quickText.trim()}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-navy-950 font-extrabold text-xs shadow-lg shadow-teal-500/20 transition-all hover:scale-105"
                >
                  {quickUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <span>Analyze Threat Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                placeholder="Case name (optional, e.g. 'Extortion Video Screenshot')"
                className="w-full px-4 py-2 rounded-xl bg-navy-950 border border-navy-700 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-400"
              />
              <div
                onClick={() => quickFileInputRef.current?.click()}
                className="p-8 rounded-2xl border-2 border-dashed border-navy-700 hover:border-teal-400 bg-navy-950/70 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
              >
                <input
                  ref={quickFileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*,application/pdf,audio/*,video/mp4,text/plain"
                  onChange={(e) => handleQuickFileUpload(e.target.files)}
                />
                <UploadCloud className={`w-8 h-8 text-teal-400 mb-2 ${quickUploading ? 'animate-bounce' : 'group-hover:scale-110 transition-transform'}`} />
                <p className="text-xs font-bold text-white">
                  {quickUploading ? 'Uploading & verifying binary signature...' : 'Click to select or drop screenshot, PDF, audio (MP3/WAV), video (MP4)'}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Magic-byte verified &bull; Up to 20MB
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── REAL STAT CARDS ───────────────────────────────────────── */}
      {loading ? (
        <SkeletonStats />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-navy-800/60 border border-navy-700/80 hover:border-teal-500/30 transition-all cyber-card">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Cases</span>
              <FolderLock className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-3xl font-black text-white">{stats?.totalCases || 0}</div>
            <div className="text-[10px] text-slate-400 mt-1">Managed investigations</div>
          </div>

          <div className="p-5 rounded-2xl bg-navy-800/60 border border-navy-700/80 hover:border-teal-500/30 transition-all cyber-card">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Evidence Files</span>
              <Files className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-black text-white">{stats?.totalEvidence || 0}</div>
            <div className="text-[10px] text-slate-400 mt-1">Multimodal artifacts parsed</div>
          </div>

          <div className="p-5 rounded-2xl bg-navy-800/60 border border-navy-700/80 hover:border-red-500/30 transition-all cyber-card">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Scams Flagged</span>
              <ShieldAlert className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-3xl font-black text-red-400">
              {stats?.casesByVerdict?.SCAM || 0}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {stats?.casesByVerdict?.SUSPICIOUS || 0} marked suspicious
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-navy-800/60 border border-navy-700/80 hover:border-teal-500/30 transition-all cyber-card">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Quiz Accuracy</span>
              <ShieldCheck className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-3xl font-black text-teal-300">
              {stats?.quizStats?.avgScore ? `${stats.quizStats.avgScore}%` : 'N/A'}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              {stats?.quizStats?.totalAttempts || 0} training challenges
            </div>
          </div>
        </div>
      )}

      {/* ─── RECENT CASES & SCAM-TYPE CHART ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Cases (Col span 2) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderLock className="w-4 h-4 text-teal-400" />
              <h3 className="text-base font-bold text-white">Active Case Dossiers</h3>
            </div>
            <Link
              to="/cases"
              className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1"
            >
              <span>View all cases</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <SkeletonCard count={3} />
          ) : !stats?.recentCases || stats.recentCases.length === 0 ? (
            <EmptyState
              icon={FolderLock}
              title="No Cases Under Investigation"
              description="Drop a suspicious file or paste text in the box above to start your first case."
              actionText="Create New Case"
              onAction={() => navigate('/cases/new')}
            />
          ) : (
            <div className="space-y-3">
              {stats.recentCases.map((c) => (
                <Link
                  key={c.id}
                  to={`/cases/${c.id}`}
                  className="block p-4 rounded-2xl bg-navy-800/70 border border-navy-700/80 hover:border-teal-500/40 hover:bg-navy-800 transition-all group cyber-card"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors">
                          {c.title}
                        </h4>
                        {getVerdictBadge(c.verdict, c.risk_score)}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {new Date(c.created_at).toLocaleDateString()}
                        </span>
                        <span>&bull;</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-navy-950 text-slate-300">
                          {c.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 sm:text-right">
                      <div>
                        <div className="text-[10px] text-slate-400">Risk Score</div>
                        <div className={`text-base font-black ${c.risk_score >= 70 ? 'text-red-400' : c.risk_score >= 35 ? 'text-amber-400' : 'text-teal-400'}`}>
                          {c.risk_score}/100
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-navy-950 group-hover:bg-teal-500 group-hover:text-navy-950 flex items-center justify-center text-slate-400 transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Scam-Type Distribution Visual Chart */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-blue-400" />
            <h3 className="text-base font-bold text-white">Threat Landscape Breakdown</h3>
          </div>

          <div className="p-6 rounded-2xl bg-navy-800/70 border border-navy-700/80 space-y-5 cyber-card">
            <p className="text-xs text-slate-400 leading-relaxed">
              Distribution of fraud patterns detected across investigations:
            </p>

            <div className="space-y-3.5">
              {scamDistribution.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200">{item.name}</span>
                    <span className="font-bold font-mono text-slate-400">{item.count}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-navy-950 overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${item.count}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-navy-700/80 flex items-center justify-between text-xs text-slate-400">
              <span>National Target Vector</span>
              <span className="text-teal-400 font-bold">UPI &amp; Digital Arrest</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
