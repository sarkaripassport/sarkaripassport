'use client';

import { useState, useMemo } from 'react';
import { Search, Type, KeyRound, Code, Target, BarChart2, CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface SeoSidebarProps {
  title: string;
  content: string;
  metaTitle: string;
  setMetaTitle: (val: string) => void;
  metaDescription: string;
  setMetaDescription: (val: string) => void;
  focusKeyword: string;
  setFocusKeyword: (val: string) => void;
  postType: string;
  setPostType: (val: string) => void;
}

export default function SeoSidebar({
  title, content, metaTitle, setMetaTitle, metaDescription, setMetaDescription, focusKeyword, setFocusKeyword, postType, setPostType
}: SeoSidebarProps) {
  const [showSchema, setShowSchema] = useState(false);

  // --- Real-time SEO Calculations ---
  
  // Clean HTML to get plain text word count
  const plainTextContent = content.replace(/<[^>]+>/g, ' ');
  const wordCount = plainTextContent.trim().split(/\s+/).filter(w => w.length > 0).length;
  
  // Keyword matching
  const hasKeyword = focusKeyword.trim().length > 0;
  const keywordInTitle = hasKeyword && title.toLowerCase().includes(focusKeyword.toLowerCase());
  const keywordInMetaDesc = hasKeyword && metaDescription.toLowerCase().includes(focusKeyword.toLowerCase());
  const keywordInContent = hasKeyword && plainTextContent.toLowerCase().includes(focusKeyword.toLowerCase());

  // Length checks
  const titleLengthOk = metaTitle.length >= 40 && metaTitle.length <= 60;
  const descLengthOk = metaDescription.length >= 120 && metaDescription.length <= 160;

  // Calculate overall score (0-100)
  const seoScore = useMemo(() => {
    let score = 20; // Base score
    if (hasKeyword) score += 10;
    if (keywordInTitle) score += 15;
    if (keywordInMetaDesc) score += 15;
    if (keywordInContent) score += 20;
    if (titleLengthOk) score += 10;
    if (descLengthOk) score += 10;
    return score;
  }, [hasKeyword, keywordInTitle, keywordInMetaDesc, keywordInContent, titleLengthOk, descLengthOk]);

  const scoreColor = seoScore >= 80 ? 'text-green-600' : seoScore >= 50 ? 'text-amber-500' : 'text-red-500';
  const scoreBg = seoScore >= 80 ? 'bg-green-100' : seoScore >= 50 ? 'bg-amber-100' : 'bg-red-100';
  const scoreBorder = seoScore >= 80 ? 'border-green-200' : seoScore >= 50 ? 'border-amber-200' : 'border-red-200';

  // Schema Generation (Preview)
  const schemaMarkup = useMemo(() => {
    if (postType === 'job') {
      return JSON.stringify({
        "@context": "https://schema.org/",
        "@type": "JobPosting",
        "title": title || "Job Title",
        "description": metaDescription || "Job description here...",
        "datePosted": new Date().toISOString().split('T')[0],
        "hiringOrganization": {
          "@type": "Organization",
          "name": "Sarkari Passport Hiring Partner"
        }
      }, null, 2);
    }
    return JSON.stringify({
      "@context": "https://schema.org/",
      "@type": "WebPage",
      "name": title || "Page Title",
      "description": metaDescription || "Page description here..."
    }, null, 2);
  }, [postType, title, metaDescription]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 text-white">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-blue-400" />
          <h2 className="font-bold tracking-wide">SEO Inspector</h2>
        </div>
        
        {/* Real-time Score Gauge */}
        <div className={`p-4 rounded-xl border ${scoreBg} ${scoreBorder} flex items-center justify-between`}>
          <div>
            <div className={`text-xs font-bold uppercase tracking-widest ${scoreColor} mb-1`}>SEO Score</div>
            <div className={`text-3xl font-black leading-none ${scoreColor}`}>{seoScore}/100</div>
          </div>
          <BarChart2 className={`w-10 h-10 ${scoreColor} opacity-50`} />
        </div>
      </div>

      <div className="p-5 space-y-6 flex-grow overflow-y-auto max-h-[calc(100vh-200px)] custom-scrollbar">
        
        {/* Post Type Settings */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Schema / Post Type</label>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button 
              onClick={() => setPostType('job')}
              className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-all ${postType === 'job' ? 'bg-white text-[#0A58CA] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Job Post
            </button>
            <button 
              onClick={() => setPostType('page')}
              className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-all ${postType === 'page' ? 'bg-white text-[#0A58CA] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Generic Page
            </button>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Focus Keyword */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-[#0B1B3D] mb-2">
            <KeyRound className="w-4 h-4 text-[#0A58CA]" /> Focus Keyword
          </label>
          <input 
            type="text" 
            value={focusKeyword}
            onChange={(e) => setFocusKeyword(e.target.value)}
            placeholder="e.g., SSC CGL Recruitment 2026"
            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0A58CA] focus:bg-white transition-all"
          />
        </div>

        {/* SEO Meta Data */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-end mb-1">
              <label className="text-sm font-bold text-[#0B1B3D]">Meta Title</label>
              <span className={`text-[10px] font-bold ${titleLengthOk ? 'text-green-600' : 'text-amber-500'}`}>{metaTitle.length} / 60</span>
            </div>
            <input 
              type="text" 
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#0A58CA]"
            />
            <div className="w-full h-1 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
              <div className={`h-full rounded-full transition-all ${titleLengthOk ? 'bg-green-500' : 'bg-amber-400'}`} style={{ width: `${Math.min((metaTitle.length / 60) * 100, 100)}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end mb-1">
              <label className="text-sm font-bold text-[#0B1B3D]">Meta Description</label>
              <span className={`text-[10px] font-bold ${descLengthOk ? 'text-green-600' : 'text-amber-500'}`}>{metaDescription.length} / 160</span>
            </div>
            <textarea 
              rows={3}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#0A58CA] resize-none"
            />
            <div className="w-full h-1 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
              <div className={`h-full rounded-full transition-all ${descLengthOk ? 'bg-green-500' : 'bg-amber-400'}`} style={{ width: `${Math.min((metaDescription.length / 160) * 100, 100)}%` }}></div>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Readability & Analysis Checklist */}
        <div>
          <h3 className="text-sm font-bold text-[#0B1B3D] mb-3 flex items-center gap-2">
            <Search className="w-4 h-4 text-[#0A58CA]" /> Analysis Results
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li className="flex items-start gap-2">
              {wordCount > 100 ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
              <span className="text-gray-600 leading-tight">Word count: {wordCount} words (Recommended: 300+)</span>
            </li>
            <li className="flex items-start gap-2">
              {keywordInTitle ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />}
              <span className="text-gray-600 leading-tight">Focus keyword in SEO title</span>
            </li>
            <li className="flex items-start gap-2">
              {keywordInMetaDesc ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />}
              <span className="text-gray-600 leading-tight">Focus keyword in Meta description</span>
            </li>
            <li className="flex items-start gap-2">
              {keywordInContent ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />}
              <span className="text-gray-600 leading-tight">Focus keyword in Content</span>
            </li>
          </ul>
        </div>

        {/* Schema Markup Generator */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
          <button 
            onClick={() => setShowSchema(!showSchema)}
            className="w-full flex items-center justify-between p-3 text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-[#0A58CA]" /> Generate Schema (JSON-LD)
            </div>
            {showSchema ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {showSchema && (
            <div className="p-3 bg-slate-900 border-t border-gray-200">
              <pre className="text-[10px] text-green-400 font-mono whitespace-pre-wrap overflow-x-auto">
                {schemaMarkup}
              </pre>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
