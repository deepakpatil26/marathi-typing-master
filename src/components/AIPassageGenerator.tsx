import React, { useState } from 'react';
import { Sparkles, BookOpen, Layers, Play, Loader2, RefreshCw } from 'lucide-react';
import { TOPIC_PASSAGES, TopicPassageItem } from '../data/curriculum';
import { LessonStep } from '../types';
import { sound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';
import { getApiEndpoint } from '../utils/apiConfig';

interface AIPassageGeneratorProps {
  language: 'mr' | 'en';
  onStartPractice: (lesson: LessonStep) => void;
}

export const AIPassageGenerator: React.FC<AIPassageGeneratorProps> = ({
  language,
  onStartPractice
}) => {
  const { isDark } = useTheme();
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [speedFilter, setSpeedFilter] = useState<'all' | '30' | '40'>('all');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [targetSpeed, setTargetSpeed] = useState<number>(30);
  const [generatedPassage, setGeneratedPassage] = useState<{
    titleMr: string;
    titleEn: string;
    text: string;
    topic: string;
  } | null>(null);

  const topicsList = [
    { id: 'all', nameMr: 'सर्व विषय (All Topics)', nameEn: 'All Topics' },
    { id: 'admin', nameMr: 'शासकीय परिपत्रके (Admin & E-Office)', nameEn: 'Government & E-Office' },
    { id: 'history', nameMr: 'ऐतिहासिक व संत परंपरा (History & Saints)', nameEn: 'History & Saints' },
    { id: 'science', nameMr: 'विज्ञान व AI (Science & Technology)', nameEn: 'Science & AI' },
    { id: 'agriculture', nameMr: 'कृषी व ग्रामीण जीवन (Agriculture)', nameEn: 'Agriculture & Rural' },
    { id: 'literature', nameMr: 'साहित्य व संस्कृती (Literature & Culture)', nameEn: 'Literature' },
    { id: 'law', nameMr: 'संविधान व विधी (Constitution & Law)', nameEn: 'Law & Constitution' },
    { id: 'sports', nameMr: 'क्रीडा व आरोग्य (Sports & Health)', nameEn: 'Sports & Health' }
  ];

  const filteredPresetPassages = TOPIC_PASSAGES.filter(p => {
    const matchesTopic = selectedTopic === 'all' || p.topicId === selectedTopic;
    const matchesSpeed = speedFilter === 'all' || p.speed.toString() === speedFilter;
    return matchesTopic && matchesSpeed;
  });

  const handleLaunchPassage = (item: TopicPassageItem) => {
    sound.playKeyClick();
    const lesson: LessonStep = {
      id: `topic-${item.id}`,
      titleEn: item.titleEn,
      titleMr: item.titleMr,
      descriptionEn: `Official Maharashtra Domain Passage - Target Speed: ${item.speed} WPM (${item.level})`,
      descriptionMr: `विशेष विषय परिच्छेद - उद्दिष्ट गती: ${item.speed} WPM (${item.level})`,
      targetText: item.text,
      keysIntroduced: [item.topicTitleMr],
      recommendedWpm: item.speed
    };
    onStartPractice(lesson);
  };

  const handleGenerateAiPassage = async (topicIdToUse?: string) => {
    sound.playKeyClick();
    setIsGenerating(true);
    const chosenTopic = topicIdToUse || (selectedTopic === 'all' ? 'admin' : selectedTopic);

    try {
      const res = await fetch(getApiEndpoint('/api/ai/generate-passage'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: chosenTopic,
          difficulty,
          targetSpeed,
          customPrompt: customPrompt.trim() || undefined
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        setGeneratedPassage(json.data);
        sound.playSuccessSound();
      }
    } catch {
      // Fallback to random preset if network error
      const randomPreset = TOPIC_PASSAGES[Math.floor(Math.random() * TOPIC_PASSAGES.length)];
      setGeneratedPassage({
        titleMr: randomPreset.titleMr,
        titleEn: randomPreset.titleEn,
        text: randomPreset.text,
        topic: randomPreset.topicId
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLaunchGenerated = () => {
    if (!generatedPassage) return;
    sound.playKeyClick();
    const lesson: LessonStep = {
      id: `ai-gen-${Date.now()}`,
      titleEn: generatedPassage.titleEn,
      titleMr: generatedPassage.titleMr,
      descriptionEn: `AI Generated Marathi Passage (${targetSpeed} WPM Standard)`,
      descriptionMr: `AI द्वारे तयार केलेला परिच्छेद (${targetSpeed} WPM मानक)`,
      targetText: generatedPassage.text,
      keysIntroduced: ['AI Generated'],
      recommendedWpm: targetSpeed
    };
    onStartPractice(lesson);
  };

  return (
    <div id="ai-passage-generator-container" className="w-full min-w-0 max-w-full flex flex-col gap-6">
      {/* Top Banner / Generator Controls */}
      <div className={`w-full min-w-0 max-w-full overflow-hidden rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-md border transition-colors ${
        isDark 
          ? 'bg-[#072431]/95 border-teal-800/40 text-slate-100' 
          : 'bg-white/95 border-teal-200/80 text-slate-900 shadow-teal-900/5'
      }`}>
        <div className={`flex flex-col xl:flex-row items-start xl:items-center justify-between gap-5 pb-5 border-b ${
          isDark ? 'border-teal-900/50' : 'border-teal-100'
        }`}>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 text-slate-950 shadow-md shrink-0">
                <Sparkles className="w-5 h-5 fill-slate-950" />
              </div>
              <div className="min-w-0">
                <h2 className={`text-lg sm:text-2xl font-black truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {language === 'mr' ? 'विषयानुसार AI परिच्छेद जनरेटर' : 'AI Topic Passage Generator'}
                </h2>
                <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? 'text-cyan-200/70' : 'text-slate-600'}`}>
                  {language === 'mr' 
                    ? 'शासकीय, ऐतिहासिक, वैज्ञानिक व कृषी विषयांचे सखोल परिच्छेद एका क्लिकवर तयार करा.' 
                    : 'Craft authentic Marathi typing passages across Government, History, Science, and Agriculture.'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick AI Options */}
          <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto">
            <div className={`flex items-center gap-1.5 p-1 rounded-xl border ${
              isDark ? 'bg-[#051C27] border-teal-900/60' : 'bg-slate-100 border-slate-300'
            }`}>
              <span className={`text-[11px] font-bold px-2 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>{language === 'mr' ? 'गती:' : 'Speed:'}</span>
              {[30, 40].map(spd => (
                <button
                  key={spd}
                  onClick={() => { sound.playKeyClick(); setTargetSpeed(spd); }}
                  className={`px-3 py-1 text-xs font-black rounded-lg cursor-pointer transition-all ${
                    targetSpeed === spd
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-md'
                      : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-950'
                  }`}
                >
                  {spd} WPM
                </button>
              ))}
            </div>

            <div className={`flex items-center gap-1.5 p-1 rounded-xl border ${
              isDark ? 'bg-[#051C27] border-teal-900/60' : 'bg-slate-100 border-slate-300'
            }`}>
              {(['easy', 'medium', 'hard'] as const).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => { sound.playKeyClick(); setDifficulty(lvl); }}
                  className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                    difficulty === lvl
                      ? isDark 
                        ? 'bg-teal-500/20 text-cyan-300 border border-teal-500/40' 
                        : 'bg-white text-teal-950 font-bold border border-teal-300 shadow-sm'
                      : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {lvl === 'easy' ? (language === 'mr' ? 'सोपे' : 'Easy') : lvl === 'medium' ? (language === 'mr' ? 'मध्यम' : 'Med') : (language === 'mr' ? 'कठीण' : 'Hard')}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleGenerateAiPassage()}
              disabled={isGenerating}
              className="w-full sm:w-auto px-5 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-teal-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{language === 'mr' ? 'तयार होत आहे...' : 'Generating...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>{language === 'mr' ? 'नवीन AI परिच्छेद बनवा' : 'Generate AI Passage'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Optional Custom Topic Prompt Input */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-2 min-w-0">
          <input
            type="text"
            value={customPrompt}
            onChange={e => setCustomPrompt(e.target.value)}
            placeholder={language === 'mr' ? 'उदा. डॉ. बाबासाहेब आंबेडकर, इस्रो मोहीम, पर्यावरण संवर्धन किंवा कोणताही विषय...' : 'Optional custom prompt: e.g. ISRO missions, Chhatrapati Shivaji Maharaj, Climate change...'}
            className={`flex-1 w-full min-w-0 rounded-xl px-4 py-2.5 text-xs sm:text-sm border focus:outline-none font-sans ${
              isDark 
                ? 'bg-[#051C27] border-teal-900/70 text-slate-200 placeholder-slate-500 focus:border-cyan-400' 
                : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-teal-500'
            }`}
            style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
          />
          {customPrompt && (
            <button
              onClick={() => setCustomPrompt('')}
              className="px-3 py-2 text-xs text-slate-400 hover:text-rose-400 cursor-pointer font-bold shrink-0"
            >
              {language === 'mr' ? 'साफ करा' : 'Clear'}
            </button>
          )}
        </div>

        {/* Live AI Generated Preview Box */}
        {generatedPassage && (
          <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#072E3F] to-[#041A25] border-2 border-cyan-400/50 shadow-2xl space-y-4 min-w-0 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-900/40 pb-3 min-w-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="p-1.5 rounded-lg bg-cyan-400/20 text-cyan-300 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-white font-sans truncate" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                    {generatedPassage.titleMr}
                  </h3>
                  <p className="text-xs text-cyan-200/70 truncate">{generatedPassage.titleEn}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
                  {targetSpeed} WPM Standard
                </span>
                <button
                  onClick={() => handleGenerateAiPassage()}
                  disabled={isGenerating}
                  className="p-2 rounded-xl bg-[#051C27] hover:bg-[#092B3A] text-slate-300 hover:text-cyan-300 border border-teal-900/60 cursor-pointer transition-all"
                  title="Generate another"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-100 leading-relaxed p-4 rounded-xl bg-[#02131C] border border-teal-900/60 font-sans break-words" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
              {generatedPassage.text}
            </p>

            <div className="flex justify-end pt-1">
              <button
                onClick={handleLaunchGenerated}
                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-teal-500/25 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>{language === 'mr' ? 'हा AI परिच्छेद टंकलेखनासाठी सुरू करा' : 'Start Typing This AI Passage'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Domain Topics Library & Pre-Stored Passages Catalog */}
      <div className={`w-full min-w-0 max-w-full overflow-hidden rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-md space-y-6 border transition-colors ${
        isDark 
          ? 'bg-[#072431]/95 border-teal-800/40 text-slate-100' 
          : 'bg-white/95 border-teal-200/80 text-slate-900 shadow-teal-900/5'
      }`}>
        {/* Filter Headers */}
        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b min-w-0 ${
          isDark ? 'border-teal-900/50' : 'border-teal-100'
        }`}>
          <div className="flex items-center gap-2 min-w-0">
            <div className={`p-2 rounded-xl border shrink-0 ${
              isDark ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-cyan-50 border-cyan-200 text-cyan-700'
            }`}>
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className={`text-base sm:text-lg font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {language === 'mr' ? 'अधिकृत विषय संग्रह (Official Topics Catalog)' : 'Official Domain Topics Catalog'}
              </h3>
              <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {language === 'mr' ? 'परीक्षेसाठी आवश्यक असलेले सर्व विषयानुसार परिच्छेद' : 'Pre-curated exam passages categorized by official domain'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className={`flex items-center gap-1 p-1 rounded-xl border text-xs ${
              isDark ? 'bg-[#051C27] border-teal-900/60' : 'bg-slate-100 border-slate-300'
            }`}>
              {(['all', '30', '40'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => { sound.playKeyClick(); setSpeedFilter(s); }}
                  className={`px-3 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                    speedFilter === s
                      ? isDark 
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                        : 'bg-white text-teal-950 font-black border border-teal-300 shadow-sm'
                      : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-700 hover:text-slate-950'
                  }`}
                >
                  {s === 'all' ? (language === 'mr' ? 'सर्व गती' : 'All') : `${s} WPM`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Topic Pills - wrapped safely with horizontal scroll inside bounded parent */}
        <div className="w-full min-w-0 max-w-full overflow-hidden">
          <div className="w-full overflow-x-auto pb-2 scrollbar-thin">
            <div className="flex items-center gap-2 w-max pr-4">
              {topicsList.map(t => (
                <button
                  key={t.id}
                  onClick={() => { sound.playKeyClick(); setSelectedTopic(t.id); }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all border shrink-0 ${
                    selectedTopic === t.id
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-black border-cyan-300 shadow-md shadow-teal-500/20'
                      : isDark 
                        ? 'bg-[#051C27] text-slate-300 border-teal-900/60 hover:border-teal-700/60 hover:bg-[#082837]' 
                        : 'bg-slate-100 text-slate-800 border-slate-300 hover:border-teal-400 hover:bg-white font-bold'
                  }`}
                >
                  {language === 'mr' ? t.nameMr : t.nameEn}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Passage Cards Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 min-w-0 w-full">
          {filteredPresetPassages.map(item => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-3 shadow-lg group min-w-0 overflow-hidden ${
                isDark 
                  ? 'bg-[#051C27]/90 border-teal-900/60 hover:border-cyan-400/50 hover:bg-[#072837]' 
                  : 'bg-slate-50/90 border-teal-100 hover:border-teal-400 hover:bg-white shadow-teal-950/5'
              }`}
            >
              <div className="space-y-2 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] uppercase tracking-wider font-black px-2.5 py-0.5 rounded-full border truncate ${
                    isDark ? 'bg-teal-500/10 text-teal-300 border-teal-500/30' : 'bg-teal-100/80 text-teal-800 border-teal-200'
                  }`}>
                    {item.topicTitleMr}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                    isDark ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60' : 'bg-cyan-100/80 text-cyan-800 border-cyan-200'
                  }`}>
                    {item.speed} WPM
                  </span>
                </div>

                <h4 className={`text-sm font-bold font-sans transition-colors break-words ${
                  isDark ? 'text-white group-hover:text-cyan-300' : 'text-slate-900 group-hover:text-teal-700'
                }`} style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                  {item.titleMr}
                </h4>

                <p className={`text-xs line-clamp-3 leading-relaxed font-sans break-words ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`} style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                  {item.text}
                </p>
              </div>

              <div className={`flex items-center justify-between pt-2 border-t ${
                isDark ? 'border-teal-900/40' : 'border-slate-200'
              }`}>
                <span className={`text-[11px] capitalize ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {language === 'mr' ? (item.level === 'easy' ? 'सोपे' : item.level === 'medium' ? 'मध्यम' : 'कठीण') : item.level}
                </span>

                <button
                  onClick={() => handleLaunchPassage(item)}
                  className={`px-4 py-1.5 font-bold text-xs rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isDark 
                      ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 hover:from-teal-500 hover:to-cyan-500 hover:text-slate-950 text-cyan-300 border-cyan-500/40' 
                      : 'bg-teal-50 hover:bg-teal-500 hover:text-white text-teal-800 border-teal-200'
                  }`}
                >
                  <Play className="w-3 h-3" />
                  <span>{language === 'mr' ? 'सराव सुरू करा' : 'Practice'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
