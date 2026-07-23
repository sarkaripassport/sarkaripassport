import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getDictionary, Locale } from '@/i18n/getDictionary';


import { notFound } from 'next/navigation';
import { getJobBySlug, getCategories, getJobs, getPublishedJobs, getCategoriesWithCounts } from "@/lib/db";
import AdSenseUnit from "@/components/AdSenseUnit";
import { getSeoAlternates } from '@/lib/seo';
import { ChevronDown, CheckCircle2, Clock, MapPin, GraduationCap, Users, DollarSign, Calendar, Info, ArrowRight, CheckSquare, ListOrdered, HelpCircle, BookOpen, Search, IndianRupee } from 'lucide-react';
import JobComments from '@/components/jobs/JobComments';
import { AutoLinkedText } from '@/lib/autoLinker';
import SalaryCalculator from '@/components/jobs/SalaryCalculator';
import ShareButton from '@/components/ShareButton';

const matrixTags = {
  "10th Pass": "10th-pass",
  "12th Pass": "12th-pass",
  "Graduate": "graduate",
  "Post Graduate": "post-graduate",
  "Diploma": "diploma",
  "Police": "police",
  "Railway": "railway",
  "Bank": "bank",
  "Defense": "defense",
  "SSC": "ssc",
  "UPSC": "upsc",
  "Teacher": "teacher",
  "UP": "up",
  "Bihar": "bihar",
  "Maharashtra": "maharashtra",
  "Delhi": "delhi"
};

