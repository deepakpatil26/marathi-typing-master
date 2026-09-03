import React from 'react';
import { Finger, KeyMapping } from '../types';
import { REMINGTON_KEYBOARD_LAYOUT, FINGER_COLORS } from '../data/remingtonMap';
import { useTheme } from '../context/ThemeContext';

interface VisualKeyboardProps {
  activeKeyCode: string | null;
  targetKeyInfo: { key: string; isShift: boolean; code: string; finger: Finger; hand: string } | null;
  pressedKeys: Set<string>;
  language: 'mr' | 'en';
}

export const VisualKeyboard: React.FC<VisualKeyboardProps> = ({
  targetKeyInfo,
  pressedKeys,
  language
}) => {
  const { isDark } = useTheme();

  // Determine if Shift is required and which shift key to highlight
  const isShiftRequired = targetKeyInfo?.isShift ?? false;
  // Ergonomic shift rule: If target key is typed with right hand, press Left Shift; if left hand, press Right Shift
  const highlightLeftShift = isShiftRequired && (targetKeyInfo?.hand === 'right' || targetKeyInfo?.hand === 'thumb');
  const highlightRightShift = isShiftRequired && targetKeyInfo?.hand === 'left';

  const renderKeyCap = (keyItem: KeyMapping) => {
    const isTarget = targetKeyInfo?.code === keyItem.code;
    const isCurrentlyPressed = pressedKeys.has(keyItem.code) || pressedKeys.has(keyItem.key.toLowerCase());
    const fingerStyle = FINGER_COLORS[keyItem.finger];

    return (
      <div
        key={keyItem.code}
        id={`key-${keyItem.code}`}
        className={`relative flex flex-col justify-between p-1.5 rounded-xl select-none transition-all duration-150 h-14 sm:h-16 border shadow-sm ${
          isTarget
            ? isDark
              ? 'bg-gradient-to-br from-teal-400 to-cyan-500 text-slate-950 border-cyan-200 ring-2 ring-cyan-300 scale-105 z-20 font-black shadow-[0_0_20px_rgba(45,212,191,0.5)]'
              : 'bg-gradient-to-br from-teal-500 to-cyan-600 text-white border-cyan-300 ring-2 ring-cyan-300 scale-105 z-20 font-black shadow-[0_0_20px_rgba(6,182,212,0.4)]'
            : isCurrentlyPressed
            ? isDark
              ? 'bg-cyan-600 text-white border-cyan-400 scale-95 z-10'
              : 'bg-teal-600 text-white border-teal-500 scale-95 z-10'
            : isDark
            ? 'bg-slate-800/90 hover:bg-slate-700/80 text-slate-200 border-slate-700/60'
            : 'bg-white hover:bg-teal-50/50 text-slate-800 border-slate-200 shadow-sm'
        } ${keyItem.row === 'home' ? (isDark ? 'border-b-2 border-b-teal-400/50' : 'border-b-2 border-b-teal-500') : ''}`}
        style={{ flex: 1, minWidth: '38px' }}
      >
        {/* Top bar: Physical QWERTY key & Shift character */}
        <div className="flex justify-between items-start w-full">
          <span className={`text-[10px] font-mono leading-none ${
            isTarget 
              ? (isDark ? 'text-slate-900 font-bold' : 'text-white/90 font-bold') 
              : (isDark ? 'text-slate-400' : 'text-slate-400')
          }`}>
            {keyItem.key.toUpperCase()}
          </span>
          <span className={`text-xs sm:text-sm font-semibold leading-none ${
            isTarget && targetKeyInfo?.isShift 
              ? isDark ? 'text-amber-950 font-black scale-110' : 'text-yellow-200 font-black scale-110' 
              : isTarget 
              ? isDark ? 'text-slate-900 opacity-90' : 'text-cyan-100 opacity-90' 
              : isDark ? 'text-cyan-400/90' : 'text-teal-600'
          }`}>
            {keyItem.shiftChar}
          </span>
        </div>

        {/* Main Devanagari Base Character */}
        <div className="flex items-center justify-center my-auto">
          <span className={`text-base sm:text-xl font-bold ${
            isTarget && !targetKeyInfo?.isShift
              ? isDark ? 'text-slate-950 scale-125' : 'text-white scale-125'
              : isTarget 
              ? isDark ? 'text-slate-900' : 'text-white' 
              : isDark ? 'text-slate-100' : 'text-slate-800'
          }`}>
            {keyItem.normalChar || keyItem.key}
          </span>
        </div>

        {/* Bottom Finger Indicator dot */}
        <div className="flex items-center justify-center">
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              isTarget ? (isDark ? 'bg-slate-950' : 'bg-white') : fingerStyle.text.replace('text-', 'bg-')
            }`}
            title={`${fingerStyle.nameMr} / ${fingerStyle.nameEn}`}
          />
        </div>
      </div>
    );
  };

  return (
    <div 
      id="remington-visual-keyboard" 
      className={`w-full rounded-3xl p-4 sm:p-6 backdrop-blur-md transition-all duration-200 ${
        isDark
          ? 'bg-[#072431]/95 border border-teal-800/40 shadow-2xl'
          : 'bg-white/95 border border-teal-200/80 shadow-xl shadow-teal-900/5'
      }`}
    >
      <div className={`flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b ${
        isDark ? 'border-teal-900/50' : 'border-teal-100'
      }`}>
        <div className="flex items-center gap-2">
          <div className={`px-2.5 py-1 rounded-lg border text-xs font-bold font-mono ${
            isDark 
              ? 'bg-teal-500/20 border-teal-500/40 text-teal-300' 
              : 'bg-teal-50 border-teal-200 text-teal-700'
          }`}>
            ISM DVBW Remington
          </div>
          <span className={`text-xs hidden sm:inline ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {language === 'mr' ? 'मराठी टंकलेखन कीबोर्ड मॅट्रिक्स' : 'Marathi Devanagari Keyboard Matrix'}
          </span>
        </div>

        {/* Legend */}
        <div className={`flex items-center gap-4 text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          <div className="flex items-center gap-1.5">
            <span className={`font-bold ${isDark ? 'text-cyan-400' : 'text-teal-600'}`}>Shift:</span>
            <span>{language === 'mr' ? 'वरचे अक्षर' : 'Top character'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Normal:</span>
            <span>{language === 'mr' ? 'मध्य अक्षरे' : 'Center character'}</span>
          </div>
        </div>
      </div>

      <div className="space-y-1.5 overflow-x-auto pb-1">
        {/* Row 1: Numbers */}
        <div className="flex gap-1.5 min-w-[650px]">
          {REMINGTON_KEYBOARD_LAYOUT[0].map(renderKeyCap)}
          <div className={`flex items-center justify-center px-3 h-14 sm:h-16 rounded-xl text-xs font-medium min-w-[65px] border ${
            isDark 
              ? 'bg-slate-800/80 border-slate-700/60 text-slate-400' 
              : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}>
            Backspace
          </div>
        </div>

        {/* Row 2: Upper Row */}
        <div className="flex gap-1.5 min-w-[650px]">
          <div className={`flex items-center justify-center px-3 h-14 sm:h-16 rounded-xl text-xs font-medium min-w-[55px] border ${
            isDark 
              ? 'bg-slate-800/80 border-slate-700/60 text-slate-400' 
              : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}>
            Tab
          </div>
          {REMINGTON_KEYBOARD_LAYOUT[1].map(renderKeyCap)}
        </div>

        {/* Row 3: Home Row */}
        <div className="flex gap-1.5 min-w-[650px]">
          <div className={`flex items-center justify-center px-3 h-14 sm:h-16 rounded-xl text-xs font-medium min-w-[65px] border ${
            isDark 
              ? 'bg-slate-800/80 border-slate-700/60 text-slate-400' 
              : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}>
            Caps
          </div>
          {REMINGTON_KEYBOARD_LAYOUT[2].map(renderKeyCap)}
          <div className={`flex items-center justify-center px-3 h-14 sm:h-16 rounded-xl text-xs font-medium min-w-[65px] border ${
            isDark 
              ? 'bg-slate-800/80 border-slate-700/60 text-slate-400' 
              : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}>
            Enter
          </div>
        </div>

        {/* Row 4: Lower Row */}
        <div className="flex gap-1.5 min-w-[650px]">
          {/* Left Shift */}
          <div
            id="key-ShiftLeft"
            className={`flex items-center justify-center px-3 h-14 sm:h-16 rounded-xl text-xs font-bold min-w-[80px] border transition-all duration-200 ${
              highlightLeftShift
                ? isDark
                  ? 'bg-gradient-to-br from-teal-400 to-cyan-500 text-slate-950 border-cyan-200 ring-2 ring-cyan-300 shadow-[0_0_20px_rgba(45,212,191,0.5)] animate-pulse'
                  : 'bg-gradient-to-br from-teal-500 to-cyan-600 text-white border-cyan-300 ring-2 ring-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] animate-pulse'
                : pressedKeys.has('ShiftLeft') || pressedKeys.has('shift')
                ? isDark ? 'bg-cyan-600 text-white border-cyan-400' : 'bg-teal-600 text-white border-teal-500'
                : isDark ? 'bg-slate-800/80 text-slate-400 border-slate-700/60' : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {highlightLeftShift ? 'Shift ⇧' : 'Shift'}
          </div>

          {REMINGTON_KEYBOARD_LAYOUT[3].map(renderKeyCap)}

          {/* Right Shift */}
          <div
            id="key-ShiftRight"
            className={`flex items-center justify-center px-3 h-14 sm:h-16 rounded-xl text-xs font-bold min-w-[80px] border transition-all duration-200 ${
              highlightRightShift
                ? isDark
                  ? 'bg-gradient-to-br from-teal-400 to-cyan-500 text-slate-950 border-cyan-200 ring-2 ring-cyan-300 shadow-[0_0_20px_rgba(45,212,191,0.5)] animate-pulse'
                  : 'bg-gradient-to-br from-teal-500 to-cyan-600 text-white border-cyan-300 ring-2 ring-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] animate-pulse'
                : pressedKeys.has('ShiftRight')
                ? isDark ? 'bg-cyan-600 text-white border-cyan-400' : 'bg-teal-600 text-white border-teal-500'
                : isDark ? 'bg-slate-800/80 text-slate-400 border-slate-700/60' : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {highlightRightShift ? 'Shift ⇧' : 'Shift'}
          </div>
        </div>

        {/* Row 5: Space Row */}
        <div className="flex gap-1.5 min-w-[650px]">
          <div className={`flex items-center justify-center px-3 h-12 rounded-xl text-xs min-w-[50px] border ${
            isDark ? 'bg-slate-800/80 border-slate-700/60 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}>
            Ctrl
          </div>
          <div className={`flex items-center justify-center px-3 h-12 rounded-xl text-xs min-w-[50px] border ${
            isDark ? 'bg-slate-800/80 border-slate-700/60 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}>
            Alt
          </div>

          {/* Spacebar */}
          <div
            id="key-Space"
            className={`flex items-center justify-center flex-1 h-12 rounded-xl border text-xs font-bold tracking-wider select-none transition-all duration-150 ${
              targetKeyInfo?.code === 'Space'
                ? isDark
                  ? 'bg-gradient-to-br from-teal-400 to-cyan-500 text-slate-950 border-cyan-200 ring-2 ring-cyan-300 shadow-[0_0_20px_rgba(45,212,191,0.5)] animate-pulse'
                  : 'bg-gradient-to-br from-teal-500 to-cyan-600 text-white border-cyan-300 ring-2 ring-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] animate-pulse'
                : pressedKeys.has('Space') || pressedKeys.has(' ')
                ? isDark ? 'bg-cyan-600 text-white border-cyan-400 scale-98' : 'bg-teal-600 text-white border-teal-500 scale-98'
                : isDark ? 'bg-slate-800/90 text-slate-300 border-slate-700/60 hover:border-slate-500' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-sm'
            }`}
          >
            {language === 'mr' ? 'स्पेसबार (Spacebar)' : 'Spacebar'}
          </div>

          <div className={`flex items-center justify-center px-3 h-12 rounded-xl text-xs min-w-[50px] border ${
            isDark ? 'bg-slate-800/80 border-slate-700/60 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}>
            Alt Gr
          </div>
          <div className={`flex items-center justify-center px-3 h-12 rounded-xl text-xs min-w-[50px] border ${
            isDark ? 'bg-slate-800/80 border-slate-700/60 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}>
            Ctrl
          </div>
        </div>
      </div>
    </div>
  );
};

