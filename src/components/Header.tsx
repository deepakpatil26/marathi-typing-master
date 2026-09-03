import React from 'react';
import { AppMode } from '../types';
import { 
  BookOpen, 
  Award, 
  FileText, 
  BarChart3, 
  Volume2, 
  VolumeX, 
  Globe, 
  Keyboard
} from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  language: 'mr' | 'en';
  onToggleLanguage: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  completedCount: number;
  totalLessons: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  language,
  onToggleLanguage,
  soundEnabled,
  onToggleSound,
  completedCount,
  totalLessons
}) => {
  const modes: { id: AppMode; labelEn: string; labelMr: string; icon: React.ReactNode }[] = [
    { id: 'lessons', labelEn: 'Lessons', labelMr: 'धडे व सराव', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'exam', labelEn: 'GCC-TBC Exam', labelMr: 'परीक्षा मोड (Exam)', icon: <Award className="w-4 h-4" /> },
    { id: 'custom', labelEn: 'Custom Text', labelMr: 'स्वतःचा मजकूर', icon: <FileText className="w-4 h-4" /> },
    { id: 'analytics', labelEn: 'Analytics', labelMr: 'प्रगती व विश्लेषण', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <header id="app-header" className="w-full bg-[#020617]/90 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-0.5 shadow-lg shadow-blue-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#0F172A] rounded-[10px] flex items-center justify-center text-blue-400 font-bold text-lg">
              <Keyboard className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-blue-400 font-sans">
                {language === 'mr' ? 'मराठी टायपिंग ' : 'MARATHI TYPING '}<span className="text-white">{language === 'mr' ? 'मास्टर' : 'MASTER'}</span>
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 rounded shadow-sm">
                ISM / DVBW Remington
              </span>
            </div>
            <p className="text-[11px] text-slate-500 uppercase tracking-widest mt-0.5">
              {language === 'mr' 
                ? 'GCC-TBC व MPSC टंकलेखन परीक्षा तयारी' 
                : 'Interactive Devanagari DVBW Keyboard Tutor'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center bg-[#0F172A]/90 p-1 rounded-xl border border-slate-800 shadow-inner overflow-x-auto max-w-full">
          {modes.map(mode => {
            const isActive = currentMode === mode.id;
            return (
              <button
                key={mode.id}
                id={`nav-btn-${mode.id}`}
                onClick={() => {
                  sound.playKeyClick();
                  onSelectMode(mode.id);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {mode.icon}
                <span>{language === 'mr' ? mode.labelMr : mode.labelEn}</span>
              </button>
            );
          })}
        </nav>

        {/* Right utility buttons */}
        <div className="flex items-center gap-2">
          {/* Progress Pill */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#0F172A] border border-slate-800 rounded-lg text-xs text-slate-300">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{language === 'mr' ? 'सराव' : 'Progress'}</span>
            <span className="font-bold text-blue-400 font-mono">{completedCount}/{totalLessons}</span>
          </div>

          {/* Sound Toggle */}
          <button
            id="toggle-sound-btn"
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Sounds' : 'Enable Mechanical Sound Effects'}
            className={`p-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-[#0F172A] border-blue-500/40 text-blue-400 hover:bg-slate-800 shadow-sm shadow-blue-500/10'
                : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:text-slate-400'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Language Switcher */}
          <button
            id="toggle-lang-btn"
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0F172A] border border-slate-700 hover:border-blue-500/50 text-xs font-bold text-slate-200 transition-all cursor-pointer hover:text-blue-300"
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>{language === 'mr' ? 'English' : 'मराठी'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
