"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Zap } from "lucide-react";
import type { Announcement, Job } from "@/lib/db";

export default function LiveTicker({ announcements, latestJobs = [] }: { announcements: Announcement[], latestJobs?: Job[] }) {
  const activeAnnouncements = announcements.filter(a => a.isActive);

  const params = useParams();
  const lang = (params?.lang as 'en' | 'hi' | 'mr') || 'en';

  const getLink = (path: string) => {
    if (path.startsWith('http') || path.startsWith(`/${lang}`)) return path;
    return `/${lang}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  // Combine manual announcements and auto jobs
  const combinedItems = [
    ...activeAnnouncements.map(a => ({
      id: a.id,
      text: typeof a.text === 'string' ? a.text : (a.text[lang] || a.text.en),
      link: getLink(a.link),
      priority: a.priority,
      isJob: false
    })),
    ...latestJobs.map(j => ({
      id: j.id,
      text: `${j.title[lang] || j.title.en} - ${j.organization[lang] || j.organization.en}`,
      link: `/${lang}/jobs/${j.slug}`,
      priority: 'normal',
      isJob: true,
      status: j.status
    }))
  ];

  if (combinedItems.length === 0) return null;

  const renderItem = (item: typeof combinedItems[0]) => (
    <span key={item.id} className="inline-flex items-center mx-8">
      {item.isJob ? (
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold mr-2 uppercase tracking-wide ${
          (item as any).status === 'Results' ? 'bg-green-500 text-white' : 
          (item as any).status === 'Admit Card' ? 'bg-orange-500 text-white' : 
          'bg-blue-500 text-white'
        }`}>
          {(item as any).status === 'Active' ? 'NEW' : (item as any).status}
        </span>
      ) : (
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2"></span>
      )}
      <Link 
        href={item.link} 
        className={`text-sm hover:underline transition-colors ${item.priority === 'high' ? 'text-yellow-400 font-bold' : 'text-gray-200'}`}
      >
        {item.text}
      </Link>
    </span>
  );

  return (
    <div className="bg-[#040D21] border-b border-gray-800 text-white py-2 overflow-hidden relative flex items-center">
      <div className="bg-[#E3342F] text-white text-xs font-bold px-3 py-1 uppercase tracking-wider absolute left-0 z-10 h-full flex items-center gap-1 shadow-[4px_0_10px_rgba(0,0,0,0.5)]">
        <Zap className="w-3.5 h-3.5 animate-pulse" /> Breaking News
      </div>
      
      {/* Ticker Animation Container */}
      <div className="flex-1 overflow-hidden ml-36 md:ml-40 relative whitespace-nowrap mask-image-edges">
        <div className="inline-block animate-marquee hover:[animation-play-state:paused]">
          {combinedItems.map(renderItem)}
          {/* Duplicate for seamless loop */}
          {combinedItems.map(item => renderItem({ ...item, id: item.id + '-dup' }))}
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
