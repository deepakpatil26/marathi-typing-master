import { Finger, KeyMapping } from '../types';

export const FINGER_COLORS: Record<
  Finger,
  { bg: string; text: string; border: string; nameEn: string; nameMr: string }
> = {
  'left-pinky': {
    bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    text: 'text-rose-400',
    border: 'border-rose-500',
    nameEn: 'Left Little Finger',
    nameMr: 'डावे करंगळी',
  },
  'left-ring': {
    bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    text: 'text-amber-400',
    border: 'border-amber-500',
    nameEn: 'Left Ring Finger',
    nameMr: 'डावे अनामिका',
  },
  'left-middle': {
    bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    text: 'text-emerald-400',
    border: 'border-emerald-500',
    nameEn: 'Left Middle Finger',
    nameMr: 'डावे मध्यमा',
  },
  'left-index': {
    bg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    text: 'text-sky-400',
    border: 'border-sky-500',
    nameEn: 'Left Index Finger',
    nameMr: 'डावे तर्जनी',
  },
  thumb: {
    bg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    text: 'text-purple-400',
    border: 'border-purple-500',
    nameEn: 'Thumb (Space)',
    nameMr: 'अंगठा (स्पेस)',
  },
  'right-index': {
    bg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    text: 'text-sky-400',
    border: 'border-sky-500',
    nameEn: 'Right Index Finger',
    nameMr: 'उजवे तर्जनी',
  },
  'right-middle': {
    bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    text: 'text-emerald-400',
    border: 'border-emerald-500',
    nameEn: 'Right Middle Finger',
    nameMr: 'उजवे मध्यमा',
  },
  'right-ring': {
    bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    text: 'text-amber-400',
    border: 'border-amber-500',
    nameEn: 'Right Ring Finger',
    nameMr: 'उजवे अनामिका',
  },
  'right-pinky': {
    bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    text: 'text-rose-400',
    border: 'border-rose-500',
    nameEn: 'Right Little Finger',
    nameMr: 'उजवे करंगळी',
  },
};

