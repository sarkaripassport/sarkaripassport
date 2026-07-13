import { Metadata } from 'next';
import { getJobs, Job, getMatrixPage } from '@/lib/db';

export const revalidate = 3600; // 1 hour ISR
import JobCard from '@/components/JobCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Home, ChevronRight, Briefcase } from 'lucide-react';
import { getDictionary } from '@/i18n/getDictionary';
import React from 'react';

interface Props {
  params: {
    lang: 'en' | 'hi' | 'mr';
    matrix: string[];
  }
}

// Generate Dynamic SEO Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, matrix } = params;
  
  // Clean slugs to display words (e.g., '10th-pass' -> '10th Pass')
  const tags = matrix.map(slug => 
    slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  );
  const tagString = tags.join(' ');
  const matrixSlug = matrix.join('/');
  const customPage = await getMatrixPage(matrixSlug);
  


  const translations = {
    en: {
      title: `Latest ${tagString} Jobs 2026 | SarkariJob`,
      description: `Find all the latest and upcoming ${tagString} government jobs and recruitments for 2026. Get full details, syllabus, and apply online.`
    },
    hi: {
      title: `नवीनतम ${tagString} नौकरियां 2026 | SarkariJob`,
      description: `2026 के लिए सभी नवीनतम और आगामी ${tagString} सरकारी नौकरियां खोजें। पूरी जानकारी प्राप्त करें और ऑनलाइन आवेदन करें।`
    },
    mr: {
      title: `नवीनतम ${tagString} नोकऱ्या 2026 | SarkariJob`,
      description: `2026 साठी सर्व नवीनतम आणि आगामी ${tagString} सरकारी नोकऱ्या शोधा. पूर्ण तपशील मिळवा आणि ऑनलाइन अर्ज करा.`
    }
  };

  return {
    title: customPage?.h1?.[lang] || translations[lang].title,
    description: customPage?.intro?.[lang] || translations[lang].description,
  };
}

export default async function ExploreMatrixPage({ params }: Props) {
  const { lang, matrix } = params;
  const dict = await getDictionary(lang);
  const allJobs = await getJobs();
  const matrixSlug = matrix.join('/');
  const customPage = await getMatrixPage(matrixSlug);
  
  // Filter jobs based on matrix tags
  const matchedJobs = allJobs.filter((job) => {
    if (!job.seo_matrix) return false;
    
    const allTags = [
      ...(job.seo_matrix.states || []),
      ...(job.seo_matrix.cities || []),
      ...(job.seo_matrix.qualifications || []),
      ...(job.seo_matrix.departments || [])
    ];
    
    // Check if ALL slugs in the URL are present in this job's matrix tags
    return matrix.every(slug => allTags.includes(slug.toLowerCase()));
  });
  
  // Prettify tags for UI display
  const displayTags = matrix.map(slug => 
    slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  );
  const pageTitle = displayTags.join(' ');


  if (matchedJobs.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 pt-[70px] pb-12">
        <div className="container mx-auto px-4 max-w-5xl py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No jobs found for {pageTitle}</h1>
          <p className="text-gray-600 mb-6">Try exploring other categories or broadening your search.</p>
          <Link href={`/${lang}/jobs`} className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-bold">
            View All Jobs
          </Link>
        </div>
      </main>
    );
  }

  const translations = {
    en: { home: 'Home', explore: 'Explore', jobs: 'Jobs', found: 'jobs found' },
    hi: { home: 'होम', explore: 'खोजें', jobs: 'नौकरियां', found: 'नौकरियां मिलीं' },
    mr: { home: 'मुख्यपृष्ठ', explore: 'शोधा', jobs: 'नोकऱ्या', found: 'नोकऱ्या सापडल्या' }
  };
  const t = translations[lang] || translations.en;

  // Generate BreadcrumbList JSON-LD Schema
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': t.home,
        'item': `https://sarkaripassport.com/${lang}`
      },
      ...displayTags.map((tag, idx) => ({
        '@type': 'ListItem',
        'position': idx + 2,
        'name': tag,
        'item': `https://sarkaripassport.com/${lang}/explore/${matrix.slice(0, idx + 1).join('/')}`
      }))
    ]
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-[70px] pb-12">
      
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 py-8 mb-8">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href={`/${lang}`} className="hover:text-blue-600 flex items-center gap-1">
              <Home className="w-4 h-4" /> {t.home}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span>{t.explore}</span>
            {displayTags.map((tag, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight className="w-4 h-4" />
                <span className={idx === displayTags.length - 1 ? 'text-gray-900 font-medium' : ''}>
                  {tag}
                </span>
              </React.Fragment>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-[#0B1B3D]">
            {customPage ? customPage.h1[lang] : (
              <>Latest <span className="text-blue-600">{pageTitle}</span> {t.jobs}</>
            )}
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            {customPage ? customPage.intro[lang] : `${matchedJobs.length} ${t.found}`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matchedJobs.map(job => (
            <JobCard 
              key={job.id} 
              title={job.title[lang]}
              org={job.organization[lang]}
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
              lang={lang as any}
              labels={{
                trending: dict.home.trending,
                daysLeft: dict.home.daysLeft,
                lastDate: dict.job.lastDate,
                details: dict.job.vacancyDetails?.split(' ')[1] || 'Details',
                applyNow: dict.job.applyNow
              }}
            />
          ))}
        </div>

        {customPage?.faqs && customPage.faqs.length > 0 && (
          <div className="mt-12 bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[#0B1B3D] mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {customPage.faqs.map((faq, idx) => (
                <div key={idx} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.q[lang]}</h3>
                  <p className="text-gray-600">{faq.a[lang]}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </main>
  );
}
