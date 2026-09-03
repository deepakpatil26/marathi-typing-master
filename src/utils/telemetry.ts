import { TypingStats, ExamResult, UserProgress } from '../types';

export const USER_PROGRESS_STORAGE_KEY = 'marathi_typing_master_progress';

export function getStoredUserProgress(): UserProgress {
  try {
    const saved = localStorage.getItem(USER_PROGRESS_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore
  }
  return {
    completedLessons: {},
    totalPracticeTimeSeconds: 0,
    overallAccuracy: 100,
    weakCharacters: {},
  };
}

export function saveUserProgress(progress: UserProgress) {
  try {
    localStorage.setItem(USER_PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // ignore
  }
}

// Calculate standard typing metrics
export function calculateTypingStats(
  correctChars: number,
  errorChars: number,
  backspaces: number,
  elapsedSeconds: number,
  errorCharMap: Record<string, number> = {}
): TypingStats {
  const safeSeconds = Math.max(1, elapsedSeconds);
  const minutes = safeSeconds / 60;
  
  // Standard metric: 5 characters = 1 word
  const grossWords = (correctChars + errorChars) / 5;
  const netWords = Math.max(0, correctChars) / 5;

  const wpm = Math.round(grossWords / minutes);
  const netWpm = Math.round(netWords / minutes);
  const cpm = Math.round((correctChars + errorChars) / minutes);
  
  const totalAttempts = correctChars + errorChars;
  const accuracy = totalAttempts > 0 
    ? Math.round((correctChars / totalAttempts) * 1000) / 10 
    : 100;

  return {
    wpm,
    netWpm,
    cpm,
    accuracy,
    totalKeystrokes: totalAttempts,
    correctKeystrokes: correctChars,
    errorKeystrokes: errorChars,
    backspaceCount: backspaces,
    elapsedSeconds,
    errorCharMap,
    slowCharMap: {},
  };
}

// Compute official GCC-TBC Exam result
export function evaluateGccTbcExam(
  candidateName: string,
  targetSpeed: 30 | 40,
  timeLimitMinutes: number,
  totalTypedChars: number,
  correctChars: number,
  mistakeCount: number,
  timeSpentSeconds: number
): ExamResult {
  const safeSeconds = Math.max(1, timeSpentSeconds);
  const actualMinutes = safeSeconds / 60;

  // GCC-TBC uses standard word count of 5 chars
  const grossWpm = Math.round((totalTypedChars / 5) / actualMinutes);
  
  // Official penalty: 1 word deduction per mistake
  const mistakeWords = mistakeCount;
  const netWpm = Math.max(0, Math.round(((totalTypedChars / 5) - mistakeWords) / actualMinutes));

  const accuracy = totalTypedChars > 0 
    ? Math.round((correctChars / totalTypedChars) * 1000) / 10 
    : 100;

  const passed = netWpm >= targetSpeed && accuracy >= 90;

  let grade: 'A+' | 'A' | 'B' | 'C' | 'Fail' = 'Fail';
  if (passed) {
    if (netWpm >= targetSpeed + 8 && accuracy >= 97) {
      grade = 'A+';
    } else if (netWpm >= targetSpeed + 4 && accuracy >= 94) {
      grade = 'A';
    } else if (netWpm >= targetSpeed && accuracy >= 92) {
      grade = 'B';
    } else {
      grade = 'C';
    }
  }

  const remarksEn = passed
    ? `Passed GCC-TBC Marathi ${targetSpeed} WPM certification exam with Grade ${grade}.`
    : `Could not achieve minimum speed (${targetSpeed} WPM) or 90% accuracy benchmark. Needs further practice.`;

  const remarksMr = passed
    ? `GCC-TBC मराठी ${targetSpeed} श.प्र.मि. संगणक टंकलेखन परीक्षा '${grade}' श्रेणीमध्ये यशस्वीरीत्या उत्तीर्ण.`
    : `किमान गती (${targetSpeed} श.प्र.मि.) किंवा ९०% अचूकता गाठता आली नाही. अधिक सरावाची गरज आहे.`;

  return {
    candidateName: candidateName.trim() || 'परीक्षार्थी (Candidate)',
    date: new Date().toLocaleDateString('mr-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    examType: `GCC-TBC Marathi ${targetSpeed} WPM Exam (ISM Remington)`,
    grossWpm,
    netWpm,
    accuracy,
    totalErrors: mistakeCount,
    totalWords: Math.round(totalTypedChars / 5),
    timeSpentSeconds,
    grade,
    passed,
    remarksEn,
    remarksMr
  };
}
