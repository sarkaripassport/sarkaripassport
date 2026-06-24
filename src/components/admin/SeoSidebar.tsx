'use client';

import { useState, useMemo } from 'react';
import { Search, Type, KeyRound, Code, Target, BarChart2, CheckCircle2, XCircle, ChevronDown, ChevronUp, Zap, Radio, Link as LinkIcon } from 'lucide-react';

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
  const [examStatus, setExamStatus] = useState('new'); // new, admit_card, result
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [competitorData, setCompetitorData] = useState<{ title: string, desc: string, missingKw: string[] } | null>(null);
  const [serpView, setSerpView] = useState<'mobile'|'desktop'>('mobile');
  const [showGoogleSettings, setShowGoogleSettings] = useState(false);

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
      "description": metaDescription || "Page description here..."
    }, null, 2);
  }, [postType, title, metaDescription]);

  const analyzeCompetitor = () => {
    if (!competitorUrl) return;
    setIsAnalyzing(true);
    // Mock API call to simulate Python BeautifulSoup scraping
    setTimeout(() => {
      setIsAnalyzing(false);
      setCompetitorData({
        title: "SSC CGL Recruitment 2026 Online Form - SarkariResult",
        desc: "SSC CGL 2026 Notification for 12,256 posts. Check SSC CGL Eligibility, Age Limit, Syllabus, Exam Date and Apply Online.",
        missingKw: ['Syllabus PDF', 'Previous Year Paper', 'Age Relaxation', 'Tier-I Exam Date']
      });
    }, 1500);
  };

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

        {/* Exam Lifecycle (SEO Magic) */}
        <div className="bg-blue-50 -mx-5 px-5 py-4 border-b border-blue-100">
          <label className="block text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">Exam Lifecycle Mode</label>
          <select 
            value={examStatus}
            onChange={(e) => setExamStatus(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-blue-200 rounded-lg outline-none focus:border-[#0A58CA] text-blue-900 font-medium"
          >
            <option value="new">🌟 New Notification (Master Post)</option>
            <option value="admit_card">🎫 Admit Card Released (Update)</option>
            <option value="result">🏆 Result Declared (Update)</option>
          </select>
          <p className="text-[10px] text-blue-700 mt-1.5 leading-tight">Updating a master post retains 100% SEO juice instead of creating weak duplicate pages.</p>
        </div>

        {/* Competitor Analyzer */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-[#0B1B3D] mb-2">
            <Radio className="w-4 h-4 text-red-500" /> Competitor Spy Analyzer
          </label>
          <div className="flex gap-2 mb-2">
            <input 
              type="url" 
              placeholder="Paste sarkariresult.com link..." 
              value={competitorUrl}
              onChange={(e) => setCompetitorUrl(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
            />
            <button 
              onClick={analyzeCompetitor}
              disabled={isAnalyzing}
              className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap hover:bg-black disabled:opacity-50"
            >
              {isAnalyzing ? 'Spying...' : 'Spy URL'}
            </button>
          </div>
          {competitorData && (
            <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-xs space-y-3 mt-3">
              <div>
                <span className="font-bold text-red-800 block mb-1">Competitor Title:</span>
                <div className="bg-white px-2 py-1.5 border border-red-200 rounded text-gray-700">{competitorData.title}</div>
              </div>
              <div>
                <span className="font-bold text-red-800 block mb-1">Competitor Meta Desc:</span>
                <div className="bg-white px-2 py-1.5 border border-red-200 rounded text-gray-700">{competitorData.desc}</div>
              </div>
              <div>
                <span className="font-bold text-red-800 block mb-1">Missing Keywords You Should Add:</span>
                <div className="flex flex-wrap gap-1">
                  {competitorData.missingKw.map(kw => (
                    <span key={kw} className="bg-white text-red-600 px-1.5 py-0.5 rounded border border-red-200 font-medium cursor-pointer hover:bg-red-600 hover:text-white transition-colors" title="Click to copy">{kw}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <hr className="border-gray-100" />

        {/* Live Google SERP Preview */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="flex items-center gap-2 text-sm font-bold text-[#0B1B3D]">
              <Search className="w-4 h-4 text-green-600" /> Live SERP Preview
            </label>
            <div className="flex bg-gray-100 rounded p-0.5">
              <button onClick={() => setSerpView('mobile')} className={`px-2 py-1 text-[10px] font-bold rounded ${serpView === 'mobile' ? 'bg-white shadow-sm text-[#0A58CA]' : 'text-gray-500'}`}>Mobile</button>
              <button onClick={() => setSerpView('desktop')} className={`px-2 py-1 text-[10px] font-bold rounded ${serpView === 'desktop' ? 'bg-white shadow-sm text-[#0A58CA]' : 'text-gray-500'}`}>Desktop</button>
            </div>
          </div>
          
          {/* Preview Card */}
          <div className={`bg-white border border-gray-200 p-3 rounded-lg font-sans ${serpView === 'desktop' ? 'max-w-[600px]' : 'max-w-[375px] mx-auto shadow-sm'}`}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 bg-[#0A58CA] rounded-full flex items-center justify-center text-[10px] font-bold text-white">NP</div>
              <div>
                <div className="text-[12px] text-[#202124] leading-tight">Naukri Passport</div>
                <div className="text-[11px] text-[#4d5156] leading-tight">https://naukripassport.com › job</div>
              </div>
            </div>
            <div className="text-[18px] text-[#1a0dab] font-normal hover:underline leading-tight mb-1 truncate">
              {metaTitle || title || "Your Page Title Goes Here"}
            </div>
            <div className="text-[13px] text-[#4d5156] leading-snug line-clamp-2">
              {metaDescription || "Write a compelling meta description to encourage users to click your link in the search results."}
            </div>
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

        {/* Google Integrations */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <button 
            onClick={() => setShowGoogleSettings(!showGoogleSettings)}
            className="w-full flex items-center justify-between p-3 text-sm font-bold text-[#0B1B3D] hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#FABB05]" /> Google Ecosystem
            </div>
            {showGoogleSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {showGoogleSettings && (
            <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Google Tag Manager (GTM)</label>
                <input type="text" placeholder="GTM-XXXXXXX" className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded outline-none focus:border-[#FABB05]" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase mb-1">Google Analytics 4 (GA4)</label>
                <input type="text" placeholder="G-XXXXXXXXXX" className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded outline-none focus:border-[#FABB05]" />
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded p-2 text-[10px] text-blue-800 leading-tight">
                <span className="font-bold block mb-1">Google Search Console:</span>
                Connected! Real-time clicks and impressions for this URL will appear here once published.
              </div>
            </div>
          )}
        </div>

      </div>
      
      {/* Footer Publishing Actions */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex flex-col gap-2 mb-4">
          <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
            <input type="checkbox" className="rounded text-[#0A58CA]" defaultChecked />
            Instant Indexing (Google + Bing API)
          </label>
          <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
            <input type="checkbox" className="rounded text-[#0A58CA]" defaultChecked />
            Broadcast to Telegram & WhatsApp
          </label>
        </div>
      </div>
    </div>
  );
}
