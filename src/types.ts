export type Finger = 
  | 'left-pinky' 
  | 'left-ring' 
  | 'left-middle' 
  | 'left-index' 
  | 'thumb' 
  | 'right-index' 
  | 'right-middle' 
  | 'right-ring' 
  | 'right-pinky';

export interface KeyMapping {
  code: string; // e.g. 'KeyA', 'KeyG'
  key: string;  // e.g. 'a', 'g'
  normalChar: string; // e.g. 'ो', 'ह'
  shiftChar: string;  // e.g. 'ॉ', 'ळ'
  normalNameMr?: string;
  shiftNameMr?: string;
  finger: Finger;
  hand: 'left' | 'right' | 'thumb';
  row: 'number' | 'upper' | 'home' | 'lower' | 'space';
}

export type DrillType = 'keys' | 'words' | 'sentences' | 'paragraph';
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'all';

export interface ParagraphLotItem {
  id: string;
  titleEn: string;
  titleMr: string;
  level: 'easy' | 'medium' | 'hard';
  text: string;
}

export interface SentenceLotItem {
  id: string;
  level: 'easy' | 'medium' | 'hard';
  text: string;
}

export interface WordCategories {
  twoLetter?: string[];
  threeLetter?: string[];
  fourPlusLetter?: string[];
  lots?: string[];
}

export interface LessonStep {
  id: string;
  titleEn: string;
  titleMr: string;
  descriptionEn: string;
  descriptionMr: string;
  targetText: string;
  drillType?: DrillType;
  keysIntroduced?: string[];
  recommendedWpm?: number;
  // Multiple content lots & categories for randomized practice & difficulty grading
  lots?: string[];
  wordCategories?: WordCategories;
  sentenceLots?: SentenceLotItem[];
  paragraphLots?: ParagraphLotItem[];
}

export interface Chapter {
  id: number;
  titleEn: string;
  titleMr: string;
  subtitleEn: string;
  subtitleMr: string;
  descriptionEn: string;
  descriptionMr: string;
  iconName: string;
  lessons: LessonStep[];
}

export interface KeystrokeEvent {
  expected: string;
  actual: string;
  isCorrect: boolean;
  timestamp: number;
  key: string;
}

export interface TypingStats {
  wpm: number;
  netWpm: number;
  cpm: number;
  accuracy: number;
  totalKeystrokes: number;
  correctKeystrokes: number;
  errorKeystrokes: number;
  backspaceCount: number;
  elapsedSeconds: number;
  remainingSeconds?: number;
  errorCharMap: Record<string, number>;
  slowCharMap: Record<string, number[]>;
}

export type AppMode = 'lessons' | 'words' | 'exam' | 'custom' | 'analytics' | 'ai-passage';
export type SidebarTab = 'course' | 'ai-passage' | 'review' | 'exam' | 'custom' | 'analytics' | 'settings' | 'info';

export interface ExamConfig {
  targetSpeed: 30 | 40; // 30 WPM (GCC-TBC standard) or 40 WPM
  durationMinutes: number; // 2, 5, 7, or 10
  strictMode: boolean; // Backspace disabled or penalized
  passageId: string;
}

export interface ExamResult {
  candidateName: string;
  date: string;
  examType: string;
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  totalErrors: number;
  totalWords: number;
  timeSpentSeconds: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'Fail';
  passed: boolean;
  remarksEn: string;
  remarksMr: string;
}

export interface UserProgress {
  completedLessons: Record<string, { stars: number; bestWpm: number; accuracy: number }>;
  totalPracticeTimeSeconds: number;
  overallAccuracy: number;
  weakCharacters: Record<string, number>; // character -> error count
}
