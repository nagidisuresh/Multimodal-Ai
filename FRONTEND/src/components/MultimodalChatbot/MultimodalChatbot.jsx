import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Maximize2,
  Minimize2,
  Mic,
  MicOff,
  Paperclip,
  Send,
  Sparkles,
  Sun,
  Moon,
  Trash2,
  Volume2,
  VolumeX,
  FileText,
  AlertCircle,
  HelpCircle,
  Loader2,
  Image as ImageIcon,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { useMultimodalAI } from '../../hooks/useMultimodalAI';
import { MessageItem } from './MessageItem';
import { QuickActions } from './QuickActions';
import { AudioWaveform } from './AudioWaveform';
import { useTheme } from '../../context/ThemeContext';

export const MultimodalChatbot = ({
  defaultOpen = false,
  forceFullScreen = false,
  apiEndpoint = '/api/omnimind/ask',
}) => {
  const { theme, toggleTheme, isDark } = useTheme();

  // Widget visibility & display states
  const [isOpen, setIsOpen] = useState(defaultOpen || forceFullScreen);
  const [isFullScreen, setIsFullScreen] = useState(forceFullScreen);
  const [showProactiveBadge, setShowProactiveBadge] = useState(!defaultOpen && !forceFullScreen);

  // Input states
  const [inputText, setInputText] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [previewModalUrl, setPreviewModalUrl] = useState(null);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Multimodal AI hook
  const {
    messages,
    status,
    setStatus,
    isStreaming,
    error,
    sendMessage,
    speakText,
    stopSpeaking,
    clearChat,
  } = useMultimodalAI({ apiEndpoint });

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, status]);

  // Adjust textarea height automatically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputText]);

  // Speech Recognition (Web Speech API) setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setStatus('listening');
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((res) => res[0].transcript)
          .join('');
        setInputText(transcript);
      };

      recognition.onerror = (event) => {
        console.warn('[SpeechRecognition] error:', event.error);
        setIsListening(false);
        setStatus('idle');
      };

      recognition.onend = () => {
        setIsListening(false);
        if (status === 'listening') {
          setStatus('idle');
        }
      };

      recognitionRef.current = recognition;
    }
  }, [setStatus, status]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setStatus('idle');
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.warn('[SpeechRecognition] restart:', e);
        }
      } else {
        // Fallback simulated voice input for unsupported browsers
        setIsListening(true);
        setStatus('listening');
        setTimeout(() => {
          setInputText('Can you explain how this product works and its return policy?');
          setIsListening(false);
          setStatus('idle');
        }, 2200);
      }
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const processFiles = (files) => {
    const valid = files.filter(
      (f) => f.type.startsWith('image/') || f.type.includes('pdf')
    );

    const newAttachments = valid.map((file) => ({
      file,
      name: file.name,
      type: file.type,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    processFiles(files);
  };

  // Submit message
  const handleSend = () => {
    if (!inputText.trim() && attachments.length === 0) return;

    sendMessage({
      text: inputText.trim(),
      attachments,
    });

    setInputText('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Quick Action Handler
  const handleSelectQuickAction = (action) => {
    if (action.action === 'trigger-upload') {
      fileInputRef.current?.click();
    } else if (action.action === 'trigger-voice') {
      toggleListening();
    } else if (action.prompt) {
      sendMessage({ text: action.prompt, attachments: [] });
    }
  };

  const handleSpeakMessage = (msgId, text) => {
    setSpeakingMsgId(msgId);
    speakText(text, () => setSpeakingMsgId(null));
  };

  const handleStopSpeakingMessage = () => {
    setSpeakingMsgId(null);
    stopSpeaking();
  };

  return (
    <>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png,image/jpeg,image/webp,application/pdf"
        multiple
        className="hidden"
      />

      {/* Floating Action Button (FAB) & Proactive Welcome Tooltip */}
      {!forceFullScreen && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-auto">
          {/* Proactive Welcome Tooltip */}
          {showProactiveBadge && !isOpen && (
            <div className="relative animate-bounce bg-white dark:bg-navy-800 text-slate-800 dark:text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-teal-500/30 text-xs font-semibold flex items-center gap-2 max-w-xs transition-all">
              <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Need help? Chat or speak with Multimodal AI!</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProactiveBadge(false);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white ml-1"
                aria-label="Dismiss welcome popup"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white dark:bg-navy-800 border-r border-b border-teal-500/30 rotate-45" />
            </div>
          )}

          {/* Floating Action Button */}
          <button
            onClick={() => {
              setIsOpen(!isOpen);
              setShowProactiveBadge(false);
            }}
            className="group relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 via-teal-400 to-cyan-400 text-navy-950 flex items-center justify-center shadow-2xl shadow-teal-500/40 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-teal-400/30"
            aria-label="Toggle Multimodal Assistant"
          >
            {isOpen ? (
              <X className="w-6 h-6 stroke-[2.5] text-navy-950 transition-transform group-hover:rotate-90" />
            ) : (
              <>
                <MessageSquare className="w-6 h-6 stroke-[2.2] text-navy-950" />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-cyan-300 rounded-full border-2 border-white dark:border-navy-900 animate-ping" />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-cyan-300 rounded-full border-2 border-white dark:border-navy-900" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Main Chat Window (Floating or Fullscreen) */}
      {isOpen && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`fixed z-50 flex flex-col overflow-hidden bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 shadow-2xl transition-all duration-300 backdrop-blur-2xl ${
            isFullScreen || forceFullScreen
              ? 'inset-0 sm:inset-4 rounded-none sm:rounded-3xl'
              : 'bottom-24 right-6 w-[94vw] sm:w-[430px] h-[600px] max-h-[85vh] rounded-3xl'
          }`}
        >
          {/* Drag & Drop Overlay */}
          {isDragging && (
            <div className="absolute inset-0 z-50 bg-teal-500/20 backdrop-blur-sm border-2 border-dashed border-teal-400 flex flex-col items-center justify-center text-teal-300 pointer-events-none">
              <ImageIcon className="w-12 h-12 mb-2 animate-bounce" />
              <p className="text-sm font-bold">Drop Images or PDFs for Visual AI Analysis</p>
            </div>
          )}

          {/* Window Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-white dark:bg-navy-900/90 border-b border-slate-200 dark:border-navy-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center shadow-md shadow-teal-500/20">
                  <Sparkles className="w-5 h-5 text-navy-950 font-black fill-current" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-navy-900 rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    OmniAssist AI
                  </h3>
                  <span className="px-1.5 py-0.2 rounded bg-teal-500/10 border border-teal-500/30 text-[10px] font-bold text-teal-600 dark:text-teal-400">
                    Multimodal 2.5
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Voice &bull; Vision &bull; 24/7 Customer Support
                </p>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              {/* Dark / Light Toggle */}
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-navy-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>

              {/* Clear chat */}
              <button
                onClick={clearChat}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-navy-800 hover:text-red-400 transition-colors"
                title="Reset Conversation"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Fullscreen / Minimize Toggle */}
              {!forceFullScreen && (
                <button
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-navy-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                  title={isFullScreen ? 'Exit Full Screen' : 'Expand to Full Screen'}
                >
                  {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              )}

              {/* Close */}
              {!forceFullScreen && (
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-navy-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                  title="Close Assistant"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Active Status Notification Ribbon */}
          {status !== 'idle' && (
            <div className="flex items-center justify-between px-4 py-1.5 bg-teal-500/10 border-b border-teal-500/20 text-xs text-teal-600 dark:text-teal-300 font-medium shrink-0 animate-fadeIn">
              <div className="flex items-center gap-2">
                {status === 'listening' && (
                  <>
                    <Mic className="w-3.5 h-3.5 animate-pulse text-teal-400" />
                    <span>AI Listening... Speak naturally</span>
                    <AudioWaveform color="teal" />
                  </>
                )}
                {status === 'processing-image' && (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                    <span>Analyzing uploaded image / document with Vision model...</span>
                  </>
                )}
                {status === 'generating' && (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-pulse text-teal-400" />
                    <span>OmniAssist is synthesizing response...</span>
                  </>
                )}
                {status === 'speaking' && (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                    <span>Voice Assistant speaking...</span>
                    <AudioWaveform color="teal" isSpeaking />
                  </>
                )}
              </div>
              {status === 'speaking' && (
                <button
                  onClick={stopSpeaking}
                  className="text-[11px] underline font-bold hover:text-white"
                >
                  Stop
                </button>
              )}
            </div>
          )}

          {/* Messages Thread Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {/* Customer Service Quick Action Chips */}
            <QuickActions onSelectAction={handleSelectQuickAction} />

            {/* Error banner */}
            {error && (
              <div className="p-3 my-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Render message list */}
            {messages.map((msg) => (
              <MessageItem
                key={msg.id}
                message={msg}
                onSpeak={(txt) => handleSpeakMessage(msg.id, txt)}
                onStopSpeak={handleStopSpeakingMessage}
                isSpeakingThis={speakingMsgId === msg.id}
                onPreviewImage={(url) => setPreviewModalUrl(url)}
              />
            ))}

            <div ref={chatEndRef} />
          </div>

          {/* Input & Multimodal Attachment Tray */}
          <div className="p-3 bg-white dark:bg-navy-900 border-t border-slate-200 dark:border-navy-800 shrink-0 space-y-2">
            {/* Attachment preview chips */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1 pb-1">
                {attachments.map((att, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-teal-50 dark:bg-navy-800 border border-teal-500/30 text-xs text-slate-800 dark:text-slate-200"
                  >
                    {att.type.startsWith('image/') ? (
                      <ImageIcon className="w-3.5 h-3.5 text-teal-500 dark:text-teal-400 shrink-0" />
                    ) : (
                      <FileText className="w-3.5 h-3.5 text-teal-500 dark:text-teal-400 shrink-0" />
                    )}
                    <span className="max-w-[120px] truncate font-medium">{att.name}</span>
                    <button
                      onClick={() => removeAttachment(i)}
                      className="text-slate-400 hover:text-red-400 ml-1"
                      aria-label="Remove attachment"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <div className="flex items-end gap-2 bg-slate-100 dark:bg-navy-950 rounded-2xl p-1.5 border border-slate-200 dark:border-navy-800 focus-within:border-teal-400 dark:focus-within:border-teal-500 transition-colors">
              {/* Attachment Picker Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-xl text-slate-500 hover:text-teal-500 dark:text-slate-400 dark:hover:text-teal-400 hover:bg-slate-200 dark:hover:bg-navy-800 transition-colors shrink-0"
                title="Attach Image or Document (PNG, JPG, PDF)"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              {/* Textarea Input (Auto-resizing) */}
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isListening
                    ? 'Listening... speak into your microphone'
                    : 'Ask a question, upload image, or speak...'
                }
                rows={1}
                className="flex-1 bg-transparent border-0 outline-none resize-none text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 py-1.5 px-1 max-h-28 overflow-y-auto"
              />

              {/* Voice Microphone Button with Animated Pulse */}
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2 rounded-xl transition-all shrink-0 ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/40'
                    : 'text-slate-500 hover:text-teal-500 dark:text-slate-400 dark:hover:text-teal-400 hover:bg-slate-200 dark:hover:bg-navy-800'
                }`}
                title={isListening ? 'Stop Listening' : 'Speak with Voice Assistant (Speech-to-Text)'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Send Button */}
              <button
                type="button"
                onClick={handleSend}
                disabled={!inputText.trim() && attachments.length === 0}
                className="p-2 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-40 disabled:hover:bg-teal-500 text-navy-950 font-bold transition-all shadow-md shadow-teal-500/20 shrink-0 hover:scale-105 active:scale-95"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Disclaimer & Multimodal Footer Info */}
            <div className="flex items-center justify-between px-1 text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-teal-400" />
                <span>Powered by Gemini 2.5 Flash Multimodal Pipeline</span>
              </span>
              <span>Enter to send &bull; Shift+Enter for newline</span>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox / Zoom Modal for Vision Attachments */}
      {previewModalUrl && (
        <div
          onClick={() => setPreviewModalUrl(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-3xl max-h-[90vh]">
            <img
              src={previewModalUrl}
              alt="Enlarged attachment preview"
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl border border-white/20"
            />
            <button
              onClick={() => setPreviewModalUrl(null)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-navy-950 flex items-center justify-center font-bold shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
