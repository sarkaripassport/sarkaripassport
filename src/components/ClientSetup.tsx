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
    if (!adsenseId || loadScripts) return;

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

    // Fallback load after 2 seconds
    const fallbackTimer = setTimeout(triggerLoading, 2000);

    return () => {
      cleanupListeners();
      clearTimeout(fallbackTimer);
    };
  }, [adsenseId, loadScripts]);

  useEffect(() => {
    if (loadScripts) {
      // Inject AdSense
      if (adsenseId && !document.getElementById('adsbygoogle-init')) {
        const script = document.createElement('script');
        script.id = 'adsbygoogle-init';
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`;
        script.crossOrigin = "anonymous";
        script.async = true;
        document.head.appendChild(script);
      }
    }
  }, [loadScripts, adsenseId]);


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

