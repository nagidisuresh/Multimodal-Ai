import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Sparkles,
  MailCheck,
  RotateCw,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

export const VerifyEmail = () => {
  const { user, sendVerification } = useAuth();
  const { success, error } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const displayEmail = location.state?.email || user?.email || 'your email address';

  const handleResend = async () => {
    try {
      setResending(true);
      await sendVerification();
      setResendSuccess(true);
      success('Verification email sent again! Please check your spam/junk folder if needed.');
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err) {
      error(err.message || 'Failed to resend verification email.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Neon Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-teal-500/15 via-cyan-500/10 to-indigo-500/15 blur-[140px] rounded-full pointer-events-none" />

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
          Verify Your Email
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          We've sent an activation link to complete your account setup.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="p-8 rounded-3xl bg-navy-900/90 border border-navy-800 shadow-2xl backdrop-blur-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-teal-500/20 to-cyan-500/20 border border-teal-500/40 flex items-center justify-center mx-auto text-teal-300 shadow-xl shadow-teal-500/20">
            <MailCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">Check Your Inbox</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We dispatched a confirmation email to:
            </p>
            <p className="inline-block px-3 py-1.5 rounded-xl bg-navy-950 border border-teal-500/30 text-teal-300 font-mono text-xs font-semibold">
              {displayEmail}
            </p>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Click the link in the message to verify your email and unlock full access to OmniMind and VoxAI tools.
          </p>

          {resendSuccess && (
            <div className="p-3 rounded-xl bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Verification email sent again!</span>
            </div>
          )}

          <div className="pt-2 space-y-3">
            {/* Resend button */}
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="w-full py-2.5 px-4 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 hover:text-white font-bold text-xs border border-navy-700/80 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
              <span>{resending ? 'Sending Email...' : 'Resend Verification Email'}</span>
            </button>

            {/* Continue to dashboard */}
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-navy-950 font-extrabold text-sm shadow-lg shadow-teal-500/20 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Continue to Dashboard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="pt-2 border-t border-navy-800/80">
            <Link
              to="/login"
              className="text-xs text-slate-400 hover:text-teal-400 transition-colors"
            >
              Already verified? Sign in again
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
