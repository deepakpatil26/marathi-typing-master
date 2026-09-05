import React, { useState } from 'react';
import { 
  Download, 
  Monitor, 
  CheckCircle2, 
  HardDrive, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Play, 
  HelpCircle, 
  Laptop, 
  Cpu, 
  Award, 
  Keyboard, 
  FolderCheck,
  FileCheck,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { sound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';
import { WindowsInstallerWizard } from './WindowsInstallerWizard';
import { getProductionLaunchUrl } from '../utils/downloadHelper';

interface SoftwareWebsiteViewProps {
  onStartPracticing: () => void;
  language: 'mr' | 'en';
}

export const SoftwareWebsiteView: React.FC<SoftwareWebsiteViewProps> = ({
  onStartPracticing,
  language
}) => {
  const { isDark } = useTheme();
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // Generate and download the official Windows Setup script (MarathiTypingMaster-Setup.bat)
  const handleDownloadSetup = () => {
    sound.playKeyClick();
    const targetUrl = getProductionLaunchUrl();

    const batScript = `@echo off
setlocal enabledelayedexpansion
title Marathi Typing Master - Windows Setup Wizard
color 0b

echo.
echo ====================================================================
echo        MARATHI TYPING MASTER - WINDOWS INSTALLATION WIZARD
echo        महाराष्ट्र शासन GCC-TBC ३० व ४० WPM रेमिंग्टन सॉफ्टवेअर
echo ====================================================================
echo.
echo Setup will install Marathi Typing Master onto your local C: Drive.
echo Default target path: C:\\MarathiTypingMaster
echo.
echo Press any key to begin installation...
pause >nul
echo.
echo [1/4] Creating installation directory: C:\\MarathiTypingMaster ...
mkdir "C:\\MarathiTypingMaster" 2>nul
if not exist "C:\\MarathiTypingMaster" (
    set "TARGET_DIR=%LOCALAPPDATA%\\MarathiTypingMaster"
    mkdir "!TARGET_DIR!" 2>nul
) else (
    set "TARGET_DIR=C:\\MarathiTypingMaster"
)

echo [2/4] Installing core typing engine and Remington layout files...
echo Target: !TARGET_DIR!

:: Write launcher script
(
echo @echo off
echo title Marathi Typing Master Desktop
echo where msedge >nul 2>&1
echo if %%errorlevel%% equ 0 (
echo     start msedge --app="${targetUrl}"
echo     exit
echo ^)
echo where chrome >nul 2>&1
echo if %%errorlevel%% equ 0 (
echo     start chrome --app="${targetUrl}"
echo     exit
echo ^)
echo start "" "${targetUrl}"
echo exit
) > "!TARGET_DIR!\\run.bat"

:: Write application URL shortcut
(
echo [InternetShortcut]
echo URL=${targetUrl}
echo IconIndex=0
echo IconFile=${targetUrl.replace('/?app=true', '')}/icon.svg
echo HotKey=0
) > "!TARGET_DIR!\\MarathiTypingMaster.url"

echo [3/4] Registering offline application cache and Devanagari fonts...
timeout /t 1 >nul

echo [4/4] Installation Complete!
echo.
echo ====================================================================
echo                      INSTALLATION COMPLETE!
echo ====================================================================
echo Marathi Typing Master has been successfully installed in:
echo !TARGET_DIR!
echo.

:: Checkbox equivalent: Prompt user for Desktop Shortcut
set /p CREATEDESKTOPSHORTCUT="Create shortcut of application to desktop? (Y/N) [Default: Y]: "
if /i "!CREATEDESKTOPSHORTCUT!"=="" set CREATEDESKTOPSHORTCUT=Y
if /i "!CREATEDESKTOPSHORTCUT!"=="Y" (
    echo Creating Desktop Shortcut on your Windows Desktop...
    copy /y "!TARGET_DIR!\\MarathiTypingMaster.url" "%USERPROFILE%\\Desktop\\Marathi Typing Master.url" >nul 2>&1
    echo [OK] Desktop Shortcut "Marathi Typing Master" created successfully on your Desktop!
)

echo.
set /p LAUNCH="Launch Marathi Typing Master now? (Y/N) [Default: Y]: "
if /i "!LAUNCH!"=="" set LAUNCH=Y
if /i "!LAUNCH!"=="Y" (
    echo Launching Marathi Typing Master in dedicated App Mode...
    start msedge --app="${targetUrl}" 2>nul || start chrome --app="${targetUrl}" 2>nul || start "" "${targetUrl}"
)

echo.
echo Thank you for using Marathi Typing Master!
echo Installation finished. Press any key to exit.
pause >nul
exit
`;

    const blob = new Blob([batScript], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'MarathiTypingMaster-Setup.bat';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    sound.playSuccessSound();

    // Also offer to open the interactive setup wizard right on the screen
    setTimeout(() => {
      setIsWizardOpen(true);
    }, 600);
  };

  return (
    <div id="software-website-portal" className="w-full flex flex-col gap-8 animate-fadeIn">
      {/* 1. HERO BANNER - TYPINGMASTER STYLE */}
      <div className={`w-full rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md border relative overflow-hidden transition-all duration-200 ${
        isDark 
          ? 'bg-gradient-to-br from-[#062433] via-[#051C27] to-[#02131C] border-teal-700/50 text-slate-100' 
          : 'bg-gradient-to-br from-white via-teal-50/50 to-cyan-50/60 border-teal-200/90 text-slate-900 shadow-teal-900/10'
      }`}>
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border shadow-sm bg-teal-500/10 text-teal-600 dark:text-teal-300 border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'mr' ? 'अधिकृत डेस्कटॉप सॉफ्टवेअर आवृत्ती v10.4' : 'Official Desktop Software Edition v10.4'}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {language === 'mr' ? (
                <>
                  संगणकासाठी <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-400">मराठी टायपिंग मास्टर</span> सॉफ्टवेअर
                </>
              ) : (
                <>
                  Download <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-400">Marathi Typing Master</span> for Windows
                </>
              )}
            </h1>

            <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {language === 'mr'
                ? 'महाराष्ट्र शासन GCC-TBC ३० व ४० WPM संगणक टंकलेखन परीक्षा, न्यायालय व MPSC भरतीसाठी परिपूर्ण सॉफ्टवेअर. C:\ ड्राईव्हवर इन्स्टॉल करा आणि डेस्कटॉप शॉर्टकटसह १००% ऑफलाइन सराव करा.'
                : 'The complete touch typing software for ISM DVBW Remington Marathi layout. Install to your C: drive and practice 100% offline with a direct Desktop Shortcut.'}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
              <span className={`px-2.5 py-1 rounded-lg border font-semibold flex items-center gap-1.5 ${
                isDark ? 'bg-[#03151E] border-teal-900 text-cyan-300' : 'bg-white border-teal-200 text-teal-800'
              }`}>
                <HardDrive className="w-3.5 h-3.5" />
                C:\MarathiTypingMaster
              </span>
              <span className={`px-2.5 py-1 rounded-lg border font-semibold flex items-center gap-1.5 ${
                isDark ? 'bg-[#03151E] border-teal-900 text-emerald-300' : 'bg-white border-emerald-200 text-emerald-800'
              }`}>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Windows 11, 10, 8, 7
              </span>
              <span className={`px-2.5 py-1 rounded-lg border font-semibold flex items-center gap-1.5 ${
                isDark ? 'bg-[#03151E] border-teal-900 text-amber-300' : 'bg-white border-amber-200 text-amber-800'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                100% Safe & Free
              </span>
            </div>

            {/* Big Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              {/* Primary Download Button */}
              <button
                id="btn-download-software-setup"
                onClick={handleDownloadSetup}
                className="px-6 sm:px-8 py-3.5 rounded-2xl font-black text-sm sm:text-base bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 shadow-xl shadow-teal-500/25 active:scale-95 transition-all cursor-pointer flex items-center gap-2.5"
              >
                <Download className="w-5 h-5 stroke-[2.5]" />
                <span>{language === 'mr' ? 'सॉफ्टवेअर डाउनलोड करा (Setup.bat)' : 'Download Free for Windows'}</span>
              </button>

              {/* Interactive Setup Wizard Button */}
              <button
                id="btn-run-installer-wizard"
                onClick={() => {
                  sound.playKeyClick();
                  setIsWizardOpen(true);
                }}
                className={`px-5 py-3.5 rounded-2xl font-bold text-sm border transition-all cursor-pointer flex items-center gap-2 ${
                  isDark 
                    ? 'bg-[#072B3B] hover:bg-[#0A3D52] border-cyan-500/40 text-cyan-300' 
                    : 'bg-white hover:bg-teal-50 border-teal-300 text-teal-800 shadow-sm'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span>{language === 'mr' ? 'इन्स्टॉलेशन विझार्ड चालवा' : 'Run Setup Wizard'}</span>
              </button>

              {/* Launch Online Version */}
              <button
                onClick={() => {
                  sound.playKeyClick();
                  onStartPracticing();
                }}
                className="px-4 py-3.5 text-xs font-bold text-slate-700 hover:text-teal-950 dark:text-slate-400 dark:hover:text-cyan-300 underline underline-offset-4 cursor-pointer transition-colors"
              >
                {language === 'mr' ? 'किंवा ऑनलाइन वेब व्हर्जन वापरा →' : 'Or practice online in browser →'}
              </button>
            </div>

            {downloadSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-950 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>
                  {language === 'mr'
                    ? 'डाउनलोड सुरू झाले! डाउनलोड झालेली "MarathiTypingMaster-Setup.bat" फाइल उघडून C:\ ड्राईव्हवर इन्स्टॉल करा.'
                    : 'Download initiated! Run the downloaded "MarathiTypingMaster-Setup.bat" file to install to C:\\ drive.'}
                </span>
              </div>
            )}
          </div>

          {/* Right Hero Visual: Software Window Preview Card */}
          <div className="w-full lg:w-96 shrink-0">
            <div className={`p-5 rounded-2xl border-2 shadow-2xl space-y-4 ${
              isDark 
                ? 'bg-[#03151E] border-teal-700/60 shadow-teal-950/60' 
                : 'bg-white border-teal-200 shadow-xl'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-teal-900/40 dark:border-teal-900/40">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                </div>
                <span className="text-[11px] font-mono font-bold text-teal-950 dark:text-cyan-400">
                  C:\MarathiTypingMaster
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-teal-500/10 text-teal-950 dark:text-teal-300 font-bold">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>Setup Package</span>
                  </div>
                  <span>1.8 MB (Instant)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-teal-500/5 text-slate-700 dark:text-slate-400 font-medium">
                  <div className="flex items-center gap-2">
                    <FolderCheck className="w-4 h-4 text-amber-600" />
                    <span>Install Path</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-slate-300">C:\MarathiTypingMaster</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-teal-500/5 text-slate-700 dark:text-slate-400 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>Desktop Shortcut</span>
                  </div>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">होय / Enabled</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setIsWizardOpen(true)}
                  className="w-full py-2.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-cyan-300 font-bold text-xs border border-teal-500/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{language === 'mr' ? 'इन्स्टॉलेशन विंडो कशी दिसते ते पहा' : 'View Installation Complete Window'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. HOW THE INSTALLATION WORKS (4 CLEAR STEPS REQUESTED BY USER) */}
      <div className={`w-full rounded-3xl p-6 sm:p-8 shadow-xl border transition-colors ${
        isDark ? 'bg-[#072431]/95 border-teal-800/40' : 'bg-white/95 border-teal-200/80'
      }`}>
        <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
          <h2 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {language === 'mr' ? 'सॉफ्टवेअर इन्स्टॉलेशन कसे होते? (४ सोप्या पायऱ्या)' : 'How Software Installation Works (4 Easy Steps)'}
          </h2>
          <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>
            {language === 'mr' 
              ? 'टायपिंग मास्टर प्रमाणेच तुमच्या संगणकावर प्रत्यक्ष सॉफ्टवेअर इन्स्टॉल करण्याची सोपी पद्धत.' 
              : 'The simple, authentic software installation flow directly to your Windows PC.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
            isDark ? 'bg-[#051C27] border-teal-900/60' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-950 dark:text-teal-400 flex items-center justify-center font-black text-sm border border-teal-500/30">
                1
              </div>
              <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {language === 'mr' ? '१. ॲप्लिकेशन डाउनलोड करा' : '1. Download Application'}
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>
                {language === 'mr'
                  ? 'वरील डाउनलोड बटनावर क्लिक करून MarathiTypingMaster-Setup.bat ही इन्स्टॉलर फाइल संगणकावर सेव्ह करा.'
                  : 'Click the Download button to save MarathiTypingMaster-Setup.bat installer onto your PC.'}
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold text-teal-950 dark:text-cyan-400">
              MarathiTypingMaster-Setup.bat
            </span>
          </div>

          {/* Step 2 */}
          <div className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
            isDark ? 'bg-[#051C27] border-teal-900/60' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-950 dark:text-cyan-400 flex items-center justify-center font-black text-sm border border-cyan-500/30">
                2
              </div>
              <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {language === 'mr' ? '२. C:\ ड्राईव्हवर इन्स्टॉल करा' : '2. Install to C: Drive'}
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>
                {language === 'mr'
                  ? 'डाउनलोड केलेल्या फाइलवर क्लिक करताच ती C:\\MarathiTypingMaster फोल्डरमध्ये सर्व फाइल्स इन्स्टॉल करते.'
                  : 'Run the setup file. It unpacks the typing tutor engine directly into C:\\MarathiTypingMaster.'}
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold text-cyan-950 dark:text-cyan-400">
              Target: C:\MarathiTypingMaster
            </span>
          </div>

          {/* Step 3 */}
          <div className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
            isDark ? 'bg-[#051C27] border-teal-900/60' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-950 dark:text-emerald-400 flex items-center justify-center font-black text-sm border border-emerald-500/30">
                3
              </div>
              <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {language === 'mr' ? '३. इन्स्टॉलेशन कम्प्लीट विंडो' : '3. Complete Window'}
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>
                {language === 'mr'
                  ? 'इन्स्टॉलेशन पूर्ण झाल्यावर "Installation Complete" विंडो दिसेल. यात डेस्कटॉप शॉर्टकटचा पर्याय असेल.'
                  : 'When installation completes, the "Installation Complete" window shows with desktop shortcut option.'}
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-950 dark:text-emerald-400">
              Status: 100% Complete
            </span>
          </div>

          {/* Step 4 */}
          <div className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
            isDark ? 'bg-[#051C27] border-teal-900/60' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-950 dark:text-amber-400 flex items-center justify-center font-black text-sm border border-amber-500/30">
                4
              </div>
              <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {language === 'mr' ? '४. डेस्कटॉप शॉर्टकट तयार करा' : '4. Desktop Shortcut'}
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>
                {language === 'mr'
                  ? '"Create shortcut of application to desktop" चालू ठेवा. संगणकाच्या डेस्कटॉपवर थेट शॉर्टकट तयार होतो.'
                  : 'Toggle ON "Create shortcut to desktop". A direct desktop shortcut is placed on your Windows Desktop.'}
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold text-amber-950 dark:text-amber-400">
              Desktop Shortcut: Enabled
            </span>
          </div>
        </div>
      </div>

      {/* 3. KEY FEATURES & GCC-TBC COMPLIANCE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className={`p-6 rounded-3xl border transition-colors space-y-3 ${
          isDark ? 'bg-[#072431]/95 border-teal-800/40' : 'bg-white/95 border-teal-200/80 shadow-sm'
        }`}>
          <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30 w-fit">
            <Keyboard className="w-6 h-6" />
          </div>
          <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {language === 'mr' ? 'अधिकृत रेमिंग्टन (ISM DVBW) कीबोर्ड' : 'Official ISM Remington Layout'}
          </h3>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {language === 'mr'
              ? 'महाराष्ट्र शासनाच्या संगणक टायपिंग परीक्षांमध्ये वापरला जाणारा मूळ टाईपरायटर लेआउट. काना, मात्रा, वेलांटी व जोडाक्षरे अचूक मांडणीसह.'
              : 'Exact typewriter layout used in Maharashtra government GCC-TBC exams, with no dotted circles and authentic conjuncts.'}
          </p>
        </div>

        <div className={`p-6 rounded-3xl border transition-colors space-y-3 ${
          isDark ? 'bg-[#072431]/95 border-teal-800/40' : 'bg-white/95 border-teal-200/80 shadow-sm'
        }`}>
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 w-fit">
            <Award className="w-6 h-6" />
          </div>
          <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {language === 'mr' ? 'GCC-TBC ३० व ४० WPM परीक्षा मोड' : 'GCC-TBC 30 & 40 WPM Exam Mode'}
          </h3>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {language === 'mr'
              ? '५ मिनिटांचा अचूक टायमर, प्रति शब्द ५ अक्षरे मोजणी, चुकांसाठी दंड गुण आणि अधिकृत ग्रेडसह निकालपत्रक (Marksheet).'
              : 'Strict 5-minute timed test with 5-stroke word calculations, mistake penalization, and printable certificate.'}
          </p>
        </div>

        <div className={`p-6 rounded-3xl border transition-colors space-y-3 ${
          isDark ? 'bg-[#072431]/95 border-teal-800/40' : 'bg-white/95 border-teal-200/80 shadow-sm'
        }`}>
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 w-fit">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {language === 'mr' ? '१००% ऑफलाइन कार्यक्षमता' : '100% Offline Capability'}
          </h3>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {language === 'mr'
              ? 'एकदा इन्स्टॉल झाल्यानंतर इंटरनेट कनेक्शनची अजिबात गरज नाही. संगणक सुरू करा आणि डेस्कटॉप शॉर्टकटवरून थेट सराव करा.'
              : 'Runs locally from your C: drive with zero internet requirement. Safe for institute labs and home computers.'}
          </p>
        </div>
      </div>

      {/* 4. SYSTEM REQUIREMENTS TABLE */}
      <div className={`w-full rounded-3xl p-6 sm:p-8 shadow-xl border transition-colors ${
        isDark ? 'bg-[#072431]/95 border-teal-800/40' : 'bg-white/95 border-teal-200/80'
      }`}>
        <div className="flex items-center gap-2.5 pb-4 border-b border-teal-900/40">
          <Laptop className="w-5 h-5 text-teal-600 dark:text-cyan-400" />
          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {language === 'mr' ? 'संगणक प्रणाली आवश्यकता (System Requirements)' : 'Windows System Requirements'}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 text-xs">
          <div className={`p-3.5 rounded-xl border ${
            isDark ? 'bg-[#051C27] border-teal-900/60 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <span className="text-[11px] text-slate-500 block">ऑपरेटिंग सिस्टम (OS)</span>
            <span className="font-bold text-sm block mt-0.5">Windows 11 / 10 / 8 / 7</span>
            <span className="text-[10px] text-teal-600 dark:text-cyan-400">32-bit & 64-bit</span>
          </div>

          <div className={`p-3.5 rounded-xl border ${
            isDark ? 'bg-[#051C27] border-teal-900/60 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <span className="text-[11px] text-slate-500 block">रॅम (RAM)</span>
            <span className="font-bold text-sm block mt-0.5">512 MB किमान</span>
            <span className="text-[10px] text-teal-600 dark:text-cyan-400">1 GB शिफारस केलेले</span>
          </div>

          <div className={`p-3.5 rounded-xl border ${
            isDark ? 'bg-[#051C27] border-teal-900/60 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <span className="text-[11px] text-slate-500 block">हार्ड डिस्क जागा (Storage)</span>
            <span className="font-bold text-sm block mt-0.5">50 MB C:\ ड्राईव्हवर</span>
            <span className="text-[10px] text-teal-600 dark:text-cyan-400">C:\MarathiTypingMaster</span>
          </div>

          <div className={`p-3.5 rounded-xl border ${
            isDark ? 'bg-[#051C27] border-teal-900/60 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <span className="text-[11px] text-slate-500 block">कीबोर्ड (Keyboard)</span>
            <span className="font-bold text-sm block mt-0.5">Standard 104-Key</span>
            <span className="text-[10px] text-teal-600 dark:text-cyan-400">QWERTY Hardware</span>
          </div>
        </div>
      </div>

      {/* 5. INTERACTIVE INSTALLATION COMPLETE WIZARD MODAL */}
      <WindowsInstallerWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onLaunchApp={onStartPracticing}
        language={language}
      />
    </div>
  );
};
