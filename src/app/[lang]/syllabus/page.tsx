import { getJobs, getSettings, getCategories, getPublishedJobs } from "@/lib/db";
import { getSeoAlternates } from "@/lib/seo";
import JobsClient from "@/app/[lang]/jobs/JobsClient";
import type { Metadata } from "next";
import { getDictionary, Locale } from "@/i18n/getDictionary";

export const revalidate = 3600;

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'hi' }, { lang: 'mr' }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';
  const settings = await getSettings();
  const pageData = settings.pages?.['syllabus'];

  const titles: Record<Locale, string> = {
    en: "Syllabus 2026 - All Govt Exam Syllabus & Exam Patterns PDF | GovJobWala",
    hi: "सिलेबस 2026 - सभी सरकारी परीक्षा पाठ्यक्रम और परीक्षा पैटर्न PDF | GovJobWala",
    mr: "अभ्यासक्रम (Syllabus) 2026 - सर्व सरकारी परीक्षा अभ्यासक्रम व परीक्षा स्वरूप | GovJobWala"
  };

  const descriptions: Record<Locale, string> = {
    en: "Download complete exam syllabus, subject-wise topics, and latest exam patterns PDF for SSC, UPSC, Railway, Banking, Police, and Defense exams 2026.",
    hi: "SSC, UPSC, रेलवे, पुलिस, और बैंकिंग भर्ती परीक्षा 2026 के लिए विषयवार पूरा पाठ्यक्रम (Syllabus) और परीक्षा पैटर्न PDF डाउनलोड करें।",
    mr: "SSC, UPSC, रेल्वे, पोलीस आणि महाराष्ट्र सरकारी भरती परीक्षा 2026 साठी संपूर्ण अभ्यासक्रम (Syllabus) व परीक्षा स्वरूप PDF डाउनलोड करा."
  };

  const keywords: Record<Locale, string> = {
    en: "Sarkari Exam Syllabus 2026, Govt Exam Pattern PDF, SSC Syllabus, UPSC Syllabus, Railway Exam Syllabus, Topic Wise Syllabus",
    hi: "सरकारी परीक्षा सिलेबस 2026, परीक्षा पैटर्न PDF, एसएससी सिलेबस, रेलवे परीक्षा सिलेबस",
    mr: "सरकारी परीक्षा अभ्यासक्रम 2026, Syllabus PDF Download, रेल्वे अभ्यासक्रम"
  };

  const title = pageData?.seo?.title?.[lang] || titles[lang] || titles.en;
  const description = pageData?.seo?.description?.[lang] || descriptions[lang] || descriptions.en;
  const keywordStr = pageData?.seo?.keywords?.[lang] || keywords[lang] || keywords.en;
  const url = `https://govjobwala.com/${lang}/syllabus`;

  const ogUrl = new URL('https://govjobwala.com/api/og');
  ogUrl.searchParams.set('title', 'Sarkari Exam Syllabus & Patterns 2026');
  ogUrl.searchParams.set('type', 'syllabus');

  return {
    title,
    description,
    keywords: keywordStr,
    alternates: getSeoAlternates(lang, '/syllabus'),
    openGraph: {
      title,
      description,
      url,
      siteName: 'GovJobWala',
      locale: `${lang}_IN`,
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
  };
}

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';
  const dict = await getDictionary(lang);
  const [jobs, settings, categories] = await Promise.all([
    getPublishedJobs(),
    getSettings(),
    getCategories()
  ]);

  const pageData = settings.pages?.['syllabus'];
  
  const filterCat = 'Syllabus';
  const filteredJobs = jobs.filter(j => j.category === filterCat || j.categories?.includes(filterCat));

  const contentHtml = typeof pageData?.content_html === 'string' 
    ? pageData?.content_html 
    : pageData?.content_html?.[lang] || pageData?.content_html?.en || '';

  return (
    <>
      {pageData && (
        <div className="bg-[#0B1B3D] text-white py-6 lg:py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="max-w-7xl mx-auto relative z-10 text-center">
            <h1 className="text-2xl md:text-5xl font-black mb-2 md:mb-4">{pageData.hero.title[lang]}</h1>
            <p className="text-yellow-200 md:text-lg max-w-2xl mx-auto">{pageData.hero.subtitle[lang]}</p>
          </div>
        </div>
      )}
      <JobsClient jobs={filteredJobs} categories={categories} lang={lang} dict={dict} pageTitle={dict.navigation.syllabus} pagePath={dict.navigation.syllabus} contentHtml={contentHtml} />
    </>
  );
}
