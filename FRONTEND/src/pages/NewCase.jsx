import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import {
  FolderPlus,
  Shield,
  ArrowRight,
  Globe,
  Loader2,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const NewCase = () => {
  const { language: defaultLang } = useLanguage();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState(defaultLang || 'en');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const scamPresets = [
    { title: 'Digital Arrest by Fake Police Officers', desc: 'Received a WhatsApp video call with fake police logos demanding immediate verification transfer.' },
    { title: 'UPI Payment Reversal QR Scam', desc: 'Buyer sent a QR code stating "Scan to receive payment" which debited money instead.' },
    { title: 'Telegram Part-Time Rating Job', desc: 'Promised high daily returns for rating hotels on Google Maps; initial ₹500 paid, then ₹50,000 frozen.' },
    { title: 'Urgent Electricity / SIM KYC Deactivation SMS', desc: 'SMS stating power will be disconnected tonight with an APK download link.' },
  ];

  const handlePreset = (preset) => {
    setTitle(preset.title);
    setDescription(preset.desc);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (title.trim().length < 3) {
      setFormError('Case title must be at least 3 characters.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/cases', {
        title: title.trim(),
        description: description.trim() || undefined,
        language,
      });

      success('Case created successfully! You can now upload evidence.');
      navigate(`/cases/${res.data.case.id}`);
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to create case. Please try again.';
      setFormError(msg);
      error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 py-10 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <Link to="/cases" className="text-xs text-slate-400 hover:text-teal-400 font-semibold flex items-center gap-1">
              &larr; Back to Cases
            </Link>
            <div className="flex items-center gap-3">
              <Link to="/omnimind" className="text-xs text-teal-400 hover:text-teal-300 font-bold">
                OmniSense Studio &rarr;
              </Link>
              <Link to="/cases/deb3579d-db10-4382-b21c-b550ea6552ec" className="text-xs text-red-400 hover:text-red-300 font-bold">
                Demo Dossier &rarr;
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
            <FolderPlus className="w-4 h-4" />
            <span>Open New Case Dossier</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Register Fraud Incident
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create an investigation case to organize and analyze all screenshots, receipts, voice calls, and links
          </p>
        </div>

        {/* Quick Presets */}
        <div className="p-4 rounded-2xl bg-navy-900/60 border border-navy-800 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Quick Case Templates (Click to fill)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {scamPresets.map((preset, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handlePreset(preset)}
                className="p-2.5 rounded-xl bg-navy-950/80 hover:bg-navy-800 border border-navy-800 hover:border-teal-500/30 text-left text-xs transition-all group"
              >
                <div className="font-bold text-slate-200 group-hover:text-teal-300 line-clamp-1">
                  {preset.title}
                </div>
                <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                  {preset.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Case Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-navy-900/80 border border-navy-800 shadow-xl space-y-5">
          {formError && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Case Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Digital Arrest Extortion Call via WhatsApp"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-navy-700 focus:border-teal-400 text-sm text-white placeholder-slate-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Incident Context / Summary
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what occurred, financial amount lost (if known), suspects involved, or timeline..."
              className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-navy-700 focus:border-teal-400 text-sm text-white placeholder-slate-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Investigation Language
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { code: 'en', label: 'English', sub: 'Primary' },
                { code: 'te', label: 'Telugu', sub: 'తెలుగు' },
                { code: 'hi', label: 'Hindi', sub: 'हिन्दी' },
              ].map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    language === lang.code
                      ? 'bg-teal-500/15 border-teal-400 text-teal-300 shadow-sm'
                      : 'bg-navy-950 border-navy-800 text-slate-400 hover:text-white hover:border-navy-700'
                  }`}
                >
                  <div className="text-xs font-bold">{lang.label}</div>
                  <div className="text-[10px] opacity-75 mt-0.5">{lang.sub}</div>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              All AI explanations, forensic chat responses, and cybercrime complaint letters will be synthesized in this language.
            </p>
          </div>

          <div className="pt-4 border-t border-navy-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/cases')}
              className="px-4 py-2.5 rounded-xl bg-navy-950 hover:bg-navy-800 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-navy-950 font-extrabold text-xs shadow-lg shadow-teal-500/20 transition-all hover:scale-105"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Case...</span>
                </>
              ) : (
                <>
                  <span>Create Case & Upload Evidence</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
