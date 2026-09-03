import React from 'react';
import { Finger } from '../types';
import { FINGER_COLORS } from '../data/remingtonMap';

interface FingerGuideProps {
  activeFinger: Finger | null;
  language: 'mr' | 'en';
}

export const FingerGuide: React.FC<FingerGuideProps> = ({ activeFinger, language }) => {
  const isLeft = activeFinger?.startsWith('left');
  const isRight = activeFinger?.startsWith('right');
  const isThumb = activeFinger === 'thumb';

  const fingersLeft = [
    { id: 'left-pinky' as Finger, labelEn: 'Pinky', labelMr: 'करंगळी', keyHint: 'q a z 1' },
    { id: 'left-ring' as Finger, labelEn: 'Ring', labelMr: 'अनामिका', keyHint: 'w s x 2' },
    { id: 'left-middle' as Finger, labelEn: 'Middle', labelMr: 'मध्यमा', keyHint: 'e d c 3' },
    { id: 'left-index' as Finger, labelEn: 'Index', labelMr: 'तर्जनी', keyHint: 'r t f g v b 4 5' },
  ];

  const fingersRight = [
    { id: 'right-index' as Finger, labelEn: 'Index', labelMr: 'तर्जनी', keyHint: 'y u h j n m 6 7' },
    { id: 'right-middle' as Finger, labelEn: 'Middle', labelMr: 'मध्यमा', keyHint: 'i k , 8' },
    { id: 'right-ring' as Finger, labelEn: 'Ring', labelMr: 'अनामिका', keyHint: 'o l . 9' },
    { id: 'right-pinky' as Finger, labelEn: 'Pinky', labelMr: 'करंगळी', keyHint: 'p ; / 0 [ ]' },
  ];

  const activeColorInfo = activeFinger ? FINGER_COLORS[activeFinger] : null;

  return (
    <div id="finger-guide-container" className="w-full bg-[#0F172A]/90 border border-slate-800 rounded-3xl p-5 shadow-2xl backdrop-blur-md">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
            {language === 'mr' ? 'बोटांची अचूक स्थिती (Finger Placement Guide)' : 'Finger Position Guide'}
          </span>
        </div>

        {activeColorInfo && (
          <div className={`px-3.5 py-1 rounded-xl text-xs font-semibold border ${activeColorInfo.bg} flex items-center gap-2 transition-all duration-300 shadow-sm`}>
            <span className="text-slate-300">{language === 'mr' ? 'वापरायचे बोट:' : 'Active Finger:'}</span>
            <span className="font-bold">{language === 'mr' ? activeColorInfo.nameMr : activeColorInfo.nameEn}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Hand */}
        <div className={`p-4 rounded-2xl border transition-all duration-200 ${isLeft || isThumb ? 'bg-slate-900/90 border-blue-500/40 shadow-lg shadow-blue-500/5' : 'bg-slate-950/40 border-slate-800/60 opacity-80'}`}>
          <div className="text-xs font-semibold text-slate-300 mb-3 flex items-center justify-between">
            <span className="font-bold text-slate-200">{language === 'mr' ? 'डावा हात (Left Hand)' : 'Left Hand'}</span>
            <span className="text-[10px] text-slate-500 font-mono">Home: a s d f (ो े ् ि)</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {fingersLeft.map(f => {
              const isActive = activeFinger === f.id;
              const color = FINGER_COLORS[f.id];
              return (
                <div
                  key={f.id}
                  id={`finger-${f.id}`}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all duration-200 ${
                    isActive
                      ? `${color.bg} ${color.border} scale-105 shadow-lg ring-2 ring-blue-400`
                      : 'bg-slate-950/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="text-xs font-bold tracking-wide">{language === 'mr' ? f.labelMr : f.labelEn}</span>
                  <span className="text-[10px] opacity-70 mt-1 font-mono">{f.keyHint}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Hand */}
        <div className={`p-4 rounded-2xl border transition-all duration-200 ${isRight || isThumb ? 'bg-slate-900/90 border-blue-500/40 shadow-lg shadow-blue-500/5' : 'bg-slate-950/40 border-slate-800/60 opacity-80'}`}>
          <div className="text-xs font-semibold text-slate-300 mb-3 flex items-center justify-between">
            <span className="font-bold text-slate-200">{language === 'mr' ? 'उजवा हात (Right Hand)' : 'Right Hand'}</span>
            <span className="text-[10px] text-slate-500 font-mono">Home: j k l ; (र ा स य)</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {fingersRight.map(f => {
              const isActive = activeFinger === f.id;
              const color = FINGER_COLORS[f.id];
              return (
                <div
                  key={f.id}
                  id={`finger-${f.id}`}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all duration-200 ${
                    isActive
                      ? `${color.bg} ${color.border} scale-105 shadow-lg ring-2 ring-blue-400`
                      : 'bg-slate-950/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="text-xs font-bold tracking-wide">{language === 'mr' ? f.labelMr : f.labelEn}</span>
                  <span className="text-[10px] opacity-70 mt-1 font-mono">{f.keyHint}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Thumb Spacebar hint */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-center gap-2 text-xs text-slate-400">
        <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded-lg font-mono text-[11px] font-bold">
          {language === 'mr' ? 'अंगठा (Thumb)' : 'Thumb'}
        </span>
        <span>{language === 'mr' ? 'नेहमी शब्दांमधील अंतरासाठी स्पेसबार दाबा.' : 'Use thumb for pressing the Spacebar.'}</span>
      </div>
    </div>
  );
};
