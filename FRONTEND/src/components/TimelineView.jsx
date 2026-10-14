import React from 'react';
import { Clock, FileText, ArrowRight } from 'lucide-react';

export const TimelineView = ({ timeline = [] }) => {
  if (!Array.isArray(timeline) || timeline.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-navy-900/40 border border-navy-800 text-slate-500 text-xs text-center italic">
        No timeline events generated yet. Summarize the case to reconstruct incident chronology.
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-teal-500 before:via-navy-700 before:to-navy-800">
      {timeline.map((item, index) => (
        <div key={index} className="relative group">
          {/* Node marker */}
          <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-navy-900 border-2 border-teal-400 flex items-center justify-center shadow-md shadow-teal-500/20 group-hover:scale-110 transition-transform">
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400" />
          </div>

          <div className="p-3.5 rounded-xl bg-navy-900/80 border border-navy-800 hover:border-teal-500/30 transition-all shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5 text-teal-400 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>{item.time || 'Undated Event'}</span>
              </div>
              {item.source && (
                <div className="flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-navy-800 text-slate-300 border border-navy-700">
                  <FileText className="w-3 h-3 text-teal-400" />
                  <span className="truncate max-w-[180px]">{item.source}</span>
                </div>
              )}
            </div>
            <p className="text-slate-200 text-xs leading-relaxed">
              {item.event}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
