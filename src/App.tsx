import React, { useState, useEffect, useCallback } from 'react';
import { SidebarTab, Finger, LessonStep, UserProgress } from './types';
import { CURRICULUM_CHAPTERS } from './data/curriculum';
import { getStoredUserProgress } from './utils/telemetry';
import { sound } from './utils/audio';
import { useTheme } from './context/ThemeContext';
import { RightSidebar } from './components/RightSidebar';
import { CourseHub } from './components/CourseHub';
import { TypingArea } from './components/TypingArea';
import { VisualKeyboard } from './components/VisualKeyboard';
import { ExamMode } from './components/ExamMode';
import { CustomTextPractice } from './components/CustomTextPractice';
import { AIPassageGenerator } from './components/AIPassageGenerator';
import { AnalyticsView } from './components/AnalyticsView';
import { ReviewView } from './components/ReviewView';
import { SettingsView } from './components/SettingsView';
import { InfoView } from './components/InfoView';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';
import { StudentProfileModal } from './components/StudentProfileModal';
import { getActiveProfile, updateActiveProfileProgress } from './utils/studentProfiles';
import { StudentProfile } from './types';
import { OfficialWebsite } from './components/OfficialWebsite';
import { ArrowLeft, X, Keyboard, Globe, Volume2, VolumeX, Sun, Moon, Users } from 'lucide-react';

