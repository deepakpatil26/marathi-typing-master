import React, { useState } from 'react';
import { LessonStep, UserProgress, Finger } from '../types';
import { TypingArea } from './TypingArea';
import { FileText, Play, RotateCcw } from 'lucide-react';

interface CustomTextPracticeProps {
  userProgress: UserProgress;
  setUserProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
  language: 'mr' | 'en';
  onActiveTargetChange: (targetInfo: { key: string; isShift: boolean; code: string; finger: Finger; hand: string } | null) => void;
  onKeyPressedChange: (keys: Set<string>) => void;
}

export const CustomTextPractice: React.FC<CustomTextPracticeProps> = ({
  userProgress,
  setUserProgress,
  language,
  onActiveTargetChange,
  onKeyPressedChange
}) => {
  const [customInput, setCustomInput] = useState<string>(
    'महाराष्ट्र शासन राजपत्र आणि शासकीय परिपत्रकांचा नियमित सराव केल्यास टंकलेखनाची अचूकता वाढते.'
  );
  const [activeLessonStep, setActiveLessonStep] = useState<LessonStep | null>(null);

  const handleStartCustomPractice = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;

    const customStep: LessonStep = {
      id: `custom-${Date.now()}`,
      titleEn: 'Custom Marathi Practice',
      titleMr: 'स्वतःचा मराठी परिच्छेद सराव',
      descriptionEn: 'Customized practice passage entered by user.',
      descriptionMr: 'वापरकर्त्याने प्रविष्ट केलेला सराव मजकूर.',
      targetText: trimmed,
      recommendedWpm: 30
    };

    setActiveLessonStep(customStep);
  };

  return (
    <div id="custom-practice-container" className="w-full flex flex-col gap-5">
      <div className="bg-[#072431]/95 border border-teal-800/40 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/30">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              {language === 'mr' ? 'स्वतःचा मजकूर प्रविष्ट करा' : 'Custom Marathi Text Practice'}
            </h3>
            <p className="text-xs text-cyan-200/70 mt-0.5">
              {language === 'mr' 
                ? 'कोणताही मराठी परिच्छेद, शासकीय जीआर किंवा प्रश्नपत्रिका येथे पेस्ट करून सराव सुरू करा' 
                : 'Paste any Marathi text, exam paper, or article to practice with ISM Remington layout'}
            </p>
          </div>
        </div>

        {!activeLessonStep ? (
          <div className="space-y-4">
            <textarea
              rows={4}
              value={customInput}
              onChange={e => setCustomInput(e.target.value)}
              placeholder={language === 'mr' ? 'येथे मराठी मजकूर टाईप किंवा पेस्ट करा...' : 'Type or paste Marathi text here...'}
              className="w-full p-4 rounded-2xl bg-[#051C27] border border-teal-900/70 text-slate-100 text-sm focus:border-cyan-400 focus:outline-none resize-none shadow-inner"
              style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
            />

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                {customInput.length} {language === 'mr' ? 'अक्षरे' : 'characters'}
              </span>
              <button
                onClick={handleStartCustomPractice}
                disabled={!customInput.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-teal-500/20 transition-all cursor-pointer flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>{language === 'mr' ? 'सराव सुरू करा' : 'Start Practice'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-teal-900/50">
              <span className="text-xs font-semibold text-slate-300">
                {language === 'mr' ? 'कस्टम सराव सत्र सुरू आहे' : 'Active Custom Practice Session'}
              </span>
              <button
                onClick={() => setActiveLessonStep(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B2E3F] hover:bg-[#0E3549] text-cyan-300 text-xs font-bold transition-all cursor-pointer border border-teal-800/40"
              >
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                <span>{language === 'mr' ? 'दुसरा मजकूर बदला' : 'Change Text'}</span>
              </button>
            </div>

            <TypingArea
              lesson={activeLessonStep}
              userProgress={userProgress}
              setUserProgress={setUserProgress}
              language={language}
              onActiveTargetChange={onActiveTargetChange}
              onKeyPressedChange={onKeyPressedChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};
