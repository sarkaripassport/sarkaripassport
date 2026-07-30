import Link from "next/link";
import Script from "next/script";
import { getJobs, getSettings, getCategories, getPublishedJobs } from "@/lib/db";
import { getSeoAlternates } from "@/lib/seo";
import JobCard from "@/components/JobCard";
import CategoryGrid from "@/components/ui/CategoryGrid";
import CategoryIcon from "@/components/ui/CategoryIcon";
import AdvancedSearch from "@/components/AdvancedSearch";
import SeoContentBlock from "@/components/SeoContentBlock";

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

  const homePageData = settings.pages?.['home'];
  const contentHtml = typeof homePageData?.content_html === 'string'
    ? homePageData.content_html
    : homePageData?.content_html?.[lang] || homePageData?.content_html?.en || '';

  const getCount = (catName: string) => jobs.filter(j => j.category === catName || j.categories?.includes(catName)).length;
  
  const quickLinks = categories.filter(c => c.isQuickLink).sort((a, b) => getCount(b.name.en) - getCount(a.name.en));
  const trendingCategories = categories.filter(c => c.isTrending).sort((a, b) => getCount(b.name.en) - getCount(a.name.en));
  const regularCategories = categories.filter(c => !c.isTrending && !c.isQuickLink).sort((a, b) => getCount(b.name.en) - getCount(a.name.en));
  const specialSlugs = ['results', 'admit-card', 'answer-key', 'syllabus', 'admission'];

  const getCategoryUrl = (slug: string) => {
    const cleanSlug = slug.toLowerCase().replace(/s$/, ''); // singularize
    if (cleanSlug === 'latest-job' || cleanSlug === 'latest-jobs') return `/${lang}/jobs`;
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

  const portalCategories = [
    { 
      id: 'latest-jobs', 
      slug: 'latest-jobs', 
      name: { en: 'Latest Jobs', hi: 'नवीनतम नौकरियां', mr: 'नवीनतम नोकऱ्या' }, 
      icon: 'Briefcase',
      gradient: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
      glow: 'shadow-blue-500/10 hover:shadow-blue-500/30 border-blue-100 hover:border-blue-300'
    },
    { 
      id: 'admit-card', 
      slug: 'admit-card', 
      name: { en: 'Admit Card', hi: 'प्रवेश पत्र', mr: 'प्रवेश पत्र' }, 
      icon: 'FileText',
      gradient: 'from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700',
      glow: 'shadow-amber-500/10 hover:shadow-amber-500/30 border-amber-100 hover:border-amber-300'
    },
    { 
      id: 'results', 
      slug: 'results', 
      name: { en: 'Results', hi: 'परीक्षा परिणाम', mr: 'निकाल' }, 
      icon: 'Award',
      gradient: 'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700',
      glow: 'shadow-emerald-500/10 hover:shadow-emerald-500/30 border-emerald-100 hover:border-emerald-300'
    },
    { 
      id: 'answer-key', 
      slug: 'answer-key', 
      name: { en: 'Answer Key', hi: 'उत्तर कुंजी', mr: 'उत्तर तालिका' }, 
      icon: 'CheckSquare',
      gradient: 'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700',
      glow: 'shadow-indigo-500/10 hover:shadow-indigo-500/30 border-indigo-100 hover:border-indigo-300'
    },
    { 
      id: 'syllabus', 
      slug: 'syllabus', 
      name: { en: 'Syllabus', hi: 'पाठ्यक्रम', mr: 'अभ्यासक्रम' }, 
      icon: 'BookOpen',
      gradient: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      glow: 'shadow-purple-500/10 hover:shadow-purple-500/30 border-purple-100 hover:border-purple-300'
    },
    { 
      id: 'admission', 
      slug: 'admission', 
      name: { en: 'Admission', hi: 'प्रवेश', mr: 'प्रवेश प्रक्रिया' }, 
      icon: 'UserPlus',
      gradient: 'from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700',
      glow: 'shadow-rose-500/10 hover:shadow-rose-500/30 border-rose-100 hover:border-rose-300'
    }
  ];

  const getCategoryCount = (slug: string) => {
    if (slug === 'latest-jobs') {
      return jobs.filter(j => 
        j.category === 'Latest Jobs' || 
        j.categories?.includes('Latest Jobs') || 
        (!j.category && (!j.categories || j.categories.length === 0))
      ).length;
    }

    let catDbName = '';
    if (slug === 'admit-card') catDbName = 'Admit Card';
    else if (slug === 'results') catDbName = 'Results';
    else if (slug === 'answer-key') catDbName = 'Answer Key';
    else if (slug === 'syllabus') catDbName = 'Syllabus';
    else if (slug === 'admission') catDbName = 'Admission';

    return jobs.filter(j => j.category === catDbName || j.categories?.includes(catDbName)).length;
  };

  const hasCategoryNew = (slug: string) => {
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - 48);

    if (slug === 'latest-jobs') {
      return jobs.some(j => 
        (j.category === 'Latest Jobs' || j.categories?.includes('Latest Jobs') || (!j.category && (!j.categories || j.categories.length === 0))) && 
        new Date(j.created_at).getTime() >= cutoff.getTime()
      );
    }

    let catDbName = '';
    if (slug === 'admit-card') catDbName = 'Admit Card';
    else if (slug === 'results') catDbName = 'Results';
    else if (slug === 'answer-key') catDbName = 'Answer Key';
    else if (slug === 'syllabus') catDbName = 'Syllabus';
    else if (slug === 'admission') catDbName = 'Admission';

    return jobs.some(j => 
      (j.category === catDbName || j.categories?.includes(catDbName)) && 
      new Date(j.created_at).getTime() >= cutoff.getTime()
    );
  };

  const getCategoryColors = (slug: string) => {
    const s = slug.toLowerCase();
    if (s.includes('rail') || s.includes('train')) {
      return { border: 'border-blue-100 hover:border-blue-300', text: 'group-hover:text-blue-700', shadow: 'hover:shadow-blue-500/10' };
    }
    if (s.includes('bank') || s.includes('finance')) {
      return { border: 'border-emerald-100 hover:border-emerald-300', text: 'group-hover:text-emerald-700', shadow: 'hover:shadow-emerald-500/10' };
    }
    if (s.includes('police') || s.includes('def') || s.includes('shield')) {
      return { border: 'border-rose-100 hover:border-rose-300', text: 'group-hover:text-rose-700', shadow: 'hover:shadow-rose-500/10' };
    }
    if (s.includes('ssc') || s.includes('upsc') || s.includes('civil')) {
      return { border: 'border-indigo-100 hover:border-indigo-300', text: 'group-hover:text-indigo-700', shadow: 'hover:shadow-indigo-500/10' };
    }
    return { border: 'border-purple-100 hover:border-purple-300', text: 'group-hover:text-purple-700', shadow: 'hover:shadow-purple-500/10' };
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
      .slice(0, 15);
  };

  // Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "GovJobWala",
    "url": `https://govjobwala.com/${lang}`,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `https://govjobwala.com/${lang}/jobs?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  // Extract unique qualifications and locations dynamically from active jobs
  const qualifications = Array.from(new Set(
    jobs
      .map(j => {
        const q = j.quick_facts?.qualification?.[lang] || j.quick_facts?.qualification?.en || j.education_qualification?.[lang] || j.education_qualification?.en || '';
        return typeof q === 'string' ? q : '';
      })
      .map(q => q.trim())
      .filter((q): q is string => Boolean(q))
  )).sort();

  const locations = Array.from(new Set(
    jobs
      .map(j => {
        const l = j.quick_facts?.job_location?.[lang] || j.quick_facts?.job_location?.en || '';
        return typeof l === 'string' ? l : '';
      })
      .map(l => l.trim())
      .filter((l): l is string => Boolean(l))
  )).sort();

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
      

      <div className="w-full space-y-1.5 sm:space-y-2.5">
        {/* Hero Section (Multi-Line Stacked Header on Desktop & Mobile) */}
        <section className="relative bg-white border-b border-gray-200 overflow-hidden py-2 sm:py-3 px-3 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="flex flex-col gap-1 max-w-4xl">
              <div className="flex items-center gap-1.5 text-[#0A58CA] font-bold text-[10px] sm:text-xs uppercase tracking-widest shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> India's Trusted Govt Job Portal
                <span className="relative flex h-2 w-2 shrink-0 ml-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[9px] text-green-600 font-black ml-0.5 uppercase">Live</span>
              </div>
              <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-[#0B1B3D] tracking-tight leading-tight">
                {settings.hero.title[lang]}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                {settings.hero.subtitle[lang]}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
              <Link href={`/${lang}/jobs`} scroll={true} className="px-4 py-2 text-xs sm:text-sm bg-[#0A58CA] text-white rounded-lg font-bold shadow-sm hover:bg-blue-700 transition">
                {dict.navigation.latestJobs}
              </Link>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-1 relative z-20 space-y-2 md:space-y-3 pb-16">
          
          {/* Above-the-fold Interactive Widgets (Deferred Client-Side) */}
          <div className="w-full z-10 mt-1 sm:mt-2 flex flex-col md:flex-row gap-2 items-stretch">
            <AdvancedSearch lang={lang} categories={categories} qualifications={qualifications} locations={locations} />
          </div>

          {/* Main Sarkari Portals Dashboard (Ultra-Compact Horizontal Cards on Desktop) */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm p-2.5 sm:p-3 mt-1.5 sm:mt-2">
            <div className="flex flex-row justify-between items-center gap-2 border-b border-gray-100 pb-2 sm:pb-2.5 mb-2 sm:mb-3">
              <div>
                <h2 className="text-sm sm:text-base font-black text-[#0B1B3D] flex items-center gap-1.5 sm:gap-2">
                  <span className="w-2 sm:w-2.5 h-4 sm:h-5 bg-[#0A58CA] rounded-full inline-block"></span>
                  Sarkari Job Portals
                </h2>
              </div>
              <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 bg-green-50 text-green-700 text-[10px] sm:text-xs font-extrabold rounded-full border border-green-100">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                </span>
                Live
              </span>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5 sm:gap-2.5">
              {portalCategories.map((portal) => {
                const count = getCategoryCount(portal.slug);
                const hasNew = hasCategoryNew(portal.slug);
                return (
                  <Link 
                    href={getCategoryUrl(portal.slug)} 
                    key={portal.id} 
                    className={`relative bg-white rounded-lg sm:rounded-xl border p-1.5 sm:px-2.5 sm:py-2 text-center sm:text-left hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col sm:flex-row items-center sm:justify-between group h-[64px] sm:h-[68px] ${portal.glow}`}
                  >
                    {hasNew && (
                      <span className="absolute top-1 right-1 flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                      </span>
                    )}
                    <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 min-w-0">
                      <div className={`p-1 sm:p-1.5 bg-gradient-to-br ${portal.gradient} text-white rounded sm:rounded-lg transition-transform group-hover:scale-110 shadow-sm shrink-0`}>
                        <CategoryIcon name={portal.icon} className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <div className="font-extrabold text-[#0B1B3D] text-[10px] sm:text-xs leading-tight truncate group-hover:text-[#0A58CA] transition-colors">{portal.name[lang as 'en'|'hi'|'mr'] || portal.name.en}</div>
                    </div>
                    <div className="block font-extrabold text-[9px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full group-hover:bg-blue-50 group-hover:text-blue-700 transition-all shrink-0">{count} Active</div>
                  </Link>
                );
              })}
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
                const colors = getCategoryColors(item.slug);
                return (
                  <Link 
                    key={item.id} 
                    href={`/${lang}/category/${item.slug}`} 
                    className="flex flex-col items-center gap-2 cursor-pointer group w-[80px] transition-all hover:-translate-y-1"
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-white border flex items-center justify-center transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.02)] group-hover:scale-105 ${colors.border} ${colors.shadow}`}>
                      <CategoryIcon name={item.icon || item.name.en} className="w-10 h-10 transform group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <span className={`text-[11px] sm:text-xs font-bold text-gray-700 text-center leading-tight transition-colors duration-200 ${colors.text}`}>{item.name[lang]}</span>
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

          {/* SEO Custom CMS Content Block */}
          <SeoContentBlock contentHtml={contentHtml} />
        </div>
      </div>
    </>
  );
}
