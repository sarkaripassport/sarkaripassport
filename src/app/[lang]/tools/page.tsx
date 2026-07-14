import { getDictionary } from "@/i18n/getDictionary";
import { Metadata } from "next";
import ToolsClient from "./ToolsClient";
import { getSeoAlternates } from "@/lib/seo";

import { getSettings } from "@/lib/db";

export async function generateMetadata({ params: { lang } }: { params: { lang: string } }): Promise<Metadata> {
  const dict = await getDictionary(lang as any);
  const settings = await getSettings();
  const toolsData = settings.pages?.tools;
  
  if (toolsData) {
    return {
      title: (toolsData.seo.title as any)?.[lang] || toolsData.seo.title?.en || "Online Tools for Govt Jobs",
      description: (toolsData.seo.description as any)?.[lang] || toolsData.seo.description?.en || "Free online tools to resize passport photos, compress PDFs, merge signature and photos for government job application forms. 100% free and secure.",
      keywords: (toolsData.seo.keywords as any)?.[lang] || toolsData.seo.keywords?.en || "image resizer, photo and signature merge, compress pdf, online signature generator",
    };
  }

  return {
    title: (dict as any).seo?.toolsTitle || "Online Tools for Govt Jobs - Resize Photo, Sign, Merge PDF",
    description: (dict as any).seo?.toolsDesc || "Free online tools to resize passport photos, compress PDFs, merge signature and photos for government job application forms. 100% free and secure.",
    keywords: ["image resizer", "photo and signature merge", "compress pdf", "online signature generator", "sarkari job tools"],
    alternates: getSeoAlternates(lang, '/tools')
  };
}

export default async function ToolsPage({ params: { lang } }: { params: { lang: string } }) {
  const dict = await getDictionary(lang as any);
  const settings = await getSettings();
  const toolsData = settings.pages?.tools;
  
  const h1 = (toolsData?.hero?.title as any)?.[lang] || toolsData?.hero?.title?.en || "Candidate Utilities Toolkit";
  const subtitle = (toolsData?.hero?.subtitle as any)?.[lang] || toolsData?.hero?.subtitle?.en || "100% Free, Secure, and Instant. Process your photos and documents directly in your browser. No files are uploaded to our servers!";

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-white to-blue-50 py-12 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-3xl opacity-50 translate-y-1/3 -translate-x-1/4 mix-blend-multiply pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 mb-5 tracking-tight">
            {h1}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-medium leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Tools Client (Tabs & Dynamic Loading) */}
        <div className="bg-white/40 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 p-4 md:p-8">
          <ToolsClient lang={lang} dict={dict} />
        </div>
        
      </div>
    </div>
  );
}
