"use client";

import { useEffect, useState } from "react";

export default function LiveTimestamp({ initialTimestamp }: { initialTimestamp: string }) {
  const [timestamp, setTimestamp] = useState(initialTimestamp);

  useEffect(() => {
    const fetchLatestTime = async () => {
      try {
        const res = await fetch('/api/latest-update', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.timestamp) {
            const formatted = new Date(data.timestamp).toLocaleString('en-IN', { 
              timeZone: 'Asia/Kolkata', 
              day: '2-digit', 
              month: 'short', 
              year: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit', 
              hour12: true 
            });
            setTimestamp(formatted);
          }
        }
      } catch (e) {
        console.error("Failed to fetch latest update time", e);
      }
    };

    fetchLatestTime();
  }, []);

  return <span>{timestamp}</span>;
}
