"use client";

import { useState, useEffect } from "react";
import { Save, CheckCircle2, FileText, ChevronDown } from "lucide-react";
import type { HomepageSettings } from "@/lib/db";

const PAGE_KEYS = ['admit-card', 'results', 'answer-key', 'syllabus'] as const;
type PageKey = typeof PAGE_KEYS[number];

const PAGE_NAMES: Record<PageKey, string> = {
  'admit-card': 'Admit Card',
  'results': 'Results',
  'answer-key': 'Answer Key',
  'syllabus': 'Syllabus'
};

export default function PagesManager() {
  const [settings, setSettings] = useState<HomepageSettings | null>(null);
  const [activePage, setActivePage] = useState<PageKey>('admit-card');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        // Ensure pages object exists in older databases
        if (!data.pages) {
          data.pages = {
            'admit-card': { seo: { title: "", description: "", keywords: "" }, hero: { title: "", subtitle: "" } },
            'results': { seo: { title: "", description: "", keywords: "" }, hero: { title: "", subtitle: "" } },
            'answer-key': { seo: { title: "", description: "", keywords: "" }, hero: { title: "", subtitle: "" } },
            'syllabus': { seo: { title: "", description: "", keywords: "" }, hero: { title: "", subtitle: "" } }
          };
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

  const updatePageSettings = (field: 'seo' | 'hero', subfield: string, value: string) => {
    if (!settings || !settings.pages) return;
    
    setSettings({
      ...settings,
      pages: {
        ...settings.pages,
        [activePage]: {
          ...settings.pages[activePage],
          [field]: {
            ...settings.pages[activePage][field],
            [subfield]: value
          }
        }
      }
    });
  };

  if (!settings || !settings.pages) return <div className="p-8">Loading...</div>;

  const currentPageData = settings.pages[activePage];

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#0B1B3D]">Landing Pages Manager</h1>
          <p className="text-gray-500 text-sm mt-1">Manage SEO and hero content for dedicated category landing pages.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-[#0A58CA] text-white px-6 py-2.5 rounded-lg font-bold shadow-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isSaving ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span> : <Save className="w-4 h-4" />}
          Save Changes
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* SEO Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-black text-[#0B1B3D] mb-5 border-b border-gray-100 pb-3">SEO Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Meta Title</label>
              <input 
                type="text" 
                value={typeof currentPageData.seo.title === 'string' ? currentPageData.seo.title : currentPageData.seo.title?.en || ''}
                onChange={(e) => updatePageSettings('seo', 'title', typeof currentPageData.seo.title === 'string' ? {en: e.target.value, hi: '', mr: ''} : {...(currentPageData.seo.title as any), en: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A58CA] outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Recommended: 50-60 characters</p>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Meta Description</label>
              <textarea 
                rows={3}
                value={typeof currentPageData.seo.description === 'string' ? currentPageData.seo.description : currentPageData.seo.description?.en || ''}
                onChange={(e) => updatePageSettings('seo', 'description', typeof currentPageData.seo.description === 'string' ? {en: e.target.value, hi: '', mr: ''} : {...(currentPageData.seo.description as any), en: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A58CA] outline-none resize-none"
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">Recommended: 150-160 characters</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Keywords</label>
              <input 
                type="text" 
                value={typeof currentPageData.seo.keywords === 'string' ? currentPageData.seo.keywords : currentPageData.seo.keywords?.en || ''}
                onChange={(e) => updatePageSettings('seo', 'keywords', typeof currentPageData.seo.keywords === 'string' ? {en: e.target.value, hi: '', mr: ''} : {...(currentPageData.seo.keywords as any), en: e.target.value})}
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
                value={typeof currentPageData.hero.title === 'string' ? currentPageData.hero.title : currentPageData.hero.title?.en || ''}
                onChange={(e) => updatePageSettings('hero', 'title', typeof currentPageData.hero.title === 'string' ? {en: e.target.value, hi: '', mr: ''} : {...(currentPageData.hero.title as any), en: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A58CA] outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Subtitle</label>
              <textarea 
                rows={2}
                value={typeof currentPageData.hero.subtitle === 'string' ? currentPageData.hero.subtitle : currentPageData.hero.subtitle?.en || ''}
                onChange={(e) => updatePageSettings('hero', 'subtitle', typeof currentPageData.hero.subtitle === 'string' ? {en: e.target.value, hi: '', mr: ''} : {...(currentPageData.hero.subtitle as any), en: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A58CA] outline-none resize-none"
              ></textarea>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
