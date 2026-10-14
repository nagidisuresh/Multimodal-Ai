import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Sparkles,
  Mail,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

export const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const { success, error } = useToast();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email.trim()) {
      setFormError('Please enter your account email address.');
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email.trim());
      setSent(true);
      success('Password reset email sent! Please check your inbox.');
    } catch (err) {
      const msg = err.message || 'Failed to send password reset email.';
      setFormError(msg);
      error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Neon Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-teal-500/15 via-cyan-500/10 to-indigo-500/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-teal-500/25 group-hover:scale-105 transition-all">
            <Sparkles className="w-6 h-6 text-navy-950 fill-current" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">
            OmniMind<span className="text-teal-400"> AI</span>
          </span>
        </Link>
        <h2 className="text-2xl font-extrabold tracking-tight text-white">
          Reset Your Password
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Enter your email address and we'll send you a secure link to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="p-8 rounded-3xl bg-navy-900/90 border border-navy-800 shadow-2xl backdrop-blur-xl space-y-6">
          {sent ? (
            <div className="space-y-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center mx-auto text-teal-400 shadow-lg shadow-teal-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">Reset Link Dispatched</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                We've sent password reset instructions to{' '}
                <span className="text-teal-400 font-semibold">{email}</span>. Please click the link in the email to set a new password.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setEmail('');
                  }}
                  className="text-xs text-slate-400 hover:text-teal-400 transition-colors"
                >
                  Didn't receive it? Try another email
                </button>
              </div>
              <Link
                to="/login"
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-navy-950 font-extrabold text-sm shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Your Account Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-navy-700 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 text-sm text-white placeholder-slate-500 outline-none transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-navy-950 font-extrabold text-sm shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-navy-950" />
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-teal-400 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
