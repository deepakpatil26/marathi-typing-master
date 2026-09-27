/**
 * Automated Verification & Regression Suite for Marathi Typing Master
 * Tests:
 * 1. ISM Remington DVBW Key Mappings
 * 2. Tokenizer & Akshara Decomposition (ि first, र् Reph after, broken consonants, matras)
 * 3. Keystroke Matcher (matchUserKeystroke)
 * 4. GCC-TBC 30 & 40 WPM Scoring Formulas & Mistake Penalties
 */

import {
  remingtonKeyToDevanagari,
  decomposeTextToRemingtonTokens,
  matchUserKeystroke,
} from '../src/data/remingtonMap';
import {
  calculateTypingStats,
  evaluateGccTbcExam,
} from '../src/utils/telemetry';

let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${testName} ${detail ? `(${detail})` : ''}`);
    failedTests++;
  }
}

console.log('====================================================');
console.log('🚀 Running Marathi Typing Master Regression Test Suite');
console.log('====================================================\n');

// ----------------------------------------------------
// 1. Remington Map Invariants
// ----------------------------------------------------
console.log('📋 Test Group 1: ISM Remington Key Mappings');

assert(remingtonKeyToDevanagari('d', false) === 'क', 'Key [d] maps to Ka (क)');
assert(
  remingtonKeyToDevanagari('d', true) === 'क्',
  'Shift+[D] maps to half-Ka (क्)',
);
assert(
  remingtonKeyToDevanagari('k', false) === 'ा',
  'Key [k] maps to Aa-kar (ा)',
);
assert(
  remingtonKeyToDevanagari('f', false, 'KeyF') === 'ि' &&
    remingtonKeyToDevanagari('h', false, 'KeyH') === 'ी' &&
    remingtonKeyToDevanagari('q', false, 'KeyQ') === 'ु',
  'Remington keys map to first/second velanti and U-kar signs',
);
assert(
  remingtonKeyToDevanagari('s', false) === 'े',
  'Key [s] maps to E-kar (े)',
);
assert(remingtonKeyToDevanagari('j', false) === 'र', 'Key [j] maps to Ra (र)');
assert(remingtonKeyToDevanagari('l', false) === 'स', 'Key [l] maps to Sa (स)');
assert(remingtonKeyToDevanagari(';', false) === 'य', 'Key [;] maps to Ya (य)');
assert(remingtonKeyToDevanagari('u', false) === 'न', 'Key [u] maps to Na (न)');
assert(remingtonKeyToDevanagari('i', false) === 'प', 'Key [i] maps to Pa (प)');
assert(remingtonKeyToDevanagari('m', false) === 'उ', 'Key [m] maps to U (उ)');
assert(
  remingtonKeyToDevanagari('e', true) === 'म्',
  'Shift+[E] maps to half-M (म्)',
);
assert(
  remingtonKeyToDevanagari('/', false, 'Slash') === 'ध्',
  'Slash maps to the Remington half-Dha output (ध्)',
);
assert(
  remingtonKeyToDevanagari('z', false, 'KeyZ') === '्र' &&
    remingtonKeyToDevanagari('z', true, 'KeyZ') === 'र्',
  'KeyZ normal and Shift outputs preserve both Remington ra forms',
);

// ----------------------------------------------------
// 2. Tokenizer & Akshara Decomposition Invariants
// ----------------------------------------------------
console.log('\n📋 Test Group 2: Remington Tokenizer & Keystroke Decomposer');

// Test 2.1: Pahili Vilanti (ि) is preposed (key 'f' first)
const tokensJiddi = decomposeTextToRemingtonTokens('जिद्दी');
assert(
  tokensJiddi.length > 0 &&
    tokensJiddi[0].key === 'f' &&
    tokensJiddi[0].charProduced === 'ि' &&
    tokensJiddi[1].key === 't' &&
    tokensJiddi[1].charProduced === 'ज',
  'जिद्दी: Pahili Vilanti (key f) is typed BEFORE consonant ja (key t)',
);

// Test 2.2: Broken Gha (Shift+/) + stem (k) + kana (k) + matra (s) for घोटाला
const tokensGhotala = decomposeTextToRemingtonTokens('घोटाला');
assert(
  tokensGhotala[0].key === '/' &&
    tokensGhotala[0].isShift === true &&
    tokensGhotala[1].key === 'k' &&
    tokensGhotala[2].key === 'k' &&
    tokensGhotala[3].key === 's',
  'घोटाला: Broken gha (Shift+/) + stem k + kana k + matra s produces घो',
);

// Test 2.3: Gopāl (गोपाळ) = g (x) + kana (k) + matra (s)
const tokensGopal = decomposeTextToRemingtonTokens('गोपाळ');
assert(
  tokensGopal[0].key === 'x' &&
    tokensGopal[1].key === 'k' &&
    tokensGopal[2].key === 's' &&
    tokensGopal[3].key === 'i' &&
    tokensGopal[4].key === 'k' &&
    tokensGopal[5].key === 'g' &&
    tokensGopal[5].isShift === true,
  'गोपाळ: Correct sequence x + k + s + i + k + Shift+G',
);

// Test 2.4: Sarva (सर्व) = Sa (l) + Va (o) + Reph (Shift+Z)
const tokensSarva = decomposeTextToRemingtonTokens('सर्व');
assert(
  tokensSarva[0].key === 'l' &&
    tokensSarva[1].key === 'o' &&
    tokensSarva[2].key === 'z' &&
    tokensSarva[2].isShift === true,
  'सर्व: Sa (l) then Va (o) then Reph Shift+Z',
);

// Test 2.5: Prakar (प्रकार) = Pa (i) + Padstha Ra (z) + Ka (d) + Kana (k) + Ra (j)
const tokensPrakar = decomposeTextToRemingtonTokens('प्रकार');
assert(
  tokensPrakar[0].key === 'i' &&
    tokensPrakar[1].key === 'z' &&
    tokensPrakar[1].isShift === false &&
    tokensPrakar[2].key === 'd' &&
    tokensPrakar[3].key === 'k' &&
    tokensPrakar[4].key === 'j',
  'प्रकार: Pa (i) + Padstha Ra (z) + Ka (d) + Kana (k) + Ra (j)',
);

// ----------------------------------------------------
// 3. Keystroke Matcher Validation
// ----------------------------------------------------
console.log('\n📋 Test Group 3: matchUserKeystroke Execution');

const fToken = tokensJiddi[0]; // key 'f'
assert(
  matchUserKeystroke({ key: 'f', isShift: false }, fToken, 'ि'),
  'Matches physical f key for pahili vilanti',
);

const ghaToken = tokensGhotala[0]; // Shift + /
assert(
  matchUserKeystroke({ key: '/', isShift: true, code: 'Slash' }, ghaToken, 'घ्'),
  'Matches Shift + / for broken gha',
);

const rephToken = tokensSarva[2]; // Shift + Z
assert(
  matchUserKeystroke({ key: 'z', isShift: true, code: 'KeyZ' }, rephToken, 'र्'),
  'Matches Shift + Z for Reph',
);

// ----------------------------------------------------
// 4. Telemetry & GCC-TBC Scoring Engine
// ----------------------------------------------------
console.log('\n📋 Test Group 4: GCC-TBC Exam Scoring Calculations');

// Standard practice metrics test (150 correct chars, 0 errors, 60 seconds)
const statsPractice = calculateTypingStats(150, 0, 0, 60);
assert(
  statsPractice.wpm === 30,
  'Calculates 30 WPM (150 chars / 5 / 1 min = 30 WPM)',
  `got ${statsPractice.wpm}`,
);
assert(
  statsPractice.accuracy === 100,
  'Calculates 100% accuracy with 0 errors',
);

// Standard 30 WPM GCC-TBC exam run (1050 chars in 7 minutes)
const standardRun30 = evaluateGccTbcExam(
  'दीपक पाटील',
  30,
  7,
  1050, // total typed
  1050, // correct
  0, // mistakes
  420, // seconds (7 min)
);

assert(
  standardRun30.grossWpm === 30,
  'Gross WPM is exactly 30 for 1050 chars in 7 min',
  `got ${standardRun30.grossWpm}`,
);
assert(
  standardRun30.netWpm === 30,
  'Net WPM is exactly 30 with 0 mistakes',
  `got ${standardRun30.netWpm}`,
);
assert(standardRun30.accuracy === 100, 'Accuracy is 100% with 0 mistakes');
assert(standardRun30.passed === true, 'Passed status is true for 30 WPM run');
assert(standardRun30.grade === 'B', 'Grade is B for 30 WPM with 100% accuracy');

// High speed 40 WPM run on 30 WPM target -> Grade A+
const highSpeedRun = evaluateGccTbcExam(
  'दीपक पाटील',
  30,
  7,
  1400, // 40 WPM
  1400,
  0,
  420,
);
assert(
  highSpeedRun.passed === true && highSpeedRun.grade === 'A+',
  'Grade is A+ for high speed (40 WPM on 30 target)',
);

// Run with 5 mistakes
const mistakeRun = evaluateGccTbcExam('संजय पवार', 30, 7, 1050, 1000, 5, 420);

assert(mistakeRun.totalErrors === 5, 'Mistake count is 5');
assert(
  mistakeRun.netWpm === 29,
  'Net WPM correctly deducts mistake words',
  `got ${mistakeRun.netWpm}`,
);
assert(
  mistakeRun.passed === false,
  'Pass requires meeting target speed net WPM threshold (29 < 30)',
);

// ----------------------------------------------------
// Summary
// ----------------------------------------------------
console.log('\n====================================================');
console.log(`📊 Test Summary: ${passedTests} Passed, ${failedTests} Failed`);
console.log('====================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 All automated tests passed successfully!\n');
  process.exit(0);
}
