import React from 'react';
import {
  Phone,
  AtSign,
  Globe,
  Landmark,
  IndianRupee,
  User,
  Calendar,
  Copy,
  Check,
  ExternalLink,
  Layers
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const EntityChips = ({ entities = {}, linkedEntities = [] }) => {
  const { success } = useToast();
  const [copiedVal, setCopiedVal] = React.useState(null);

  const handleCopy = (val, label) => {
    navigator.clipboard.writeText(val);
    setCopiedVal(val);
    success(`Copied ${label}: ${val}`);
    setTimeout(() => setCopiedVal(null), 2000);
  };

  // If cross-modal linkedEntities are provided
  if (Array.isArray(linkedEntities) && linkedEntities.length > 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-teal-400" />
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Cross-File Linked Entities ({linkedEntities.length})
          </h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {linkedEntities.map((item, idx) => {
            const isCopied = copiedVal === item.value;
            let badgeBg = 'bg-navy-800/80 border-navy-700 text-slate-200';
            if (item.importance === 'HIGH') {
              badgeBg = 'bg-red-500/15 border-red-500/40 text-red-200';
            } else if (item.importance === 'MEDIUM') {
              badgeBg = 'bg-amber-500/15 border-amber-500/40 text-amber-200';
            }

            return (
              <div
                key={idx}
                className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${badgeBg}`}
              >
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">
                  {item.type}:
                </span>
                <span className="font-mono">{item.value}</span>
                {item.foundIn?.length > 1 && (
                  <span className="px-1.5 py-0.5 rounded-md bg-navy-950/60 text-[9px] font-bold text-teal-300">
                    {item.foundIn.length} files
                  </span>
                )}
                <button
                  onClick={() => handleCopy(item.value, item.type)}
                  className="opacity-60 hover:opacity-100 p-0.5 transition-opacity"
                  title="Copy"
                  aria-label={`Copy ${item.value}`}
                >
                  {isCopied ? (
                    <Check className="w-3.5 h-3.5 text-teal-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Fallback to per-file extracted entities
  const categories = [
    { key: 'phones', label: 'Phone', icon: Phone, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
    { key: 'upiIds', label: 'UPI ID', icon: AtSign, color: 'text-red-400 border-red-500/30 bg-red-500/10' },
    { key: 'bankAccounts', label: 'Bank A/C', icon: Landmark, color: 'text-rose-400 border-rose-500/30 bg-rose-500/10' },
    { key: 'urls', label: 'Link / URL', icon: Globe, color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10', isUrl: true },
    { key: 'amounts', label: 'Amount', icon: IndianRupee, color: 'text-teal-400 border-teal-500/30 bg-teal-500/10' },
    { key: 'names', label: 'Name', icon: User, color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10' },
    { key: 'dates', label: 'Date', icon: Calendar, color: 'text-slate-300 border-slate-600 bg-navy-800' },
  ];

  const hasAny = categories.some((cat) => Array.isArray(entities[cat.key]) && entities[cat.key].length > 0);

  if (!hasAny) {
    return (
      <div className="text-xs text-slate-500 italic p-3 rounded-xl bg-navy-900/40 border border-navy-800">
        No specific identifiable entities (phones, UPI, bank accounts) extracted in this artifact.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {categories.map((cat) => {
        const items = entities[cat.key];
        if (!Array.isArray(items) || items.length === 0) return null;
        const Icon = cat.icon;

        return (
          <div key={cat.key} className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Icon className="w-3 h-3 text-slate-400" />
              <span>{cat.label} ({items.length})</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {items.map((val, i) => {
                const isCopied = copiedVal === val;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono font-medium ${cat.color}`}
                  >
                    <span>{val}</span>
                    {cat.isUrl && (
                      <a
                        href={val.startsWith('http') ? val : `https://${val}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-300 hover:text-white"
                        title="Open link cautiously"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <button
                      onClick={() => handleCopy(val, cat.label)}
                      className="opacity-70 hover:opacity-100 transition-opacity"
                      title="Copy"
                      aria-label={`Copy ${val}`}
                    >
                      {isCopied ? <Check className="w-3 h-3 text-teal-300" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
