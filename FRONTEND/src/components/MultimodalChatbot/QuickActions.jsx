import React from 'react';
import { HelpCircle, Camera, Mic, ShieldCheck, RefreshCw, FileText } from 'lucide-react';

export const QuickActions = ({ onSelectAction }) => {
  const actions = [
    {
      id: 'ask-question',
      label: 'Ask a Question',
      icon: HelpCircle,
      prompt: 'How can I get started with your services, and what features do you support?',
    },
    {
      id: 'upload-photo',
      label: 'Upload Product Photo',
      icon: Camera,
      action: 'trigger-upload',
    },
    {
      id: 'voice-assistant',
      label: 'Speak with Voice Assistant',
      icon: Mic,
      action: 'trigger-voice',
    },
    {
      id: 'warranty-check',
      label: 'Warranty & Policy Info',
      icon: ShieldCheck,
      prompt: 'What are the return policy terms and warranty coverage details?',
    },
    {
      id: 'order-status',
      label: 'Check Order & Delivery',
      icon: RefreshCw,
      prompt: 'How do I track my active order status and delivery timeline?',
    },
  ];

  return (
    <div className="flex flex-wrap gap-1.5 p-2 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10 my-2">
      <div className="w-full text-[11px] font-bold text-slate-500 dark:text-slate-400 px-1 mb-1 flex items-center gap-1.5">
        <span>⚡ Quick Help Topics:</span>
      </div>
      {actions.map((act) => {
        const Icon = act.icon;
        return (
          <button
            key={act.id}
            onClick={() => onSelectAction(act)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-navy-800 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-navy-700 hover:border-teal-400 dark:hover:border-teal-500 transition-all shadow-sm hover:scale-[1.02] active:scale-95"
          >
            <Icon className="w-3.5 h-3.5 text-teal-500 dark:text-teal-400 shrink-0" />
            <span>{act.label}</span>
          </button>
        );
      })}
    </div>
  );
};
