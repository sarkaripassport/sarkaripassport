import { getJobs, getCategories, getPublishedJobs, getSettings } from "@/lib/db";
import JobsClient from "./JobsClient";
import { getDictionary, Locale } from "@/i18n/getDictionary";
import { getSeoAlternates } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';
  const settings = await getSettings();
  const pageData = settings.pages?.['latest-jobs'] || settings.pages?.['jobs'];

  const titles: Record<Locale, string> = {
    en: "Latest Government Jobs 2026 - All New Sarkari Job Vacancies | GovJobWala",
    hi: "लेटेस्ट सरकारी नौकरियां 2026 - नई सरकारी भर्ती और वेकेंसी | GovJobWala",
    mr: "नवीनतम सरकारी नोकऱ्या 2026 - सर्व सरकारी भरती आणि जाहिराती | GovJobWala"
  };

  const descriptions: Record<Locale, string> = {
    en: "Explore 10,000+ latest Sarkari jobs across SSC, UPSC, Railway, Banking, Defense, and State Govt portals. Instant notifications, eligibility criteria, and direct online application links.",
    hi: "SSC, UPSC, रेलवे, बैंकिंग और राज्य सरकार की 10,000+ नई सरकारी नौकरियों की पूरी सूची। योग्यता, अंतिम तिथि और ऑनलाइन आवेदन के सीधे लिंक।",
    mr: "SSC, UPSC, रेल्वे, बँकिंग आणि महाराष्ट्र राज्य सरकारच्या सर्व नवीन सरकारी नोकऱ्या. पात्रता, वयोमर्यादा आणि थेट ऑनलाइन अर्ज लिंक."
  };

  const keywords: Record<Locale, string> = {
    en: "Latest Government Jobs, Sarkari Job 2026, Free Job Alert, Upcoming Govt Vacancies, SSC Jobs, Railway Jobs, Bank Jobs",
    hi: "लेटेस्ट सरकारी नौकरी, नई भर्ती 2026, सरकारी जॉब अलर्ट, एसएससी, यूपीएससी, रेलवे नौकरी",
    mr: "सरकारी नोकरी 2026, महाभरती, सरकारी नोकरी जाहिरात, रेल्वे भरती, बँक भरती"
  };

  const title = pageData?.seo?.title?.[lang] || titles[lang] || titles.en;
  const description = pageData?.seo?.description?.[lang] || descriptions[lang] || descriptions.en;
  const keywordStr = pageData?.seo?.keywords?.[lang] || keywords[lang] || keywords.en;
  const url = `https://govjobwala.com/${lang}/jobs`;

  const ogUrl = new URL('https://govjobwala.com/api/og');
  ogUrl.searchParams.set('title', 'Latest Government Jobs 2026');
  ogUrl.searchParams.set('type', 'jobs');

  return {
    title,
    description,
    keywords: keywordStr,
    alternates: getSeoAlternates(lang, '/jobs'),
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

export const revalidate = 3600;

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'hi' }, { lang: 'mr' }];
}

export default async function JobsListingPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';
  const dict = await getDictionary(lang);
  const [jobs, categories, settings] = await Promise.all([
    getPublishedJobs(),
    getCategories(),
    getSettings()
  ]);
  
  const pageData = settings.pages?.['jobs'] || settings.pages?.['latest-jobs'];
  const contentHtml = typeof pageData?.content_html === 'string' 
    ? pageData?.content_html 
    : pageData?.content_html?.[lang] || pageData?.content_html?.en || '';

  return <JobsClient jobs={jobs} categories={categories} lang={lang} dict={dict} pageTitle={dict.navigation.latestJobs} pagePath={dict.navigation.latestJobs} contentHtml={contentHtml} />;
}
