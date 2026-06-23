'use client';

import { useState } from 'react';
import { Eye, Save, Settings, LayoutTemplate, Calendar, HelpCircle } from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';
import SeoSidebar from '@/components/admin/SeoSidebar';
import DynamicVacancyMatrix from '@/components/admin/DynamicVacancyMatrix';
import DynamicFeeMatrix from '@/components/admin/DynamicFeeMatrix';

export default function AdvancedEditorPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [focusKeyword, setFocusKeyword] = useState('');
  const [postType, setPostType] = useState('job'); // 'job' or 'page'
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="font-sans text-gray-800 flex flex-col h-full">
      
      {/* Editor Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0A58CA] text-white rounded-lg flex items-center justify-center shadow-md">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-[#0B1B3D] leading-none">Advanced CMS Editor</h1>
              <span className="text-xs text-gray-500 font-medium">Create and optimize beautiful content</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowPreview(!showPreview)}
              className={`px-4 py-2 text-sm font-bold rounded-lg border flex items-center gap-2 transition-colors ${showPreview ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              <Eye className="w-4 h-4" />
              {showPreview ? 'Hide Preview' : 'Live Preview'}
            </button>
            <button className="px-5 py-2 bg-[#0A58CA] text-white text-sm font-bold rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-md transition-colors">
              <Save className="w-4 h-4" />
              Publish
            </button>
          </div>
        </div>
      </div>

      <main className="flex-grow max-w-[1600px] w-full mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Main Writing Area (Left Column) */}
          <div className="flex-grow w-full space-y-6">
            
            {/* Title Input */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <input 
                type="text" 
                placeholder="Add title..." 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-3xl font-black text-[#0B1B3D] placeholder:text-gray-300 outline-none bg-transparent"
              />
            </div>

            {/* Dedicated Sarkari Widgets (Dates & Fees) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Important Dates Widget */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden h-full">
                <div className="bg-blue-50 border-b border-blue-100 py-2.5 px-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#0A58CA]" />
                  <span className="text-xs font-bold text-[#0B1B3D] uppercase tracking-wider">Important Dates</span>
                </div>
                <div className="p-4 space-y-3 flex-1 overflow-y-auto">
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-bold text-gray-500 w-32">Application Start</label>
                    <input type="date" className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-sm focus:border-[#0A58CA] outline-none" />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-bold text-gray-500 w-32">Last Date Apply</label>
                    <input type="date" className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-sm focus:border-[#0A58CA] outline-none" />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-bold text-gray-500 w-32">Pay Fee Last Date</label>
                    <input type="date" className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-sm focus:border-[#0A58CA] outline-none" />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-bold text-gray-500 w-32">Correction Date</label>
                    <input type="text" placeholder="e.g. 10-12 Oct 2026" className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-sm focus:border-[#0A58CA] outline-none" />
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-bold text-gray-500 w-32">Exam Date</label>
                    <input type="text" placeholder="e.g. As per schedule" className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-sm focus:border-[#0A58CA] outline-none" />
                  </div>
                </div>
              </div>

              {/* Dynamic Application Fees Widget */}
              <DynamicFeeMatrix />
            </div>

            {/* Rich Text Editor */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 py-2.5 px-4 flex items-center gap-2">
                <Settings className="w-4 h-4 text-gray-500" />
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Content Editor</span>
              </div>
              <div className="p-4">
                <RichTextEditor content={content} onChange={setContent} />
              </div>
            </div>

            {/* Dynamic Vacancy Engine Block */}
            <DynamicVacancyMatrix />

            {/* FAQ & Schema Builder Block */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-amber-50 border-b border-amber-100 py-2.5 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">FAQ Schema Generator (SEO)</span>
                </div>
                <span className="text-[10px] font-bold bg-amber-200 text-amber-800 px-2 py-0.5 rounded uppercase">Auto JSON-LD</span>
              </div>
              <div className="p-4 space-y-4">
                <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <input type="text" placeholder="Question 1 (e.g. What is the last date to apply?)" className="w-full bg-white border border-gray-200 rounded px-3 py-1.5 text-sm mb-2 font-semibold" />
                  <textarea placeholder="Answer 1" rows={2} className="w-full bg-white border border-gray-200 rounded px-3 py-1.5 text-sm resize-none"></textarea>
                </div>
                <button className="text-sm font-bold text-[#0A58CA] hover:underline">+ Add another FAQ</button>
              </div>
            </div>

            {/* Live Preview Toggle Area */}
            {showPreview && (
              <div className="bg-white rounded-xl border-2 border-indigo-200 shadow-lg overflow-hidden mt-8">
                <div className="bg-indigo-50 border-b border-indigo-100 py-2.5 px-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-800">
                    <Eye className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Frontend Live Preview</span>
                  </div>
                  <span className="text-[10px] font-bold bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded uppercase">Real-time</span>
                </div>
                <div className="p-8 prose prose-blue max-w-none text-gray-800">
                  {title && <h1 className="text-3xl font-extrabold text-[#0B1B3D] mb-6">{title}</h1>}
                  {!title && !content && <div className="text-gray-400 italic text-center py-10">Start typing to see preview...</div>}
                  <div dangerouslySetInnerHTML={{ __html: content }} />
                </div>
              </div>
            )}
          </div>

          {/* SEO & Settings Sidebar (Right Column) */}
          <div className="w-full lg:w-[400px] shrink-0 sticky top-[140px]">
            <SeoSidebar 
              title={title}
              content={content}
              metaTitle={metaTitle}
              setMetaTitle={setMetaTitle}
              metaDescription={metaDescription}
              setMetaDescription={setMetaDescription}
              focusKeyword={focusKeyword}
              setFocusKeyword={setFocusKeyword}
              postType={postType}
              setPostType={setPostType}
            />
          </div>
          
        </div>
      </main>
      
    </div>
  );
}
