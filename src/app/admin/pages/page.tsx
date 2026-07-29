"use client";

import { useState, useEffect } from "react";
import { Save, CheckCircle2, FileText, ChevronDown } from "lucide-react";
import type { HomepageSettings, PageSettings, LocalizedString } from "@/lib/db";

const emptyLoc: LocalizedString = { en: "", hi: "", mr: "" };
const defaultPageSettings: PageSettings = {
  seo: { title: emptyLoc, description: emptyLoc, keywords: emptyLoc },
  hero: { title: emptyLoc, subtitle: emptyLoc },
  content_html: emptyLoc
};

const PAGE_KEYS = ['jobs', 'admit-card', 'results', 'answer-key', 'syllabus', 'admission', 'tools'] as const;
type PageKey = typeof PAGE_KEYS[number];

const PAGE_NAMES: Record<PageKey, string> = {
  'jobs': 'Latest Jobs',
  'admit-card': 'Admit Card',
  'results': 'Results',
  'answer-key': 'Answer Key',
  'syllabus': 'Syllabus',
  'admission': 'Admission',
  'tools': 'Tools'
};

export default function PagesManager() {
  const [settings, setSettings] = useState<HomepageSettings | null>(null);
  const [activePage, setActivePage] = useState<PageKey>('jobs');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        // Ensure pages object exists in older databases
        if (!data.pages) {
          data.pages = {
            'jobs': { seo: { title: emptyLoc, description: emptyLoc, keywords: emptyLoc }, hero: { title: emptyLoc, subtitle: emptyLoc }, content_html: emptyLoc },
            'admit-card': { seo: { title: emptyLoc, description: emptyLoc, keywords: emptyLoc }, hero: { title: emptyLoc, subtitle: emptyLoc }, content_html: emptyLoc },
            'results': { seo: { title: emptyLoc, description: emptyLoc, keywords: emptyLoc }, hero: { title: emptyLoc, subtitle: emptyLoc }, content_html: emptyLoc },
            'answer-key': { seo: { title: emptyLoc, description: emptyLoc, keywords: emptyLoc }, hero: { title: emptyLoc, subtitle: emptyLoc }, content_html: emptyLoc },
            'syllabus': { seo: { title: emptyLoc, description: emptyLoc, keywords: emptyLoc }, hero: { title: emptyLoc, subtitle: emptyLoc }, content_html: emptyLoc },
            'admission': { seo: { title: emptyLoc, description: emptyLoc, keywords: emptyLoc }, hero: { title: emptyLoc, subtitle: emptyLoc }, content_html: emptyLoc },
            'tools': { seo: { title: emptyLoc, description: emptyLoc, keywords: emptyLoc }, hero: { title: emptyLoc, subtitle: emptyLoc }, content_html: emptyLoc }
          };
        }
        if (data.pages && !data.pages['tools']) {
          data.pages['tools'] = { seo: { title: emptyLoc, description: emptyLoc, keywords: emptyLoc }, hero: { title: emptyLoc, subtitle: emptyLoc }, content_html: emptyLoc };
        }
        if (data.pages && !data.pages['jobs']) {
          data.pages['jobs'] = { seo: { title: emptyLoc, description: emptyLoc, keywords: emptyLoc }, hero: { title: emptyLoc, subtitle: emptyLoc }, content_html: emptyLoc };
        }
        if (data.pages && !data.pages['admission']) {
          data.pages['admission'] = { seo: { title: emptyLoc, description: emptyLoc, keywords: emptyLoc }, hero: { title: emptyLoc, subtitle: emptyLoc }, content_html: emptyLoc };
        }
        setSettings(data);
      });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      alert('Failed to save settings');
    }
    setIsSaving(false);
  };

  const updatePageSettings = (field: 'seo' | 'hero' | 'content_html', subfield: string, value: string) => {
    if (!settings || !settings.pages) return;
    const current: PageSettings = settings.pages[activePage] || defaultPageSettings;
    const updatedPage: PageSettings = {
      ...current,
      [field]: {
        ...((current as any)[field] || emptyLoc),
        [subfield]: value
      }
    };
    
    setSettings({
      ...settings,
      pages: {
        ...settings.pages,
        [activePage]: updatedPage
      }
    });
  };

  const insertTag = (tag: string, align?: string) => {
    if (!settings || !settings.pages) return;
    const currentPage = settings.pages[activePage] as any;
    const currentHtml = typeof currentPage.content_html === 'string' 
      ? currentPage.content_html 
      : currentPage.content_html?.en || '';
    
    let inserted = '';
    const alignClass = align ? ` className="text-${align}"` : '';
    
    if (tag === 'a') {
      inserted = `<a href="https://example.com" className="text-blue-600 underline font-bold" target="_blank" rel="noopener noreferrer">Link Text</a>`;
    } else {
      inserted = `<${tag}${alignClass}>Enter your ${tag.toUpperCase()} text here...</${tag}>`;
    }
    const newHtml = currentHtml ? `${currentHtml}\n\n${inserted}` : inserted;
    updatePageSettings('content_html', 'en', newHtml);
  };

  if (!settings || !settings.pages) return <div className="p-8">Loading...</div>;

  const currentPageData = settings.pages[activePage] || defaultPageSettings;
  const seoData = currentPageData.seo || defaultPageSettings.seo;
  const heroData = currentPageData.hero || defaultPageSettings.hero;

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#0B1B3D]">Landing Pages Manager</h1>
          <p className="text-gray-500 text-sm mt-1">Manage SEO, hero banner, and rich CMS content blocks for dedicated landing pages.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-[#0A58CA] text-white px-6 py-2.5 rounded-lg font-bold shadow-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-bold">Settings saved successfully!</span>
        </div>
      )}

      {/* Page Selector */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {PAGE_KEYS.map(key => (
          <button
            key={key}
            onClick={() => setActivePage(key)}
            className={`px-5 py-2.5 rounded-lg font-bold text-sm whitespace-nowrap transition-colors flex items-center gap-2 border ${
              activePage === key 
                ? 'bg-[#0A58CA] text-white border-[#0A58CA]' 
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            {PAGE_NAMES[key]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* SEO Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-black text-[#0B1B3D] mb-5 border-b border-gray-100 pb-3">SEO Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Meta Title</label>
              <input 
                type="text" 
                value={typeof seoData.title === 'string' ? seoData.title : seoData.title?.en || ''}
                onChange={(e) => updatePageSettings('seo', 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A58CA] outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Recommended: 50-60 characters</p>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Meta Description</label>
              <textarea 
                rows={3}
                value={typeof seoData.description === 'string' ? seoData.description : seoData.description?.en || ''}
                onChange={(e) => updatePageSettings('seo', 'description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A58CA] outline-none resize-none"
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">Recommended: 150-160 characters</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Keywords</label>
              <input 
                type="text" 
                value={typeof seoData.keywords === 'string' ? seoData.keywords : seoData.keywords?.en || ''}
                onChange={(e) => updatePageSettings('seo', 'keywords', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A58CA] outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Comma separated</p>
            </div>
          </div>
        </div>

        {/* Hero Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-black text-[#0B1B3D] mb-5 border-b border-gray-100 pb-3">Hero Banner</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">H1 Main Heading</label>
              <input 
                type="text" 
                value={typeof heroData.title === 'string' ? heroData.title : heroData.title?.en || ''}
                onChange={(e) => updatePageSettings('hero', 'title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A58CA] outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Subtitle</label>
              <textarea 
                rows={2}
                value={typeof heroData.subtitle === 'string' ? heroData.subtitle : heroData.subtitle?.en || ''}
                onChange={(e) => updatePageSettings('hero', 'subtitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A58CA] outline-none resize-none"
              ></textarea>
            </div>
          </div>
        </div>
        
      </div>

      {/* CMS Rich SEO Content Editor */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-lg font-black text-[#0B1B3D]">CMS SEO Content Editor (H1-H6, P, Link & Alignment)</h2>
            <p className="text-xs text-gray-500 mt-0.5">Write rich multi-block SEO paragraphs to boost page keyword density and search ranking.</p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button type="button" onClick={() => insertTag('h1')} className="px-2 py-1 text-xs font-bold bg-gray-100 hover:bg-gray-200 rounded text-[#0B1B3D]">H1</button>
            <button type="button" onClick={() => insertTag('h2')} className="px-2 py-1 text-xs font-bold bg-gray-100 hover:bg-gray-200 rounded text-[#0B1B3D]">H2</button>
            <button type="button" onClick={() => insertTag('h3')} className="px-2 py-1 text-xs font-bold bg-gray-100 hover:bg-gray-200 rounded text-[#0B1B3D]">H3</button>
            <button type="button" onClick={() => insertTag('h4')} className="px-2 py-1 text-xs font-bold bg-gray-100 hover:bg-gray-200 rounded text-[#0B1B3D]">H4</button>
            <button type="button" onClick={() => insertTag('h5')} className="px-2 py-1 text-xs font-bold bg-gray-100 hover:bg-gray-200 rounded text-[#0B1B3D]">H5</button>
            <button type="button" onClick={() => insertTag('h6')} className="px-2 py-1 text-xs font-bold bg-gray-100 hover:bg-gray-200 rounded text-[#0B1B3D]">H6</button>
            <button type="button" onClick={() => insertTag('p')} className="px-2 py-1 text-xs font-bold bg-gray-100 hover:bg-gray-200 rounded text-[#0B1B3D]">P</button>
            <button type="button" onClick={() => insertTag('a')} className="px-2.5 py-1 text-xs font-bold bg-blue-100 text-blue-700 hover:bg-blue-200 rounded">Link</button>
            <span className="w-px h-4 bg-gray-300 mx-1"></span>
            <button type="button" onClick={() => insertTag('p', 'left')} className="px-2 py-1 text-xs font-bold bg-gray-100 hover:bg-gray-200 rounded text-gray-700">Left</button>
            <button type="button" onClick={() => insertTag('p', 'center')} className="px-2 py-1 text-xs font-bold bg-gray-100 hover:bg-gray-200 rounded text-gray-700">Center</button>
            <button type="button" onClick={() => insertTag('p', 'right')} className="px-2 py-1 text-xs font-bold bg-gray-100 hover:bg-gray-200 rounded text-gray-700">Right</button>
            <button type="button" onClick={() => insertTag('p', 'justify')} className="px-2 py-1 text-xs font-bold bg-gray-100 hover:bg-gray-200 rounded text-gray-700">Justify</button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">HTML Content Block (Supports multiple headings, paragraphs, and hyperlinks)</label>
          <textarea 
            rows={8}
            value={typeof (currentPageData as any).content_html === 'string' ? (currentPageData as any).content_html : (currentPageData as any).content_html?.en || ''}
            onChange={(e) => updatePageSettings('content_html', 'en', e.target.value)}
            placeholder="<h2>About Government Jobs in India</h2><p>GovJobWala is the most reliable source for <a href='/jobs'>sarkari notifications</a>...</p>"
            className="w-full font-mono text-sm px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A58CA] outline-none"
          ></textarea>
          <p className="text-xs text-gray-500 mt-2">Use the toolbar buttons above to insert semantic HTML tags or type raw HTML directly. This content renders at the bottom of the page for rich SEO.</p>
        </div>
      </div>
    </div>
  );
}

