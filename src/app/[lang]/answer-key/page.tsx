import { getJobs, getSettings, getCategories } from "@/lib/db";
import JobsClient from "@/app/[lang]/jobs/JobsClient";
import type { Metadata } from "next";
import { getDictionary, Locale } from "@/i18n/getDictionary";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  const settings = await getSettings();
  const pageData = settings.pages?.['answer-key'];
  const lang = params.lang || 'en';
  
  if (!pageData) return { title: 'Answer Key' };
  
  return {
    title: pageData.seo.title[lang],
    description: pageData.seo.description[lang],
    keywords: pageData.seo.keywords[lang],
    alternates: {
      canonical: `/${lang}/answer-key`,
      languages: {
        'en': '/en/answer-key',
        'hi': '/hi/answer-key',
        'mr': '/mr/answer-key'
      }
    }
  };
}

export default async function Page({ params }: { params: { lang: Locale } }) {
  const lang = params.lang || 'en';
  const dict = await getDictionary(lang);
  const [jobs, settings, categories] = await Promise.all([
    getJobs(),
    getSettings(),
    getCategories()
  ]);

  const pageData = settings.pages?.['answer-key'];
  
  // Filter jobs by category
  const filterCat = 'Answer Key';
  const filteredJobs = jobs.filter(j => j.category === filterCat || j.categories?.includes(filterCat));

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
      <JobsClient jobs={filteredJobs} categories={categories} lang={lang} dict={dict} pageTitle={dict.navigation.answerKey} pagePath={dict.navigation.answerKey} />
    </>
  );
}
