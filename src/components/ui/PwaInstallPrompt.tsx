"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import Image from "next/image";

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if it's already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return;
    }

    // Check if it's iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    // eslint-disable-next-line
    setIsIOS(isIosDevice);

    // If iOS and not in standalone mode, we can show a custom prompt, but we shouldn't show it every time if they dismissed it
    const hasDismissed = localStorage.getItem("pwa-prompt-dismissed-v2");
    
    if (isIosDevice && !hasDismissed) {
      // Small delay so it doesn't pop up instantly on load
      setTimeout(() => setShowPrompt(true), 3000);
    }

    // Handle Android/Chrome beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!hasDismissed) {
        setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for 7 days
    localStorage.setItem("pwa-prompt-dismissed-v2", "true");
    setTimeout(() => {
      localStorage.removeItem("pwa-prompt-dismissed-v2");
    }, 7 * 24 * 60 * 60 * 1000);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-5 duration-300 md:hidden">
      <div className="bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border border-gray-100 p-4 flex items-center gap-4">
        
        <div className="w-12 h-12 shrink-0 bg-blue-50 rounded-xl flex items-center justify-center p-2 relative overflow-hidden">
          <Image src="/logo.svg" alt="GovJobWala App" fill className="object-contain p-1" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-[#0B1B3D] text-sm truncate">Install GovJobWala App</h3>
          <p className="text-[10px] text-gray-500 leading-tight mt-0.5">
            {isIOS 
              ? "Tap Share \u2191 then 'Add to Home Screen' for instant access." 
              : "Get instant access to government jobs directly from your home screen."}
          </p>
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <button 
            onClick={handleDismiss} 
            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
          
          {!isIOS && (
            <button
              onClick={handleInstallClick}
              className="mt-2 bg-[#0A58CA] hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Install
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
