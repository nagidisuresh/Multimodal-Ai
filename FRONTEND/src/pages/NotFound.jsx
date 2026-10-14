import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-4 text-center text-white">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-black mb-2">404 - Dossier Not Found</h1>
      <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
        The requested case dossier or evidence path does not exist in the OmniMind AI registry.
      </p>
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold text-xs transition-colors shadow-lg shadow-teal-500/20"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};
