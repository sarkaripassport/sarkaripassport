import { Metadata, ResolvingMetadata } from 'next';
import { getCategoryBySlug, getJobsByCategorySlug, getCategories } from '@/lib/db';
import JobCard from '@/components/JobCard';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, FolderOpen, AlertCircle } from 'lucide-react';
import { getDictionary, Locale } from '@/i18n/getDictionary';

export const revalidate = 60;

export async function generateMetadata(
  { params }: { params: Promise<{ lang: string, slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const { lang, slug } = resolvedParams;
  const category = await getCategoryBySlug(slug);
  
  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  const categoryName = category.name[lang as 'en'|'hi'|'mr'] || category.name.en;

  return {
    title: `${categoryName} - Latest Govt Jobs, Results & Updates 2026`,
    description: `Find all the latest and upcoming ${categoryName} jobs, admit cards, and results. Check eligibility and apply online.`,
    alternates: {
      canonical: `/${lang}/category/${slug}`,
      languages: {
        'en': `/en/category/${slug}`,
        'hi': `/hi/category/${slug}`,
        'mr': `/mr/category/${slug}`
      }
    }
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ lang: Locale, slug: string }> }) {
  const resolvedParams = await params;
  const { lang, slug } = resolvedParams;
  const dict = await getDictionary(lang);
  
  const category = await getCategoryBySlug(slug);
  // If the category is not predefined, we can still attempt to show jobs by tag,
  // but let's provide a fallback name
  const categoryName = category ? category.name[lang] : slug.replace(/-/g, ' ').toUpperCase();
  
  const jobs = await getJobsByCategorySlug(slug);

  // Generate JSON-LD for CollectionPage
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'CollectionPage',
    'name': `${categoryName} Jobs`,
    'description': `Latest jobs under ${categoryName}`,
    'url': `https://sarkarijob.com/${lang}/category/${slug}`
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-12 font-sans text-gray-800">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center gap-2 text-xs text-gray-500 font-medium">
          <Link href="/" className="hover:text-blue-600 transition-colors">{dict.navigation.home}</Link>
          <ChevronDown className="w-3 h-3 -rotate-90" />
          <Link href="/jobs" className="hover:text-blue-600 transition-colors">Categories</Link>
          <ChevronDown className="w-3 h-3 -rotate-90" />
          <span className="text-gray-900 truncate max-w-[300px]">{categoryName}</span>
        </div>
      </div>

      {/* Category Hero */}
      <div className="bg-white border-b border-gray-200 py-8 md:py-12 px-4 shadow-sm relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center">
              <FolderOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-[#0B1B3D] capitalize">{categoryName}</h1>
              <p className="text-gray-600 mt-1">Showing all matching records and updates</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      </div>

      {/* Jobs Grid */}
      <div className="max-w-[1200px] mx-auto px-4 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#0B1B3D] flex items-center gap-2">
            Available Updates <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">{jobs.length}</span>
          </h2>
        </div>

        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
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
                lang={lang as any}
                logoUrl={job.logo_url}
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
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center flex flex-col items-center shadow-sm">
            <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#0B1B3D] mb-2">No updates found</h3>
            <p className="text-gray-500 max-w-md">We couldn't find any recent jobs or updates under the "{categoryName}" category right now.</p>
            <Link href={`/${lang}/jobs`} className="mt-6 bg-[#0A58CA] text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors">
              Browse All Jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
