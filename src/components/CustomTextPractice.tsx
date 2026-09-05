import React, { useState, useRef, useEffect } from 'react';
import { LessonStep, UserProgress, Finger, SavedInstitutePaper } from '../types';
import { TypingArea } from './TypingArea';
import { 
  FileText, 
  Play, 
  RotateCcw, 
  Upload, 
  Save, 
  Trash2, 
  FileUp, 
  Clock, 
  BookOpen, 
  Sparkles,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface CustomTextPracticeProps {
  userProgress: UserProgress;
  setUserProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
  language: 'mr' | 'en';
  onActiveTargetChange: (targetInfo: { key: string; isShift: boolean; code: string; finger: Finger; hand: string } | null) => void;
  onKeyPressedChange: (keys: Set<string>) => void;
}

const STORAGE_KEY_PAPERS = 'marathi_typing_saved_institute_papers_v1';

// Preloaded Official GCC-TBC Practice Question Papers for Institutes
const PRESET_INSTITUTE_PAPERS: SavedInstitutePaper[] = [
  {
    id: 'preset-gcc-30-1',
    title: 'GCC-TBC ३० WPM नमुना प्रश्नपत्रिका १ (डिजिटल साक्षरता)',
    text: 'महाराष्ट्र शासनाच्या वतीने राबविण्यात येणाऱ्या विविध जनकल्याणकारी योजनांची माहिती तळागाळातील नागरिकांपर्यंत पोहोचविण्यासाठी संगणक व माहिती तंत्रज्ञानाचा प्रभावी वापर आवश्यक आहे. शासकीय कार्यालयांमध्ये ई-प्रशासन प्रणाली कार्यान्वित करण्यात आली असून सर्व प्रकारच्या पत्रव्यवहारासाठी मराठी टंकलेखनाचा सातत्याने वापर केला जातो. अचूक टंकलेखनामुळे प्रशासकीय कामकाजाची गती वाढते आणि कामात पारदर्शकता टिकून राहते.',
    wordCount: 52,
    createdAt: '2025-01-10'
  },
  {
    id: 'preset-gcc-40-1',
    title: 'GCC-TBC ४० WPM प्रगत परीक्षा उतारा (कृषी व जलसंधारण)',
    text: 'महाराष्ट्रातील दुष्काळग्रस्त भागांमध्ये जलसंधारणाची कामे युद्धपातळीवर पूर्ण करणे ही काळाची गरज आहे. जलयुक्त शिवार अभियानांतर्गत शेततळी, सिमेंट नालाबांध व वृक्षारोपणाचे प्रकल्प मोठ्या प्रमाणावर राबविण्यात आले आहेत. शेतकऱ्यांच्या सर्वांगीण विकासासाठी सौर कृषी पंप आणि ठिबक सिंचन योजनांना प्राधान्य देण्यात येत आहे. या कामांचे अहवाल जिल्हा प्रशासनाला वेळेत सादर करण्यासाठी लिपिक संवर्गाने मराठी टंकलेखनात प्राविण्य मिळवणे अत्यावश्यक ठरते.',
    wordCount: 56,
    createdAt: '2025-01-12'
  },
  {
    id: 'preset-mantralaya-clerk',
    title: 'मंत्रालय व न्यायालयीन लिपिक सराव उतारा',
    text: 'उच्च न्यायालय व जिल्हा सत्र न्यायालयातील न्यायालयीन निवाडे आणि साक्षीदारांचे जबाब देवनागरी लिपीमध्ये अचूक नोंदविण्याचे काम लघुलेखक व टंकलेखक यांच्यावर असते. अचूक विरामचिन्हे, काना-मात्रा आणि जोडाक्षरांचा योग्य वापर हा टंकलेखनाचा आत्मा मानला जातो. निरंतर सरावाने टंकलेखकाची गती चाळीस शब्दांहून अधिक वेगाने वाढू शकते.',
    wordCount: 46,
    createdAt: '2025-01-15'
  }
];

export const CustomTextPractice: React.FC<CustomTextPracticeProps> = ({
  userProgress,
  setUserProgress,
  language,
  onActiveTargetChange,
  onKeyPressedChange
}) => {
  const { isDark } = useTheme();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [customInput, setCustomInput] = useState<string>(
    'महाराष्ट्र शासन राजपत्र आणि शासकीय परिपत्रकांचा नियमित सराव केल्यास टंकलेखनाची अचूकता वाढते.'
  );
  const [paperTitle, setPaperTitle] = useState<string>('माझा सराव उतारा (Custom Practice)');
  const [savedPapers, setSavedPapers] = useState<SavedInstitutePaper[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PAPERS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return PRESET_INSTITUTE_PAPERS;
  });

  const [activeLessonStep, setActiveLessonStep] = useState<LessonStep | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const savePapersToStorage = (papers: SavedInstitutePaper[]) => {
    setSavedPapers(papers);
    localStorage.setItem(STORAGE_KEY_PAPERS, JSON.stringify(papers));
  };

  // Text metrics
  const cleanText = customInput.trim();
  const words = cleanText ? cleanText.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const charCount = customInput.length;
  const estMins30 = wordCount > 0 ? (wordCount / 30).toFixed(1) : '0';
  const estMins40 = wordCount > 0 ? (wordCount / 40).toFixed(1) : '0';

  const handleStartCustomPractice = () => {
    if (!cleanText) return;

    const customStep: LessonStep = {
      id: `custom-${Date.now()}`,
      titleEn: paperTitle || 'Custom Practice Paper',
      titleMr: paperTitle || 'सराव प्रश्नपत्रिका',
      descriptionEn: `${wordCount} words • Custom Institute Practice Paper`,
      descriptionMr: `${wordCount} शब्द • सानुकूल प्रश्नपत्रिका सराव`,
      targetText: cleanText,
      recommendedWpm: 30
    };

    setActiveLessonStep(customStep);
  };

  // Handle .txt file upload
  const processUploadedFile = (file: File) => {
    if (!file.name.endsWith('.txt') && !file.type.includes('text')) {
      showNotification(language === 'mr' ? 'कृपया फक्त .txt फाईल निवडा!' : 'Please upload a .txt file!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        // Strip carriage returns and extra whitespace
        const formatted = result.replace(/\r\n/g, ' ').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
        setCustomInput(formatted);
        const fileNameWithoutExt = file.name.replace(/\.txt$/i, '');
        setPaperTitle(fileNameWithoutExt);
        showNotification(language === 'mr' ? `"${file.name}" फाईल लोड झाली!` : `Loaded "${file.name}"!`);
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
    e.target.value = '';
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  // Save current paper into library
  const handleSaveCurrentPaper = () => {
    if (!cleanText) return;
    const newPaper: SavedInstitutePaper = {
      id: `paper_${Date.now()}`,
      title: paperTitle.trim() || `सराव पेपर #${savedPapers.length + 1}`,
      text: cleanText,
      wordCount,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    const updated = [newPaper, ...savedPapers.filter(p => p.id !== newPaper.id)];
    savePapersToStorage(updated);
    showNotification(language === 'mr' ? 'प्रश्नपत्रिका संग्रहामध्ये जतन केली!' : 'Paper saved to institute library!');
  };

  // Delete a saved paper
  const handleDeletePaper = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedPapers.filter(p => p.id !== id);
    savePapersToStorage(updated);
    showNotification(language === 'mr' ? 'पेपर हटवला!' : 'Paper removed!');
  };

  // Load a saved paper
  const handleLoadPaper = (paper: SavedInstitutePaper) => {
    setPaperTitle(paper.title);
    setCustomInput(paper.text);
    showNotification(language === 'mr' ? `"${paper.title}" निवडला!` : `Selected "${paper.title}"!`);
  };

  return (
    <div id="custom-practice-container" className="w-full min-w-0 max-w-full flex flex-col gap-6">
      {/* Top Card */}
      <div className={`rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-md border transition-colors ${
        isDark 
          ? 'bg-[#072431]/95 border-teal-800/40' 
          : 'bg-white/95 border-teal-200/80 shadow-teal-900/5'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl border ${
              isDark ? 'bg-teal-500/10 text-teal-400 border-teal-500/30' : 'bg-teal-50 text-teal-700 border-teal-200'
            }`}>
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {language === 'mr' ? 'प्रश्नपत्रिका व सानुकूल मजकूर सराव (Institute Paper Studio)' : 'Custom Paper & Text Practice'}
              </h3>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-cyan-200/70' : 'text-slate-500'}`}>
                {language === 'mr' 
                  ? 'शिक्षकांनी दिलेली .txt फाईल अपलोड करा किंवा कोणताही मराठी मजकूर पेस्ट करून सराव करा' 
                  : 'Upload .txt exam papers or paste custom Marathi passages to practice with Remington layout'}
              </p>
            </div>
          </div>

          {/* Upload Button */}
          {!activeLessonStep && (
            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                id="btn-upload-txt"
                onClick={() => fileInputRef.current?.click()}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-sm ${
                  isDark 
                    ? 'bg-[#0B2E3F] hover:bg-[#0E3549] text-cyan-300 border-teal-700/50 hover:border-cyan-400/50' 
                    : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border-teal-200 hover:border-teal-300'
                }`}
              >
                <Upload className="w-4 h-4 text-teal-400" />
                <span>{language === 'mr' ? '.txt फाईल अपलोड करा' : 'Upload .txt File'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Feedback alert */}
        {feedback && (
          <div className="mb-4 px-4 py-2 rounded-xl bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
            <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {!activeLessonStep ? (
          <div className="space-y-5">
            {/* Paper Title & Drag-and-Drop / Textarea Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {language === 'mr' ? 'प्रश्नपत्रिकेचे नाव / शीर्षक (Paper Title)' : 'Question Paper Title'}
                </label>
                <span className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {wordCount} {language === 'mr' ? 'शब्द' : 'words'} • {charCount} {language === 'mr' ? 'अक्षरे' : 'chars'}
                </span>
              </div>
              <input
                type="text"
                value={paperTitle}
                onChange={e => setPaperTitle(e.target.value)}
                placeholder={language === 'mr' ? 'उदा. साप्ताहिक चाचणी १' : 'e.g. Weekly Exam Paper 1'}
                className={`w-full px-4 py-2 rounded-xl text-xs font-bold border transition-colors focus:outline-none ${
                  isDark 
                    ? 'bg-[#051C27] border-teal-900/70 text-slate-100 focus:border-cyan-400' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-teal-500'
                }`}
              />
            </div>

            {/* Drag and Drop Zone + Textarea */}
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative rounded-2xl border-2 transition-all p-1 ${
                isDragging 
                  ? 'border-cyan-400 bg-cyan-950/30' 
                  : isDark 
                    ? 'border-teal-900/70 bg-[#051C27]' 
                    : 'border-slate-200 bg-slate-50'
              }`}
            >
              <textarea
                rows={6}
                value={customInput}
                onChange={e => setCustomInput(e.target.value)}
                placeholder={
                  language === 'mr' 
                    ? 'येथे मराठी मजकूर थेट टाईप किंवा पेस्ट करा, अथवा कोणतीही .txt फाईल येथे ड्रॅग & ड्रॉप करा...' 
                    : 'Type or paste Marathi text here, or drag & drop a .txt file...'
                }
                className={`w-full p-4 rounded-xl text-sm focus:outline-none resize-none leading-relaxed font-sans ${
                  isDark 
                    ? 'bg-transparent text-slate-100 placeholder:text-slate-500' 
                    : 'bg-transparent text-slate-900 placeholder:text-slate-400'
                }`}
                style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
              />

              {/* Drag overlay hint */}
              {isDragging && (
                <div className="absolute inset-0 rounded-2xl bg-cyan-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-cyan-300">
                  <FileUp className="w-10 h-10 animate-bounce" />
                  <span className="text-sm font-bold">
                    {language === 'mr' ? 'मराठी .txt फाईल येथे सोडा' : 'Drop your Marathi .txt file here'}
                  </span>
                </div>
              )}
            </div>

            {/* Metrics & Action Bar */}
            <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 transition-colors ${
              isDark ? 'bg-[#051C27]/80 border-teal-900/50' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-teal-400" />
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    {language === 'mr' ? 'अंदाजे वेळ:' : 'Est. Duration:'}
                  </span>
                </div>
                <span className={`px-2.5 py-1 rounded-lg border font-mono font-bold ${
                  isDark ? 'bg-[#0B2E3F] border-teal-800 text-teal-300' : 'bg-white border-teal-200 text-teal-800'
                }`}>
                  ३० WPM: ~{estMins30} {language === 'mr' ? 'मि.' : 'mins'}
                </span>
                <span className={`px-2.5 py-1 rounded-lg border font-mono font-bold ${
                  isDark ? 'bg-[#0B2E3F] border-cyan-800 text-cyan-300' : 'bg-white border-cyan-200 text-cyan-800'
                }`}>
                  ४० WPM: ~{estMins40} {language === 'mr' ? 'मि.' : 'mins'}
                </span>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={handleSaveCurrentPaper}
                  disabled={!cleanText}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    isDark 
                      ? 'bg-[#0B2E3F] hover:bg-[#0E3549] text-teal-300 border-teal-700/50' 
                      : 'bg-white hover:bg-teal-50 text-teal-800 border-teal-200'
                  }`}
                  title={language === 'mr' ? 'हा पेपर जतन करा' : 'Save this paper to library'}
                >
                  <Save className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{language === 'mr' ? 'पेपर जतन करा' : 'Save'}</span>
                </button>

                <button
                  id="btn-start-custom-practice"
                  onClick={handleStartCustomPractice}
                  disabled={!cleanText}
                  className={`px-6 py-2.5 font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2 ${
                    isDark 
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 shadow-teal-500/20' 
                      : 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white shadow-teal-600/20'
                  }`}
                >
                  <Play className={`w-4 h-4 ${isDark ? 'fill-slate-950' : 'fill-white'}`} />
                  <span>{language === 'mr' ? 'टायपिंग सराव सुरू करा' : 'Start Typing Practice'}</span>
                </button>
              </div>
            </div>

            {/* Saved Papers / Presets Library */}
            <div className="pt-4 border-t border-teal-900/40">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {language === 'mr' ? 'उपलब्ध प्रश्नपत्रिका संग्रह (Institute Question Papers)' : 'Preset & Saved Exam Papers'}
                  </h4>
                </div>
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {savedPapers.length} {language === 'mr' ? 'प्रश्नपत्रिका' : 'papers'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {savedPapers.map(paper => (
                  <div
                    key={paper.id}
                    onClick={() => handleLoadPaper(paper)}
                    className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all duration-200 group ${
                      isDark 
                        ? 'bg-[#051C27]/70 hover:bg-[#082837] border-teal-900/50 hover:border-teal-700' 
                        : 'bg-slate-50 hover:bg-white border-slate-200 hover:border-teal-300 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h5 className={`text-xs font-bold line-clamp-1 group-hover:text-cyan-400 transition-colors ${
                        isDark ? 'text-slate-200' : 'text-slate-900'
                      }`}>
                        {paper.title}
                      </h5>
                      {!paper.id.startsWith('preset-') && (
                        <button
                          onClick={(e) => handleDeletePaper(paper.id, e)}
                          title="Delete"
                          className="text-slate-500 hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <p className={`text-[11px] line-clamp-2 mt-1.5 font-sans ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {paper.text}
                    </p>

                    <div className="mt-3 pt-2 border-t border-teal-900/20 flex items-center justify-between text-[10px] font-mono">
                      <span className={isDark ? 'text-teal-400' : 'text-teal-700'}>
                        {paper.wordCount} {language === 'mr' ? 'शब्द' : 'words'}
                      </span>
                      <span className="flex items-center gap-1 text-cyan-400">
                        <FileCheck className="w-3 h-3" />
                        <span>{language === 'mr' ? 'लोड करा' : 'Load'}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Active Custom Typing Session */
          <div className="space-y-4">
            <div className={`flex items-center justify-between pb-3 border-b ${
              isDark ? 'border-teal-900/50' : 'border-slate-200'
            }`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {paperTitle}
                </span>
                <span className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  ({wordCount} {language === 'mr' ? 'शब्द' : 'words'})
                </span>
              </div>
              <button
                onClick={() => setActiveLessonStep(null)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isDark 
                    ? 'bg-[#0B2E3F] hover:bg-[#0E3549] text-cyan-300 border-teal-800/40' 
                    : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border-teal-200'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                <span>{language === 'mr' ? 'दुसरा पेपर निवडा' : 'Change Paper'}</span>
              </button>
            </div>

            <TypingArea
              lesson={activeLessonStep}
              userProgress={userProgress}
              setUserProgress={setUserProgress}
              language={language}
              onActiveTargetChange={onActiveTargetChange}
              onKeyPressedChange={onKeyPressedChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};
