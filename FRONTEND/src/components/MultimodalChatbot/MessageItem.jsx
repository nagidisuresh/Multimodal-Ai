import React, { useState } from 'react';
import { Volume2, VolumeX, Copy, Check, Sparkles, User, FileText, ExternalLink, Image as ImageIcon } from 'lucide-react';

/**
 * Format markdown text simply and securely without heavy dependencies
 */
function renderFormattedText(text) {
  if (!text) return null;

  // Split into lines
  const lines = text.split('\n');

  return lines.map((line, idx) => {
    // Empty line
    if (!line.trim()) {
      return <div key={idx} className="h-2" />;
    }

    // Header 3 or 4
    if (line.startsWith('### ')) {
      return (
        <h4 key={idx} className="text-sm font-bold text-teal-400 mt-2 mb-1">
          {line.replace('### ', '')}
        </h4>
      );
    }
    if (line.startsWith('## ')) {
      return (
        <h3 key={idx} className="text-base font-extrabold text-white mt-2 mb-1">
          {line.replace('## ', '')}
        </h3>
      );
    }

    // List item
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      const cleanLine = line.trim().substring(2);
      return (
        <div key={idx} className="flex items-start gap-2 my-0.5 ml-2">
          <span className="text-teal-400 font-bold leading-relaxed">•</span>
          <span className="flex-1">{formatInline(cleanLine)}</span>
        </div>
      );
    }

    // Numbered list item
    const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      return (
        <div key={idx} className="flex items-start gap-2 my-0.5 ml-2">
          <span className="text-teal-400 font-mono font-bold text-xs mt-0.5">
            {numMatch[1]}.
          </span>
          <span className="flex-1">{formatInline(numMatch[2])}</span>
        </div>
      );
    }

    // Code block line
    if (line.trim().startsWith('```')) {
      return null;
    }

    return (
      <p key={idx} className="my-1 leading-relaxed">
        {formatInline(line)}
      </p>
    );
  });
}

function formatInline(str) {
  const parts = [];
  let remaining = str;

  // Replace **bold**
  const regex = /(\*\*[^*]+\*\*)|(`[^`]+`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(str)) !== null) {
    if (match.index > lastIndex) {
      parts.push(str.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} className="font-bold text-teal-300 dark:text-teal-200">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code
          key={match.index}
          className="px-1.5 py-0.5 rounded bg-black/20 dark:bg-black/40 text-teal-300 font-mono text-xs border border-teal-500/20"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < str.length) {
    parts.push(str.substring(lastIndex));
  }

  return parts.length > 0 ? parts : str;
}

export const MessageItem = ({
  message,
  onSpeak,
  onStopSpeak,
  isSpeakingThis,
  onPreviewImage,
}) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`flex gap-3 my-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Assistant Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center shrink-0 shadow-md shadow-teal-500/20 mt-1">
          <Sparkles className="w-4 h-4 text-navy-950 font-black fill-current" />
        </div>
      )}

      {/* Message Bubble Container */}
      <div className={`max-w-[85%] sm:max-w-[75%] space-y-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
        {/* User-Uploaded Vision & Document Previews */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-1.5">
            {message.attachments.map((att, i) => (
              <div
                key={i}
                className="relative rounded-xl overflow-hidden border border-teal-500/30 bg-black/20 shadow-md group cursor-pointer"
                onClick={() => att.previewUrl && onPreviewImage(att.previewUrl)}
              >
                {att.type.startsWith('image/') ? (
                  <div className="relative">
                    <img
                      src={att.previewUrl}
                      alt={att.name}
                      className="w-36 h-28 object-cover rounded-xl transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1">
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Zoom</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-2 bg-navy-800 text-slate-200 text-xs rounded-xl border border-navy-700">
                    <FileText className="w-4 h-4 text-teal-400 shrink-0" />
                    <span className="truncate max-w-[120px] font-medium">{att.name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Text Content Bubble */}
        <div
          className={`p-3.5 rounded-2xl text-xs sm:text-sm shadow-sm transition-all ${
            isUser
              ? 'bg-teal-500 text-navy-950 font-medium rounded-tr-none'
              : 'bg-white dark:bg-navy-900/90 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-navy-700/80 rounded-tl-none backdrop-blur-md'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
          ) : (
            <div className="prose-sm dark:prose-invert">
              {renderFormattedText(message.content)}
            </div>
          )}
        </div>

        {/* Footer: Timestamp, TTS, Copy */}
        <div className="flex items-center gap-2 px-1 text-[10px] text-slate-400">
          <span>{message.timestamp}</span>

          {!isUser && message.content && (
            <>
              <span>•</span>
              <button
                onClick={() => (isSpeakingThis ? onStopSpeak() : onSpeak(message.content))}
                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md hover:bg-slate-200 dark:hover:bg-navy-800 transition-colors ${
                  isSpeakingThis ? 'text-teal-400 font-bold animate-pulse' : 'text-slate-400 hover:text-slate-200'
                }`}
                title={isSpeakingThis ? 'Stop Audio Narration' : 'Read Out Loud (TTS)'}
              >
                {isSpeakingThis ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-teal-400" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen</span>
                  </>
                )}
              </button>

              <span>•</span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-400 hover:text-slate-200 transition-colors"
                title="Copy response"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-teal-400" />
                    <span className="text-teal-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-navy-800 dark:bg-navy-700 border border-slate-700 flex items-center justify-center shrink-0 shadow mt-1">
          <User className="w-4 h-4 text-slate-300" />
        </div>
      )}
    </div>
  );
};
