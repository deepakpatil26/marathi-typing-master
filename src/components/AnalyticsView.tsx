import React from 'react';
import { UserProgress, LessonStep } from '../types';
import { CURRICULUM_CHAPTERS } from '../data/curriculum';
import { 
  Flame, 
  Target, 
  Clock, 
  AlertOctagon, 
  Zap, 
  Trash2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { saveUserProgress } from '../utils/telemetry';
import { useTheme } from '../context/ThemeContext';

interface AnalyticsViewProps {
  userProgress: UserProgress;
  setUserProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
  language: 'mr' | 'en';
  onStartWeakDrill: (customLesson: LessonStep) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  userProgress,
  setUserProgress,
  language,
  onStartWeakDrill
}) => {
  const { isDark } = useTheme();
  const totalLessons = CURRICULUM_CHAPTERS.reduce((acc, c) => acc + c.lessons.length, 0);
  const completedCount = Object.keys(userProgress.completedLessons).length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  // Average WPM & Accuracy
  const completedValues = Object.values(userProgress.completedLessons) as Array<{ stars: number; bestWpm: number; accuracy: number }>;
  let totalWpm = 0;
  let totalAcc = 0;
  for (const item of completedValues) {
    totalWpm += item.bestWpm || 0;
    totalAcc += item.accuracy || 0;
  }
  const avgWpm = completedValues.length > 0 ? Math.round(totalWpm / completedValues.length) : 0;
  const avgAccuracy = completedValues.length > 0 ? Math.round((totalAcc / completedValues.length) * 10) / 10 : 100;

  // Weak characters sorted by error count
  const sortedWeakChars: [string, number][] = Object.entries(userProgress.weakCharacters)
    .filter(([char]) => char && char.trim() !== '')
    .map(([char, count]) => [char, Number(count)] as [string, number])
    .sort((a, b) => b[1] - a[1]);

  const handleGenerateWeakKeyDrill = () => {
    if (sortedWeakChars.length === 0) {
      // Default practice if no weak keys logged yet
      onStartWeakDrill({
        id: `weak-drill-${Date.now()}`,
        titleEn: 'Smart Practice: Marathi Essentials',
        titleMr: 'स्मार्ट सराव: मराठी महत्त्वाची अक्षरे',
        descriptionEn: 'Practice essential characters and conjuncts.',
        descriptionMr: 'महत्त्वाची अक्षरे व जोडाक्षरांचा सराव.',
        targetText: 'शाळा बाळ पाणी वेळ सूर्य प्रकाश राष्ट्र महाराष्ट्र ज्ञान क्षमा',
        recommendedWpm: 25
      });
      return;
    }

    const topChars = sortedWeakChars.slice(0, 5).map(item => item[0]);
    // Create targeted repetition text
    const repeated = topChars.map(c => `${c} ${c} ${c} ${c} `).join('');
    const drillText = `${repeated} सराव अचूक करा. ${topChars.join('')} ${topChars.join(' ')}`;

    onStartWeakDrill({
      id: `weak-drill-${Date.now()}`,
      titleEn: 'Targeted Weak-Key Drill',
      titleMr: 'अडचणीच्या अक्षरांचा विशेष सराव',
      descriptionEn: `Focused drill targeting your most frequent mistakes: ${topChars.join(', ')}`,
      descriptionMr: `वारंवार चुकणाऱ्या अक्षरांचा केंद्रित सराव: ${topChars.join(', ')}`,
      targetText: drillText,
      recommendedWpm: 25
    });
  };

  const handleResetProgress = () => {
    if (window.confirm(language === 'mr' ? 'तुम्हाला तुमची सर्व टायपिंग प्रगती रिसेट करायची आहे का?' : 'Do you want to reset all typing progress?')) {
      const resetState: UserProgress = {
        completedLessons: {},
        totalPracticeTimeSeconds: 0,
        overallAccuracy: 100,
        weakCharacters: {}
      };
      setUserProgress(resetState);
      saveUserProgress(resetState);
    }
  };

  return (
    <div id="analytics-view-container" className="w-full min-w-0 max-w-full flex flex-col gap-6">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`rounded-2xl p-5 shadow-lg flex items-center gap-4 border transition-colors ${
          isDark 
            ? 'bg-[#072431]/95 border-teal-800/40 text-slate-100' 
            : 'bg-white/95 border-teal-200/80 text-slate-900 shadow-teal-900/5'
        }`}>
          <div className={`p-3.5 rounded-2xl border ${
            isDark 
              ? 'bg-teal-500/10 text-teal-400 border-teal-500/30' 
              : 'bg-teal-50 text-teal-700 border-teal-200'
          }`}>
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'mr' ? 'सरासरी गती' : 'Avg Speed'}</div>
            <div className={`text-2xl font-black font-mono mt-0.5 ${isDark ? 'text-teal-400' : 'text-teal-700'}`}>{avgWpm} WPM</div>
          </div>
        </div>

        <div className={`rounded-2xl p-5 shadow-lg flex items-center gap-4 border transition-colors ${
          isDark 
            ? 'bg-[#072431]/95 border-teal-800/40 text-slate-100' 
            : 'bg-white/95 border-teal-200/80 text-slate-900 shadow-teal-900/5'
        }`}>
          <div className={`p-3.5 rounded-2xl border ${
            isDark 
              ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' 
              : 'bg-cyan-50 text-cyan-700 border-cyan-200'
          }`}>
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'mr' ? 'सरासरी अचूकता' : 'Avg Accuracy'}</div>
            <div className={`text-2xl font-black font-mono mt-0.5 ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>{avgAccuracy}%</div>
          </div>
        </div>

        <div className={`rounded-2xl p-5 shadow-lg flex items-center gap-4 border transition-colors ${
          isDark 
            ? 'bg-[#072431]/95 border-teal-800/40 text-slate-100' 
            : 'bg-white/95 border-teal-200/80 text-slate-900 shadow-teal-900/5'
        }`}>
          <div className={`p-3.5 rounded-2xl border ${
            isDark 
              ? 'bg-sky-500/10 text-sky-400 border-sky-500/30' 
              : 'bg-sky-50 text-sky-700 border-sky-200'
          }`}>
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'mr' ? 'पूर्ण केलेले धडे' : 'Completed'}</div>
            <div className={`text-2xl font-black font-mono mt-0.5 ${isDark ? 'text-sky-300' : 'text-sky-700'}`}>{completedCount}/{totalLessons} ({progressPercent}%)</div>
          </div>
        </div>

        <div className={`rounded-2xl p-5 shadow-lg flex items-center gap-4 border transition-colors ${
          isDark 
            ? 'bg-[#072431]/95 border-teal-800/40 text-slate-100' 
            : 'bg-white/95 border-teal-200/80 text-slate-900 shadow-teal-900/5'
        }`}>
          <div className={`p-3.5 rounded-2xl border ${
            isDark 
              ? 'bg-teal-500/10 text-teal-300 border-teal-500/30' 
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className={`text-[10px] uppercase font-bold tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'mr' ? 'एकूण सराव वेळ' : 'Practice Time'}</div>
            <div className={`text-2xl font-black font-mono mt-0.5 ${isDark ? 'text-teal-300' : 'text-emerald-700'}`}>
              {Math.round(userProgress.totalPracticeTimeSeconds / 60)} {language === 'mr' ? 'मि.' : 'mins'}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar & Mastery */}
      <div className={`rounded-3xl p-6 shadow-2xl backdrop-blur-md border transition-colors ${
        isDark 
          ? 'bg-[#072431]/95 border-teal-800/40' 
          : 'bg-white/95 border-teal-200/80 shadow-teal-900/5'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            {language === 'mr' ? 'अभ्यासक्रम पूर्णता (Curriculum Mastery)' : 'Overall Curriculum Mastery'}
          </span>
          <span className={`text-xs font-mono font-bold ${isDark ? 'text-cyan-400' : 'text-teal-700'}`}>{progressPercent}%</span>
        </div>
        <div className={`w-full h-3 rounded-full overflow-hidden border ${
          isDark ? 'bg-[#051C27] border-teal-900/60' : 'bg-slate-200 border-slate-300'
        }`}>
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isDark 
                ? 'bg-gradient-to-r from-teal-500 to-cyan-400' 
                : 'bg-gradient-to-r from-teal-600 to-cyan-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Error Heatmap & Weak Key Remediation Drill */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`md:col-span-2 rounded-3xl p-6 shadow-2xl backdrop-blur-md border transition-colors ${
          isDark 
            ? 'bg-[#072431]/95 border-teal-800/40' 
            : 'bg-white/95 border-teal-200/80 shadow-teal-900/5'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertOctagon className={`w-5 h-5 ${isDark ? 'text-rose-400' : 'text-rose-600'}`} />
              <h3 className={`text-sm font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                {language === 'mr' ? 'चुकणाऱ्या अक्षरांचे विश्लेषण (Error Heatmap)' : 'Character Error Analysis'}
              </h3>
            </div>
            <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {sortedWeakChars.length} {language === 'mr' ? 'अक्षरे नोंदवली' : 'characters logged'}
            </span>
          </div>

          {sortedWeakChars.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {sortedWeakChars.slice(0, 12).map(([char, count]) => (
                <div
                  key={char}
                  className={`border rounded-2xl p-3 flex items-center justify-between transition-colors ${
                    isDark 
                      ? 'bg-[#051C27]/90 border-teal-900/60' 
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`text-xl font-black w-8 text-center ${isDark ? 'text-cyan-300' : 'text-teal-800'}`}>{char}</span>
                  </div>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-lg border ${
                    isDark 
                      ? 'text-rose-400 bg-rose-950/40 border-rose-800/40' 
                      : 'text-rose-700 bg-rose-50 border-rose-200'
                  }`}>
                    {count} {language === 'mr' ? 'चुका' : 'err'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-8 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {language === 'mr' 
                ? 'अजून कोणत्याही चुकांची नोंद नाही. अधिक सराव करा!' 
                : 'No mistakes recorded yet. Keep practicing lessons!'}
            </div>
          )}
        </div>

        {/* Weak Key Auto-Drill Card */}
        <div className={`rounded-3xl p-6 shadow-2xl flex flex-col justify-between backdrop-blur-md border transition-colors ${
          isDark 
            ? 'bg-[#072431]/95 border-teal-700/50' 
            : 'bg-teal-50/60 border-teal-200 shadow-teal-900/5'
        }`}>
          <div>
            <div className={`flex items-center gap-2 mb-2 ${isDark ? 'text-cyan-400' : 'text-teal-700'}`}>
              <Zap className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-wider">
                {language === 'mr' ? 'स्मार्ट सराव जनरेटर' : 'Smart Remediation Drill'}
              </span>
            </div>
            <h4 className={`text-sm font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              {language === 'mr' ? 'अडचणीच्या अक्षरांचा विशेष सराव' : 'Targeted Weak-Key Exercise'}
            </h4>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {language === 'mr'
                ? 'तुमच्या सर्वाधिक चुकणाऱ्या अक्षरांवर आधारित विशेष सराव सत्र सुरू करा.'
                : 'Automatically generate custom typing drills focused on your most common mistakes.'}
            </p>
          </div>

          <button
            onClick={handleGenerateWeakKeyDrill}
            className={`w-full mt-4 py-3 font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
              isDark 
                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 shadow-teal-500/20' 
                : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white shadow-teal-600/20'
            }`}
          >
            <Sparkles className={`w-4 h-4 ${isDark ? 'fill-slate-950' : 'fill-white'}`} />
            <span>{language === 'mr' ? 'कमकुवत अक्षरांचा सराव सुरू करा' : 'Start Weak Key Drill'}</span>
          </button>
        </div>
      </div>

      {/* Danger Zone: Reset stats */}
      <div className={`pt-4 border-t flex items-center justify-between ${
        isDark ? 'border-teal-900/50' : 'border-slate-200'
      }`}>
        <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {language === 'mr' ? 'स्थानिक मेमरी डेटा व्यवस्थापन' : 'Local Storage Progress Management'}
        </span>
        <button
          onClick={handleResetProgress}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
            isDark 
              ? 'bg-rose-950/30 hover:bg-rose-900/50 border-rose-800/40 text-rose-300' 
              : 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700'
          }`}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{language === 'mr' ? 'सर्व डेटा रीसेट करा' : 'Reset All Progress'}</span>
        </button>
      </div>
    </div>
  );
};