function optimizeRichText(html: string | undefined, lang: string) {
  if (!html) return html;
  
  let processedHtml = html.replace(
    /<img\b([^>]*?)>/gi,
    (match, attributes) => {
      const hasLoading = /loading\s*=/i.test(attributes);
      const hasDecoding = /decoding\s*=/i.test(attributes);
      const hasClass = /class\s*=/i.test(attributes);
      
      let newAttributes = attributes;
      if (!hasLoading) newAttributes += ' loading="lazy"';
      if (!hasDecoding) newAttributes += ' decoding="async"';
      if (hasClass) {
        newAttributes = newAttributes.replace(/class\s*=\s*(["'])(.*?)\1/i, 'class="$2 w-full h-auto rounded-lg shadow-sm"');
      } else {
        newAttributes += ' class="w-full h-auto rounded-lg shadow-sm"';
      }
      
      return `<img ${newAttributes}>`;
    }
  );

  for (const [key, slug] of Object.entries(matrixTags)) {
    const regex = new RegExp(`(?![^<]*>)\\b(${key})\\b`, 'gi');
    processedHtml = processedHtml.replace(regex, `<a href="/${lang}/explore/${slug}" class="text-blue-600 hover:underline font-semibold" title="Explore $1 Jobs">$1</a>`);
  }
  return processedHtml;
}

export const revalidate = 3600; // 1 hour ISR

export async function generateStaticParams() {
  const jobs = await getPublishedJobs();
  const langs = ['en', 'hi', 'mr'];
  const params: { lang: string; slug: string }[] = [];
  for (const job of jobs) {
    for (const lang of langs) {
      params.push({ lang, slug: job.slug });
    }
  }
  return params;
}

export async function generateMetadata(
  { params }: { params: Promise<{ lang: string, slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const { lang, slug } = resolvedParams;
  const job = await getJobBySlug(slug);
  
  if (!job || !job.isLive) {
    return {
      title: 'Job Not Found | GovJobWala',
    };
  }
  
  return {
    title: job.seo_title?.[lang as 'en' | 'hi' | 'mr'] || `${job.title[lang as 'en' | 'hi' | 'mr']} | GovJobWala`,
    description: job.seo_description?.[lang as 'en' | 'hi' | 'mr'] || job.job_summary?.[lang as 'en' | 'hi' | 'mr'] || `Apply for ${job.title[lang as 'en' | 'hi' | 'mr']} at ${job.organization[lang as 'en' | 'hi' | 'mr']}`,
    openGraph: {
      type: 'website',
      url: `https://govjobwala.com/${lang}/jobs/${slug}`,
      title: job.seo_title?.[lang as 'en' | 'hi' | 'mr'] || `${job.title[lang as 'en' | 'hi' | 'mr']}`,
      description: job.seo_description?.[lang as 'en' | 'hi' | 'mr'] || job.job_summary?.[lang as 'en' | 'hi' | 'mr'] || `Apply for ${job.title[lang as 'en' | 'hi' | 'mr']} at ${job.organization[lang as 'en' | 'hi' | 'mr']}`,
      siteName: 'GovJobWala',
      images: job.logo_url ? [{ url: job.logo_url }] : [],
    },
    twitter: {
      card: 'summary',
      title: job.seo_title?.[lang as 'en' | 'hi' | 'mr'] || `${job.title[lang as 'en' | 'hi' | 'mr']}`,
      description: job.seo_description?.[lang as 'en' | 'hi' | 'mr'] || job.job_summary?.[lang as 'en' | 'hi' | 'mr'] || `Apply for ${job.title[lang as 'en' | 'hi' | 'mr']} at ${job.organization[lang as 'en' | 'hi' | 'mr']}`,
      images: job.logo_url ? [job.logo_url] : [],
    },
    keywords: job.primary_keyword?.[lang as 'en' | 'hi' | 'mr'] ? [job.primary_keyword[lang as 'en' | 'hi' | 'mr']] : undefined,
    alternates: getSeoAlternates(lang, `/jobs/${slug}`)
  };
}

export default async function JobDetailPage({ params }: { params: Promise<{ lang: Locale, slug: string }> }) {
  const resolvedParams = await params;
  const { lang, slug } = resolvedParams;
  const dict = await getDictionary(lang);
  const [job, sortedCategories, allJobs] = await Promise.all([
    getJobBySlug(slug),
    getCategoriesWithCounts(),
    getPublishedJobs()
  ]);

  if (!job || !job.isLive) {
    notFound();
  }

  const jobCategories = job.categories || [];
  
  let recentJobs = allJobs
    .filter(j => j.id !== job.id && j.isLive)
    .filter(j => j.categories?.some(c => jobCategories.includes(c)));

  // Fallback to latest jobs if we don't have enough similar jobs
  if (recentJobs.length < 4) {
    const similarJobIds = new Set(recentJobs.map(j => j.id));
    const fallbackJobs = allJobs
      .filter(j => j.id !== job.id && j.isLive && !similarJobIds.has(j.id))
      .slice(0, 4 - recentJobs.length);
    recentJobs = [...recentJobs, ...fallbackJobs];
  } else {
    recentJobs = recentJobs.slice(0, 4);
  }

  // Extract YouTube Video ID if present
  let youtubeVideoId = null;
  if (job.youtube_url) {
    const match = job.youtube_url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i);
    youtubeVideoId = match ? match[1] : null;
  }

  // Determine best apply link
  const applyLink = job.important_links?.find(l => l.is_primary || (l.label.en && l.label.en.toLowerCase().includes('apply')) || (l.label[lang] && l.label[lang].toLowerCase().includes('apply')))?.url || job.important_links?.[0]?.url || '#';

  // Safe Date parsing function
  const parseSafeDate = (dateStr?: string) => {
    if (!dateStr) return undefined;
    // Handle DD/MM/YYYY or DD-MM-YYYY formats safely
    const parts = dateStr.split(/[\/-]/);
    if (parts.length === 3) {
      // Assuming DD/MM/YYYY
      const date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00Z`);
      if (!isNaN(date.getTime())) return date.toISOString();
    }
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? undefined : date.toISOString();
  };

  const validThrough = parseSafeDate(job.quick_facts?.last_date?.[lang]);
  let dynamicDaysLeft = job.daysLeft; // fallback
  if (validThrough) {
    const diffTime = new Date(validThrough).getTime() - new Date().getTime();
    dynamicDaysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  // Fallback date: if no validThrough is found, default to 30 days from datePosted to satisfy GSC requirement
  const defaultValidThrough = new Date();
  defaultValidThrough.setDate(defaultValidThrough.getDate() + 30);

  // Generate JSON-LD for JobPosting
  const jobPostingLd = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    'url': `https://govjobwala.com/${lang}/jobs/${slug}`,
    'identifier': {
      '@type': 'PropertyValue',
      'name': job.organization?.[lang] || 'Government Organization',
      'value': job.id
    },
    'title': job.title?.[lang] || 'Government Job Vacancy',
    'description': job.job_summary?.[lang] || `Recruitment for ${job.title?.[lang] || 'Vacancies'} by ${job.organization?.[lang] || 'Government Organization'}`,
    'keywords': [job.primary_keyword?.[lang], ...(job.secondary_keywords?.[lang] ? job.secondary_keywords[lang].split(',') : [])].filter(Boolean).join(', '),
    'datePosted': parseSafeDate(job.created_at) || new Date().toISOString(),
    'validThrough': validThrough || defaultValidThrough.toISOString(),
    'employmentType': 'FULL_TIME',
    'hiringOrganization': {
      '@type': 'Organization',
      'name': job.organization?.[lang] || 'Government Organization',
      'logo': job.logo_url || 'https://govjobwala.com/logo.png'
    },
    'jobLocation': {
      '@type': 'Place',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Headquarters',
        'addressLocality': job.quick_facts?.job_location?.[lang] || 'New Delhi',
        'addressRegion': job.quick_facts?.job_location?.[lang] || 'Delhi',
        'postalCode': '110001',
        'addressCountry': 'IN'
      }
    },
    'baseSalary': {
      '@type': 'MonetaryAmount',
      'currency': 'INR',
      'value': {
        '@type': 'QuantitativeValue',
        'value': job.quick_facts?.salary?.[lang] || 'As per norms',
        'unitText': 'MONTH'
      }
    }
  };

  // Generate JSON-LD for BreadcrumbList
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://govjobwala.com'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Latest Jobs',
        'item': 'https://govjobwala.com/jobs'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': job.title?.[lang] || 'Job Details',
        'item': `https://govjobwala.com/${lang}/jobs/${slug}`
      }
    ]
  };

  // Generate JSON-LD for FAQs
  const faqLd = job.faqs && job.faqs.length > 0 ? {
    '@context': 'https://schema.org/',
    '@type': 'FAQPage',
    'mainEntity': job.faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question[lang],
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer[lang]
      }
    }))
  } : null;

  // Generate JSON-LD for Syllabus (ItemList)
  const syllabusLd = job.syllabus && job.syllabus.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': `${job.title[lang]} Exam Syllabus`,
    'description': `Complete detailed syllabus for ${job.title[lang]}`,
    'itemListElement': job.syllabus.map((section, idx) => ({
      '@type': 'ListItem',
      'position': idx + 1,
      'name': section.subject[lang],
      'description': section.topics.map(t => t.title[lang]).join(', ')
    }))
  } : null;

  // Generate JSON-LD for VideoObject
  const videoLd = youtubeVideoId ? {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    'name': `${job.title[lang]} - Official Details`,
    'description': `Watch official details for ${job.title[lang]}`,
    'thumbnailUrl': `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`,
    'uploadDate': parseSafeDate(job.created_at) || new Date().toISOString(),
    'embedUrl': `https://www.youtube.com/embed/${youtubeVideoId}`
  } : null;

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-24 md:pb-6 font-sans text-gray-800">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {(job.schema_settings?.enable_job_schema ?? true) && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingLd) }} />}
      {(job.schema_settings?.enable_faq_schema ?? true) && faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
      {(job.schema_settings?.enable_syllabus_schema ?? true) && syllabusLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(syllabusLd) }} />}
      {videoLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoLd) }} />}
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm hidden md:block">
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center gap-2 text-xs text-gray-500 font-medium">
          <Link href="/" className="hover:text-blue-600 transition-colors">{dict.navigation.home}</Link>
          <ChevronDown className="w-3 h-3 -rotate-90" />
          <Link href="/jobs" className="hover:text-blue-600 transition-colors">{dict.navigation.latestJobs}</Link>
          <ChevronDown className="w-3 h-3 -rotate-90" />
          <span className="text-gray-900 truncate max-w-[300px]">{job.title[lang]}</span>
        </div>
      </div>



      {/* Main Content Area */}
      <div className="max-w-[1200px] mx-auto px-0 md:px-4 mt-0 md:mt-6 space-y-2 md:space-y-6">
        
        {/* Section 1: Modern Hero */}
        <section className="relative bg-white md:rounded-2xl border-y md:border border-gray-200 p-5 md:p-4 shadow-sm overflow-hidden flex flex-row items-start text-left gap-4">
          {/* Subtle Glass Background */}
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50/50 via-transparent to-transparent pointer-events-none"></div>
          
          {job.logo_url && job.logo_url.replace(/['"]/g, '').trim().startsWith("http") ? (
            <div className="w-20 h-20 md:w-28 md:h-28 shrink-0 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden relative z-10 mt-1">
              <Image src={job.logo_url.replace(/['"]/g, '').trim()} alt={job.logo_alt?.[lang] || job.organization[lang]} width={112} height={112} priority className="w-full h-full object-contain p-1" />
            </div>
          ) : (
            <div className="w-20 h-20 md:w-28 md:h-28 shrink-0 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center relative z-10 mt-1">
              <span className="text-gray-400 font-bold text-2xl md:text-3xl">{job.organization[lang].charAt(0)}</span>
            </div>
          )}
          
          <div className="relative z-10 flex-1 space-y-2 w-full min-w-0">
            <div className="flex flex-wrap justify-between items-start gap-2">
              <div className="flex flex-wrap gap-2">
                <span className={`inline-flex items-center px-2.5 py-1 text-[9px] md:text-[10px] font-black uppercase tracking-wider rounded ${job.statusColor}`}>{job.status}</span>
                {dynamicDaysLeft !== undefined && (
                  <span className="inline-flex items-center px-2.5 py-1 bg-red-50 text-red-700 border border-red-100 text-[9px] md:text-[10px] font-black uppercase tracking-wider rounded">
                    <Clock className="w-3 h-3 mr-1" /> {dynamicDaysLeft} {dict.home.daysLeft}
                  </span>
                )}
              </div>
              <ShareButton 
                title={job.title[lang]} 
                text={`Apply for ${job.title[lang]} at ${job.organization[lang]}`} 
                url={`https://govjobwala.com/${lang}/jobs/${slug}`}
                className="inline-flex px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:text-[#0A58CA] hover:border-blue-200 hover:bg-blue-50"
              />
            </div>
            
            <div>
              <h1 className="text-xl md:text-2xl font-black text-[#0B1B3D] leading-tight tracking-tight mb-1">{job.title[lang]}</h1>
              <p className="text-xs font-bold text-gray-500 truncate">{job.organization[lang]}</p>
            </div>
          </div>
        </section>

        {/* Section 14: Eligibility Match Widget (Dynamic via Client Component) */}


        {/* Section 2: Quick Facts (Strip) */}
        {job.quick_facts && (
          <section className="bg-white md:rounded-2xl border-y md:border border-gray-200 py-3 px-4 shadow-sm flex items-center justify-start overflow-x-auto hide-scrollbar">
            <div className="flex items-center gap-4 md:gap-6 min-w-max divide-x divide-gray-200">
              {/* Vacancies */}
              <div className="flex items-center gap-3 pr-2 md:pr-4">
                 <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                 </div>
                 <div>
                   <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider block leading-none mb-1">Vacancies</span>
                   <span className="text-sm font-black text-[#0B1B3D] leading-none">{job.quick_facts.vacancies}</span>
                 </div>
              </div>

              {/* Posts Count */}
              {job.vacancy_cards && job.vacancy_cards.length > 0 && (
                <div className="flex items-center gap-3 pl-4 pr-2 md:px-6">
                   <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                      <ListOrdered className="w-4 h-4" />
                   </div>
                   <div>
                     <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider block leading-none mb-1">Different Posts</span>
                     <span className="text-sm font-black text-[#0B1B3D] leading-none">{job.vacancy_cards.length} Posts</span>
                   </div>
                </div>
              )}

              {/* Location */}
              <div className="flex items-center gap-3 pl-4 md:pl-6">
                 <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                 </div>
                 <div>
                   <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider block leading-none mb-1">Location</span>
                   <span className="text-sm font-black text-[#0B1B3D] leading-none">{job.quick_facts.job_location[lang]}</span>
                 </div>
              </div>
            </div>
          </section>
        )}

        {/* Section 6 (Strategy): Interactive Salary Calculator */}
        {job.salary_calculator?.enabled && (
          <section className="px-5 md:px-0">
            <SalaryCalculator data={job.salary_calculator} />
          </section>
        )}

        {/* Desktop Two-Column Layout */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-2 md:space-y-6 w-full">
            
            {/* Section 3: Summary */}
            {job.job_summary && (
              <div className="bg-white rounded-2xl p-5 md:p-6 shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100 mb-6">
                <h2 className="text-base font-black text-[#0B1B3D] mb-3">Job Summary</h2>
                <div className="text-sm leading-relaxed text-gray-600 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: optimizeRichText(job.job_summary[lang], lang) || '' }} />
              </div>
            )}
            
            <AdSenseUnit />

            
            {/* Section: YouTube Video Explainer */}
            {youtubeVideoId && (
              <section className="bg-white md:rounded-2xl border-y md:border border-gray-200 p-5 md:p-6 shadow-sm overflow-hidden">
                <h2 className="text-base font-black text-[#0B1B3D] mb-5 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600"><path d="M2.25 8.90446C2.25 7.15939 3.66442 5.74497 5.40949 5.74497H18.5905C20.3356 5.74497 21.75 7.15939 21.75 8.90446V15.0955C21.75 16.8406 20.3356 18.255 18.5905 18.255H5.40949C3.66442 18.255 2.25 16.8406 2.25 15.0955V8.90446Z"></path><path d="M9.75 15.0515L15.3015 12L9.75 8.94853V15.0515Z" fill="currentColor"></path></svg>
                  Official Notification Explainer
                </h2>
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200">
                  <iframe 
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${youtubeVideoId}`} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen>
                  </iframe>
                </div>
              </section>
            )}


            {/* Section 4: Timelines */}
            {job.important_dates && job.important_dates.length > 0 && (
              <section className="bg-white md:rounded-2xl border-y md:border border-gray-200 p-5 md:p-6 shadow-sm">
                <h2 className="text-base font-black text-[#0B1B3D] mb-5 flex items-center gap-2"><Calendar className="w-5 h-5 text-blue-600" /> Important Dates</h2>
                <div className="relative border-l-2 border-blue-100 ml-3 space-y-6">
                  {job.important_dates.map((date, idx) => (
                    <div key={idx} className="relative pl-6">
                      <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                      <h4 className="text-sm font-bold text-[#0B1B3D]">{date.label[lang]}</h4>
                      <p className="text-sm text-blue-600 font-bold mt-0.5">{date.date[lang]}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Application Fees */}
            {job.application_fee && job.application_fee.length > 0 && (
              <section className="bg-white md:rounded-2xl border-y md:border border-gray-200 p-5 md:p-6 shadow-sm">
                <h2 className="text-base font-black text-[#0B1B3D] mb-5 flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-green-600" /> Application Fees
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  {job.application_fee.map((fee, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 rounded-lg border border-green-100 bg-green-50/30">
                      <span className="text-sm font-semibold text-gray-700">{fee.category[lang]}</span>
                      <span className="text-sm font-black text-green-700">{fee.amount[lang]}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Section 7: Vacancies */}
            {job.vacancy_cards && job.vacancy_cards.length > 0 && (
              <section className="bg-white md:rounded-2xl border-y md:border border-gray-200 p-5 md:p-6 shadow-sm">
                <h2 className="text-base font-black text-[#0B1B3D] mb-5 flex items-center gap-2"><Users className="w-5 h-5 text-blue-600" /> Vacancy Details ({job.quick_facts?.vacancies})</h2>
                
                {/* Mobile Cards (Hidden on md+) */}
                <div className="space-y-4 md:hidden">
                  {job.vacancy_cards.map((vac, idx) => (
                    <div key={idx} className="bg-white border-y border-r border-l-4 border-l-blue-600 border-y-gray-200 border-r-gray-200 rounded-lg shadow-sm overflow-hidden relative">
                      {/* Ticket Notch effect (optional) */}
                      <div className="absolute top-1/2 -right-2 w-4 h-4 bg-gray-50 rounded-full border border-gray-200 -translate-y-1/2"></div>
                      
                      <div className="p-4 border-b border-gray-100 border-dashed">
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <h3 className="font-black text-[#0B1B3D] leading-tight text-lg" dangerouslySetInnerHTML={{ __html: vac.post_name[lang] || '' }} />
                          <span className="bg-blue-600 text-white font-black px-2.5 py-1 rounded text-sm shrink-0 shadow-sm">{vac.total} Posts</span>
                        </div>
                        <div className="flex items-start gap-2 mt-3 text-sm text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                          <GraduationCap className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                          <span className="font-semibold leading-snug" dangerouslySetInnerHTML={{ __html: vac.education[lang] || '' }} />
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50/50">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-2 px-1">Category Distribution</span>
                        <div className="grid grid-cols-4 gap-2">
                          {Object.entries(vac.categories || {}).filter(([_, val]) => val).sort((a, b) => Number(b[1]) - Number(a[1])).map(([cat, val]) => (
                            <div key={cat} className="flex flex-col bg-white border border-gray-200 rounded-md text-center py-1.5 shadow-sm">
                              <span className="text-[9px] font-black text-gray-500 uppercase">{cat}</span>
                              <span className="text-sm font-black text-[#0B1B3D]">{val as string}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table (Hidden on mobile) */}
                <div className="hidden md:block overflow-hidden border border-gray-200 rounded-xl shadow-sm bg-white">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-5 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Post Name</th>
                        <th className="px-5 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-5 py-4 text-xs font-black text-gray-500 uppercase tracking-wider">Qualification</th>
                        <th className="px-5 py-4 text-xs font-black text-gray-500 uppercase tracking-wider border-l border-gray-200">Category Breakdown</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {job.vacancy_cards.map((vac, idx) => (
                        <tr key={idx} className="hover:bg-blue-50/30 transition-colors group">
                          <td className="px-5 py-4 font-black text-[#0B1B3D] align-top text-base group-hover:text-blue-700 transition-colors" dangerouslySetInnerHTML={{ __html: vac.post_name[lang] || '' }} />
                          <td className="px-5 py-4 align-top">
                            <span className="inline-flex items-center justify-center bg-blue-100 text-blue-700 font-black px-3 py-1 rounded-md min-w-[3rem] text-sm border border-blue-200 shadow-sm">{vac.total}</span>
                          </td>
                          <td className="px-5 py-4 text-gray-700 font-medium align-top leading-snug max-w-[250px] text-sm">
                            <div className="flex items-start gap-2">
                              <GraduationCap className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                              <span dangerouslySetInnerHTML={{ __html: vac.education[lang] || '' }} />
                            </div>
                          </td>
                          <td className="px-5 py-4 border-l border-gray-50 align-top bg-gray-50/30">
                            <div className="flex gap-2 flex-wrap">
                              {Object.entries(vac.categories || {}).filter(([_, val]) => val).sort((a, b) => Number(b[1]) - Number(a[1])).map(([cat, val]) => (
                                <div key={cat} className="inline-flex items-center gap-1.5 px-2 py-1 bg-white border border-gray-200 rounded-md shadow-sm card-hover">
                                  <span className="text-[10px] text-gray-500 font-bold uppercase">{cat}</span>
                                  <span className="text-sm font-black text-[#0B1B3D]">{val as string}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Mobile Important Links (Visible only on mobile/tablet) */}
            {job.important_links && job.important_links.length > 0 && (
              <div className="block md:hidden bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-6">
                <h3 className="text-sm font-black text-[#0B1B3D] uppercase tracking-wider mb-4">Important Links</h3>
                <div className="space-y-2">
                  {job.important_links.map((link, idx) => (
                    <a key={idx} href={link.url} target="_blank" className={`flex items-center justify-between p-3 rounded-lg border text-sm font-bold transition-colors ${link.is_primary ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`}>
                      {link.label[lang]}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Section 10: Selection Process */}
            {job.selection_process && job.selection_process.length > 0 && (
              <section className="bg-white md:rounded-2xl border-y md:border border-gray-200 p-5 md:p-6 shadow-sm">
                <h2 className="text-base font-black text-[#0B1B3D] mb-5 flex items-center gap-2"><ListOrdered className="w-5 h-5 text-blue-600" /> Selection Process</h2>
                <div className="space-y-4">
                  {job.selection_process.map((step) => (
                    <div key={step.step_number} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-black flex items-center justify-center shrink-0 border border-blue-200">{step.step_number}</div>
                      <div>
                        <h4 className="font-bold text-[#0B1B3D] mb-1 [&>p]:inline" dangerouslySetInnerHTML={{ __html: step.title[lang] || '' }} />
                        <div className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: optimizeRichText(step.description[lang], lang) || '' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Section 13: How To Apply */}
            {job.how_to_apply && job.how_to_apply.length > 0 && (
              <section className="bg-white md:rounded-2xl border-y md:border border-gray-200 p-5 md:p-6 shadow-sm">
                <h2 className="text-base font-black text-[#0B1B3D] mb-5 flex items-center gap-2"><CheckSquare className="w-5 h-5 text-blue-600" /> How to Apply</h2>
                <div className="space-y-3">
                  {job.how_to_apply.map((step) => (
                    <div key={step.step_number} className="flex gap-3 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <span className="font-black text-blue-400 shrink-0">Step {step.step_number}:</span>
                      <div className="text-gray-700 [&>p]:inline" dangerouslySetInnerHTML={{ __html: optimizeRichText(step.instruction[lang], lang) || '' }} />
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {/* Section 15.5: Syllabus (Native Engine) */}
            {job.syllabus && job.syllabus.length > 0 && (
              <section className="bg-white md:rounded-2xl border-y md:border border-gray-200 p-5 md:p-6 shadow-sm">
                <h2 className="text-base font-black text-[#0B1B3D] mb-5 flex items-center gap-2"><BookOpen className="w-5 h-5 text-blue-600" /> Detailed Exam Syllabus</h2>
                <div className="space-y-4">
                  {job.syllabus.map((section, idx) => (
                    <details key={idx} className="group bg-gray-50 border border-gray-200 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                      <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-gray-800">
                        <span className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs flex items-center justify-center shrink-0">{idx + 1}</span>
                          <span className="[&>p]:inline" dangerouslySetInnerHTML={{ __html: section.subject[lang] || '' }} />
                        </span>
                        <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="p-4 pt-0 border-t border-gray-100 bg-white">
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                          {section.topics.map((topic, tidx) => (
                            <li key={tidx} className="flex items-start gap-2 text-sm text-gray-700">
                              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                              <span className="leading-tight [&>p]:inline" dangerouslySetInnerHTML={{ __html: topic.title[lang] || '' }} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Section 16: FAQs */}
            {job.faqs && job.faqs.length > 0 && (
              <section className="bg-white md:rounded-2xl border-y md:border border-gray-200 p-5 md:p-6 shadow-sm">
                <h2 className="text-base font-black text-[#0B1B3D] mb-5 flex items-center gap-2"><HelpCircle className="w-5 h-5 text-blue-600" /> Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {job.faqs.map((faq, idx) => (
                    <details key={idx} className="group bg-gray-50 border border-gray-200 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                      <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-gray-800">
                        <span className="[&>p]:inline" dangerouslySetInnerHTML={{ __html: faq.question[lang] || '' }} />
                        <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="p-4 pt-0 text-sm text-gray-600 border-t border-gray-100 bg-white leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: optimizeRichText(faq.answer[lang], lang) || '' }} />
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Section 17: Community Comments */}
            <JobComments slug={slug} initialComments={job.comments || []} />

          </div>

          {/* Right Sidebar (Sticky on Desktop) */}
          <div className="w-full md:w-[350px] shrink-0 space-y-4 md:space-y-6 md:sticky md:top-20 h-fit">
             
             {/* Desktop Important Links (Visible only on desktop) */}
             {job.important_links && job.important_links.length > 0 && (
               <div className="hidden md:block bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                 <h3 className="text-sm font-black text-[#0B1B3D] uppercase tracking-wider mb-4">Important Links</h3>
                 <div className="space-y-2">
                   {job.important_links.map((link, idx) => (
                     <a key={idx} href={link.url} target="_blank" className={`flex items-center justify-between p-3 rounded-lg border text-sm font-bold transition-colors ${link.is_primary ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`}>
                       {link.label[lang]}
                       <ArrowRight className="w-4 h-4" />
                     </a>
                   ))}
                 </div>
               </div>
             )}

             {/* Search Widget */}
             <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
               <h3 className="text-sm font-black text-[#0B1B3D] uppercase tracking-wider mb-4">Search Jobs</h3>
               <form action={`/${lang}/jobs`} method="GET" className="relative">
                 <input type="text" name="q" placeholder="Search by title or org..." className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                 <button type="submit" className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-600 transition-colors">
                   <Search className="w-5 h-5" />
                 </button>
               </form>
             </div>

             {/* Categories Widget */}
             <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
               <h3 className="text-sm font-black text-[#0B1B3D] uppercase tracking-wider mb-4">Categories</h3>
               <div className="flex flex-wrap gap-2">
                 {sortedCategories.map((c, i) => {
                   const count = c.count;
                   return (
                   <a key={i} href={`/${lang}/jobs?cat=${c.slug}`} className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-colors flex items-center gap-1.5">
                     {c.name[lang]} <span className="bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded-full text-[10px]">{count}</span>
                   </a>
                 )})}
               </div>
             </div>
             
             {/* Desktop Quick Apply Card */}
             <div className="hidden md:block bg-gradient-to-b from-[#0A58CA] to-[#084298] rounded-2xl text-white p-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <h3 className="font-black text-xl mb-2">Ready to Apply?</h3>
                <p className="text-blue-100 text-sm mb-5 leading-relaxed">Submit your application before <strong className="text-white">{job.quick_facts?.last_date[lang]}</strong>.</p>
                <a href={applyLink} target="_blank" className="w-full py-3.5 bg-yellow-400 text-yellow-950 hover:bg-yellow-300 rounded-xl font-black transition-colors shadow flex items-center justify-center gap-2 text-sm uppercase tracking-wide">
                  Apply Online Now <ArrowRight className="w-4 h-4" />
                </a>
             </div>

             {/* Application Fee Card */}
             {job.application_fee && job.application_fee.length > 0 && (
               <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                 <h3 className="text-sm font-black text-[#0B1B3D] uppercase tracking-wider mb-4">Application Fee</h3>
                 <ul className="space-y-3">
                   {job.application_fee.map((fee, idx) => (
                     <li key={idx} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                       <span className="text-gray-600">{fee.category[lang]}</span>
                       <span className="font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded">{fee.amount[lang]}</span>
                     </li>
                   ))}
                 </ul>
               </div>
             )}

             {/* Important Links Card deleted (moved to top of sidebar) */}
          </div>
        </div>
      </div>

      {/* Similar Jobs Section */}
      {recentJobs.length > 0 && (
        <div className="max-w-[1200px] mx-auto px-4 mt-8 lg:mt-12 mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-[#0B1B3D]">Similar Government Jobs</h2>
            <Link href={`/${lang}/jobs`} className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentJobs.map((rJob) => (
              <Link key={rJob.id} href={`/${lang}/jobs/${rJob.slug}`} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group flex flex-col h-full">
                <div className="flex items-center gap-3 mb-3">
                  {rJob.logo_url && rJob.logo_url.replace(/['"]/g, '').trim().startsWith("http") ? (
                    <div className="relative w-10 h-10 shrink-0">
                      <Image 
                        src={rJob.logo_url.replace(/['"]/g, '').trim()} 
                        alt={`${rJob.organization[lang]} logo`} 
                        width={40}
                        height={40}
                        className="object-contain p-1 max-w-full max-h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded flex items-center justify-center font-bold text-lg shrink-0">
                      {rJob.organization[lang]?.charAt(0) || 'G'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wide truncate">{rJob.organization[lang]}</p>
                    <h3 className="font-bold text-[#0B1B3D] text-sm leading-tight line-clamp-2 group-hover:text-blue-700 transition-colors">{rJob.title[lang]}</h3>
                  </div>
                </div>
                
                <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-600">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {rJob.quick_facts?.job_location?.[lang] || 'All India'}</span>
                  {rJob.quick_facts?.last_date && (
                    <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-0.5 rounded"><Calendar className="w-3.5 h-3.5" /> {rJob.quick_facts.last_date[lang]}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Sticky CTA Bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] p-3 z-50 flex items-center gap-3">
        <button className="flex-1 py-3 bg-white border border-[#0A58CA] text-[#0A58CA] rounded-xl font-bold text-sm shadow-sm flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" /> Eligibility
        </button>
        <a href={applyLink} target="_blank" className="flex-1 py-3 bg-[#0A58CA] text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-1.5 uppercase tracking-wide">
          Apply Now <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
