import React, { useState } from 'react';
import { LessonStep, UserProgress } from '../types';
import { RotateCcw, Play, CheckCircle2, Sparkles, Loader2, Target, BrainCircuit } from 'lucide-react';
import { sound } from '../utils/audio';

interface ReviewViewProps {
  userProgress: UserProgress;
  language: 'mr' | 'en';
  onStartCustomDrill: (lesson: LessonStep) => void;
}

export const ReviewView: React.FC<ReviewViewProps> = ({
  userProgress,
  language,
  onStartCustomDrill
}) => {
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiDifficulty, setAiDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [selectedChars, setSelectedChars] = useState<string[]>([]);
  const [aiGeneratedDrill, setAiGeneratedDrill] = useState<LessonStep | null>(null);

  const weakEntries = Object.entries(userProgress.weakCharacters || {}) as [string, number][];
  const weakChars = weakEntries
    .sort((a, b) => b[1] - a[1])
    .filter(([_, count]) => count > 0);

  // Toggle selection for customized drill
  const toggleCharSelection = (char: string) => {
    sound.playKeyClick();
    setSelectedChars(prev => 
      prev.includes(char) ? prev.filter(c => c !== char) : [...prev, char]
    );
  };

  const effectiveWeakKeys = selectedChars.length > 0 
    ? selectedChars 
    : weakChars.slice(0, 6).map(([char]) => char);

  // Standard offline drill
  const handleCreateStandardDrill = () => {
    sound.playKeyClick();
    const topChars = effectiveWeakKeys.length > 0 ? effectiveWeakKeys : ['क', 'र', 'स'];
    
    const drillPattern = Array.from({ length: 12 }, () => {
      return topChars.map(c => `${c}${c} ${c} `).join('');
    }).join(' ');

    const drillLesson: LessonStep = {
      id: 'review-drill-standard',
      titleEn: `Weak Key Review Drill (${topChars.join(', ')})`,
      titleMr: `चुका पुनरावलोकन सराव (${topChars.join(', ')})`,
      descriptionEn: 'Focus on striking your most frequently missed keys with rhythmic precision.',
      descriptionMr: 'वारंवार चुकणाऱ्या अक्षरांचा विशेष सराव आणि अचूकतेवर भर.',
      targetText: drillPattern.trim(),
      keysIntroduced: topChars,
      recommendedWpm: 25
    };

    onStartCustomDrill(drillLesson);
  };

  // Smart AI Tutor Drill Generator via Gemini
  const handleGenerateAiDrill = async () => {
    sound.playKeyClick();
    const targetKeys = effectiveWeakKeys.length > 0 ? effectiveWeakKeys : ['क', 'स', 'र', 'ह'];
    setIsGeneratingAi(true);

    try {
      const res = await fetch('/api/ai/weak-key-drill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weakKeys: targetKeys,
          difficulty: aiDifficulty,
          language
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        const aiLesson: LessonStep = {
          id: `ai-drill-${Date.now()}`,
          titleEn: d.titleEn || `AI Weak-Key Drill (${targetKeys.join(', ')})`,
          titleMr: d.titleMr || `विशेष AI अक्षर सराव (${targetKeys.join(', ')})`,
          descriptionEn: d.descriptionEn || 'AI-generated personalized sentence drill targeting your error keys.',
          descriptionMr: d.descriptionMr || 'तुमच्या चुकणाऱ्या अक्षरांवर आधारित विशेष AI सराव संच.',
          targetText: d.targetText || targetKeys.map(k => `सराव ${k} अचूक ${k}`).join(' । '),
          keysIntroduced: targetKeys,
          recommendedWpm: 25
        };

        setAiGeneratedDrill(aiLesson);
        sound.playSuccessSound();
      } else {
        handleCreateStandardDrill();
      }
    } catch {
      handleCreateStandardDrill();
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div id="review-view-container" className="w-full bg-[#072431]/95 border border-teal-800/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-teal-900/50">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">
              {language === 'mr' ? 'अक्षर पुनरावलोकन व स्मार्ट AI ट्यूटर' : 'Troublesome Keys & Smart AI Tutor'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-cyan-200/70 mt-1">
            {language === 'mr' 
              ? 'सरावादरम्यान वारंवार चुकणाऱ्या अक्षरांचे अचूक विश्लेषण व AI द्वारे स्वयंचलित सराव संच निर्मिती.' 
              : 'Analyze troublesome keys and generate AI remediation drills to eliminate typing mistakes.'}
          </p>
        </div>

        {weakChars.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCreateStandardDrill}
              className="px-4 py-2.5 bg-[#0B2E3F] hover:bg-[#0E3549] text-slate-200 border border-teal-700/50 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 text-cyan-400" />
              <span>{language === 'mr' ? 'साधा सराव' : 'Standard Drill'}</span>
            </button>
            <button
              onClick={handleGenerateAiDrill}
              disabled={isGeneratingAi}
              className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-teal-500/25 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isGeneratingAi ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{language === 'mr' ? 'AI संच तयार होत आहे...' : 'Generating Drill...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>{language === 'mr' ? '🤖 AI सराव संच तयार करा' : 'Generate AI Drill'}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* AI Drill Generator Configuration Banner */}
      <div className="p-4 rounded-2xl bg-[#051C27] border border-teal-900/60 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100">
              {language === 'mr' ? 'स्मार्ट AI कमजोरी निवारक (AI Weak-Key Remediation)' : 'Smart AI Weak-Key Remediation'}
            </h4>
            <p className="text-[11px] text-slate-400">
              {language === 'mr' 
                ? 'खालीलपैकी अक्षरे निवडा व हव्या त्या काठिण्य पातळीनुसार नैसर्गिक मराठी वाक्ये तयार करा.' 
                : 'Select specific keys below or let AI target all frequent errors with natural Marathi sentences.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold">{language === 'mr' ? 'काठिण्य पातळी:' : 'Difficulty:'}</span>
          {(['easy', 'medium', 'hard'] as const).map(lvl => (
            <button
              key={lvl}
              onClick={() => {
                sound.playKeyClick();
                setAiDifficulty(lvl);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                aiDifficulty === lvl
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-black'
                  : 'bg-[#072431] text-slate-300 border border-teal-900/60 hover:border-teal-700/60'
              }`}
            >
              {lvl === 'easy' ? (language === 'mr' ? 'सोपे' : 'Easy') : lvl === 'medium' ? (language === 'mr' ? 'मध्यम' : 'Med') : (language === 'mr' ? 'कठीण' : 'Hard')}
            </button>
          ))}
        </div>
      </div>

      {/* AI Generated Result Preview Card (if generated) */}
      {aiGeneratedDrill && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#072B3B] to-[#041A25] border-2 border-cyan-400/40 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-black text-cyan-300 uppercase tracking-wide">
                {language === 'mr' ? 'AI द्वारे तयार केलेला सराव संच तयार आहे' : 'AI Targeted Drill Ready'}
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
              {aiDifficulty.toUpperCase()}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans bg-[#02131C] p-3.5 rounded-xl border border-teal-900/50" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
            {aiGeneratedDrill.targetText}
          </p>

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={() => onStartCustomDrill(aiGeneratedDrill)}
              className="px-5 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-teal-500/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>{language === 'mr' ? 'हा AI सराव सुरू करा' : 'Start This AI Practice'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Weak Keys Grid with Interactive Selection */}
      {weakChars.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-8 h-8 text-teal-400" />
          </div>
          <h3 className="text-base font-bold text-slate-200">
            {language === 'mr' ? 'उत्कृष्ट अचूकता! कोणत्याही चुकांची नोंद नाही.' : 'Flawless Typing! No weak keys detected.'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mt-1">
            {language === 'mr' 
              ? 'नियमित धडे किंवा परीक्षा मोडचा सराव सुरू ठेवा.' 
              : 'Continue practicing the standard chapters or taking typing tests to build mastery.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{language === 'mr' ? 'अक्षरावर क्लिक करून निवडा/वगळा:' : 'Click keys to toggle target selection:'}</span>
            <span className="text-cyan-400 font-semibold">{weakChars.length} {language === 'mr' ? 'कमजोर अक्षरे' : 'troublesome keys'}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {weakChars.map(([char, count]) => {
              const isSelected = selectedChars.includes(char);
              return (
                <button
                  key={char}
                  onClick={() => toggleCharSelection(char)}
                  className={`p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#0A3D52] to-[#062938] border-cyan-400 shadow-md shadow-cyan-500/20 scale-[1.03]'
                      : 'bg-[#051C27]/90 border-teal-900/60 hover:border-teal-700/60 hover:bg-[#072431]'
                  }`}
                >
                  <span className="text-3xl font-bold text-cyan-300" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                    {char}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/60">
                      {count} {language === 'mr' ? 'चुका' : 'err'}
                    </span>
                    {isSelected && (
                      <Target className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
