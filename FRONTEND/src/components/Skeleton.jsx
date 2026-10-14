import React from 'react';

export const SkeletonCard = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-5 rounded-2xl bg-navy-900/60 border border-navy-800 animate-pulse space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-20 h-4 bg-navy-800 rounded-lg" />
            <div className="w-16 h-4 bg-navy-800 rounded-lg" />
          </div>
          <div className="w-3/4 h-5 bg-navy-800 rounded-lg" />
          <div className="w-full h-3 bg-navy-800 rounded-lg" />
          <div className="w-5/6 h-3 bg-navy-800 rounded-lg" />
          <div className="pt-3 border-t border-navy-800 flex justify-between">
            <div className="w-24 h-4 bg-navy-800 rounded-lg" />
            <div className="w-16 h-4 bg-navy-800 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const SkeletonStats = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-2xl bg-navy-900/60 border border-navy-800 animate-pulse space-y-2"
        >
          <div className="w-10 h-10 rounded-xl bg-navy-800" />
          <div className="w-16 h-6 bg-navy-800 rounded-lg" />
          <div className="w-24 h-3 bg-navy-800 rounded-lg" />
        </div>
      ))}
    </div>
  );
};

export const EmptyState = ({ title, description, actionText, onAction, icon: Icon }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 rounded-2xl bg-navy-900/40 border border-dashed border-navy-700/80 text-center">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-4 text-teal-400">
          <Icon className="w-7 h-7" />
        </div>
      )}
      <h3 className="text-base font-bold text-white mb-1">{title}</h3>
      <p className="text-xs text-slate-400 max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold text-xs transition-colors shadow-md shadow-teal-500/20"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
