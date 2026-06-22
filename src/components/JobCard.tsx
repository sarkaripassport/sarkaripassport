import Link from "next/link";
import { Briefcase, Clock, Flame, ChevronRight, FileText } from "lucide-react";

interface JobCardProps {
  title: string;
  org: string;
  qual?: string; // Kept for backward compatibility, unused
  vac: string;
  date: string;
  status: string;
  statusColor?: string;
  isLive?: boolean;
  isTrending?: boolean;
  daysLeft?: number;
  link?: string;
}

export default function JobCard({
  title,
  org,
  vac,
  date,
  status,
  statusColor = "text-green-800 bg-green-100 border border-green-200",
  isLive = false,
  isTrending = false,
  daysLeft,
  link = "#",
}: JobCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden flex flex-col h-full">
      
      {/* Top Accent Line */}
      <div className="h-1 w-full bg-gradient-to-r from-[#0A58CA] to-blue-400 absolute top-0 left-0"></div>

      <div className="p-3 sm:p-4 flex-grow flex flex-col">
        
        {/* Badges Row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex flex-wrap gap-2">
            {isTrending && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-orange-50 text-orange-600 text-[9px] font-extrabold uppercase tracking-wider border border-orange-100">
                <Flame className="w-3 h-3" /> Trending
              </span>
            )}
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${statusColor}`}>
              {isLive && (
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-600"></span>
                </span>
              )}
              {status}
            </span>
          </div>
          
          {daysLeft !== undefined && daysLeft <= 5 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-50 text-red-600 text-[9px] font-extrabold uppercase tracking-wider border border-red-100 whitespace-nowrap">
              <Clock className="w-3 h-3" /> {daysLeft} Days Left
            </span>
          )}
        </div>

        {/* Title, Org & Vacancies */}
        <div className="mt-1 mb-2">
          <Link href={link} className="group-hover:text-[#0A58CA] transition-colors">
            <h3 className="font-extrabold text-[#0B1B3D] text-[15px] sm:text-base leading-snug mb-1.5 line-clamp-2">
              {title}
            </h3>
          </Link>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
            <p className="text-[11px] font-semibold text-gray-500 flex items-center gap-1.5">
              <Building2Icon className="w-3.5 h-3.5 text-gray-400" />
              {org}
            </p>
            <p className="text-[11px] font-semibold text-gray-500 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-gray-400" />
              {vac} Posts
            </p>
          </div>
        </div>

      </div>

      {/* Footer / Actions */}
      <div className="border-t border-gray-100 p-3 sm:p-4 bg-gray-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 mt-auto">
        <div className="flex items-center gap-2 text-xs w-full sm:w-auto justify-between sm:justify-start">
          <span className="text-gray-500 font-medium">Last Date:</span>
          <span className="font-extrabold text-red-600">{date}</span>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link 
            href={link} 
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-[#0A58CA] bg-white border border-blue-200 rounded-md shadow-sm hover:bg-blue-50 transition-colors whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5" /> Details
          </Link>
          <Link 
            href={link} 
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-1.5 text-[11px] font-bold text-white bg-gradient-to-b from-[#0A58CA] to-blue-700 border border-blue-800 rounded-md shadow-sm hover:shadow-md transition-all whitespace-nowrap"
          >
            Apply Now <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
      
    </div>
  );
}

// Just a quick helper icon to avoid an extra import above
function Building2Icon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}
