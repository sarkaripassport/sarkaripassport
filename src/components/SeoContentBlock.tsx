import React from 'react';

interface SeoContentBlockProps {
  contentHtml?: string;
  className?: string;
}

export default function SeoContentBlock({ contentHtml, className = "" }: SeoContentBlockProps) {
  if (!contentHtml || !contentHtml.trim()) {
    return null;
  }

  return (
    <section 
      className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 mt-8 text-gray-700 leading-relaxed seo-rich-content ${className}`}
    >
      <div 
        className="prose prose-blue max-w-none 
          prose-headings:font-extrabold prose-headings:text-[#0B1B3D] prose-headings:tracking-tight 
          prose-h1:text-2xl sm:prose-h1:text-3xl prose-h1:mb-4 prose-h1:border-b prose-h1:border-gray-100 prose-h1:pb-2
          prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-6 prose-h2:mb-3
          prose-h3:text-lg sm:prose-h3:text-xl prose-h3:mt-4 prose-h3:mb-2
          prose-h4:text-base sm:prose-h4:text-lg
          prose-p:text-sm sm:prose-p:text-base prose-p:mb-4 prose-p:text-gray-600
          prose-a:text-[#0A58CA] prose-a:font-bold prose-a:underline hover:prose-a:text-blue-800 transition-colors
          prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5
          prose-li:mb-1 prose-li:text-sm sm:prose-li:text-base"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </section>
  );
}
