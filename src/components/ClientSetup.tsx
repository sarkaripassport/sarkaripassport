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

    const handleInteraction = () => {
      setLoadScripts(true);
      // Clean up event listeners after first interaction
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };

    // Attach listeners for any user interaction
    window.addEventListener('scroll', handleInteraction, { passive: true });
    window.addEventListener('mousemove', handleInteraction, { passive: true });
    window.addEventListener('touchstart', handleInteraction, { passive: true });
    window.addEventListener('keydown', handleInteraction, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
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

      // 3. Inject Google Tag Manager
      if (gtmId && !document.getElementById('gtm-init')) {
        const inlineScript = document.createElement('script');
        inlineScript.id = 'gtm-init';
        inlineScript.innerHTML = `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtmId}');
        `;
        document.head.appendChild(inlineScript);
      }
    }
  }, [loadScripts, adsenseId, gaId, gtmId]);

  return (
    <>
      <PwaInstallPrompt />
      <PwaRegistry />
      <PushNotificationManager />
    </>
  );
}

