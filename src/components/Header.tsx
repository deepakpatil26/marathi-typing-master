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
import { useTheme } from '../context/ThemeContext';

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
  const { isDark } = useTheme();

  const modes: { id: AppMode; labelEn: string; labelMr: string; icon: React.ReactNode }[] = [
    { id: 'lessons', labelEn: 'Lessons', labelMr: 'धडे व सराव', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'exam', labelEn: 'GCC-TBC Exam', labelMr: 'परीक्षा मोड (Exam)', icon: <Award className="w-4 h-4" /> },
    { id: 'custom', labelEn: 'Custom Text', labelMr: 'स्वतःचा मजकूर', icon: <FileText className="w-4 h-4" /> },
    { id: 'analytics', labelEn: 'Analytics', labelMr: 'प्रगती व विश्लेषण', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <header id="app-header" className={`w-full sticky top-0 z-40 backdrop-blur-xl border-b transition-colors ${
      isDark 
        ? 'bg-[#020617]/90 border-slate-800' 
        : 'bg-white/90 border-slate-200 shadow-xs'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 p-0.5 shadow-lg shadow-teal-500/20 flex items-center justify-center">
            <div className={`w-full h-full rounded-[10px] flex items-center justify-center font-bold text-lg ${
              isDark ? 'bg-[#0F172A] text-teal-400' : 'bg-white text-teal-700'
            }`}>
              <Keyboard className="w-5 h-5 text-teal-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight font-sans">
                <span className={isDark ? 'text-teal-400' : 'text-teal-700'}>
                  {language === 'mr' ? 'मराठी टायपिंग ' : 'MARATHI TYPING '}
                </span>
                <span className={isDark ? 'text-white' : 'text-slate-900'}>
                  {language === 'mr' ? 'मास्टर' : 'MASTER'}
                </span>
              </h1>
              <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded shadow-xs border ${
                isDark 
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/40' 
                  : 'bg-teal-50 text-teal-800 border-teal-200'
              }`}>
                ISM / DVBW Remington
              </span>
            </div>
            <p className={`text-[11px] uppercase tracking-widest mt-0.5 font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {language === 'mr' 
                ? 'GCC-TBC व MPSC टंकलेखन परीक्षा तयारी' 
                : 'Interactive Devanagari DVBW Keyboard Tutor'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className={`flex items-center p-1 rounded-xl border shadow-inner overflow-x-auto max-w-full ${
          isDark ? 'bg-[#0F172A]/90 border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}>
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
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-500/30 font-bold'
                    : isDark 
                      ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
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
          <div className={`hidden lg:flex items-center gap-2 px-3 py-1.5 border rounded-lg text-xs ${
            isDark ? 'bg-[#0F172A] border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
          }`}>
            <span className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {language === 'mr' ? 'सराव' : 'Progress'}
            </span>
            <span className={`font-bold font-mono ${isDark ? 'text-teal-400' : 'text-teal-700'}`}>
              {completedCount}/{totalLessons}
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            id="toggle-sound-btn"
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Sounds' : 'Enable Mechanical Sound Effects'}
            className={`p-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              soundEnabled
                ? isDark 
                  ? 'bg-[#0F172A] border-teal-500/40 text-teal-400 hover:bg-slate-800 shadow-sm shadow-teal-500/10' 
                  : 'bg-teal-50 border-teal-300 text-teal-700 hover:bg-teal-100'
                : isDark 
                  ? 'bg-slate-900/50 border-slate-800 text-slate-500 hover:text-slate-300' 
                  : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-700'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Language Switcher */}
          <button
            id="toggle-lang-btn"
            onClick={onToggleLanguage}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
              isDark 
                ? 'bg-[#0F172A] border-slate-700 hover:border-teal-500/50 text-slate-200 hover:text-teal-300' 
                : 'bg-slate-100 border-slate-300 hover:border-teal-500 text-slate-800 hover:text-teal-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-teal-500" />
            <span>{language === 'mr' ? 'English' : 'मराठी'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
