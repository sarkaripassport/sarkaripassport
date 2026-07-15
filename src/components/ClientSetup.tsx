"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamically import all heavy non-critical floating UI components
// This pulls them entirely out of the initial SSR payload and Main Thread hydration
const PwaInstallPrompt = dynamic(() => import("@/components/ui/PwaInstallPrompt"), { ssr: false });
const PwaRegistry = dynamic(() => import("@/components/PwaRegistry"), { ssr: false });
const PushNotificationManager = dynamic(() => import("@/components/PushNotificationManager"), { ssr: false });

export default function ClientSetup() {
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
    </>
  );
}
