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
  const pageData = settings.pages?.['results'];

  const titles: Record<Locale, string> = {
    en: "Sarkari Exam Results 2026 - Check All Govt Exam Merit Lists | GovJobWala",
    hi: "सरकारी रिजल्ट 2026 - सभी सरकारी परीक्षा परिणाम और मेरिट लिस्ट | GovJobWala",
    mr: "सरकारी निकाल 2026 - सर्व परीक्षा निकाल व गुणवत्ता यादी | GovJobWala"
  };

  const descriptions: Record<Locale, string> = {
    en: "Check live government exam results, merit lists, and cut-off marks for SSC, UPSC, Railway, Banking, Defense, and State level Sarkari examinations 2026.",
    hi: "SSC, UPSC, रेलवे, पुलिस, बैंकिंग और राज्य सरकार की सभी प्रतियोगी परीक्षाओं के परिणाम, मेरिट लिस्ट और कट-ऑफ मार्क्स तुरंत देखें।",
    mr: "SSC, UPSC, रेल्वे, पोलीस व बँकिंग भरती परीक्षांचे सर्व निकाल, गुणवत्ता यादी आणि कट-ऑफ मार्क्स येथे तपासा."
  };

  const keywords: Record<Locale, string> = {
    en: "Sarkari Result 2026, Govt Exam Merit List, SSC Result, Railway Exam Result, UPSC Final Result, Cut Off Marks",
    hi: "सरकारी रिजल्ट 2026, सरकारी परीक्षा परिणाम, एसएससी रिजल्ट, रेलवे रिजल्ट",
    mr: "सरकारी निकाल 2026, महाभरती निकाल, परीक्षा निकाल, रेल्वे निकाल"
  };

  const title = pageData?.seo?.title?.[lang] || titles[lang] || titles.en;
  const description = pageData?.seo?.description?.[lang] || descriptions[lang] || descriptions.en;
  const keywordStr = pageData?.seo?.keywords?.[lang] || keywords[lang] || keywords.en;
  const url = `https://govjobwala.com/${lang}/results`;

  const ogUrl = new URL('https://govjobwala.com/api/og');
  ogUrl.searchParams.set('title', 'Sarkari Exam Results 2026');
  ogUrl.searchParams.set('type', 'results');

  return {
    title,
    description,
    keywords: keywordStr,
    alternates: getSeoAlternates(lang, '/results'),
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

  const pageData = settings.pages?.['results'];
  
  const filterCat = 'Result';
  const filteredJobs = jobs.filter(j => j.category === filterCat || j.categories?.includes(filterCat));

  const contentHtml = typeof pageData?.content_html === 'string' 
    ? pageData?.content_html 
    : pageData?.content_html?.[lang] || pageData?.content_html?.en || '';

  return (
    <>
      {pageData && (
        <div className="bg-[#0B1B3D] text-white py-6 lg:py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="max-w-7xl mx-auto relative z-10 text-center">
            <h1 className="text-2xl md:text-5xl font-black mb-2 md:mb-4">{pageData.hero.title[lang]}</h1>
            <p className="text-green-200 md:text-lg max-w-2xl mx-auto">{pageData.hero.subtitle[lang]}</p>
          </div>
        </div>
      )}
      <JobsClient jobs={filteredJobs} categories={categories} lang={lang} dict={dict} pageTitle={dict.navigation.results} pagePath={dict.navigation.results} contentHtml={contentHtml} />
    </>
  );
}
