import React from 'react';

/**
 * Live audio waveform animation when microphone or speech synthesis is active.
 */
export const AudioWaveform = ({ color = 'teal', isSpeaking = false }) => {
  const bars = [40, 75, 95, 60, 85, 100, 70, 50, 90, 65, 80, 45];

  return (
    <div className="flex items-center justify-center gap-1 h-6 px-2">
      {bars.map((heightPercent, idx) => (
        <span
          key={idx}
          className={`w-1 rounded-full ${
            color === 'teal' ? 'bg-teal-400' : 'bg-cyan-400'
          } animate-pulse`}
          style={{
            height: `${Math.max(20, heightPercent * (isSpeaking ? 0.9 : 0.7))}%`,
            animationDuration: `${0.4 + (idx % 4) * 0.2}s`,
            animationDelay: `${idx * 0.05}s`,
          }}
        />
      ))}
    </div>
  );
};
