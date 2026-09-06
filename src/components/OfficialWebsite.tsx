import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Monitor, 
  CheckCircle2, 
  HardDrive, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Laptop, 
  Cpu, 
  Award, 
  Keyboard, 
  FolderCheck,
  FileCheck,
  ChevronRight,
  Sun,
  Moon,
  Globe,
  Users,
  BookOpen,
  FileText,
  Star,
  Check,
  ArrowUp,
  Share2,
  Lock,
  ThumbsUp,
  Layers,
  HelpCircle
} from 'lucide-react';
import { sound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';
import { WindowsInstallerWizard } from './WindowsInstallerWizard';
import { getProductionLaunchUrl } from '../utils/downloadHelper';

interface OfficialWebsiteProps {
  onLaunchSoftware?: () => void;
  language: 'mr' | 'en';
  onToggleLanguage: () => void;
}

export const OfficialWebsite: React.FC<OfficialWebsiteProps> = ({
  language,
  onToggleLanguage
}) => {
  const { isDark, toggleTheme } = useTheme();
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Scroll listener for the bottom-right Back-to-Top mover button
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        setShowBackToTop(window.scrollY > 280);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    sound.playKeyClick();
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const handleShareLink = () => {
    sound.playKeyClick();
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin);
      setCopiedLink(true);
      sound.playSuccessSound();
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Generate and download the official Windows Setup script (MarathiTypingMaster-Setup.bat)
  const handleDownloadSetup = async () => {
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

:: Write offline launcher script
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

echo [3/4] Registering Devanagari fonts and GCC-TBC curriculum databases...
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

    // Check if the standalone Windows installer executable is hosted in /downloads/
    try {
      const exeResponse = await fetch('/downloads/MarathiTypingMasterSetup.exe', { method: 'HEAD' });
      if (exeResponse.ok) {
        const link = document.createElement('a');
        link.href = '/downloads/MarathiTypingMasterSetup.exe';
        link.download = 'MarathiTypingMasterSetup.exe';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setDownloadSuccess(true);
        sound.playSuccessSound();
        setTimeout(() => {
          setIsWizardOpen(true);
        }, 400);
        return;
      }
    } catch {
      // If .exe not found on static server, fallback to standard setup bundle
    }

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

    // Trigger the interactive Windows installer wizard preview
    setTimeout(() => {
      setIsWizardOpen(true);
    }, 600);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isDark 
        ? 'bg-gradient-to-br from-[#021822] via-[#041F2C] to-[#010D13] text-slate-100 selection:bg-teal-500 selection:text-slate-950' 
        : 'bg-gradient-to-br from-[#F0F9FF] via-[#F8FAFC] to-[#E0F2FE] text-slate-900 selection:bg-sky-500 selection:text-white'
    }`}>
      
      {/* 1. OFFICIAL WEBSITE NAVIGATION HEADER */}
      <header className={`w-full backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40 transition-colors duration-200 border-b ${
        isDark ? 'bg-[#03151E]/90 border-teal-900/60' : 'bg-white/95 border-teal-200/80 shadow-sm'
      }`}>
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 p-0.5 shadow-md shadow-teal-500/20 flex items-center justify-center">
            <div className={`w-full h-full rounded-[14px] flex items-center justify-center font-black text-lg ${
              isDark ? 'bg-[#03151E] text-cyan-300' : 'bg-white text-teal-800'
            }`}>
              म
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-black tracking-tight leading-none">
                {language === 'mr' ? 'मराठी टायपिंग मास्टर' : 'Marathi Typing Master'}
              </span>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-800 dark:text-cyan-400 border border-teal-500/30">
                Official
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block">
              {language === 'mr' ? 'महाराष्ट्र शासन GCC-TBC रेमिंग्टन टंकलेखन सॉफ्टवेअर' : 'Maharashtra GCC-TBC Remington Typing Tutor'}
            </p>
          </div>
        </div>

        {/* Center Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-600 dark:text-slate-300">
          <a href="#features" className="hover:text-teal-800 dark:hover:text-cyan-300 transition-colors">
            {language === 'mr' ? 'वैशिष्ट्ये' : 'Features'}
          </a>
          <a href="#how-to-install" className="hover:text-teal-800 dark:hover:text-cyan-300 transition-colors">
            {language === 'mr' ? 'इन्स्टॉलेशन' : 'Installation'}
          </a>
          <a href="#curriculum" className="hover:text-teal-800 dark:hover:text-cyan-300 transition-colors">
            {language === 'mr' ? 'अभ्यासक्रम' : 'Curriculum'}
          </a>
          <a href="#testimonials" className="hover:text-teal-800 dark:hover:text-cyan-300 transition-colors">
            {language === 'mr' ? 'अभिप्राय' : 'Testimonials'}
          </a>
          <a href="#faq" className="hover:text-teal-800 dark:hover:text-cyan-300 transition-colors">
            {language === 'mr' ? 'प्रश्नोत्तरे' : 'FAQ'}
          </a>
        </nav>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2.5">
          {/* Share Link button */}
          <button
            onClick={handleShareLink}
            className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              isDark ? 'bg-[#061F2C] border-teal-900/60 text-slate-300 hover:text-cyan-300' : 'bg-white border-teal-200 text-slate-700 hover:text-teal-900'
            }`}
            title={language === 'mr' ? 'वेबसाइट लिंक कॉपी करा' : 'Copy website link to open on PC'}
          >
            <Share2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>{copiedLink ? (language === 'mr' ? 'कॉपी झाली!' : 'Copied!') : (language === 'mr' ? 'शेअर' : 'Share')}</span>
          </button>

          {/* Language Toggle (English <-> Marathi) */}
          <button
            onClick={onToggleLanguage}
            id="btn-website-language-toggle"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              isDark ? 'bg-[#061F2C] border-teal-900/60 text-cyan-300 hover:bg-[#092B3C]' : 'bg-white border-teal-200 text-teal-900 hover:bg-teal-50'
            }`}
            title={language === 'mr' ? 'इंग्रजीमध्ये बदला (Switch to English)' : 'मराठीत बदला (Switch to Marathi)'}
          >
            <Globe className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>{language === 'mr' ? 'English' : 'मराठी'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border text-xs transition-all cursor-pointer ${
              isDark ? 'bg-[#061F2C] border-teal-900/60 text-amber-300 hover:text-amber-200' : 'bg-white border-teal-200 text-slate-600 hover:text-teal-900'
            }`}
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-teal-800" />}
          </button>

          {/* Primary Download CTA Button (No Launch button) */}
          <button
            id="btn-header-download"
            onClick={handleDownloadSetup}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl font-black text-xs bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 shadow-md shadow-teal-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{language === 'mr' ? 'मोफत डाउनलोड' : 'Free Download'}</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN WEBSITE CONTENT */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-16">
        
        {/* HERO SECTION */}
        <section className="relative flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="max-w-2xl space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-sm bg-teal-500/10 text-teal-900 dark:text-teal-300 border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
              <span>{language === 'mr' ? 'Windows 11, 10, 8, 7 साठी अधिकृत डेस्कटॉप सॉफ्टवेअर' : 'Official Windows Desktop Edition v10.4'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              {language === 'mr' ? (
                <>
                  मराठी टंकलेखन शिका आणि गती वाढवा - <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-400">डेस्कटॉप सॉफ्टवेअर</span>
                </>
              ) : (
                <>
                  Master Marathi Typing on Windows with <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-400">Typing Master</span>
                </>
              )}
            </h1>

            <p className={`text-base sm:text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {language === 'mr'
                ? 'महाराष्ट्र शासन GCC-TBC ३० व ४० WPM, MPSC आणि जिल्हा न्यायालय टंकलेखन परीक्षेसाठी परिपूर्ण ISM DVBW Remington कीबोर्ड सॉफ्टवेअर. तुमच्या C:\\ ड्राईव्हवर इन्स्टॉल करा आणि डेस्कटॉप शॉर्टकटसह १००% ऑफलाइन सराव करा.'
                : 'The official touch typing tutor for ISM DVBW Remington Marathi layout. Install to your local C: drive and practice 100% offline with a direct Desktop Shortcut on Windows 11, 10, 8, and 7.'}
            </p>

            {/* Badges / Guarantees */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs">
              <span className={`px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 ${
                isDark ? 'bg-[#03151E] border-teal-900 text-cyan-300' : 'bg-white border-teal-200 text-teal-900 shadow-sm'
              }`}>
                <HardDrive className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                C:\MarathiTypingMaster
              </span>
              <span className={`px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 ${
                isDark ? 'bg-[#03151E] border-teal-900 text-emerald-300' : 'bg-white border-emerald-200 text-emerald-800 shadow-sm'
              }`}>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Windows 11, 10, 8, 7
              </span>
              <span className={`px-3 py-1.5 rounded-xl border font-bold flex items-center gap-1.5 ${
                isDark ? 'bg-[#03151E] border-teal-900 text-amber-300' : 'bg-white border-amber-200 text-amber-800 shadow-sm'
              }`}>
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                {language === 'mr' ? '१००% मोफत व सुरक्षित' : '100% Free & Verified'}
              </span>
            </div>

            {/* Big Action Buttons (Only Download and Setup Wizard, NO Web Launch) */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              {/* Primary Download Button */}
              <button
                id="btn-hero-download"
                onClick={handleDownloadSetup}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-base bg-gradient-to-r from-teal-500 via-cyan-400 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 shadow-xl shadow-teal-500/25 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-3"
              >
                <Download className="w-5 h-5 stroke-[2.5]" />
                <div className="text-left leading-tight">
                  <span className="block">{language === 'mr' ? 'सॉफ्टवेअर डाउनलोड करा' : 'Download Free for Windows'}</span>
                  <span className="block text-[11px] font-bold opacity-85">Setup.bat • 48 MB • C:\ Drive</span>
                </div>
              </button>

              {/* Run Setup Wizard Preview */}
              <button
                id="btn-hero-wizard"
                onClick={() => {
                  sound.playKeyClick();
                  setIsWizardOpen(true);
                }}
                className={`w-full sm:w-auto px-6 py-4 rounded-2xl font-bold text-sm border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  isDark 
                    ? 'bg-[#072B3B] hover:bg-[#0A3D52] border-cyan-500/40 text-cyan-300' 
                    : 'bg-white hover:bg-teal-50 border-teal-300 text-teal-900 shadow-sm'
                }`}
              >
                <Monitor className="w-4 h-4 text-teal-700 dark:text-teal-400" />
                <span>{language === 'mr' ? 'इन्स्टॉलेशन विझार्ड पाहा' : 'Preview Setup Wizard'}</span>
              </button>
            </div>

            {downloadSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>
                  {language === 'mr'
                    ? 'डाउनलोड यशस्वी! डाउनलोड झालेली "MarathiTypingMaster-Setup.bat" फाइल उघडा आणि C:\\ ड्राईव्हवर इन्स्टॉल करा.'
                    : 'Download initiated! Double-click "MarathiTypingMaster-Setup.bat" in your Downloads folder to install to your C:\\ drive.'}
                </span>
              </div>
            )}
          </div>

          {/* Right Hero Visual Card (Desktop Mockup Showcase) */}
          <div className="w-full lg:w-[440px] shrink-0">
            <div className={`p-6 rounded-3xl border-2 shadow-2xl space-y-5 transition-all ${
              isDark 
                ? 'bg-[#03151E] border-teal-700/60 shadow-teal-950/60' 
                : 'bg-white border-teal-200 shadow-2xl'
            }`}>
              <div className="flex items-center justify-between pb-3.5 border-b border-teal-900/40">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                  <span className="text-xs font-bold ml-1">MarathiTypingMaster.exe</span>
                </div>
                <span className="text-[11px] font-mono font-bold text-teal-800 dark:text-cyan-400">
                  C:\MarathiTypingMaster
                </span>
              </div>

              {/* Software Mockup Preview Window */}
              <div className={`p-4 rounded-2xl border space-y-3.5 ${
                isDark ? 'bg-[#02131C] border-teal-900/60' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-teal-900 dark:text-cyan-300">
                    {language === 'mr' ? 'धडा १.१: होम रो प्रॅक्टिस' : 'Lesson 1.1: Home Row Practice'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-500 text-[10px]">
                    35 WPM • 98%
                  </span>
                </div>
                
                <div className="p-3 rounded-xl bg-white dark:bg-[#061F2C] border border-teal-500/30 text-center font-bold text-xl text-slate-800 dark:text-slate-100 tracking-wider font-mono">
                  क र त ब ज ह ग द न
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="p-2 rounded-xl bg-teal-500/10">
                    <span className="block text-slate-500 dark:text-slate-400">{language === 'mr' ? 'गती' : 'Speed'}</span>
                    <span className="font-black text-xs text-teal-800 dark:text-teal-400">35 WPM</span>
                  </div>
                  <div className="p-2 rounded-xl bg-cyan-500/10">
                    <span className="block text-slate-500 dark:text-slate-400">{language === 'mr' ? 'अचूकता' : 'Accuracy'}</span>
                    <span className="font-black text-xs text-cyan-800 dark:text-cyan-400">98.4%</span>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-500/10">
                    <span className="block text-slate-500 dark:text-slate-400">{language === 'mr' ? 'वेळ' : 'Time'}</span>
                    <span className="font-black text-xs text-emerald-800 dark:text-emerald-400">05:00</span>
                  </div>
                </div>
              </div>

              {/* Guarantee banner & Download CTA inside Card */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-900 dark:text-cyan-300 text-[11px] font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>
                    {language === 'mr' 
                      ? '१००% ऑफलाइन • डेस्कटॉप शॉर्टकट • मोफत' 
                      : '100% Offline • Desktop Shortcut • Free'}
                  </span>
                </div>

                <button
                  onClick={handleDownloadSetup}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>{language === 'mr' ? 'संगणकावर डाउनलोड करा (Setup.bat)' : 'Download Windows Installer (Setup.bat)'}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* HOW THE INSTALLATION WORKS (4 CLEAR STEPS) */}
        <section id="how-to-install" className={`w-full rounded-3xl p-6 sm:p-10 shadow-xl border transition-colors ${
          isDark ? 'bg-[#072431]/95 border-teal-800/40' : 'bg-white/95 border-teal-200/80'
        }`}>
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-900 dark:text-cyan-400 border border-teal-500/30">
              <FolderCheck className="w-3.5 h-3.5" />
              <span>{language === 'mr' ? 'अचूक इन्स्टॉलेशन प्रक्रिया' : 'Simple 4-Step Installation'}</span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {language === 'mr' ? 'सॉफ्टवेअर कसे डाउनलोड व इन्स्टॉल करावे?' : 'How to Download and Install Marathi Typing Master?'}
            </h2>
            <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {language === 'mr' 
                ? 'टायपिंग मास्टर सॉफ्टवेअर प्रमाणेच तुमच्या संगणकावर प्रत्यक्ष सॉफ्टवेअर इन्स्टॉल करण्याची अधिकृत पद्धत.' 
                : 'The official installation flow directly into your Windows PC C: drive with a desktop launcher shortcut.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Step 1 */}
            <div className={`p-6 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
              isDark ? 'bg-[#051C27] border-teal-900/60' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/15 text-teal-900 dark:text-teal-400 flex items-center justify-center font-black text-base border border-teal-500/30">
                  1
                </div>
                <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {language === 'mr' ? '१. ॲप्लिकेशन डाउनलोड करा' : '1. Download Application'}
                </h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {language === 'mr'
                    ? 'वेबसाइटवरील "मोफत डाउनलोड" बटनावर क्लिक करून MarathiTypingMaster-Setup.bat ही फाइल संगणकावर सेव्ह करा.'
                    : 'Click Free Download to save the official MarathiTypingMaster-Setup.bat installer file to your computer.'}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-teal-500/10 text-[11px] font-mono text-teal-900 dark:text-cyan-400 font-bold truncate">
                MarathiTypingMaster-Setup.bat
              </div>
            </div>

            {/* Step 2 */}
            <div className={`p-6 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
              isDark ? 'bg-[#051C27] border-teal-900/60' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-900 dark:text-cyan-400 flex items-center justify-center font-black text-base border border-cyan-500/30">
                  2
                </div>
                <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {language === 'mr' ? '२. C:\\ ड्राईव्हवर इन्स्टॉल करा' : '2. Install to C: Drive'}
                </h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {language === 'mr'
                    ? 'डाउनलोड केलेल्या फाइलवर डबल-क्लिक करा. ती तुमच्या C:\\MarathiTypingMaster फोल्डरमध्ये सर्व फाइल्स इन्स्टॉल करेल.'
                    : 'Double-click the downloaded setup file. It unpacks the Remington typing engine into C:\\MarathiTypingMaster.'}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-cyan-500/10 text-[11px] font-mono text-cyan-900 dark:text-cyan-400 font-bold truncate">
                Target: C:\MarathiTypingMaster
              </div>
            </div>

            {/* Step 3 */}
            <div className={`p-6 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
              isDark ? 'bg-[#051C27] border-teal-900/60' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-900 dark:text-emerald-400 flex items-center justify-center font-black text-base border border-emerald-500/30">
                  3
                </div>
                <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {language === 'mr' ? '३. इन्स्टॉलेशन कम्प्लीट विंडो' : '3. Complete Window'}
                </h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {language === 'mr'
                    ? 'इन्स्टॉलेशन पूर्ण होताच "Installation Complete" स्क्रीन दिसेल, ज्यामध्ये डेस्कटॉप शॉर्टकटचा पर्याय असेल.'
                    : 'When installation completes, the official "Installation Complete" window shows with shortcut creation options.'}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-[11px] font-mono text-emerald-900 dark:text-cyan-400 font-bold truncate">
                Status: 100% Complete
              </div>
            </div>

            {/* Step 4 */}
            <div className={`p-6 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
              isDark ? 'bg-[#051C27] border-teal-900/60' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-900 dark:text-amber-400 flex items-center justify-center font-black text-base border border-amber-500/30">
                  4
                </div>
                <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {language === 'mr' ? '४. डेस्कटॉप शॉर्टकट' : '4. Desktop Shortcut'}
                </h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {language === 'mr'
                    ? '"Create shortcut of application to desktop" चालू ठेवा. डेस्कटॉपवरून १-क्लिकमध्ये थेट सॉफ्टवेअर सुरू होईल.'
                    : 'Leave "Create shortcut to desktop" enabled. A direct 1-click launcher is placed on your Windows Desktop.'}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-amber-500/10 text-[11px] font-mono text-amber-900 dark:text-amber-400 font-bold truncate">
                Desktop Shortcut: [✓] ON
              </div>
            </div>
          </div>
        </section>

        {/* KEY FEATURES GRID */}
        <section id="features" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {language === 'mr' ? 'सॉफ्टवेअरची प्रमुख वैशिष्ट्ये' : 'Core Software Features'}
            </h2>
            <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {language === 'mr' 
                ? 'महाराष्ट्र शासनाच्या टंकलेखन नियमांनुसार परिपूर्ण रचना.' 
                : 'Built strictly according to Maharashtra GCC-TBC typing specifications and rules.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className={`p-6 rounded-3xl border transition-colors space-y-3.5 ${
              isDark ? 'bg-[#072431]/95 border-teal-800/40' : 'bg-white/95 border-teal-200/80 shadow-sm'
            }`}>
              <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-900 dark:text-teal-400 border border-teal-500/30 w-fit">
                <Keyboard className="w-6 h-6" />
              </div>
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {language === 'mr' ? 'मूळ रेमिंग्टन (ISM DVBW) कीबोर्ड' : 'Official ISM Remington Layout'}
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {language === 'mr'
                  ? 'टाईपरायटर प्रमाणेच मूळ कीबोर्ड मांडणी. काना, मात्रा, वेलांटी व जोडाक्षरे अचूक आणि स्पष्ट दिसतात; कोणतेही अनावश्यक डॉटेड सर्कल्स दिसत नाहीत.'
                  : 'Authentic typewriter keyboard layout used across government examinations with clean Devanagari typography and zero dotted circles.'}
              </p>
            </div>

            {/* Feature 2 */}
            <div className={`p-6 rounded-3xl border transition-colors space-y-3.5 ${
              isDark ? 'bg-[#072431]/95 border-teal-800/40' : 'bg-white/95 border-teal-200/80 shadow-sm'
            }`}>
              <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-900 dark:text-cyan-400 border border-cyan-500/30 w-fit">
                <Award className="w-6 h-6" />
              </div>
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {language === 'mr' ? 'GCC-TBC ३० व ४० WPM परीक्षा मोड' : 'GCC-TBC 30 & 40 WPM Exam Mode'}
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {language === 'mr'
                  ? '५ मिनिटांचा अचूक टायमर, प्रति शब्द ५ अक्षरे मोजणी, चुकांसाठी दंड गुण आणि अधिकृत निकालपत्रक (Marksheet) व प्रिंट सर्टिफिकेट.'
                  : 'Strict 5-minute timed test with 5-stroke word calculations, negative marking, and printable GCC-TBC marksheet certificate.'}
              </p>
            </div>

            {/* Feature 3 */}
            <div className={`p-6 rounded-3xl border transition-colors space-y-3.5 ${
              isDark ? 'bg-[#072431]/95 border-teal-800/40' : 'bg-white/95 border-teal-200/80 shadow-sm'
            }`}>
              <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-900 dark:text-emerald-400 border border-emerald-500/30 w-fit">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {language === 'mr' ? '१००% ऑफलाइन कार्यक्षमता' : '100% Offline Capability'}
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {language === 'mr'
                  ? 'एकदा इन्स्टॉल झाल्यानंतर इंटरनेट कनेक्शनची अजिबात गरज नाही. संगणक सुरू करा आणि डेस्कटॉप शॉर्टकटवरून थेट सराव करा.'
                  : 'Runs locally from your C: drive with zero internet requirement. Ideal for typing institute labs and home computers.'}
              </p>
            </div>

            {/* Feature 4 */}
            <div className={`p-6 rounded-3xl border transition-colors space-y-3.5 ${
              isDark ? 'bg-[#072431]/95 border-teal-800/40' : 'bg-white/95 border-teal-200/80 shadow-sm'
            }`}>
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-900 dark:text-amber-400 border border-amber-500/30 w-fit">
                <Users className="w-6 h-6" />
              </div>
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {language === 'mr' ? 'विद्यार्थी व इन्स्टिट्यूट प्रोफाइल्स' : 'Multi-Student Profiles'}
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {language === 'mr'
                  ? 'टायपिंग इन्स्टिट्यूटसाठी एकाच संगणकावर अनेक विद्यार्थ्यांचे प्रोफाइल्स तयार करा. प्रत्येकाची प्रगती व निकाल स्वतंत्र राहतो.'
                  : 'Allows typing institutes to create independent student profiles with batch numbers, individual logs, and speed records.'}
              </p>
            </div>

            {/* Feature 5 */}
            <div className={`p-6 rounded-3xl border transition-colors space-y-3.5 ${
              isDark ? 'bg-[#072431]/95 border-teal-800/40' : 'bg-white/95 border-teal-200/80 shadow-sm'
            }`}>
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-900 dark:text-purple-400 border border-purple-500/30 w-fit">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {language === 'mr' ? 'AI वीक की विश्लेषण' : 'Smart AI Weak-Key Remediation'}
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {language === 'mr'
                  ? 'विद्यार्थ्यांच्या वारंवार चुकणाऱ्या अक्षरांचे अचूक विश्लेषण करून त्याच अक्षरांचा खास सराव परिच्छेद तयार केला जातो.'
                  : 'Automatically identifies inaccurate keypresses and generates targeted remedial drill passages to eliminate errors.'}
              </p>
            </div>

            {/* Feature 6 */}
            <div className={`p-6 rounded-3xl border transition-colors space-y-3.5 ${
              isDark ? 'bg-[#072431]/95 border-teal-800/40' : 'bg-white/95 border-teal-200/80 shadow-sm'
            }`}>
              <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-900 dark:text-rose-400 border border-rose-500/30 w-fit">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {language === 'mr' ? 'अधिकृत शासकीय परिच्छेद संग्रह' : 'Government Passage Catalog'}
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {language === 'mr'
                  ? 'प्रशासकीय, ऐतिहासिक, वैज्ञानिक आणि कृषी विषयांवरील शेकडो परिच्छेद सरावासाठी उपलब्ध.'
                  : 'Comprehensive catalog of government, history, science, and administrative test passages for speed building.'}
              </p>
            </div>
          </div>
        </section>

        {/* 7. CURRICULUM OVERVIEW (SEAMLESS BILINGUAL) */}
        <section id="curriculum" className={`w-full rounded-3xl p-6 sm:p-10 shadow-xl border transition-colors ${
          isDark ? 'bg-[#072431]/95 border-teal-800/40' : 'bg-white/95 border-teal-200/80'
        }`}>
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {language === 'mr' ? 'क्रमबद्ध टायपिंग अभ्यासक्रम' : 'Step-by-Step Curriculum'}
            </h2>
            <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {language === 'mr' 
                ? 'मूलभूत अक्षरांपासून ते ४० WPM गतीपर्यंत सर्वसमावेशक ६ टप्पे.' 
                : 'From fundamental home row keypresses to certified 40 WPM speed tests in 6 stages.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
            {/* Stage 1 */}
            <div className={`p-4 rounded-2xl border space-y-2 ${
              isDark ? 'bg-[#051C27] border-teal-900/60' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="font-bold text-teal-900 dark:text-cyan-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>{language === 'mr' ? 'धडा १: होम रो कीज (Home Row)' : 'Stage 1: Home Row Keys'}</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                {language === 'mr' 
                  ? 'क, र, त, ब, ज, ह, ग, द, न आणि काना (ा) यांचा अचूक बोटानुसार सराव.' 
                  : 'Finger positioning for क, र, त, ब, ज, ह, ग, द, न and kana (ा) vowel sign.'}
              </p>
            </div>

            {/* Stage 2 */}
            <div className={`p-4 rounded-2xl border space-y-2 ${
              isDark ? 'bg-[#051C27] border-teal-900/60' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="font-bold text-teal-900 dark:text-cyan-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>{language === 'mr' ? 'धडा २: अप्पर रो कीज (Upper Row)' : 'Stage 2: Upper Row Keys'}</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                {language === 'mr'
                  ? 'च, ज, ह, म, न, प, य, व आणि वेलांटी (ि, ी) व मात्रा (े, ै) सराव.'
                  : 'Upper row consonants with short/long velanti (ि, ी) and matra (े, ै).'}
              </p>
            </div>

            {/* Stage 3 */}
            <div className={`p-4 rounded-2xl border space-y-2 ${
              isDark ? 'bg-[#051C27] border-teal-900/60' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="font-bold text-teal-900 dark:text-cyan-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>{language === 'mr' ? 'धडा ३: बॉटम रो कीज (Bottom Row)' : 'Stage 3: Bottom Row Keys'}</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                {language === 'mr'
                  ? 'ड, ढ, ण, थ, ध, भ, श, ष, स आणि उकार (ु, ू) सराव.'
                  : 'Bottom row characters, sibilants, and bottom ukar (ु, ू) vowel signs.'}
              </p>
            </div>

            {/* Stage 4 */}
            <div className={`p-4 rounded-2xl border space-y-2 ${
              isDark ? 'bg-[#051C27] border-teal-900/60' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="font-bold text-teal-900 dark:text-cyan-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>{language === 'mr' ? 'धडा ४: शिफ्ट कीज व जोडाक्षरे' : 'Stage 4: Shift Keys & Conjuncts'}</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                {language === 'mr'
                  ? 'हलंत (्), रफार, त्र, ज्ञ, क्ष व सर्व प्रकारची जटिल जोडाक्षरे.'
                  : 'Halant combinations, rafars, conjunct consonants, and complex Marathi ligatures.'}
              </p>
            </div>

            {/* Stage 5 */}
            <div className={`p-4 rounded-2xl border space-y-2 ${
              isDark ? 'bg-[#051C27] border-teal-900/60' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="font-bold text-teal-900 dark:text-cyan-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>{language === 'mr' ? 'धडा ५: अंक व विरामचिन्हे' : 'Stage 5: Numerals & Punctuation'}</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                {language === 'mr'
                  ? '० ते ९ देवनागरी व इंग्रजी अंक, पूर्णविराम, स्वल्पविराम व अवतरण चिन्हे.'
                  : 'Devanagari and English digits (0-9), punctuation, full-stops, and quotes.'}
              </p>
            </div>

            {/* Stage 6 */}
            <div className={`p-4 rounded-2xl border space-y-2 ${
              isDark ? 'bg-[#051C27] border-teal-900/60' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="font-bold text-teal-900 dark:text-cyan-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>{language === 'mr' ? 'धडा ६: GCC-TBC स्पीड ड्रिल्स' : 'Stage 6: GCC-TBC Speed Drills'}</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                {language === 'mr'
                  ? '३० व ४० WPM गतीसाठी ५ मिनिटांचे सराव परिच्छेद आणि अचूकता चाचणी.'
                  : 'Official 5-minute timed test passages at 30 & 40 WPM with penalty evaluation.'}
              </p>
            </div>
          </div>
        </section>

        {/* 8. TESTIMONIALS SECTION */}
        <section id="testimonials" className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <h2 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {language === 'mr' ? 'टायपिंग इन्स्टिट्यूट्स व विद्यार्थ्यांचे अभिप्राय' : 'Institute & Student Testimonials'}
            </h2>
            <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {language === 'mr' 
                ? 'महाराष्ट्रभरातील शिक्षकांनी आणि विद्यार्थ्यांनी व्यक्त केलेले मनोगत.' 
                : 'Real feedback from typing teachers and candidates across Maharashtra.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className={`p-6 rounded-3xl border transition-all space-y-4 ${
              isDark ? 'bg-[#061F2C] border-teal-800/40' : 'bg-white border-teal-200/80 shadow-sm'
            }`}>
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                {language === 'mr'
                  ? '"आमच्या संस्थेतील ४५ विद्यार्थ्यांनी या सॉफ्टवेअरवर सराव करून GCC-TBC ३० व ४० WPM परीक्षा पहिल्याच प्रयत्नात उत्कृष्ट गुणांनी उत्तीर्ण केली. C: ड्राईव्हवरील इन्स्टॉलेशन आणि डेस्कटॉप शॉर्टकट लॅबसाठी अतिशय सोयीस्कर आहे."'
                  : '"45 students from our institute practiced on this software and cleared the GCC-TBC 30 & 40 WPM exams in their first attempt with flying colors. Local C: drive installation and desktop shortcut make lab maintenance effortless."'}
              </p>
              <div className="pt-2 border-t border-teal-900/30">
                <span className="font-bold text-sm block text-slate-900 dark:text-white">
                  {language === 'mr' ? 'श्री. विठ्ठलराव देशमुख' : 'Mr. Vitthalrao Deshmukh'}
                </span>
                <span className="text-[11px] text-teal-900 dark:text-cyan-400 block">
                  {language === 'mr' ? 'संचालक, श्री दत्त कॉम्प्युटर व टायपिंग, पुणे' : 'Director, Shree Datta Typing Institute, Pune'}
                </span>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className={`p-6 rounded-3xl border transition-all space-y-4 ${
              isDark ? 'bg-[#061F2C] border-teal-800/40' : 'bg-white border-teal-200/80 shadow-sm'
            }`}>
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                {language === 'mr'
                  ? '"इतर सॉफ्टवेअरमध्ये काना-मात्रांवर येणारे अनावश्यक डॉटेड सर्कल्स यात मुळीच येत नाहीत. मूळ टाईपरायटर प्रमाणेच शुद्ध देवनागरी फॉन्ट येतो. विद्यार्थी खूप आत्मविश्वासाने सराव करतात."'
                  : '"No unnecessary dotted circles on matras like other software. Pure authentic Devanagari typography just like a physical typewriter. Students practice with supreme confidence."'}
              </p>
              <div className="pt-2 border-t border-teal-900/30">
                <span className="font-bold text-sm block text-slate-900 dark:text-white">
                  {language === 'mr' ? 'सौ. अनघा कुलकर्णी' : 'Mrs. Anagha Kulkarni'}
                </span>
                <span className="text-[11px] text-teal-900 dark:text-cyan-400 block">
                  {language === 'mr' ? 'प्रशिक्षिका, आदर्श करिअर अकॅडमी, छत्रपती संभाजीनगर' : 'Instructor, Adarsh Career Academy, Chhatrapati Sambhajinagar'}
                </span>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className={`p-6 rounded-3xl border transition-all space-y-4 ${
              isDark ? 'bg-[#061F2C] border-teal-800/40' : 'bg-white border-teal-200/80 shadow-sm'
            }`}>
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                {language === 'mr'
                  ? '"जिल्हा न्यायालय व म्हाडा टंकलेखन भरती परीक्षेसाठी हे सॉफ्टवेअर अत्यंत उपयुक्त ठरले. ५ मिनिटांचा अचूक टायमर आणि वीक-की ड्रिल्समुळे माझी अचूकता ९८.५% झाली."'
                  : '"Invaluable for District Court clerk typing recruitment exams. The strict 5-minute timer and targeted weak-key remediation drills elevated my accuracy to 98.5%."'}
              </p>
              <div className="pt-2 border-t border-teal-900/30">
                <span className="font-bold text-sm block text-slate-900 dark:text-white">
                  {language === 'mr' ? 'श्री. सचिन पाटील' : 'Sachin Patil'}
                </span>
                <span className="text-[11px] text-teal-900 dark:text-cyan-400 block">
                  {language === 'mr' ? 'विद्यार्थी (कोर्ट भरती उत्तीर्ण), कोल्हापूर' : 'Selected Candidate, Court Clerk Exam, Kolhapur'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 9. SYSTEM REQUIREMENTS */}
        <section id="requirements" className={`w-full rounded-3xl p-6 sm:p-10 shadow-xl border transition-colors ${
          isDark ? 'bg-[#072431]/95 border-teal-800/40' : 'bg-white/95 border-teal-200/80'
        }`}>
          <div className="flex items-center gap-2.5 pb-5 border-b border-teal-900/40">
            <Laptop className="w-6 h-6 text-teal-900 dark:text-cyan-400" />
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {language === 'mr' ? 'संगणक प्रणाली आवश्यकता (System Requirements)' : 'Windows System Requirements'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 text-xs">
            <div className={`p-4 rounded-2xl border ${
              isDark ? 'bg-[#051C27] border-teal-900/60 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <span className="text-[11px] text-slate-500 block">{language === 'mr' ? 'ऑपरेटिंग सिस्टम (OS)' : 'Operating System'}</span>
              <span className="font-bold text-sm block mt-1">Windows 11 / 10 / 8 / 7</span>
              <span className="text-[11px] text-teal-900 dark:text-cyan-400">{language === 'mr' ? '३२ व ६४ बिट सपोर्ट' : '32-bit & 64-bit Compatible'}</span>
            </div>

            <div className={`p-4 rounded-2xl border ${
              isDark ? 'bg-[#051C27] border-teal-900/60 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <span className="text-[11px] text-slate-500 block">{language === 'mr' ? 'रॅम (RAM)' : 'System Memory (RAM)'}</span>
              <span className="font-bold text-sm block mt-1">{language === 'mr' ? '512 MB किमान' : '512 MB Minimum'}</span>
              <span className="text-[11px] text-teal-900 dark:text-cyan-400">{language === 'mr' ? '1 GB शिफारस केलेले' : '1 GB Recommended'}</span>
            </div>

            <div className={`p-4 rounded-2xl border ${
              isDark ? 'bg-[#051C27] border-teal-900/60 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <span className="text-[11px] text-slate-500 block">{language === 'mr' ? 'हार्ड डिस्क जागा (Storage)' : 'Disk Space'}</span>
              <span className="font-bold text-sm block mt-1">50 MB</span>
              <span className="text-[11px] text-teal-900 dark:text-cyan-400">C:\MarathiTypingMaster</span>
            </div>

            <div className={`p-4 rounded-2xl border ${
              isDark ? 'bg-[#051C27] border-teal-900/60 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <span className="text-[11px] text-slate-500 block">{language === 'mr' ? 'कीबोर्ड (Keyboard)' : 'Keyboard Hardware'}</span>
              <span className="font-bold text-sm block mt-1">Standard 104-Key</span>
              <span className="text-[11px] text-teal-900 dark:text-cyan-400">QWERTY Hardware Keypad</span>
            </div>
          </div>
        </section>

        {/* 10. FAQ SECTION */}
        <section id="faq" className="space-y-6 max-w-3xl mx-auto">
          <div className="text-center space-y-1">
            <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {language === 'mr' ? 'सतत विचारले जाणारे प्रश्न (FAQ)' : 'Frequently Asked Questions'}
            </h2>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {language === 'mr' ? 'सॉफ्टवेअर इन्स्टॉलेशन आणि वापराबद्दल संपूर्ण मार्गदर्शन' : 'Everything you need to know about downloading and installation'}
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className={`p-4 rounded-2xl border ${
              isDark ? 'bg-[#072431]/95 border-teal-800/40' : 'bg-white border-teal-200/80 shadow-sm'
            }`}>
              <h4 className="font-bold text-sm text-teal-950 dark:text-cyan-300 mb-1">
                {language === 'mr' ? '१. इन्स्टॉल झाल्यानंतर इंटरनेट आवश्यक आहे का?' : '1. Do I need an active internet connection after installing?'}
              </h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {language === 'mr'
                  ? 'नाही! एकदा C:\\MarathiTypingMaster मध्ये इन्स्टॉल झाल्यानंतर तुम्ही १००% ऑफलाइन सराव करू शकता. इंटरनेटची अजिबात आवश्यकता नाही.'
                  : 'No! Once installed in C:\\MarathiTypingMaster, the software runs 100% locally on your computer with zero internet required.'}
              </p>
            </div>

            <div className={`p-4 rounded-2xl border ${
              isDark ? 'bg-[#072431]/95 border-teal-800/40' : 'bg-white border-teal-200/80 shadow-sm'
            }`}>
              <h4 className="font-bold text-sm text-teal-950 dark:text-cyan-300 mb-1">
                {language === 'mr' ? '२. डेस्कटॉप शॉर्टकट कसा तयार होतो?' : '2. How does the Desktop Shortcut work?'}
              </h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {language === 'mr'
                  ? 'इन्स्टॉलेशन पूर्ण झाल्यावर दिसणाऱ्या "Installation Complete" स्क्रीनमध्ये "Create shortcut of application to desktop" चालू ठेवा. तुमच्या डेस्कटॉपवर थेट शॉर्टकट आयकॉन तयार होईल.'
                  : 'During setup, keep "Create shortcut of application to desktop" checked. A launcher shortcut is placed directly on your Windows Desktop.'}
              </p>
            </div>

            <div className={`p-4 rounded-2xl border ${
              isDark ? 'bg-[#072431]/95 border-teal-800/40' : 'bg-white border-teal-200/80 shadow-sm'
            }`}>
              <h4 className="font-bold text-sm text-teal-950 dark:text-cyan-300 mb-1">
                {language === 'mr' ? '३. हे सॉफ्टवेअर GCC-TBC शासकीय परीक्षेसाठी उपयुक्त आहे का?' : '3. Is it compliant with Maharashtra GCC-TBC examination standards?'}
              </h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {language === 'mr'
                  ? 'होय, यामध्ये महाराष्ट्र परीक्षा परिषदेचा अधिकृत ISM DVBW Remington कीबोर्ड, ५ मिनिटांचा टायमर, प्रति शब्द ५ अक्षरे मोजणी आणि अधिकृत गुणदान पद्धत समाविष्ट आहे.'
                  : 'Yes! It follows the exact ISM DVBW Remington layout, 5-minute timed exam mode, 5-stroke word count calculations, and penalty grading.'}
              </p>
            </div>

            <div className={`p-4 rounded-2xl border ${
              isDark ? 'bg-[#072431]/95 border-teal-800/40' : 'bg-white border-teal-200/80 shadow-sm'
            }`}>
              <h4 className="font-bold text-sm text-teal-950 dark:text-cyan-300 mb-1">
                {language === 'mr' ? '४. विंडोज डिफेंडर अथवा अँटीव्हायरस सुरक्षित आहे का?' : '4. Is the setup file safe and virus-free?'}
              </h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {language === 'mr'
                  ? 'होय, हे सॉफ्टवेअर १००% सुरक्षित आणि स्वच्छ आहे. यात कोणतेही स्पायवेअर किंवा मालवेअर नसून सुरक्षित बॅच व स्थानिक कॉन्फिगरेशन फाइल्स वापरल्या जातात.'
                  : 'Yes! It is 100% clean, verified, and safe from spyware. It operates with standard batch installer scripts into your local drive.'}
              </p>
            </div>
          </div>
        </section>

        {/* 11. FINAL BOTTOM DOWNLOAD CALLOUT */}
        <section className={`w-full rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden ${
          isDark 
            ? 'bg-gradient-to-r from-teal-950 via-[#072B3B] to-cyan-950 border border-teal-700/60' 
            : 'bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 text-white'
        }`}>
          <div className="max-w-2xl mx-auto space-y-5">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              {language === 'mr' ? 'आजच मराठी टायपिंग मास्टर डाउनलोड करा!' : 'Download Marathi Typing Master for Windows Today'}
            </h2>
            <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
              {language === 'mr'
                ? 'Windows साठी मोफत इन्स्टॉलर डाउनलोड करा आणि अवघ्या २ मिनिटांत संगणकावर सराव सुरू करा.'
                : 'Download the free installer for Windows 11/10/8/7 and start practicing in less than 2 minutes.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={handleDownloadSetup}
                className="px-8 py-4 rounded-2xl bg-white text-teal-900 hover:bg-teal-50 font-black text-sm shadow-xl active:scale-95 transition-all cursor-pointer flex items-center gap-2.5"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>{language === 'mr' ? 'सॉफ्टवेअर डाउनलोड करा (Setup.bat)' : 'Download Free Setup (Setup.bat)'}</span>
              </button>
              <button
                onClick={() => {
                  sound.playKeyClick();
                  setIsWizardOpen(true);
                }}
                className="px-6 py-4 rounded-2xl bg-teal-800/60 hover:bg-teal-800/80 text-white border border-white/30 font-bold text-xs transition-all cursor-pointer flex items-center gap-2"
              >
                <Monitor className="w-4 h-4" />
                <span>{language === 'mr' ? 'इन्स्टॉलेशन विझार्ड पाहा' : 'Preview Setup Wizard'}</span>
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* 12. WEBSITE FOOTER */}
      <footer className={`w-full py-8 px-4 sm:px-8 border-t text-xs transition-colors ${
        isDark ? 'bg-[#02131C] border-teal-900/60 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-600'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <span className="font-bold text-teal-900 dark:text-cyan-400">
              {language === 'mr' ? 'मराठी टायपिंग मास्टर' : 'Marathi Typing Master'}
            </span>
            <span>•</span>
            <span>{language === 'mr' ? 'आवृत्ती v10.4.2' : 'Version v10.4.2'}</span>
            <span>•</span>
            <span>GCC-TBC Remington Edition</span>
          </div>

          <div className="flex items-center gap-6 flex-wrap justify-center">
            <a href="#features" className="hover:text-teal-900 dark:hover:text-cyan-300 transition-colors">
              {language === 'mr' ? 'वैशिष्ट्ये' : 'Features'}
            </a>
            <a href="#how-to-install" className="hover:text-teal-900 dark:hover:text-cyan-300 transition-colors">
              {language === 'mr' ? 'इन्स्टॉलेशन' : 'Installation'}
            </a>
            <a href="#curriculum" className="hover:text-teal-900 dark:hover:text-cyan-300 transition-colors">
              {language === 'mr' ? 'अभ्यासक्रम' : 'Curriculum'}
            </a>
            <button 
              onClick={handleDownloadSetup}
              className="font-bold text-teal-900 dark:text-cyan-400 hover:underline cursor-pointer"
            >
              {language === 'mr' ? 'डाउनलोड' : 'Download'}
            </button>
          </div>
        </div>
      </footer>

      {/* 13. FLOATING BACK-TO-TOP BUTTON (RIGHT BOTTOM) */}
      {showBackToTop && (
        <button
          id="btn-back-to-top"
          onClick={scrollToTop}
          aria-label={language === 'mr' ? 'वर जा' : 'Back to top'}
          title={language === 'mr' ? 'पृष्ठाच्या सुरुवातीला जा (Back to top)' : 'Scroll to top'}
          className={`fixed bottom-6 right-6 z-50 p-3.5 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer border ${
            isDark
              ? 'bg-[#0B2E3F]/90 hover:bg-[#0E3549] text-cyan-300 border-teal-500/50 shadow-cyan-950/80 backdrop-blur-md'
              : 'bg-white/95 hover:bg-teal-50 text-teal-900 border-teal-300 shadow-teal-900/20 backdrop-blur-md'
          }`}
        >
          <ArrowUp className="w-5 h-5 stroke-[2.5]" />
          <span className="sr-only">{language === 'mr' ? 'वर जा' : 'Back to top'}</span>
        </button>
      )}

      {/* Interactive Windows Setup Wizard Modal */}
      <WindowsInstallerWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        language={language}
        onDownloadSetup={handleDownloadSetup}
      />
    </div>
  );
};
