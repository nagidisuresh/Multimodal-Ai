import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Loader2, CheckCircle2, CloudLightning } from 'lucide-react';

export const ServerStatusBanner = () => {
  const [status, setStatus] = useState('idle'); // 'idle' | 'waking' | 'ready'
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let timer = setTimeout(() => {
      // If health check hasn't responded within 1.8s, assume server is cold-starting
      if (status === 'idle') {
        setStatus('waking');
      }
    }, 1800);

    api.get('/health', { timeout: 35000 })
      .then(() => {
        clearTimeout(timer);
        setStatus('ready');
        setTimeout(() => setDismissed(true), 3000);
      })
      .catch(() => {
        setStatus('waking');
      });

    return () => clearTimeout(timer);
  }, []);

  if (dismissed || status === 'idle') return null;

  return (
    <div className={`transition-all duration-500 py-1.5 px-4 text-xs font-medium flex items-center justify-center gap-2 border-b z-50 ${
      status === 'waking'
        ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
    }`}>
      {status === 'waking' ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0 text-amber-400" />
          <span>
            <strong>Waking up the server:</strong> Render's free tier sleeps after 15 minutes of inactivity. Initial request may take ~20-30 seconds.
          </span>
        </>
      ) : (
        <>
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
          <span>Render backend is active and connected!</span>
        </>
      )}
    </div>
  );
};
