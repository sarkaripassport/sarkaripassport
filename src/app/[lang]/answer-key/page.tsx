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
  const pageData = settings.pages?.['answer-key'];

  const titles: Record<Locale, string> = {
    en: "Official Answer Keys 2026 - All Govt Exam Question Papers & Solutions | GovJobWala",
    hi: "आंसर की 2026 - सभी सरकारी परीक्षा की उत्तर कुंजी और हल प्रश्न पत्र | GovJobWala",
    mr: "उत्तरतालिका (Answer Key) 2026 - सर्व सरकारी परीक्षा उत्तर सूची | GovJobWala"
  };

  const descriptions: Record<Locale, string> = {
    en: "Download official exam answer keys, solved question papers, and objection portal links for SSC, UPSC, Railway, Police, and State examinations 2026.",
    hi: "SSC, UPSC, रेलवे, पुलिस और राज्य स्तरीय प्रतियोगी परीक्षाओं की आधिकारिक उत्तर कुंजी, हल प्रश्न पत्र और आपत्ति दर्ज करने के लिंक।",
    mr: "SSC, UPSC, रेल्वे, पोलीस आणि महाराष्ट्र सरकारी परीक्षांची अधिकृत उत्तरतालिका (Answer Key) आणि प्रश्नपत्रिका सोप्या पद्धतीने डाउनलोड करा."
  };

  const keywords: Record<Locale, string> = {
    en: "Sarkari Answer Key 2026, Exam Question Papers, Official Answer Key Download, SSC Answer Key, Railway Answer Key",
    hi: "सरकारी आंसर की 2026, सरकारी परीक्षा उत्तर कुंजी, एसएससी आंसर की",
    mr: "सरकारी परीक्षा उत्तरतालिका 2026, Answer Key Download, रेल्वे उत्तर सूची"
  };

  const title = pageData?.seo?.title?.[lang] || titles[lang] || titles.en;
  const description = pageData?.seo?.description?.[lang] || descriptions[lang] || descriptions.en;
  const keywordStr = pageData?.seo?.keywords?.[lang] || keywords[lang] || keywords.en;
  const url = `https://govjobwala.com/${lang}/answer-key`;

  const ogUrl = new URL('https://govjobwala.com/api/og');
  ogUrl.searchParams.set('title', 'Sarkari Exam Answer Keys 2026');
  ogUrl.searchParams.set('type', 'answer-key');

  return {
    title,
    description,
    keywords: keywordStr,
    alternates: getSeoAlternates(lang, '/answer-key'),
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

  const pageData = settings.pages?.['answer-key'];
  
  const filterCat = 'Answer Key';
  const filteredJobs = jobs.filter(j => j.category === filterCat || j.categories?.includes(filterCat));

  const contentHtml = typeof pageData?.content_html === 'string' 
    ? pageData?.content_html 
    : pageData?.content_html?.[lang] || pageData?.content_html?.en || '';

  return (
    <>
      {pageData && (
        <div className="bg-[#0B1B3D] text-white py-6 lg:py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="max-w-7xl mx-auto relative z-10 text-center">
            <h1 className="text-2xl md:text-5xl font-black mb-2 md:mb-4">{pageData.hero.title[lang]}</h1>
            <p className="text-purple-200 md:text-lg max-w-2xl mx-auto">{pageData.hero.subtitle[lang]}</p>
          </div>
        </div>
      )}
      <JobsClient jobs={filteredJobs} categories={categories} lang={lang} dict={dict} pageTitle={dict.navigation.answerKey} pagePath={dict.navigation.answerKey} contentHtml={contentHtml} />
    </>
  );
}
