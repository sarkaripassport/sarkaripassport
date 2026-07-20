"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

interface AdSenseUnitProps {
  slotId?: string;
  className?: string;
  format?: "auto" | "fluid" | "rectangle";
  responsive?: boolean;
}

export default function AdSenseUnit({ 
  slotId, 
  className = "my-6", 
  format = "auto",
  responsive = true
}: AdSenseUnitProps) {
  const pathname = usePathname();

  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, [pathname]);

  // If no specific slot is provided, we render a highly-optimized reserved space
  // to prevent CLS (Cumulative Layout Shift) when Auto Ads injects an ad here.
  return (
    <div className={`w-full overflow-hidden flex items-center justify-center bg-gray-50/50 rounded-lg relative ${className}`}>
      {/* Fallback Placeholder (Hidden when Ad loads over it) */}
      <span className="absolute text-gray-300 text-[10px] font-bold uppercase tracking-widest pointer-events-none">
        Advertisement
      </span>
      
      {/* Actual AdSense Tag */}
      <ins
        className="adsbygoogle block w-full relative z-10"
        style={{ display: "block", minHeight: "250px" }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // This will be overriden by their global script if they use AutoAds
        data-ad-slot={slotId || "auto-ad-slot"}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
