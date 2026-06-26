"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import type { Announcement } from "@/lib/db";

export default function LiveTicker({ announcements }: { announcements: Announcement[] }) {
  const activeAnnouncements = announcements.filter(a => a.isActive);

  if (activeAnnouncements.length === 0) return null;

  return (
    <div className="bg-[#040D21] border-b border-gray-800 text-white py-2 overflow-hidden relative flex items-center">
      <div className="bg-[#E3342F] text-white text-xs font-bold px-3 py-1 uppercase tracking-wider absolute left-0 z-10 h-full flex items-center gap-1 shadow-[4px_0_10px_rgba(0,0,0,0.5)]">
        <Zap className="w-3.5 h-3.5 animate-pulse" /> Breaking News
      </div>
      
      {/* Ticker Animation Container */}
      <div className="flex-1 overflow-hidden ml-36 md:ml-40 relative whitespace-nowrap mask-image-edges">
        <div className="inline-block animate-marquee hover:[animation-play-state:paused]">
          {activeAnnouncements.map((ann, i) => (
            <span key={ann.id} className="inline-flex items-center mx-8">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2"></span>
              <Link 
                href={ann.link} 
                className={`text-sm hover:underline transition-colors ${ann.priority === 'high' ? 'text-yellow-400 font-bold' : 'text-gray-200'}`}
              >
                {ann.text}
              </Link>
            </span>
          ))}
          {/* Duplicate for seamless loop */}
          {activeAnnouncements.map((ann, i) => (
            <span key={ann.id + '-dup'} className="inline-flex items-center mx-8">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2"></span>
              <Link 
                href={ann.link} 
                className={`text-sm hover:underline transition-colors ${ann.priority === 'high' ? 'text-yellow-400 font-bold' : 'text-gray-200'}`}
              >
                {ann.text}
              </Link>
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        .mask-image-edges {
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}</style>
    </div>
  );
}
