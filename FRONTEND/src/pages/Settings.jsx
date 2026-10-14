import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import {
  Settings as SettingsIcon,
  User,
  Globe,
  Sun,
  Moon,
  Trash2,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Lock
} from 'lucide-react';

export const Settings = () => {
  const { user, deleteAccount, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      error('Please type "DELETE" exactly to confirm account deletion.');
      return;
    }

    try {
      setDeleting(true);
      await deleteAccount();
      success('Your account and all associated cases and evidence have been permanently erased.');
      navigate('/login');
    } catch (err) {
      error('Failed to delete account. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 text-white space-y-8 max-w-4xl mx-auto animate-fade-in">
      <div>
        <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider mb-1">
          <SettingsIcon className="w-4 h-4" />
          <span>System &amp; Vault Preferences</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Account &amp; Forensic Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your personal profile, regional language, visual theme, and data erasure rights
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <div className="p-6 rounded-2xl bg-navy-800/70 border border-navy-700/80 space-y-4 cyber-card">
          <div className="flex items-center gap-3 pb-4 border-b border-navy-700/80">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 font-bold text-lg">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{user?.name || 'Investigator'}</h2>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Account Role</span>
              <span className="font-semibold text-slate-200 uppercase">{user?.role || 'User'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">User Identifier</span>
              <span className="font-mono text-[11px] text-slate-400 truncate block">{user?.id}</span>
            </div>
          </div>
        </div>

        {/* Regional Language Selection */}
        <div className="p-6 rounded-2xl bg-navy-800/70 border border-navy-700/80 space-y-4 cyber-card">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-teal-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Regional Language Support
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Select your preferred regional language. Police complaint drafts, threat explanations, and narration will prioritize this language.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {[
              { code: 'en', name: 'English', native: 'English (Default)' },
              { code: 'te', name: 'Telugu', native: 'తెలుగు (Telugu)' },
              { code: 'hi', name: 'Hindi', native: 'हिन्दी (Hindi)' },
            ].map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLanguage(lang.code);
                  success(`Switched language to ${lang.name}`);
                }}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  language === lang.code
                    ? 'bg-teal-500/15 border-teal-400 text-teal-300 shadow-sm'
                    : 'bg-navy-950 border-navy-700 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold">{lang.name}</div>
                <div className="text-[10px] opacity-75 mt-0.5">{lang.native}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Theme Appearance Mode */}
        <div className="p-6 rounded-2xl bg-navy-800/70 border border-navy-700/80 space-y-4 cyber-card">
          <div className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Visual Appearance
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                theme === 'dark'
                  ? 'bg-navy-950 border-teal-400 text-teal-300'
                  : 'bg-navy-900 border-navy-700 text-slate-400 hover:text-white'
              }`}
            >
              <Moon className="w-5 h-5" />
              <div className="text-left">
                <p className="text-xs font-bold">Dark Shield (Default)</p>
                <p className="text-[10px] text-slate-400">High contrast for cyber operations</p>
              </div>
            </button>

            <button
              onClick={() => setTheme('light')}
              className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                theme === 'light'
                  ? 'bg-navy-950 border-teal-400 text-teal-300'
                  : 'bg-navy-900 border-navy-700 text-slate-400 hover:text-white'
              }`}
            >
              <Sun className="w-5 h-5" />
              <div className="text-left">
                <p className="text-xs font-bold">Light Contrast</p>
                <p className="text-[10px] text-slate-400">Crisp daytime readability</p>
              </div>
            </button>
          </div>
        </div>

        {/* Danger Zone: Account Deletion */}
        <div className="p-6 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-4">
          <div className="flex items-center gap-2 text-red-400">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Danger Zone: Irreversible Account Erasure
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            In compliance with Indian Digital Personal Data Protection (DPDP) principles, you can trigger full data erasure. This will permanently delete your account, cases, evidence files in storage, and conversation records.
          </p>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-bold transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Account &amp; Erase Evidence</span>
          </button>
        </div>
      </div>

      {/* Safety Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-3xl bg-navy-900 border border-red-500/40 shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-red-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Permanently Delete Account?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This action <strong>cannot be undone</strong>. All your active cases, uploaded screenshots, audio transcripts, and complaint records will be immediately erased from the database and storage bucket.
            </p>
            <div className="space-y-1.5 pt-2">
              <label className="text-[10px] font-bold uppercase text-slate-400 block">
                Type "DELETE" below to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-700 text-xs text-white outline-none focus:border-red-400"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-navy-800">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl bg-navy-800 text-slate-300 text-xs font-semibold hover:bg-navy-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting || deleteConfirmation !== 'DELETE'}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-bold transition-colors"
              >
                {deleting ? 'Erasing...' : 'Confirm Permanent Erasure'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
