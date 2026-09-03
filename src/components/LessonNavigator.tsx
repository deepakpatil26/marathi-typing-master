import React from 'react';
import { Chapter, LessonStep, UserProgress } from '../types';
import { 
  CheckCircle2, 
  Star, 
  Home, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Sparkles, 
  Award,
  ChevronRight
} from 'lucide-react';
import { sound } from '../utils/audio';

interface LessonNavigatorProps {
  chapters: Chapter[];
  activeLesson: LessonStep;
  onSelectLesson: (lesson: LessonStep) => void;
  userProgress: UserProgress;
  language: 'mr' | 'en';
}

export const LessonNavigator: React.FC<LessonNavigatorProps> = ({
  chapters,
  activeLesson,
  onSelectLesson,
  userProgress,
  language
}) => {
  const getChapterIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home': return <Home className="w-5 h-5 text-sky-400" />;
      case 'ArrowUpCircle': return <ArrowUpCircle className="w-5 h-5 text-emerald-400" />;
      case 'ArrowDownCircle': return <ArrowDownCircle className="w-5 h-5 text-amber-400" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-purple-400" />;
      case 'Award': return <Award className="w-5 h-5 text-rose-400" />;
      default: return <Home className="w-5 h-5 text-sky-400" />;
    }
  };

  return (
    <div id="lesson-navigator" className="w-full bg-[#0F172A]/90 border border-slate-800 rounded-3xl p-5 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-400">
              {language === 'mr' ? 'अभ्यासक्रम व धडे' : 'Curriculum'}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'mr' ? '५ टप्प्यांमध्ये संपूर्ण मराठी टंकलेखन शिका' : '5-Stage ISM Remington mastery'}
          </p>
        </div>
      </div>

      {/* Chapters list */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
        {chapters.map((chapter, idx) => {
          const hasActiveLesson = chapter.lessons.some(l => l.id === activeLesson.id);
          
          return (
            <div
              key={chapter.id}
              id={`chapter-${chapter.id}`}
              className={`rounded-2xl border transition-all duration-200 ${
                hasActiveLesson
                  ? 'bg-blue-600/10 border-blue-500/50 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/30'
                  : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Chapter Header */}
              <div className="p-3.5 flex items-start justify-between gap-3 border-b border-slate-800/60">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                    {getChapterIcon(chapter.iconName)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[10px] font-bold tracking-wider uppercase ${hasActiveLesson ? 'text-blue-400' : 'text-slate-500'}`}>
                        CHAPTER 0{idx + 1}
                      </span>
                      {hasActiveLesson && (
                        <span className="text-[9px] bg-blue-500 text-white px-1.5 py-0.2 rounded font-bold uppercase">ACTIVE</span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-slate-200">
                      {language === 'mr' ? chapter.titleMr : chapter.titleEn}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {language === 'mr' ? chapter.subtitleMr : chapter.subtitleEn}
                    </p>
                  </div>
                </div>
              </div>

              {/* Lessons Subgrid */}
              <div className="p-2 space-y-1.5">
                {chapter.lessons.map(lesson => {
                  const isSelected = activeLesson.id === lesson.id;
                  const progress = userProgress.completedLessons[lesson.id];
                  const isCompleted = !!progress;

                  return (
                    <button
                      key={lesson.id}
                      id={`lesson-item-${lesson.id}`}
                      onClick={() => {
                        sound.playKeyClick();
                        onSelectLesson(lesson);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/25'
                          : 'hover:bg-slate-800/70 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {isCompleted ? (
                          <CheckCircle2 className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-emerald-400'}`} />
                        ) : (
                          <div className={`w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[9px] shrink-0 ${isSelected ? 'border-white text-white' : 'text-slate-500'}`}>
                            •
                          </div>
                        )}
                        <div className="truncate">
                          <div className={`text-xs font-semibold truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                            {language === 'mr' ? lesson.titleMr : lesson.titleEn}
                          </div>
                          {lesson.keysIntroduced && lesson.keysIntroduced.length > 0 && (
                            <div className={`text-[10px] font-mono mt-0.5 truncate ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                              Keys: {lesson.keysIntroduced.join(' ')}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Stars and speed badge */}
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {progress ? (
                          <div className="flex items-center gap-1">
                            <div className="flex">
                              {[1, 2, 3].map(starNum => (
                                <Star
                                  key={starNum}
                                  className={`w-3 h-3 ${
                                    starNum <= (progress.stars || 0)
                                      ? isSelected ? 'text-amber-300 fill-amber-300' : 'text-amber-400 fill-amber-400'
                                      : isSelected ? 'text-blue-400/50' : 'text-slate-700'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              isSelected ? 'bg-blue-900/60 text-white' : 'bg-slate-900 text-emerald-400 border border-slate-800'
                            }`}>
                              {progress.bestWpm} WPM
                            </span>
                          </div>
                        ) : (
                          <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-600'}`} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
