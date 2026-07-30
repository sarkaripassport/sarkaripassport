"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTopOnMount() {
  const pathname = usePathname();

  useEffect(() => {
    // Prevent default scroll restoration jumping to bottom
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, [pathname]);

  return null;
}
