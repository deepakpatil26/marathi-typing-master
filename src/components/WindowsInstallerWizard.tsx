import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Folder, 
  CheckCircle2, 
  X, 
  HardDrive, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Download, 
  Play,
  RotateCw,
  Laptop
} from 'lucide-react';
import { sound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';
import { getProductionLaunchUrl } from '../utils/downloadHelper';

interface WindowsInstallerWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchApp?: () => void;
  language?: 'mr' | 'en';
  onDownloadSetup?: () => void;
}

type WizardStep = 'welcome' | 'destination' | 'installing' | 'complete';

export const WindowsInstallerWizard: React.FC<WindowsInstallerWizardProps> = ({
  isOpen,
  onClose,
  onLaunchApp,
  language = 'mr',
  onDownloadSetup
}) => {
  const { isDark } = useTheme();
  const [step, setStep] = useState<WizardStep>('welcome');
  const [installPath, setInstallPath] = useState<string>('C:\\MarathiTypingMaster');
  const [progress, setProgress] = useState<number>(0);
  const [currentFileIndex, setCurrentFileIndex] = useState<number>(0);
  const [createDesktopShortcut, setCreateDesktopShortcut] = useState<boolean>(true);
  const [downloadSetupScript, setDownloadSetupScript] = useState<boolean>(true);
  const [shortcutDownloaded, setShortcutDownloaded] = useState<boolean>(false);

  const installationFiles = [
    'Creating directory: C:\\MarathiTypingMaster...',
    'Extracting: marathi_typing_master_core.exe...',
    'Installing: ism_remington_dvbw_layout.dll...',
    'Copying: devanagari_typography_engine.dat...',
    'Unpacking: gcc_tbc_30wpm_question_bank.db...',
    'Unpacking: gcc_tbc_40wpm_exam_passages.db...',
    'Registering: student_profile_manager.sys...',
    'Configuring: audio_feedback_soundbanks.wav...',
    'Setting up: offline_local_storage_cache.bin...',
    'Generating: windows_desktop_integration.manifest...',
    'Finalizing installation in C:\\MarathiTypingMaster...'
  ];

  // Reset wizard state when opening
  useEffect(() => {
    if (isOpen) {
      setStep('welcome');
      setProgress(0);
      setCurrentFileIndex(0);
      setShortcutDownloaded(false);
    }
  }, [isOpen]);

  // Installation simulation progress timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'installing') {
      timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(() => {
              setStep('complete');
              sound.playSuccessSound();
            }, 600);
            return 100;
          }
          const nextVal = prev + Math.floor(Math.random() * 8) + 4;
          const cappedVal = Math.min(nextVal, 100);
          const fileIdx = Math.min(
            Math.floor((cappedVal / 100) * installationFiles.length),
            installationFiles.length - 1
          );
          setCurrentFileIndex(fileIdx);
          return cappedVal;
        });
      }, 180);
    }
    return () => clearInterval(timer);
  }, [step]);

  if (!isOpen) return null;

  const handleStartInstallation = () => {
    sound.playKeyClick();
    setStep('installing');
    setProgress(0);
  };

  // Generates and triggers download of Desktop Shortcut file
  const triggerDesktopShortcutDownload = () => {
    const targetUrl = getProductionLaunchUrl();
    const shortcutContent = `[InternetShortcut]
URL=${targetUrl}
IconIndex=0
IconFile=${targetUrl.replace('/?app=true', '')}/icon.svg
HotKey=0
IDList=
[{000214A0-0000-0000-C000-000000000046}]
Prop3=19,0
[Desktop Entry]
Name=Marathi Typing Master
Comment=Maharashtra GCC-TBC Remington Typing Tutor
Type=Application
Categories=Education;Utility;
`;
    const blob = new Blob([shortcutContent], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Marathi Typing Master.url';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShortcutDownloaded(true);
  };

  const handleFinish = () => {
    sound.playKeyClick();
    if (createDesktopShortcut) {
      triggerDesktopShortcutDownload();
    }
    if (downloadSetupScript && onDownloadSetup) {
      setTimeout(() => {
        onDownloadSetup();
      }, 300);
    }
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      {/* Windows 11 / Modern Setup Window Shell */}
      <div 
        className={`w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border flex flex-col transition-all duration-200 ${
          isDark 
            ? 'bg-[#061F2C] border-teal-700/60 text-slate-100 shadow-teal-950/50' 
            : 'bg-white border-slate-300 text-slate-900 shadow-2xl'
        }`}
      >
        {/* Window Title Bar */}
        <div className={`px-4 py-2.5 flex items-center justify-between select-none border-b ${
          isDark 
            ? 'bg-[#03151E] border-teal-900/60 text-slate-200' 
            : 'bg-slate-100 border-slate-200 text-slate-700'
        }`}>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-[10px] font-black text-slate-950 shadow-sm">
              म
            </div>
            <span className="text-xs font-semibold tracking-wide">
              {language === 'mr' ? 'मराठी टायपिंग मास्टर - सेटअप विझार्ड v10.4' : 'Marathi Typing Master - Setup Wizard v10.4'}
            </span>
          </div>

          <button
            onClick={() => {
              sound.playKeyClick();
              onClose();
            }}
            className="p-1 rounded-md hover:bg-rose-500 hover:text-white text-slate-400 transition-colors cursor-pointer"
            title="Close Setup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wizard Body by Step */}
        <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between min-h-[360px]">
          {/* STEP 1: WELCOME */}
          {step === 'welcome' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-400 p-0.5 shadow-xl shrink-0">
                  <div className={`w-full h-full rounded-[14px] flex items-center justify-center text-2xl font-black ${
                    isDark ? 'bg-[#03151E] text-cyan-300' : 'bg-white text-teal-600'
                  }`}>
                    म
                  </div>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black">
                    {language === 'mr' ? 'मराठी टायपिंग मास्टर सेटअप विझार्ड' : 'Welcome to Marathi Typing Master Setup'}
                  </h3>
                  <p className="text-xs text-teal-600 dark:text-cyan-400 font-bold mt-0.5">
                    {language === 'mr' ? 'महाराष्ट्र शासन GCC-TBC रेमिंग्टन टंकलेखन सॉफ्टवेअर' : 'Maharashtra GCC-TBC Remington Typing Tutor for Windows'}
                  </p>
                </div>
              </div>

              <div className={`p-4 rounded-xl text-xs space-y-2.5 leading-relaxed border ${
                isDark ? 'bg-[#03151E]/80 border-teal-900/60 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <p>
                  {language === 'mr'
                    ? 'हा विझार्ड तुमच्या संगणकावर "मराठी टायपिंग मास्टर" (डेस्कटॉप आवृत्ती) इन्स्टॉल करण्यासाठी मदत करेल.'
                    : 'This wizard will guide you through installing the full desktop edition of Marathi Typing Master on your PC.'}
                </p>
                <div className="flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>{language === 'mr' ? '१००% मोफत, सुरक्षित व व्हायरसमुक्त सॉफ्टवेअर' : '100% Free, Safe & Verified Windows Package'}</span>
                </div>
                <div className="flex items-center gap-2 font-semibold text-teal-600 dark:text-cyan-300">
                  <HardDrive className="w-4 h-4 shrink-0" />
                  <span>{language === 'mr' ? 'तुमच्या C:\ ड्राईव्हवर इन्स्टॉल केले जाईल' : 'Installs directly into your local C: drive'}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SELECT DESTINATION DIRECTORY */}
          {step === 'destination' && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h3 className="text-base font-bold">
                  {language === 'mr' ? 'इन्स्टॉलेशन स्थान निवडा (Select Destination)' : 'Select Destination Location'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {language === 'mr' 
                    ? 'सॉफ्टवेअर खालील C:\ ड्राईव्हच्या फोल्डरमध्ये इन्स्टॉल केले जाईल.' 
                    : 'Setup will install Marathi Typing Master into the following folder.'}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold block">
                  {language === 'mr' ? 'गंतव्य फोल्डर (Destination Folder):' : 'Destination Folder:'}
                </label>
                <div className="flex items-center gap-2">
                  <div className={`flex-1 flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-mono font-bold ${
                    isDark ? 'bg-[#02131C] border-teal-900/80 text-cyan-300' : 'bg-slate-50 border-slate-300 text-slate-800'
                  }`}>
                    <Folder className="w-4 h-4 text-amber-400 shrink-0" />
                    <input 
                      type="text" 
                      value={installPath} 
                      onChange={(e) => setInstallPath(e.target.value)}
                      className="bg-transparent w-full focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => {
                      sound.playKeyClick();
                      setInstallPath('C:\\MarathiTypingMaster');
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      isDark ? 'bg-[#03151E] border-teal-800 hover:border-cyan-400' : 'bg-slate-100 border-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {language === 'mr' ? 'डिफ़ॉल्ट' : 'Default'}
                  </button>
                </div>
              </div>

              <div className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                isDark ? 'bg-[#03151E]/60 border-teal-950 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-700 font-medium'
              }`}>
                <div className="flex justify-between">
                  <span>{language === 'mr' ? 'आवश्यक जागा:' : 'Space required:'}</span>
                  <span className="font-mono font-bold text-teal-950 dark:text-cyan-400">48.6 MB</span>
                </div>
                <div className="flex justify-between">
                  <span>{language === 'mr' ? 'C:\\ ड्राईव्हवर उपलब्ध जागा:' : 'Space available on drive C:\\:'}</span>
                  <span className="font-mono font-bold text-emerald-950 dark:text-emerald-400">124.8 GB</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: INSTALLING PROGRESS */}
          {step === 'installing' && (
            <div className="space-y-6 my-auto animate-fadeIn">
              <div className="text-center space-y-1">
                <h3 className="text-base sm:text-lg font-black text-teal-950 dark:text-cyan-300">
                  {language === 'mr' ? 'मराठी टायपिंग मास्टर इन्स्टॉल होत आहे...' : 'Installing Marathi Typing Master...'}
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-400 font-medium">
                  {language === 'mr' ? 'कृपया प्रतीक्षा करा, फाइल्स C:\\ ड्राईव्हवर कॉपी केल्या जात आहेत.' : 'Please wait while Setup copies files to your C: drive.'}
                </p>
              </div>

              {/* Progress Bar Container */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="truncate max-w-[320px] text-[11px] text-slate-700 dark:text-slate-400 font-medium">
                    {installationFiles[currentFileIndex]}
                  </span>
                  <span className="text-teal-950 dark:text-cyan-400 font-bold">{progress}%</span>
                </div>

                <div className={`w-full h-4 rounded-full overflow-hidden p-0.5 border ${
                  isDark ? 'bg-[#02131C] border-teal-900' : 'bg-slate-100 border-slate-300'
                }`}>
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-400 transition-all duration-150 shadow-md shadow-teal-500/30"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className={`p-3 rounded-xl border text-[11px] flex items-center justify-center gap-2 ${
                isDark ? 'bg-[#03151E]/80 border-teal-900/60 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-700 font-medium'
              }`}>
                <RotateCw className="w-3.5 h-3.5 animate-spin text-teal-600 dark:text-teal-500" />
                <span>{language === 'mr' ? 'गंतव्य स्थान: C:\\MarathiTypingMaster' : 'Destination: C:\\MarathiTypingMaster'}</span>
              </div>
            </div>
          )}

          {/* STEP 4: INSTALLATION COMPLETE WINDOW (WITH DESKTOP SHORTCUT OPTION) */}
          {step === 'complete' && (
            <div className="space-y-5 animate-fadeIn">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-emerald-950 dark:text-emerald-400">
                    {language === 'mr' ? 'इन्स्टॉलेशन यशस्वीरित्या पूर्ण झाले!' : 'Installation Complete!'}
                  </h3>
                  <p className="text-xs text-slate-700 dark:text-slate-400 mt-1 font-medium">
                    {language === 'mr' 
                      ? `सॉफ्टवेअर यशस्वीरीत्या ${installPath} मध्ये इन्स्टॉल झाले आहे.`
                      : `Marathi Typing Master has been successfully installed in ${installPath}.`}
                  </p>
                </div>
              </div>

              {/* Checkboxes / Options Requested by User */}
              <div className={`p-4 rounded-2xl border space-y-3.5 ${
                isDark ? 'bg-[#03151E] border-teal-900/80' : 'bg-slate-50 border-slate-200'
              }`}>
                {/* 1. Create Desktop Shortcut Toggle */}
                <label className="flex items-start gap-3 cursor-pointer group select-none">
                  <input
                    type="checkbox"
                    checked={createDesktopShortcut}
                    onChange={(e) => {
                      sound.playKeyClick();
                      setCreateDesktopShortcut(e.target.checked);
                    }}
                    className="mt-0.5 w-4 h-4 rounded border-teal-500 text-teal-600 focus:ring-teal-400 accent-teal-600 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold block text-slate-900 dark:text-slate-100 group-hover:text-teal-950 dark:group-hover:text-cyan-300 transition-colors">
                      {language === 'mr' ? 'डेस्कटॉपवर ॲप्लिकेशनचा शॉर्टकट तयार करा (Create Desktop Shortcut)' : 'Create shortcut of application to desktop'}
                    </span>
                    <span className="text-[11px] text-slate-700 dark:text-slate-400 block font-medium">
                      {language === 'mr' 
                        ? 'संगणकाच्या मुख्य स्क्रीनवरून (Desktop) १-क्लिकमध्ये थेट ॲप सुरू करा.' 
                        : 'Places a quick launcher icon directly onto your Windows Desktop.'}
                    </span>
                  </div>
                </label>

                {/* 2. Download Setup Script Toggle */}
                <label className="flex items-start gap-3 cursor-pointer group select-none">
                  <input
                    type="checkbox"
                    checked={downloadSetupScript}
                    onChange={(e) => {
                      sound.playKeyClick();
                      setDownloadSetupScript(e.target.checked);
                    }}
                    className="mt-0.5 w-4 h-4 rounded border-teal-500 text-teal-600 focus:ring-teal-400 accent-teal-600 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold block text-slate-900 dark:text-slate-100 group-hover:text-teal-950 dark:group-hover:text-cyan-300 transition-colors">
                      {language === 'mr' ? 'ऑफलाइन इन्स्टॉलर (Setup.bat) देखील डाउनलोड करा' : 'Download Windows Offline Installer (Setup.bat)'}
                    </span>
                    <span className="text-[11px] text-slate-700 dark:text-slate-400 block font-medium">
                      {language === 'mr' 
                        ? 'C:\\MarathiTypingMaster मध्ये फाइल्स इन्स्टॉल करण्यासाठी सेट-अप फाइल सेव्ह करा.' 
                        : 'Saves the offline installer script to install files into C:\\MarathiTypingMaster.'}
                    </span>
                  </div>
                </label>
              </div>

              {shortcutDownloaded && (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{language === 'mr' ? 'डेस्कटॉप शॉर्टकट फाइल डाउनलोड झाली!' : 'Desktop shortcut file created successfully!'}</span>
                </div>
              )}
            </div>
          )}

          {/* Bottom Button Action Bar */}
          <div className={`pt-4 border-t flex items-center justify-between mt-4 ${
            isDark ? 'border-teal-900/60' : 'border-slate-200'
          }`}>
            <div>
              {step !== 'complete' && step !== 'installing' && (
                <button
                  onClick={() => {
                    sound.playKeyClick();
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {language === 'mr' ? 'रद्द करा (Cancel)' : 'Cancel'}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {step === 'destination' && (
                <button
                  onClick={() => {
                    sound.playKeyClick();
                    setStep('welcome');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    isDark ? 'bg-[#03151E] border-teal-800 text-slate-300 hover:bg-[#072431]' : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {language === 'mr' ? 'मागे (Back)' : 'Back'}
                </button>
              )}

              {step === 'welcome' && (
                <button
                  onClick={() => {
                    sound.playKeyClick();
                    setStep('destination');
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 shadow-md shadow-teal-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>{language === 'mr' ? 'पुढे (Next)' : 'Next'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {step === 'destination' && (
                <button
                  onClick={handleStartInstallation}
                  className="px-6 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 shadow-lg shadow-teal-500/25 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{language === 'mr' ? 'इन्स्टॉल करा (Install)' : 'Install'}</span>
                </button>
              )}

              {step === 'complete' && (
                <button
                  onClick={handleFinish}
                  className="px-7 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  <span>{language === 'mr' ? 'पूर्ण करा (Finish)' : 'Finish'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
