import ComingSoon from '@/components/ui/ComingSoon';
import type { Metadata } from 'next';
import { getDictionary, Locale } from "@/i18n/getDictionary";
import { getSeoAlternates } from "@/lib/seo";
import { getSettings } from "@/lib/db";

export const revalidate = 3600;

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'hi' }, { lang: 'mr' }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';
  const settings = await getSettings();
  const pageData = settings.pages?.['admission'];

  const titles: Record<Locale, string> = {
    en: "Admission 2026 - All Govt College, University & Entrance Exam Forms | GovJobWala",
    hi: "एडमिशन 2026 - सभी सरकारी कॉलेज, विश्वविद्यालय और प्रवेश परीक्षा फॉर्म | GovJobWala",
    mr: "प्रवेश प्रक्रिया 2026 - सर्व सरकारी महाविद्यालय व प्रवेश परीक्षा फॉर्म | GovJobWala"
  };

  const descriptions: Record<Locale, string> = {
    en: "Apply online for government university admissions, entrance exams, IIT JEE, NEET, CUET, Polytechnic, ITI, and B.Ed course admission forms 2026.",
    hi: "सरकारी विश्वविद्यालय प्रवेश, प्रवेश परीक्षा, IIT JEE, NEET, CUET, पॉलिटेक्निक, ITI और B.Ed कोर्स एडमिशन 2026 के लिए ऑनलाइन आवेदन करें।",
    mr: "सरकारी विद्यापीठ प्रवेश, सामाईक प्रवेश परीक्षा (CET), इंजिनीअरिंग, वैद्यकीय व पदवी अभ्यासक्रम प्रवेश प्रक्रिया 2026 साठी ऑनलाइन अर्ज करा."
  };

  const keywords: Record<Locale, string> = {
    en: "Sarkari Admission 2026, Govt College Admission Form, Entrance Exam Dates, CUET Form, Polytechnic Form, ITI Admission",
    hi: "सरकारी एडमिशन 2026, सरकारी कॉलेज एडमिशन फॉर्म, प्रवेश परीक्षा 2026",
    mr: "सरकारी प्रवेश प्रक्रिया 2026, कॉलेज प्रवेश फॉर्म, CET प्रवेश परीक्षा"
  };

  const title = pageData?.seo?.title?.[lang] || titles[lang] || titles.en;
  const description = pageData?.seo?.description?.[lang] || descriptions[lang] || descriptions.en;
  const keywordStr = pageData?.seo?.keywords?.[lang] || keywords[lang] || keywords.en;
  const url = `https://govjobwala.com/${lang}/admission`;

  const ogUrl = new URL('https://govjobwala.com/api/og');
  ogUrl.searchParams.set('title', 'Sarkari College & University Admissions 2026');
  ogUrl.searchParams.set('type', 'admission');

  return {
    title,
    description,
    keywords: keywordStr,
    alternates: getSeoAlternates(lang, '/admission'),
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

import JobsClient from "@/app/[lang]/jobs/JobsClient";
import { getPublishedJobs, getCategories } from "@/lib/db";

export default async function AdmissionPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';
  const dict = await getDictionary(lang);
  const [jobs, settings, categories] = await Promise.all([
    getPublishedJobs(),
    getSettings(),
    getCategories()
  ]);

  const pageData = settings.pages?.['admission'];
  const filterCat = 'Admission';
  const filteredJobs = jobs.filter(j => j.category === filterCat || j.categories?.includes(filterCat));

  const contentHtml = typeof pageData?.content_html === 'string' 
    ? pageData?.content_html 
    : pageData?.content_html?.[lang] || pageData?.content_html?.en || '';

  return (
    <>
      {pageData && (
        <div className="bg-[#0B1B3D] text-white py-6 lg:py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="max-w-7xl mx-auto relative z-10 text-center">
            <h1 className="text-2xl md:text-5xl font-black mb-2 md:mb-4">{pageData.hero?.title?.[lang] || "Admission 2026"}</h1>
            <p className="text-blue-200 md:text-lg max-w-2xl mx-auto">{pageData.hero?.subtitle?.[lang] || "Latest Govt College & University Admissions"}</p>
          </div>
        </div>
      )}
      <JobsClient jobs={filteredJobs} categories={categories} lang={lang} dict={dict} pageTitle={dict.navigation.admission || "Admission"} pagePath={dict.navigation.admission || "Admission"} contentHtml={contentHtml} />
    </>
  );
}
