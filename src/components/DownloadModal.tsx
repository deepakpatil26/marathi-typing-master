import React, { useState } from 'react';
import { 
  Download, 
  Monitor, 
  CheckCircle2, 
  Laptop, 
  X, 
  Zap, 
  ShieldCheck, 
  WifiOff, 
  FileCode2, 
  ExternalLink,
  Sparkles,
  HelpCircle,
  Clock,
  Award
} from 'lucide-react';
import { usePWAInstall } from '../utils/usePWAInstall';
import { useTheme } from '../context/ThemeContext';
import { sound } from '../utils/audio';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'mr' | 'en';
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { isDark } = useTheme();
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  // 1-Click Native Desktop App Install
  const handleNativeInstall = async () => {
    sound.playKeyClick();
    if (isInstallable) {
      const ok = await install();
      if (ok) {
        sound.playSuccessSound();
      }
    }
  };

  // Generate & Download Windows Launcher (.bat)
  const handleDownloadWindowsLauncher = () => {
    sound.playKeyClick();
    const currentUrl = window.location.origin;
    const batScript = `@echo off
:: ====================================================================
:: Marathi Typing Master - Official Desktop Launcher
:: Maharashtra GCC-TBC Remington Gail Devanagari Software
:: ====================================================================
title Marathi Typing Master (मराठी टायपिंग मास्टर)
color 0b

echo.
echo ====================================================================
echo        MARATHI TYPING MASTER - DESKTOP EDITION
echo        महाराष्ट्र शासन GCC-TBC ३० व ४० WPM परीक्षा सराव
echo ====================================================================
echo.
echo Launching Marathi Typing Master in dedicated App Mode...
echo.

:: 1. Try launching with Microsoft Edge in App Mode (borderless desktop window)
where msedge >nul 2>&1
if %errorlevel% equ 0 (
    start msedge --app="${currentUrl}"
    exit
)

:: 2. Try launching with Google Chrome in App Mode
where chrome >nul 2>&1
if %errorlevel% equ 0 (
    start chrome --app="${currentUrl}"
    exit
)

:: 3. Fallback to default system browser
start "" "${currentUrl}"
exit
`;

    const blob = new Blob([batScript], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Marathi-Typing-Master-Launcher.bat';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess('bat');
    sound.playSuccessSound();
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  // Generate & Download Desktop Shortcut (.url)
  const handleDownloadDesktopShortcut = () => {
    sound.playKeyClick();
    const currentUrl = window.location.origin;
    const shortcutContent = `[InternetShortcut]\nURL=${currentUrl}\nIconIndex=0\nHotKey=0\n`;
    const blob = new Blob([shortcutContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Marathi-Typing-Master.url';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess('url');
    sound.playSuccessSound();
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  return (
    <div 
      id="download-software-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`w-full max-w-2xl rounded-3xl p-5 sm:p-8 shadow-2xl border transition-all my-auto ${
        isDark 
          ? 'bg-[#041A25] border-teal-800/60 text-slate-100' 
          : 'bg-white border-teal-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-teal-800/30">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-400 to-cyan-500 p-0.5 shadow-lg shadow-teal-500/20 flex items-center justify-center">
              <div className={`w-full h-full rounded-[14px] flex items-center justify-center ${isDark ? 'bg-[#041A25]' : 'bg-white'}`}>
                <Download className="w-6 h-6 text-teal-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight">
                  {language === 'mr' ? 'संगणकावर सॉफ्टवेअर डाउनलोड व इन्स्टॉल करा' : 'Download & Install Desktop Software'}
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  v2.5 (2026)
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {language === 'mr' 
                  ? 'TypingMaster प्रमाणेच तुमच्या PC वर कायमस्वरूपी इन्स्टॉल करा — १००% मोफत व ऑफलाइन!' 
                  : 'Install Marathi Typing Master like TypingMaster on your PC — 100% Free & Offline!'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isDark 
                ? 'bg-[#082838] hover:bg-[#0c354a] border-teal-800/50 text-slate-400 hover:text-white' 
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content Sections */}
        <div className="mt-5 space-y-5">
          {/* Action Card 1: 1-Click Native Desktop App Install (PWA) */}
          <div className={`rounded-2xl p-4 sm:p-5 border relative overflow-hidden transition-all ${
            isDark 
              ? 'bg-gradient-to-br from-[#062433] to-[#031822] border-teal-700/60 shadow-lg' 
              : 'bg-gradient-to-br from-teal-50/80 to-cyan-50/50 border-teal-200 shadow-sm'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-teal-400" />
                  <h3 className="text-sm font-bold">
                    {language === 'mr' ? '१. संगणकावर थेट इन्स्टॉल करा (Recommended Desktop App)' : '1. Install Native Desktop App (Recommended)'}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-teal-500/20 text-teal-300">
                    {language === 'mr' ? '१-क्लिक' : '1-Click'}
                  </span>
                </div>
                <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'} leading-relaxed max-w-md`}>
                  {language === 'mr' 
                    ? 'संगणकाच्या Desktop वर आयकॉन तयार होईल. इंटरनेटशिवाय (Offline) सुरू होते, ॲडमिन पासवर्ड किंवा .exe डाउनलोडची गरज नाही!' 
                    : 'Creates a real desktop icon, runs full-screen without browser bars, works 100% offline with zero virus alerts.'}
                </p>
              </div>

              <div>
                {isInstalled ? (
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold whitespace-nowrap">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{language === 'mr' ? 'PC वर इन्स्टॉल केलेले आहे' : 'Installed on PC'}</span>
                  </div>
                ) : isInstallable ? (
                  <button
                    id="btn-modal-install-pwa"
                    onClick={handleNativeInstall}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-teal-500/25 transition-all cursor-pointer active:scale-95 whitespace-nowrap"
                  >
                    <Download className="w-4 h-4 stroke-[2.5]" />
                    <span>{language === 'mr' ? 'आता इन्स्टॉल करा' : 'Install Desktop App'}</span>
                  </button>
                ) : (
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[11px] font-medium px-3 py-1.5 rounded-lg border ${
                      isDark ? 'bg-[#0B2E3F] border-teal-800/50 text-slate-300' : 'bg-white border-teal-200 text-slate-700'
                    }`}>
                      {language === 'mr' ? 'Chrome/Edge वरील (⬇) आयकॉन दाबा' : 'Click (⬇) icon in Chrome/Edge'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Install Help for Chrome/Edge */}
            {!isInstalled && (
              <div className={`mt-3 pt-3 border-t text-[11px] flex items-center gap-2 ${
                isDark ? 'border-teal-900/40 text-slate-400' : 'border-teal-100 text-slate-500'
              }`}>
                <HelpCircle className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>
                  {language === 'mr'
                    ? 'टीप: ब्राउझरच्या ॲड्रेस बारमधील उजवीकडील "Install Marathi Typing Master" (⬇) चिन्हावर क्लिक करूनही कधीही इन्स्टॉल करू शकता.'
                    : 'Tip: You can also click the install icon (⬇) in the right side of your Chrome/Edge address bar anytime.'}
                </span>
              </div>
            )}
          </div>

          {/* Action Card 2: Download Windows Desktop Launcher (.bat / shortcut) */}
          <div className={`rounded-2xl p-4 sm:p-5 border transition-all ${
            isDark 
              ? 'bg-[#051C27]/90 border-teal-800/50' 
              : 'bg-slate-50 border-teal-100'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileCode2 className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold">
                    {language === 'mr' ? '२. Windows डेस्कटॉप लाँचर डाउनलोड करा (.bat)' : '2. Download Windows Launcher File (.bat)'}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-cyan-500/20 text-cyan-300">
                    {language === 'mr' ? 'पेनड्राईव्ह / लॅबसाठी' : 'For Labs / USB'}
                  </span>
                </div>
                <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'} leading-relaxed max-w-md`}>
                  {language === 'mr' 
                    ? 'टायपिंग इन्स्टिट्यूट किंवा लॅबमधील सर्व संगणकांवर चालवण्यासाठी लाँचर फाईल डाउनलोड करा. डबल क्लिक करताच थेट ॲप मोडमध्ये सुरू होईल.' 
                    : 'Download a standalone Windows launcher script. Double-click to instantly run in dedicated app window on any Windows 10/11 PC.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                <button
                  id="btn-download-bat-launcher"
                  onClick={handleDownloadWindowsLauncher}
                  className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-sm ${
                    isDark
                      ? 'bg-[#082F40] hover:bg-[#0c3e54] text-cyan-300 border-teal-700/60'
                      : 'bg-white hover:bg-teal-50 text-teal-800 border-teal-300'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{language === 'mr' ? 'लाँचर (.bat) डाउनलोड करा' : 'Download .bat'}</span>
                </button>

                <button
                  id="btn-download-shortcut-url"
                  onClick={handleDownloadDesktopShortcut}
                  className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-sm ${
                    isDark
                      ? 'bg-[#082F40] hover:bg-[#0c3e54] text-teal-300 border-teal-700/60'
                      : 'bg-white hover:bg-teal-50 text-teal-800 border-teal-300'
                  }`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{language === 'mr' ? 'शॉर्टकट (.url)' : 'Shortcut (.url)'}</span>
                </button>
              </div>
            </div>

            {downloadSuccess && (
              <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  {language === 'mr' 
                    ? 'फाईल यशस्वीरीत्या Downloads फोल्डरमध्ये सेव्ह झाली आहे! Desktop वर कॉपी करून वापरा.' 
                    : 'File downloaded successfully to your Downloads folder! Double-click to launch.'}
                </span>
              </div>
            )}
          </div>

          {/* Value Matrix: TypingMaster vs Marathi Typing Master */}
          <div className={`rounded-2xl p-4 sm:p-5 border transition-all ${
            isDark ? 'bg-[#03151E] border-teal-900/60' : 'bg-teal-50/50 border-teal-100'
          }`}>
            <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {language === 'mr' ? 'पारंपरिक TypingMaster पेक्षा आमचे सॉफ्टवेअर का सरस आहे?' : 'Why is this better than traditional TypingMaster?'}
              </span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#06202C] border-teal-900/40' : 'bg-white border-teal-100'}`}>
                <div className="font-bold text-teal-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'mr' ? '१००% मोफत' : '100% Free Forever'}</span>
                </div>
                <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {language === 'mr' 
                    ? 'TypingMaster ७ दिवसांनंतर पैसे (₹२,५००+) मागतो. आमचे ॲप विद्यार्थ्यांसाठी कायमस्वरूपी मोफत आहे.' 
                    : 'TypingMaster requires paid license ($29+) after 7-day trial. Ours is 100% free forever.'}
                </p>
              </div>

              <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#06202C] border-teal-900/40' : 'bg-white border-teal-100'}`}>
                <div className="font-bold text-teal-300 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-cyan-400" />
                  <span>{language === 'mr' ? 'GCC-TBC रेमिंग्टन' : 'GCC-TBC Remington'}</span>
                </div>
                <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {language === 'mr' 
                    ? 'महाराष्ट्र शासनाचा अधिकृत ISM DVBW Remington Gail लेआउट व ५-मिनिट परीक्षा पद्धती.' 
                    : 'Official Maharashtra GCC-TBC 30 & 40 WPM syllabus and Remington Gail layout.'}
                </p>
              </div>

              <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#06202C] border-teal-900/40' : 'bg-white border-teal-100'}`}>
                <div className="font-bold text-teal-300 flex items-center gap-1.5">
                  <WifiOff className="w-4 h-4 text-amber-400" />
                  <span>{language === 'mr' ? 'ऑफलाइन टायपिंग' : 'Full Offline Mode'}</span>
                </div>
                <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {language === 'mr' 
                    ? 'एकदा इन्स्टॉल केल्यावर संगणक लॅबमध्ये इंटरनेट नसतानाही अखंड सराव करता येतो.' 
                    : 'Practice seamlessly in typing labs or home without requiring an active internet connection.'}
                </p>
              </div>
            </div>
          </div>

          {/* System Requirements */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] opacity-75 px-1">
            <span><strong>OS:</strong> Windows 11, 10, 8, macOS, Linux, ChromeOS, Android</span>
            <span><strong>RAM:</strong> 1 GB+</span>
            <span><strong>Keyboard:</strong> Standard QWERTY / Remington</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-teal-800/30 flex justify-end">
          <button
            onClick={onClose}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs cursor-pointer transition-colors ${
              isDark ? 'bg-[#0B2E3F] hover:bg-[#0E3549] text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {language === 'mr' ? 'बंद करा (Close)' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
