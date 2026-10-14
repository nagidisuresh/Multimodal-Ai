'use client';

import React from 'react';

interface WaveformIndicatorProps {
  isActive: boolean;
  color?: 'cyan' | 'blue' | 'violet' | 'red';
  barCount?: number;
  heightClass?: string;
}

export const WaveformIndicator: React.FC<WaveformIndicatorProps> = ({
  isActive,
  color = 'cyan',
  barCount = 12,
  heightClass = 'h-8',
}) => {
  const bars = Array.from({ length: barCount }, (_, i) => i);

  const colorMap = {
    cyan: 'bg-cyan-400',
    blue: 'bg-blue-500',
    violet: 'bg-purple-500',
    red: 'bg-red-500',
  };

  const bgClass = colorMap[color] || 'bg-cyan-400';

  return (
    <div className={`flex items-center justify-center gap-1.5 px-3 ${heightClass}`}>
      {bars.map((idx) => {
        // Vary base heights for an organic sound spectrum look
        const baseHeight = 25 + ((idx * 17) % 65);
        return (
          <span
            key={idx}
            className={`w-1 rounded-full ${bgClass} transition-all duration-150 ${
              isActive ? 'animate-pulse' : 'opacity-30'
            }`}
            style={{
              height: isActive ? `${Math.min(100, baseHeight)}%` : '15%',
              animationDuration: isActive ? `${0.35 + (idx % 5) * 0.15}s` : '0s',
              animationDelay: `${idx * 0.04}s`,
            }}
          />
        );
      })}
    </div>
  );
};
