import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  ShieldAlert,
  UploadCloud,
  Cpu,
  FileCheck2,
  FileWarning,
  PhoneCall,
  Lock,
  Sparkles,
  ArrowRight,
  Layers,
  Share2,
  BookOpen,
  CheckCircle2,
  Search,
  MessageSquare,
  Bot,
  Trophy,
  Zap,
  Cog,
  Stethoscope,
  Accessibility,
  BrainCircuit,
  Compass,
  Languages,
  Mic,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const Landing = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const scamThreats = [
    { title: 'Digital Arrest Scams', desc: 'Fraudsters impersonating CBI / Police on video calls threatening custody unless bond money is transferred.' },
    { title: 'Fake KYC & APK Traps', desc: 'Phishing SMS urging SIM/Bank update via malware APKs that covertly intercept OTPs.' },
    { title: 'Telegram Part-Time Jobs', desc: 'Ponzi rating tasks that pay small initial incentives then extort lakhs in frozen deposits.' },
    { title: 'UPI QR Payment Reversals', desc: 'Fraudulent QR codes claiming "Scan to receive payment" that drain accounts when PIN is entered.' },
  ];

  const steps = [
    {
      num: '01',
      title: 'Forward or Upload',
      desc: 'Drop WhatsApp screenshots, audio voice notes (MP3/WAV), video calls, bank PDFs, or paste suspicious text & links.',
      icon: UploadCloud,
    },
    {
      num: '02',
      title: 'Multimodal Gemini AI Forensics',
      desc: 'Google Gemini extracts suspect UPI IDs, phone numbers, and bank accounts, uncovering repeated patterns across your files.',
      icon: Cpu,
    },
    {
      num: '03',
      title: 'Actionable Verdict & 1930 Draft',
      desc: 'Receive a 0-100 risk score, formatted complaint letter for Helpline 1930 / cybercrime.gov.in, and anonymized awareness posts.',
      icon: FileCheck2,
    },
  ];

  const features = [
    {
      icon: UploadCloud,
      title: 'Universal Multimodal Ingestion',
      desc: 'Process images, documents, audio clips, videos, and phishing URLs with magic-byte verification rejecting spoofed extensions.',
    },
    {
      icon: Cpu,
      title: 'Authentic Gemini AI Forensics',
      desc: 'Per-file structured JSON evaluation with strict Zod validation: risk score, confidence, red flags, and extracted entities.',
    },
    {
      icon: Layers,
      title: 'Cross-Modal Linkage',
      desc: 'Synthesizes repeated entities across separate files to reconstruct chronological timelines and calculate composite risk.',
    },
    {
      icon: FileCheck2,
      title: '1930 Police Complaint Generator',
      desc: 'Generates ready-to-file formal cybercrime complaint letters compliant with cybercrime.gov.in in English, Telugu, and Hindi.',
    },
    {
      icon: Share2,
      title: 'PII-Scrubbed Content Studio',
      desc: 'Turns real cases into awareness posts for Instagram, LinkedIn, X, and WhatsApp with personal data automatically redacted.',
    },
    {
      icon: BookOpen,
      title: 'Learn Mode with Voice Narration',
      desc: 'Interactive attack psychological breakdown with Web Speech audio explainer and 5-question comprehension quizzes.',
    },
  ];

  return (
    <div className="min-h-screen bg-navy-900 text-white selection:bg-teal-500 selection:text-navy-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>OmniMind AI &bull; One Input. Every Insight.</span>
            </div>

            {/* Tagline */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              One Input.{' '}
              <span className="bg-gradient-to-r from-teal-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
                Every Insight.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Upload deceptive messages, WhatsApp voice notes, forged documents, audio, or video. OmniMind AI synthesizes multimodal evidence to unmask fraudsters, answer cross-modal questions with citations, and protect you.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Link
                to="/omnimind"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 via-teal-400 to-cyan-400 text-navy-950 font-black text-sm shadow-xl shadow-teal-500/30 transition-all hover:scale-105"
              >
                <Compass className="w-4 h-4 text-navy-950" />
                <span>Launch OmniSense Studio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/chat"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-600/30 text-cyan-300 border border-cyan-500/40 font-black text-sm shadow-xl transition-all hover:scale-105"
              >
                <Languages className="w-4 h-4 text-cyan-300" />
                <span>VoxAI Language Suite</span>
              </Link>
              <Link
                to="/cases/deb3579d-db10-4382-b21c-b550ea6552ec"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 font-bold text-sm transition-all hover:scale-105"
              >
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>Featured Dossier (deb3579d)</span>
              </Link>
              <Link
                to="/cases"
                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 border border-navy-700 font-semibold text-sm transition-colors"
              >
                <span>Investigation Vault ({isAuthenticated ? 'Cases' : 'Browse'})</span>
              </Link>
            </div>

            <div className="pt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
              <Lock className="w-3.5 h-3.5 text-teal-400" />
              <span>In-Memory Forensic Security &bull; Private Storage &bull; Zero External Leaks</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step How-It-Works Section */}
      <section className="py-20 bg-navy-950 border-y border-navy-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              How OmniMind AI Works in 3 Steps
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              From suspicious message to verified forensic complaint in minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-navy-900/60 border border-navy-800 hover:border-teal-500/40 transition-all space-y-4 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-teal-400 font-mono">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-white">{step.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Indian Scam Vectors */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-2xl font-bold text-white">Targeted Indian Cybercrime Vectors</h2>
          <p className="text-xs text-slate-400">Forensically identified and cross-examined by OmniMind AI</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {scamThreats.map((threat, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-navy-900/40 border border-navy-800 hover:border-red-500/30 transition-all space-y-2"
            >
              <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
                <FileWarning className="w-4 h-4 shrink-0" />
                <span>{threat.title}</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">{threat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-navy-950/60 border-t border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <h2 className="text-3xl font-extrabold text-white">
              Forensic Capabilities
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              State-of-the-art tools for victims and cyber volunteers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-navy-900/60 border border-navy-800 hover:border-teal-500/40 transition-all hover:-translate-y-1 space-y-3 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:bg-teal-500 group-hover:text-navy-950 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">{f.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 🤖 How Does Multimodal AI Help? Section */}
      <section className="py-20 bg-navy-950 border-t border-navy-800 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 blur-[140px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold tracking-wide">
              <Bot className="w-3.5 h-3.5 text-teal-400" />
              <span>Multimodal AI & Visual Learning</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              🤖 How Does{' '}
              <span className="bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                Multimodal AI
              </span>{' '}
              Help?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
              <strong>Multimodal AI is an AI system that can understand and combine different types of information, such as text, images, audio, and video.</strong>
            </p>
            <p className="text-xs sm:text-sm text-teal-300/90 bg-navy-900/80 p-3.5 rounded-xl border border-teal-500/20 max-w-2xl mx-auto">
              💡 For your hackathon idea, it can help students understand difficult medical and engineering concepts through visual explanations, voice, and interactive learning.
            </p>
          </div>

          {/* 1. How Multimodal AI Works: Car Engine Example */}
          <div className="space-y-6">
            <div className="border-b border-navy-800 pb-3">
              <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>1. How Multimodal AI Works</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Imagine a student wants to understand how a car engine works. The student can interact in multiple complementary modalities:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-navy-900/60 border border-navy-800 space-y-1.5">
                <span className="text-xs font-bold text-amber-400">📝 Text</span>
                <p className="text-xs text-slate-300 font-medium">Understands questions such as "How does an engine work?"</p>
              </div>
              <div className="p-4 rounded-xl bg-navy-900/60 border border-navy-800 space-y-1.5">
                <span className="text-xs font-bold text-blue-400">🖼️ Image</span>
                <p className="text-xs text-slate-300 font-medium">Analyses an uploaded engine diagram or schematic.</p>
              </div>
              <div className="p-4 rounded-xl bg-navy-900/60 border border-navy-800 space-y-1.5">
                <span className="text-xs font-bold text-teal-400">🎤 Voice</span>
                <p className="text-xs text-slate-300 font-medium">Understands a spoken question naturally in real time.</p>
              </div>
              <div className="p-4 rounded-xl bg-navy-900/60 border border-navy-800 space-y-1.5">
                <span className="text-xs font-bold text-purple-400">🎥 Video</span>
                <p className="text-xs text-slate-300 font-medium">Analyses supported video content to explain physical processes.</p>
              </div>
              <div className="p-4 rounded-xl bg-navy-900/60 border border-navy-800 space-y-1.5">
                <span className="text-xs font-bold text-emerald-400">🗣️ Audio output</span>
                <p className="text-xs text-slate-300 font-medium">Explains the concept through spoken narration.</p>
              </div>
              <div className="p-4 rounded-xl bg-navy-900/60 border border-navy-800 space-y-1.5">
                <span className="text-xs font-bold text-rose-400">🎬 Animation</span>
                <p className="text-xs text-slate-300 font-medium">Uses a visualisation system to demonstrate the process dynamically.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
              <strong>Important:</strong> Multimodal AI doesn't automatically generate accurate animations by itself. Your application pairs with an animation engine or suitable visual-generation tool to render them.
            </div>
          </div>

          {/* 2. 5 Practical Applications */}
          <div className="space-y-6">
            <div className="border-b border-navy-800 pb-3">
              <h3 className="text-xl sm:text-2xl font-black text-white">
                2. How It Helps Solve Real-World Problems
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Five practical applications across science and engineering education:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* 1. Engineering Education */}
              <div className="p-5 rounded-2xl bg-navy-900/70 border border-teal-500/30 space-y-3">
                <div className="flex items-center gap-2 text-teal-400 font-bold text-sm">
                  <Cog className="w-5 h-5" />
                  <span>1. Engineering Education ⚙️</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Students enter a topic, such as how an electric motor works.</li>
                  <li>AI explains the concept and helps produce a visual demonstration.</li>
                  <li>Students can ask questions about individual components.</li>
                </ul>
              </div>

              {/* 2. Medical Education */}
              <div className="p-5 rounded-2xl bg-navy-900/70 border border-rose-500/30 space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <Stethoscope className="w-5 h-5" />
                  <span>2. Medical Education 🩺</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Students upload an educational diagram of the human heart.</li>
                  <li>AI explains its chambers and blood circulation.</li>
                  <li>An animation illustrates how blood moves through the heart.</li>
                </ul>
                <p className="text-[11px] text-rose-400/80 italic pt-1">
                  *This is for educational use, not medical diagnosis.*
                </p>
              </div>

              {/* 3. Learning from Images */}
              <div className="p-5 rounded-2xl bg-navy-900/70 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <BookOpen className="w-5 h-5" />
                  <span>3. Learning from Images 📚</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Students upload a textbook diagram or handwritten question.</li>
                  <li>AI interprets the available information.</li>
                  <li>It explains the concept in simpler language.</li>
                </ul>
              </div>

              {/* 4. Accessibility */}
              <div className="p-5 rounded-2xl bg-navy-900/70 border border-indigo-500/30 space-y-3">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                  <Accessibility className="w-5 h-5" />
                  <span>4. Accessibility ♿</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Students can ask questions using their voice.</li>
                  <li>The system provides spoken explanations and captions.</li>
                  <li>Visual explanations make complex topics easier to explore.</li>
                </ul>
              </div>

              {/* 5. Interactive Learning */}
              <div className="p-5 rounded-2xl bg-navy-900/70 border border-emerald-500/30 space-y-3 md:col-span-2 lg:col-span-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <BrainCircuit className="w-5 h-5" />
                  <span>5. Interactive Learning 🧠</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  <li>Students watch an explanation.</li>
                  <li>They ask follow-up questions directly.</li>
                  <li>AI generates practice questions based on the topic.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 3. Workflow & Difference Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 3. Workflow */}
            <div className="p-6 rounded-3xl bg-navy-900/80 border border-navy-800 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-teal-400" />
                <span>3. How Your Hackathon Project Could Work</span>
              </h3>
              <p className="text-xs text-slate-400">
                Example: <em>"Explain how electricity is generated in a power plant."</em>
              </p>
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-navy-950 border border-navy-800">
                  <span className="font-bold text-teal-400">Step 1:</span>
                  <span>Student enters a topic or uploads an image.</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-navy-950 border border-navy-800">
                  <span className="font-bold text-teal-400">Step 2:</span>
                  <span>Multimodal AI interprets the question & visual info.</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-navy-950 border border-navy-800">
                  <span className="font-bold text-teal-400">Step 3:</span>
                  <span>AI creates a structured explanation & isolates key steps.</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-navy-950 border border-navy-800">
                  <span className="font-bold text-teal-400">Step 4:</span>
                  <span>Animation engine generates a visual demonstration.</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-navy-950 border border-navy-800">
                  <span className="font-bold text-teal-400">Step 5:</span>
                  <span>Text-to-speech explains the animation.</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-navy-950 border border-navy-800">
                  <span className="font-bold text-teal-400">Step 6:</span>
                  <span>Student asks questions and completes a short quiz.</span>
                </div>
              </div>
            </div>

            {/* 4. What Makes Your Idea Different */}
            <div className="p-6 rounded-3xl bg-navy-900/80 border border-navy-800 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-400" />
                <span>4. What Makes Your Idea Different?</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[11px] uppercase text-slate-400 border-b border-navy-800">
                    <tr>
                      <th className="pb-2 text-slate-500">Traditional learning</th>
                      <th className="pb-2 text-teal-400">Your Multimodal AI app</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-800 text-slate-300">
                    <tr>
                      <td className="py-2.5 text-slate-400">Reads textbook explanations</td>
                      <td className="py-2.5 font-semibold text-white">Reads and explains concepts</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-slate-400">Studies static diagrams</td>
                      <td className="py-2.5 font-semibold text-white">Provides animated demonstrations</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-slate-400">Watches fixed videos</td>
                      <td className="py-2.5 font-semibold text-white">Supports questions about explanation</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-slate-400">Learns primarily through text</td>
                      <td className="py-2.5 font-semibold text-white">Combines text, images, voice & animation</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 5. 🏆 My Final Suggestion */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-navy-900 via-navy-900 to-navy-950 border border-amber-500/30 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-white">
                🏆 My Final Suggestion: Build VisualMind AI
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Start with <strong>engineering topics</strong> (electric motors, car engines, electrical circuits). Once the core system works reliably, expand into <strong>medical education</strong>.
            </p>
            <div className="p-3.5 rounded-xl bg-navy-950 border border-teal-500/20 text-xs text-teal-300">
              <strong>Your main innovation:</strong> Turn a student's question into an understandable explanation with a meaningful visual demonstration.
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-400 italic">
                "The strongest hackathon prototype solves a clear problem and demonstrates the solution convincingly."
              </span>
              <Link
                to="/multimodal-ai"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold text-xs shadow-md shadow-teal-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Explore Full Architecture & Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-navy-900 to-navy-950 border-t border-navy-800">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mx-auto text-teal-400">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Protect Yourself and Your Family Today
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
            Never second-guess suspicious calls, urgent SMS KYC notices, or part-time job offers. Analyze evidence and report immediately.
          </p>
          <div className="flex justify-center">
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-extrabold text-sm shadow-xl shadow-teal-500/20 transition-all hover:scale-105"
            >
              Start Free Analysis
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
