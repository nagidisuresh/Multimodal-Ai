import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';

// Official multi-colored Google 'G' icon
const GoogleIcon = () => (
  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.14z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.24v3.15C3.26 21.36 7.33 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.26c-.25-.72-.38-1.49-.38-2.26s.13-1.54.38-2.26V6.59H1.24C.45 8.16 0 9.94 0 12s.45 3.84 1.24 5.41l4.04-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.77c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.23 0 12 0 7.33 0 3.26 2.64 1.24 6.59l4.04 3.15c.95-2.84 3.6-4.97 6.72-4.97z"
    />
  </svg>
);

export const Login = () => {
  const { login, signInWithGoogle, isFirebaseConfigured } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';
  const wasExpired = new URLSearchParams(location.search).get('expired');

  // Email / Password submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!email.trim() || !password) {
      setFormError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
      success('Welcome back! Successfully logged in.');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.message || 'Login failed. Please verify your credentials.';
      setFormError(msg);
      error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth Popup submission
  const handleGoogleSignIn = async () => {
    setFormError('');
    try {
      setGoogleLoading(true);
      await signInWithGoogle();
      success('Signed in with Google successfully!');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.message || 'Google sign in failed.';
      setFormError(msg);
      error(msg);
    } finally {
      setGoogleLoading(false);
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
          Sign In to Your Account
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          One Input. Every Insight. — Multimodal Intelligence & VoxAI Language Hub
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="p-8 rounded-3xl bg-navy-900/90 border border-navy-800 shadow-2xl backdrop-blur-xl space-y-6">
          {wasExpired && (
            <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Your session has expired. Please log in again.</span>
            </div>
          )}

          {formError && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* 1. Continue with Google Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg active:scale-[0.99]"
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-slate-700" />
            ) : (
              <GoogleIcon />
            )}
            <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-navy-700/80 w-full" />
            <span className="bg-navy-900 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider relative">
              Or with email
            </span>
            <div className="border-t border-navy-700/80 w-full" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  disabled={loading || googleLoading}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-navy-700 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 text-sm text-white placeholder-slate-500 outline-none transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-teal-400 hover:text-teal-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading || googleLoading}
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-navy-950 border border-navy-700 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 text-sm text-white placeholder-slate-500 outline-none transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200 transition-colors p-0.5"
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-navy-950 font-extrabold text-sm shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-navy-950" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Helper */}
          <div className="pt-2 text-center border-t border-navy-800/80">
            <button
              type="button"
              onClick={() => {
                setEmail('demo@omnimind.ai');
                setPassword('Password123');
              }}
              className="text-[11px] text-teal-400/80 hover:text-teal-300 transition-colors"
            >
              Use demo credentials: demo@omnimind.ai / Password123
            </button>
          </div>
        </div>

        {/* Link to Sign up */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Don't have an account yet?{' '}
          <Link
            to="/signup"
            className="font-bold text-teal-400 hover:text-teal-300 transition-colors"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};
