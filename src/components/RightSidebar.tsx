import React from 'react';
import { SidebarTab } from '../types';
import { 
  BookOpen, 
  RotateCcw, 
  Award, 
  FileText, 
  BarChart3, 
  Settings, 
  Info, 
  ChevronLeft,
  Keyboard,
  Sparkles
} from 'lucide-react';
import { sound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface RightSidebarProps {
  activeTab: SidebarTab;
  onSelectTab: (tab: SidebarTab) => void;
  language: 'mr' | 'en';
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  activeTab,
  onSelectTab,
  language
}) => {
  const { isDark } = useTheme();

  const tabs: { id: SidebarTab; labelEn: string; labelMr: string; icon: React.ReactNode }[] = [
    { id: 'course', labelEn: 'Course', labelMr: 'कोर्स (Course)', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'ai-passage', labelEn: 'AI Passages', labelMr: 'AI विषय परिच्छेद', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'review', labelEn: 'Review & AI', labelMr: 'पुनरावलोकन व AI', icon: <RotateCcw className="w-4 h-4" /> },
    { id: 'exam', labelEn: 'GCC-TBC Exam', labelMr: 'शासकीय परीक्षा (Exam)', icon: <Award className="w-4 h-4" /> },
    { id: 'custom', labelEn: 'Custom Practice', labelMr: 'स्वतःचा मजकूर', icon: <FileText className="w-4 h-4" /> },
    { id: 'analytics', labelEn: 'Statistics', labelMr: 'आकडेवारी (Stats)', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', labelEn: 'Settings', labelMr: 'सेटिंग्ज (Settings)', icon: <Settings className="w-4 h-4" /> },
    { id: 'info', labelEn: 'Information', labelMr: 'माहिती (Info)', icon: <Info className="w-4 h-4" /> },
  ];

  return (
    <aside 
      id="typingmaster-sidebar" 
      className={`w-full lg:w-56 shrink-0 flex flex-col justify-between backdrop-blur-md rounded-3xl p-3 sm:p-4 transition-all duration-200 ${
        isDark
          ? 'bg-[#072431]/95 border border-teal-800/40 shadow-2xl'
          : 'bg-white/95 border border-teal-200/80 shadow-xl shadow-teal-900/5'
      }`}
    >
      {/* Navigation Links */}
      <div className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`sidebar-tab-${tab.id}`}
              onClick={() => {
                sound.playKeyClick();
                onSelectTab(tab.id);
              }}
              className={`group flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? isDark
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-black shadow-lg shadow-teal-500/20 scale-[1.02]'
                    : 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-black shadow-lg shadow-teal-600/25 scale-[1.02]'
                  : isDark
                  ? 'text-slate-300 hover:text-cyan-300 hover:bg-teal-900/40'
                  : 'text-slate-600 hover:text-teal-800 hover:bg-teal-50/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? (isDark ? 'text-slate-950' : 'text-white') : (isDark ? 'text-teal-400 group-hover:text-cyan-300' : 'text-teal-600 group-hover:text-teal-800')}>
                  {tab.icon}
                </span>
                <span>{language === 'mr' ? tab.labelMr : tab.labelEn}</span>
              </div>
              {isActive && (
                <ChevronLeft className={`w-4 h-4 hidden lg:block ${isDark ? 'text-slate-950' : 'text-white'}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Unified Brand Badge */}
      <div className={`mt-4 pt-3 border-t hidden lg:flex items-center gap-2.5 px-2 ${isDark ? 'border-teal-800/40' : 'border-teal-100'}`}>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-400 to-cyan-500 p-0.5 shadow-md flex items-center justify-center shrink-0">
          <div className={`w-full h-full rounded-full flex items-center justify-center ${isDark ? 'bg-[#072431]' : 'bg-white'}`}>
            <Keyboard className={`w-4 h-4 ${isDark ? 'text-cyan-300' : 'text-teal-600'}`} />
          </div>
        </div>
        <div className="min-w-0">
          <div className={`text-xs font-black tracking-tight truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>
            TypingMaster
          </div>
          <div className={`text-[10px] font-mono truncate ${isDark ? 'text-teal-300' : 'text-teal-600 font-bold'}`}>
            Marathi Remington
          </div>
        </div>
      </div>
    </aside>
  );
};

