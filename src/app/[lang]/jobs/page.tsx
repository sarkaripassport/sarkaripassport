import { getJobs, getCategories, getPublishedJobs } from "@/lib/db";
import JobsClient from "./JobsClient";
import { getDictionary, Locale } from "@/i18n/getDictionary";
import { getSeoAlternates } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';
  return {
    title: "Latest Jobs | GovJobWala",
    alternates: getSeoAlternates(lang, '/jobs')
  };
}

export const revalidate = 3600;

export default async function JobsListingPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang || 'en';
  const dict = await getDictionary(lang);
  const [jobs, categories] = await Promise.all([
    getPublishedJobs(),
    getCategories()
  ]);
  
  return <JobsClient jobs={jobs} categories={categories} lang={lang} dict={dict} pageTitle={dict.navigation.latestJobs} pagePath={dict.navigation.latestJobs} />;
}