export const REMINGTON_KEYBOARD_LAYOUT: KeyMapping[][] = [
  // Number Row (Row 1)
  [
    {
      code: 'Backquote',
      key: '`',
      normalChar: '़',
      shiftChar: 'ॅ',
      normalNameMr: 'नुक्ता (़)',
      shiftNameMr: 'चन्द्र (ॅ)',
      finger: 'left-pinky',
      hand: 'left',
      row: 'number',
    },
    {
      code: 'Digit1',
      key: '1',
      normalChar: '१',
      shiftChar: '!',
      normalNameMr: '१',
      shiftNameMr: '!',
      finger: 'left-pinky',
      hand: 'left',
      row: 'number',
    },
    {
      code: 'Digit2',
      key: '2',
      normalChar: '२',
      shiftChar: '्',
      normalNameMr: '२',
      shiftNameMr: 'हलंत / पायमोडका (्)',
      finger: 'left-ring',
      hand: 'left',
      row: 'number',
    },
    {
      code: 'Digit3',
      key: '3',
      normalChar: '३',
      shiftChar: 'रु',
      normalNameMr: '३',
      shiftNameMr: 'रु',
      finger: 'left-middle',
      hand: 'left',
      row: 'number',
    },
    {
      code: 'Digit4',
      key: '4',
      normalChar: '४',
      shiftChar: '+',
      normalNameMr: '४',
      shiftNameMr: '+',
      finger: 'left-index',
      hand: 'left',
      row: 'number',
    },
    {
      code: 'Digit5',
      key: '5',
      normalChar: '५',
      shiftChar: 'ः',
      normalNameMr: '५',
      shiftNameMr: 'विसर्ग (ः)',
      finger: 'left-index',
      hand: 'left',
      row: 'number',
    },
    {
      code: 'Digit6',
      key: '6',
      normalChar: '६',
      shiftChar: "'",
      normalNameMr: '६',
      shiftNameMr: "'",
      finger: 'right-index',
      hand: 'right',
      row: 'number',
    },
    {
      code: 'Digit7',
      key: '7',
      normalChar: '७',
      shiftChar: '—',
      normalNameMr: '७',
      shiftNameMr: 'डॅश / समास (—)',
      finger: 'right-index',
      hand: 'right',
      row: 'number',
    },
    {
      code: 'Digit8',
      key: '8',
      normalChar: '८',
      shiftChar: '"',
      normalNameMr: '८',
      shiftNameMr: '"',
      finger: 'right-middle',
      hand: 'right',
      row: 'number',
    },
    {
      code: 'Digit9',
      key: '9',
      normalChar: '९',
      shiftChar: ';',
      normalNameMr: '९',
      shiftNameMr: ';',
      finger: 'right-ring',
      hand: 'right',
      row: 'number',
    },
    {
      code: 'Digit0',
      key: '0',
      normalChar: '०',
      shiftChar: 'द्व',
      normalNameMr: '०',
      shiftNameMr: 'द्व',
      finger: 'right-pinky',
      hand: 'right',
      row: 'number',
    },
    {
      code: 'Minus',
      key: '-',
      normalChar: '.',
      shiftChar: 'ऋ',
      normalNameMr: '.',
      shiftNameMr: 'ऋ',
      finger: 'right-pinky',
      hand: 'right',
      row: 'number',
    },
    {
      code: 'Equal',
      key: '=',
      normalChar: 'त्र',
      shiftChar: 'ृ',
      normalNameMr: 'त्र',
      shiftNameMr: 'ऋ-कार (ृ)',
      finger: 'right-pinky',
      hand: 'right',
      row: 'number',
    },
  ],
  // Upper Row (Row 2)
  [
    {
      code: 'KeyQ',
      key: 'q',
      normalChar: 'ु',
      shiftChar: 'फ',
      normalNameMr: 'ह्रस्व उ-कार (ु)',
      shiftNameMr: 'फ',
      finger: 'left-pinky',
      hand: 'left',
      row: 'upper',
    },
    {
      code: 'KeyW',
      key: 'w',
      normalChar: 'ू',
      shiftChar: 'ॅ',
      normalNameMr: 'दीर्घ ऊ-कार (ू)',
      shiftNameMr: 'चन्द्र (ॅ)',
      finger: 'left-ring',
      hand: 'left',
      row: 'upper',
    },
    {
      code: 'KeyE',
      key: 'e',
      normalChar: 'म',
      shiftChar: 'म्',
      normalNameMr: 'म',
      shiftNameMr: 'अर्धा म्',
      finger: 'left-middle',
      hand: 'left',
      row: 'upper',
    },
    {
      code: 'KeyR',
      key: 'r',
      normalChar: 'त',
      shiftChar: 'त्',
      normalNameMr: 'त',
      shiftNameMr: 'अर्धा त्',
      finger: 'left-index',
      hand: 'left',
      row: 'upper',
    },
    {
      code: 'KeyT',
      key: 't',
      normalChar: 'ज',
      shiftChar: 'ज्',
      normalNameMr: 'ज',
      shiftNameMr: 'अर्धा ज्',
      finger: 'left-index',
      hand: 'left',
      row: 'upper',
    },
    {
      code: 'KeyY',
      key: 'y',
      normalChar: 'ल',
      shiftChar: 'ल्',
      normalNameMr: 'ल',
      shiftNameMr: 'अर्धा ल्',
      finger: 'right-index',
      hand: 'right',
      row: 'upper',
    },
    {
      code: 'KeyU',
      key: 'u',
      normalChar: 'न',
      shiftChar: 'न्',
      normalNameMr: 'न',
      shiftNameMr: 'अर्धा न्',
      finger: 'right-index',
      hand: 'right',
      row: 'upper',
    },
    {
      code: 'KeyI',
      key: 'i',
      normalChar: 'प',
      shiftChar: 'प्',
      normalNameMr: 'प',
      shiftNameMr: 'अर्धा प्',
      finger: 'right-middle',
      hand: 'right',
      row: 'upper',
    },
    {
      code: 'KeyO',
      key: 'o',
      normalChar: 'व',
      shiftChar: 'व्',
      normalNameMr: 'व',
      shiftNameMr: 'अर्धा व्',
      finger: 'right-ring',
      hand: 'right',
      row: 'upper',
    },
    {
      code: 'KeyP',
      key: 'p',
      normalChar: 'च',
      shiftChar: 'च्',
      normalNameMr: 'च',
      shiftNameMr: 'अर्धा च्',
      finger: 'right-pinky',
      hand: 'right',
      row: 'upper',
    },
    {
      code: 'BracketLeft',
      key: '[',
      normalChar: 'ख्',
      shiftChar: 'क्ष',
      normalNameMr: 'अर्धा ख्',
      shiftNameMr: 'क्ष',
      finger: 'right-pinky',
      hand: 'right',
      row: 'upper',
    },
    {
      code: 'BracketRight',
      key: ']',
      normalChar: ',',
      shiftChar: 'द्व',
      normalNameMr: 'स्वल्पविराम (,)',
      shiftNameMr: 'द्व',
      finger: 'right-pinky',
      hand: 'right',
      row: 'upper',
    },
    {
      code: 'Backslash',
      key: '\\',
      normalChar: '?',
      shiftChar: 'द्य',
      normalNameMr: 'प्रश्नचिन्ह (?)',
      shiftNameMr: 'द्य',
      finger: 'right-pinky',
      hand: 'right',
      row: 'upper',
    },
  ],
  // Home Row (Row 3)
  [
    {
      code: 'KeyA',
      key: 'a',
      normalChar: 'ं',
      shiftChar: '।',
      normalNameMr: 'अनुस्वार (ं)',
      shiftNameMr: 'पूर्णविराम / दंड (।)',
      finger: 'left-pinky',
      hand: 'left',
      row: 'home',
    },
    {
      code: 'KeyS',
      key: 's',
      normalChar: 'े',
      shiftChar: 'ै',
      normalNameMr: 'ए-कार मात्रा (े)',
      shiftNameMr: 'ऐ-कार दोन मात्रा (ै)',
      finger: 'left-ring',
      hand: 'left',
      row: 'home',
    },
    {
      code: 'KeyD',
      key: 'd',
      normalChar: 'क',
      shiftChar: 'क्',
      normalNameMr: 'क',
      shiftNameMr: 'अर्धा क्',
      finger: 'left-middle',
      hand: 'left',
      row: 'home',
    },
    {
      code: 'KeyF',
      key: 'f',
      normalChar: 'ि',
      shiftChar: 'थ्',
      normalNameMr: 'पहिली वेलांटी (ि)',
      shiftNameMr: 'अर्धा थ्',
      finger: 'left-index',
      hand: 'left',
      row: 'home',
    },
    {
      code: 'KeyG',
      key: 'g',
      normalChar: 'ह',
      shiftChar: 'ळ',
      normalNameMr: 'ह',
      shiftNameMr: 'मराठी ळ',
      finger: 'left-index',
      hand: 'left',
      row: 'home',
    },
    {
      code: 'KeyH',
      key: 'h',
      normalChar: 'ी',
      shiftChar: 'भ्',
      normalNameMr: 'दुसरी वेलांटी (ी)',
      shiftNameMr: 'अर्धा भ्',
      finger: 'right-index',
      hand: 'right',
      row: 'home',
    },
    {
      code: 'KeyJ',
      key: 'j',
      normalChar: 'र',
      shiftChar: 'श्र',
      normalNameMr: 'र',
      shiftNameMr: 'श्र',
      finger: 'right-index',
      hand: 'right',
      row: 'home',
    },
    {
      code: 'KeyK',
      key: 'k',
      normalChar: 'ा',
      shiftChar: 'ज्ञ',
      normalNameMr: 'काना (ा)',
      shiftNameMr: 'ज्ञ',
      finger: 'right-middle',
      hand: 'right',
      row: 'home',
    },
    {
      code: 'KeyL',
      key: 'l',
      normalChar: 'स',
      shiftChar: 'स्',
      normalNameMr: 'स',
      shiftNameMr: 'अर्धा स्',
      finger: 'right-ring',
      hand: 'right',
      row: 'home',
    },
    {
      code: 'Semicolon',
      key: ';',
      normalChar: 'य',
      shiftChar: 'रू',
      normalNameMr: 'य',
      shiftNameMr: 'रू',
      finger: 'right-pinky',
      hand: 'right',
      row: 'home',
    },
    {
      code: 'Quote',
      key: "'",
      normalChar: 'श्',
      shiftChar: 'ष्',
      normalNameMr: 'अर्धा श्',
      shiftNameMr: 'अर्धा ष्',
      finger: 'right-pinky',
      hand: 'right',
      row: 'home',
    },
  ],
  // Lower Row (Row 4)
  [
    {
      code: 'KeyZ',
      key: 'z',
      normalChar: '्र',
      shiftChar: 'र्',
      normalNameMr: 'पदस्थ र (्र)',
      shiftNameMr: 'रेफ (र्)',
      finger: 'left-pinky',
      hand: 'left',
      row: 'lower',
    },
    {
      code: 'KeyX',
      key: 'x',
      normalChar: 'ग',
      shiftChar: 'ग्',
      normalNameMr: 'ग',
      shiftNameMr: 'अर्धा ग्',
      finger: 'left-ring',
      hand: 'left',
      row: 'lower',
    },
    {
      code: 'KeyC',
      key: 'c',
      normalChar: 'ब',
      shiftChar: 'ब्',
      normalNameMr: 'ब',
      shiftNameMr: 'अर्धा ब्',
      finger: 'left-middle',
      hand: 'left',
      row: 'lower',
    },
    {
      code: 'KeyV',
      key: 'v',
      normalChar: 'अ',
      shiftChar: 'ट',
      normalNameMr: 'अ',
      shiftNameMr: 'ट',
      finger: 'left-index',
      hand: 'left',
      row: 'lower',
    },
    {
      code: 'KeyB',
      key: 'b',
      normalChar: 'इ',
      shiftChar: 'ठ',
      normalNameMr: 'इ',
      shiftNameMr: 'ठ',
      finger: 'left-index',
      hand: 'left',
      row: 'lower',
    },
    {
      code: 'KeyN',
      key: 'n',
      normalChar: 'द',
      shiftChar: 'छ',
      normalNameMr: 'द',
      shiftNameMr: 'छ',
      finger: 'right-index',
      hand: 'right',
      row: 'lower',
    },
    {
      code: 'KeyM',
      key: 'm',
      normalChar: 'उ',
      shiftChar: 'ड',
      normalNameMr: 'उ',
      shiftNameMr: 'ड',
      finger: 'right-index',
      hand: 'right',
      row: 'lower',
    },
    {
      code: 'Comma',
      key: ',',
      normalChar: 'ए',
      shiftChar: 'ढ',
      normalNameMr: 'ए',
      shiftNameMr: 'ढ',
      finger: 'right-middle',
      hand: 'right',
      row: 'lower',
    },
    {
      code: 'Period',
      key: '.',
      normalChar: 'ण्',
      shiftChar: 'झ',
      normalNameMr: 'अर्धा ण्',
      shiftNameMr: 'झ',
      finger: 'right-ring',
      hand: 'right',
      row: 'lower',
    },
    {
      code: 'Slash',
      key: '/',
      normalChar: 'ध्',
      shiftChar: 'घ्',
      normalNameMr: 'अर्धा ध्',
      shiftNameMr: 'अर्धा घ्',
      finger: 'right-pinky',
      hand: 'right',
      row: 'lower',
    },
  ],
  // Space Row (Row 5)
  [
    {
      code: 'Space',
      key: ' ',
      normalChar: ' ',
      shiftChar: ' ',
      normalNameMr: 'स्पेसबार',
      shiftNameMr: 'स्पेसबार',
      finger: 'thumb',
      hand: 'thumb',
      row: 'space',
    },
  ],
];

