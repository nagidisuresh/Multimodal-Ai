import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  ArrowRight,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
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

export const Register = () => {
  const { signUp, signInWithGoogle } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Password rules validation helper
  const hasMinLength = password.length >= 8;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Please enter your full name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setFormError('Please enter a valid email address.');
      return;
    }

    if (!hasMinLength || !hasLetter || !hasNumber) {
      setFormError('Password must be at least 8 characters with at least 1 letter and 1 number.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match. Please re-enter.');
      return;
    }

    try {
      setLoading(true);
      await signUp(name.trim(), email.trim(), password);
      success('Account created! A verification link has been sent to your email.');
      navigate('/verify-email', { state: { email: email.trim() } });
    } catch (err) {
      const msg = err.message || 'Registration failed. Please try again.';
      setFormError(msg);
      error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setFormError('');
    try {
      setGoogleLoading(true);
      await signInWithGoogle();
      success('Google Sign-In successful! Welcome aboard.');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = err.message || 'Google sign-up failed.';
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
          Create Your Account
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Get started with Multimodal Intelligence & VoxAI Language Companion
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="p-8 rounded-3xl bg-navy-900/90 border border-navy-800 shadow-2xl backdrop-blur-xl space-y-6">
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
              Or register with email
            </span>
            <div className="border-t border-navy-700/80 w-full" />
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Suresh Kumar"
                  required
                  disabled={loading || googleLoading}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-navy-700 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 text-sm text-white placeholder-slate-500 outline-none transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Email Address */}
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

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 chars with 1 letter & 1 number"
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

              {/* Password Requirements Checklist */}
              {password && (
                <div className="mt-2 grid grid-cols-2 gap-1.5 text-[11px]">
                  <span className={`flex items-center gap-1 ${hasMinLength ? 'text-teal-400' : 'text-slate-500'}`}>
                    <CheckCircle2 className="w-3 h-3" /> 8+ Characters
                  </span>
                  <span className={`flex items-center gap-1 ${hasLetter && hasNumber ? 'text-teal-400' : 'text-slate-500'}`}>
                    <CheckCircle2 className="w-3 h-3" /> Letter & Number
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  disabled={loading || googleLoading}
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-navy-950 border border-navy-700 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 text-sm text-white placeholder-slate-500 outline-none transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200 transition-colors p-0.5"
                  tabIndex={-1}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && !passwordsMatch && (
                <p className="mt-1 text-[11px] text-amber-400">Passwords do not match yet.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-400 hover:to-cyan-300 text-navy-950 font-extrabold text-sm shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-navy-950" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Link to Login */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-bold text-teal-400 hover:text-teal-300 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
