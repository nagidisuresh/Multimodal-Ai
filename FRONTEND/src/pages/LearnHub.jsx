import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../context/ToastContext';
import { SkeletonCard } from '../components/Skeleton';
import {
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export const LearnHub = () => {
  const { error } = useToast();
  const [progress, setProgress] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  const curatedTopics = [
    {
      title: 'Digital Arrest by Fake Police',
      level: 'Advanced',
      vector: 'Video Call Impersonation',
      desc: 'How syndicate call centers set up mock police stations on Skype / WhatsApp to extort victims.',
    },
    {
      title: 'UPI "Receive Money" QR Trap',
      level: 'Beginner',
      vector: 'Payment Reversal Deception',
      desc: 'Why scanning any QR code or entering your UPI PIN will always DEBIT your account, never credit it.',
    },
    {
      title: 'Part-Time Telegram Rating Task',
      level: 'Intermediate',
      vector: 'Ponzi Investment Scheme',
      desc: 'The psychological funnel of small initial ₹150 payouts leading to ₹5,00,000 frozen deposit traps.',
    },
    {
      title: 'Electricity / Bank KYC Deactivation APK',
      level: 'Intermediate',
      vector: 'Android SMS Malware',
      desc: 'How sideloaded malicious APKs establish accessibility hooks to intercept 2-factor OTPs invisibly.',
    },
  ];

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const res = await api.get('/progress');
      setProgress(res.data.progress || []);
      setAttempts(res.data.attempts || []);
    } catch (err) {
      error('Could not load learning progress.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 py-8 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Cyber Resilience Academy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Learn Mode &amp; Forensic Mastery
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Master the psychological architecture of Indian cyber-frauds and track your quiz achievements
          </p>
        </div>

        {/* Curated Attack Vectors Grid */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white">Curated Scam Threat Blueprints</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {curatedTopics.map((topic, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-navy-900/60 border border-navy-800 hover:border-teal-500/40 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
                      {topic.level}
                    </span>
                    <span className="text-[10px] text-slate-500">{topic.vector}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{topic.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{topic.desc}</p>
                </div>

                <Link
                  to="/cases/new"
                  className="pt-3 border-t border-navy-800/80 flex items-center justify-between text-xs font-bold text-teal-400 hover:text-teal-300"
                >
                  <span>Start Case with this Threat</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* User Progress & Quiz History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Topics Studied */}
          <div className="p-6 rounded-3xl bg-navy-900/70 border border-navy-800 space-y-4">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-teal-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Topics Studied ({progress.length})
              </h3>
            </div>

            {progress.length === 0 ? (
              <div className="text-xs text-slate-500 p-4 rounded-xl bg-navy-950 text-center italic">
                No learning modules completed yet. Open any case and explore the "Learn Attack Flow" tab!
              </div>
            ) : (
              <div className="space-y-2.5">
                {progress.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-xl bg-navy-950 flex items-center justify-between gap-3 text-xs border border-navy-800"
                  >
                    <div className="flex items-center gap-2.5">
                      {p.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                      <div>
                        <p className="font-bold text-white">{p.topic}</p>
                        <p className="text-[10px] text-slate-500">
                          Last studied: {new Date(p.last_studied_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      p.status === 'completed' ? 'bg-teal-500/20 text-teal-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quiz Attempts */}
          <div className="p-6 rounded-3xl bg-navy-900/70 border border-navy-800 space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Quiz Attempts History ({attempts.length})
              </h3>
            </div>

            {attempts.length === 0 ? (
              <div className="text-xs text-slate-500 p-4 rounded-xl bg-navy-950 text-center italic">
                No quizzes attempted yet. Test your knowledge inside any active case dossier.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto">
                {attempts.map((att) => (
                  <div
                    key={att.id}
                    className="p-3.5 rounded-xl bg-navy-950 flex items-center justify-between gap-3 text-xs border border-navy-800"
                  >
                    <div>
                      <p className="font-bold text-white">{att.scam_type || 'Forensic Challenge'}</p>
                      <p className="text-[10px] text-slate-500">
                        {new Date(att.created_at).toLocaleDateString()} &bull; Level: {att.level || 'beginner'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-teal-300">
                        {att.score} / {att.total}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {Math.round((att.score / att.total) * 100)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
