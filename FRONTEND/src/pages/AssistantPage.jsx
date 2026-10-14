import React, { useState } from 'react';
import { MultimodalChatbot } from '../components/MultimodalChatbot';
import { Sparkles, Mic, Eye, Volume2, ShieldCheck, Zap, ArrowRight, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AssistantPage = () => {
  return (
    <div className="min-h-screen bg-navy-950 text-white flex flex-col">
      {/* Hero Header */}
      <div className="border-b border-navy-800 bg-navy-900/50 py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Interactive Customer Service Assistant</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Multimodal AI Voice & Vision Assistant
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Equipped with real-time speech recognition (STT), text-to-speech audio narration (TTS), document & visual image analysis, and customer service resolution workflows.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/omnimind"
              className="px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-300 border border-navy-700 text-xs font-semibold transition-colors"
            >
              OmniSense Studio
            </Link>
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold text-xs transition-colors shadow-lg shadow-teal-500/20"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Main Full-Screen Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Feature Highlights & Customer Service Stats */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl bg-navy-900/60 border border-navy-800 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-teal-400" />
              <span>Key Capabilities</span>
            </h2>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-navy-950/60 border border-navy-800/80">
                <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Real-Time Voice Input</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Browser microphone integration with live animated audio waveforms and real-time speech-to-text.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-navy-950/60 border border-navy-800/80">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Vision & PDF Inspection</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Drag-and-drop product images, receipts, and manuals for visual diagnosis and zoomable previews.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-navy-950/60 border border-navy-800/80">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Text-to-Speech (TTS)</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Instant voice narration on every AI response with synchronized playback controls.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-navy-950/60 border border-navy-800/80">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Support Automation</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Pre-configured quick action chips for order lookups, warranty checks, and photo triage.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-300">
            <p className="font-semibold mb-1">💡 Interactive Floating FAB</p>
            <p className="text-[11px] text-slate-400">
              Notice the floating chat button at the bottom-right corner of your screen! It allows your users to access support from any page on your website.
            </p>
          </div>
        </div>

        {/* Right Column: Full-Screen Chatbot Component Instance */}
        <div className="lg:col-span-8 h-[700px] relative rounded-3xl overflow-hidden shadow-2xl border border-navy-800">
          <MultimodalChatbot forceFullScreen={true} defaultOpen={true} />
        </div>
      </div>
    </div>
  );
};
