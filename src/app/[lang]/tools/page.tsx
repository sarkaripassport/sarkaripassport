import { getDictionary } from "@/i18n/getDictionary";
import { Metadata } from "next";
import ToolsClient from "./ToolsClient";

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
  };
}

export default async function ToolsPage({ params: { lang } }: { params: { lang: string } }) {
  const dict = await getDictionary(lang as any);
  const settings = await getSettings();
  const toolsData = settings.pages?.tools;
  
  const h1 = (toolsData?.hero?.title as any)?.[lang] || toolsData?.hero?.title?.en || "Candidate Utilities Toolkit";
  const subtitle = (toolsData?.hero?.subtitle as any)?.[lang] || toolsData?.hero?.subtitle?.en || "100% Free, Secure, and Instant. Process your photos and documents directly in your browser. No files are uploaded to our servers!";

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B1B3D] mb-4">
            {h1}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Tools Client (Tabs & Dynamic Loading) */}
        <ToolsClient lang={lang} dict={dict} />
        
      </div>
    </div>
  );
}
