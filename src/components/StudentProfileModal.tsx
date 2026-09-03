import React, { useState, useRef } from 'react';
import { 
  Users, 
  UserPlus, 
  Check, 
  X, 
  Trash2, 
  Download, 
  Upload, 
  Award, 
  Sparkles,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { StudentProfile } from '../types';
import { 
  getStoredProfiles, 
  getActiveProfileId, 
  setActiveProfileId, 
  createStudentProfile, 
  deleteStudentProfile,
  exportProfilesBackup,
  importProfilesBackup
} from '../utils/studentProfiles';
import { useTheme } from '../context/ThemeContext';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'mr' | 'en';
  onProfileSwitched: (newProfile: StudentProfile) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  language,
  onProfileSwitched
}) => {
  const { isDark } = useTheme();
  const [profiles, setProfiles] = useState<StudentProfile[]>(getStoredProfiles);
  const [activeId, setActiveId] = useState<string>(getActiveProfileId);
  const [isAdding, setIsAdding] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [batchInput, setBatchInput] = useState('');
  const [targetSpeed, setTargetSpeed] = useState<30 | 40>(30);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleSelectProfile = (profile: StudentProfile) => {
    setActiveProfileId(profile.id);
    setActiveId(profile.id);
    onProfileSwitched(profile);
    showToast(language === 'mr' ? `${profile.name} चे प्रोफाइल निवडले!` : `Switched to ${profile.name}!`);
    setTimeout(() => onClose(), 600);
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    const newProf = createStudentProfile(nameInput, batchInput, targetSpeed);
    const updated = getStoredProfiles();
    setProfiles(updated);
    setActiveId(newProf.id);
    onProfileSwitched(newProf);

    setNameInput('');
    setBatchInput('');
    setIsAdding(false);
    showToast(language === 'mr' ? 'नवीन विद्यार्थी प्रोफाइल तयार केले!' : 'New student profile created!');
  };

  const handleDeleteProfile = (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (profiles.length <= 1) {
      showToast(language === 'mr' ? 'किमान एक प्रोफाइल असणे आवश्यक आहे!' : 'At least one profile must exist!');
      return;
    }
    const confirmMsg = language === 'mr' 
      ? `तुम्हाला खात्री आहे का? "${name}" चा सर्व प्रगती डेटा डिलीट होईल.` 
      : `Delete profile "${name}" and all associated typing progress?`;
    if (window.confirm(confirmMsg)) {
      const remaining = deleteStudentProfile(id);
      setProfiles(remaining);
      const newActive = getStoredProfiles().find(p => p.id === getActiveProfileId()) || remaining[0];
      setActiveId(newActive.id);
      onProfileSwitched(newActive);
      showToast(language === 'mr' ? 'विद्यार्थी प्रोफाइल हटवले!' : 'Student profile deleted!');
    }
  };

  const handleExportBackup = () => {
    const jsonString = exportProfilesBackup();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marathi-typing-students-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(language === 'mr' ? 'बॅकअप फाईल यशस्वीपणे डाऊनलोड झाली!' : 'Backup exported successfully!');
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importProfilesBackup(content);
        if (success) {
          const fresh = getStoredProfiles();
          setProfiles(fresh);
          const active = fresh.find(p => p.id === getActiveProfileId()) || fresh[0];
          setActiveId(active.id);
          onProfileSwitched(active);
          showToast(language === 'mr' ? 'बॅकअप यशस्वीरीत्या इम्पोर्ट झाला!' : 'Backup imported successfully!');
        } else {
          showToast(language === 'mr' ? 'अवैध फाईल! कृपया योग्य बॅकअप फाईल निवडा.' : 'Invalid backup JSON file.');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div 
      id="student-profile-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200"
    >
      <div 
        id="student-profile-modal"
        className={`w-full max-w-2xl rounded-3xl p-6 sm:p-7 shadow-2xl border max-h-[90vh] flex flex-col transition-colors ${
          isDark 
            ? 'bg-[#072431] border-teal-700/50 text-slate-100 shadow-teal-950/50' 
            : 'bg-white border-teal-200 text-slate-900 shadow-teal-900/10'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-teal-900/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl border ${
              isDark 
                ? 'bg-teal-500/10 border-teal-500/30 text-teal-400' 
                : 'bg-teal-50 border-teal-200 text-teal-700'
            }`}>
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">
                {language === 'mr' ? 'विद्यार्थी प्रोफाइल्स (Student Profiles)' : 'Multi-Student Profiles'}
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {language === 'mr' 
                  ? 'टायपिंग इन्स्टिट्यूट / लॅबसाठी मोफत स्वतंत्र विद्यार्थी व्यवस्थापन' 
                  : 'Free, offline student profile switcher for typing institutes & shared PCs'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isDark 
                ? 'hover:bg-slate-800 text-slate-400 hover:text-white' 
                : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notification Toast */}
        {feedbackMsg && (
          <div className="mt-3 px-4 py-2 rounded-xl bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
            <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Body Container: Profiles List or Add Form */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-4 pr-1">
          {!isAdding ? (
            <>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {language === 'mr' ? `उपलब्ध विद्यार्थी (${profiles.length})` : `Enrolled Students (${profiles.length})`}
                </span>

                <button
                  id="btn-add-student-profile"
                  onClick={() => setIsAdding(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 shadow-md shadow-teal-500/20 cursor-pointer transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{language === 'mr' ? '+ नवीन विद्यार्थी जोडा' : '+ Add New Student'}</span>
                </button>
              </div>

              {/* Profiles List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profiles.map(profile => {
                  const isActive = profile.id === activeId;
                  const completedLessonsCount = Object.keys(profile.progress?.completedLessons || {}).length;
                  const practiceMins = Math.round((profile.progress?.totalPracticeTimeSeconds || 0) / 60);

                  return (
                    <div
                      key={profile.id}
                      onClick={() => handleSelectProfile(profile)}
                      className={`relative p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 ${
                        isActive
                          ? isDark
                            ? 'bg-[#0B2E3F] border-cyan-400 shadow-lg shadow-cyan-500/10 ring-2 ring-cyan-500/30'
                            : 'bg-teal-50/80 border-teal-500 shadow-md ring-2 ring-teal-500/20'
                          : isDark
                            ? 'bg-[#051C27]/80 hover:bg-[#072431] border-teal-900/60 hover:border-teal-700/60'
                            : 'bg-slate-50 hover:bg-white border-slate-200 hover:border-teal-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-black truncate ${isActive ? (isDark ? 'text-cyan-300' : 'text-teal-900') : (isDark ? 'text-white' : 'text-slate-800')}`}>
                              {profile.name}
                            </span>
                            {isActive && (
                              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-teal-500 text-slate-950">
                                {language === 'mr' ? 'सक्रिय' : 'Active'}
                              </span>
                            )}
                          </div>
                          <div className={`text-xs mt-0.5 truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {profile.batchOrRoll || (language === 'mr' ? 'तुकडी अ' : 'Batch A')}
                          </div>
                        </div>

                        {profiles.length > 1 && !isActive && (
                          <button
                            onClick={(e) => handleDeleteProfile(e, profile.id, profile.name)}
                            title={language === 'mr' ? 'प्रोफाइल हटवा' : 'Delete profile'}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              isDark 
                                ? 'border-rose-900/40 text-rose-400 hover:bg-rose-950/60' 
                                : 'border-rose-200 text-rose-600 hover:bg-rose-50'
                            }`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Stats row */}
                      <div className="mt-3 pt-2.5 border-t border-teal-900/30 flex items-center justify-between text-[11px] font-mono">
                        <span className={`flex items-center gap-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                          <span>{completedLessonsCount} {language === 'mr' ? 'धडे पूर्ण' : 'lessons'}</span>
                        </span>
                        <span className={`flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          <Clock className="w-3 h-3" />
                          <span>{practiceMins} {language === 'mr' ? 'मि.' : 'mins'}</span>
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                          {profile.targetSpeed} WPM
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* Add Profile Form */
            <form onSubmit={handleCreateProfile} className="space-y-4 p-4 rounded-2xl border border-teal-800/40 bg-[#051C27]/60">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-teal-300">
                  {language === 'mr' ? 'नवीन विद्यार्थ्याची माहिती भरा' : 'New Student Details'}
                </h4>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  {language === 'mr' ? 'रद्द करा' : 'Cancel'}
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-300">
                  {language === 'mr' ? 'विद्यार्थ्याचे नाव (Student Full Name)' : 'Student Full Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  placeholder={language === 'mr' ? 'उदा. राहुल रमेश पाटील' : 'e.g. Rahul Patil'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#03151e] border border-teal-800/60 text-slate-100 text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-300">
                  {language === 'mr' ? 'तुकडी / बॅच / रोल नंबर (Batch / Roll No.)' : 'Batch / Roll No.'}
                </label>
                <input
                  type="text"
                  value={batchInput}
                  onChange={e => setBatchInput(e.target.value)}
                  placeholder={language === 'mr' ? 'उदा. सकाळी ९:०० बॅच - रोल ०७' : 'e.g. Morning 9:00 AM - Roll 07'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#03151e] border border-teal-800/60 text-slate-100 text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 text-slate-300">
                  {language === 'mr' ? 'लक्ष्य गती (Target Exam Speed)' : 'Target Speed'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTargetSpeed(30)}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border cursor-pointer transition-all ${
                      targetSpeed === 30 
                        ? 'bg-teal-500 text-slate-950 border-teal-400' 
                        : 'bg-[#03151e] text-slate-300 border-teal-900/60 hover:border-teal-700'
                    }`}
                  >
                    ३० WPM (GCC-TBC)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetSpeed(40)}
                    className={`py-2 px-3 rounded-xl font-bold text-xs border cursor-pointer transition-all ${
                      targetSpeed === 40 
                        ? 'bg-teal-500 text-slate-950 border-teal-400' 
                        : 'bg-[#03151e] text-slate-300 border-teal-900/60 hover:border-teal-700'
                    }`}
                  >
                    ४० WPM (Advanced)
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-700 text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  {language === 'mr' ? 'मागे' : 'Back'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 shadow-md shadow-teal-500/20 cursor-pointer"
                >
                  {language === 'mr' ? 'विद्यार्थी जतन करा' : 'Save Student'}
                </button>
              </div>
            </form>
          )}

          {/* Backup / Export / Pendrive Sync Section */}
          <div className="pt-3 border-t border-teal-900/40">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-3 rounded-2xl bg-teal-950/20 border border-teal-800/30 text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                  {language === 'mr' 
                    ? 'पेन ड्राईव्ह किंवा कॉम्प्युटर बॅकअप (१००% मोफत व ऑफलाइन)' 
                    : 'Local Pen Drive Backup & Restore (100% Free & Offline)'}
                </span>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  id="btn-export-backup"
                  onClick={handleExportBackup}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-teal-700/50 bg-[#0B2E3F] hover:bg-[#0E3549] text-cyan-300 text-[11px] font-bold cursor-pointer transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{language === 'mr' ? 'बॅकअप डाऊनलोड' : 'Export JSON'}</span>
                </button>

                <button
                  id="btn-import-backup"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-teal-700/50 bg-[#0B2E3F] hover:bg-[#0E3549] text-teal-300 text-[11px] font-bold cursor-pointer transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{language === 'mr' ? 'इम्पोर्ट करा' : 'Import JSON'}</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-teal-900/40 flex items-center justify-between text-[11px] text-slate-400">
          <span>{language === 'mr' ? '१००% मोफत • खाजगी • इंटरनेटची गरज नाही' : '100% Free • Private • Zero Cloud Fees'}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer"
          >
            {language === 'mr' ? 'बंद करा' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
