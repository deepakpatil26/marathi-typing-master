import { Finger, KeyMapping } from '../types';

export const FINGER_COLORS: Record<Finger, { bg: string; text: string; border: string; nameEn: string; nameMr: string }> = {
  'left-pinky': { bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40', text: 'text-rose-400', border: 'border-rose-500', nameEn: 'Left Little Finger', nameMr: 'डावे करंगळी' },
  'left-ring': { bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40', text: 'text-amber-400', border: 'border-amber-500', nameEn: 'Left Ring Finger', nameMr: 'डावे अनामिका' },
  'left-middle': { bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', text: 'text-emerald-400', border: 'border-emerald-500', nameEn: 'Left Middle Finger', nameMr: 'डावे मध्यमा' },
  'left-index': { bg: 'bg-sky-500/20 text-sky-300 border-sky-500/40', text: 'text-sky-400', border: 'border-sky-500', nameEn: 'Left Index Finger', nameMr: 'डावे तर्जनी' },
  'thumb': { bg: 'bg-purple-500/20 text-purple-300 border-purple-500/40', text: 'text-purple-400', border: 'border-purple-500', nameEn: 'Thumb (Space)', nameMr: 'अंगठा (स्पेस)' },
  'right-index': { bg: 'bg-sky-500/20 text-sky-300 border-sky-500/40', text: 'text-sky-400', border: 'border-sky-500', nameEn: 'Right Index Finger', nameMr: 'उजवे तर्जनी' },
  'right-middle': { bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', text: 'text-emerald-400', border: 'border-emerald-500', nameEn: 'Right Middle Finger', nameMr: 'उजवे मध्यमा' },
  'right-ring': { bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40', text: 'text-amber-400', border: 'border-amber-500', nameEn: 'Right Ring Finger', nameMr: 'उजवे अनामिका' },
  'right-pinky': { bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40', text: 'text-rose-400', border: 'border-rose-500', nameEn: 'Right Little Finger', nameMr: 'उजवे करंगळी' },
};

export const REMINGTON_KEYBOARD_LAYOUT: KeyMapping[][] = [
  // Number Row (Row 1)
  [
    { code: 'Backquote', key: '`', normalChar: '़', shiftChar: 'ॅ', normalNameMr: 'नुक्ता (़)', shiftNameMr: 'चन्द्र (ॅ)', finger: 'left-pinky', hand: 'left', row: 'number' },
    { code: 'Digit1', key: '1', normalChar: '१', shiftChar: '!', normalNameMr: '१', shiftNameMr: '!', finger: 'left-pinky', hand: 'left', row: 'number' },
    { code: 'Digit2', key: '2', normalChar: '२', shiftChar: '/', normalNameMr: '२', shiftNameMr: '/', finger: 'left-ring', hand: 'left', row: 'number' },
    { code: 'Digit3', key: '3', normalChar: '३', shiftChar: 'रु', normalNameMr: '३', shiftNameMr: 'रु', finger: 'left-middle', hand: 'left', row: 'number' },
    { code: 'Digit4', key: '4', normalChar: '४', shiftChar: '+', normalNameMr: '४', shiftNameMr: '+', finger: 'left-index', hand: 'left', row: 'number' },
    { code: 'Digit5', key: '5', normalChar: '५', shiftChar: 'ः', normalNameMr: '५', shiftNameMr: 'विसर्ग (ः)', finger: 'left-index', hand: 'left', row: 'number' },
    { code: 'Digit6', key: '6', normalChar: '६', shiftChar: "'", normalNameMr: '६', shiftNameMr: "'", finger: 'right-index', hand: 'right', row: 'number' },
    { code: 'Digit7', key: '7', normalChar: '७', shiftChar: '—', normalNameMr: '७', shiftNameMr: '—', finger: 'right-index', hand: 'right', row: 'number' },
    { code: 'Digit8', key: '8', normalChar: '८', shiftChar: '"', normalNameMr: '८', shiftNameMr: '"', finger: 'right-middle', hand: 'right', row: 'number' },
    { code: 'Digit9', key: '9', normalChar: '९', shiftChar: ';', normalNameMr: '९', shiftNameMr: ';', finger: 'right-ring', hand: 'right', row: 'number' },
    { code: 'Digit0', key: '0', normalChar: '०', shiftChar: 'द्व', normalNameMr: '०', shiftNameMr: 'द्व', finger: 'right-pinky', hand: 'right', row: 'number' },
    { code: 'Minus', key: '-', normalChar: '.', shiftChar: 'ऋ', normalNameMr: '.', shiftNameMr: 'ऋ', finger: 'right-pinky', hand: 'right', row: 'number' },
    { code: 'Equal', key: '=', normalChar: 'त्र', shiftChar: 'ृ', normalNameMr: 'त्र', shiftNameMr: 'ऋ-कार (ृ)', finger: 'right-pinky', hand: 'right', row: 'number' },
  ],
  // Upper Row (Row 2)
  [
    { code: 'KeyQ', key: 'q', normalChar: 'ु', shiftChar: 'फ', normalNameMr: 'ह्रस्व उ-कार (ु)', shiftNameMr: 'फ', finger: 'left-pinky', hand: 'left', row: 'upper' },
    { code: 'KeyW', key: 'w', normalChar: 'ू', shiftChar: 'ॅ', normalNameMr: 'दीर्घ ऊ-कार (ू)', shiftNameMr: 'चन्द्र (ॅ)', finger: 'left-ring', hand: 'left', row: 'upper' },
    { code: 'KeyE', key: 'e', normalChar: 'म', shiftChar: 'म्', normalNameMr: 'म', shiftNameMr: 'अर्धा म्', finger: 'left-middle', hand: 'left', row: 'upper' },
    { code: 'KeyR', key: 'r', normalChar: 'त', shiftChar: 'त्', normalNameMr: 'त', shiftNameMr: 'अर्धा त्', finger: 'left-index', hand: 'left', row: 'upper' },
    { code: 'KeyT', key: 't', normalChar: 'ज', shiftChar: 'ज्', normalNameMr: 'ज', shiftNameMr: 'अर्धा ज्', finger: 'left-index', hand: 'left', row: 'upper' },
    { code: 'KeyY', key: 'y', normalChar: 'ल', shiftChar: 'ल्', normalNameMr: 'ल', shiftNameMr: 'अर्धा ल्', finger: 'right-index', hand: 'right', row: 'upper' },
    { code: 'KeyU', key: 'u', normalChar: 'न', shiftChar: 'न्', normalNameMr: 'न', shiftNameMr: 'अर्धा न्', finger: 'right-index', hand: 'right', row: 'upper' },
    { code: 'KeyI', key: 'i', normalChar: 'प', shiftChar: 'प्', normalNameMr: 'प', shiftNameMr: 'अर्धा प्', finger: 'right-middle', hand: 'right', row: 'upper' },
    { code: 'KeyO', key: 'o', normalChar: 'व', shiftChar: 'व्', normalNameMr: 'व', shiftNameMr: 'अर्धा व्', finger: 'right-ring', hand: 'right', row: 'upper' },
    { code: 'KeyP', key: 'p', normalChar: 'च', shiftChar: 'च्', normalNameMr: 'च', shiftNameMr: 'अर्धा च्', finger: 'right-pinky', hand: 'right', row: 'upper' },
    { code: 'BracketLeft', key: '[', normalChar: 'ख्', shiftChar: 'क्ष', normalNameMr: 'अर्धा ख्', shiftNameMr: 'क्ष', finger: 'right-pinky', hand: 'right', row: 'upper' },
    { code: 'BracketRight', key: ']', normalChar: ',', shiftChar: 'द्व', normalNameMr: 'स्वल्पविराम (,)', shiftNameMr: 'द्व', finger: 'right-pinky', hand: 'right', row: 'upper' },
    { code: 'Backslash', key: '\\', normalChar: '?', shiftChar: 'द्य', normalNameMr: 'प्रश्नचिन्ह (?)', shiftNameMr: 'द्य', finger: 'right-pinky', hand: 'right', row: 'upper' },
  ],
  // Home Row (Row 3)
  [
    { code: 'KeyA', key: 'a', normalChar: '.', shiftChar: '।', normalNameMr: 'अनुस्वार / टिंब (.)', shiftNameMr: 'पूर्णविराम / दंड (।)', finger: 'left-pinky', hand: 'left', row: 'home' },
    { code: 'KeyS', key: 's', normalChar: 'े', shiftChar: 'ै', normalNameMr: 'ए-कार मात्रा (े)', shiftNameMr: 'ऐ-कार दोन मात्रा (ै)', finger: 'left-ring', hand: 'left', row: 'home' },
    { code: 'KeyD', key: 'd', normalChar: 'क', shiftChar: 'क्', normalNameMr: 'क', shiftNameMr: 'अर्धा क्', finger: 'left-middle', hand: 'left', row: 'home' },
    { code: 'KeyF', key: 'f', normalChar: 'ि', shiftChar: 'थ्', normalNameMr: 'पहिली वेलांटी (ि)', shiftNameMr: 'अर्धा थ्', finger: 'left-index', hand: 'left', row: 'home' },
    { code: 'KeyG', key: 'g', normalChar: 'ह', shiftChar: 'ळ', normalNameMr: 'ह', shiftNameMr: 'मराठी ळ', finger: 'left-index', hand: 'left', row: 'home' },
    { code: 'KeyH', key: 'h', normalChar: 'ी', shiftChar: 'भ्', normalNameMr: 'दुसरी वेलांटी (ी)', shiftNameMr: 'अर्धा भ्', finger: 'right-index', hand: 'right', row: 'home' },
    { code: 'KeyJ', key: 'j', normalChar: 'र', shiftChar: 'श्र', normalNameMr: 'र', shiftNameMr: 'श्र', finger: 'right-index', hand: 'right', row: 'home' },
    { code: 'KeyK', key: 'k', normalChar: 'ा', shiftChar: 'ज्ञ', normalNameMr: 'काना (ा)', shiftNameMr: 'ज्ञ', finger: 'right-middle', hand: 'right', row: 'home' },
    { code: 'KeyL', key: 'l', normalChar: 'स', shiftChar: 'स्', normalNameMr: 'स', shiftNameMr: 'अर्धा स्', finger: 'right-ring', hand: 'right', row: 'home' },
    { code: 'Semicolon', key: ';', normalChar: 'य', shiftChar: 'रू', normalNameMr: 'य', shiftNameMr: 'रू', finger: 'right-pinky', hand: 'right', row: 'home' },
    { code: 'Quote', key: "'", normalChar: 'श्', shiftChar: 'ष्', normalNameMr: 'अर्धा श्', shiftNameMr: 'ष्', finger: 'right-pinky', hand: 'right', row: 'home' },
  ],
  // Lower Row (Row 4)
  [
    { code: 'KeyZ', key: 'z', normalChar: '्र', shiftChar: 'र्', normalNameMr: 'र-प्रकार / पदस्थ र (्र)', shiftNameMr: 'रेफ (र्)', finger: 'left-pinky', hand: 'left', row: 'lower' },
    { code: 'KeyX', key: 'x', normalChar: 'ग', shiftChar: 'ग्', normalNameMr: 'ग', shiftNameMr: 'अर्धा ग्', finger: 'left-ring', hand: 'left', row: 'lower' },
    { code: 'KeyC', key: 'c', normalChar: 'ब', shiftChar: 'ब्', normalNameMr: 'ब', shiftNameMr: 'अर्धा ब्', finger: 'left-middle', hand: 'left', row: 'lower' },
    { code: 'KeyV', key: 'v', normalChar: 'अ', shiftChar: 'ट', normalNameMr: 'अ', shiftNameMr: 'ट', finger: 'left-index', hand: 'left', row: 'lower' },
    { code: 'KeyB', key: 'b', normalChar: 'इ', shiftChar: 'ठ', normalNameMr: 'इ', shiftNameMr: 'ठ', finger: 'left-index', hand: 'left', row: 'lower' },
    { code: 'KeyN', key: 'n', normalChar: 'द', shiftChar: 'छ', normalNameMr: 'द', shiftNameMr: 'छ', finger: 'right-index', hand: 'right', row: 'lower' },
    { code: 'KeyM', key: 'm', normalChar: 'उ', shiftChar: 'ड', normalNameMr: 'उ', shiftNameMr: 'ड', finger: 'right-index', hand: 'right', row: 'lower' },
    { code: 'Comma', key: ',', normalChar: 'ए', shiftChar: 'ढ', normalNameMr: 'ए', shiftNameMr: 'ढ', finger: 'right-middle', hand: 'right', row: 'lower' },
    { code: 'Period', key: '.', normalChar: 'ण्', shiftChar: 'झ', normalNameMr: 'अर्धा ण्', shiftNameMr: 'झ', finger: 'right-ring', hand: 'right', row: 'lower' },
    { code: 'Slash', key: '/', normalChar: 'ध्', shiftChar: 'घ्', normalNameMr: 'अर्धा ध्', shiftNameMr: 'अर्धा घ्', finger: 'right-pinky', hand: 'right', row: 'lower' },
  ],
  // Space Row (Row 5)
  [
    { code: 'Space', key: ' ', normalChar: ' ', shiftChar: ' ', normalNameMr: 'स्पेसबार', shiftNameMr: 'स्पेसबार', finger: 'thumb', hand: 'thumb', row: 'space' },
  ]
];

// Flatten for quick key lookups
export const KEY_BY_CODE: Record<string, KeyMapping> = {};
export const KEY_BY_CHAR: Record<string, { mapping: KeyMapping; isShift: boolean }> = {};

REMINGTON_KEYBOARD_LAYOUT.forEach(row => {
  row.forEach(item => {
    KEY_BY_CODE[item.code] = item;
    if (item.normalChar && !KEY_BY_CHAR[item.normalChar]) {
      KEY_BY_CHAR[item.normalChar] = { mapping: item, isShift: false };
    }
    if (item.shiftChar && !KEY_BY_CHAR[item.shiftChar]) {
      KEY_BY_CHAR[item.shiftChar] = { mapping: item, isShift: true };
    }
  });
});

// Character alternatives & normalization map for Devanagari input
export const DEV_CHAR_ALIAS: Record<string, string> = {
  '।': '.', // Purna viram to dot
  '‘': "'",
  '’': "'",
  '“': '"',
  '”': '"',
  '–': '-',
  '—': '-',
};

// Returns key and shift requirements to produce a Devanagari char
export function getRemingtonKeyForChar(char: string): { key: string; isShift: boolean; code: string; finger: Finger; hand: string; displayKey: string; charNameMr?: string } | null {
  if (char === ' ') {
    return { key: ' ', isShift: false, code: 'Space', finger: 'thumb', hand: 'thumb', displayKey: 'Space', charNameMr: 'स्पेस' };
  }
  
  const found = KEY_BY_CHAR[char];
  if (found) {
    return {
      key: found.mapping.key,
      isShift: found.isShift,
      code: found.mapping.code,
      finger: found.mapping.finger,
      hand: found.mapping.hand,
      displayKey: found.isShift ? `Shift + ${found.mapping.key.toUpperCase()}` : found.mapping.key,
      charNameMr: found.isShift ? found.mapping.shiftNameMr : found.mapping.normalNameMr
    };
  }

  // Handle common half letters (e.g. क् = क + ्, which can be typed directly or decomposed)
  return null;
}

// Convert English physical keystroke to Marathi Devanagari based on ISM Remington matrix
export function remingtonKeyToDevanagari(key: string, isShift: boolean, code?: string): string | null {
  if (key === ' ') return ' ';
  
  // Lookup by code or physical key
  let mapping: KeyMapping | undefined;
  if (code && KEY_BY_CODE[code]) {
    mapping = KEY_BY_CODE[code];
  } else {
    for (const row of REMINGTON_KEYBOARD_LAYOUT) {
      const match = row.find(k => k.key.toLowerCase() === key.toLowerCase());
      if (match) {
        mapping = match;
        break;
      }
    }
  }

  if (!mapping) return null;
  return isShift ? mapping.shiftChar : mapping.normalChar;
}
