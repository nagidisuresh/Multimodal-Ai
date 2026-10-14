import React from 'react';
import { Shield, Lock, EyeOff, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Privacy = () => {
  return (
    <div className="min-h-screen bg-navy-950 py-12 px-4 sm:px-6 lg:px-8 text-slate-300">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold">
            <Lock className="w-3.5 h-3.5 text-teal-400" />
            <span>Forensic Evidence Privacy & Protection Policy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            How OmniMind AI Handles Your Evidence
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            We understand evidence contains highly confidential personal identifiers, account statements, and chats. Here is our technical commitment to your privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-navy-900/60 border border-navy-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <EyeOff className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Strict PII Scrubbing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Before any case data is used to generate public awareness material in Content Studio, all phone numbers, UPI IDs, bank account numbers, IFSC codes, PAN numbers, and Aadhaar sequences are automatically redacted using regex scrubbing algorithms.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-navy-900/60 border border-navy-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Private Storage Bucket</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Files are stored in a private Supabase Storage bucket inaccessible to the public. All file access URLs are temporary signed URLs expiring strictly within 60 seconds. Frontend clients never communicate directly with Supabase.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-navy-900/60 border border-navy-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">No Model Training on Evidence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your uploaded evidence is transmitted via Google GenAI APIs strictly for inference and analysis. Content is treated as raw data and never as instructions, preventing prompt injection and preventing your evidence from entering training sets.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-navy-900/60 border border-navy-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Immediate Data Erasure</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              You retain full ownership of your data. Deleting an evidence file or your account permanently deletes all files from object storage and removes all associated Postgres records via CASCADE deletion.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-amber-400 text-sm font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>Legal Disclaimer</span>
          </div>
          <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
            OmniMind AI is an AI-assisted investigative analysis tool designed to aid victims and cyber volunteers. Outputs do not constitute legal advice. For active ongoing financial fraud, victims must report within the golden hour to Helpline 1930 or cybercrime.gov.in.
          </p>
          <div className="pt-2">
            <Link to="/dashboard" className="text-xs text-teal-400 font-bold hover:underline">
              Return to Dashboard &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
