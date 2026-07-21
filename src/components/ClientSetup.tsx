"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamically import all heavy non-critical floating UI components
// This pulls them entirely out of the initial SSR payload and Main Thread hydration
const PwaInstallPrompt = dynamic(() => import("@/components/ui/PwaInstallPrompt"), { ssr: false });
const PwaRegistry = dynamic(() => import("@/components/PwaRegistry"), { ssr: false });
const PushNotificationManager = dynamic(() => import("@/components/PushNotificationManager"), { ssr: false });

export default function ClientSetup({ adsenseId }: { adsenseId?: string }) {
  const [loadAds, setLoadAds] = useState(false);

  useEffect(() => {
    if (!adsenseId || loadAds) return;

    const handleInteraction = () => {
      setLoadAds(true);
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
  }, [adsenseId, loadAds]);

  useEffect(() => {
    if (loadAds && adsenseId) {
      // Inject AdSense script exactly once after user interaction
      const existingScript = document.getElementById('adsbygoogle-init');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'adsbygoogle-init';
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`;
        script.crossOrigin = "anonymous";
        script.async = true;
        document.head.appendChild(script);
      }
    }
  }, [loadAds, adsenseId]);

  return (
    <>
      <PwaInstallPrompt />
      <PwaRegistry />
      <PushNotificationManager />
    </>
  );
}
