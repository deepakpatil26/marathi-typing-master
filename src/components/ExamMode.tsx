import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ExamResult, Finger } from '../types';
import { EXAM_PASSAGES } from '../data/curriculum';
import { remingtonKeyToDevanagari, getRemingtonKeyForChar } from '../data/remingtonMap';
import { evaluateGccTbcExam } from '../utils/telemetry';
import { sound } from '../utils/audio';
import { buildDevanagariWordGroups } from '../utils/devanagari';
import confetti from 'canvas-confetti';
import { 
  Award, 
  Timer, 
  User, 
  CheckCircle2, 
  AlertTriangle, 
  Printer, 
  RotateCcw,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface ExamModeProps {
  language: 'mr' | 'en';
  onActiveTargetChange: (targetInfo: { key: string; isShift: boolean; code: string; finger: Finger; hand: string } | null) => void;
  onKeyPressedChange: (keys: Set<string>) => void;
}

export const ExamMode: React.FC<ExamModeProps> = ({
  language,
  onActiveTargetChange,
  onKeyPressedChange
}) => {
  const [candidateName, setCandidateName] = useState<string>('दीपक पाटील (Deepak Patil)');
  const [seatNumber, setSeatNumber] = useState<string>('MH-GCC-2026-8842');
  const [targetSpeed, setTargetSpeed] = useState<30 | 40>(30);
  const [selectedPassageIndex, setSelectedPassageIndex] = useState<number>(0);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(5);
  const [strictMode, setStrictMode] = useState<boolean>(true);

  // Active exam session states
  const [isExamRunning, setIsExamRunning] = useState<boolean>(false);
  const [typedText, setTypedText] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [mistakeIndexes, setMistakeIndexes] = useState<Set<number>>(new Set());
  const [backspaces, setBackspaces] = useState<number>(0);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(5 * 60);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);

  const availablePassages = EXAM_PASSAGES.filter(p => p.speed === targetSpeed);
  const currentPassage = availablePassages[selectedPassageIndex] || availablePassages[0] || EXAM_PASSAGES[0];
  const targetText = currentPassage.text;

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pressedKeysRef = useRef<Set<string>>(new Set());

  // Current key prompt
  const currentChar = targetText[currentIndex] || '';
  const currentKeyInfo = getRemingtonKeyForChar(currentChar);

  useEffect(() => {
    if (isExamRunning) {
      onActiveTargetChange(currentKeyInfo);
    }
  }, [currentChar, isExamRunning, onActiveTargetChange]);

  const startExam = () => {
    setIsExamRunning(true);
    setTypedText('');
    setCurrentIndex(0);
    setMistakeIndexes(new Set());
    setBackspaces(0);
    setExamResult(null);
    setRemainingSeconds(timeLimitMinutes * 60);
    startTimeRef.current = Date.now();

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const finishExam = useCallback(() => {
    setIsExamRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);

    const timeSpent = startTimeRef.current 
      ? Math.max(1, Math.floor((Date.now() - startTimeRef.current) / 1000))
      : timeLimitMinutes * 60;

    const correctCount = currentIndex - mistakeIndexes.size;
    const result = evaluateGccTbcExam(
      candidateName,
      targetSpeed,
      timeLimitMinutes,
      currentIndex,
      Math.max(0, correctCount),
      mistakeIndexes.size,
      timeSpent
    );

    setExamResult(result);

    if (result.passed) {
      sound.playSuccessSound();
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 }
        });
      } catch {
        // ignore
      }
    } else {
      sound.playErrorSound();
    }
  }, [candidateName, targetSpeed, timeLimitMinutes, currentIndex, mistakeIndexes.size]);

  // Exam Countdown Timer
  useEffect(() => {
    if (isExamRunning) {
      timerRef.current = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            finishExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isExamRunning, finishExam]);

  // Handle Keystrokes during exam
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isExamRunning) return;

    pressedKeysRef.current.add(e.code);
    pressedKeysRef.current.add(e.key.toLowerCase());
    onKeyPressedChange(new Set(pressedKeysRef.current));

    if (e.key === 'Backspace') {
      e.preventDefault();
      if (!strictMode && currentIndex > 0) {
        sound.playKeyClick();
        setBackspaces(prev => prev + 1);
        setCurrentIndex(prev => prev - 1);
        setTypedText(prev => prev.slice(0, -1));
      } else {
        // Strict mode penalization
        sound.playErrorSound();
      }
      return;
    }

    if (e.key === 'Tab' || e.key === 'Alt' || e.key === 'Control' || e.key === 'Meta') {
      return;
    }

    e.preventDefault();

    let devanagariChar: string | null = null;
    if (e.key === ' ') {
      devanagariChar = ' ';
    } else if (e.key.length === 1) {
      devanagariChar = remingtonKeyToDevanagari(e.key, e.shiftKey, e.code);
      if (!devanagariChar && /[\u0900-\u097F]/.test(e.key)) {
        devanagariChar = e.key;
      }
    }

    if (!devanagariChar) return;

    const expected = targetText[currentIndex];
    const isMatch = devanagariChar === expected;

    if (isMatch) {
      sound.playKeyClick();
      setTypedText(prev => prev + devanagariChar);
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);

      if (nextIdx >= targetText.length) {
        finishExam();
      }
    } else {
      sound.playErrorSound();
      setMistakeIndexes(prev => new Set(prev).add(currentIndex));
      setTypedText(prev => prev + devanagariChar);
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);

      if (nextIdx >= targetText.length) {
        finishExam();
      }
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    pressedKeysRef.current.delete(e.code);
    pressedKeysRef.current.delete(e.key.toLowerCase());
    onKeyPressedChange(new Set(pressedKeysRef.current));
  };

  const wordGroups = useMemo(() => buildDevanagariWordGroups(targetText), [targetText]);

  return (
    <div id="exam-mode-container" className="w-full flex flex-col gap-6">
      {/* Exam Header banner */}
      <div className="bg-[#072431]/95 border border-teal-800/40 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-teal-500/20">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">
                {language === 'mr' ? 'GCC-TBC महाराष्ट्र राज्य टंकलेखन परीक्षा सिम्युलेटर' : 'Maharashtra GCC-TBC Exam Simulator'}
              </h2>
              <span className="px-2 py-0.5 rounded-lg bg-teal-500/20 text-cyan-300 text-[10px] font-bold border border-teal-500/40">
                MSCE Pune Pattern
              </span>
            </div>
            <p className="text-xs text-cyan-200/70 mt-1">
              {language === 'mr' 
                ? '३० व ४० श.प्र.मि. शासकीय संगणक टंकलेखन प्रमाणपत्र परीक्षांचे हुबेहूब वातावरण' 
                : 'Authentic 30 & 40 WPM Maharashtra Government Certification Exam environment'}
            </p>
          </div>
        </div>

        {!isExamRunning && !examResult && (
          <button
            id="start-exam-btn"
            onClick={startExam}
            className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-teal-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>{language === 'mr' ? 'परीक्षा सुरू करा (Start Exam)' : 'Start Exam Now'}</span>
          </button>
        )}
      </div>

      {/* Pre-Exam Setup or Active Exam Screen */}
      {!isExamRunning && !examResult ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Candidate Form */}
          <div className="bg-[#072431]/95 border border-teal-800/40 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
            <h3 className="text-sm font-bold text-slate-100 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" />
              <span>{language === 'mr' ? 'परीक्षार्थी तपशील' : 'Candidate Details'}</span>
            </h3>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {language === 'mr' ? 'परीक्षार्थीचे पूर्ण नाव:' : 'Full Name:'}
                </label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={e => setCandidateName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#051C27] border border-teal-900/70 text-slate-100 text-xs font-medium focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {language === 'mr' ? 'बैठक क्रमांक (Seat No):' : 'Seat / Roll No:'}
                </label>
                <input
                  type="text"
                  value={seatNumber}
                  onChange={e => setSeatNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#051C27] border border-teal-900/70 text-slate-100 text-xs font-mono font-medium focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {language === 'mr' ? 'लक्ष्य गती श्रेणी:' : 'Target Speed Standard:'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTargetSpeed(30);
                      setSelectedPassageIndex(0);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      targetSpeed === 30
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-black border-cyan-400 shadow-md shadow-teal-500/20'
                        : 'bg-[#051C27] text-slate-300 border-teal-900/60 hover:border-teal-700/60'
                    }`}
                  >
                    ३० WPM (Basic)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTargetSpeed(40);
                      setSelectedPassageIndex(0);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      targetSpeed === 40
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-black border-cyan-400 shadow-md shadow-teal-500/20'
                        : 'bg-[#051C27] text-slate-300 border-teal-900/60 hover:border-teal-700/60'
                    }`}
                  >
                    ४० WPM (Advanced)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {language === 'mr' ? 'परीक्षेची वेळ मर्यादा:' : 'Time Duration:'}
                </label>
                <select
                  value={timeLimitMinutes}
                  onChange={e => setTimeLimitMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#051C27] border border-teal-900/70 text-slate-100 text-xs font-medium focus:border-cyan-400 focus:outline-none"
                >
                  <option value={2}>२ मिनिटे (Quick Test)</option>
                  <option value={5}>५ मिनिटे (Standard)</option>
                  <option value={7}>७ मिनिटे (Official GCC-TBC Duration)</option>
                  <option value={10}>१० मिनिटे (MPSC Pattern)</option>
                </select>
              </div>

              <div className="pt-1 flex items-center justify-between">
                <span className="text-xs text-slate-400">{language === 'mr' ? 'कडक बॅकस्पेस नियम:' : 'Strict Backspace Penalty:'}</span>
                <button
                  type="button"
                  onClick={() => setStrictMode(prev => !prev)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    strictMode ? 'bg-rose-950/60 text-rose-300 border border-rose-700/60' : 'bg-[#051C27] text-slate-400 border border-teal-900/50'
                  }`}
                >
                  {strictMode ? 'On (सक्तीचे)' : 'Off'}
                </button>
              </div>
            </div>
          </div>

          {/* Exam Rules & Guidelines */}
          <div className="md:col-span-2 bg-[#072431]/95 border border-teal-800/40 rounded-3xl p-6 shadow-2xl backdrop-blur-md flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>{language === 'mr' ? 'शासकीय परीक्षा नियम व मूल्यमापन पद्धती' : 'Official Evaluation Guidelines'}</span>
              </h3>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="p-3 rounded-2xl bg-[#051C27] border border-teal-900/60 flex items-start gap-2.5">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span><strong>उत्तीर्ण निकष (Passing Standard):</strong> किमान {targetSpeed} Net WPM गती आणि किमान <strong>९०% अचूकता</strong> असणे अनिवार्य आहे.</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#051C27] border border-teal-900/60 flex items-start gap-2.5">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span><strong>गुण व श्रेणी (Grading System):</strong> ९७%+ अचूकता व {targetSpeed + 8} WPM = A+ (विशेष प्राविण्य), ९४%+ = A श्रेणी, ९२%+ = B श्रेणी, ९०%+ = C श्रेणी.</span>
                </div>
                <div className="p-3 rounded-2xl bg-[#051C27] border border-teal-900/60 flex items-start gap-2.5">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span><strong>दोष व चुका (Mistake Penalty):</strong> प्रत्येक चुकीच्या अक्षरामुळे Net WPM मध्ये कपात केली जाते.</span>
                </div>
              </div>
            </div>

            {/* Selected Passage Preview */}
            <div className="mt-4 pt-3 border-t border-teal-900/50">
              <div className="text-xs font-semibold text-slate-400 mb-1.5">
                {language === 'mr' ? 'निवडलेला परिच्छेद:' : 'Selected Passage:'}
              </div>
              <p className="text-xs text-slate-300 italic line-clamp-2 bg-[#051C27] p-3 rounded-xl border border-teal-900/60">
                "{targetText}"
              </p>
            </div>
          </div>
        </div>
      ) : isExamRunning ? (
        /* Active Exam Layout */
        <div className="space-y-4">
          {/* Live Exam Header Telemetry */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#072431]/95 border border-teal-800/40 rounded-2xl p-4 flex items-center gap-3 shadow-lg">
              <div className="p-2.5 rounded-xl bg-[#051C27] text-cyan-300 border border-teal-900/60">
                <Timer className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">{language === 'mr' ? 'उर्वरित वेळ' : 'Remaining'}</div>
                <div className={`text-2xl font-black font-mono ${remainingSeconds < 60 ? 'text-rose-400 animate-pulse' : 'text-slate-100'}`}>
                  {Math.floor(remainingSeconds / 60)}:{(remainingSeconds % 60).toString().padStart(2, '0')}
                </div>
              </div>
            </div>

            <div className="bg-[#072431]/95 border border-teal-800/40 rounded-2xl p-4 flex items-center gap-3 shadow-lg">
              <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30">
                <Award className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">{language === 'mr' ? 'टंकलिखित शब्द' : 'Typed Words'}</div>
                <div className="text-2xl font-black font-mono text-teal-400">
                  {Math.round(currentIndex / 5)}
                </div>
              </div>
            </div>

            <div className="bg-[#072431]/95 border border-teal-800/40 rounded-2xl p-4 flex items-center gap-3 shadow-lg">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">{language === 'mr' ? 'झालेल्या चुका' : 'Mistakes'}</div>
                <div className="text-2xl font-black font-mono text-rose-400">
                  {mistakeIndexes.size.toString().padStart(2, '0')}
                </div>
              </div>
            </div>

            <div className="bg-[#072431]/95 border border-teal-800/40 rounded-2xl p-4 flex items-center justify-center shadow-lg">
              <button
                onClick={finishExam}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
              >
                {language === 'mr' ? 'पेपर जमा करा (Submit)' : 'Submit Exam'}
              </button>
            </div>
          </div>

          {/* Exam Typing Area */}
          <div
            onClick={() => inputRef.current?.focus()}
            className="w-full bg-[#051C27]/90 border border-teal-800/40 rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-2xl backdrop-blur-md min-h-[220px] flex flex-col justify-center cursor-text transition-all duration-200"
          >
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-teal-500 to-cyan-500" />

            <input
              ref={inputRef}
              type="text"
              id="exam-input-capture"
              className="absolute opacity-0 pointer-events-none w-0 h-0"
              value=""
              onChange={() => {}}
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
              autoFocus
            />

            <div
              className="flex flex-wrap items-baseline text-2xl sm:text-3xl leading-loose font-normal select-none py-2"
              style={{ fontFamily: "'Noto Sans Devanagari', 'Tiro Devanagari Marathi', sans-serif" }}
            >
              {wordGroups.map((group, wIdx) => {
                const isWordActive = (currentIndex >= group.startIndex && currentIndex <= group.endIndex) ||
                  (group.trailingSpace && currentIndex === group.trailingSpace.index);

                return (
                  <React.Fragment key={wIdx}>
                    <span
                      className={`inline-flex items-baseline mr-3.5 sm:mr-5 mb-2 transition-all duration-100 rounded-lg ${
                        isWordActive
                          ? 'bg-cyan-500/10 px-1.5 py-0.5 border-b-2 border-cyan-400/80 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                          : ''
                      }`}
                    >
                      {group.aksharas.map((akshara, aIdx) => {
                        const isAksharaCompleted = currentIndex >= akshara.endIndex;
                        const isAksharaActive = currentIndex >= akshara.startIndex && currentIndex < akshara.endIndex;

                        let hasError = false;
                        for (let i = akshara.startIndex; i < akshara.endIndex; i++) {
                          if (mistakeIndexes.has(i)) {
                            hasError = true;
                            break;
                          }
                        }

                        let charStyle = 'text-slate-500';
                        if (isAksharaCompleted) {
                          charStyle = hasError 
                            ? 'text-rose-400 bg-rose-950/60 rounded-xs px-0.5' 
                            : 'text-slate-200 font-semibold';
                        } else if (isAksharaActive) {
                          charStyle = 'text-cyan-200 border-b-2 border-cyan-400 bg-cyan-400/25 font-bold px-1 rounded-t shadow-[0_0_12px_rgba(6,182,212,0.3)] animate-pulse';
                        } else if (isWordActive) {
                          charStyle = 'text-slate-300 font-normal';
                        }

                        return (
                          <span
                            key={aIdx}
                            className={`transition-colors duration-75 ${charStyle}`}
                          >
                            {akshara.text}
                          </span>
                        );
                      })}

                      {/* Trailing Space indicator if followed by space */}
                      {group.trailingSpace && (() => {
                        const spIdx = group.trailingSpace.index;
                        const isTyped = spIdx < currentIndex;
                        const isCurrent = spIdx === currentIndex;
                        const hasError = mistakeIndexes.has(spIdx);

                        if (isCurrent) {
                          return (
                            <span
                              key={spIdx}
                              title={language === 'mr' ? 'स्पेस दाबा' : 'Press Space'}
                              className="inline-flex items-center justify-center ml-1 px-2 py-0.5 rounded text-xs font-mono font-bold border border-cyan-400/80 bg-cyan-500/25 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)] animate-pulse"
                            >
                              ␣
                            </span>
                          );
                        }
                        if (isTyped && hasError) {
                          return (
                            <span
                              key={spIdx}
                              className="inline-flex items-center justify-center ml-1 px-1.5 py-0.5 rounded text-xs border border-rose-500/50 bg-rose-950/60 text-rose-400"
                            >
                              ␣
                            </span>
                          );
                        }
                        return null;
                      })()}
                    </span>
                    {group.hasNewlineAfter && <div className="w-full h-0 basis-full" />}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Official GCC-TBC Certificate & Score Sheet */
        examResult && (
          <div id="exam-result-sheet" className="bg-[#072431]/95 border border-teal-800/40 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 backdrop-blur-md">
            {/* Certificate Header */}
            <div className="border-4 border-double border-teal-500/40 rounded-2xl p-6 sm:p-8 bg-gradient-to-b from-[#051C27] via-[#072431] to-[#051C27] text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Award className="w-48 h-48 text-cyan-400" />
              </div>

              <div className="flex items-center justify-center gap-2 text-cyan-300 mb-2">
                <Award className="w-8 h-8" />
                <span className="font-extrabold text-sm sm:text-base uppercase tracking-widest">
                  Maharashtra State Examination Council (GCC-TBC)
                </span>
              </div>

              <h3 className="text-xl sm:text-3xl font-black text-white mb-2">
                {language === 'mr' ? 'संगणक टंकलेखन प्रमाणपत्र निकाल पत्रक' : 'Computer Typing Assessment Score Card'}
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Government Certificate in Computer Typing Basic Course • Marathi {targetSpeed} WPM (ISM Remington)
              </p>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-base font-black border mb-6 shadow-xl uppercase">
                {examResult.passed ? (
                  <div className="bg-teal-500/20 text-teal-300 border-teal-500/40 flex items-center gap-2 px-4 py-1.5 rounded-full">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                    <span>उत्तीर्ण / PASSED • GRADE {examResult.grade}</span>
                  </div>
                ) : (
                  <div className="bg-rose-500/20 text-rose-300 border-rose-500/40 flex items-center gap-2 px-4 py-1.5 rounded-full">
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                    <span>अनुत्तीर्ण / NEEDS PRACTICE</span>
                  </div>
                )}
              </div>

              {/* Candidate Info Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#051C27] p-3.5 rounded-xl border border-teal-900/60 mb-6 text-left">
                <div>
                  <span className="text-slate-400 block">Candidate Name:</span>
                  <span className="font-bold text-slate-200">{candidateName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Seat Number:</span>
                  <span className="font-bold text-slate-200 font-mono">{seatNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Date of Exam:</span>
                  <span className="font-bold text-slate-200">{examResult.date}</span>
                </div>
              </div>

              {/* Score Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="p-3 bg-[#051C27] rounded-xl border border-teal-900/60 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Net Speed</div>
                  <div className="text-2xl font-black text-teal-400 font-mono mt-0.5">{examResult.netWpm} WPM</div>
                </div>
                <div className="p-3 bg-[#051C27] rounded-xl border border-teal-900/60 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Gross Speed</div>
                  <div className="text-2xl font-black text-slate-200 font-mono mt-0.5">{examResult.grossWpm} WPM</div>
                </div>
                <div className="p-3 bg-[#051C27] rounded-xl border border-teal-900/60 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Accuracy</div>
                  <div className="text-2xl font-black text-cyan-400 font-mono mt-0.5">{examResult.accuracy}%</div>
                </div>
                <div className="p-3 bg-[#051C27] rounded-xl border border-teal-900/60 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Errors / Deductions</div>
                  <div className="text-2xl font-black text-rose-400 font-mono mt-0.5">{examResult.totalErrors}</div>
                </div>
              </div>

              <p className="text-xs text-slate-300">
                {language === 'mr' ? examResult.remarksMr : examResult.remarksEn}
              </p>
            </div>

            {/* Actions: Print & Retake */}
            <div className="flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 bg-[#0B2E3F] hover:bg-[#0E3549] text-cyan-300 border border-teal-800/40 font-bold text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4 text-cyan-400" />
                <span>{language === 'mr' ? 'प्रमाणपत्र प्रिंट करा' : 'Print Certificate'}</span>
              </button>
              <button
                onClick={() => {
                  setExamResult(null);
                  setIsExamRunning(false);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-teal-500/25"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{language === 'mr' ? 'नवीन परीक्षा द्या' : 'Retake Exam'}</span>
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};