export default function App() {
  const { theme, isDark, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<SidebarTab>('course');
  const [language, setLanguage] = useState<'mr' | 'en'>('mr');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // View Mode: 'software' by default since user has software installed; 'website' if explicitly requested via ?mode=website
  const [viewMode, setViewMode] = useState<'website' | 'software'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'website') {
        return 'website';
      }
      return 'software';
    }
    return 'software';
  });

  useEffect(() => {
    const checkLocation = () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get('app') === 'true' || params.get('mode') === 'app' || window.location.hash === '#app') {
        setViewMode('software');
      }
    };
    window.addEventListener('popstate', checkLocation);
    window.addEventListener('hashchange', checkLocation);
    return () => {
      window.removeEventListener('popstate', checkLocation);
      window.removeEventListener('hashchange', checkLocation);
    };
  }, []);

  // Student Profile state
  const [activeStudent, setActiveStudent] = useState<StudentProfile>(getActiveProfile);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState<boolean>(false);

  // Progress (seeded from active student profile or fallback)
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const prof = getActiveProfile();
    return prof.progress || getStoredUserProgress();
  });

  // Keep active student progress in sync whenever userProgress changes
  useEffect(() => {
    updateActiveProfileProgress(userProgress);
  }, [userProgress]);

  const handleProfileSwitched = (newProfile: StudentProfile) => {
    setActiveStudent(newProfile);
    setUserProgress(newProfile.progress || getStoredUserProgress());
  };


  // Selected Chapter in Hub
  const [selectedChapterId, setSelectedChapterId] = useState<number>(CURRICULUM_CHAPTERS[0].id);

  // Active Lesson
  const [activeLesson, setActiveLesson] = useState<LessonStep>(CURRICULUM_CHAPTERS[0].lessons[0]);
  const [isPracticing, setIsPracticing] = useState<boolean>(false);

  // Target Key and Active Key Tracking for Virtual Keyboard
  const [activeTargetKeyInfo, setActiveTargetKeyInfo] = useState<{
    key: string;
    isShift: boolean;
    code: string;
    finger: Finger;
    hand: string;
  } | null>(null);

  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    sound.setEnabled(nextState);
    if (nextState) {
      sound.playKeyClick();
    }
  };

  const handleToggleLanguage = () => {
    sound.playKeyClick();
    setLanguage(prev => (prev === 'mr' ? 'en' : 'mr'));
  };

  // Find next lesson
  const handleNextLesson = useCallback(() => {
    let allLessons: LessonStep[] = [];
    CURRICULUM_CHAPTERS.forEach(chap => {
      allLessons = [...allLessons, ...chap.lessons];
    });

    const currIdx = allLessons.findIndex(l => l.id === activeLesson.id);
    if (currIdx >= 0 && currIdx < allLessons.length - 1) {
      const nextLes = allLessons[currIdx + 1];
      setActiveLesson(nextLes);
      // Also update selected chapter
      const parentChap = CURRICULUM_CHAPTERS.find(c => c.lessons.some(l => l.id === nextLes.id));
      if (parentChap) {
        setSelectedChapterId(parentChap.id);
      }
    } else {
      setIsPracticing(false);
      setActiveTab('exam');
    }
  }, [activeLesson.id]);

  const handleStartLesson = (lesson: LessonStep) => {
    setActiveLesson(lesson);
    const parentChap = CURRICULUM_CHAPTERS.find(c => c.lessons.some(l => l.id === lesson.id));
    if (parentChap) {
      setSelectedChapterId(parentChap.id);
    }
    setIsPracticing(true);
  };

  // Weak drill starter from Analytics or Review
  const handleStartWeakDrill = (customLesson: LessonStep) => {
    setActiveLesson(customLesson);
    setIsPracticing(true);
    setActiveTab('course');
  };

  // If viewMode is 'website', display the official software product website
  if (viewMode === 'website') {
    return (
      <OfficialWebsite
        onLaunchSoftware={() => {
          setViewMode('software');
          if (typeof window !== 'undefined' && window.history && window.history.pushState) {
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.set('app', 'true');
            window.history.pushState({}, '', newUrl.toString());
          }
        }}
        language={language}
        onToggleLanguage={handleToggleLanguage}
      />
    );
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isDark 
        ? 'bg-gradient-to-br from-[#021822] via-[#041F2C] to-[#010D13] text-slate-100 selection:bg-teal-500 selection:text-slate-950'
        : 'bg-gradient-to-br from-[#F0F9FF] via-[#F8FAFC] to-[#E0F2FE] text-slate-800 selection:bg-sky-500 selection:text-white'
    }`}>
      {/* Top Application Bar */}
      <header className={`w-full backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40 transition-colors duration-200 ${
        isDark 
          ? 'bg-[#03151E]/90 border-b border-teal-900/50' 
          : 'bg-white/90 border-b border-teal-200/80 shadow-sm'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 p-0.5 shadow-md shadow-teal-500/10 flex items-center justify-center">
            <div className={`w-full h-full rounded-[10px] flex items-center justify-center font-black text-base ${
              isDark ? 'bg-[#03151E] text-cyan-300' : 'bg-white text-teal-600'
            }`}>
              <Keyboard className={`w-5 h-5 ${isDark ? 'text-cyan-300' : 'text-teal-600'}`} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`font-black text-sm sm:text-base tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {language === 'mr' ? 'मराठी टायपिंग ' : 'MARATHI TYPING '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-500">{language === 'mr' ? 'मास्टर' : 'MASTER'}</span>
              </h1>
              <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-lg border ${
                isDark 
                  ? 'bg-teal-500/10 text-teal-300 border-teal-500/30' 
                  : 'bg-teal-50 text-teal-700 border-teal-200'
              }`}>
                ISM DVBW
              </span>
            </div>
          </div>
        </div>

        {/* Header Right Action Buttons: Student Profile + PWA Install + Theme Toggle + Sound + Language */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Active Student Profile Selector Button */}
          <button
            id="btn-student-profile-switcher"
            onClick={() => setIsStudentModalOpen(true)}
            title={language === 'mr' ? 'विद्यार्थी प्रोफाइल बदला / व्यवस्थापित करा' : 'Switch / Manage Student Profiles'}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-sm ${
              isDark
                ? 'bg-[#0B2E3F] hover:bg-[#0E3549] border-teal-700/60 text-cyan-300'
                : 'bg-teal-50 hover:bg-teal-100 border-teal-300 text-teal-900'
            }`}
          >
            <div className="w-5 h-5 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
            <div className="text-left hidden md:block leading-tight">
              <span className="block text-[11px] font-black truncate max-w-[110px]">{activeStudent.name}</span>
              <span className="block text-[9px] opacity-75 font-mono truncate max-w-[110px]">{activeStudent.batchOrRoll || 'तुकडी अ'}</span>
            </div>
          </button>

          {/* Dark / Light Mode Toggle Button */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            title={
              language === 'mr' 
                ? (isDark ? 'लाईट मोड सुरू करा (Light Mode)' : 'डार्क मोड सुरू करा (Dark Mode)')
                : (isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode')
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-sm ${
              isDark 
                ? 'bg-[#061F2C] border-teal-900/60 text-amber-300 hover:text-amber-200 hover:border-amber-400/40 hover:bg-teal-950/60' 
                : 'bg-white border-teal-200 text-slate-700 hover:text-teal-700 hover:border-teal-300 hover:bg-teal-50/70'
            }`}
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="hidden sm:inline text-slate-300 text-[11px] font-semibold">{language === 'mr' ? 'लाईट' : 'Light'}</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-teal-600" />
                <span className="hidden sm:inline text-slate-700 text-[11px] font-semibold">{language === 'mr' ? 'डार्क' : 'Dark'}</span>
              </>
            )}
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            title={soundEnabled ? 'Mute' : 'Unmute'}
            className={`p-2 rounded-xl border text-xs transition-all cursor-pointer shadow-sm ${
              isDark 
                ? 'bg-[#061F2C] border-teal-900/60 text-slate-300 hover:text-cyan-300 hover:border-teal-700/60' 
                : 'bg-white border-teal-200 text-slate-600 hover:text-teal-700 hover:border-teal-300 hover:bg-teal-50/70'
            }`}
          >
            {soundEnabled ? (
              <Volume2 className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-teal-600'}`} />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {/* Language Switcher */}
          <button
            onClick={handleToggleLanguage}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-sm ${
              isDark 
                ? 'bg-[#061F2C] border-teal-900/60 text-slate-200 hover:text-cyan-300 hover:border-teal-700/60' 
                : 'bg-white border-teal-200 text-slate-700 hover:text-teal-700 hover:border-teal-300 hover:bg-teal-50/70'
            }`}
          >
            <Globe className={`w-3.5 h-3.5 ${isDark ? 'text-teal-400' : 'text-teal-600'}`} />
            <span>{language === 'mr' ? 'English' : 'मराठी'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area with Right Sidebar Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col lg:flex-row gap-6 items-start">
        {/* Left/Center Stage */}
        <div className="flex-1 w-full min-w-0 flex flex-col justify-start">
          {/* 1. Course Tab */}
          {activeTab === 'course' && (
            <>
              {!isPracticing ? (
                /* Course Hub / Overview */
                <CourseHub
                  chapters={CURRICULUM_CHAPTERS}
                  selectedChapterId={selectedChapterId}
                  onSelectChapterId={setSelectedChapterId}
                  onStartLesson={handleStartLesson}
                  userProgress={userProgress}
                  language={language}
                />
              ) : (
                /* Active Practice Stage */
                <div className="flex flex-col gap-4">
                  {/* Practice Stage Header with Close / Back Button */}
                  <div className={`rounded-2xl px-5 py-3 flex items-center justify-between shadow-lg backdrop-blur-md border ${
                    isDark 
                      ? 'bg-[#072431]/95 border-teal-800/40' 
                      : 'bg-white/95 border-teal-200/80 shadow-teal-900/5'
                  }`}>
                    <button
                      onClick={() => {
                        sound.playKeyClick();
                        setIsPracticing(false);
                      }}
                      className={`flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm border ${
                        isDark 
                          ? 'text-slate-200 hover:text-white bg-[#0B2E3F] hover:bg-[#0E3549] border-teal-700/50' 
                          : 'text-teal-900 hover:text-teal-950 bg-teal-50 hover:bg-teal-100 border-teal-200'
                      }`}
                    >
                      <ArrowLeft className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-teal-600'}`} />
                      <span>{language === 'mr' ? 'कोर्सकडे परत (Back to Course)' : 'Back to Lessons'}</span>
                    </button>

                    <button
                      onClick={() => {
                        sound.playKeyClick();
                        setIsPracticing(false);
                      }}
                      title="Close"
                      className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                        isDark 
                          ? 'bg-[#0B2E3F] hover:bg-rose-950/60 hover:text-rose-400 text-slate-400 border-teal-800/40' 
                          : 'bg-slate-100 hover:bg-rose-100 hover:text-rose-600 text-slate-600 border-slate-200'
                      }`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Core Typing Arena */}
                  <TypingArea
                    lesson={activeLesson}
                    onNextLesson={handleNextLesson}
                    userProgress={userProgress}
                    setUserProgress={setUserProgress}
                    language={language}
                    onActiveTargetChange={setActiveTargetKeyInfo}
                    onKeyPressedChange={setPressedKeys}
                  />

                  {/* Interactive Virtual Remington Keyboard */}
                  <VisualKeyboard
                    activeKeyCode={activeTargetKeyInfo?.code || null}
                    targetKeyInfo={activeTargetKeyInfo}
                    pressedKeys={pressedKeys}
                    language={language}
                  />
                </div>
              )}
            </>
          )}

          {/* 1.5. AI Domain Passages Tab */}
          {activeTab === 'ai-passage' && (
            <AIPassageGenerator
              language={language}
              onStartPractice={(drillLesson) => {
                setActiveLesson(drillLesson);
                setIsPracticing(true);
                setActiveTab('course');
              }}
            />
          )}

          {/* 2. Review Tab */}
          {activeTab === 'review' && (
            <ReviewView
              userProgress={userProgress}
              language={language}
              onStartCustomDrill={handleStartWeakDrill}
            />
          )}

          {/* 3. Exam Mode Tab */}
          {activeTab === 'exam' && (
            <div className="flex flex-col gap-5">
              <ExamMode
                language={language}
                onActiveTargetChange={setActiveTargetKeyInfo}
                onKeyPressedChange={setPressedKeys}
              />

              <VisualKeyboard
                activeKeyCode={activeTargetKeyInfo?.code || null}
                targetKeyInfo={activeTargetKeyInfo}
                pressedKeys={pressedKeys}
                language={language}
              />
            </div>
          )}

          {/* 4. Custom Practice Tab */}
          {activeTab === 'custom' && (
            <div className="flex flex-col gap-5">
              <CustomTextPractice
                userProgress={userProgress}
                setUserProgress={setUserProgress}
                language={language}
                onActiveTargetChange={setActiveTargetKeyInfo}
                onKeyPressedChange={setPressedKeys}
              />

              <VisualKeyboard
                activeKeyCode={activeTargetKeyInfo?.code || null}
                targetKeyInfo={activeTargetKeyInfo}
                pressedKeys={pressedKeys}
                language={language}
              />
            </div>
          )}

          {/* 5. Statistics / Analytics Tab */}
          {activeTab === 'analytics' && (
            <AnalyticsView
              userProgress={userProgress}
              setUserProgress={setUserProgress}
              language={language}
              onStartWeakDrill={handleStartWeakDrill}
            />
          )}

          {/* 6. Settings Tab */}
          {activeTab === 'settings' && (
            <SettingsView
              language={language}
              onToggleLanguage={handleToggleLanguage}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
              setUserProgress={setUserProgress}
            />
          )}

          {/* 7. Information Tab */}
          {activeTab === 'info' && (
            <InfoView language={language} />
          )}
        </div>

        {/* Right Navigation Panel */}
        <RightSidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'course') {
              setIsPracticing(false);
            }
          }}
          language={language}
        />
      </main>

      {/* Subtle Footer */}
      <footer className={`w-full border-t py-3.5 transition-colors duration-200 ${
        isDark 
          ? 'border-teal-900/40 bg-[#021118]/90 text-slate-400' 
          : 'border-teal-200/80 bg-white/90 text-slate-600 shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <span>© 2026 Marathi Typing Master • ISM DVBW Remington Layout</span>
          <span className={isDark ? 'text-teal-400/80 font-medium' : 'text-teal-700 font-semibold'}>
            GCC-TBC 30/40 WPM & MPSC Computer Typing Test
          </span>
        </div>
      </footer>

      {/* Offline Status Badge */}
      <OfflineIndicator language={language} />

      {/* Multi-Student Profile Manager Modal */}
      <StudentProfileModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        language={language}
        onProfileSwitched={handleProfileSwitched}
      />
    </div>
  );
}

