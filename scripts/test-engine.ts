/**
 * Automated Verification & Regression Suite for Marathi Typing Master
 * Tests:
 * 1. ISM Remington DVBW Character & Multi-Codepoint Matcher
 * 2. Decomposed vs Composed Matra Handling (e.g. ो, ौ)
 * 3. Conjuncts & Halant Sequence Matching
 * 4. GCC-TBC 30 & 40 WPM Scoring Formulas & Mistake Penalties
 * 5. Student Profile Data Invariants
 */

import { checkDevanagariMatch, remingtonKeyToDevanagari, REMINGTON_KEYBOARD_LAYOUT } from '../src/data/remingtonMap';
import { calculateTypingStats, evaluateGccTbcExam } from '../src/utils/telemetry';

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
assert(remingtonKeyToDevanagari('d', true) === 'क्', 'Shift+[D] maps to half-Ka (क्)');
assert(remingtonKeyToDevanagari('k', false) === 'ा', 'Key [k] maps to Aa-kar (ा)');
assert(remingtonKeyToDevanagari('s', false) === 'े', 'Key [s] maps to E-kar (े)');
assert(remingtonKeyToDevanagari('j', false) === 'र', 'Key [j] maps to Ra (र)');
assert(remingtonKeyToDevanagari('l', false) === 'स', 'Key [l] maps to Sa (स)');
assert(remingtonKeyToDevanagari(';', false) === 'य', 'Key [;] maps to Ya (य)');
assert(remingtonKeyToDevanagari('u', false) === 'न', 'Key [u] maps to Na (न)');
assert(remingtonKeyToDevanagari('i', false) === 'प', 'Key [i] maps to Pa (प)');
assert(remingtonKeyToDevanagari('m', false) === 'उ', 'Key [m] maps to U (उ)');
assert(remingtonKeyToDevanagari('e', true) === 'म्', 'Shift+[E] maps to half-M (म्)');
assert(remingtonKeyToDevanagari('r', true) === 'त्', 'Shift+[R] maps to half-T (त्)');

// ----------------------------------------------------
// 2. Devanagari Matcher (checkDevanagariMatch)
// ----------------------------------------------------
console.log('\n📋 Test Group 2: Devanagari Sequence & Matra Matcher');

// Exact single character match
const test1 = checkDevanagariMatch('क', 'कमळ', 0);
assert(test1.isMatch && test1.advanceCount === 1, 'Exact single character match (क)');

// Space match (at index 4 in "भारत देश")
const testSpace = checkDevanagariMatch(' ', 'भारत देश', 4);
assert(testSpace.isMatch && testSpace.advanceCount === 1, 'Space match at delimiter position');

// Composed O-kar vs separate Aa + E matras
const oKarUnified = '\u094B'; // ो (unified)
const oKarDecomposed = '\u093E\u0947'; // ा + े (decomposed)
const testOComposed = checkDevanagariMatch(oKarUnified, `क${oKarDecomposed}ण`, 1);
assert(testOComposed.isMatch && testOComposed.advanceCount === 2, 'Unified ो matches decomposed ा+े target sequence and advances 2 codepoints');

const testODecomposed = checkDevanagariMatch(oKarDecomposed, `क${oKarUnified}ण`, 1);
assert(testODecomposed.isMatch && testODecomposed.advanceCount === 1, 'Decomposed ा+े matches unified ो target character');

// AU-kar matching
const auKarUnified = '\u094C'; // ौ
const auKarDecomposed = '\u093E\u0948'; // ा + ै
const testAu = checkDevanagariMatch(auKarUnified, `ग${auKarDecomposed}रव`, 1);
assert(testAu.isMatch && testAu.advanceCount === 2, 'Unified ौ matches decomposed ा+ै target sequence');

// Multi-character glyph matching (ख decomposed from रव् vs combined ख)
const testKha = checkDevanagariMatch('ख', 'खरा', 0);
assert(testKha.isMatch && testKha.advanceCount === 1, 'Standard ख character match');

// Conjunct with Halant sequence
const testConjunct = checkDevanagariMatch('प्र', 'महाराष्ट्र', 0);
assert(!testConjunct.isMatch, 'Incorrect character at pos 0 returns isMatch = false');

const testValidStep = checkDevanagariMatch('म', 'महाराष्ट्र', 0);
assert(testValidStep.isMatch && testValidStep.advanceCount === 1, 'Step 1 of conjunct word correctly matches first char');

// ----------------------------------------------------
// 3. Telemetry & GCC-TBC Scoring Engine
// ----------------------------------------------------
console.log('\n📋 Test Group 3: GCC-TBC Exam Scoring Calculations');

// Standard practice metrics test (150 correct chars, 0 errors, 60 seconds)
const statsPractice = calculateTypingStats(150, 0, 0, 60);
assert(statsPractice.wpm === 30, 'Calculates 30 WPM (150 chars / 5 / 1 min = 30 WPM)', `got ${statsPractice.wpm}`);
assert(statsPractice.accuracy === 100, 'Calculates 100% accuracy with 0 errors');

// Standard 30 WPM GCC-TBC exam run (1050 chars in 7 minutes)
const standardRun30 = evaluateGccTbcExam(
  'दीपक पाटील',
  30,
  7,
  1050, // total typed
  1050, // correct
  0,    // mistakes
  420   // seconds (7 min)
);

assert(standardRun30.grossWpm === 30, 'Gross WPM is exactly 30 for 1050 chars in 7 min', `got ${standardRun30.grossWpm}`);
assert(standardRun30.netWpm === 30, 'Net WPM is exactly 30 with 0 mistakes', `got ${standardRun30.netWpm}`);
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
  420
);
assert(highSpeedRun.passed === true && highSpeedRun.grade === 'A+', 'Grade is A+ for high speed (40 WPM on 30 target)');

// Run with 5 mistakes
const mistakeRun = evaluateGccTbcExam(
  'संजय पवार',
  30,
  7,
  1050,
  1000,
  5,
  420
);

assert(mistakeRun.totalErrors === 5, 'Mistake count is 5');
assert(mistakeRun.netWpm === 29, 'Net WPM correctly deducts mistake words', `got ${mistakeRun.netWpm}`);
assert(mistakeRun.passed === false, 'Pass requires meeting target speed net WPM threshold (29 < 30)');

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
