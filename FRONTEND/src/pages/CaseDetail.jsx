import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { RiskMeter } from '../components/RiskMeter';
import { EntityChips } from '../components/EntityChips';
import { TimelineView } from '../components/TimelineView';
import { SkeletonCard, EmptyState } from '../components/Skeleton';
import {
  FolderLock,
  Files,
  Cpu,
  Layers,
  MessageSquare,
  FileCheck2,
  Share2,
  BookOpen,
  Upload,
  Link as LinkIcon,
  FileText,
  RotateCw,
  Trash2,
  ExternalLink,
  Copy,
  Download,
  Send,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  PhoneCall,
  Clock,
  ArrowRight,
  Info,
  Compass
} from 'lucide-react';

export const CaseDetail = () => {
  const { id: caseId } = useParams();
  const { language: currentLang } = useLanguage();
  const { success, error, info } = useToast();

  const [caseData, setCaseData] = useState(null);
  const [evidenceList, setEvidenceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('evidence');

  // Evidence Upload State
  const [uploadMode, setUploadMode] = useState('file'); // 'file' | 'paste'
  const [pasteType, setPasteType] = useState('TEXT'); // 'TEXT' | 'LINK'
  const [pastedContent, setPastedContent] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Chat State
  const [messages, setMessages] = useState([]);
  const [chatQuestion, setChatQuestion] = useState('');
  const [sendingChat, setSendingChat] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  // Complaint State
  const [victimDetails, setVictimDetails] = useState({
    victim_name: '',
    victim_phone: '',
    incident_date: '',
    amount_lost: '',
  });
  const [complaintText, setComplaintText] = useState('');
  const [generatingComplaint, setGeneratingComplaint] = useState(false);

  // Content Studio State
  const [contentConfig, setContentConfig] = useState({
    platform: 'Instagram',
    format: 'Post',
    tone: 'informative',
    audience: 'general public',
    language: 'en',
    length: 'medium',
  });
  const [generatedPost, setGeneratedPost] = useState('');
  const [generatingPost, setGeneratingPost] = useState(false);

  // Learn Mode State
  const [learnData, setLearnData] = useState(null);
  const [quizId, setQuizId] = useState(null);
  const [loadingLearn, setLoadingLearn] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Summary Generation State
  const [summarizing, setSummarizing] = useState(false);

  // Fetch initial case and evidence
  useEffect(() => {
    fetchCaseDetails();
    fetchEvidence();
    fetchMessages();
  }, [caseId]);

  // Polling for evidence in processing state
  useEffect(() => {
    const hasProcessing = evidenceList.some(
      (ev) => ev.status === 'processing' || ev.status === 'uploaded'
    );
    if (!hasProcessing) return;

    const interval = setInterval(() => {
      fetchEvidence(false);
    }, 4000);

    return () => clearInterval(interval);
  }, [evidenceList]);

  const fetchCaseDetails = async () => {
    try {
      const res = await api.get(`/cases/${caseId}`);
      setCaseData(res.data.case);
      setContentConfig((prev) => ({ ...prev, language: res.data.case.language || 'en' }));
    } catch (err) {
      error('Could not load case details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchEvidence = async (showLoading = true) => {
    try {
      const res = await api.get(`/cases/${caseId}/evidence`);
      setEvidenceList(res.data.evidence || []);
    } catch (err) {
      if (showLoading) error('Could not load evidence files.');
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/cases/${caseId}/messages`);
      setMessages(res.data.messages || []);
      if (res.data.messages?.length > 0) {
        setConversationId(res.data.messages[0].conversation_id);
      }
    } catch (err) {
      console.warn('No messages yet.');
    }
  };

  // ─── File Upload Handler ──────────────────────────────────────────
  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    // Client-side 20MB check
    if (file.size > 20 * 1024 * 1024) {
      error('File exceeds 20MB limit.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      await api.post(`/cases/${caseId}/evidence`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      success(`Uploaded ${file.name}. AI analysis started.`);
      fetchEvidence();
    } catch (err) {
      error(err.response?.data?.error || 'Failed to upload evidence file.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handlePasteSubmit = async (e) => {
    e.preventDefault();
    if (!pastedContent.trim()) return;

    try {
      setUploading(true);
      await api.post(`/cases/${caseId}/evidence/paste`, {
        evidence_type: pasteType,
        content: pastedContent.trim(),
      });
      success(`Saved ${pasteType === 'LINK' ? 'phishing link' : 'text'}. AI analysis started.`);
      setPastedContent('');
      fetchEvidence();
    } catch (err) {
      error(err.response?.data?.error || 'Failed to save evidence.');
    } finally {
      setUploading(false);
    }
  };

  const handleReanalyze = async (evidenceId) => {
    try {
      await api.post(`/evidence/${evidenceId}/reanalyze`);
      info('Re-analysis started.');
      fetchEvidence(false);
    } catch (err) {
      error('Failed to trigger re-analysis.');
    }
  };

  const handleDeleteEvidence = async (evidenceId, name) => {
    if (!window.confirm(`Delete evidence "${name}"?`)) return;
    try {
      await api.delete(`/evidence/${evidenceId}`);
      setEvidenceList((prev) => prev.filter((ev) => ev.id !== evidenceId));
      success('Evidence deleted.');
    } catch (err) {
      error('Failed to delete evidence.');
    }
  };

  const handleViewEvidence = async (evidenceId) => {
    try {
      const res = await api.get(`/evidence/${evidenceId}`);
      if (res.data.signedUrl) {
        window.open(res.data.signedUrl, '_blank', 'noopener,noreferrer');
      } else if (res.data.evidence?.pasted_text) {
        alert(res.data.evidence.pasted_text);
      } else {
        info('No file URL available.');
      }
    } catch (err) {
      error('Could not open evidence file.');
    }
  };

  // ─── Case Summarization Handler ──────────────────────────────────
  const handleSummarizeCase = async () => {
    const completedCount = evidenceList.filter((ev) => ev.status === 'completed').length;
    if (completedCount === 0) {
      error('No completed evidence files to summarize. Please wait for per-file analysis to finish.');
      return;
    }

    try {
      setSummarizing(true);
      const res = await api.get(`/cases/${caseId}`);
      await api.post(`/cases/${caseId}/summarize`);
      success('Cross-modal case summary generated successfully!');
      fetchCaseDetails();
      setActiveTab('summary');
    } catch (err) {
      error(err.response?.data?.error || 'Failed to generate case summary.');
    } finally {
      setSummarizing(false);
    }
  };

  // ─── Chat Handler ────────────────────────────────────────────────
  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatQuestion.trim()) return;

    const q = chatQuestion.trim();
    setChatQuestion('');
    setSendingChat(true);

    // Optimistic user message
    const tempUserMsg = { id: Date.now(), role: 'user', content: q };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await api.post(`/cases/${caseId}/chat`, {
        question: q,
        conversation_id: conversationId || undefined,
      });

      setConversationId(res.data.conversation_id);
      const aiMsg = {
        id: Date.now() + 1,
        role: 'ai',
        content: res.data.answer,
        sources: res.data.sources || [],
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      error(err.response?.data?.error || 'Chat request failed.');
    } finally {
      setSendingChat(false);
    }
  };

  // ─── Complaint Handler ───────────────────────────────────────────
  const handleGenerateComplaint = async (e) => {
    e.preventDefault();
    try {
      setGeneratingComplaint(true);
      const res = await api.post(`/cases/${caseId}/complaint`, victimDetails);
      setComplaintText(res.data.complaint);
      success('Formal cybercrime complaint generated!');
    } catch (err) {
      error(err.response?.data?.error || 'Failed to generate complaint. Ensure case is summarized.');
    } finally {
      setGeneratingComplaint(false);
    }
  };

  const handleDownloadComplaint = () => {
    if (!complaintText) return;
    const blob = new Blob([complaintText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Cybercrime_Complaint_${caseData?.title?.replace(/\s+/g, '_') || 'Case'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // ─── Content Studio Handler ──────────────────────────────────────
  const handleGenerateContent = async (e) => {
    e.preventDefault();
    try {
      setGeneratingPost(true);
      const res = await api.post('/content/generate', {
        case_id: caseId,
        ...contentConfig,
      });
      setGeneratedPost(res.data.content?.content || '');
      success('Awareness content generated with all PII sanitized.');
    } catch (err) {
      error(err.response?.data?.error || 'Failed to generate content. Please summarize case first.');
    } finally {
      setGeneratingPost(false);
    }
  };

  // ─── Learn Mode Handler ──────────────────────────────────────────
  const handleLoadLearn = async () => {
    try {
      setLoadingLearn(true);
      const res = await api.post(`/cases/${caseId}/learn`, {
        scam_type: caseData?.summary?.scamType || caseData?.title,
        level: 'beginner',
      });
      setLearnData(res.data.learn);
      setQuizId(res.data.quiz_id);
      setQuizAnswers({});
      setQuizSubmitted(false);
      setQuizResult(null);
      success('Attack flow and educational quiz loaded.');
    } catch (err) {
      error(err.response?.data?.error || 'Failed to load Learn content.');
    } finally {
      setLoadingLearn(false);
    }
  };

  const handleSelectQuizAnswer = (qIdx, optIdx) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmitQuiz = async () => {
    if (!quizId || !learnData?.quiz) return;
    if (Object.keys(quizAnswers).length < learnData.quiz.length) {
      error(`Please answer all ${learnData.quiz.length} questions.`);
      return;
    }

    const payload = Object.entries(quizAnswers).map(([qIdx, oIdx]) => ({
      question_index: parseInt(qIdx),
      selected_index: parseInt(oIdx),
    }));

    try {
      const res = await api.post('/learn/quiz-attempt', {
        quiz_id: quizId,
        answers: payload,
      });
      setQuizResult(res.data);
      setQuizSubmitted(true);
      success(`Quiz submitted! Your score: ${res.data.score}/${res.data.total}`);
    } catch (err) {
      error('Failed to submit quiz attempt.');
    }
  };

  // Web Speech API voice narration
  const handleSpeakNarration = (text) => {
    if (!('speechSynthesis' in window)) {
      error('Text-to-speech is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = caseData?.language === 'hi' ? 'hi-IN' : caseData?.language === 'te' ? 'te-IN' : 'en-IN';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 p-8 max-w-7xl mx-auto text-white">
        <SkeletonCard count={3} />
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-navy-950 p-8 max-w-7xl mx-auto text-white">
        <EmptyState
          icon={FolderLock}
          title="Case Not Found"
          description="The requested case does not exist or you do not have permission to access it."
          actionText="Return to Cases"
          onAction={() => window.location.href = '/cases'}
        />
      </div>
    );
  }

  const tabs = [
    { id: 'evidence', label: `Evidence (${evidenceList.length})`, icon: Files },
    { id: 'summary', label: 'Cross-Modal Summary', icon: Layers },
    { id: 'chat', label: 'Ask AI Analyst', icon: MessageSquare },
    { id: 'complaint', label: '1930 Complaint Draft', icon: FileCheck2 },
    { id: 'studio', label: 'Content Studio', icon: Share2 },
    { id: 'learn', label: 'Learn Attack Flow', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-navy-950 py-6 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Case Dossier Header Banner */}
        <div className="p-6 rounded-3xl bg-navy-900/80 border border-navy-800 shadow-xl backdrop-blur-md">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to="/cases"
                  className="text-xs text-slate-400 hover:text-teal-400 flex items-center gap-1 font-semibold"
                >
                  &larr; Cases
                </Link>
                <span className="text-slate-600">&bull;</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-navy-800 text-teal-400 border border-teal-500/20">
                  Lang: {caseData.language}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-navy-800 text-slate-300">
                  Status: {caseData.status}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                {caseData.title}
              </h1>

              {caseData.description && (
                <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                  {caseData.description}
                </p>
              )}
            </div>

            {/* Quick Actions & Risk Summary Gauge */}
            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full lg:w-auto justify-end">
              <RiskMeter
                score={caseData.risk_score}
                verdict={caseData.verdict}
                scamType={caseData.summary?.scamType}
                size="md"
              />

              <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                <Link
                  to="/omnimind?mode=cybershield"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-teal-500/20 to-cyan-500/20 hover:from-teal-500/30 hover:to-cyan-500/30 text-teal-300 border border-teal-500/40 font-extrabold text-xs shadow-lg shadow-teal-500/10 transition-all hover:scale-105"
                  title="Cross-examine these evidence files in OmniSense 3-Panel Multimodal Studio"
                >
                  <Compass className="w-4 h-4 text-teal-400" />
                  <span>Open in OmniSense Studio</span>
                </Link>

                <button
                  onClick={handleSummarizeCase}
                  disabled={summarizing || evidenceList.length === 0}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 disabled:opacity-50 text-navy-950 font-extrabold text-xs shadow-lg shadow-teal-500/20 transition-all hover:scale-105"
                >
                  <Layers className={`w-4 h-4 ${summarizing ? 'animate-spin' : ''}`} />
                  <span>{summarizing ? 'Synthesizing...' : 'Synthesize Case Summary'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="border-b border-navy-800 flex overflow-x-auto gap-2 pb-px scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-bold whitespace-nowrap transition-all ${
                  active
                    ? 'border-teal-400 text-teal-400 bg-teal-500/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-navy-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ─── TAB 1: EVIDENCE ─────────────────────────────────────── */}
        {activeTab === 'evidence' && (
          <div className="space-y-6">
            {/* Upload Zone Card */}
            <div className="p-6 rounded-3xl bg-navy-900/60 border border-navy-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-teal-400" />
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Add Forensic Evidence
                  </h2>
                </div>
                <div className="flex rounded-xl bg-navy-950 p-1 border border-navy-800">
                  <button
                    onClick={() => setUploadMode('file')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      uploadMode === 'file' ? 'bg-teal-500 text-navy-950 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    File Upload
                  </button>
                  <button
                    onClick={() => setUploadMode('paste')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      uploadMode === 'paste' ? 'bg-teal-500 text-navy-950 font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Paste Text / Link
                  </button>
                </div>
              </div>

              {uploadMode === 'file' ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                    handleFileUpload(e.dataTransfer.files);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-8 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    dragActive
                      ? 'border-teal-400 bg-teal-500/10'
                      : 'border-navy-700 hover:border-teal-500/50 bg-navy-950/60'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*,application/pdf,audio/*,video/mp4,text/plain"
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-3">
                    <Upload className={`w-6 h-6 ${uploading ? 'animate-bounce' : ''}`} />
                  </div>
                  <p className="text-sm font-bold text-white">
                    {uploading ? 'Uploading & verifying magic bytes...' : 'Drag & drop evidence files or click to browse'}
                  </p>
                  <p className="text-xs text-slate-400 max-w-md mt-1">
                    Supports Images (PNG, JPG, WebP), PDFs, Audio recordings (MP3, WAV), Video (MP4), and Text. Up to 20MB.
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-[10px] text-teal-300 font-semibold bg-navy-900 px-3 py-1 rounded-full border border-teal-500/20">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                    <span>Auto-validated with file magic-byte signatures to reject spoofed extensions</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handlePasteSubmit} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPasteType('TEXT')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        pasteType === 'TEXT' ? 'bg-navy-800 text-teal-300 border border-teal-500/30' : 'text-slate-400'
                      }`}
                    >
                      Pasted Chat / Email
                    </button>
                    <button
                      type="button"
                      onClick={() => setPasteType('LINK')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        pasteType === 'LINK' ? 'bg-navy-800 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'
                      }`}
                    >
                      Phishing / APK Link
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={pastedContent}
                    onChange={(e) => setPastedContent(e.target.value)}
                    placeholder={
                      pasteType === 'LINK'
                        ? 'Paste suspicious URL (e.g. https://sbi-kyc-update-login.apk.xyz/verify)...'
                        : 'Paste scam message text, WhatsApp conversation transcript, or email body...'
                    }
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-navy-700 focus:border-teal-400 text-xs text-white placeholder-slate-500 outline-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={uploading || !pastedContent.trim()}
                      className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-navy-950 font-bold text-xs transition-colors"
                    >
                      {uploading ? 'Processing...' : 'Ingest & Analyze Evidence'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Evidence Cards List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                  Uploaded Artifacts ({evidenceList.length})
                </h3>
                <button
                  onClick={() => fetchEvidence()}
                  className="text-xs text-slate-400 hover:text-teal-400 flex items-center gap-1"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>
              </div>

              {evidenceList.length === 0 ? (
                <EmptyState
                  icon={Files}
                  title="No Evidence Ingested"
                  description="Upload screenshots, payment receipts, or recordings above to commence multimodal AI forensics."
                />
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {evidenceList.map((ev) => {
                    const analysis = ev.analysis || {};
                    const isCompleted = ev.status === 'completed';
                    const isProcessing = ev.status === 'processing' || ev.status === 'uploaded';
                    const isFailed = ev.status === 'failed';

                    return (
                      <div
                        key={ev.id}
                        className="p-5 rounded-2xl bg-navy-900/70 border border-navy-800 space-y-4 shadow-lg"
                      >
                        {/* Header bar of artifact card */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-navy-800">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-navy-950 border border-navy-700 flex items-center justify-center text-teal-400 font-bold text-xs shrink-0">
                              {ev.evidence_type}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-white truncate max-w-sm">
                                {ev.file_name || 'Evidence Item'}
                              </h4>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                <span>{ev.mime_type || 'text'}</span>
                                {ev.size_bytes > 0 && (
                                  <>
                                    <span>&bull;</span>
                                    <span>{(ev.size_bytes / 1024).toFixed(1)} KB</span>
                                  </>
                                )}
                                <span>&bull;</span>
                                <span>{new Date(ev.created_at).toLocaleTimeString()}</span>
                              </div>
                            </div>
                          </div>

                          {/* Status and Action Buttons */}
                          <div className="flex items-center gap-2">
                            {isProcessing && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 animate-pulse">
                                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Analyzing...</span>
                              </span>
                            )}
                            {isCompleted && (
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                                ev.verdict === 'SCAM'
                                  ? 'bg-red-500/15 text-red-300 border border-red-500/30'
                                  : ev.verdict === 'SUSPICIOUS'
                                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                  : 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                              }`}>
                                {ev.verdict} ({ev.risk_score}%)
                              </span>
                            )}
                            {isFailed && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/15 text-red-300 border border-red-500/30">
                                Failed
                              </span>
                            )}

                            {/* View signed link */}
                            <button
                              onClick={() => handleViewEvidence(ev.id)}
                              className="p-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 hover:text-white transition-colors"
                              title="View file via secure signed link"
                              aria-label="View evidence file"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>

                            {/* Retry analysis */}
                            <button
                              onClick={() => handleReanalyze(ev.id)}
                              className="p-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 hover:text-teal-400 transition-colors"
                              title="Re-analyze evidence"
                              aria-label="Reanalyze evidence"
                            >
                              <RotateCw className="w-4 h-4" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteEvidence(ev.id, ev.file_name)}
                              className="p-1.5 rounded-lg bg-navy-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                              title="Delete evidence"
                              aria-label="Delete evidence"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Analysis Content */}
                        {isCompleted && (
                          <div className="space-y-4 text-xs">
                            {/* Scam Type & Confidence */}
                            {analysis.scamType && (
                              <div className="flex flex-wrap items-center gap-3">
                                <span className="font-bold text-slate-200">
                                  Detected Threat: <span className="text-teal-300">{analysis.scamType}</span>
                                </span>
                                {analysis.confidence !== undefined && (
                                  <span className="text-slate-400">
                                    AI Confidence: {Math.round(analysis.confidence * 100)}%
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Explanation */}
                            {analysis.explanation && (
                              <p className="text-slate-300 leading-relaxed bg-navy-950/50 p-3 rounded-xl border border-navy-800">
                                {analysis.explanation}
                              </p>
                            )}

                            {/* Red Flags List */}
                            {Array.isArray(analysis.redFlags) && analysis.redFlags.length > 0 && (
                              <div className="space-y-1.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  <span>Identified Red Flags ({analysis.redFlags.length})</span>
                                </span>
                                <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs pl-1">
                                  {analysis.redFlags.map((flag, idx) => (
                                    <li key={idx}>{flag}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Extracted Entities */}
                            {analysis.extracted && (
                              <EntityChips entities={analysis.extracted} />
                            )}

                            {/* Transcript if audio/video */}
                            {analysis.transcript && (
                              <div className="p-3 rounded-xl bg-navy-950 border border-navy-800 space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                  Forensic Audio/Text Transcript:
                                </span>
                                <p className="text-slate-300 italic font-mono text-[11px]">
                                  "{analysis.transcript}"
                                </p>
                              </div>
                            )}

                            {/* Next steps */}
                            {Array.isArray(analysis.nextSteps) && analysis.nextSteps.length > 0 && (
                              <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                                  Recommended Immediate Precautions:
                                </span>
                                <ul className="list-disc list-inside space-y-0.5 text-slate-400 text-xs">
                                  {analysis.nextSteps.map((step, idx) => (
                                    <li key={idx}>{step}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        {isFailed && (
                          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center justify-between">
                            <span>Analysis failed: {ev.error_message || 'Format unsupported or API timeout.'}</span>
                            <button
                              onClick={() => handleReanalyze(ev.id)}
                              className="font-bold underline ml-2"
                            >
                              Retry
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB 2: CROSS-MODAL SUMMARY ──────────────────────────── */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            {!caseData.summary || Object.keys(caseData.summary).length === 0 ? (
              <EmptyState
                icon={Layers}
                title="Cross-Modal Summary Not Yet Generated"
                description="Synthesize all uploaded evidence to detect entities repeated across multiple files, construct the incident timeline, and calculate composite risk."
                actionText="Generate Case Summary"
                onAction={handleSummarizeCase}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Summary Description & Timeline */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Executive Forensic Summary Card */}
                  <div className="p-6 rounded-3xl bg-navy-900/70 border border-navy-800 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-teal-400" />
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                          Executive Forensic Summary
                        </h3>
                      </div>
                      <span className="text-xs text-slate-400">
                        Confidence: {Math.round((caseData.summary.confidence || 0) * 100)}%
                      </span>
                    </div>

                    <p className="text-sm text-slate-200 leading-relaxed bg-navy-950/60 p-4 rounded-2xl border border-navy-800">
                      {caseData.summary.summary}
                    </p>

                    {/* Overall Red Flags */}
                    {Array.isArray(caseData.summary.redFlags) && caseData.summary.redFlags.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Primary Scam Indicators</span>
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {caseData.summary.redFlags.map((flag, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-xs flex items-start gap-2"
                            >
                              <span className="text-red-400 font-bold">&bull;</span>
                              <span>{flag}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Incident Chronological Timeline */}
                  <div className="p-6 rounded-3xl bg-navy-900/70 border border-navy-800 space-y-4 shadow-xl">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-teal-400" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        Reconstructed Incident Timeline
                      </h3>
                    </div>
                    <TimelineView timeline={caseData.timeline || []} />
                  </div>
                </div>

                {/* Right Col: Gauge & Cross-Modal Linked Entities */}
                <div className="space-y-6">
                  <RiskMeter
                    score={caseData.risk_score}
                    verdict={caseData.verdict}
                    scamType={caseData.summary.scamType}
                    size="lg"
                  />

                  {/* Cross-modal repeated entities */}
                  <div className="p-5 rounded-2xl bg-navy-900/70 border border-navy-800 space-y-4">
                    <EntityChips linkedEntities={caseData.linked_entities || []} />
                  </div>

                  {/* Recommended Next Steps */}
                  {Array.isArray(caseData.summary.nextSteps) && caseData.summary.nextSteps.length > 0 && (
                    <div className="p-5 rounded-2xl bg-navy-900/70 border border-navy-800 space-y-3">
                      <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
                        Action Plan for Victim:
                      </span>
                      <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-300">
                        {caseData.summary.nextSteps.map((step, idx) => (
                          <li key={idx} className="leading-relaxed">{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 3: ASK AI ANALYST ──────────────────────────────── */}
        {activeTab === 'chat' && (
          <div className="p-6 rounded-3xl bg-navy-900/70 border border-navy-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-navy-800">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Grounded Evidence Q&amp;A
                </h3>
              </div>
              <span className="text-[10px] text-teal-300 font-semibold bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20">
                Source Citations Enforced
              </span>
            </div>

            {/* Suggested Starter Questions */}
            <div className="flex flex-wrap gap-2">
              {[
                'What suspect phone numbers or UPI IDs appeared in the evidence?',
                'Did the perpetrator impersonate police or government officials?',
                'Is there evidence of transaction receipts or financial loss?',
                'What was the initial contact method and bait used?',
              ].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => setChatQuestion(suggestion)}
                  className="px-3 py-1.5 rounded-xl bg-navy-950 border border-navy-700 hover:border-teal-400 text-[11px] text-slate-300 hover:text-white transition-colors"
                >
                  "{suggestion}"
                </button>
              ))}
            </div>

            {/* Messages Thread Container */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto p-4 rounded-2xl bg-navy-950/80 border border-navy-800">
              {messages.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  Ask any question about this case. The AI analyst answers strictly using uploaded evidence with file citations. If unsure, it will state: <br />
                  <span className="italic text-slate-400">"I could not find this information in the uploaded evidence."</span>
                </div>
              ) : (
                messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-teal-600 text-navy-950 font-medium rounded-br-none shadow-md'
                          : 'bg-navy-900 border border-navy-700 text-slate-200 rounded-bl-none shadow-md'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{m.content}</p>

                      {/* Source Citations Badges */}
                      {Array.isArray(m.sources) && m.sources.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-navy-800/80 space-y-1">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-teal-400 block">
                            Citations &amp; Sources:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {m.sources.map((src, sIdx) => (
                              <span
                                key={sIdx}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-navy-950 text-[10px] font-mono text-slate-300 border border-navy-700"
                              >
                                <FileText className="w-3 h-3 text-teal-400" />
                                <span>{src.fileName}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1 px-1">
                      {m.role === 'user' ? 'You' : 'OmniMind AI'}
                    </span>
                  </div>
                ))
              )}
              {sendingChat && (
                <div className="flex items-center gap-2 text-xs text-teal-400 animate-pulse p-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Synthesizing answer from case evidence...</span>
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendChat} className="flex gap-2">
              <input
                type="text"
                value={chatQuestion}
                onChange={(e) => setChatQuestion(e.target.value)}
                placeholder="Ask anything about the suspect, timeline, or evidence..."
                className="flex-1 px-4 py-3 rounded-xl bg-navy-950 border border-navy-700 focus:border-teal-400 text-xs text-white placeholder-slate-500 outline-none"
              />
              <button
                type="submit"
                disabled={sendingChat || !chatQuestion.trim()}
                className="flex items-center gap-1.5 px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-navy-950 font-bold text-xs transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Ask</span>
              </button>
            </form>
          </div>
        )}

        {/* ─── TAB 4: COMPLAINT GENERATOR ──────────────────────────── */}
        {activeTab === 'complaint' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Col: Victim Details Form */}
            <div className="p-6 rounded-3xl bg-navy-900/70 border border-navy-800 space-y-4">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Victim Details
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Provide victim details to automatically format an official complaint for National Helpline 1930 / cybercrime.gov.in. Placeholders will be used if left blank.
              </p>

              <form onSubmit={handleGenerateComplaint} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Victim Full Name
                  </label>
                  <input
                    type="text"
                    value={victimDetails.victim_name}
                    onChange={(e) => setVictimDetails({ ...victimDetails, victim_name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2 rounded-xl bg-navy-950 border border-navy-700 text-xs text-white outline-none focus:border-teal-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Victim Phone / Mobile
                  </label>
                  <input
                    type="tel"
                    value={victimDetails.victim_phone}
                    onChange={(e) => setVictimDetails({ ...victimDetails, victim_phone: e.target.value })}
                    placeholder="e.g. +91 9876543210"
                    className="w-full px-3.5 py-2 rounded-xl bg-navy-950 border border-navy-700 text-xs text-white outline-none focus:border-teal-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Incident Date
                  </label>
                  <input
                    type="date"
                    value={victimDetails.incident_date}
                    onChange={(e) => setVictimDetails({ ...victimDetails, incident_date: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-navy-950 border border-navy-700 text-xs text-white outline-none focus:border-teal-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Amount Defrauded (INR)
                  </label>
                  <input
                    type="text"
                    value={victimDetails.amount_lost}
                    onChange={(e) => setVictimDetails({ ...victimDetails, amount_lost: e.target.value })}
                    placeholder="e.g. ₹50,000"
                    className="w-full px-3.5 py-2 rounded-xl bg-navy-950 border border-navy-700 text-xs text-white outline-none focus:border-teal-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={generatingComplaint}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-navy-950 font-bold text-xs transition-colors shadow-lg shadow-teal-500/20"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>{generatingComplaint ? 'Drafting Complaint...' : 'Generate 1930 Complaint Draft'}</span>
                </button>
              </form>
            </div>

            {/* Right 2 Cols: Complaint Preview & Actions */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-navy-900/70 border border-navy-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-navy-800">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Official Cybercrime Complaint Letter
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    Ready for submission at police stations, cybercrime.gov.in, or banking ombudsman
                  </p>
                </div>
                {complaintText && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(complaintText);
                        success('Complaint text copied to clipboard!');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5 text-teal-400" />
                      <span>Copy</span>
                    </button>
                    <button
                      onClick={handleDownloadComplaint}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 text-xs font-bold transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download .TXT</span>
                    </button>
                  </div>
                )}
              </div>

              {!complaintText ? (
                <EmptyState
                  icon={FileCheck2}
                  title="No Complaint Draft Generated"
                  description="Fill in victim details on the left and click 'Generate 1930 Complaint Draft' to produce a formal letter."
                />
              ) : (
                <div className="p-5 rounded-2xl bg-navy-950 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto border border-navy-800 selection:bg-teal-500 selection:text-navy-950">
                  {complaintText}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB 5: CONTENT STUDIO ──────────────────────────────── */}
        {activeTab === 'studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Col: Platform & Tone Settings */}
            <div className="p-6 rounded-3xl bg-navy-900/70 border border-navy-800 space-y-4">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Post Configuration
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Transforms your case into high-impact public warning content with all PII (names, numbers, UPI, accounts) automatically scrubbed.
              </p>

              <form onSubmit={handleGenerateContent} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Destination Platform
                  </label>
                  <select
                    value={contentConfig.platform}
                    onChange={(e) => setContentConfig({ ...contentConfig, platform: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-navy-950 border border-navy-700 text-xs text-white outline-none"
                  >
                    {['Instagram', 'LinkedIn', 'X', 'WhatsApp', 'YouTube', 'Facebook'].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Post Format
                  </label>
                  <select
                    value={contentConfig.format}
                    onChange={(e) => setContentConfig({ ...contentConfig, format: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-navy-950 border border-navy-700 text-xs text-white outline-none"
                  >
                    {['Post / Caption', 'Story / Carousel', 'Thread', 'Short Video Script', 'Urgent Alert Message'].map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tone
                  </label>
                  <select
                    value={contentConfig.tone}
                    onChange={(e) => setContentConfig({ ...contentConfig, tone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-navy-950 border border-navy-700 text-xs text-white outline-none"
                  >
                    <option value="informative">Informative &amp; Analytical</option>
                    <option value="urgent alert">Urgent Red Alert</option>
                    <option value="cautionary">Cautionary Storytelling</option>
                    <option value="professional">Professional / Corporate Risk</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Audience
                  </label>
                  <select
                    value={contentConfig.audience}
                    onChange={(e) => setContentConfig({ ...contentConfig, audience: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-navy-950 border border-navy-700 text-xs text-white outline-none"
                  >
                    <option value="general public">General Public</option>
                    <option value="seniors & retirees">Seniors &amp; Retirees (High Target)</option>
                    <option value="students & jobseekers">Students &amp; Jobseekers</option>
                    <option value="small businesses">Small Business Owners</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={generatingPost}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-navy-950 font-bold text-xs transition-colors shadow-lg shadow-teal-500/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{generatingPost ? 'Generating...' : 'Generate Sanitized Post'}</span>
                </button>
              </form>
            </div>

            {/* Right 2 Cols: Content Preview */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-navy-900/70 border border-navy-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-navy-800">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    {contentConfig.platform} Awareness Content
                  </h3>
                  <p className="text-[10px] text-teal-400 font-semibold">
                    PII Scrubbed &bull; Ready for Social Sharing
                  </p>
                </div>
                {generatedPost && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedPost);
                      success('Social media post copied!');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold hover:bg-teal-500/30 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Post</span>
                  </button>
                )}
              </div>

              {!generatedPost ? (
                <EmptyState
                  icon={Share2}
                  title="No Social Content Generated"
                  description="Configure the platform and click 'Generate Sanitized Post' to create awareness copy."
                />
              ) : (
                <div className="p-5 rounded-2xl bg-navy-950 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto border border-navy-800">
                  {generatedPost}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB 6: LEARN MODE ──────────────────────────────────── */}
        {activeTab === 'learn' && (
          <div className="space-y-6">
            {!learnData ? (
              <EmptyState
                icon={BookOpen}
                title="Interactive Attack Flow &amp; Quiz"
                description="Study the exact psychological deception pattern used in this scam, listen to step-by-step voice narration, and test your defense skills with a 5-question forensic quiz."
                actionText={loadingLearn ? 'Generating Tutorial...' : 'Load Learn Mode'}
                onAction={handleLoadLearn}
              />
            ) : (
              <div className="space-y-8">
                {/* Attack Flow Walkthrough */}
                <div className="p-6 rounded-3xl bg-navy-900/70 border border-navy-800 space-y-4 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
                        <BookOpen className="w-4 h-4" />
                        <span>Attack Architecture Breakdown</span>
                      </div>
                      <h3 className="text-lg font-bold text-white">
                        {learnData.scamType} ({learnData.level})
                      </h3>
                    </div>

                    {/* Voice narration player */}
                    <button
                      onClick={() => {
                        const narrationText = learnData.steps?.map((s) => `${s.title}. ${s.narration}`).join(' ') || '';
                        handleSpeakNarration(narrationText);
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                        isSpeaking
                          ? 'bg-red-500/20 border border-red-500/40 text-red-300'
                          : 'bg-teal-500 text-navy-950 hover:bg-teal-400'
                      }`}
                    >
                      {isSpeaking ? (
                        <>
                          <Square className="w-3.5 h-3.5 fill-current" />
                          <span>Stop Voice Narration</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4" />
                          <span>Play Audio Explainer</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Step Explainer Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                    {learnData.steps?.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-navy-950/80 border border-navy-800 hover:border-teal-500/30 transition-all space-y-2 flex flex-col justify-between"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-300 border border-teal-500/20">
                              Phase {idx + 1}
                            </span>
                            {step.actor && (
                              <span className="text-[10px] text-slate-400">
                                Actor: {step.actor}
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs font-bold text-white">{step.title}</h4>
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            {step.description}
                          </p>
                        </div>

                        {step.warningSign && (
                          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-[10px] flex items-start gap-1.5 mt-2">
                            <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                            <span>Warning: {step.warningSign}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5-Question Interactive Quiz */}
                <div className="p-6 rounded-3xl bg-navy-900/70 border border-navy-800 space-y-6 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-navy-800">
                    <div>
                      <h3 className="text-base font-bold text-white">
                        Forensic Comprehension Challenge
                      </h3>
                      <p className="text-xs text-slate-400">
                        Test your fraud detection reflexes on 5 targeted situational questions
                      </p>
                    </div>

                    {quizSubmitted && quizResult && (
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-300 font-extrabold text-sm">
                        <span>Score: {quizResult.score} / {quizResult.total}</span>
                        <span>({Math.round((quizResult.score / quizResult.total) * 100)}%)</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    {learnData.quiz?.map((q, qIdx) => {
                      const selected = quizAnswers[qIdx];
                      const isCorrect = selected === q.correctIndex;

                      return (
                        <div
                          key={qIdx}
                          className="p-5 rounded-2xl bg-navy-950/80 border border-navy-800 space-y-3"
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-xs font-mono font-bold text-teal-400 bg-navy-900 px-2 py-0.5 rounded-md">
                              Q{qIdx + 1}
                            </span>
                            <h4 className="text-xs font-bold text-white leading-relaxed">
                              {q.question}
                            </h4>
                          </div>

                          {/* Options */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                            {q.options?.map((opt, optIdx) => {
                              const isThisSelected = selected === optIdx;
                              let btnClass = 'bg-navy-900 border-navy-800 text-slate-300 hover:border-navy-700';

                              if (quizSubmitted) {
                                if (optIdx === q.correctIndex) {
                                  btnClass = 'bg-teal-500/20 border-teal-500/60 text-teal-200 font-bold';
                                } else if (isThisSelected) {
                                  btnClass = 'bg-red-500/20 border-red-500/60 text-red-200';
                                }
                              } else if (isThisSelected) {
                                btnClass = 'bg-teal-500/15 border-teal-400 text-teal-300 font-bold';
                              }

                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() => handleSelectQuizAnswer(qIdx, optIdx)}
                                  className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-2 ${btnClass}`}
                                >
                                  <span>{opt}</span>
                                  {quizSubmitted && optIdx === q.correctIndex && (
                                    <CheckCircle className="w-4 h-4 text-teal-400 shrink-0" />
                                  )}
                                  {quizSubmitted && isThisSelected && optIdx !== q.correctIndex && (
                                    <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Post-submit explanation */}
                          {quizSubmitted && (
                            <div className="p-3 rounded-xl bg-navy-900/90 border border-navy-700 text-xs text-slate-300 space-y-1">
                              <span className="text-[10px] uppercase font-bold text-teal-400 block">
                                Expert Forensic Rationale:
                              </span>
                              <p className="text-[11px] text-slate-300 leading-relaxed">
                                {q.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {!quizSubmitted && (
                    <div className="flex justify-end pt-4 border-t border-navy-800">
                      <button
                        onClick={handleSubmitQuiz}
                        className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-extrabold text-xs shadow-lg shadow-teal-500/20 transition-all hover:scale-105"
                      >
                        Submit Quiz &amp; Record Score
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
