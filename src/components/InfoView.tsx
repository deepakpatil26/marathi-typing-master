import React from 'react';
import { Info, Keyboard, Award, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface InfoViewProps {
  language: 'mr' | 'en';
}

export const InfoView: React.FC<InfoViewProps> = ({ language }) => {
  const { isDark } = useTheme();

  return (
    <div 
      id="info-view" 
      className={`w-full rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md flex flex-col gap-6 max-w-4xl mx-auto border transition-colors ${
        isDark 
          ? 'bg-[#072431]/95 border-teal-800/40 text-slate-100' 
          : 'bg-white/95 border-teal-200/80 text-slate-900 shadow-teal-900/5'
      }`}
    >
      <div className={`pb-4 border-b flex items-center gap-3 ${isDark ? 'border-teal-900/50' : 'border-teal-100'}`}>
        <div className={`p-2.5 rounded-xl border ${
          isDark ? 'bg-teal-500/10 border-teal-500/30 text-teal-400' : 'bg-teal-50 border-teal-200 text-teal-700'
        }`}>
          <Info className="w-5 h-5" />
        </div>
        <div>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {language === 'mr' ? 'रेमिंग्टन टंकलेखन मार्गदर्शक (Remington Typing Guide)' : 'Marathi Remington Typing Guide & GCC-TBC Manual'}
          </h2>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-cyan-200/70' : 'text-slate-600'}`}>
            {language === 'mr' ? 'महाराष्ट्र शासन GCC-TBC व MPSC परीक्षांसाठी संपूर्ण माहिती' : 'Official guidelines for ISM DVBW layout and GCC-TBC typing tests.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Section 1: Remington Layout Basics */}
        <div className={`rounded-2xl p-5 flex flex-col gap-3 border transition-colors ${
          isDark ? 'bg-[#051C27]/90 border-teal-900/60' : 'bg-slate-50 border-teal-100'
        }`}>
          <div className="flex items-center gap-2 text-teal-600 dark:text-cyan-400 font-bold text-sm">
            <Keyboard className="w-4 h-4" />
            <span>{language === 'mr' ? '१. रेमिंग्टन (ISM DVBW) कीबोर्ड म्हणजे काय?' : '1. What is Remington Devanagari?'}</span>
          </div>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {language === 'mr'
              ? 'मराठी टंकलेखनासाठी पारंपरिक टाईपरायटरच्या मांडणीवर आधारित कीबोर्ड लेआउट म्हणजेच "रेमिंग्टन". महाराष्ट्र शासनाच्या सर्व GCC-TBC संगणक टायपिंग परीक्षांमध्ये आणि महसूल/न्यायालयीन भरतीमध्ये हाच लेआउट अधिकृतपणे वापरला जातो.'
              : 'Remington Devanagari is the standard typewriter-based layout used officially in Maharashtra government offices, GCC-TBC computer typing examinations, and district court recruitments.'}
          </p>
        </div>

        {/* Section 2: Shift Key Rules */}
        <div className={`rounded-2xl p-5 flex flex-col gap-3 border transition-colors ${
          isDark ? 'bg-[#051C27]/90 border-teal-900/60' : 'bg-slate-50 border-teal-100'
        }`}>
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>{language === 'mr' ? '२. शिफ्ट की (Shift Key) चे महत्त्व' : '2. The Shift Key Combinations'}</span>
          </div>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {language === 'mr'
              ? 'मराठीतील अनेक महत्त्वाची अक्षरे शिफ्ट की दाबून मिळतात: जसे Shift + G = ‘ळ’, Shift + P = ‘च’, Shift + R = ‘ष’, Shift + U = ‘श’, Shift + 7 = ‘क्ष’, Shift + 8 = ‘त्र’. डाव्या हाताने की दाबताना उजवा शिफ्ट, आणि उजव्या हाताने की दाबताना डावा शिफ्ट वापरावा.'
              : 'Major Marathi consonants and conjuncts require Shift: Shift+G produces ‘ळ’, Shift+R gives ‘ष’, Shift+U gives ‘श’, Shift+7 gives ‘क्ष’, Shift+8 gives ‘त्र’. Always use opposite-hand Shift.'}
          </p>
        </div>

        {/* Section 3: 10-Finger Posture */}
        <div className={`rounded-2xl p-5 flex flex-col gap-3 border transition-colors ${
          isDark ? 'bg-[#051C27]/90 border-teal-900/60' : 'bg-slate-50 border-teal-100'
        }`}>
          <div className="flex items-center gap-2 text-teal-600 dark:text-cyan-300 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>{language === 'mr' ? '३. बोटांची मूळ स्थिती (Home Row Position)' : '3. Home Row Finger Placement'}</span>
          </div>
          <ul className={`text-xs space-y-1.5 list-disc list-inside ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            <li><strong>{language === 'mr' ? 'डावा हात (Left Hand)' : 'Left Hand'}:</strong> A (ो), S (े), D (क्), F (ि)</li>
            <li><strong>{language === 'mr' ? 'उजवा हात (Right Hand)' : 'Right Hand'}:</strong> J (र्), K (ा), L (स), ; (य)</li>
            <li><strong>{language === 'mr' ? 'अंगठा (Thumb)' : 'Thumbs'}:</strong> Spacebar (␣)</li>
          </ul>
        </div>

        {/* Section 4: GCC-TBC Marking & Speed */}
        <div className={`rounded-2xl p-5 flex flex-col gap-3 border transition-colors ${
          isDark ? 'bg-[#051C27]/90 border-teal-900/60' : 'bg-slate-50 border-teal-100'
        }`}>
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-300 font-bold text-sm">
            <Award className="w-4 h-4" />
            <span>{language === 'mr' ? '४. GCC-TBC परीक्षा नियम व गुणपद्धती' : '4. GCC-TBC Exam Benchmark Rules'}</span>
          </div>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {language === 'mr'
              ? '३० श.प्र.मि. (30 WPM) साठी १५० शब्द (७५० अक्षरे) ५ मिनिटांत अचूक टाईप करावे लागतात. प्रत्येक चुकीच्या शब्दासाठी १ शब्दाचा दंड (Penalization) केला जातो. उत्तीर्ण होण्यासाठी किमान ९०% अचूकता आवश्यक असते.'
              : 'For 30 WPM, 150 words (750 keystrokes) must be typed in 5 minutes with at least 90% accuracy. One word is deducted for each mistake.'}
          </p>
        </div>
      </div>
    </div>
  );
};
