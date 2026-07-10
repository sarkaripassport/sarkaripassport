"use client";

import { useEffect, useState } from "react";

export default function LiveTimestamp({ initialTimestamp }: { initialTimestamp: string }) {
  const [timestamp, setTimestamp] = useState(initialTimestamp);

  useEffect(() => {
    // For SEO and fresh appearance, always show the current time or a very recent time
    // on the client-side so it appears dynamically updated to the minute.
    const now = new Date();
    const formatted = now.toLocaleString('en-IN', { 
      timeZone: 'Asia/Kolkata', 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });
    setTimestamp(formatted);

    // Optional: update every minute so it stays live while user is on the page
    const interval = setInterval(() => {
      const live = new Date();
      setTimestamp(live.toLocaleString('en-IN', { 
        timeZone: 'Asia/Kolkata', 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      }));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return <span suppressHydrationWarning>{timestamp}</span>;
}
