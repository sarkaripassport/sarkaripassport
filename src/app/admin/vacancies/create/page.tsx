"use client";

import { useState } from "react";
import { Save, UploadCloud, Smartphone, LayoutTemplate, BarChart3, GripVertical } from "lucide-react";

export default function SmartPublisher() {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    metaDescription: "",
    focusKeyword: "",
  });

  // Calculate a basic SEO score based on title and description length
  const calculateSEOScore = () => {
    let score = 0;
    if (formData.title.length > 30 && formData.title.length < 60) score += 30;
    else if (formData.title.length > 0) score += 15;

    if (formData.metaDescription.length > 120 && formData.metaDescription.length < 160) score += 40;
    else if (formData.metaDescription.length > 0) score += 20;

    if (formData.slug.length > 5) score += 10;
    if (formData.focusKeyword.length > 2 && formData.title.toLowerCase().includes(formData.focusKeyword.toLowerCase())) score += 20;

    return Math.min(score, 100);
  };

  const seoScore = calculateSEOScore();

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full pb-10">
      
      {/* Left Column: Editor Zone */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Create New Vacancy</h1>
          <button className="px-4 py-2 bg-brand-navy text-white rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors">
            <Save className="h-4 w-4" /> Save Draft
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="e.g. SSC CGL Recruitment 2026"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization *</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-blue" placeholder="e.g. Staff Selection Commission" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Vacancies</label>
              <input type="number" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-blue" placeholder="e.g. 7500" />
            </div>
          </div>

          {/* Drag & Drop PDF Upload (Simulated UI) */}
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
            <div className="h-12 w-12 bg-blue-100 text-brand-blue rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <UploadCloud className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Upload Official Notification (PDF)</h3>
            <p className="text-xs text-gray-500 mt-1">Drag and drop file here, or click to browse.</p>
          </div>

          {/* Draggable Sections Concept */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3 border-b pb-2">Content Sections (Drag to Reorder)</h3>
            <div className="space-y-3">
              {['Important Dates', 'Application Fee', 'Vacancy Details'].map((section, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-lg cursor-move hover:border-gray-300 transition-colors">
                  <GripVertical className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{section} Form Data...</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Right Column: SEO Smart Sidebar */}
      <div className="w-full lg:w-96 space-y-6">
        
        {/* SEO Score Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-brand-blue" /> SEO Score
          </h2>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="relative h-16 w-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-gray-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className={`${seoScore > 70 ? 'text-green-500' : seoScore > 40 ? 'text-orange-500' : 'text-red-500'}`} strokeDasharray={`${seoScore}, 100`} strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <span className="absolute text-lg font-bold text-gray-800">{seoScore}</span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">
                {seoScore > 80 ? "Excellent" : seoScore > 50 ? "Needs Improvement" : "Poor"}
              </p>
              <p className="text-xs text-gray-500">Optimize fields below to improve.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">URL Slug</label>
              <input type="text" className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md outline-none focus:ring-1 focus:ring-brand-blue" placeholder="ssc-cgl-2026" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Focus Keyword</label>
              <input type="text" className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md outline-none focus:ring-1 focus:ring-brand-blue" placeholder="e.g. SSC CGL" value={formData.focusKeyword} onChange={(e) => setFormData({...formData, focusKeyword: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Meta Description</label>
              <textarea className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md outline-none focus:ring-1 focus:ring-brand-blue h-20" placeholder="A compelling summary for Google Search..." value={formData.metaDescription} onChange={(e) => setFormData({...formData, metaDescription: e.target.value})}></textarea>
              <span className={`text-[10px] ${formData.metaDescription.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>{formData.metaDescription.length} / 160 chars</span>
            </div>
          </div>
        </div>

        {/* Live Previews */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center gap-2">
            <LayoutTemplate className="h-4 w-4 text-gray-500" />
            <h3 className="text-sm font-bold text-gray-900">Live Previews</h3>
          </div>
          
          <div className="p-4 space-y-6">
            {/* Google SERP Preview */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Google Search</p>
              <div className="p-3 bg-white border border-gray-200 rounded-lg">
                <p className="text-[12px] text-gray-800 break-all mb-1">https://naukripassport.com/jobs/{formData.slug || 'slug'}</p>
                <h4 className="text-blue-700 font-medium text-sm hover:underline cursor-pointer">{formData.title || 'Your Job Title Here'}</h4>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{formData.metaDescription || 'Your meta description will appear here. Make it descriptive and include the focus keyword to attract applicants.'}</p>
              </div>
            </div>

            {/* Mobile View Preview (Simulated Frame) */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1"><Smartphone className="h-3 w-3" /> Mobile App View</p>
              <div className="mx-auto w-[240px] h-[360px] border-[6px] border-gray-900 rounded-3xl overflow-hidden relative bg-gray-50 shadow-inner flex flex-col">
                <div className="bg-brand-navy p-3 text-white">
                  <h5 className="text-[10px] font-bold opacity-70">Naukri Passport</h5>
                  <h4 className="text-sm font-bold mt-1 leading-tight line-clamp-2">{formData.title || 'Job Title Preview'}</h4>
                </div>
                <div className="p-3 space-y-2">
                  <div className="h-12 w-full bg-white rounded shadow-sm border border-gray-100"></div>
                  <div className="h-12 w-full bg-white rounded shadow-sm border border-gray-100"></div>
                  <div className="h-24 w-full bg-white rounded shadow-sm border border-gray-100"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
