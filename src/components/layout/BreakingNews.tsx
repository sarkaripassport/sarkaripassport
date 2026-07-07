import { getJobs, getSettings } from '@/lib/db';
import Link from 'next/link';

export default async function BreakingNews({ lang }: { lang: 'en' | 'hi' | 'mr' }) {
  const [jobs, settings] = await Promise.all([
    getJobs(),
    getSettings()
  ]);
  
  // 1. Get Custom Admin Announcements
  const activeAnnouncements = (settings.announcements || []).filter(a => a.isActive);
  
  const getLink = (path: string) => {
    if (path.startsWith('http') || path.startsWith(`/${lang}`)) return path;
    return `/${lang}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const manualNews = activeAnnouncements.map(a => ({
    id: a.id,
    text: typeof a.text === 'string' ? a.text : (a.text[lang] || a.text.en),
    link: getLink(a.link),
    isJob: false,
    priority: a.priority,
    status: ''
  }));

  // 2. Get Trending Jobs (or latest 5 fallback)
  let newsJobs = jobs.filter(j => j.isTrending);
  if (newsJobs.length === 0) {
    newsJobs = jobs.slice(0, 5);
  } else {
    newsJobs = newsJobs.slice(0, 5);
  }

  const automatedNews = newsJobs.map(j => ({
    id: j.id,
    text: `${j.title[lang]} - ${j.quick_facts?.vacancies || 'Notification Out'}`,
    link: `/${lang}/jobs/${j.slug}`,
    isJob: true,
    priority: 'normal',
    status: j.status
  }));

  // Combine them
  const combinedItems = [...manualNews, ...automatedNews];

  if (combinedItems.length === 0) return null;

  return (
    <div className="bg-[#0B1B3D] text-white flex items-center h-10 border-b border-[#1E3A8A] overflow-hidden text-sm relative z-40">
      <div className="bg-red-600 text-white font-black px-3 md:px-6 h-full flex items-center justify-center shrink-0 shadow-[4px_0_10px_rgba(0,0,0,0.5)] z-10 text-xs md:text-sm tracking-wider">
        <span className="relative flex h-2 w-2 mr-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
        BREAKING NEWS
      </div>
      <div 
        className="flex-1 overflow-hidden relative h-full flex items-center"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)'
        }}
      >
        {/* We duplicate the content to make the marquee seamless */}
        <div className="flex whitespace-nowrap animate-[marquee_30s_linear_infinite] hover:[animation-play-state:paused] w-max items-center">
          {[...combinedItems, ...combinedItems, ...combinedItems].map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="flex items-center ml-8 md:ml-12">
              {item.isJob ? (
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold mr-2 uppercase tracking-wide shrink-0 ${
                  item.status === 'Results' ? 'bg-green-500 text-white' : 
                  item.status === 'Admit Card' ? 'bg-orange-500 text-white' : 
                  'bg-blue-500 text-white'
                }`}>
                  {item.status === 'Active' ? 'NEW' : item.status}
                </span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-blue-400 mr-2 shrink-0 animate-pulse"></span>
              )}
              <Link 
                href={item.link} 
                className={`hover:text-blue-300 transition-colors hover:underline ${item.priority === 'high' ? 'text-yellow-300 font-black' : 'font-bold'}`}
              >
                {item.text}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
