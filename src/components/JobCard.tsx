import Link from "next/link";
import Image from "next/image";
import { Briefcase, Clock, Flame, ChevronRight, FileText, MapPin, GraduationCap, Building2 } from "lucide-react";
import { Locale } from "@/i18n/getDictionary";
import ShareButton from "./ShareButton";

interface JobCardProps {
  title: string;
  org: string;
  qual?: string;
  vac: string;
  date: string;
  status: string;
  statusColor?: string;
  isLive?: boolean;
  isTrending?: boolean;
  daysLeft?: number;
  link?: string;
  lang?: Locale;
  logoUrl?: string;
  logoAlt?: string;
  labels?: {
    trending: string;
    daysLeft: string;
    lastDate: string;
    details: string;
    applyNow: string;
  };
  priority?: boolean;
}

export default function JobCard({
  title,
  org,
  qual,
  vac,
  date,
  status,
  statusColor = "text-green-700 bg-green-50 border-green-200",
  isLive = false,
  isTrending = false,
  daysLeft,
  link = "#",
  lang = "en",
  logoUrl,
  logoAlt,
  priority = false,
  labels = {
    trending: "Trending",
    daysLeft: "Days Left",
    lastDate: "Last Date",
    details: "Details",
    applyNow: "Apply Now"
  }
}: JobCardProps) {
  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(10,88,202,0.15)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col h-full overflow-hidden gpu-accelerated">
      
      {/* Top Gradient Accent */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#0A58CA] via-blue-400 to-cyan-400 opacity-80 group-hover:opacity-100 transition-opacity"></div>

      {/* Main Content Area */}
      <div className="p-4 flex-grow flex flex-col relative z-10 bg-white/50 backdrop-blur-sm">
        
        {/* Header Row: Badges & Timer */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap gap-2">
            {isTrending && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest border border-orange-100 shadow-sm">
                <Flame className="w-3.5 h-3.5" /> {labels.trending}
              </span>
            )}
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border ${statusColor}`}>
              {isLive && (
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500 mr-1.5 shrink-0 shadow-[0_0_6px_rgba(34,197,94,0.6)]"></span>
              )}
              {status}
            </span>
          </div>
          
          {daysLeft !== undefined && daysLeft <= 5 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest border border-red-100 shadow-sm whitespace-nowrap animate-pulse">
              <Clock className="w-3 h-3" /> {daysLeft} {labels.daysLeft}
            </span>
          )}
        </div>

        {/* Title and Logo */}
        <div className="flex gap-3 items-start mb-3">
          {logoUrl && logoUrl.replace(/['"]/g, '').trim().startsWith("http") ? (
            <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-300 relative">
              <Image 
                src={logoUrl.replace(/['"]/g, '').trim()} 
                alt={logoAlt || `${org} logo`} 
                fill 
                priority={priority} 
                fetchPriority={priority ? "high" : "auto"}
                unoptimized={true}
                className="object-contain p-0.5" 
                sizes="(max-width: 768px) 64px, 80px" 
              />
            </div>
          ) : (
            <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl shadow-sm flex items-center justify-center text-blue-600 font-bold text-2xl group-hover:scale-105 transition-transform duration-300">
              {org.charAt(0)}
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-[#0B1B3D] text-base leading-tight mb-1 line-clamp-2 group-hover:text-[#0A58CA] transition-colors">
              <Link href={link} className="focus:outline-none before:absolute before:inset-0">
                {title}
              </Link>
            </h3>
            <p className="text-gray-500 text-[11px] font-bold truncate flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              {org}
            </p>
          </div>
        </div>

        {/* Quick Facts Grid */}
        <div className="grid grid-cols-2 gap-2 mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-gray-50 flex items-center justify-center border border-gray-100">
              <GraduationCap className="w-3 h-3 text-gray-500" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Education</p>
              <p className="text-[11px] font-black text-[#0B1B3D] truncate">{qual || '-'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-gray-50 flex items-center justify-center border border-gray-100">
              <FileText className="w-3 h-3 text-gray-500" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Posts</p>
              <p className="text-[11px] font-black text-[#0B1B3D] truncate">{vac}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Area */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex items-center justify-between relative z-10 group-hover:bg-[#0A58CA]/5 transition-colors">
        <div>
          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">{labels.lastDate}</p>
          <p className="text-xs font-black text-red-600 group-hover:text-red-700 transition-colors">{date}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative z-20">
            <ShareButton 
              title={title} 
              text={`Check out this job at ${org}`} 
              url={`https://govjobwala.com${link}`} 
              label="" 
              className="p-1.5 rounded-lg text-gray-400 hover:text-[#0A58CA] hover:bg-white border border-transparent hover:border-gray-200"
            />
          </div>
          <Link 
            href={link}
            className="relative z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-[11px] font-bold text-gray-500 group-hover:bg-[#0A58CA] group-hover:border-[#0A58CA] group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#0A58CA] focus:ring-offset-2"
          >
            {labels.details} <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
      
    </div>
  );
}
