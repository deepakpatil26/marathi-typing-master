import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../utils/usePWAInstall';

interface OfflineIndicatorProps {
  language?: 'mr' | 'en';
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ language = 'mr' }) => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="pwa-offline-banner"
      className="fixed bottom-5 left-5 z-50 flex items-center gap-2.5 rounded-2xl bg-amber-500/95 text-slate-950 px-4 py-2 text-xs font-bold shadow-2xl shadow-amber-500/30 border border-amber-300 backdrop-blur-md animate-bounce"
    >
      <WifiOff className="w-4 h-4 shrink-0 text-slate-950" />
      <span>
        {language === 'mr'
          ? 'ऑफलाइन मोड सक्रिय — सर्व धडे व कीबोर्ड इंटरनेटशिवाय कार्य करत आहेत'
          : 'Offline Mode Active — Typing lessons work without internet'}
      </span>
    </div>
  );
};
