import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bot,
  Sparkles,
  FileText,
  Image as ImageIcon,
  Mic,
  Video,
  Volume2,
  Film,
  Cog,
  Stethoscope,
  BookOpen,
  Accessibility,
  BrainCircuit,
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  XCircle,
  Trophy,
  Zap,
  Play,
  RotateCcw,
  Layers,
  Lightbulb,
  HelpCircle,
  GraduationCap,
  Shield,
  Eye,
} from 'lucide-react';

export const MultimodalAI = () => {
  const [activeTab, setActiveTab] = useState('engineering');
  const [demoStep, setDemoStep] = useState(1);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);

  const inputTypes = [
    {
      icon: FileText,
      color: 'from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/30',
      badge: '📝 Text',
      title: 'Natural Language Questions',
      desc: 'Understands complex queries such as "How does an engine work?" or "Explain turbine rotation."',
    },
    {
      icon: ImageIcon,
      color: 'from-blue-500/20 to-blue-500/5 text-blue-400 border-blue-500/30',
      badge: '🖼️ Image',
      title: 'Diagram & Blueprint Vision',
      desc: 'Analyses uploaded engine schematics, medical anatomical drawings, and circuit boards.',
    },
    {
      icon: Mic,
      color: 'from-teal-500/20 to-teal-500/5 text-teal-400 border-teal-500/30',
      badge: '🎤 Voice',
      title: 'Spoken Questions & Accents',
      desc: 'Converts verbal questions in real-time into contextual semantic representations.',
    },
    {
      icon: Video,
      color: 'from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/30',
      badge: '🎥 Video',
      title: 'Motion & Process Forensics',
      desc: 'Analyses supported video content frame-by-frame to dissect moving mechanics and processes.',
    },
    {
      icon: Volume2,
      color: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/30',
      badge: '🗣️ Audio output',
      title: 'Spoken Audio Narration',
      desc: 'Narrates step-by-step explanations through natural neural speech synthesis.',
    },
    {
      icon: Film,
      color: 'from-rose-500/20 to-rose-500/5 text-rose-400 border-rose-500/30',
      badge: '🎬 Animation',
      title: 'Interactive Visualisation',
      desc: 'Connects to an animation/diagram engine (Mermaid / SVG / Canvas) to demonstrate the process.',
    },
  ];

  const problemSolutions = [
    {
      id: 'engineering',
      name: 'Engineering Education',
      icon: Cog,
      emoji: '⚙️',
      color: 'border-teal-500/40 text-teal-400 bg-teal-500/10',
      badge: 'Mechanical & Electrical',
      summary: 'Helps students visualize intricate mechanisms like electric motors and engines.',
      points: [
        'Students enter a topic, such as how an electric motor or heat engine works.',
        'AI explains electromagnetic induction or combustion cycles and coordinates a visual demonstration.',
        'Students can click or ask questions about individual components (rotor, stator, commutator, valves).',
      ],
      interactiveExample: 'User enters: "How does a 4-stroke internal combustion engine work?" → Generates Intake, Compression, Combustion, Exhaust visual cycle with labeled spark plug and pistons.',
    },
    {
      id: 'medical',
      name: 'Medical Education',
      icon: Stethoscope,
      emoji: '🩺',
      color: 'border-rose-500/40 text-rose-400 bg-rose-500/10',
      badge: 'Human Anatomy & Physiology',
      summary: 'Demystifies biological systems and anatomical fluid dynamics with zero medical jargon.',
      points: [
        'Students upload an educational diagram of the human heart, nephron, or synapse.',
        'AI breaks down chambers (atria, ventricles), valves, and oxygenation pathways.',
        'An interactive flow illustrates how deoxygenated and oxygenated blood cycle through the body.',
      ],
      disclaimer: 'Note: Strictly for educational understanding and university study, not for clinical medical diagnosis.',
      interactiveExample: 'Student uploads heart diagram → AI identifies mitral valve regurgitation risk and simulates coronary flow pathways.',
    },
    {
      id: 'images',
      name: 'Learning from Images',
      icon: BookOpen,
      emoji: '📚',
      color: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
      badge: 'Diagram & Handwriting OCR',
      summary: 'Turns static textbook figures into responsive, simplified knowledge modules.',
      points: [
        'Students take a photo of a dense textbook illustration or handwritten lecture notes.',
        'Multimodal AI parses text, legends, arrow notations, and spatial relationships.',
        'Translates convoluted academic jargon into crystal-clear, plain-language insights.',
      ],
      interactiveExample: 'Uploading a complex Krebs Cycle diagram → AI highlights ATP generation steps and explains each biochemical transition simply.',
    },
    {
      id: 'accessibility',
      name: 'Accessibility',
      icon: Accessibility,
      emoji: '♿',
      color: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10',
      badge: 'Universal Inclusivity',
      summary: 'Removes barriers for auditory, visual, or physical learning differences.',
      points: [
        'Students can interact purely using their voice, without needing a keyboard.',
        'The system provides synchronized voice narration, auto-captions, and high-contrast visuals.',
        'Dynamic visual flowcharts make abstract and complex topics intuitive for neurodivergent learners.',
      ],
      interactiveExample: 'Voice command: "Read this diagram aloud in simple terms" → Instant auditory narration and synchronized text highlighting.',
    },
    {
      id: 'interactive',
      name: 'Interactive Learning',
      icon: BrainCircuit,
      emoji: '🧠',
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
      badge: 'Active Recall & Retention',
      summary: 'Transforms passive reading into active, conversational mastery with adaptive quizzes.',
      points: [
        'Students watch and inspect the visual step-by-step breakdown.',
        'They ask contextual follow-up questions right inside the explainer chat.',
        'AI generates real-time comprehension practice questions based on their weak points.',
      ],
      interactiveExample: 'After studying transformers: AI generates 5 targeted questions on primary-to-secondary coil turn ratios and core eddy currents.',
    },
  ];

  const workflowSteps = [
    {
      step: 1,
      title: 'Input Question or File',
      desc: 'Student enters a topic or uploads a textbook diagram/image.',
      icon: FileText,
      color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    },
    {
      step: 2,
      title: 'Multimodal AI Interpretation',
      desc: 'AI interprets the prompt and visual features simultaneously.',
      icon: Bot,
      color: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    },
    {
      step: 3,
      title: 'Structured Step Formulation',
      desc: 'AI isolates key phases and orders the physical/logical components.',
      icon: Layers,
      color: 'text-teal-400 border-teal-500/30 bg-teal-500/10',
    },
    {
      step: 4,
      title: 'Visual Animation Generation',
      desc: 'Engine converts structured steps into dynamic diagrams/animations.',
      icon: Film,
      color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    },
    {
      step: 5,
      title: 'Voice Narration Sync',
      desc: 'Neural Text-to-Speech explains each stage out loud in real time.',
      icon: Volume2,
      color: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
    },
    {
      step: 6,
      title: 'Q&A & Practice Quiz',
      desc: 'Student explores questions and completes a targeted 5-question test.',
      icon: GraduationCap,
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    },
  ];

  const comparisonRows = [
    {
      feature: 'Concept Explanation',
      traditional: 'Reads dense static textbook paragraphs',
      multimodal: 'Reads, explains, and breaks concepts down conversationally',
    },
    {
      feature: 'Visual Representation',
      traditional: 'Studies static 2D figures on paper',
      multimodal: 'Provides animated demonstrations & interactive flowcharts',
    },
    {
      feature: 'Follow-Up Questions',
      traditional: 'Watches fixed pre-recorded videos without Q&A',
      multimodal: 'Answers follow-up questions dynamically in the lesson',
    },
    {
      feature: 'Sensory Modality',
      traditional: 'Learns primarily through isolated text',
      multimodal: 'Combines text, images, voice, audio, and visual diagrams',
    },
  ];

  const handleRunDemo = () => {
    setIsPlayingDemo(true);
    let s = 1;
    setDemoStep(1);
    const interval = setInterval(() => {
      s += 1;
      if (s > 6) {
        clearInterval(interval);
        setIsPlayingDemo(false);
      } else {
        setDemoStep(s);
      }
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-navy-950 text-white selection:bg-teal-500 selection:text-navy-950 pb-24">
      {/* Hero Header */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-navy-800">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-teal-500/15 via-blue-500/15 to-purple-500/15 blur-[140px] pointer-events-none rounded-full" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold tracking-wide">
              <Bot className="w-4 h-4 text-teal-400" />
              <span>Multimodal AI & Visual Learning Blueprint</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              🤖 How Does{' '}
              <span className="bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                Multimodal AI
              </span>{' '}
              Help?
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              <strong>Multimodal AI is an AI system that can understand and combine different types of information, such as text, images, audio, and video.</strong>
            </p>

            <div className="p-4 sm:p-5 rounded-2xl bg-navy-900/80 border border-teal-500/30 text-slate-300 text-sm max-w-2xl mx-auto shadow-xl shadow-teal-500/5">
              <p className="leading-relaxed">
                <span className="text-teal-400 font-bold">Hackathon Vision:</span> It can help students understand difficult medical and engineering concepts through visual explanations, voice narration, and interactive learning.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href="#how-it-works"
                className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold text-xs shadow-lg shadow-teal-500/20 transition-all hover:scale-105"
              >
                1. How It Works
              </a>
              <a
                href="#real-world"
                className="px-5 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 border border-navy-700 font-semibold text-xs transition-colors"
              >
                2. Real-World Problems
              </a>
              <a
                href="#workflow"
                className="px-5 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 border border-navy-700 font-semibold text-xs transition-colors"
              >
                3. Hackathon Workflow
              </a>
              <a
                href="#difference"
                className="px-5 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 border border-navy-700 font-semibold text-xs transition-colors"
              >
                4. What's Different
              </a>
              <a
                href="#suggestion"
                className="px-5 py-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 font-bold text-xs transition-colors"
              >
                🏆 VisualMind AI
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: How Multimodal AI Works */}
      <section id="how-it-works" className="py-16 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 mb-12">
          <div className="flex items-center gap-2 text-teal-400 font-mono text-xs font-bold uppercase tracking-wider">
            <span>Part 01</span>
            <span className="w-8 h-px bg-teal-500/40" />
            <span>Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            1. How Multimodal AI Works
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            Imagine a student wants to understand how a car engine works. The student can interact with your application in different complementary modalities:
          </p>
        </div>

        {/* Input Modalities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {inputTypes.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-navy-900/70 border border-navy-800 hover:border-teal-500/40 transition-all hover:-translate-y-1 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-navy-800 border border-navy-700/80">
                    {item.badge}
                  </span>
                  <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${item.color}`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Summary Table */}
        <div className="rounded-2xl border border-navy-800 bg-navy-900/60 overflow-hidden mb-8">
          <div className="p-4 bg-navy-900/90 border-b border-navy-800 flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-400" />
              <span>Input Modality vs. What AI Does</span>
            </h4>
            <span className="text-[11px] text-slate-400 font-mono">Multimodal Input Mapping</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-navy-950/80 text-slate-300 uppercase tracking-wider font-semibold border-b border-navy-800/80">
                <tr>
                  <th className="py-3 px-5 w-1/4">Input</th>
                  <th className="py-3 px-5">What AI Does</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/50 text-slate-300">
                <tr>
                  <td className="py-3 px-5 font-semibold text-white flex items-center gap-2">
                    <span>📝 Text</span>
                  </td>
                  <td className="py-3 px-5">Understands a question such as "How does an engine work?"</td>
                </tr>
                <tr>
                  <td className="py-3 px-5 font-semibold text-white flex items-center gap-2">
                    <span>🖼️ Image</span>
                  </td>
                  <td className="py-3 px-5">Analyses an uploaded engine diagram or blueprint.</td>
                </tr>
                <tr>
                  <td className="py-3 px-5 font-semibold text-white flex items-center gap-2">
                    <span>🎤 Voice</span>
                  </td>
                  <td className="py-3 px-5">Understands a spoken question with natural accent tolerancing.</td>
                </tr>
                <tr>
                  <td className="py-3 px-5 font-semibold text-white flex items-center gap-2">
                    <span>🎥 Video</span>
                  </td>
                  <td className="py-3 px-5">Analyses supported video content to explain a chronological process.</td>
                </tr>
                <tr>
                  <td className="py-3 px-5 font-semibold text-white flex items-center gap-2">
                    <span>🗣️ Audio output</span>
                  </td>
                  <td className="py-3 px-5">Explains the concept through spoken narration (Text-to-Speech).</td>
                </tr>
                <tr>
                  <td className="py-3 px-5 font-semibold text-white flex items-center gap-2">
                    <span>🎬 Animation</span>
                  </td>
                  <td className="py-3 px-5">Uses a visualisation system to demonstrate the process interactively.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Important Callout */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300">Important Insight for Hackathons: </span>
            <span>
              Multimodal AI doesn't automatically generate accurate animations by itself. Your application pairs the AI's step-by-step logic with an animation engine or suitable visual-generation tool (such as Mermaid diagrams, SVG renderers, or Canvas simulations) to bring the steps to life.
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 2: Real-World Problems */}
      <section id="real-world" className="py-16 sm:py-20 bg-navy-900/40 border-y border-navy-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 mb-12">
            <div className="flex items-center gap-2 text-teal-400 font-mono text-xs font-bold uppercase tracking-wider">
              <span>Part 02</span>
              <span className="w-8 h-px bg-teal-500/40" />
              <span>Real-World Impact</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              2. How It Helps Solve Real-World Problems
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              Explore five high-impact, practical educational domains transformed by multimodal understanding:
            </p>
          </div>

          {/* Interactive Domain Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {problemSolutions.map((sol) => (
              <button
                key={sol.id}
                onClick={() => setActiveTab(sol.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === sol.id
                    ? 'bg-teal-500 text-navy-950 shadow-lg shadow-teal-500/20'
                    : 'bg-navy-900 text-slate-300 border border-navy-800 hover:border-slate-700'
                }`}
              >
                <span>{sol.emoji}</span>
                <span>{sol.name}</span>
              </button>
            ))}
          </div>

          {/* Active Problem Detailed Card */}
          {(() => {
            const current = problemSolutions.find((p) => p.id === activeTab) || problemSolutions[0];
            const Icon = current.icon;
            return (
              <div className="p-6 sm:p-8 rounded-3xl bg-navy-900/90 border border-navy-800 shadow-2xl relative overflow-hidden space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800/80 pb-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-xl ${current.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-black text-white">{current.name}</h3>
                        <span className="text-lg">{current.emoji}</span>
                      </div>
                      <span className="text-xs text-teal-400 font-semibold">{current.badge}</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 bg-navy-950 px-3 py-1.5 rounded-xl border border-navy-800 font-mono">
                    Practical Application
                  </span>
                </div>

                <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                  {current.summary}
                </p>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    How it works in practice:
                  </h4>
                  <ul className="space-y-2.5">
                    {current.points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {current.disclaimer && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs italic">
                    ⚠️ {current.disclaimer}
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-navy-950 border border-navy-800/80 text-xs space-y-1">
                  <span className="font-bold text-teal-300">Example Scenario:</span>
                  <p className="text-slate-300">{current.interactiveExample}</p>
                </div>
              </div>
            );
          })()}

          {/* Quick grid of all 5 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-8">
            {problemSolutions.map((p, idx) => (
              <div
                key={idx}
                onClick={() => setActiveTab(p.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  activeTab === p.id
                    ? 'border-teal-500 bg-teal-500/10'
                    : 'border-navy-800 bg-navy-900/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-base">{p.emoji}</span>
                  <span className="text-[10px] font-mono text-slate-500">0{idx + 1}</span>
                </div>
                <h5 className="text-xs font-bold text-white line-clamp-1">{p.name}</h5>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{p.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: Project Workflow & Simulation */}
      <section id="workflow" className="py-16 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 mb-12">
          <div className="flex items-center gap-2 text-teal-400 font-mono text-xs font-bold uppercase tracking-wider">
            <span>Part 03</span>
            <span className="w-8 h-px bg-teal-500/40" />
            <span>Hackathon Implementation</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            3. How Your Hackathon Project Could Work
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            A battle-tested 6-step pipeline connecting user questions to interactive visual mastery:
          </p>
        </div>

        {/* 6-Step Stepper Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {workflowSteps.map((ws) => {
            const Icon = ws.icon;
            const isCurrent = demoStep === ws.step;
            return (
              <div
                key={ws.step}
                className={`p-5 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'border-teal-400 bg-teal-500/10 shadow-xl shadow-teal-500/10 scale-[1.02]'
                    : 'border-navy-800 bg-navy-900/60'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`w-8 h-8 rounded-xl font-mono text-xs font-black flex items-center justify-center border ${ws.color}`}>
                    0{ws.step}
                  </span>
                  <Icon className={`w-4 h-4 ${isCurrent ? 'text-teal-300 animate-pulse' : 'text-slate-500'}`} />
                </div>
                <h4 className="text-sm font-bold text-white mb-1.5">{ws.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{ws.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Live Example Simulation Box */}
        <div className="rounded-3xl border border-teal-500/40 bg-gradient-to-b from-navy-900 to-navy-950 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-navy-800 pb-5 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 text-[11px] font-bold border border-teal-500/30 mb-2">
                <Zap className="w-3.5 h-3.5 text-teal-400" />
                <span>Working Example Demonstration</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Input: "Explain how electricity is generated in a power plant."
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRunDemo}
                disabled={isPlayingDemo}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-navy-950 font-bold text-xs shadow-md shadow-teal-500/20 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isPlayingDemo ? `Simulating Step ${demoStep}/6...` : 'Run Pipeline Simulation'}</span>
              </button>
              <button
                onClick={() => setDemoStep(1)}
                className="p-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-300 border border-navy-700 text-xs"
                title="Reset simulation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-navy-950/80 border border-navy-800 space-y-2">
                <span className="text-[11px] font-mono uppercase text-teal-400 font-bold">1. Simple Concept Explanation</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Fuel or thermal energy heats water into high-pressure steam. The steam spins a massive turbine connected to a rotor inside a copper wire stator, generating electrical voltage via Faraday's electromagnetic induction.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-navy-950/80 border border-navy-800 space-y-2">
                <span className="text-[11px] font-mono uppercase text-purple-400 font-bold">2. Component Labels</span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg bg-navy-900 border border-navy-800 text-[11px] text-slate-300">🔥 Boiler / Reactor</span>
                  <span className="px-2.5 py-1 rounded-lg bg-navy-900 border border-navy-800 text-[11px] text-slate-300">💨 High-Pressure Steam</span>
                  <span className="px-2.5 py-1 rounded-lg bg-navy-900 border border-navy-800 text-[11px] text-slate-300">🌀 Turbine Shaft</span>
                  <span className="px-2.5 py-1 rounded-lg bg-navy-900 border border-navy-800 text-[11px] text-slate-300">🧲 Electromagnetic Generator</span>
                  <span className="px-2.5 py-1 rounded-lg bg-navy-900 border border-navy-800 text-[11px] text-slate-300">⚡ Step-Up Transformer</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-navy-950/80 border border-navy-800 space-y-2">
                <span className="text-[11px] font-mono uppercase text-rose-400 font-bold flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>3. Voice Narration Output</span>
                </span>
                <p className="text-xs text-slate-300 italic bg-navy-900/60 p-3 rounded-xl border border-navy-800">
                  "Notice how thermal expansion forces the turbine blades to rotate at 3,000 RPM, cutting magnetic flux lines inside the generator..."
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-navy-950/80 border border-navy-800 space-y-2">
                <span className="text-[11px] font-mono uppercase text-emerald-400 font-bold">4. Adaptive Comprehension Quiz</span>
                <div className="p-3 rounded-xl bg-navy-900/60 border border-navy-800 text-xs space-y-1.5">
                  <p className="font-semibold text-white">Q: What physical law allows the generator to produce current?</p>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Faraday's Law of Electromagnetic Induction</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: What Makes Your Idea Different? */}
      <section id="difference" className="py-16 sm:py-20 bg-navy-900/40 border-y border-navy-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4 mb-12">
            <div className="flex items-center gap-2 text-teal-400 font-mono text-xs font-bold uppercase tracking-wider">
              <span>Part 04</span>
              <span className="w-8 h-px bg-teal-500/40" />
              <span>Competitive Differentiation</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              4. What Makes Your Idea Different?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              Comparison between traditional learning methodologies and your multimodal interactive architecture:
            </p>
          </div>

          <div className="rounded-3xl border border-navy-800 bg-navy-900/70 overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 text-xs font-bold uppercase tracking-wider border-b border-navy-800">
              <div className="p-4 sm:p-5 bg-navy-950/90 text-slate-400 border-b md:border-b-0 md:border-r border-navy-800 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-slate-500" />
                <span>Traditional Learning</span>
              </div>
              <div className="p-4 sm:p-5 bg-teal-500/10 text-teal-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>Your Multimodal AI Application</span>
              </div>
            </div>

            <div className="divide-y divide-navy-800">
              {comparisonRows.map((row, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-2 text-xs sm:text-sm">
                  <div className="p-4 sm:p-5 bg-navy-950/40 text-slate-400 border-b md:border-b-0 md:border-r border-navy-800 flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 shrink-0" />
                    <div>
                      <span className="block font-semibold text-slate-300 mb-0.5">{row.traditional}</span>
                      <span className="text-[11px] text-slate-500">{row.feature} limitation</span>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5 bg-navy-900/40 text-slate-200 flex items-start gap-2.5 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="block font-bold text-white mb-0.5">{row.multimodal}</span>
                      <span className="text-[11px] text-teal-400/80 font-mono">Dynamic AI + Visual Synthesis</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: My Final Suggestion */}
      <section id="suggestion" className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-navy-900 via-navy-900 to-navy-950 border border-teal-500/30 shadow-2xl relative overflow-hidden space-y-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider">
                Hackathon Winning Formula
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                🏆 My Final Suggestion
              </h2>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-navy-950/80 border border-navy-800 space-y-4">
            <h3 className="text-xl sm:text-2xl font-black text-teal-300">
              Build VisualMind AI — An AI-Powered Visual Learning Assistant
            </h3>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Start with <strong>engineering topics</strong>, such as electric motors, car engines, and electrical circuits. Once the core system works reliably, expand into <strong>medical education</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl bg-navy-950/60 border border-teal-500/20 space-y-2">
              <div className="flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Your Main Innovation</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                Turn a student's question into an understandable explanation with a meaningful visual demonstration.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-navy-950/60 border border-amber-500/20 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Lightbulb className="w-4 h-4" />
                <span>Golden Hackathon Rule</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                Remember, the strongest hackathon prototype isn't the one with the most AI features. It's the one that solves a clear problem and demonstrates the solution convincingly.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-navy-800">
            <p className="text-xs text-slate-400">
              Explore the live Visual Explainer and Interactive Attack Flow Tutor in the app:
            </p>
            <div className="flex items-center gap-3">
              <Link
                to="/learn"
                className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-black text-xs shadow-lg shadow-teal-500/20 transition-all hover:scale-105 flex items-center gap-2"
              >
                <span>Try Visual Explainer & Quizzes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
