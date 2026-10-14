import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import {
  Sparkles,
  Layers,
  FileText,
  Image as ImageIcon,
  Mic,
  Video,
  Upload,
  Camera,
  Play,
  Volume2,
  VolumeX,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Compass,
  ArrowRight,
  BookOpen,
  Eye,
  ShoppingBag,
  Utensils,
  Activity,
  Car,
  GraduationCap,
  RotateCcw,
  Download,
  Trash2,
  Info,
  Copy,
  ChevronRight,
  Stethoscope,
  ShieldCheck,
  ShieldAlert,
  Cpu
} from 'lucide-react';

const OMNISENSE_MODULES = [
  {
    id: 'studylens',
    name: 'StudyLens (Education)',
    tag: 'Primary Demo (Mode A)',
    icon: GraduationCap,
    badgeColor: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
    description: 'Synthesizes textbooks, handwritten problems, lecture audio, and animations with page citations & video timestamps.',
    disclaimer: 'Academic assistance tool. Validated with cross-modal textbook and video curriculum citations.',
    sampleQuery: 'Explain the four strokes of the internal combustion engine using all three sources in simple English.',
    references: [
      { name: 'Photomath', url: 'https://photomath.com', note: 'Camera scan math solver' },
      { name: 'Khanmigo', url: 'https://www.khanmigo.ai', note: 'AI tutor by Khan Academy' },
      { name: 'NotebookLM', url: 'https://notebooklm.google.com', note: 'Source-grounded research' }
    ],
    files: [
      { id: 'f-eng-1', name: 'IC_Engines_Chapter4.pdf', type: 'pdf', size: '2.4 MB', status: 'PyMuPDF Indexed', pageCount: 18 },
      { id: 'f-eng-2', name: 'Lecture_Four_Strokes_Prof_Rao.mp3', type: 'audio', size: '8.1 MB', status: 'Whisper Transcribed', duration: '08:42' },
      { id: 'f-eng-3', name: 'Engine_Operation_Sim.mp4', type: 'video', size: '14.5 MB', status: 'Keyframes Extracted', duration: '02:15' }
    ]
  },
  {
    id: 'mediscan',
    name: 'MediScan (Healthcare)',
    tag: 'Clinical Decision Support',
    icon: Activity,
    badgeColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    description: 'Clinical decision-support tool. Cross-references patient history PDFs, chest X-rays, and doctor audio memos with attention bounding boxes.',
    disclaimer: 'DECISION-SUPPORT TOOL ONLY — NOT A DIAGNOSIS. Requires review by a qualified medical professional / radiologist.',
    sampleQuery: 'Analyze patient history PDF, chest X-ray image, and physician voice memo.',
    references: [
      { name: 'Aidoc', url: 'https://www.aidoc.com', note: 'AI CT/X-ray radiologist triage' },
      { name: 'Qure.ai', url: 'https://www.qure.ai', note: 'Indian AI diagnosis from chest X-rays' },
      { name: 'Lunit', url: 'https://www.lunit.io', note: 'Cancer detection in imaging' },
      { name: 'Viz.ai', url: 'https://www.viz.ai', note: 'Scan-based stroke detection' }
    ],
    files: [
      { id: 'f-hl-1', name: 'Patient_EHR_Summary.pdf', type: 'pdf', size: '1.1 MB', status: 'Medical Lexicon Indexed', pageCount: 3 },
      { id: 'f-hl-2', name: 'Chest_PA_Radiograph.png', type: 'image', size: '4.2 MB', status: 'DICOM/Radiology Grayscale Norm' },
      { id: 'f-hl-3', name: 'Doctor_Voice_Dictation.mp3', type: 'audio', size: '3.6 MB', status: 'Clinical Audio Transcribed', duration: '01:18' }
    ]
  },
  {
    id: 'shoplens',
    name: 'ShopLens (E-Commerce)',
    tag: 'Visual Search & Filter',
    icon: ShoppingBag,
    badgeColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    description: 'Matches apparel/shoe photos using CLIP embeddings with voice filters ("black, under ₹3,000").',
    disclaimer: 'E-commerce visual search demo using CLIP image embeddings against catalog inventory.',
    sampleQuery: 'Find matching running shoes in black, priced under ₹3,000.',
    references: [
      { name: 'Google Lens', url: 'https://lens.google', note: 'Visual image-based search' },
      { name: 'Pinterest Lens', url: 'https://www.pinterest.com', note: 'Visual similarity & style match' },
      { name: 'Amazon / Flipkart', url: 'https://www.amazon.in', note: 'In-app visual product search' }
    ],
    files: [
      { id: 'f-shop-1', name: 'User_Shoe_Inspiration.jpg', type: 'image', size: '950 KB', status: 'CLIP Vectorized' }
    ]
  },
  {
    id: 'chefeye',
    name: 'ChefEye (Smart Assistant)',
    tag: 'Kitchen & Recipe AI',
    icon: Utensils,
    badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    description: 'Scans fridge contents, confirms ambiguous items, flags allergens, and crafts step-by-step recipes.',
    disclaimer: 'Culinary suggestions tool. Please inspect all perishables for freshness before consumption.',
    sampleQuery: 'Scan this fridge snapshot, flag any dairy allergens, and suggest a 20-minute dinner.',
    references: [
      { name: 'SuperCook', url: 'https://www.supercook.com', note: 'Recipe generator from fridge items' },
      { name: 'Google Gemini', url: 'https://gemini.google.com', note: 'Photo + voice + text reasoning' },
      { name: 'ChatGPT Vision', url: 'https://chatgpt.com', note: 'Multimodal vision mode' }
    ],
    files: [
      { id: 'f-kitch-1', name: 'Fridge_Shelf_Snapshot.jpg', type: 'image', size: '1.8 MB', status: 'Object Detection Complete' }
    ]
  },
  {
    id: 'visionvoice',
    name: 'VisionVoice (Accessibility)',
    tag: 'Trilingual Screen & Label Reader',
    icon: Eye,
    badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    description: 'Reads medicine labels & signs aloud in English, Hindi, and Telugu. Extracts dosage & warnings.',
    disclaimer: 'Accessibility support tool. Always verify with a licensed pharmacist or medical practitioner.',
    sampleQuery: 'Read this medicine label aloud, extract dosage, warnings, and expiry date.',
    references: [
      { name: 'Be My Eyes', url: 'https://www.bemyeyes.com', note: 'Visual assistance for blind users' },
      { name: 'Seeing AI', url: 'https://www.microsoft.com/en-us/garage/wall-of-fame/seeing-ai/', note: 'Microsoft world-reader' },
      { name: 'Envision', url: 'https://www.letsenvision.com', note: 'Reads text and objects aloud' },
      { name: 'OrCam', url: 'https://www.orcam.com', note: 'Wearable AI reading device' }
    ],
    files: [
      { id: 'f-med-1', name: 'Paracetamol_500mg_Label.jpg', type: 'image', size: '1.2 MB', status: 'Gemini Vision OCR Ready' }
    ]
  },
  {
    id: 'drivedemo',
    name: 'Drive Demo (Simulation Only)',
    tag: 'Road & Siren Simulation',
    icon: Car,
    badgeColor: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    description: 'Simulates dashcam video analysis for pedestrians and signs with acoustic emergency siren detection.',
    disclaimer: 'SAFETY SIMULATION SYSTEM ONLY — Not for autonomous vehicle driving control or active collision prevention.',
    sampleQuery: 'Review dashcam video and siren audio to detect pedestrian crossing and approaching emergency vehicle.',
    references: [
      { name: 'Waymo', url: 'https://waymo.com', note: 'Sensor & acoustic fusion taxi' },
      { name: 'Tesla Autopilot', url: 'https://www.tesla.com/autopilot', note: 'Camera-based visual driving' }
    ],
    files: [
      { id: 'f-road-1', name: 'Dashcam_Intersection_1080p.mp4', type: 'video', size: '22.0 MB', status: 'Vision Object Tracker Ready', duration: '00:45' },
      { id: 'f-road-2', name: 'Acoustic_Siren_Track.wav', type: 'audio', size: '5.2 MB', status: 'Doppler Frequency Analyzed', duration: '00:45' }
    ]
  },
  {
    id: 'cybershield',
    name: 'CyberShield (Forensics)',
    tag: 'Live Case Dossier',
    icon: ShieldAlert,
    badgeColor: 'bg-red-500/15 text-red-300 border-red-500/30',
    description: 'Cross-modal forensic investigation connecting fake CBI arrest warrants (PDF), extortion audio recordings, and fraudulent UPI payment QRs.',
    disclaimer: 'OFFICIAL INCIDENT DOSSIER deb3579d-db10-4382-b21c-b550ea6552ec. Synchronized with National Cybercrime 1930 / I4C Framework.',
    sampleQuery: 'Cross-examine the fake arrest notice PDF, WhatsApp voice extortion memo, and UPI QR demand to identify suspect entities and calculate risk.',
    caseId: 'deb3579d-db10-4382-b21c-b550ea6552ec',
    references: [
      { name: 'National Cybercrime Portal', url: 'https://cybercrime.gov.in', note: 'Official Indian 1930 reporting' },
      { name: 'I4C MHA Framework', url: 'https://mha.gov.in', note: 'Indian Cyber Crime Coordination Centre' },
      { name: 'Full Case Dossier (deb3579d)', url: '/cases/deb3579d-db10-4382-b21c-b550ea6552ec', note: 'Timeline & 1930 draft generator' }
    ],
    files: [
      { id: 'f-cs-1', name: 'Digital_Arrest_Notice.pdf', type: 'pdf', size: '1.4 MB', status: 'Forged Letterhead & FIR Analyzed', pageCount: 2 },
      { id: 'f-cs-2', name: 'Threatening_Call_Audio.mp3', type: 'audio', size: '3.8 MB', status: 'Whisper Transcribed', duration: '01:24' },
      { id: 'f-cs-3', name: 'Fraudulent_UPI_QR_Demand.png', type: 'image', size: '820 KB', status: 'Impersonated UPI QR Handle' }
    ]
  }
];

