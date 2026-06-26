import Link from "next/link";
import Script from "next/script";
import { getJobs, getSettings, getCategories } from "@/lib/db";
import JobCard from "@/components/JobCard";
import AdvancedSearch from "@/components/AdvancedSearch";
import LiveTicker from "@/components/LiveTicker";
import { 
  Briefcase, FileText, Award, CheckCircle2, GraduationCap, Building2, MapPin, 
  Landmark, Train, ShieldCheck, Shield 
} from "lucide-react";

// Lucide icon mapping
const ICON_MAP: Record<string, any> = {
  Briefcase, FileText, Award, CheckCircle2, GraduationCap, Building2, MapPin, 
  Landmark, Train, ShieldCheck, Shield
};

// Dynamic Metadata
export async function generateMetadata() {
  const settings = await getSettings();
  return {
    title: settings.seo.title,
    description: settings.seo.description,
    keywords: settings.seo.keywords,
  };
}

export default async function Home() {
  const [jobs, settings, categories] = await Promise.all([
    getJobs(),
    getSettings(),
    getCategories()
  ]);

  const quickLinks = categories.filter(c => c.isQuickLink);
  const trendingCategories = categories.filter(c => c.isTrending);

  // Helper to get top 5 jobs for a category
  const getJobsForCategory = (catName: string) => {
    return jobs.filter(j => j.category === catName).slice(0, 5);
  };

  // Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Naukri Passport",
    "url": "https://naukripassport.com", // Replace with real domain
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://naukripassport.com/jobs?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <Script
        id="schema-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Live Breaking News Ticker */}
      <LiveTicker announcements={settings.announcements} />

      <div className="min-h-screen bg-[#F4F7FA] font-sans text-gray-800">
        
        {/* Hero Section */}
        <section className="relative bg-white border-b border-gray-200 overflow-hidden pt-6 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg')] bg-no-repeat bg-center bg-cover sm:bg-contain"></div>
          
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center">
            <div className="w-full md:w-4/5 space-y-4">
              <h1 className="flex items-center flex-wrap gap-3 text-lg md:text-xl lg:text-2xl font-extrabold text-[#0B1B3D] tracking-tight">
                <span className="relative flex h-3 w-3 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                {settings.hero.title}
              </h1>
              <p className="text-gray-600 font-medium">
                {settings.hero.subtitle}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <Link href="/jobs" className="px-4 py-2 text-sm bg-[#0A58CA] text-white rounded-lg font-bold shadow-sm hover:bg-blue-700 transition">
                  Latest Jobs
                </Link>
                <button className="px-4 py-2 text-sm bg-white text-[#0B1B3D] border border-gray-300 rounded-lg font-bold hover:bg-gray-50 flex items-center gap-2 transition">
                  <span className="w-3 h-3 rounded-full border-2 border-gray-400"></span> Create Profile
                </button>
                <button className="px-4 py-2 text-sm bg-white text-[#0B1B3D] border border-gray-300 rounded-lg font-bold hover:bg-gray-50 flex items-center gap-2 transition">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gray-400" /> Check Eligibility
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 space-y-4 pb-16">
          
          <AdvancedSearch />

          {/* Quick Category Cards */}
          <div className="grid grid-cols-4 lg:grid-cols-8 gap-2">
            {quickLinks.map((cat) => {
              const Icon = ICON_MAP[cat.icon] || Briefcase;
              const count = jobs.filter(j => j.category === cat.name).length;
              return (
                <Link href={`/jobs?cat=${cat.slug}`} key={cat.id} className="bg-white rounded border border-gray-200 p-1.5 sm:p-2 text-center hover:border-[#0A58CA] hover:shadow-sm hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col items-center justify-center">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 mb-1 text-[#0A58CA]" />
                  <div className="font-bold text-gray-900 text-[9px] sm:text-[11px] mb-0.5 leading-none break-words">{cat.name}</div>
                  <div className="font-extrabold text-[10px] sm:text-xs text-gray-500 leading-none mt-0.5">{count}</div>
                </Link>
              );
            })}
          </div>

          {/* Latest Jobs Table Exact Copy */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-[0_4px_20px_rgb(0,0,0,0.04)] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <div className="flex justify-between items-center py-2.5 px-3 sm:px-4 bg-gradient-to-r from-[#002D62] to-[#0A58CA]">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-100" />
                <h2 className="text-sm sm:text-base font-bold text-white tracking-wider uppercase">Latest Government Jobs</h2>
              </div>
              <Link href="/jobs" className="text-xs font-bold text-blue-100 hover:text-white hover:underline transition-colors uppercase tracking-wider bg-white/10 px-2 py-1 rounded">View All</Link>
            </div>
            
            <div className="p-4 sm:p-5 bg-gray-50/50">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {jobs.slice(0, 9).map((job) => (
                  <JobCard 
                    key={job.id} 
                    title={job.title}
                    org={job.organization}
                    vac={job.quick_facts?.vacancies || '-'}
                    date={job.quick_facts?.last_date || '-'}
                    status={job.status}
                    statusColor={job.statusColor}
                    isLive={job.isLive}
                    isTrending={job.isTrending}
                    daysLeft={job.daysLeft}
                    link={`/jobs/${job.slug}`} 
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 4-Column Grid for Updates */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: settings.four_columns.col1_category, items: getJobsForCategory(settings.four_columns.col1_category) },
              { title: settings.four_columns.col2_category, items: getJobsForCategory(settings.four_columns.col2_category) },
              { title: settings.four_columns.col3_category, items: getJobsForCategory(settings.four_columns.col3_category) },
              { title: settings.four_columns.col4_category, items: getJobsForCategory(settings.four_columns.col4_category) }
            ].map((col, i) => {
              const catSlug = categories.find(c => c.name === col.title)?.slug || '';
              return (
                <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="bg-gradient-to-r from-[#002D62] to-[#0A58CA] py-2 px-4 flex justify-between items-center shrink-0">
                    <h3 className="font-bold text-white text-[11px] tracking-wider uppercase">{col.title || 'Category'}</h3>
                    <Link href={`/jobs?cat=${catSlug}`} className="text-[9px] font-bold text-blue-100 hover:text-white hover:underline uppercase tracking-wider bg-white/10 px-1.5 py-0.5 rounded">All</Link>
                  </div>
                  <div className="p-4 flex-grow">
                    {col.items.length === 0 ? (
                      <p className="text-sm text-gray-400 italic">No updates available.</p>
                    ) : (
                      <ul className="space-y-3">
                        {col.items.map((item, j) => (
                          <li key={j} className="flex justify-between items-start gap-2 border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                            <Link href={`/jobs/${item.slug}`} className="text-sm text-gray-700 hover:text-[#0A58CA] hover:underline leading-tight line-clamp-2">
                              {item.title}
                            </Link>
                            {item.quick_facts?.last_date && (
                              <span className="text-[10px] text-gray-400 whitespace-nowrap bg-gray-100 px-1.5 py-0.5 rounded">{item.quick_facts.last_date}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trending Categories */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-[#0B1B3D] mb-4">Trending Categories</h3>
            <div className="flex flex-wrap gap-4 justify-start items-center">
              {trendingCategories.map((item) => {
                const Icon = ICON_MAP[item.icon] || Briefcase;
                return (
                  <Link key={item.id} href={`/jobs?cat=${item.slug}`} className="flex flex-col items-center gap-2 cursor-pointer group w-[70px]">
                    <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center group-hover:border-[#0A58CA] group-hover:bg-blue-50 transition shadow-sm">
                      <Icon className="w-6 h-6 text-gray-500 group-hover:text-[#0A58CA] transition-colors" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-bold text-gray-600 group-hover:text-[#0A58CA] text-center">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Banner CTA */}
          <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-20 h-20 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 shrink-0">
                <FileText className="w-10 h-10 text-[#0A58CA]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#0B1B3D] mb-1">Confused whether you are eligible?</h3>
                <p className="text-gray-600">Create your Naukri Passport profile once and check your eligibility for every job instantly.</p>
              </div>
            </div>
            <button className="px-8 py-3 bg-[#0A58CA] text-white font-bold rounded-lg whitespace-nowrap shadow-md shadow-blue-500/20 hover:bg-blue-700 relative z-10 transition">
              Create Free Profile
            </button>
          </div>

        </main>
      </div>
    </>
  );
}
