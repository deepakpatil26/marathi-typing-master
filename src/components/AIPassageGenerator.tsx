import React, { useState } from 'react';
import { Sparkles, BookOpen, Layers, Play, Loader2, RefreshCw } from 'lucide-react';
import { TOPIC_PASSAGES, TopicPassageItem } from '../data/curriculum';
import { LessonStep } from '../types';
import { sound } from '../utils/audio';

interface AIPassageGeneratorProps {
  language: 'mr' | 'en';
  onStartPractice: (lesson: LessonStep) => void;
}

export const AIPassageGenerator: React.FC<AIPassageGeneratorProps> = ({
  language,
  onStartPractice
}) => {
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
      const res = await fetch('/api/ai/generate-passage', {
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
    <div id="ai-passage-generator-container" className="w-full flex flex-col gap-6">
      {/* Top Banner / Generator Controls */}
      <div className="w-full bg-[#072431]/95 border border-teal-800/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-teal-900/50">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 text-slate-950 shadow-md">
                <Sparkles className="w-5 h-5 fill-slate-950" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {language === 'mr' ? 'विषयानुसार AI परिच्छेद जनरेटर' : 'AI Topic Passage Generator'}
                </h2>
                <p className="text-xs sm:text-sm text-cyan-200/70">
                  {language === 'mr' 
                    ? 'शासकीय, ऐतिहासिक, वैज्ञानिक व कृषी विषयांचे सखोल परिच्छेद एका क्लिकवर तयार करा.' 
                    : 'Craft authentic Marathi typing passages across Government, History, Science, and Agriculture.'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick AI Options */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 bg-[#051C27] p-1 rounded-xl border border-teal-900/60">
              <span className="text-[11px] text-slate-400 font-bold px-2">{language === 'mr' ? 'गती:' : 'Speed:'}</span>
              {[30, 40].map(spd => (
                <button
                  key={spd}
                  onClick={() => { sound.playKeyClick(); setTargetSpeed(spd); }}
                  className={`px-3 py-1 text-xs font-black rounded-lg cursor-pointer transition-all ${
                    targetSpeed === spd
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {spd} WPM
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 bg-[#051C27] p-1 rounded-xl border border-teal-900/60">
              {(['easy', 'medium', 'hard'] as const).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => { sound.playKeyClick(); setDifficulty(lvl); }}
                  className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                    difficulty === lvl
                      ? 'bg-teal-500/20 text-cyan-300 border border-teal-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lvl === 'easy' ? (language === 'mr' ? 'सोपे' : 'Easy') : lvl === 'medium' ? (language === 'mr' ? 'मध्यम' : 'Med') : (language === 'mr' ? 'कठीण' : 'Hard')}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleGenerateAiPassage()}
              disabled={isGenerating}
              className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-teal-500/25 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
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
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
          <input
            type="text"
            value={customPrompt}
            onChange={e => setCustomPrompt(e.target.value)}
            placeholder={language === 'mr' ? 'उदा. डॉ. बाबासाहेब आंबेडकर, इस्रो मोहीम, पर्यावरण संवर्धन किंवा कोणताही विषय...' : 'Optional custom prompt: e.g. ISRO missions, Chhatrapati Shivaji Maharaj, Climate change...'}
            className="flex-1 w-full bg-[#051C27] border border-teal-900/70 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
            style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
          />
          {customPrompt && (
            <button
              onClick={() => setCustomPrompt('')}
              className="px-3 py-2 text-xs text-slate-400 hover:text-rose-400 cursor-pointer font-bold"
            >
              {language === 'mr' ? 'साफ करा' : 'Clear'}
            </button>
          )}
        </div>

        {/* Live AI Generated Preview Box */}
        {generatedPassage && (
          <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-[#072E3F] to-[#041A25] border-2 border-cyan-400/50 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-900/40 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-lg bg-cyan-400/20 text-cyan-300">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-white font-sans" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                    {generatedPassage.titleMr}
                  </h3>
                  <p className="text-xs text-cyan-200/70">{generatedPassage.titleEn}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
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

            <p className="text-sm sm:text-base text-slate-100 leading-relaxed p-4 rounded-xl bg-[#02131C] border border-teal-900/60 font-sans" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
              {generatedPassage.text}
            </p>

            <div className="flex justify-end pt-1">
              <button
                onClick={handleLaunchGenerated}
                className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-teal-500/25 transition-all cursor-pointer flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>{language === 'mr' ? 'हा AI परिच्छेद टंकलेखनासाठी सुरू करा' : 'Start Typing This AI Passage'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Domain Topics Library & Pre-Stored Passages Catalog */}
      <div className="w-full bg-[#072431]/95 border border-teal-800/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
        {/* Filter Headers */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-teal-900/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {language === 'mr' ? 'अधिकृत विषय संग्रह (Official Topics Catalog)' : 'Official Domain Topics Catalog'}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'mr' ? 'परीक्षेसाठी आवश्यक असलेले सर्व विषयानुसार परिच्छेद' : 'Pre-curated exam passages categorized by official domain'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-[#051C27] p-1 rounded-xl border border-teal-900/60 text-xs">
              {(['all', '30', '40'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => { sound.playKeyClick(); setSpeedFilter(s); }}
                  className={`px-3 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                    speedFilter === s
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s === 'all' ? (language === 'mr' ? 'सर्व गती' : 'All') : `${s} WPM`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Topic Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {topicsList.map(t => (
            <button
              key={t.id}
              onClick={() => { sound.playKeyClick(); setSelectedTopic(t.id); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all border ${
                selectedTopic === t.id
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-black border-cyan-300 shadow-md shadow-teal-500/20'
                  : 'bg-[#051C27] text-slate-300 border-teal-900/60 hover:border-teal-700/60 hover:bg-[#082837]'
              }`}
            >
              {language === 'mr' ? t.nameMr : t.nameEn}
            </button>
          ))}
        </div>

        {/* Passage Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPresetPassages.map(item => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-[#051C27]/90 border border-teal-900/60 hover:border-cyan-400/50 hover:bg-[#072837] transition-all flex flex-col justify-between gap-3 shadow-lg group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase tracking-wider font-black px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30">
                    {item.topicTitleMr}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                    {item.speed} WPM
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white font-sans group-hover:text-cyan-300 transition-colors" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                  {item.titleMr}
                </h4>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed font-sans" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                  {item.text}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-teal-900/40">
                <span className="text-[11px] text-slate-400 capitalize">
                  {language === 'mr' ? (item.level === 'easy' ? 'सोपे' : item.level === 'medium' ? 'मध्यम' : 'कठीण') : item.level}
                </span>

                <button
                  onClick={() => handleLaunchPassage(item)}
                  className="px-4 py-1.5 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 hover:from-teal-500 hover:to-cyan-500 hover:text-slate-950 text-cyan-300 font-bold text-xs rounded-xl border border-cyan-500/40 transition-all cursor-pointer flex items-center gap-1.5"
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