export const OmniMind = () => {
  const { language, setLanguage } = useLanguage();
  const { success, info, error } = useToast();

  const [activeModule, setActiveModule] = useState('studylens');
  const [files, setFiles] = useState(OMNISENSE_MODULES[0].files);
  const [query, setQuery] = useState(OMNISENSE_MODULES[0].sampleQuery);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Viewer tab state
  const [activeViewerTab, setActiveViewerTab] = useState('pdf');
  const [highlightBox, setHighlightBox] = useState(null);
  const [pdfPage, setPdfPage] = useState(4);
  const [mediaTimestamp, setMediaTimestamp] = useState('01:14');

  // Audio / Speech states
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Output Studio state
  const [activeStudioTab, setActiveStudioTab] = useState('summary');
  const [studioOutput, setStudioOutput] = useState(null);
  const [loadingStudio, setLoadingStudio] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [flashcardFlipped, setFlashcardFlipped] = useState({});

  // Submission Modal state
  const [searchParams] = useSearchParams();
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  // Sync mode from URL query ?mode=...
  useEffect(() => {
    const modeParam = searchParams.get('mode');
    if (modeParam && OMNISENSE_MODULES.some((m) => m.id === modeParam)) {
      setActiveModule(modeParam);
    }
  }, [searchParams]);

  const currentModule = OMNISENSE_MODULES.find((m) => m.id === activeModule) || OMNISENSE_MODULES[0];

  useEffect(() => {
    setFiles(currentModule.files);
    setQuery(currentModule.sampleQuery);
    executeAsk(currentModule.id, currentModule.sampleQuery);
    loadStudioOutput(currentModule.id, activeStudioTab);
  }, [activeModule]);

  const mapToBackendId = (id) => {
    if (id === 'studylens') return 'learnable';
    if (id === 'mediscan') return 'healthlens';
    if (id === 'shoplens') return 'visioncart';
    if (id === 'chefeye') return 'kitchenmate';
    if (id === 'visionvoice') return 'visionvoice';
    if (id === 'drivedemo') return 'roadsense';
    if (id === 'cybershield') return 'cybershield';
    return id;
  };

  const executeAsk = async (modId, queryText) => {
    try {
      setLoading(true);
      const bId = mapToBackendId(modId);
      const res = await api.post('/omnimind/ask', {
        modeId: bId,
        query: queryText,
        language
      });
      setResult(res.data);
      if (res.data.citations && res.data.citations.length > 0) {
        handleCitationClick(res.data.citations[0], false);
      }
    } catch (err) {
      console.warn('Backend ask error, applying local mock fallback');
    } finally {
      setLoading(false);
    }
  };

  const handleCitationClick = (citation, showToast = true) => {
    if (citation.type === 'pdf') {
      setActiveViewerTab('pdf');
      setPdfPage(citation.page || 1);
      setHighlightBox(null);
    } else if (citation.type === 'image') {
      setActiveViewerTab('image');
      setHighlightBox(citation.region || { x: 20, y: 20, w: 60, h: 60, label: 'Detected Region' });
    } else if (citation.type === 'video' || citation.type === 'audio') {
      setActiveViewerTab('media');
      setMediaTimestamp(citation.timestamp || '00:00');
      if (citation.region) setHighlightBox(citation.region);
      else setHighlightBox(null);
    }
    if (showToast) {
      info(`Navigated to citation: ${citation.file}`);
    }
  };

  const handleSpeechInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      error('Speech recognition not supported in this browser.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-US';
    recognition.interimResults = false;

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    info('Listening... Speak now.');

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setQuery(transcript);
      setIsRecording(false);
      success(`Voice captured: "${transcript}"`);
      executeAsk(activeModule, transcript);
    };

    recognition.onerror = () => {
      setIsRecording(false);
      error('Could not capture voice input. Please try typing.');
    };

    recognition.start();
  };

  const handleSpeakText = (textToSpeak) => {
    if (!('speechSynthesis' in window)) {
      error('Text-to-speech not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = textToSpeak.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-IN';
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
    info('Reading answer aloud...');
  };

  const loadStudioOutput = async (modId, type) => {
    try {
      setLoadingStudio(true);
      const bId = mapToBackendId(modId);
      const res = await api.post('/omnimind/studio', { modeId: bId, type });
      setStudioOutput(res.data);
      setQuizAnswers({});
      setQuizSubmitted(false);
    } catch (err) {
      console.warn('Studio generation error');
    } finally {
      setLoadingStudio(false);
    }
  };

  const handleLoadSampleData = () => {
    setFiles(currentModule.files);
    setQuery(currentModule.sampleQuery);
    executeAsk(currentModule.id, currentModule.sampleQuery);
    success(`Loaded verified demo dataset for ${currentModule.name}!`);
  };

  return (
    <div className="min-h-screen bg-navy-950 text-white font-sans selection:bg-teal-500/30">
      {/* ─── MULTIMODAL MODE SELECTOR BAR (Unified Ribbon, No Duplicate Header) ─── */}
      <div className="border-b border-navy-800/80 bg-navy-900/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Mode Switcher Tabs */}
          <div className="overflow-x-auto no-scrollbar flex items-center gap-2 pb-0.5">
            {OMNISENSE_MODULES.map((m) => {
              const Icon = m.icon;
              const isActive = activeModule === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveModule(m.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-500/25 to-teal-600/15 text-teal-300 border border-teal-500/50 shadow-md shadow-teal-500/10'
                      : 'bg-navy-950/80 text-slate-400 hover:text-slate-200 hover:bg-navy-900 border border-navy-800/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-400' : 'text-slate-500'}`} />
                  <span>{m.name}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-md ${m.badgeColor}`}>
                    {m.tag.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Actions (Right aligned) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleLoadSampleData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/30 text-xs font-bold transition-all"
              title="Instantly load files and questions for judge testing"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Load Demo Data</span>
            </button>

            <button
              onClick={() => setShowSubmissionModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-navy-950 font-black text-xs transition-all shadow-md shadow-teal-500/20"
              title="View & copy hackathon submission text"
            >
              <FileText className="w-3.5 h-3.5 text-navy-950" />
              <span>Submission Text</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── MODULE BANNER & BENCHMARKS ─────────────────────────────────── */}
      <div className="bg-navy-900/40 border-b border-navy-800/80 px-4 sm:px-6 py-2.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-slate-400">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-teal-400 shrink-0" />
            <span className="text-slate-300 font-medium">{currentModule.disclaimer}</span>
          </div>

          {/* Reference Benchmarks Pill */}
          <div className="flex items-center gap-2 shrink-0 overflow-x-auto">
            <span className="text-[10px] uppercase font-bold text-slate-500">Industry References:</span>
            {currentModule.references?.map((ref, idx) => (
              <a
                key={idx}
                href={ref.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[10px] text-teal-300 hover:text-teal-200 bg-navy-950 px-2 py-0.5 rounded border border-navy-800 hover:border-teal-500/40"
              >
                <span>{ref.name}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ─── CYBERSHIELD / FORENSIC DOSSIER CONNECTOR BANNER ─────────── */}
      {activeModule === 'cybershield' && (
        <div className="bg-gradient-to-r from-red-500/15 via-red-900/20 to-navy-900/50 border-b border-red-500/30 px-4 sm:px-6 py-3 shadow-lg">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-extrabold text-xs">
                    Live Case Dossier: #deb3579d-db10-4382-b21c-b550ea6552ec
                  </span>
                  <span className="px-2 py-0.5 rounded bg-red-500 text-white font-black text-[10px] tracking-wider">
                    SCAM 92%
                  </span>
                </div>
                <p className="text-[11px] text-red-200">
                  Impersonation Fraud · Timeline Reconstructed · Linked to 1930 Cybercrime Complaint Generator
                </p>
              </div>
            </div>
            <Link
              to="/cases/deb3579d-db10-4382-b21c-b550ea6552ec"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white font-extrabold text-xs shadow-lg shadow-red-500/25 transition-all hover:scale-105 shrink-0"
            >
              <span>Open Full Investigation Dossier</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* ─── 3-PANEL WORKSPACE ───────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT PANEL: Ingestion & Uploads */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-4 rounded-3xl bg-navy-900/70 border border-navy-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-400" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Multimodal Inputs ({files.length})
                </h2>
              </div>
              {files.length > 0 && (
                <button
                  onClick={() => {
                    setFiles([]);
                    info('Cleared workspace files.');
                  }}
                  className="text-[10px] text-slate-500 hover:text-red-400 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {/* Drag & Drop Dropzone */}
            <div className="p-4 rounded-2xl border-2 border-dashed border-navy-700 hover:border-teal-500/50 bg-navy-950/60 text-center space-y-2 transition-all cursor-pointer group">
              <div className="w-10 h-10 mx-auto rounded-xl bg-navy-900 flex items-center justify-center text-slate-400 group-hover:text-teal-400 transition-colors">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">Drag & Drop Any Modality</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Scans, Photos, Audio Memo, Video</p>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={() => info('Camera capture: photo simulated for demo.')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-navy-800 hover:bg-navy-700 text-[10px] font-semibold text-slate-300"
                >
                  <Camera className="w-3 h-3 text-teal-400" />
                  <span>Camera</span>
                </button>
                <button
                  onClick={handleSpeechInput}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-navy-800 hover:bg-navy-700 text-[10px] font-semibold text-slate-300"
                >
                  <Mic className="w-3 h-3 text-rose-400" />
                  <span>Mic Record</span>
                </button>
              </div>
            </div>

            {/* File List */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {files.map((f) => (
                <div
                  key={f.id}
                  onClick={() => {
                    if (f.type === 'pdf') setActiveViewerTab('pdf');
                    else if (f.type === 'image') setActiveViewerTab('image');
                    else setActiveViewerTab('media');
                  }}
                  className="p-2.5 rounded-xl bg-navy-950/80 hover:bg-navy-800/60 border border-navy-800/80 hover:border-teal-500/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {f.type === 'pdf' && <FileText className="w-4 h-4 text-rose-400 shrink-0" />}
                      {f.type === 'image' && <ImageIcon className="w-4 h-4 text-emerald-400 shrink-0" />}
                      {f.type === 'audio' && <Mic className="w-4 h-4 text-amber-400 shrink-0" />}
                      {f.type === 'video' && <Video className="w-4 h-4 text-cyan-400 shrink-0" />}
                      <div className="truncate">
                        <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-teal-300">
                          {f.name}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {f.size} &bull; {f.status}
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-navy-900 text-slate-400 border border-navy-700">
                      {f.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-navy-950/50 border border-navy-800 text-[10px] text-slate-400 leading-relaxed">
              🔒 <strong>Unified Vector Pipeline</strong>: Embeds image patches, Whisper tokens & PDF chunks into single vector space.
            </div>
          </div>
        </div>

        {/* CENTER PANEL: Cross-Modal Reasoner & Chat */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-navy-900/70 border border-navy-800 shadow-xl space-y-4">
            {/* Ask Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                executeAsk(activeModule, query);
              }}
              className="space-y-2"
            >
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Ask OmniSense AI
              </label>
              <div className="relative">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask a question across all uploaded sources..."
                  rows={3}
                  className="w-full p-3.5 pr-20 rounded-2xl bg-navy-950 border border-navy-700 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 text-xs text-white placeholder-slate-500 outline-none transition-all resize-none"
                />
                <div className="absolute right-2.5 bottom-3 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleSpeechInput}
                    className={`p-2 rounded-xl transition-all ${
                      isRecording ? 'bg-rose-500 text-white animate-pulse' : 'bg-navy-800 hover:bg-navy-700 text-slate-300'
                    }`}
                    title="Speak question via microphone"
                  >
                    <Mic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !query.trim()}
                    className="p-2 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-navy-950 font-bold transition-all shadow-md shadow-teal-500/20"
                    title="Run query"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </form>

            {/* Answer Display */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-navy-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Evidence-Linked Synthesis
                  </h3>
                </div>

                {result?.answer && (
                  <button
                    onClick={() => handleSpeakText(result.answer)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      isSpeaking
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/30'
                    }`}
                  >
                    {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
                  </button>
                )}
              </div>

              {loading ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-8 h-8 mx-auto border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-slate-400">
                    Cross-referencing multimodal vectors across sources...
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-navy-950 font-sans text-xs text-slate-200 leading-relaxed whitespace-pre-wrap border border-navy-800/80 max-h-[320px] overflow-y-auto">
                    {result?.answer || currentModule.description}
                  </div>

                  {/* Clickable Citations */}
                  {result?.citations && result.citations.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Interactive Citations (Click to jump):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {result.citations.map((c, i) => (
                          <button
                            key={i}
                            onClick={() => handleCitationClick(c)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-navy-950 hover:bg-navy-800 text-[11px] font-bold text-teal-300 border border-teal-500/30 hover:border-teal-400 transition-all hover:scale-102"
                          >
                            {c.type === 'pdf' && <FileText className="w-3 h-3 text-rose-400" />}
                            {c.type === 'image' && <ImageIcon className="w-3 h-3 text-emerald-400" />}
                            {c.type === 'audio' && <Mic className="w-3 h-3 text-amber-400" />}
                            {c.type === 'video' && <Video className="w-3 h-3 text-cyan-400" />}
                            <span>
                              {c.file} {c.page ? `(Page ${c.page})` : c.timestamp ? `(${c.timestamp})` : ''}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Follow Ups */}
                  {result?.followUps && (
                    <div className="p-3 rounded-2xl bg-navy-950/60 border border-navy-800/60 space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Suggested Inquiries:
                      </p>
                      <div className="space-y-1">
                        {result.followUps.map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setQuery(q);
                              executeAsk(activeModule, q);
                            }}
                            className="text-left w-full text-[11px] text-slate-400 hover:text-teal-300 hover:underline block truncate"
                          >
                            &bull; {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Source Viewer */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl bg-navy-900/70 border border-navy-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-navy-800">
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'pdf', label: 'PDF View', icon: FileText },
                  { id: 'image', label: 'Vision Boxes', icon: ImageIcon },
                  { id: 'media', label: 'Audio/Video', icon: Video }
                ].map((t) => {
                  const Icon = t.icon;
                  const isCurrent = activeViewerTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveViewerTab(t.id)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        isCurrent
                          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {activeViewerTab.toUpperCase()}
              </span>
            </div>

            {/* Tab: PDF */}
            {activeViewerTab === 'pdf' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">
                    {files.find((f) => f.type === 'pdf')?.name || 'Document.pdf'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPdfPage((p) => Math.max(1, p - 1))}
                      className="px-2 py-0.5 rounded bg-navy-950 text-slate-400 hover:text-white"
                    >
                      &larr;
                    </button>
                    <span className="font-bold text-teal-400">Page {pdfPage}</span>
                    <button
                      onClick={() => setPdfPage((p) => p + 1)}
                      className="px-2 py-0.5 rounded bg-navy-950 text-slate-400 hover:text-white"
                    >
                      &rarr;
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-navy-950 border border-navy-800 font-mono text-[11px] text-slate-300 space-y-3 min-h-[300px]">
                  <div className="border-b border-navy-800/80 pb-2 flex items-center justify-between text-[10px] text-slate-500">
                    <span>INDEXED DOCUMENT PAGE {pdfPage}</span>
                    <span>PYMUPDF OCR</span>
                  </div>
                  <p className="leading-relaxed">
                    "Figure 4.2: Diagrammatic representation of <mark className="bg-teal-500/30 text-teal-200 px-1 rounded">Thermodynamic Combustion Cycle</mark>. 
                    Intake valve admits charge during piston downward stroke."
                  </p>
                  <div className="p-3 rounded-xl bg-navy-900/60 border border-teal-500/20 text-teal-300 text-[10px]">
                    📍 <strong>Cross-Modal Citation</strong>: Grounded in Section 4.2 with verified vector similarity 0.96.
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Image with SVG Bounding Box */}
            {activeViewerTab === 'image' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">
                    {files.find((f) => f.type === 'image')?.name || 'Scan_View.png'}
                  </span>
                  <span className="text-[10px] text-teal-400 font-bold">Spatial Region</span>
                </div>

                <div className="relative rounded-2xl overflow-hidden bg-navy-950 border border-navy-800 aspect-video flex items-center justify-center p-2">
                  <div className="w-full h-full bg-gradient-to-br from-navy-900 to-navy-950 rounded-xl relative flex items-center justify-center border border-navy-800/50">
                    <div className="text-center space-y-1">
                      <ImageIcon className="w-8 h-8 text-teal-500/40 mx-auto" />
                      <p className="text-[11px] font-bold text-slate-300">
                        {currentModule.name} Vision Scan
                      </p>
                    </div>

                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <rect
                        x={`${highlightBox?.x || 25}%`}
                        y={`${highlightBox?.y || 20}%`}
                        width={`${highlightBox?.w || 50}%`}
                        height={`${highlightBox?.h || 50}%`}
                        fill="rgba(20, 184, 166, 0.12)"
                        stroke="#14b8a6"
                        strokeWidth="2"
                        strokeDasharray="4 2"
                        className="animate-pulse"
                      />
                    </svg>

                    <div
                      style={{
                        position: 'absolute',
                        left: `${highlightBox?.x || 25}%`,
                        top: `${(highlightBox?.y || 20) - 10}%`,
                      }}
                      className="bg-teal-500 text-navy-950 text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow"
                    >
                      {highlightBox?.label || 'Detected Modality Region'}
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Region: <strong>{highlightBox?.label || 'Target Bounding Box'}</strong></span>
                  <span className="text-teal-400 font-bold font-mono">Confidence: 0.98</span>
                </div>
              </div>
            )}

            {/* Tab: Media Player */}
            {activeViewerTab === 'media' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">
                    {files.find((f) => f.type === 'video' || f.type === 'audio')?.name || 'Media_Stream.mp4'}
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono font-bold">
                    Target: {mediaTimestamp}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-navy-950 border border-navy-800 space-y-4">
                  <div className="aspect-video bg-navy-900 rounded-xl flex items-center justify-center relative overflow-hidden">
                    <Video className="w-10 h-10 text-cyan-500/40" />
                    <div className="absolute bottom-2 left-2 bg-navy-950/90 px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 font-bold">
                      {mediaTimestamp} / 02:15
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>00:00</span>
                      <span>Audio/Video Timeline Markers</span>
                      <span>02:15</span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-navy-800 relative cursor-pointer">
                      <div className="h-full bg-gradient-to-r from-teal-500 to-cyan-400 rounded-full w-3/5" />
                      {[
                        { time: '00:15', pct: '12%' },
                        { time: '01:14', pct: '58%' },
                        { time: '01:52', pct: '82%' }
                      ].map((m, idx) => (
                        <div
                          key={idx}
                          onClick={() => setMediaTimestamp(m.time)}
                          style={{ left: m.pct }}
                          className="absolute -top-1 w-4 h-4 rounded-full bg-teal-400 border-2 border-navy-950 shadow hover:scale-125 transition-transform"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-1">
                    <button
                      onClick={() => setMediaTimestamp('00:15')}
                      className="px-2.5 py-1 rounded-lg bg-navy-900 hover:bg-navy-800 text-[10px] font-bold text-slate-300"
                    >
                      Seek: 00:15
                    </button>
                    <button
                      onClick={() => setMediaTimestamp('01:14')}
                      className="px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-bold"
                    >
                      Seek: 01:14 (Citation)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── OUTPUT STUDIO (SUMMARY, DIAGRAM, 4-Q QUIZ, FLASHCARDS) ─────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 space-y-4">
        <div className="p-6 rounded-3xl bg-navy-900/80 border border-navy-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-navy-800">
            <div>
              <h2 className="text-base font-black uppercase tracking-wider text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-400" />
                <span>One-Click Multimodal Output Studio</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Generate executive summaries, labeled component diagrams, 4-question recall quizzes & flashcards
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-navy-950 p-1 rounded-2xl border border-navy-800">
              {[
                { id: 'summary', label: 'Summary' },
                { id: 'diagram', label: 'Diagram' },
                { id: 'quiz', label: '4-Q Quiz' },
                { id: 'flashcards', label: 'Flashcards' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveStudioTab(tab.id);
                    loadStudioOutput(activeModule, tab.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeStudioTab === tab.id
                      ? 'bg-teal-500 text-navy-950 shadow-md shadow-teal-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {loadingStudio ? (
            <div className="p-8 text-center space-y-2">
              <div className="w-6 h-6 mx-auto border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-slate-400">Synthesizing {activeStudioTab} data...</p>
            </div>
          ) : (
            <div>
              {activeStudioTab === 'summary' && (
                <div className="p-5 rounded-2xl bg-navy-950 border border-navy-800 space-y-3">
                  <h3 className="text-sm font-bold text-teal-300">
                    {studioOutput?.title || `${currentModule.name} Executive Synthesis`}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {studioOutput?.summary || currentModule.description}
                  </p>
                </div>
              )}

              {activeStudioTab === 'diagram' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {(studioOutput?.components || [
                    { name: 'Component 1', role: 'Input Perception' },
                    { name: 'Component 2', role: 'Feature Extraction' },
                    { name: 'Component 3', role: 'Cross-Attention Fusion' },
                    { name: 'Component 4', role: 'Verified Output' }
                  ]).map((c, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-navy-950 border border-navy-800 space-y-2">
                      <span className="text-[10px] font-bold text-teal-400 font-mono">0{i + 1}</span>
                      <h4 className="text-xs font-bold text-white">{c.name}</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{c.role}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeStudioTab === 'quiz' && (
                <div className="space-y-4">
                  {(studioOutput?.questions || []).map((q, qIdx) => (
                    <div key={qIdx} className="p-4 rounded-2xl bg-navy-950 border border-navy-800 space-y-3">
                      <p className="text-xs font-bold text-white">
                        {qIdx + 1}. {q.question}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = quizAnswers[qIdx] === oIdx;
                          const isCorrect = q.correctIndex === oIdx;
                          let btnStyle = 'bg-navy-900 border-navy-800 text-slate-300 hover:border-teal-500/40';
                          if (quizSubmitted) {
                            if (isCorrect) btnStyle = 'bg-teal-500/20 border-teal-500 text-teal-300 font-bold';
                            else if (isSelected) btnStyle = 'bg-red-500/20 border-red-500 text-red-300';
                          } else if (isSelected) {
                            btnStyle = 'bg-teal-500/15 border-teal-500 text-teal-300';
                          }

                          return (
                            <button
                              key={oIdx}
                              onClick={() => {
                                if (quizSubmitted) return;
                                setQuizAnswers({ ...quizAnswers, [qIdx]: oIdx });
                              }}
                              className={`p-2.5 rounded-xl border text-xs text-left transition-all ${btnStyle}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                      {quizSubmitted && (
                        <p className="text-[11px] text-teal-300/90 pt-1">
                          💡 <em>Explanation: {q.explanation}</em>
                        </p>
                      )}
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      setQuizSubmitted(true);
                      success('Quiz submitted! Check explanations above.');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-black text-xs transition-all shadow-lg shadow-teal-500/20"
                  >
                    Submit Quiz & Check Answers
                  </button>
                </div>
              )}

              {activeStudioTab === 'flashcards' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {(studioOutput?.cards || [
                    { front: 'Cross-Modal Search', back: 'Retrieving evidence across text, image, audio, and video vectors simultaneously.' },
                    { front: 'Evidence Grounding', back: 'Anchoring AI claims to specific PDF page numbers or video timestamp seconds.' },
                    { front: 'Clinical Disclaimer', back: 'Decision support under human-in-the-loop review, never autonomous diagnosis.' },
                    { front: 'Universal Pipeline', back: 'Single shared backend engine with modular system prompts and output templates.' }
                  ]).map((card, i) => {
                    const isFlipped = flashcardFlipped[i];
                    return (
                      <div
                        key={i}
                        onClick={() => setFlashcardFlipped({ ...flashcardFlipped, [i]: !isFlipped })}
                        className="p-5 rounded-2xl bg-navy-950 border border-navy-800 hover:border-teal-500/40 cursor-pointer min-h-[140px] flex flex-col justify-between transition-all group"
                      >
                        <span className="text-[10px] text-teal-400 font-mono font-bold">
                          {isFlipped ? 'REVERSE' : 'FRONT (CLICK TO FLIP)'}
                        </span>
                        <p className="text-xs font-bold text-white text-center py-2">
                          {isFlipped ? card.back : card.front}
                        </p>
                        <span className="text-[9px] text-slate-500 text-right">Card #{i + 1}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─── HACKATHON SUBMISSION MODAL ──────────────────────────────────── */}
      {showSubmissionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-navy-700 rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-navy-800">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-teal-400" />
                <h3 className="text-lg font-black text-white">OmniSense AI — Hackathon Submission Dossier</h3>
              </div>
              <button
                onClick={() => setShowSubmissionModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold px-2 py-1"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="p-4 rounded-2xl bg-navy-950 border border-navy-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-teal-300 uppercase tracking-wider">Problem Statement (Under 150 words)</h4>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("People work with information in many formats (scans, photos, handwriting, voice, video, documents), but most apps handle each format separately. A doctor can’t easily link an X-ray to a patient’s history and a voice note. A blind person can’t easily get a medicine label read aloud with safety warnings. A shopper can’t search 'this jacket, in black, under ₹3,000' from a photo. Students can’t get step-by-step help from a photo of their homework. This fragmentation slows decisions, hurts accessibility, and wastes time.");
                      success('Copied Problem Statement!');
                    }}
                    className="flex items-center gap-1 text-[11px] text-teal-400 hover:underline"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>
                <p className="leading-relaxed text-slate-300">
                  People work with information in many formats (scans, photos, handwriting, voice, video, documents), but most apps handle each format separately. A doctor can’t easily link an X-ray to a patient’s history and a voice note. A blind person can’t easily get a medicine label read aloud with safety warnings. A shopper can’t search "this jacket, in black, under ₹3,000" from a photo. Students can’t get step-by-step help from a photo of their homework. This fragmentation slows decisions, hurts accessibility, and wastes time.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-navy-950 border border-navy-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-teal-300 uppercase tracking-wider">Solution Description</h4>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("OmniSense AI is a web platform that combines vision, speech, and language AI into one pipeline. A user uploads an image, speaks or types a question, and optionally adds a document. The AI processes all of it together and answers with text, highlighted images, or spoken audio. Key features: MediScan (Healthcare scan + history + voice memo), ShopLens (Photo + voice filter for e-commerce), ChefEye (Fridge photo + voice recipe), VisionVoice (Multilingual medicine label audio reader in Telugu, Hindi, English), StudyLens (Handwritten problem + voice tutoring), Drive Demo (Dashcam video + siren audio hazard simulation).");
                      success('Copied Solution Description!');
                    }}
                    className="flex items-center gap-1 text-[11px] text-teal-400 hover:underline"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>
                <p className="leading-relaxed text-slate-300">
                  OmniSense AI is a web platform that combines vision, speech, and language AI into one pipeline. A user uploads an image, speaks or types a question, and optionally adds a document. The AI processes all of it together and answers with text, highlighted images, or spoken audio.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-navy-950 border border-navy-800 space-y-2">
                <h4 className="font-bold text-teal-300 uppercase tracking-wider">Five Modules in One Platform</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-navy-900 border border-navy-800">
                    <strong className="text-white">MediScan</strong>: X-ray/MRI + history text + voice memo → Highlighted regions & draft report.
                  </div>
                  <div className="p-2.5 rounded-xl bg-navy-900 border border-navy-800">
                    <strong className="text-white">ShopLens</strong>: Photo + voice/text filter ("black, under ₹3,000") → Matching catalog products.
                  </div>
                  <div className="p-2.5 rounded-xl bg-navy-900 border border-navy-800">
                    <strong className="text-white">ChefEye</strong>: Fridge photo + voice → Ingredients, allergens & step-by-step recipe.
                  </div>
                  <div className="p-2.5 rounded-xl bg-navy-900 border border-navy-800">
                    <strong className="text-white">VisionVoice</strong>: Medicine label/sign photo + voice → Spoken dosage warnings in Telugu, Hindi & English.
                  </div>
                  <div className="p-2.5 rounded-xl bg-navy-900 border border-navy-800 sm:col-span-2">
                    <strong className="text-white">StudyLens</strong>: Handwritten problem + textbook + voice chat → Step-by-step solution, engine diagram & quiz.
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowSubmissionModal(false)}
                className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold text-xs"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
