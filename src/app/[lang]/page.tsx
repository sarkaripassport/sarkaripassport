import Link from "next/link";
import Script from "next/script";
import { getJobs, getSettings, getCategories, getPublishedJobs } from "@/lib/db";
import { getSeoAlternates } from "@/lib/seo";
import JobCard from "@/components/JobCard";
import CategoryGrid from "@/components/ui/CategoryGrid";
import CategoryIcon from "@/components/ui/CategoryIcon";
import AdvancedSearch from "@/components/AdvancedSearch";

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'hi' }, { lang: 'mr' }];
}
import { 
  Briefcase, FileText, Award, CheckCircle2, GraduationCap, Building2, MapPin, 
  Landmark, Train, ShieldCheck, Shield 
} from "lucide-react";

// Lucide icon mapping
const ICON_MAP: Record<string, any> = {
  Briefcase, FileText, Award, CheckCircle2, GraduationCap, Building2, MapPin, 
  Landmark, Train, ShieldCheck, Shield
};

import { getDictionary, Locale } from "@/i18n/getDictionary";

// Dynamic Metadata
export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const settings = await getSettings();
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';
  return {
    title: settings.seo.title[lang],
    description: settings.seo.description[lang],
    keywords: settings.seo.keywords[lang],
    alternates: getSeoAlternates(lang, '/'),
  };
}

export const revalidate = 3600;

