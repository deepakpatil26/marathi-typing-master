import React from 'react';
import { Chapter, LessonStep, UserProgress } from '../types';
import { 
  Circle, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Check, 
  Layers,
  Sparkles,
  Type,
  FileText,
  MessageSquare,
  BookOpen
} from 'lucide-react';
import { sound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface CourseHubProps {
  chapters: Chapter[];
  selectedChapterId: number;
  onSelectChapterId: (id: number) => void;
  onStartLesson: (lesson: LessonStep) => void;
  userProgress: UserProgress;
  language: 'mr' | 'en';
}

export const CourseHub: React.FC<CourseHubProps> = ({
  chapters,
  selectedChapterId,
  onSelectChapterId,
  onStartLesson,
  userProgress,
  language
}) => {
  const { isDark } = useTheme();
  const currentChapter = chapters.find(c => c.id === selectedChapterId) || chapters[0];
  const currentChapterIdx = chapters.findIndex(c => c.id === selectedChapterId);

  const prevChapter = currentChapterIdx > 0 ? chapters[currentChapterIdx - 1] : null;
  const nextChapter = currentChapterIdx < chapters.length - 1 ? chapters[currentChapterIdx + 1] : null;

  // Calculate stats
  const totalLessons = chapters.reduce((acc, c) => acc + c.lessons.length, 0);
  const completedLessons = Object.keys(userProgress.completedLessons).length;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Find the next incomplete lesson to recommend for "Start Next Lesson"
  let nextLessonToPractice = currentChapter.lessons[0];
  for (const chap of chapters) {
    for (const les of chap.lessons) {
      if (!userProgress.completedLessons[les.id]) {
        nextLessonToPractice = les;
        break;
      }
    }
  }

  const getDrillBadge = (drillIdx: number) => {
    switch (drillIdx) {
      case 0:
        return {
          icon: <Type className="w-3 h-3 text-cyan-500" />,
          labelMr: 'अक्षरे सराव',
          labelEn: 'Keys Drill',
          color: isDark ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' : 'bg-cyan-50 text-cyan-700 border-cyan-200'
        };
      case 1:
        return {
          icon: <FileText className="w-3 h-3 text-teal-500" />,
          labelMr: 'शब्द सराव',
          labelEn: 'Words Drill',
          color: isDark ? 'bg-teal-500/10 text-teal-300 border-teal-500/30' : 'bg-teal-50 text-teal-700 border-teal-200'
        };
      case 2:
        return {
          icon: <MessageSquare className="w-3 h-3 text-sky-500" />,
          labelMr: 'वाक्य सराव',
          labelEn: 'Sentences Drill',
          color: isDark ? 'bg-sky-500/10 text-sky-300 border-sky-500/30' : 'bg-sky-50 text-sky-700 border-sky-200'
        };
      case 3:
      default:
        return {
          icon: <BookOpen className="w-3 h-3 text-cyan-500" />,
          labelMr: 'परिच्छेद सराव',
          labelEn: 'Paragraph Drill',
          color: isDark ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30' : 'bg-cyan-50 text-cyan-700 border-cyan-200'
        };
    }
  };

  const getLessonVarietyBadge = (lesson: LessonStep) => {
    if (lesson.drillType === 'words') {
      return language === 'mr' ? '२, ३, ४-अक्षरी विविधता' : '2, 3, 4-Letter Variety';
    }
    if (lesson.drillType === 'sentences') {
      return language === 'mr' ? 'सोपे, मध्यम, कठीण संच' : 'Easy, Med, Hard Lots';
    }
    if (lesson.drillType === 'paragraph') {
      return language === 'mr' ? '३+ सलग परिच्छेद संच' : '3+ Passage Lots';
    }
    return language === 'mr' ? '४ सराव संच' : '4 Drill Lots';
  };

  return (
    <div 
      id="course-hub-card" 
      className={`w-full rounded-3xl border shadow-2xl backdrop-blur-md overflow-hidden flex flex-col justify-between transition-all duration-200 ${
        isDark
          ? 'bg-[#072431]/95 text-slate-100 border-teal-800/40'
          : 'bg-white/95 text-slate-800 border-teal-200/80 shadow-teal-900/5'
      }`}
      style={{ minHeight: '520px' }}
    >
      {/* Top Banner Bar */}
      <div className={`px-5 sm:px-6 py-3.5 flex items-center justify-between border-b transition-colors ${
        isDark 
          ? 'bg-[#0B2E3F]/80 border-teal-800/40' 
          : 'bg-teal-50/70 border-teal-100'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg border ${
            isDark 
              ? 'bg-teal-500/10 border-teal-500/30 text-teal-400' 
              : 'bg-teal-100 border-teal-200 text-teal-700'
          }`}>
            <Layers className="w-4 h-4" />
          </div>
          <h2 className={`text-base sm:text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {language === 'mr' ? 'मराठी टंकलेखन कोर्स (TypingMaster Pattern)' : 'Touch Typing Course: Marathi Remington'}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-semibold ${
            isDark 
              ? 'bg-teal-950/60 border-teal-700/40 text-teal-300' 
              : 'bg-white border-teal-200 text-teal-800 shadow-sm'
          }`}>
            <Sparkles className={`w-3.5 h-3.5 ${isDark ? 'text-cyan-400' : 'text-teal-600'}`} />
            <span>अक्षरे → शब्द → वाक्ये → परिच्छेद</span>
          </div>
        </div>
      </div>

      {/* Chapter Number Strip - Compact & Tightly Spaced */}
      <div className="px-5 sm:px-8 pt-4 pb-2">
        <div className={`flex items-center justify-center pb-3.5 overflow-x-auto border-b ${
          isDark ? 'border-teal-900/50' : 'border-teal-100'
        }`}>
          <div className={`flex items-center gap-1.5 p-1 rounded-2xl border ${
            isDark ? 'bg-[#051C27] border-teal-900/60' : 'bg-slate-100 border-slate-200'
          }`}>
            {chapters.map((chap) => {
              const isSelected = chap.id === selectedChapterId;
              const isAllCompleted = chap.lessons.every(l => !!userProgress.completedLessons[l.id]);

              return (
                <button
                  key={chap.id}
                  id={`chapter-tab-num-${chap.id}`}
                  onClick={() => {
                    sound.playKeyClick();
                    onSelectChapterId(chap.id);
                  }}
                  className={`relative px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer flex items-center justify-center shrink-0 ${
                    isSelected
                      ? isDark
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-black shadow-md shadow-teal-500/20 scale-105'
                        : 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-black shadow-md shadow-teal-600/20 scale-105'
                      : isDark
                      ? 'text-slate-300 hover:text-cyan-300 hover:bg-teal-900/40'
                      : 'text-slate-600 hover:text-teal-800 hover:bg-white'
                  }`}
                >
                  <span>टप्पा {chap.id}</span>
                  {isAllCompleted && (
                    <span className={`absolute -top-0.5 -right-0.5 w-2 h-2 bg-cyan-400 rounded-full ring-2 ${
                      isDark ? 'ring-[#051C27]' : 'ring-white'
                    }`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Center Chapter Content Area */}
      <div className="px-5 sm:px-8 py-3 flex-1 flex flex-col justify-center">
        {/* Chapter Title */}
        <div className="text-center mb-5">
          <div className={`inline-block px-3 py-0.5 rounded-full text-xs font-mono font-bold mb-1.5 border ${
            isDark 
              ? 'bg-teal-500/10 border-teal-500/20 text-teal-400' 
              : 'bg-teal-50 border-teal-200 text-teal-700'
          }`}>
            {language === 'mr' ? `टप्पा क्रमांक ${currentChapter.id}` : `Stage ${currentChapter.id}`}
          </div>
          <h3 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {language === 'mr' ? currentChapter.titleMr : currentChapter.titleEn}
          </h3>
          <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-cyan-200/70' : 'text-slate-500'}`}>
            {language === 'mr' ? currentChapter.subtitleMr : currentChapter.subtitleEn}
          </p>
        </div>

        {/* Drill List */}
        <div className="max-w-2xl mx-auto w-full space-y-2.5">
          {currentChapter.lessons.map((lesson, drillIdx) => {
            const progress = userProgress.completedLessons[lesson.id];
            const isCompleted = !!progress;
            const badge = getDrillBadge(drillIdx);

            return (
              <div
                key={lesson.id}
                id={`drill-card-${lesson.id}`}
                onClick={() => {
                  sound.playKeyClick();
                  onStartLesson(lesson);
                }}
                className={`group flex items-center justify-between p-3 sm:p-3.5 rounded-2xl border transition-all duration-150 cursor-pointer ${
                  isCompleted
                    ? isDark
                      ? 'bg-[#0B2A3A]/80 border-teal-600/40 hover:bg-[#0E3549] hover:border-cyan-400 shadow-sm'
                      : 'bg-teal-50/60 border-teal-200 hover:bg-teal-100/70 hover:border-teal-300 shadow-sm'
                    : isDark
                    ? 'bg-[#061F2C]/70 border-teal-900/60 hover:bg-[#0B2A3A] hover:border-teal-600/60 shadow-sm'
                    : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-teal-300 shadow-sm'
                }`}
              >
                {/* Left: Status Icon, Step Number, Badge & Title */}
                <div className="flex items-center gap-3 min-w-0">
                  {isCompleted ? (
                    <div className="w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : (
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${
                      isDark ? 'border-teal-700/60 group-hover:border-cyan-400' : 'border-slate-300 group-hover:border-teal-500'
                    }`}>
                      <Circle className={`w-2.5 h-2.5 ${isDark ? 'text-teal-400/40 fill-teal-400/20' : 'text-slate-400 fill-slate-200'}`} />
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-bold font-mono ${isDark ? 'text-teal-400' : 'text-teal-700'}`}>
                        {currentChapter.id}.{drillIdx + 1}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${badge.color}`}>
                        {badge.icon}
                        <span>{language === 'mr' ? badge.labelMr : badge.labelEn}</span>
                      </span>
                      <span className={`text-xs sm:text-sm font-semibold truncate ${
                        isDark ? 'text-slate-200 group-hover:text-cyan-300' : 'text-slate-800 group-hover:text-teal-900'
                      }`}>
                        {language === 'mr' ? lesson.titleMr : lesson.titleEn}
                      </span>
                      <span className={`hidden sm:inline-block text-[10px] font-medium px-2 py-0.5 rounded border ${
                        isDark 
                          ? 'text-cyan-300/80 bg-teal-950/60 border-teal-800/40' 
                          : 'text-teal-800 bg-teal-50 border-teal-200'
                      }`}>
                        {getLessonVarietyBadge(lesson)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Duration, Stars, or Start button */}
                <div className="flex items-center gap-3 shrink-0 ml-3">
                  {isCompleted ? (
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3].map(starNum => (
                          <Star
                            key={starNum}
                            className={`w-3.5 h-3.5 ${
                              starNum <= (progress.stars || 0)
                                ? 'text-amber-400 fill-amber-400'
                                : isDark ? 'text-slate-700' : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-lg border ${
                        isDark 
                          ? 'bg-teal-950/80 text-teal-300 border-teal-700/50' 
                          : 'bg-teal-50 text-teal-800 border-teal-200'
                      }`}>
                        {progress.bestWpm} WPM
                      </span>
                    </div>
                  ) : (
                    <span className={`text-xs font-medium hidden sm:inline font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {lesson.recommendedWpm || 20} WPM
                    </span>
                  )}

                  <button
                    className={`p-1.5 rounded-xl text-white group-hover:scale-105 transition-all shadow-sm cursor-pointer ${
                      isDark 
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 hover:from-teal-400 hover:to-cyan-400' 
                        : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500'
                    }`}
                    title={language === 'mr' ? 'सराव सुरू करा' : 'Start Drill'}
                  >
                    <Play className={`w-3.5 h-3.5 ${isDark ? 'fill-slate-950' : 'fill-white'}`} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Previous and Next Chapter Navigators */}
        <div className="flex items-center justify-between max-w-2xl mx-auto w-full mt-5 px-1">
          {prevChapter ? (
            <button
              id="prev-chapter-btn"
              onClick={() => {
                sound.playKeyClick();
                onSelectChapterId(prevChapter.id);
              }}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                isDark 
                  ? 'text-teal-300 hover:text-cyan-200 hover:bg-teal-900/30' 
                  : 'text-teal-700 hover:text-teal-900 hover:bg-teal-50'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{language === 'mr' ? `मागील: टप्पा ${prevChapter.id}` : `<< Stage ${prevChapter.id}`}</span>
            </button>
          ) : (
            <div />
          )}

          {nextChapter ? (
            <button
              id="next-chapter-btn"
              onClick={() => {
                sound.playKeyClick();
                onSelectChapterId(nextChapter.id);
              }}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                isDark 
                  ? 'text-teal-300 hover:text-cyan-200 hover:bg-teal-900/30' 
                  : 'text-teal-700 hover:text-teal-900 hover:bg-teal-50'
              }`}
            >
              <span>{language === 'mr' ? `पुढील: टप्पा ${nextChapter.id}` : `Stage ${nextChapter.id} >>`}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>

      {/* Bottom Course Progress Strip & Big Start Button */}
      <div className={`px-5 sm:px-8 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t transition-colors ${
        isDark 
          ? 'bg-[#0B2E3F]/80 border-teal-800/40' 
          : 'bg-teal-50/70 border-teal-100'
      }`}>
        {/* Course Progress */}
        <div className="w-full sm:w-auto flex-1 max-w-md">
          <div className={`flex items-center justify-between text-xs font-bold mb-1.5 ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>
            <span>{language === 'mr' ? 'कोर्स प्रगती (Course Progress)' : 'Course Progress'}</span>
            <span className={`font-mono ${isDark ? 'text-cyan-400' : 'text-teal-700'}`}>{completedLessons}/{totalLessons} ({progressPercent}%)</span>
          </div>
          <div className={`w-full h-2.5 rounded-full border overflow-hidden ${
            isDark ? 'bg-[#051C27] border-teal-900/60' : 'bg-slate-200 border-slate-300'
          }`}>
            <div 
              className={`h-full transition-all duration-300 rounded-full ${
                isDark 
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-400' 
                  : 'bg-gradient-to-r from-teal-600 to-cyan-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Big Action Button */}
        <button
          id="resume-course-btn"
          onClick={() => {
            sound.playKeyClick();
            onStartLesson(nextLessonToPractice);
          }}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-black rounded-2xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer ${
            isDark
              ? 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 shadow-teal-500/20'
              : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white shadow-teal-600/20'
          }`}
        >
          <Play className={`w-4 h-4 ${isDark ? 'fill-slate-950' : 'fill-white'}`} />
          <span>
            {completedLessons === 0 
              ? (language === 'mr' ? 'सराव सुरू करा (Start Course)' : 'Start Course') 
              : (language === 'mr' ? 'पुढील धडा सुरू करा' : 'Start Next Lesson')}
          </span>
        </button>
      </div>
    </div>
  );
};


