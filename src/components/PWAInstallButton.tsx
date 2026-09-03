import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../utils/usePWAInstall';
import { useTheme } from '../context/ThemeContext';

interface PWAInstallButtonProps {
  language?: 'mr' | 'en';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ language = 'mr' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { isDark } = useTheme();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  // If already running as an installed PWA, render a clean badge or hide
  if (isInstalled) {
    return (
      <div 
        id="pwa-installed-badge"
        className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold border transition-colors ${
          isDark 
            ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-400' 
            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
        }`}
        title={language === 'mr' ? 'ॲप इन्स्टॉल केले आहे' : 'App installed on device'}
      >
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>{language === 'mr' ? 'इन्स्टॉल केले आहे' : 'Desktop App'}</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setJustInstalled(true);
      setTimeout(() => setJustInstalled(false), 4000);
    }
  };

  // Chromium / Android / Edge / Desktop flow
  if (isInstallable) {
    return (
      <button
        id="btn-install-pwa"
        onClick={handleInstallClick}
        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 shadow-md shadow-teal-500/20 active:scale-95 transition-all cursor-pointer"
        title={language === 'mr' ? 'डेस्कटॉप किंवा मोबाईलवर ॲप इन्स्टॉल करा' : 'Install App on Desktop or Mobile'}
      >
        <Download className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>{language === 'mr' ? 'ॲप इन्स्टॉल करा' : 'Install App'}</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          id="btn-install-ios"
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
            isDark 
              ? 'bg-[#0b3142]/80 hover:bg-[#0f4056] border-teal-700/50 text-teal-300' 
              : 'bg-teal-50 hover:bg-teal-100 border-teal-200 text-teal-800'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>{language === 'mr' ? 'iOS इन्स्टॉल' : 'Install iOS'}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className={`w-full max-w-sm rounded-2xl p-6 shadow-2xl border transition-colors ${
              isDark ? 'bg-[#072431] border-teal-700/60 text-slate-100' : 'bg-white border-teal-200 text-slate-900'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-teal-900/40">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-teal-400" />
                  <h3 className="text-sm font-bold">
                    {language === 'mr' ? 'iPhone / iPad वर इन्स्टॉल करा' : 'Install on iPhone / iPad'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg hover:bg-slate-800/40 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-xs leading-relaxed text-slate-300 dark:text-slate-300">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                  <p>
                    {language === 'mr'
                      ? 'Safari ब्राउझरमधील खालील Share बटनावर (चौकोनातील बाण) टॅप करा.'
                      : 'Tap the Share icon in Safari’s bottom toolbar.'}
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                  <p>
                    {language === 'mr'
                      ? 'खाली स्क्रोल करा आणि "Add to Home Screen" (होम स्क्रीनवर जोडा) वर टॅप करा.'
                      : 'Scroll down and tap "Add to Home Screen".'}
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                  <p>
                    {language === 'mr'
                      ? 'वर उजवीकडे "Add" वर क्लिक करा. ॲप तुमच्या स्क्रीनवर तयार होईल.'
                      : 'Tap "Add" in the top right corner.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs cursor-pointer transition-colors"
              >
                {language === 'mr' ? 'समजले' : 'Got it'}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
