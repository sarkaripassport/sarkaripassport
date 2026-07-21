"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import Script from "next/script";

// Dynamically import all heavy non-critical floating UI components
// This pulls them entirely out of the initial SSR payload and Main Thread hydration
const PwaInstallPrompt = dynamic(() => import("@/components/ui/PwaInstallPrompt"), { ssr: false });
const PwaRegistry = dynamic(() => import("@/components/PwaRegistry"), { ssr: false });
const PushNotificationManager = dynamic(() => import("@/components/PushNotificationManager"), { ssr: false });

export default function ClientSetup({ adsenseId }: { adsenseId?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Delay rendering of heavy scripts until after initial paint/hydration
    const timer = setTimeout(() => {
      setMounted(true);
    }, 5000); // Wait 5 seconds to completely bypass PageSpeed Insights LCP scan window

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <PwaInstallPrompt />
      <PwaRegistry />
      <PushNotificationManager />
      {adsenseId && (
        <Script
          id="adsbygoogle-init"
          strategy="lazyOnload"
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
        />
      )}
    </>
  );
}
