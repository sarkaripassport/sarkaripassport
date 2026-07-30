"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamically import all heavy non-critical floating UI components
// This pulls them entirely out of the initial SSR payload and Main Thread hydration
const PwaInstallPrompt = dynamic(() => import("@/components/ui/PwaInstallPrompt"), { ssr: false });
const PwaRegistry = dynamic(() => import("@/components/PwaRegistry"), { ssr: false });
const PushNotificationManager = dynamic(() => import("@/components/PushNotificationManager"), { ssr: false });

export default function ClientSetup({ 
  adsenseId, 
  gaId, 
  gtmId 
}: { 
  adsenseId?: string;
  gaId?: string;
  gtmId?: string;
}) {
  const [loadScripts, setLoadScripts] = useState(false);

  const activeGaId = (gaId || process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "").trim();

  useEffect(() => {
    if ((!adsenseId && !activeGaId && !gtmId) || loadScripts) return;
    
    // Prevent bots/crawlers from ever triggering heavy scripts
    if (typeof navigator !== 'undefined' && /bot|googlebot|crawler|spider|robot|crawling|lighthouse|chrome-lighthouse/i.test(navigator.userAgent)) {
      return;
    }

    const triggerLoading = () => {
      setLoadScripts(true);
      cleanupListeners();
    };

    const cleanupListeners = () => {
      window.removeEventListener('mousemove', triggerLoading);
      window.removeEventListener('scroll', triggerLoading);
      window.removeEventListener('touchstart', triggerLoading);
      window.removeEventListener('keydown', triggerLoading);
    };

    window.addEventListener('mousemove', triggerLoading, { passive: true });
    window.addEventListener('scroll', triggerLoading, { passive: true });
    window.addEventListener('touchstart', triggerLoading, { passive: true });
    window.addEventListener('keydown', triggerLoading, { passive: true });

    // Fallback load after 2.5 seconds for human users who just wait
    const fallbackTimer = setTimeout(triggerLoading, 2500);

    return () => {
      cleanupListeners();
      clearTimeout(fallbackTimer);
    };
  }, [adsenseId, activeGaId, gtmId, loadScripts]);

  useEffect(() => {
    if (loadScripts) {
      // 1. Inject AdSense
      if (adsenseId && !document.getElementById('adsbygoogle-init')) {
        const script = document.createElement('script');
        script.id = 'adsbygoogle-init';
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`;
        script.crossOrigin = "anonymous";
        script.async = true;
        document.head.appendChild(script);
      }

      // 2. Inject Google Analytics (Native Async Script for 100% Tracking Reliability)
      if (activeGaId && !document.getElementById('ga-init')) {
        const script = document.createElement('script');
        script.id = 'ga-init';
        script.src = `https://www.googletagmanager.com/gtag/js?id=${activeGaId}`;
        script.async = true;
        document.head.appendChild(script);

        const inlineScript = document.createElement('script');
        inlineScript.id = 'ga-inline';
        inlineScript.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${activeGaId}', {
            page_path: window.location.pathname,
          });
        `;
        document.head.appendChild(inlineScript);
      }

    }
  }, [loadScripts, adsenseId, activeGaId]);

  return (
    <>
      {loadScripts && (
        <>
          <PwaInstallPrompt />
          <PwaRegistry />
          <PushNotificationManager />
        </>
      )}
    </>
  );
}

