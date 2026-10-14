import React from 'react';
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

export const RiskMeter = ({ score = 0, verdict = 'PENDING', scamType = '', size = 'md' }) => {
  const numericScore = Math.min(Math.max(Number(score) || 0, 0), 100);

  // Color config based on verdict / score
  let config = {
    color: 'text-teal-400',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/30',
    stroke: '#14B8A6',
    label: 'SAFE',
    icon: ShieldCheck,
  };

  if (verdict === 'SCAM' || numericScore >= 70) {
    config = {
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/40',
      stroke: '#EF4444',
      label: 'CONFIRMED SCAM',
      icon: ShieldAlert,
    };
  } else if (verdict === 'SUSPICIOUS' || numericScore >= 35) {
    config = {
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/40',
      stroke: '#F59E0B',
      label: 'HIGH SUSPICION',
      icon: AlertTriangle,
    };
  } else if (verdict === 'PENDING') {
    config = {
      color: 'text-slate-400',
      bg: 'bg-slate-500/10',
      border: 'border-slate-500/30',
      stroke: '#64748B',
      label: 'ANALYZING',
      icon: AlertTriangle,
    };
  }

  const Icon = config.icon;
  const radius = size === 'lg' ? 68 : 48;
  const strokeWidth = size === 'lg' ? 10 : 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (numericScore / 100) * circumference;
  const viewBoxSize = (radius + strokeWidth) * 2;

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-navy-900/60 border border-navy-700/60">
      <div className="relative flex items-center justify-center">
        {/* SVG Circular Gauge */}
        <svg
          width={viewBoxSize}
          height={viewBoxSize}
          className="transform -rotate-90 transition-all duration-1000 ease-out"
        >
          {/* Background track */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke="#1C2541"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated score stroke */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            stroke={config.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`font-black tracking-tight leading-none ${size === 'lg' ? 'text-4xl' : 'text-2xl'} ${config.color}`}>
            {numericScore}
          </span>
          <span className="text-[10px] uppercase font-bold text-slate-400 mt-0.5 tracking-wider">
            Risk Index
          </span>
        </div>
      </div>

      {/* Verdict Badge */}
      <div className="mt-3 text-center">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${config.bg} ${config.border} ${config.color}`}>
          <Icon className="w-3.5 h-3.5 shrink-0" />
          <span>{config.label}</span>
        </div>
        {scamType && (
          <p className="text-xs text-slate-300 font-medium mt-1.5 max-w-[200px] truncate">
            {scamType}
          </p>
        )}
      </div>
    </div>
  );
};
