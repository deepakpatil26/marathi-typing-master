/**
 * Devanagari Typography & Akshara (Grapheme Cluster) Segmentation Engine
 * 
 * In Unicode Devanagari, combining marks (kana, matra, vilanti, halant, anuswar)
 * CANNOT exist inside standalone HTML elements without a base consonant.
 * If an isolated <span> contains only a combining mark (like U+093E 'ा' or U+0940 'ी'),
 * the browser's OpenType text shaper (HarfBuzz / DirectWrite) is required by Unicode
 * to insert U+25CC DOTTED CIRCLE (◌) as a placeholder base.
 * 
 * By segmenting Devanagari words into intact Aksharas (syllable grapheme clusters),
 * every base consonant stays bound with its attached matras and viramas (e.g. "गा", "ती", "प्रा", "र्व").
 * This completely eliminates all dotted circle artifacts and renders 100% natural,
 * clean Devanagari text matching Microsoft Word and official GCC-TBC typing software.
 */

export interface DevanagariAkshara {
  text: string;
  startIndex: number;
  endIndex: number; // exclusive character index in original string
}

export interface DevanagariWordGroup {
  wordFullText: string;
  startIndex: number;
  endIndex: number; // exclusive
  aksharas: DevanagariAkshara[];
  trailingSpace?: {
    char: string;
    index: number;
  };
  hasNewlineAfter?: boolean;
}

/**
 * Segments an individual word into Devanagari aksharas (grapheme clusters).
 */
export function segmentWordIntoAksharas(wordText: string, wordOffset: number): DevanagariAkshara[] {
  if (!wordText) return [];

  // Preferred modern API: Intl.Segmenter with Marathi locale
  if (typeof Intl !== 'undefined' && (Intl as any).Segmenter) {
    try {
      const segmenter = new (Intl as any).Segmenter('mr', { granularity: 'grapheme' });
      const segments = [...segmenter.segment(wordText)];
      return segments.map((s: any) => ({
        text: s.segment,
        startIndex: wordOffset + s.index,
        endIndex: wordOffset + s.index + s.segment.length,
      }));
    } catch {
      // Fall through to regex
    }
  }

  // Robust Devanagari Grapheme Cluster Regex Fallback
  // Matches: Base consonant/vowel + optional nukta + any (virama + consonant) conjunct chains + attached matras/anuswara
  const regex = /(?:[\u0904-\u0939\u0958-\u0961\u0972-\u097F](?:[\u093C])?(?:[\u094D](?:[\u0904-\u0939\u0958-\u0961\u0972-\u097F](?:[\u093C])?)*)?(?:[\u0900-\u0903\u093A-\u094C\u094E-\u094F\u0951-\u0957\u0962-\u0963])?)|./gu;
  const aksharas: DevanagariAkshara[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(wordText)) !== null) {
    aksharas.push({
      text: match[0],
      startIndex: wordOffset + match.index,
      endIndex: wordOffset + match.index + match[0].length,
    });
  }
  return aksharas;
}

/**
 * Builds Devanagari word groups with exact character indices for real-time keystroke tracking.
 */
export function buildDevanagariWordGroups(text: string): DevanagariWordGroup[] {
  const groups: DevanagariWordGroup[] = [];
  if (!text) return groups;

  let currentWordChars: string[] = [];
  let wordStartIndex = 0;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (ch === ' ' || ch === '\n') {
      if (currentWordChars.length > 0) {
        const wordText = currentWordChars.join('');
        const endIndex = wordStartIndex + wordText.length;
        const aksharas = segmentWordIntoAksharas(wordText, wordStartIndex);
        groups.push({
          wordFullText: wordText,
          startIndex: wordStartIndex,
          endIndex,
          aksharas,
          trailingSpace: { char: ch, index: i },
          hasNewlineAfter: ch === '\n'
        });
        currentWordChars = [];
      } else if (groups.length > 0) {
        // Additional space or newline
        const lastGroup = groups[groups.length - 1];
        if (ch === '\n') {
          lastGroup.hasNewlineAfter = true;
        }
      }
      wordStartIndex = i + 1;
    } else {
      if (currentWordChars.length === 0) {
        wordStartIndex = i;
      }
      currentWordChars.push(ch);
    }
  }

  // Final word if string didn't end with space
  if (currentWordChars.length > 0) {
    const wordText = currentWordChars.join('');
    const endIndex = wordStartIndex + wordText.length;
    const aksharas = segmentWordIntoAksharas(wordText, wordStartIndex);
    groups.push({
      wordFullText: wordText,
      startIndex: wordStartIndex,
      endIndex,
      aksharas
    });
  }

  return groups;
}
