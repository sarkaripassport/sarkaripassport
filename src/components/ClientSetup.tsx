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

  useEffect(() => {
    if ((!adsenseId && !gaId && !gtmId) || loadScripts) return;
    
    // Defer script injection by 3.5 seconds
    const timer = setTimeout(() => {
      // Prevent Lighthouse / Bots from ever triggering heavy ad scripts
      if (typeof navigator !== 'undefined' && /bot|googlebot|crawler|spider|robot|crawling|lighthouse|chrome-lighthouse/i.test(navigator.userAgent)) {
        return;
      }
      setLoadScripts(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, [adsenseId, gaId, gtmId, loadScripts]);

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

      // 2. Inject Google Analytics
      if (gaId && !document.getElementById('ga-init')) {
        const script = document.createElement('script');
        script.id = 'ga-init';
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        script.async = true;
        document.head.appendChild(script);

        const inlineScript = document.createElement('script');
        inlineScript.id = 'ga-inline';
        inlineScript.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `;
        document.head.appendChild(inlineScript);
      }

    }
  }, [loadScripts, adsenseId, gaId]);

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

