import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Finger, LessonStep, TypingStats, UserProgress } from '../types';
import { getRemingtonKeyForChar, remingtonKeyToDevanagari, FINGER_COLORS } from '../data/remingtonMap';
import { calculateTypingStats, saveUserProgress } from '../utils/telemetry';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { useTheme } from '../context/ThemeContext';
import { 
  RotateCcw, 
  Play, 
  Pause, 
  ArrowRight, 
  CheckCircle, 
  Flame, 
  Target, 
  Clock, 
  Star,
  Shuffle,
  Layers,
  Sparkles,
  Filter,
  Dices,
  Volume2,
  VolumeX,
  Activity
} from 'lucide-react';

interface TypingAreaProps {
  lesson: LessonStep;
  onNextLesson?: () => void;
  userProgress: UserProgress;
  setUserProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
  language: 'mr' | 'en';
  onActiveTargetChange: (targetInfo: { key: string; isShift: boolean; code: string; finger: Finger; hand: string } | null) => void;
  onKeyPressedChange: (keys: Set<string>) => void;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  lesson,
  onNextLesson,
  userProgress,
  setUserProgress,
  language,
  onActiveTargetChange,
  onKeyPressedChange
}) => {
  // Content Variation & Filtering States
  const [activeWordFilter, setActiveWordFilter] = useState<'all' | '2-letter' | '3-letter' | '4-letter'>('all');
  const [activeLevelFilter, setActiveLevelFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [activeLotIndex, setActiveLotIndex] = useState<number>(0);
  const [activeTargetText, setActiveTargetText] = useState<string>(lesson.targetText);
  const [activePassageTitle, setActivePassageTitle] = useState<string>('');

  // Typing Session States
  const [typedText, setTypedText] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [mistakeIndexes, setMistakeIndexes] = useState<Set<number>>(new Set());
  const [errorCharMap, setErrorCharMap] = useState<Record<string, number>>({});
  
  // Timing & telemetry
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Metronome state
  const [isMetronomeOn, setIsMetronomeOn] = useState<boolean>(false);
  const [metronomeWpm, setMetronomeWpm] = useState<number>(30);
  const [beatPulse, setBeatPulse] = useState<boolean>(false);

  // Metronome beat callback
  const handleBeat = useCallback(() => {
    setBeatPulse(true);
    setTimeout(() => setBeatPulse(false), 120);
  }, []);

  const toggleMetronome = () => {
    sound.playKeyClick();
    const nextState = !isMetronomeOn;
    setIsMetronomeOn(nextState);
    if (nextState) {
      sound.setMetronomeBpm(metronomeWpm * 5); // 1 WPM = 5 CPM (keystrokes per minute)
      sound.startMetronome(handleBeat);
    } else {
      sound.stopMetronome();
    }
  };

  const changeMetronomeSpeed = (wpm: number) => {
    sound.playKeyClick();
    setMetronomeWpm(wpm);
    sound.setMetronomeBpm(wpm * 5);
  };

  useEffect(() => {
    return () => {
      sound.stopMetronome();
    };
  }, []);
  const [backspaceCount, setBackspaceCount] = useState<number>(0);
  const [liveStats, setLiveStats] = useState<TypingStats>({
    wpm: 0,
    netWpm: 0,
    cpm: 0,
    accuracy: 100,
    totalKeystrokes: 0,
    correctKeystrokes: 0,
    errorKeystrokes: 0,
    backspaceCount: 0,
    elapsedSeconds: 0,
    errorCharMap: {},
    slowCharMap: {}
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const pressedKeysRef = useRef<Set<string>>(new Set());

  // Determine current expected character
  const currentChar = activeTargetText[currentIndex] || '';
  const currentKeyInfo = getRemingtonKeyForChar(currentChar);

  // Notify parent of active key & finger placement
  useEffect(() => {
    onActiveTargetChange(currentKeyInfo);
  }, [currentChar, onActiveTargetChange]);

  // Compute text according to current filter & lot index
  const computeTargetText = useCallback((
    targetLesson: LessonStep,
    wordFilter: 'all' | '2-letter' | '3-letter' | '4-letter',
    levelFilter: 'all' | 'easy' | 'medium' | 'hard',
    lotIdx: number
  ): { text: string; title: string } => {
    const drillType = targetLesson.drillType || 'keys';

    // 1. Words Drill
    if (drillType === 'words' && targetLesson.wordCategories) {
      const cats = targetLesson.wordCategories;
      if (wordFilter === '2-letter' && cats.twoLetter && cats.twoLetter.length > 0) {
        return {
          text: cats.twoLetter.join(' '),
          title: language === 'mr' ? '२-अक्षरी शब्द सराव' : '2-Letter Words Drill'
        };
      }
      if (wordFilter === '3-letter' && cats.threeLetter && cats.threeLetter.length > 0) {
        return {
          text: cats.threeLetter.join(' '),
          title: language === 'mr' ? '३-अक्षरी शब्द सराव' : '3-Letter Words Drill'
        };
      }
      if (wordFilter === '4-letter' && cats.fourPlusLetter && cats.fourPlusLetter.length > 0) {
        return {
          text: cats.fourPlusLetter.join(' '),
          title: language === 'mr' ? '४-अक्षरी+ शब्द सराव' : '4-Letter+ Words Drill'
        };
      }
      // 'all' / mixed lots
      if (cats.lots && cats.lots.length > 0) {
        const selected = cats.lots[lotIdx % cats.lots.length];
        return {
          text: selected,
          title: language === 'mr' ? `मिश्र शब्द संच ${((lotIdx % cats.lots.length) + 1)}/${cats.lots.length}` : `Mixed Words Lot ${((lotIdx % cats.lots.length) + 1)}/${cats.lots.length}`
        };
      }
    }

    // 2. Sentences Drill
    if (drillType === 'sentences' && targetLesson.sentenceLots && targetLesson.sentenceLots.length > 0) {
      let candidateLots = targetLesson.sentenceLots;
      if (levelFilter !== 'all') {
        const filtered = targetLesson.sentenceLots.filter(l => l.level === levelFilter);
        if (filtered.length > 0) candidateLots = filtered;
      }
      const item = candidateLots[lotIdx % candidateLots.length];
      const levelLabelMr = item.level === 'easy' ? 'सोपे' : item.level === 'medium' ? 'मध्यम' : 'कठीण';
      const levelLabelEn = item.level.toUpperCase();
      return {
        text: item.text,
        title: language === 'mr' ? `वाक्य संच (${levelLabelMr}) ${((lotIdx % candidateLots.length) + 1)}/${candidateLots.length}` : `Sentence Lot (${levelLabelEn}) ${((lotIdx % candidateLots.length) + 1)}/${candidateLots.length}`
      };
    }

    // 3. Paragraph Drill
    if (drillType === 'paragraph' && targetLesson.paragraphLots && targetLesson.paragraphLots.length > 0) {
      let candidateLots = targetLesson.paragraphLots;
      if (levelFilter !== 'all') {
        const filtered = targetLesson.paragraphLots.filter(l => l.level === levelFilter);
        if (filtered.length > 0) candidateLots = filtered;
      }
      const item = candidateLots[lotIdx % candidateLots.length];
      return {
        text: item.text,
        title: language === 'mr' ? item.titleMr : item.titleEn
      };
    }

    // 4. Keys Drill or Fallback Lots
    if (targetLesson.lots && targetLesson.lots.length > 0) {
      const selected = targetLesson.lots[lotIdx % targetLesson.lots.length];
      return {
        text: selected,
        title: language === 'mr' ? `सराव संच ${((lotIdx % targetLesson.lots.length) + 1)}/${targetLesson.lots.length}` : `Drill Lot ${((lotIdx % targetLesson.lots.length) + 1)}/${targetLesson.lots.length}`
      };
    }

    return {
      text: targetLesson.targetText,
      title: language === 'mr' ? targetLesson.titleMr : targetLesson.titleEn
    };
  }, [language]);

  // Reset internal typing state
  const resetTypingEngine = useCallback((newText: string) => {
    setActiveTargetText(newText);
    setTypedText('');
    setCurrentIndex(0);
    setMistakeIndexes(new Set());
    setErrorCharMap({});
    setStartTime(null);
    setElapsedSeconds(0);
    setIsPaused(false);
    setIsCompleted(false);
    setBackspaceCount(0);
    pressedKeysRef.current.clear();
    onKeyPressedChange(new Set());
    if (timerRef.current) clearInterval(timerRef.current);
    
    setLiveStats({
      wpm: 0,
      netWpm: 0,
      cpm: 0,
      accuracy: 100,
      totalKeystrokes: 0,
      correctKeystrokes: 0,
      errorKeystrokes: 0,
      backspaceCount: 0,
      elapsedSeconds: 0,
      errorCharMap: {},
      slowCharMap: {}
    });

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, [onKeyPressedChange]);

  // When lesson changes, pick a randomized lot and reset
  useEffect(() => {
    setActiveWordFilter('all');
    setActiveLevelFilter('all');
    
    // Pick random lot index
    let randomLot = 0;
    if (lesson.drillType === 'paragraph' && lesson.paragraphLots && lesson.paragraphLots.length > 1) {
      randomLot = Math.floor(Math.random() * lesson.paragraphLots.length);
    } else if (lesson.drillType === 'sentences' && lesson.sentenceLots && lesson.sentenceLots.length > 1) {
      randomLot = Math.floor(Math.random() * lesson.sentenceLots.length);
    } else if (lesson.drillType === 'words' && lesson.wordCategories?.lots && lesson.wordCategories.lots.length > 1) {
      randomLot = Math.floor(Math.random() * lesson.wordCategories.lots.length);
    } else if (lesson.lots && lesson.lots.length > 1) {
      randomLot = Math.floor(Math.random() * lesson.lots.length);
    }

    setActiveLotIndex(randomLot);
    const { text, title } = computeTargetText(lesson, 'all', 'all', randomLot);
    setActivePassageTitle(title);
    resetTypingEngine(text);
  }, [lesson, computeTargetText, resetTypingEngine]);

  // Handler to shuffle / change lot
  const handleShuffleLot = (randomize: boolean = true) => {
    sound.playKeyClick();
    let nextIdx = activeLotIndex + 1;
    if (randomize) {
      const maxLots = 4;
      nextIdx = Math.floor(Math.random() * maxLots);
      if (nextIdx === activeLotIndex) nextIdx = (nextIdx + 1) % maxLots;
    }
    setActiveLotIndex(nextIdx);
    const { text, title } = computeTargetText(lesson, activeWordFilter, activeLevelFilter, nextIdx);
    setActivePassageTitle(title);
    resetTypingEngine(text);
  };

  // Handler for word category change
  const handleWordFilterChange = (filter: 'all' | '2-letter' | '3-letter' | '4-letter') => {
    sound.playKeyClick();
    setActiveWordFilter(filter);
    const { text, title } = computeTargetText(lesson, filter, activeLevelFilter, activeLotIndex);
    setActivePassageTitle(title);
    resetTypingEngine(text);
  };

  // Handler for difficulty level change
  const handleLevelFilterChange = (filter: 'all' | 'easy' | 'medium' | 'hard') => {
    sound.playKeyClick();
    setActiveLevelFilter(filter);
    const { text, title } = computeTargetText(lesson, activeWordFilter, filter, activeLotIndex);
    setActivePassageTitle(title);
    resetTypingEngine(text);
  };

  // Live Timer Interval
  useEffect(() => {
    if (startTime && !isPaused && !isCompleted) {
      timerRef.current = setInterval(() => {
        const secs = Math.max(1, Math.floor((Date.now() - startTime) / 1000));
        setElapsedSeconds(secs);

        const currentTotalKeys = currentIndex;
        const currentErrors = mistakeIndexes.size;
        const currentCorrect = Math.max(0, currentTotalKeys - currentErrors);

        const stats = calculateTypingStats(
          currentCorrect,
          currentErrors,
          backspaceCount,
          secs,
          errorCharMap
        );

        setLiveStats(stats);
      }, 500);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, isPaused, isCompleted, currentIndex, mistakeIndexes.size, backspaceCount, errorCharMap]);

  // Handle lesson completion
  const handleComplete = useCallback(() => {
    setIsCompleted(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const finalSeconds = startTime ? Math.max(1, Math.floor((Date.now() - startTime) / 1000)) : elapsedSeconds;
    const finalTotal = activeTargetText.length;
    const finalErrors = mistakeIndexes.size;
    const finalCorrect = Math.max(0, finalTotal - finalErrors);

    const finalStats = calculateTypingStats(
      finalCorrect,
      finalErrors,
      backspaceCount,
      finalSeconds,
      errorCharMap
    );

    setLiveStats(finalStats);

    // Audio & Confetti
    sound.playSuccessSound();
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    // Award Stars
    let stars: 1 | 2 | 3 = 1;
    if (finalStats.accuracy >= 95 && finalStats.wpm >= (lesson.recommendedWpm || 20)) {
      stars = 3;
    } else if (finalStats.accuracy >= 85) {
      stars = 2;
    }

    // Update global progress in state and local storage
    setUserProgress(prev => {
      const prevLesson = prev.completedLessons[lesson.id];
      const bestWpm = Math.max(prevLesson?.bestWpm || 0, finalStats.wpm);
      const bestStars = Math.max(prevLesson?.stars || 0, stars);

      const updatedWeak = { ...prev.weakCharacters };
      Object.entries(errorCharMap).forEach(([ch, count]) => {
        updatedWeak[ch] = (updatedWeak[ch] || 0) + count;
      });

      const updated: UserProgress = {
        ...prev,
        completedLessons: {
          ...prev.completedLessons,
          [lesson.id]: {
            stars: bestStars,
            bestWpm,
            accuracy: finalStats.accuracy
          }
        },
        totalPracticeTimeSeconds: prev.totalPracticeTimeSeconds + finalSeconds,
        weakCharacters: updatedWeak
      };

      saveUserProgress(updated);
      return updated;
    });
  }, [startTime, elapsedSeconds, activeTargetText.length, mistakeIndexes.size, backspaceCount, errorCharMap, lesson, setUserProgress]);

  // Core Keystroke Engine: Listen and map ISM Remington keys in real time
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Ignore meta keys
    if (e.key === 'Tab' || e.key === 'Alt' || e.key === 'Control' || e.key === 'Meta' || e.key === 'CapsLock') {
      return;
    }

    // Track pressed keys for visual keyboard animation
    pressedKeysRef.current.add(e.code);
    pressedKeysRef.current.add(e.key.toLowerCase());
    onKeyPressedChange(new Set(pressedKeysRef.current));

    // Handle Backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      sound.playKeyClick();
      if (currentIndex > 0) {
        setBackspaceCount(prev => prev + 1);
        setCurrentIndex(prev => prev - 1);
        setTypedText(prev => prev.slice(0, -1));
      }
      return;
    }

    if (isCompleted || isPaused) return;

    // Start timer on first keypress
    if (!startTime) {
      setStartTime(Date.now());
    }

    e.preventDefault();

    // Map physical key to Marathi Devanagari character
    let devanagariChar: string | null = null;

    if (e.key === ' ') {
      devanagariChar = ' ';
    } else if (e.key.length === 1) {
      const isShift = e.shiftKey;
      devanagariChar = remingtonKeyToDevanagari(e.key, isShift, e.code);
      
      // Fallback: If user has Devanagari IME layout active
      if (!devanagariChar && /[\u0900-\u097F]/.test(e.key)) {
        devanagariChar = e.key;
      }
    }

    if (!devanagariChar) return;

    // Check against expected character
    const expected = activeTargetText[currentIndex];
    const isMatch = devanagariChar === expected;

    if (isMatch) {
      sound.playKeyClick();
      setTypedText(prev => prev + devanagariChar);
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);

      if (nextIdx >= activeTargetText.length) {
        handleComplete();
      }
    } else {
      sound.playErrorSound();
      setMistakeIndexes(prev => new Set(prev).add(currentIndex));
      setErrorCharMap(prev => ({
        ...prev,
        [expected]: (prev[expected] || 0) + 1
      }));
      setTypedText(prev => prev + devanagariChar);
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);

      if (nextIdx >= activeTargetText.length) {
        handleComplete();
      }
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    pressedKeysRef.current.delete(e.code);
    pressedKeysRef.current.delete(e.key.toLowerCase());
    onKeyPressedChange(new Set(pressedKeysRef.current));
  };

  // Keep focus locked to hidden input for seamless instant typing
  const { isDark } = useTheme();

  const keepFocus = () => {
    inputRef.current?.focus();
  };

  const fingerInfo = currentKeyInfo?.finger ? FINGER_COLORS[currentKeyInfo.finger] : null;
  const progressPercent = activeTargetText.length > 0 ? Math.round((currentIndex / activeTargetText.length) * 100) : 0;
  const drillType = lesson.drillType || 'keys';

  return (
    <div id="typing-stage-wrapper" className="w-full flex flex-col gap-3.5">
      {/* Top Telemetry & Progress Bar */}
      <div className={`rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md border transition-all duration-200 ${
        isDark 
          ? 'bg-[#072431]/95 border-teal-800/40' 
          : 'bg-white/95 border-teal-200/80 shadow-teal-900/5'
      }`}>
        {/* Lesson Info */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className={`px-3 py-1 text-xs font-mono font-bold rounded-lg shrink-0 border ${
            isDark 
              ? 'bg-teal-500/15 border-teal-500/30 text-teal-300' 
              : 'bg-teal-50 border-teal-200 text-teal-700'
          }`}>
            {lesson.id}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {language === 'mr' ? lesson.titleMr : lesson.titleEn}
              </h2>
              {activePassageTitle && activePassageTitle !== (language === 'mr' ? lesson.titleMr : lesson.titleEn) && (
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded border hidden md:inline truncate ${
                  isDark 
                    ? 'text-cyan-300 bg-cyan-950/60 border-cyan-800/40' 
                    : 'text-teal-800 bg-teal-50 border-teal-200'
                }`}>
                  {activePassageTitle}
                </span>
              )}
            </div>
            <p className={`text-xs truncate ${isDark ? 'text-cyan-200/70' : 'text-slate-500'}`}>
              {language === 'mr' ? lesson.descriptionMr : lesson.descriptionEn}
            </p>
          </div>
        </div>

        {/* Live Metrics Pill Group */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Speed */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
            isDark 
              ? 'bg-[#051C27] border-teal-900/60' 
              : 'bg-teal-50/70 border-teal-200'
          }`}>
            <Flame className={`w-4 h-4 ${isDark ? 'text-teal-400' : 'text-teal-600'}`} />
            <div className={`text-xs font-mono font-bold ${isDark ? 'text-teal-400' : 'text-teal-700'}`}>
              {liveStats.wpm} <span className={`text-[10px] font-sans ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>WPM</span>
            </div>
          </div>

          {/* Accuracy */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
            isDark 
              ? 'bg-[#051C27] border-teal-900/60' 
              : 'bg-cyan-50/70 border-cyan-200'
          }`}>
            <Target className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
            <div className={`text-xs font-mono font-bold ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>
              {liveStats.accuracy}%
            </div>
          </div>

          {/* Time */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
            isDark 
              ? 'bg-[#051C27] border-teal-900/60' 
              : 'bg-slate-50 border-slate-200'
          }`}>
            <Clock className={`w-4 h-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
            <div className={`text-xs font-mono font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
              {Math.floor(elapsedSeconds / 60).toString().padStart(2, '0')}:{(elapsedSeconds % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>

      {/* Variation & Difficulty Filter Strip (For Words, Sentences & Paragraphs) */}
      <div className={`rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-2.5 text-xs border transition-colors ${
        isDark 
          ? 'bg-[#051C27]/90 border-teal-900/60' 
          : 'bg-white border-teal-200/80 shadow-sm'
      }`}>
        {/* Left Side: Filter Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {drillType === 'words' && lesson.wordCategories && (
            <>
              <span className={`text-[11px] font-bold flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <Filter className={`w-3 h-3 ${isDark ? 'text-teal-400' : 'text-teal-600'}`} />
                {language === 'mr' ? 'शब्द लांबी:' : 'Word Filter:'}
              </span>
              <div className={`flex items-center gap-1 p-0.5 rounded-xl border ${
                isDark ? 'bg-[#072431] border-teal-800/40' : 'bg-slate-100 border-slate-200'
              }`}>
                <button
                  onClick={() => handleWordFilterChange('all')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                    activeWordFilter === 'all'
                      ? isDark
                        ? 'bg-teal-500 text-slate-950 shadow-sm'
                        : 'bg-teal-600 text-white shadow-sm'
                      : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {language === 'mr' ? 'सर्व मिश्र' : 'All Mixed'}
                </button>
                {lesson.wordCategories.twoLetter && (
                  <button
                    onClick={() => handleWordFilterChange('2-letter')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                      activeWordFilter === '2-letter'
                        ? isDark
                          ? 'bg-cyan-500 text-slate-950 shadow-sm'
                          : 'bg-cyan-600 text-white shadow-sm'
                        : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {language === 'mr' ? '२-अक्षरी' : '2-Letter'}
                  </button>
                )}
                {lesson.wordCategories.threeLetter && (
                  <button
                    onClick={() => handleWordFilterChange('3-letter')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                      activeWordFilter === '3-letter'
                        ? isDark
                          ? 'bg-cyan-500 text-slate-950 shadow-sm'
                          : 'bg-cyan-600 text-white shadow-sm'
                        : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {language === 'mr' ? '३-अक्षरी' : '3-Letter'}
                  </button>
                )}
                {lesson.wordCategories.fourPlusLetter && (
                  <button
                    onClick={() => handleWordFilterChange('4-letter')}
                    className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                      activeWordFilter === '4-letter'
                        ? isDark
                          ? 'bg-cyan-500 text-slate-950 shadow-sm'
                          : 'bg-cyan-600 text-white shadow-sm'
                        : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {language === 'mr' ? '४-अक्षरी+' : '4-Letter+'}
                  </button>
                )}
              </div>
            </>
          )}

          {(drillType === 'sentences' || drillType === 'paragraph') && (
            <>
              <span className={`text-[11px] font-bold flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <Layers className={`w-3 h-3 ${isDark ? 'text-teal-400' : 'text-teal-600'}`} />
                {language === 'mr' ? 'काठिण्य पातळी:' : 'Difficulty:'}
              </span>
              <div className={`flex items-center gap-1 p-0.5 rounded-xl border ${
                isDark ? 'bg-[#072431] border-teal-800/40' : 'bg-slate-100 border-slate-200'
              }`}>
                <button
                  onClick={() => handleLevelFilterChange('all')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                    activeLevelFilter === 'all'
                      ? isDark
                        ? 'bg-teal-500 text-slate-950 shadow-sm'
                        : 'bg-teal-600 text-white shadow-sm'
                      : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {language === 'mr' ? 'सर्व' : 'All'}
                </button>
                <button
                  onClick={() => handleLevelFilterChange('easy')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                    activeLevelFilter === 'easy'
                      ? isDark
                        ? 'bg-emerald-500 text-slate-950 shadow-sm'
                        : 'bg-emerald-600 text-white shadow-sm'
                      : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {language === 'mr' ? 'सोपे (Easy)' : 'Easy'}
                </button>
                <button
                  onClick={() => handleLevelFilterChange('medium')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                    activeLevelFilter === 'medium'
                      ? isDark
                        ? 'bg-cyan-500 text-slate-950 shadow-sm'
                        : 'bg-cyan-600 text-white shadow-sm'
                      : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {language === 'mr' ? 'मध्यम (Medium)' : 'Medium'}
                </button>
                <button
                  onClick={() => handleLevelFilterChange('hard')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                    activeLevelFilter === 'hard'
                      ? isDark
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'bg-amber-600 text-white shadow-sm'
                      : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {language === 'mr' ? 'कठीण (Hard)' : 'Hard'}
                </button>
              </div>
            </>
          )}

          {drillType === 'keys' && (
            <div className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-teal-300' : 'text-teal-700 font-semibold'}`}>
              <Sparkles className={`w-3.5 h-3.5 ${isDark ? 'text-cyan-400' : 'text-teal-600'}`} />
              <span>{language === 'mr' ? 'अक्षरे व कीज अचूकता सराव संच' : 'Alphabet & Key Precision Sets'}</span>
            </div>
          )}
        </div>

        {/* Right Side: Metronome & Shuffle Lot Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Metronome Cadencer Button */}
          <div className={`flex items-center gap-1 p-0.5 rounded-xl border ${
            isDark ? 'bg-[#072431] border-teal-800/50' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={toggleMetronome}
              title={language === 'mr' ? 'लयबद्ध मेट्रोनाम आवाज सुरू/बंद करा' : 'Toggle Metronome Audio Rhythm'}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isMetronomeOn
                  ? isDark
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-black shadow-md'
                    : 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-black shadow-md'
                  : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className={`w-3.5 h-3.5 ${beatPulse ? 'text-rose-600 scale-125 transition-transform' : ''}`} />
              <span>{isMetronomeOn ? `${metronomeWpm} WPM` : (language === 'mr' ? 'मेट्रोनाम' : 'Metronome')}</span>
            </button>

            {isMetronomeOn && (
              <div className="flex items-center gap-0.5 pr-1">
                {[20, 30, 40].map(spd => (
                  <button
                    key={spd}
                    onClick={() => changeMetronomeSpeed(spd)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all ${
                      metronomeWpm === spd 
                        ? (isDark ? 'bg-cyan-400 text-slate-950 font-black' : 'bg-teal-600 text-white font-black') 
                        : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')
                    }`}
                  >
                    {spd}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => handleShuffleLot(true)}
            title={language === 'mr' ? 'नवीन सराव संच निवडा' : 'Randomize / Next Lot'}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-bold transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-[0.98] border ${
              isDark 
                ? 'bg-[#072E3F] hover:bg-[#0B3A4F] text-cyan-300 hover:text-white border-teal-700/50' 
                : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border-teal-200'
            }`}
          >
            <Dices className={`w-3.5 h-3.5 ${isDark ? 'text-teal-400' : 'text-teal-600'}`} />
            <span>{language === 'mr' ? 'नवीन संच (Lot)' : 'Shuffle Lot'}</span>
          </button>
        </div>
      </div>

      {/* Main Typing Stage */}
      <div
        id="typing-arena-box"
        onClick={keepFocus}
        className={`w-full rounded-3xl p-6 sm:p-8 relative shadow-2xl backdrop-blur-md flex flex-col justify-between cursor-text transition-all duration-200 min-h-[220px] border ${
          isDark 
            ? 'bg-[#072431]/90 border-teal-800/40' 
            : 'bg-white/95 border-teal-200/80 shadow-teal-900/5'
        }`}
      >
        {/* Progress Bar Top Edge */}
        <div className={`absolute top-0 left-0 w-full h-1 rounded-t-3xl overflow-hidden ${
          isDark ? 'bg-[#051C27]' : 'bg-slate-100'
        }`}>
          <div 
            className={`h-full transition-all duration-150 ${
              isDark 
                ? 'bg-gradient-to-r from-teal-500 to-cyan-400' 
                : 'bg-gradient-to-r from-teal-600 to-cyan-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Hidden Input capturing keyboard events */}
        <input
          ref={inputRef}
          type="text"
          id="keystroke-capture-input"
          className="absolute opacity-0 pointer-events-none w-0 h-0"
          value=""
          onChange={() => {}}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          autoFocus
          tabIndex={0}
        />

        {/* Text Display with Live Active Caret */}
        <div
          ref={textContainerRef}
          className="flex flex-wrap gap-x-2 gap-y-3 text-2xl sm:text-3xl md:text-4xl font-medium tracking-wide leading-relaxed select-none items-center py-4"
          style={{ fontFamily: "'Noto Sans Devanagari', 'Tiro Devanagari Marathi', sans-serif" }}
        >
          {activeTargetText.split('').map((char, index) => {
            const isTyped = index < currentIndex;
            const isCurrent = index === currentIndex;
            const hasError = mistakeIndexes.has(index);

            let charClass = isDark ? 'text-slate-600' : 'text-slate-400';
            if (isTyped) {
              charClass = hasError 
                ? (isDark ? 'text-rose-400 bg-rose-950/40 rounded px-1' : 'text-rose-600 bg-rose-100 rounded px-1') 
                : (isDark ? 'text-slate-200' : 'text-teal-900 font-semibold');
            } else if (isCurrent) {
              charClass = isDark 
                ? 'text-cyan-200 border-b-4 border-cyan-400 bg-cyan-500/20 px-1.5 rounded-t font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] animate-pulse'
                : 'text-teal-950 border-b-4 border-teal-600 bg-teal-100/90 px-1.5 rounded-t font-bold shadow-[0_0_15px_rgba(13,148,136,0.3)] animate-pulse';
            }

            return (
              <span
                key={index}
                className={`relative inline-block transition-colors duration-100 ${charClass}`}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            );
          })}
        </div>

        {/* Dynamic Key & Finger Placement Strip */}
        <div className={`mt-4 pt-4 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          isDark ? 'border-teal-900/50' : 'border-teal-100'
        }`}>
          {/* Key & Finger Recommendation */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border shadow-inner ${
              isDark 
                ? 'bg-[#051C27] border-teal-900/70' 
                : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`text-[10px] uppercase font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {language === 'mr' ? 'की:' : 'Key:'}
              </span>
              <span className={`text-base sm:text-lg font-black font-mono ${isDark ? 'text-cyan-300' : 'text-teal-700'}`}>
                {currentKeyInfo 
                  ? (currentKeyInfo.isShift ? `Shift + ${currentKeyInfo.key.toUpperCase()}` : currentKeyInfo.key.toUpperCase()) 
                  : (currentChar === ' ' ? 'Spacebar ␣' : currentChar)}
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                isDark 
                  ? 'text-slate-300 bg-[#0B2A3A] border-teal-800/40' 
                  : 'text-slate-700 bg-white border-slate-200 shadow-sm'
              }`}>
                ({currentChar === ' ' ? 'स्पेस' : currentChar})
              </span>
            </div>

            {fingerInfo && (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                isDark ? `${fingerInfo.bg} ${fingerInfo.border}` : 'bg-teal-50 border-teal-200 text-teal-800'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-cyan-400' : 'bg-teal-600'}`} />
                <span className="font-bold">
                  {language === 'mr' ? fingerInfo.nameMr : fingerInfo.nameEn}
                </span>
                {currentKeyInfo?.isShift && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ml-1 border ${
                    isDark 
                      ? 'text-amber-300 bg-amber-950/60 border-amber-800/40' 
                      : 'text-amber-800 bg-amber-50 border-amber-200'
                  }`}>
                    {language === 'mr' ? 'शिफ्ट वापरा' : 'Hold Shift'}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Quick Actions & Progress Counter */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {currentIndex} / {activeTargetText.length} ({progressPercent}%)
            </span>

            <button
              id="reset-lesson-btn"
              onClick={() => resetTypingEngine(activeTargetText)}
              title={language === 'mr' ? 'पुन्हा सुरू करा' : 'Restart'}
              className={`p-2 rounded-xl text-xs transition-all cursor-pointer shadow-sm border ${
                isDark 
                  ? 'bg-[#051C27] hover:bg-[#0B2E3F] border-teal-900/60 text-slate-300 hover:text-cyan-300' 
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              id="pause-lesson-btn"
              onClick={() => setIsPaused(prev => !prev)}
              title={isPaused ? 'Resume' : 'Pause'}
              className={`p-2 rounded-xl text-xs transition-all cursor-pointer shadow-sm border ${
                isDark 
                  ? 'bg-[#051C27] hover:bg-[#0B2E3F] border-teal-900/60 text-slate-300 hover:text-cyan-300' 
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-teal-600" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Lesson Completed Modal */}
      {isCompleted && (
        <div id="lesson-complete-modal" className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-200 border ${
            isDark 
              ? 'bg-[#072431] border-teal-500/40' 
              : 'bg-white border-teal-200'
          }`}>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg border ${
              isDark 
                ? 'bg-teal-500/20 border-teal-500/40 text-teal-400 shadow-teal-500/20' 
                : 'bg-teal-50 border-teal-200 text-teal-600 shadow-teal-600/10'
            }`}>
              <CheckCircle className="w-8 h-8" />
            </div>

            <h3 className={`text-xl sm:text-2xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {language === 'mr' ? 'अभिनंदन! धडा पूर्ण झाला!' : 'Great Job! Lesson Completed!'}
            </h3>
            <p className={`text-xs mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {language === 'mr' ? lesson.titleMr : lesson.titleEn}
            </p>

            {/* Stars */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {[1, 2, 3].map(s => {
                const earned = liveStats.accuracy >= 95 && liveStats.wpm >= (lesson.recommendedWpm || 20) 
                  ? s <= 3 
                  : (liveStats.accuracy >= 85 ? s <= 2 : s <= 1);
                return (
                  <Star
                    key={s}
                    className={`w-8 h-8 ${earned ? 'text-amber-400 fill-amber-400 drop-shadow-md' : (isDark ? 'text-slate-700' : 'text-slate-300')}`}
                  />
                );
              })}
            </div>

            {/* Stats Grid */}
            <div className={`grid grid-cols-3 gap-2 p-4 rounded-2xl border mb-6 ${
              isDark ? 'bg-[#051C27] border-teal-900/60' : 'bg-slate-50 border-slate-200'
            }`}>
              <div>
                <div className={`text-[10px] uppercase font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'mr' ? 'गती' : 'Speed'}</div>
                <div className={`text-xl font-black font-mono mt-0.5 ${isDark ? 'text-teal-400' : 'text-teal-600'}`}>{liveStats.wpm} <span className="text-[10px] opacity-70">WPM</span></div>
              </div>
              <div>
                <div className={`text-[10px] uppercase font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'mr' ? 'अचूकता' : 'Accuracy'}</div>
                <div className={`text-xl font-black font-mono mt-0.5 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>{liveStats.accuracy}%</div>
              </div>
              <div>
                <div className={`text-[10px] uppercase font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{language === 'mr' ? 'वेळ' : 'Time'}</div>
                <div className={`text-xl font-black font-mono mt-0.5 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{elapsedSeconds}s</div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleShuffleLot(true)}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${
                  isDark 
                    ? 'bg-[#0B2E3F] hover:bg-[#0E3549] text-slate-200 border-teal-800/40' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                <Shuffle className={`w-3.5 h-3.5 ${isDark ? 'text-cyan-400' : 'text-teal-600'}`} />
                <span>{language === 'mr' ? 'पुन्हा सराव करा (नवीन संच)' : 'Practice Next Lot'}</span>
              </button>
              {onNextLesson && (
                <button
                  onClick={() => {
                    onNextLesson();
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg ${
                    isDark 
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 shadow-teal-500/25' 
                      : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white shadow-teal-600/25'
                  }`}
                >
                  <span>{language === 'mr' ? 'पुढील धडा' : 'Next Lesson'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