// Flatten for quick key lookups
export const KEY_BY_CODE: Record<string, KeyMapping> = {};
export const KEY_BY_CHAR: Record<
  string,
  { mapping: KeyMapping; isShift: boolean }
> = {};

REMINGTON_KEYBOARD_LAYOUT.forEach((row) => {
  row.forEach((item) => {
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
  '।': '.',
  '‘': "'",
  '’': "'",
  '“': '"',
  '”': '"',
  '–': '-',
  '—': '-',
};

export interface RemingtonToken {
  key: string;
  isShift: boolean;
  code: string;
  finger: Finger;
  hand: string;
  displayKey: string;
  charNameMr: string;
  charProduced: string;
  textCharIndex: number;
  aksharaLength?: number;
}

// Convert English physical keystroke to Marathi Devanagari
export function remingtonKeyToDevanagari(
  key: string,
  isShift: boolean,
  code?: string,
): string | null {
  if (key === ' ') return ' ';

  let mapping: KeyMapping | undefined;
  if (code && KEY_BY_CODE[code]) {
    mapping = KEY_BY_CODE[code];
  } else {
    for (const row of REMINGTON_KEYBOARD_LAYOUT) {
      const match = row.find((k) => k.key.toLowerCase() === key.toLowerCase());
      if (match) {
        mapping = match;
        break;
      }
    }
  }

  if (!mapping) return null;
  return isShift ? mapping.shiftChar : mapping.normalChar;
}

// Helper to build a token from key mapping
export function createTokenFromKey(
  keyChar: string,
  isShift: boolean,
  charProduced: string,
  charNameMr: string,
  textCharIndex: number,
  customCode?: string,
): RemingtonToken | null {
  let mapping: KeyMapping | undefined;
  if (customCode && KEY_BY_CODE[customCode]) {
    mapping = KEY_BY_CODE[customCode];
  } else {
    for (const row of REMINGTON_KEYBOARD_LAYOUT) {
      const match = row.find((k) => k.key.toLowerCase() === keyChar.toLowerCase());
      if (match) {
        mapping = match;
        break;
      }
    }
  }

  if (!mapping) {
    if (keyChar === ' ') {
      return {
        key: ' ',
        isShift: false,
        code: 'Space',
        finger: 'thumb',
        hand: 'thumb',
        displayKey: 'Space',
        charNameMr: 'स्पेस',
        charProduced: ' ',
        textCharIndex,
      };
    }
    return null;
  }

  return {
    key: mapping.key,
    isShift,
    code: mapping.code,
    finger: mapping.finger,
    hand: mapping.hand,
    displayKey: isShift ? `Shift + ${mapping.key.toUpperCase()}` : mapping.key,
    charNameMr,
    charProduced,
    textCharIndex,
  };
}

/**
 * Returns key and shift requirements for a single character (for prompt fallback).
 */
export function getRemingtonKeyForChar(
  char: string,
): {
  key: string;
  isShift: boolean;
  code: string;
  finger: Finger;
  hand: string;
  displayKey: string;
  charNameMr?: string;
} | null {
  if (char === ' ') {
    return {
      key: ' ',
      isShift: false,
      code: 'Space',
      finger: 'thumb',
      hand: 'thumb',
      displayKey: 'Space',
      charNameMr: 'स्पेस',
    };
  }

  const found = KEY_BY_CHAR[char];
  if (found) {
    return {
      key: found.mapping.key,
      isShift: found.isShift,
      code: found.mapping.code,
      finger: found.mapping.finger,
      hand: found.mapping.hand,
      displayKey: found.isShift
        ? `Shift + ${found.mapping.key.toUpperCase()}`
        : found.mapping.key,
      charNameMr: found.isShift
        ? found.mapping.shiftNameMr
        : found.mapping.normalNameMr,
    };
  }

  return null;
}

/**
 * Robust Remington Devanagari Akshara Decomposer & Keystroke Compiler.
 * 
 * Rules supported:
 * 1. Pahili Vilanti (ि): Typed FIRST before the consonant (key 'f')
 * 2. Reph (र्): Typed AFTER the consonant (key 'Shift+Z')
 * 3. Padstha Ra (्र): Typed AFTER consonant (key 'z')
 * 4. Broken / Half Consonants requiring stem 'k' to complete:
 *    - घ: Shift+/ ('घ्') + k ('ा')
 *    - ध: / ('ध्') + k ('ा')
 *    - भ: Shift+H ('भ्') + k ('ा')
 *    - थ: Shift+F ('थ्') + k ('ा')
 *    - ख: [ ('ख्') + k ('ा')
 *    - ण: . ('ण्') + k ('ा')
 *    - श: ' ('श्') + k ('ा')
 *    - ष: Shift+' ('ष्') + k ('ा')
 * 5. Matras & Vowels:
 *    - ो: k ('ा') + s ('े')
 *    - ौ: k ('ा') + Shift+S ('ै')
 *    - आ: v ('अ') + k ('ा')
 *    - ओ: v ('अ') + k ('ा') + s ('े')
 *    - औ: v ('अ') + k ('ा') + Shift+S ('ै')
 *    - ॉ: k ('ा') + Shift+W ('ॅ')
 */
export function decomposeTextToRemingtonTokens(targetText: string): RemingtonToken[] {
  const tokens: RemingtonToken[] = [];
  let i = 0;

  while (i < targetText.length) {
    const ch = targetText[i];
    const chNext = targetText[i + 1] || '';
    const chNext2 = targetText[i + 2] || '';
    const chNext3 = targetText[i + 3] || '';

    // 1. Whitespace & Line breaks
    if (ch === ' ' || ch === '\n') {
      const spaceToken = createTokenFromKey(' ', false, ch, ch === '\n' ? 'एंटर / स्पेस' : 'स्पेस', i, 'Space');
      if (spaceToken) tokens.push(spaceToken);
      i++;
      continue;
    }

    // 2. Standalone Independent Vowels (Swara)
    if (ch === 'अ') {
      if (chNext === 'ा' && chNext2 === 'े') {
        // ओ (अ + ा + े)
        const t1 = createTokenFromKey('v', false, 'अ', 'अ', i, 'KeyV');
        const t2 = createTokenFromKey('k', false, 'ा', 'काना (ा)', i + 1, 'KeyK');
        const t3 = createTokenFromKey('s', false, 'े', 'मात्रा (े)', i + 2, 'KeyS');
        if (t1 && t2 && t3) tokens.push(t1, t2, t3);
        i += 3;
        continue;
      }
      if (chNext === 'ा' && chNext2 === 'ै') {
        // औ (अ + ा + ै)
        const t1 = createTokenFromKey('v', false, 'अ', 'अ', i, 'KeyV');
        const t2 = createTokenFromKey('k', false, 'ा', 'काना (ा)', i + 1, 'KeyK');
        const t3 = createTokenFromKey('s', true, 'ै', 'दोन मात्रा (ै)', i + 2, 'KeyS');
        if (t1 && t2 && t3) tokens.push(t1, t2, t3);
        i += 3;
        continue;
      }
      if (chNext === 'ा' && chNext2 === 'ॅ') {
        // ऑ
        const t1 = createTokenFromKey('v', false, 'अ', 'अ', i, 'KeyV');
        const t2 = createTokenFromKey('k', false, 'ा', 'काना (ा)', i + 1, 'KeyK');
        const t3 = createTokenFromKey('w', true, 'ॅ', 'चन्द्र (ॅ)', i + 2, 'KeyW');
        if (t1 && t2 && t3) tokens.push(t1, t2, t3);
        i += 3;
        continue;
      }
      if (chNext === 'ा') {
        // आ (अ + ा)
        const t1 = createTokenFromKey('v', false, 'अ', 'अ', i, 'KeyV');
        const t2 = createTokenFromKey('k', false, 'ा', 'काना (ा)', i + 1, 'KeyK');
        if (t1 && t2) tokens.push(t1, t2);
        i += 2;
        continue;
      }
      const t1 = createTokenFromKey('v', false, 'अ', 'अ', i, 'KeyV');
      if (t1) tokens.push(t1);
      i++;
      continue;
    }

    if (ch === 'आ') {
      const t1 = createTokenFromKey('v', false, 'अ', 'अ', i, 'KeyV');
      const t2 = createTokenFromKey('k', false, 'ा', 'काना (ा)', i, 'KeyK');
      if (t1 && t2) tokens.push(t1, t2);
      i++;
      continue;
    }

    if (ch === 'इ') {
      const t1 = createTokenFromKey('b', false, 'इ', 'इ', i, 'KeyB');
      if (t1) tokens.push(t1);
      i++;
      continue;
    }

    if (ch === 'ई') {
      const t1 = createTokenFromKey('b', false, 'इ', 'इ', i, 'KeyB');
      const t2 = createTokenFromKey('z', true, 'र्', 'रेफ (र्)', i, 'KeyZ');
      if (t1 && t2) tokens.push(t1, t2);
      i++;
      continue;
    }

    if (ch === 'उ') {
      const t1 = createTokenFromKey('m', false, 'उ', 'उ', i, 'KeyM');
      if (t1) tokens.push(t1);
      i++;
      continue;
    }

    if (ch === 'ऊ') {
      const t1 = createTokenFromKey('m', false, 'उ', 'उ', i, 'KeyM');
      const t2 = createTokenFromKey('w', false, 'ू', 'दीर्घ ऊ (ू)', i, 'KeyW');
      if (t1 && t2) tokens.push(t1, t2);
      i++;
      continue;
    }

    if (ch === 'ए') {
      const t1 = createTokenFromKey(',', false, 'ए', 'ए', i, 'Comma');
      if (t1) tokens.push(t1);
      i++;
      continue;
    }

    if (ch === 'ऐ') {
      const t1 = createTokenFromKey(',', false, 'ए', 'ए', i, 'Comma');
      const t2 = createTokenFromKey('s', false, 'े', 'मात्रा (े)', i, 'KeyS');
      if (t1 && t2) tokens.push(t1, t2);
      i++;
      continue;
    }

    if (ch === 'ओ') {
      const t1 = createTokenFromKey('v', false, 'अ', 'अ', i, 'KeyV');
      const t2 = createTokenFromKey('k', false, 'ा', 'काना (ा)', i, 'KeyK');
      const t3 = createTokenFromKey('s', false, 'े', 'मात्रा (े)', i, 'KeyS');
      if (t1 && t2 && t3) tokens.push(t1, t2, t3);
      i++;
      continue;
    }

    if (ch === 'औ') {
      const t1 = createTokenFromKey('v', false, 'अ', 'अ', i, 'KeyV');
      const t2 = createTokenFromKey('k', false, 'ा', 'काना (ा)', i, 'KeyK');
      const t3 = createTokenFromKey('s', true, 'ै', 'दोन मात्रा (ै)', i, 'KeyS');
      if (t1 && t2 && t3) tokens.push(t1, t2, t3);
      i++;
      continue;
    }

    if (ch === 'ऋ') {
      const t1 = createTokenFromKey('-', true, 'ऋ', 'ऋ', i, 'Minus');
      if (t1) tokens.push(t1);
      i++;
      continue;
    }

    // 3. Check for Reph prefix in Unicode: e.g. र् + consonant (displayed as consonant + reph)
    // In Unicode text, "सर्व" is 'स', 'र', '्', 'व'.
    // When i is at 'र' and chNext === '्', this is Reph 'र्' which in Remington is typed AFTER the following consonant!
    if (ch === 'र' && chNext === '्' && chNext2 && chNext2 !== ' ' && chNext2 !== '\n') {
      const rephIndex = i;
      const consonantIndex = i + 2;
      const baseConsonant = chNext2;
      const consonantTokens = decomposeConsonantUnit(baseConsonant, consonantIndex, targetText);
      
      // Tokens for the base consonant come FIRST
      tokens.push(...consonantTokens.tokens);
      i = consonantTokens.nextIndex;

      // Then user types Shift+Z for Reph 'र्'
      const rephToken = createTokenFromKey('z', true, 'र्', 'रेफ (र्)', rephIndex, 'KeyZ');
      if (rephToken) tokens.push(rephToken);
      continue;
    }

    // 4. Check for Pahili Vilanti (ि) attached to current consonant / conjunct
    // In Unicode text, "जि" is 'ज' (index i) + 'ि' (index i+1)
    // In typewriter, user types 'f' (ि) FIRST, then consonant 'ज'
    if (chNext === 'ि') {
      const vilantiIndex = i + 1;
      const vilantiToken = createTokenFromKey('f', false, 'ि', 'पहिली वेलांटी (ि)', vilantiIndex, 'KeyF');
      if (vilantiToken) tokens.push(vilantiToken);

      const consonantTokens = decomposeConsonantUnit(ch, i, targetText, true);
      tokens.push(...consonantTokens.tokens);
      i = consonantTokens.nextIndex + 1; // +1 for the skipped 'ि'
      continue;
    }

    // 5. Standard Consonants, Conjuncts, Marks, Punctuation
    const unit = decomposeConsonantUnit(ch, i, targetText, false);
    if (unit.tokens.length > 0) {
      tokens.push(...unit.tokens);
      i = unit.nextIndex;
      continue;
    }

    // 6. Direct Character Mapping Fallback
    const directKey = getRemingtonKeyForChar(ch);
    if (directKey) {
      tokens.push({
        key: directKey.key,
        isShift: directKey.isShift,
        code: directKey.code,
        finger: directKey.finger,
        hand: directKey.hand,
        displayKey: directKey.displayKey,
        charNameMr: directKey.charNameMr || ch,
        charProduced: ch,
        textCharIndex: i,
      });
    } else {
      // Fallback placeholder token
      tokens.push({
        key: ch,
        isShift: false,
        code: 'KeyDefault',
        finger: 'right-index',
        hand: 'right',
        displayKey: ch,
        charNameMr: ch,
        charProduced: ch,
        textCharIndex: i,
      });
    }
    i++;
  }

  return tokens;
}

/**
 * Decomposes a consonant unit (with its broken stem, conjuncts, matras)
 */
function decomposeConsonantUnit(
  consonant: string,
  startIndex: number,
  fullText: string,
  skipAttachedVilanti: boolean = false
): { tokens: RemingtonToken[]; nextIndex: number } {
  const tokens: RemingtonToken[] = [];
  let curr = startIndex + 1;

  // Broken consonants table (defaults to half form, completed by kana 'k')
  const brokenConsonants: Record<string, { key: string; isShift: boolean; code: string; halfName: string; fullName: string }> = {
    'घ': { key: '/', isShift: true, code: 'Slash', halfName: 'अर्धा घ्', fullName: 'घ' },
    'ध': { key: '/', isShift: false, code: 'Slash', halfName: 'अर्धा ध्', fullName: 'ध' },
    'भ': { key: 'h', isShift: true, code: 'KeyH', halfName: 'अर्धा भ्', fullName: 'भ' },
    'थ': { key: 'f', isShift: true, code: 'KeyF', halfName: 'अर्धा थ्', fullName: 'थ' },
    'ख': { key: '[', isShift: false, code: 'BracketLeft', halfName: 'अर्धा ख्', fullName: 'ख' },
    'ण': { key: '.', isShift: false, code: 'Period', halfName: 'अर्धा ण्', fullName: 'ण' },
    'श': { key: "'", isShift: false, code: 'Quote', halfName: 'अर्धा श्', fullName: 'श' },
    'ष': { key: "'", isShift: true, code: 'Quote', halfName: 'अर्धा ष्', fullName: 'ष' },
    'झ': { key: '.', isShift: true, code: 'Period', halfName: 'झ', fullName: 'झ' },
  };

  // Check if current consonant is broken
  if (brokenConsonants[consonant]) {
    const info = brokenConsonants[consonant];
    const isHalfConsonantInConjunct = fullText[curr] === '्';

    if (isHalfConsonantInConjunct) {
      // Half broken consonant (e.g. 'घ्', 'ध्', 'थ्') -> user presses only the base key!
      const t1 = createTokenFromKey(info.key, info.isShift, consonant + '्', info.halfName, startIndex, info.code);
      if (t1) tokens.push(t1);
      curr++; // skip '्'
    } else {
      // Full broken consonant -> base key + kana 'k' (stem)
      const t1 = createTokenFromKey(info.key, info.isShift, info.halfName, info.halfName, startIndex, info.code);
      const t2 = createTokenFromKey('k', false, 'ा', 'काना (पूर्ण कांडी)', startIndex, 'KeyK');
      if (t1 && t2) tokens.push(t1, t2);
    }
  } else {
    // Normal direct consonants
    const standardConsonantKeys: Record<string, { key: string; isShift: boolean; code: string; name: string }> = {
      'क': { key: 'd', isShift: false, code: 'KeyD', name: 'क' },
      'ग': { key: 'x', isShift: false, code: 'KeyX', name: 'ग' },
      'च': { key: 'p', isShift: false, code: 'KeyP', name: 'च' },
      'ज': { key: 't', isShift: false, code: 'KeyT', name: 'ज' },
      'ट': { key: 'v', isShift: true, code: 'KeyV', name: 'ट' },
      'ठ': { key: 'b', isShift: true, code: 'KeyB', name: 'ठ' },
      'ड': { key: 'm', isShift: true, code: 'KeyM', name: 'ड' },
      'ढ': { key: ',', isShift: true, code: 'Comma', name: 'ढ' },
      'त': { key: 'r', isShift: false, code: 'KeyR', name: 'त' },
      'द': { key: 'n', isShift: false, code: 'KeyN', name: 'द' },
      'न': { key: 'u', isShift: false, code: 'KeyU', name: 'न' },
      'प': { key: 'i', isShift: false, code: 'KeyI', name: 'प' },
      'फ': { key: 'q', isShift: true, code: 'KeyQ', name: 'फ' },
      'ब': { key: 'c', isShift: false, code: 'KeyC', name: 'ब' },
      'म': { key: 'e', isShift: false, code: 'KeyE', name: 'म' },
      'य': { key: ';', isShift: false, code: 'Semicolon', name: 'य' },
      'र': { key: 'j', isShift: false, code: 'KeyJ', name: 'र' },
      'ल': { key: 'y', isShift: false, code: 'KeyY', name: 'ल' },
      'व': { key: 'o', isShift: false, code: 'KeyO', name: 'व' },
      'स': { key: 'l', isShift: false, code: 'KeyL', name: 'स' },
      'ह': { key: 'g', isShift: false, code: 'KeyG', name: 'ह' },
      'ळ': { key: 'g', isShift: true, code: 'KeyG', name: 'ळ' },
      'क्ष': { key: '[', isShift: true, code: 'BracketLeft', name: 'क्ष' },
      'त्र': { key: '=', isShift: false, code: 'Equal', name: 'त्र' },
      'ज्ञ': { key: 'k', isShift: true, code: 'KeyK', name: 'ज्ञ' },
      'श्र': { key: 'j', isShift: true, code: 'KeyJ', name: 'श्र' },
      'द्य': { key: '\\', isShift: true, code: 'Backslash', name: 'द्य' },
      'द्व': { key: ']', isShift: true, code: 'BracketRight', name: 'द्व' },
    };

    if (standardConsonantKeys[consonant]) {
      const info = standardConsonantKeys[consonant];
      // Check if this consonant is followed by Padstha Ra '्र' (् + र)
      const isPadsthaRa = fullText[curr] === '्' && fullText[curr + 1] === 'र';
      // Check if this consonant is a true half consonant (excluding padstha ra)
      const isHalf = fullText[curr] === '्' && !isPadsthaRa;
      
      if (isHalf) {
        // Many standard consonants have a Shift half form
        const halfKeyMappings: Record<string, { key: string; isShift: boolean; code: string; name: string }> = {
          'क': { key: 'd', isShift: true, code: 'KeyD', name: 'अर्धा क्' },
          'ग': { key: 'x', isShift: true, code: 'KeyX', name: 'अर्धा ग्' },
          'च': { key: 'p', isShift: true, code: 'KeyP', name: 'अर्धा च्' },
          'ज': { key: 't', isShift: true, code: 'KeyT', name: 'अर्धा ज्' },
          'त': { key: 'r', isShift: true, code: 'KeyR', name: 'अर्धा त्' },
          'न': { key: 'u', isShift: true, code: 'KeyU', name: 'अर्धा न्' },
          'प': { key: 'i', isShift: true, code: 'KeyI', name: 'अर्धा प्' },
          'ब': { key: 'c', isShift: true, code: 'KeyC', name: 'अर्धा ब्' },
          'म': { key: 'e', isShift: true, code: 'KeyE', name: 'अर्धा म्' },
          'ल': { key: 'y', isShift: true, code: 'KeyY', name: 'अर्धा ल्' },
          'व': { key: 'o', isShift: true, code: 'KeyO', name: 'अर्धा व्' },
          'स': { key: 'l', isShift: true, code: 'KeyL', name: 'अर्धा स्' },
        };

        if (halfKeyMappings[consonant]) {
          const halfInfo = halfKeyMappings[consonant];
          const t1 = createTokenFromKey(halfInfo.key, halfInfo.isShift, consonant + '्', halfInfo.name, startIndex, halfInfo.code);
          if (t1) tokens.push(t1);
          curr++; // skip '्'
        } else {
          // Direct key + virama
          const t1 = createTokenFromKey(info.key, info.isShift, info.name, info.name, startIndex, info.code);
          if (t1) tokens.push(t1);
        }
      } else {
        const t1 = createTokenFromKey(info.key, info.isShift, info.name, info.name, startIndex, info.code);
        if (t1) tokens.push(t1);
      }
    } else {
      // Other character
      const direct = getRemingtonKeyForChar(consonant);
      if (direct) {
        tokens.push({
          key: direct.key,
          isShift: direct.isShift,
          code: direct.code,
          finger: direct.finger,
          hand: direct.hand,
          displayKey: direct.displayKey,
          charNameMr: direct.charNameMr || consonant,
          charProduced: consonant,
          textCharIndex: startIndex,
        });
      }
    }
  }

  // Handle attached Padstha Ra '्र' (e.g. 'प्र', 'क्र', 'ग्र')
  if (fullText[curr] === '्' && fullText[curr + 1] === 'र') {
    const tPadstha = createTokenFromKey('z', false, '्र', 'पदस्थ र (्र)', curr, 'KeyZ');
    if (tPadstha) tokens.push(tPadstha);
    curr += 2;
  }

  // Handle attached Matras (Vowel Signs)
  while (curr < fullText.length) {
    const nextChar = fullText[curr];

    if (nextChar === 'ि' && skipAttachedVilanti) {
      // Already handled preposed
      curr++;
      continue;
    }

    if (nextChar === 'ा') {
      const tKana = createTokenFromKey('k', false, 'ा', 'काना (ा)', curr, 'KeyK');
      if (tKana) tokens.push(tKana);
      curr++;
      continue;
    }

    if (nextChar === 'ी') {
      const tVilanti = createTokenFromKey('h', false, 'ी', 'दुसरी वेलांटी (ी)', curr, 'KeyH');
      if (tVilanti) tokens.push(tVilanti);
      curr++;
      continue;
    }

    if (nextChar === 'ु') {
      const tU = createTokenFromKey('q', false, 'ु', 'ह्रस्व उ-कार (ु)', curr, 'KeyQ');
      if (tU) tokens.push(tU);
      curr++;
      continue;
    }

    if (nextChar === 'ू') {
      const tOo = createTokenFromKey('w', false, 'ू', 'दीर्घ ऊ-कार (ू)', curr, 'KeyW');
      if (tOo) tokens.push(tOo);
      curr++;
      continue;
    }

    if (nextChar === 'ृ') {
      const tRu = createTokenFromKey('=', true, 'ृ', 'ऋ-कार (ृ)', curr, 'Equal');
      if (tRu) tokens.push(tRu);
      curr++;
      continue;
    }

    if (nextChar === 'े') {
      const tE = createTokenFromKey('s', false, 'े', 'मात्रा (े)', curr, 'KeyS');
      if (tE) tokens.push(tE);
      curr++;
      continue;
    }

    if (nextChar === 'ै') {
      const tAi = createTokenFromKey('s', true, 'ै', 'दोन मात्रा (ै)', curr, 'KeyS');
      if (tAi) tokens.push(tAi);
      curr++;
      continue;
    }

    if (nextChar === 'ो') {
      // ो is kana + matra ('k' + 's')
      const tKana = createTokenFromKey('k', false, 'ा', 'काना (ा)', curr, 'KeyK');
      const tMatra = createTokenFromKey('s', false, 'े', 'मात्रा (े)', curr, 'KeyS');
      if (tKana && tMatra) tokens.push(tKana, tMatra);
      curr++;
      continue;
    }

    if (nextChar === 'ौ') {
      // ौ is kana + two matras ('k' + Shift+S)
      const tKana = createTokenFromKey('k', false, 'ा', 'काना (ा)', curr, 'KeyK');
      const tMatra2 = createTokenFromKey('s', true, 'ै', 'दोन मात्रा (ै)', curr, 'KeyS');
      if (tKana && tMatra2) tokens.push(tKana, tMatra2);
      curr++;
      continue;
    }

    if (nextChar === 'ं') {
      const tAnuswar = createTokenFromKey('a', false, 'ं', 'अनुस्वार (ं)', curr, 'KeyA');
      if (tAnuswar) tokens.push(tAnuswar);
      curr++;
      continue;
    }

    if (nextChar === 'ः') {
      const tVisarga = createTokenFromKey('5', true, 'ः', 'विसर्ग (ः)', curr, 'Digit5');
      if (tVisarga) tokens.push(tVisarga);
      curr++;
      continue;
    }

    if (nextChar === 'ॅ') {
      const tChandra = createTokenFromKey('w', true, 'ॅ', 'चन्द्र (ॅ)', curr, 'KeyW');
      if (tChandra) tokens.push(tChandra);
      curr++;
      continue;
    }

    if (nextChar === '़') {
      const tNukta = createTokenFromKey('`', false, '़', 'नुक्ता (़)', curr, 'Backquote');
      if (tNukta) tokens.push(tNukta);
      curr++;
      continue;
    }

    break;
  }

  return { tokens, nextIndex: curr };
}

/**
 * Validates a user keystroke against the active token.
 * Provides rich tolerance for:
 * - Exact key and Shift state match
 * - Devanagari character equivalence
 * - Decomposed vs composed O-kar / Au-kar
 * - Punctuation aliases (। vs .)
 */
export function matchUserKeystroke(
  e: { key: string; isShift: boolean; code?: string },
  activeToken: RemingtonToken,
  devanagariTyped: string | null
): boolean {
  if (!activeToken) return false;

  // 1. Direct Physical Key & Shift Match
  if (
    e.key.toLowerCase() === activeToken.key.toLowerCase() &&
    e.isShift === activeToken.isShift
  ) {
    return true;
  }

  // Code match (e.g. Slash with Shift for Shift+/)
  if (
    e.code &&
    activeToken.code &&
    e.code === activeToken.code &&
    e.isShift === activeToken.isShift
  ) {
    return true;
  }

  // 2. Space match
  if (activeToken.key === ' ' && (e.key === ' ' || e.code === 'Space')) {
    return true;
  }

  // 3. Devanagari Character Equality
  if (devanagariTyped && activeToken.charProduced) {
    const typedNorm = devanagariTyped.normalize('NFC');
    const expectedNorm = activeToken.charProduced.normalize('NFC');
    if (typedNorm === expectedNorm) return true;

    // Tolerance for half consonants
    if (
      typedNorm === expectedNorm + '\u094D' ||
      typedNorm + '\u094D' === expectedNorm
    ) {
      return true;
    }
  }

  // 4. Punctuation Aliases
  if (
    (activeToken.charProduced === '।' || activeToken.key === 'a') &&
    (e.key === '.' || e.key === '।' || e.code === 'Period')
  ) {
    return true;
  }

  if (
    (activeToken.charProduced === '—' || activeToken.charProduced === '-') &&
    (e.key === '-' || e.key === '—' || e.key === '_' || e.code === 'Minus')
  ) {
    return true;
  }

  if (
    (activeToken.charProduced === '"' || activeToken.charProduced === '“' || activeToken.charProduced === '”') &&
    (e.key === '"' || e.key === "'" || e.code === 'Quote')
  ) {
    return true;
  }

  return false;
}
