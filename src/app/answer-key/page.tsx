import { getJobs, getSettings, getCategories } from "@/lib/db";
import JobsClient from "@/app/jobs/JobsClient";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const pageData = settings.pages?.['answer-key'];
  
  if (!pageData) return { title: 'Answer Key' };
  
  return {
    title: pageData.seo.title,
    description: pageData.seo.description,
    keywords: pageData.seo.keywords,
  };
}

export default async function AnswerKeyPage() {
  const [jobs, settings, categories] = await Promise.all([
    getJobs(),
    getSettings(),
    getCategories()
  ]);

  const pageData = settings.pages?.['answer-key'];
  
  // Filter jobs by category "Answer Key"
  const answerKeyJobs = jobs.filter(j => j.category === 'Answer Key');

  return (
    <>
      {pageData && (
        <div className="bg-[#0B1B3D] text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="max-w-7xl mx-auto relative z-10 text-center">
            <h1 className="text-3xl md:text-5xl font-black mb-4">{pageData.hero.title}</h1>
            <p className="text-teal-100 md:text-lg max-w-2xl mx-auto">{pageData.hero.subtitle}</p>
          </div>
        </div>
      )}
      <JobsClient jobs={answerKeyJobs} categories={categories} />
    </>
  );
}
