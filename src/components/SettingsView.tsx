import React, { useState } from 'react';
import { Volume2, VolumeX, Globe, Trash2, CheckCircle2, Moon, Sun } from 'lucide-react';
import { USER_PROGRESS_STORAGE_KEY } from '../utils/telemetry';
import { UserProgress } from '../types';
import { sound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface SettingsViewProps {
  language: 'mr' | 'en';
  onToggleLanguage: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  setUserProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  language,
  onToggleLanguage,
  soundEnabled,
  onToggleSound,
  setUserProgress
}) => {
  const { theme, isDark, setTheme } = useTheme();
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleResetProgress = () => {
    sound.playErrorSound();
    localStorage.removeItem(USER_PROGRESS_STORAGE_KEY);
    setUserProgress({
      completedLessons: {},
      totalPracticeTimeSeconds: 0,
      overallAccuracy: 100,
      weakCharacters: {}
    });
    setShowConfirmReset(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  return (
    <div 
      id="settings-view" 
      className={`w-full min-w-0 max-w-3xl mx-auto rounded-3xl p-6 sm:p-8 backdrop-blur-md flex flex-col gap-6 transition-all duration-200 ${
        isDark
          ? 'bg-[#072431]/95 border border-teal-800/40 shadow-2xl'
          : 'bg-white/95 border border-teal-200/80 shadow-xl shadow-teal-900/5'
      }`}
    >
      <div className={`pb-4 border-b ${isDark ? 'border-teal-900/50' : 'border-teal-100'}`}>
        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {language === 'mr' ? 'सेटिंग्ज व प्राधान्ये (Settings)' : 'Application Settings'}
        </h2>
        <p className={`text-xs mt-1 ${isDark ? 'text-cyan-200/70' : 'text-slate-500'}`}>
          {language === 'mr' ? 'थीम, टंकलेखन सराव आणि आवाज प्राधान्ये बदला' : 'Customize theme appearance, sound effects, language interface and storage preferences.'}
        </p>
      </div>

      <div className="space-y-4">
        {/* Theme Appearance Mode */}
        <div className={`rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border transition-all ${
          isDark 
            ? 'bg-[#051C27]/90 border-teal-900/60' 
            : 'bg-slate-50 border-teal-100'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              isDark 
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                : 'bg-teal-500/10 text-teal-600 border-teal-500/30'
            }`}>
              {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-500" />}
            </div>
            <div>
              <div className={`text-sm font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                {language === 'mr' ? 'रंगसंगती व थीम (Theme Mode)' : 'Appearance Theme'}
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {language === 'mr' ? 'डार्क (रात्रीसाठी सुरक्षित) किंवा लाईट (उजेडासाठी स्वच्छ)' : 'Deep Ocean Teal (Dark) or Crisp Daylight (Light) mode.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-black border-cyan-400 shadow-md shadow-teal-500/20'
                  : isDark 
                  ? 'bg-[#0B2A3A] text-slate-300 border-teal-800/60 hover:bg-[#0E3549]' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>{language === 'mr' ? 'डार्क (Dark)' : 'Dark'}</span>
            </button>

            <button
              onClick={() => setTheme('light')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                theme === 'light'
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-black border-cyan-400 shadow-md shadow-teal-600/20'
                  : isDark 
                  ? 'bg-[#0B2A3A] text-slate-300 border-teal-800/60 hover:bg-[#0E3549]' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === 'mr' ? 'लाईट (Light)' : 'Light'}</span>
            </button>
          </div>
        </div>

        {/* Audio Toggle */}
        <div className={`rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 border transition-all ${
          isDark 
            ? 'bg-[#051C27]/90 border-teal-900/60' 
            : 'bg-slate-50 border-teal-100'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              isDark 
                ? 'bg-teal-500/10 text-teal-400 border-teal-500/30' 
                : 'bg-teal-50 text-teal-600 border-teal-200'
            }`}>
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </div>
            <div>
              <div className={`text-sm font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                {language === 'mr' ? 'कीबोर्ड मेकॅनिकल आवाज (Keyboard Sound)' : 'Mechanical Typing Audio'}
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {language === 'mr' ? 'प्रत्येक अचूक व चुकीच्या कीस्ट्रोकसाठी ध्वनी प्रभाव' : 'Keypress click feedback and error cues.'}
              </p>
            </div>
          </div>

          <button
            onClick={onToggleSound}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              soundEnabled
                ? isDark
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-black shadow-md shadow-teal-500/20'
                  : 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-black shadow-md shadow-teal-600/20'
                : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'
            }`}
          >
            {soundEnabled ? (language === 'mr' ? 'सुरू (On)' : 'Enabled') : (language === 'mr' ? 'बंद (Off)' : 'Disabled')}
          </button>
        </div>

        {/* Language Selection */}
        <div className={`rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 border transition-all ${
          isDark 
            ? 'bg-[#051C27]/90 border-teal-900/60' 
            : 'bg-slate-50 border-teal-100'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              isDark 
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' 
                : 'bg-sky-50 text-sky-600 border-sky-200'
            }`}>
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className={`text-sm font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                {language === 'mr' ? 'इंटरफेस भाषा (Display Language)' : 'Interface Language'}
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {language === 'mr' ? 'मराठी किंवा इंग्रजी भाषा निवडा' : 'Switch UI text between Marathi and English.'}
              </p>
            </div>
          </div>

          <button
            onClick={onToggleLanguage}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              isDark 
                ? 'bg-[#0B2A3A] hover:bg-[#0E3549] text-cyan-300 border-teal-700/60' 
                : 'bg-white hover:bg-teal-50 text-teal-800 border-teal-200 shadow-sm'
            }`}
          >
            {language === 'mr' ? 'मराठी (Active)' : 'English (Active)'}
          </button>
        </div>

        {/* Reset Progress */}
        <div className={`rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border transition-all ${
          isDark 
            ? 'bg-[#051C27]/90 border-teal-900/60' 
            : 'bg-slate-50 border-teal-100'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              isDark 
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                : 'bg-rose-50 text-rose-600 border-rose-200'
            }`}>
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <div className={`text-sm font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                {language === 'mr' ? 'सराव आकडेवारी रिसेट करा' : 'Reset Practice Data'}
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {language === 'mr' ? 'सर्व पूर्ण झालेले धडे आणि गुणांकन शून्य करा' : 'Clear all completed lesson stats and error history.'}
              </p>
            </div>
          </div>

          {showConfirmReset ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetProgress}
                className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 cursor-pointer shadow-md"
              >
                {language === 'mr' ? 'हो, रिसेट करा' : 'Yes, Delete'}
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer border ${
                  isDark 
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700' 
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300 border-slate-300'
                }`}
              >
                {language === 'mr' ? 'रद्द करा' : 'Cancel'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmReset(true)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                isDark 
                  ? 'bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 border-rose-800/60' 
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200'
              }`}
            >
              {language === 'mr' ? 'डेटा रीसेट' : 'Reset History'}
            </button>
          )}
        </div>

        {resetSuccess && (
          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
            isDark 
              ? 'bg-teal-950/80 border-teal-500/50 text-teal-300' 
              : 'bg-teal-50 border-teal-300 text-teal-800'
          }`}>
            <CheckCircle2 className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-teal-600'}`} />
            <span>{language === 'mr' ? 'सर्व प्रगती यशस्वीरीत्या रिसेट केली गेली आहे.' : 'Practice progress has been successfully reset.'}</span>
          </div>
        )}
      </div>
    </div>
  );
};

