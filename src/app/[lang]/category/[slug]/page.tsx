import { Metadata, ResolvingMetadata } from 'next';
import { getCategoryBySlug, getJobsByCategorySlug, getCategories, getSettings } from '@/lib/db';
import { getSeoAlternates } from '@/lib/seo';
import JobCard from '@/components/JobCard';
import SeoContentBlock from '@/components/SeoContentBlock';
import ScrollToTopOnMount from '@/components/ScrollToTopOnMount';
import IncrementalJobsList from '@/components/IncrementalJobsList';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, FolderOpen, AlertCircle } from 'lucide-react';
import { getDictionary, Locale } from '@/i18n/getDictionary';

export const revalidate = 3600; // 1 hour ISR for millisecond Edge TTFB

export async function generateStaticParams() {
  const categories = await getCategories();
  const langs = ['en', 'hi', 'mr'];
  const params: { lang: string; slug: string }[] = [];
  for (const cat of categories) {
    for (const lang of langs) {
      params.push({ lang, slug: cat.slug });
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
  const category = await getCategoryBySlug(slug);
  
  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  const categoryName = category.name[lang as 'en'|'hi'|'mr'] || category.name.en;

  const title = category.seo_title?.[lang as 'en'|'hi'|'mr'] || `${categoryName} - Latest Govt Jobs, Results & Updates 2026`;
  const description = category.seo_description?.[lang as 'en'|'hi'|'mr'] || `Find all the latest and upcoming ${categoryName} jobs, admit cards, and results. Check eligibility and apply online.`;
  const url = `https://govjobwala.com/${lang}/category/${slug}`;

  const ogUrl = new URL('https://govjobwala.com/api/og');
  ogUrl.searchParams.set('title', `${categoryName} Jobs & Updates`);
  ogUrl.searchParams.set('type', 'category');

  return {
    title,
    description,
    alternates: getSeoAlternates(lang, `/category/${slug}`),
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: title,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogUrl.toString()],
    }
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ lang: Locale, slug: string }> }) {
  const resolvedParams = await params;
  const { lang, slug } = resolvedParams;
  const dict = await getDictionary(lang);
  
  const [category, jobs, settings] = await Promise.all([
    getCategoryBySlug(slug),
    getJobsByCategorySlug(slug),
    getSettings()
  ]);
  const categoryName = category ? category.name[lang] : slug.replace(/-/g, ' ').toUpperCase();
  const pageData = settings.pages?.[`category/${slug}`];
  const contentHtml = typeof pageData?.content_html === 'string'
    ? pageData.content_html
    : pageData?.content_html?.[lang] || pageData?.content_html?.en || '';

  // Generate JSON-LD for CollectionPage
  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'CollectionPage',
    'name': `${categoryName} Jobs`,
    'description': `Latest jobs under ${categoryName}`,
    'url': `https://govjobwala.com/${lang}/category/${slug}`
  };

  // Generate JSON-LD for BreadcrumbList
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': dict.navigation.home || 'Home',
        'item': `https://govjobwala.com/${lang}`
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': categoryName,
        'item': `https://govjobwala.com/${lang}/category/${slug}`
      }
    ]
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-12 font-sans text-gray-800">
      <ScrollToTopOnMount />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center gap-2 text-xs text-gray-500 font-medium">
          <Link href={`/${lang}`} className="hover:text-blue-600 transition-colors">{dict.navigation.home || 'Home'}</Link>
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
          <IncrementalJobsList jobs={jobs} lang={lang as 'en'|'hi'|'mr'} dict={dict} initialCount={15} step={10} />
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

        {/* SEO Custom CMS Content Block */}
        <SeoContentBlock contentHtml={contentHtml} />
      </div>
    </div>
  );
}