export default async function Home({ params }: { params: Promise<{ lang: Locale }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';
  const dict = await getDictionary(lang);
  
  const [jobs, settings, categories] = await Promise.all([
    getPublishedJobs(),
    getSettings(),
    getCategories()
  ]);

  const getCount = (catName: string) => jobs.filter(j => j.category === catName || j.categories?.includes(catName)).length;
  
  const quickLinks = categories.filter(c => c.isQuickLink).sort((a, b) => getCount(b.name.en) - getCount(a.name.en));
  const trendingCategories = categories.filter(c => c.isTrending).sort((a, b) => getCount(b.name.en) - getCount(a.name.en));
  const regularCategories = categories.filter(c => !c.isTrending && !c.isQuickLink).sort((a, b) => getCount(b.name.en) - getCount(a.name.en));
  const specialSlugs = ['results', 'admit-card', 'answer-key', 'syllabus', 'admission'];

  const getCategoryUrl = (slug: string) => {
    const cleanSlug = slug.toLowerCase().replace(/s$/, ''); // singularize
    if (cleanSlug === 'result') return `/${lang}/results`;
    if (cleanSlug === 'admit-card') return `/${lang}/admit-card`;
    if (cleanSlug === 'answer-key') return `/${lang}/answer-key`;
    if (cleanSlug === 'syllabus') return `/${lang}/syllabus`;
    if (cleanSlug === 'admission') return `/${lang}/admission`;
    return `/${lang}/category/${slug}`;
  };

  const isCategoryNew = (catName: string) => {
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - 48);
    return jobs.some(j => 
      (j.category === catName || j.categories?.includes(catName)) && 
      new Date(j.created_at).getTime() >= cutoff.getTime()
    );
  };

  // Helper to get top 15 jobs for a category with dual sorting
  const getJobsForCategory = (catName: string) => {
    const cleanCatName = catName?.toLowerCase().replace(/[^a-z0-9]+/g, '').replace(/s$/, '');
    return jobs
      .filter(j => {
        const jobCat = j.category?.toLowerCase().replace(/[^a-z0-9]+/g, '').replace(/s$/, '');
        const inJobCats = j.categories?.some(c => c.toLowerCase().replace(/[^a-z0-9]+/g, '').replace(/s$/, '') === cleanCatName);
        return jobCat === cleanCatName || inJobCats;
      })
      .sort((a, b) => {
        if (catName === 'Latest Jobs') {
          // Latest Jobs strict chronological sort
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        // Others bump to top based on updated_at
        return new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime();
      })
      .slice(0, 5);
  };

  // Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "GovJobWala",
    "url": "https://govjobwala.com", // Replace with real domain
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://govjobwala.com/jobs?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  // Get top 5 latest active jobs for the live ticker
  const latestLiveJobs = jobs
    .filter(j => j.isLive)
    .sort((a, b) => new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime())
    .slice(0, 5);

  return (
    <>
      <Script
        id="schema-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      


      <div className="w-full space-y-2 md:space-y-4">
        {/* Hero Section */}
        <section className="relative bg-white border-b border-gray-200 overflow-hidden py-2 md:py-3 px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center">
            <div className="w-full md:w-4/5 space-y-2 md:space-y-4">
              <div className="flex items-center gap-1.5 text-[#0A58CA] font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-1 md:mb-2">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> India's Trusted Government Job Portal
                <span className="relative flex h-2.5 w-2.5 shrink-0 ml-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <span className="text-[9px] text-green-600 font-black ml-1 uppercase">Live</span>
              </div>
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-[#0B1B3D] tracking-tight leading-snug">
                {settings.hero.title[lang]}
              </h1>
              <p className="text-gray-600 font-medium">
                {settings.hero.subtitle[lang]}
              </p>
              <div className="flex flex-wrap gap-4 pt-2 items-center">
                <Link href={`/${lang}/jobs`} className="px-4 py-2 text-sm bg-[#0A58CA] text-white rounded-lg font-bold shadow-sm hover:bg-blue-700 transition">
                  {dict.navigation.latestJobs}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-1 relative z-20 space-y-2 md:space-y-4 pb-16">
          
          {/* Above-the-fold Interactive Widgets (Deferred Client-Side) */}
          <div className="w-full z-10 mt-2 lg:mt-3 flex flex-col md:flex-row gap-2 items-stretch">
            <AdvancedSearch lang={lang} categories={categories} />
          </div>

          {/* Elite Premium Categories Dashboard */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 mt-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-4 mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#0B1B3D] flex items-center gap-2">
                  <span className="w-2.5 h-6 bg-[#0A58CA] rounded-full inline-block"></span>
                  Sarkari Job Portals & Categories
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Explore active recruitment portals, qualifications, and department sectors.</p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Live Updates Active
              </span>
            </div>

            <div className="space-y-8">
              {/* 1. Main Career Gateways */}
              <div>
                <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span>Primary Gateways</span>
                  <span className="flex-grow h-px bg-gray-100"></span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {quickLinks.map((cat) => {
                    const count = jobs.filter(j => j.category === cat.name.en || j.categories?.includes(cat.name.en)).length;
                    const hasNew = isCategoryNew(cat.name.en);
                    return (
                      <Link 
                        href={getCategoryUrl(cat.slug)} 
                        key={cat.id} 
                        className="relative bg-gradient-to-b from-white to-gray-50/50 rounded-xl border border-gray-200 p-3 text-center hover:border-[#0A58CA] hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center group h-[100px]"
                      >
                        {hasNew && (
                          <span className="absolute top-2 right-2 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                          </span>
                        )}
                        <div className="mb-2 p-1.5 bg-blue-50 text-[#0A58CA] rounded-lg transition-transform group-hover:scale-110 group-hover:bg-blue-100">
                          <CategoryIcon name={cat.icon || 'Briefcase'} className="w-6 h-6" />
                        </div>
                        <div className="font-extrabold text-gray-900 text-xs sm:text-[13px] leading-tight break-words group-hover:text-[#0A58CA] transition-colors">{cat.name[lang]}</div>
                        <div className="font-extrabold text-[10px] text-gray-500 mt-1 bg-gray-100 px-2 py-0.5 rounded-full group-hover:bg-blue-50 group-hover:text-blue-700 transition-all">{count} active</div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* 2. Sector Pathways */}
              <div>
                <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span>Trending Job Sectors</span>
                  <span className="flex-grow h-px bg-gray-100"></span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {trendingCategories.map((cat) => {
                    const count = jobs.filter(j => j.category === cat.name.en || j.categories?.includes(cat.name.en)).length;
                    const hasNew = isCategoryNew(cat.name.en);
                    return (
                      <Link 
                        href={getCategoryUrl(cat.slug)} 
                        key={cat.id} 
                        className="relative bg-gradient-to-b from-white to-gray-50/50 rounded-xl border border-gray-200 p-3 text-center hover:border-emerald-500 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center group h-[100px]"
                      >
                        {hasNew && (
                          <span className="absolute top-2 right-2 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                          </span>
                        )}
                        <div className="mb-2 p-1.5 bg-emerald-50 text-emerald-600 rounded-lg transition-transform group-hover:scale-110 group-hover:bg-emerald-100">
                          <CategoryIcon name={cat.icon || 'Shield'} className="w-6 h-6" />
                        </div>
                        <div className="font-extrabold text-gray-900 text-xs sm:text-[13px] leading-tight break-words group-hover:text-emerald-600 transition-colors">{cat.name[lang]}</div>
                        <div className="font-extrabold text-[10px] text-gray-500 mt-1 bg-gray-100 px-2 py-0.5 rounded-full group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-all">{count} active</div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* 3. Browse By Qualifications */}
              <div>
                <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span>Browse by Qualifications</span>
                  <span className="flex-grow h-px bg-gray-100"></span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: { en: '10th Pass', hi: '10वीं पास', mr: '10 वी पास' }, slug: '10th-pass' },
                    { label: { en: '12th Pass', hi: '12वीं पास', mr: '12 वी पास' }, slug: '12th-pass' },
                    { label: { en: 'ITI Jobs', hi: 'आईटीआई पास', mr: 'ITI नोकऱ्या' }, slug: 'iti-pass' },
                    { label: { en: 'Diploma Jobs', hi: 'डिप्लोमा पास', mr: 'डिप्लोमा नोकऱ्या' }, slug: 'diploma' },
                    { label: { en: 'Graduate Jobs', hi: 'स्नातक पास', mr: 'पदवीधर नोकऱ्या' }, slug: 'graduate' },
                    { label: { en: 'B.Tech / Engineering', hi: 'इंजीनियरिंग', mr: 'अभियांत्रिकी' }, slug: 'engineering' },
                    { label: { en: 'Post Graduate', hi: 'पोस्ट ग्रेजुएट', mr: 'पदव्युत्तर नोकऱ्या' }, slug: 'post-graduate' }
                  ].map((qual) => {
                    const count = jobs.filter(j => {
                      if (!j.seo_matrix?.qualifications) return false;
                      return j.seo_matrix.qualifications.includes(qual.slug);
                    }).length;
                    return (
                      <Link 
                        key={qual.slug}
                        href={`/${lang}/explore/${qual.slug}`}
                        className="bg-white hover:bg-[#0A58CA] border border-gray-200 hover:border-[#0A58CA] text-gray-700 hover:text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold shadow-sm transition-all duration-200 flex items-center gap-2 cursor-pointer hover:scale-105"
                      >
                        <span>{qual.label[lang as 'en'|'hi'|'mr'] || qual.label.en}</span>
                        <span className="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded-md font-black group-hover:bg-white/20 group-hover:text-white">{count}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* Latest Jobs Table Exact Copy */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-[0_4px_20px_rgb(0,0,0,0.04)] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
            <div className="flex justify-between items-center py-2.5 px-3 sm:px-4 bg-gradient-to-r from-[#002D62] to-[#0A58CA]">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-100" />
                <h2 className="text-sm sm:text-base font-bold text-white tracking-wider uppercase">{dict.navigation.latestJobs}</h2>
              </div>
              <Link href={`/${lang}/jobs`} className="text-xs font-bold text-blue-100 hover:text-white hover:underline transition-colors uppercase tracking-wider bg-white/10 px-2 py-1 rounded">{dict.home.viewAllJobs}</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 p-4 sm:p-5 bg-gray-50/50 border-t border-gray-100">
              {jobs
                  .filter(j => j.category === 'Latest Jobs' || j.categories?.includes('Latest Jobs') || (!j.category && (!j.categories || j.categories.length === 0))) // fallback
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .slice(0, 9)
                  .map((job, index) => (
                    <JobCard 
                      key={job.id} 
                      title={job.title[lang] || job.title.en || 'Untitled'}
                      org={job.organization[lang] || job.organization.en || 'Unknown'}
                      qual={job.quick_facts?.qualification?.[lang] || job.quick_facts?.qualification?.en || '-'}
                      vac={job.quick_facts?.vacancies || '-'}
                      date={job.quick_facts?.last_date[lang] || '-'}
                      status={job.status}
                      statusColor={job.statusColor}
                      isLive={job.isLive}
                      isTrending={job.isTrending}
                      daysLeft={job.daysLeft}
                      link={`/${lang}/jobs/${job.slug}`}
                      logoUrl={job.logo_url}
                      logoAlt={job.logo_alt?.[lang] || job.organization[lang]}
                      lang={lang}
                      imgPriority={index < 6}
                      labels={{
                        trending: dict.home.trending,
                        daysLeft: dict.home.daysLeft,
                        lastDate: dict.job.lastDate,
                        details: dict.job.vacancyDetails.split(' ')[1] || 'Details',
                        applyNow: dict.job.applyNow
                      }}
                    />
                ))}
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
              // Robust matching: exact, case-insensitive, slug-based, or singularized slug
              const catObj = categories.find(c => 
                c.name.en.toLowerCase() === col.title?.toLowerCase() ||
                c.slug === col.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') ||
                c.slug === col.title?.toLowerCase().replace(/[^a-z0-9]+/g, '').replace(/s$/, '')
              );
              const catName = catObj ? catObj.name[lang] : col.title;
              const catSlug = catObj?.slug || col.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '';
              return (
                <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="bg-gradient-to-r from-[#002D62] to-[#0A58CA] py-2 px-4 flex justify-between items-center shrink-0">
                    <h3 className="font-bold text-white text-[11px] tracking-wider uppercase">{catName}</h3>
                    <Link href={getCategoryUrl(catSlug)} className="text-[9px] font-bold text-blue-100 hover:text-white hover:underline uppercase tracking-wider bg-white/10 px-1.5 py-0.5 rounded">All</Link>
                  </div>
                  <div className="p-4 flex-grow">
                    {col.items.length === 0 ? (
                      <p className="text-sm text-gray-400 italic">No updates available.</p>
                    ) : (
                      <ul className="space-y-3">
                        {col.items.map((item, j) => (
                          <li key={j} className="flex justify-between items-start gap-2 border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                            <Link href={`/${lang}/jobs/${item.slug}`} className="text-sm text-gray-700 hover:text-[#0A58CA] hover:underline leading-tight line-clamp-2">
                              {item.title[lang]}
                            </Link>
                            {item.quick_facts?.last_date && (
                              <span className="text-[10px] text-gray-400 whitespace-nowrap bg-gray-100 px-1.5 py-0.5 rounded">{item.quick_facts.last_date[lang]}</span>
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
            <h2 className="font-bold text-[#0B1B3D] mb-4 text-lg">{dict.home.trending} {dict.home.allCategories}</h2>
            <div className="flex flex-wrap gap-4 justify-start items-center">
              {trendingCategories.map((item) => {
                return (
                  <Link key={item.id} href={getCategoryUrl(item.slug)} className="flex flex-col items-center gap-2 cursor-pointer group w-[75px] transition-transform hover:-translate-y-1">
                    <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 flex items-center justify-center group-hover:border-[#0A58CA] group-hover:shadow-[0_8px_20px_rgba(10,88,202,0.15)] transition-all shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
                      <CategoryIcon name={item.icon || 'Briefcase'} className="w-10 h-10 transform group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <span className="text-[11px] sm:text-xs font-bold text-gray-700 group-hover:text-[#0A58CA] text-center leading-tight">{item.name[lang]}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* All Categories Grid */}
          <CategoryGrid 
            categories={categories} 
            lang={lang} 
            title={dict.home.allCategories || "All Categories"} 
            specialSlugs={specialSlugs} 
          />

        </div>
      </div>
    </>
  );
}
