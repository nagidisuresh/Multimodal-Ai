import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, PhoneCall, ExternalLink, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-navy-950 border-t border-navy-800/80 text-slate-400 py-10 px-4 sm:px-6 lg:px-8 mt-auto pb-20 md:pb-10">
      <div className="max-w-7xl mx-auto">
        {/* Urgent Helpline Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-navy-900 to-navy-950 border border-red-500/20 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5 text-red-400 animate-pulse" />
            </div>
            <div>
              <p className="text-white text-sm font-bold">
                Immediate Financial Fraud? Call National Helpline 1930
              </p>
              <p className="text-xs text-slate-400">
                Golden hour intervention can help freeze defrauded bank accounts and UPI nodes.
              </p>
            </div>
          </div>
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-teal-400 border border-teal-500/20 text-xs font-semibold whitespace-nowrap transition-colors"
          >
            <span>cybercrime.gov.in</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Footer Main */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-navy-950 font-black fill-current" />
              </div>
              <span className="text-lg font-extrabold text-white">
                OmniMind<span className="text-teal-400"> AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              One Input. Every Insight. — Multimodal cross-modal intelligence platform grounded in uploaded sources with structured citations across Education, Healthcare, E-Commerce, Assistive Tech, Cooking, Simulation, and Investigation.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/omnimind" className="hover:text-teal-400 font-bold text-teal-300 transition-colors">
                  OmniSense Workspace
                </Link>
              </li>
              <li>
                <Link to="/cases/deb3579d-db10-4382-b21c-b550ea6552ec" className="hover:text-red-400 font-bold text-red-300 transition-colors">
                  Featured Dossier (deb3579d)
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-teal-400 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/cases" className="hover:text-teal-400 transition-colors">
                  Case Investigation
                </Link>
              </li>
              <li>
                <Link to="/files" className="hover:text-teal-400 transition-colors">
                  Evidence Vault
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-teal-400 transition-colors">
                  Smart Entity Search
                </Link>
              </li>
              <li>
                <Link to="/learn" className="hover:text-teal-400 transition-colors">
                  Attack Flow Tutorials
                </Link>
              </li>
              <li>
                <Link to="/multimodal-ai" className="hover:text-teal-400 text-teal-300 font-bold transition-colors">
                  🤖 Multimodal AI Blueprint
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Compliance & Safety
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/privacy" className="hover:text-teal-400 transition-colors">
                  Privacy Policy & Data Scrubbing
                </Link>
              </li>
              <li>
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-teal-400 transition-colors"
                >
                  Indian Cybercrime Coordination Centre (I4C)
                </a>
              </li>
              <li>
                <span className="text-slate-500 text-[11px]">
                  Encrypted In-Memory Pipeline (AES-256 / SHA-256)
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Line */}
        <div className="pt-6 border-t border-navy-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-amber-300/80 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span className="font-medium">
              AI guidance only. Not legal advice.
            </span>
          </div>

          <p className="text-slate-500 text-[11px]">
            &copy; {new Date().getFullYear()} OmniMind AI. One Input. Every Insight.
          </p>
        </div>
      </div>
    </footer>
  );
};
