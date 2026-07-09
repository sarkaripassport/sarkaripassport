"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, Save, Send, Settings, ShieldCheck, PieChart, Info, Image, Type } from "lucide-react";
import RichTextEditor from "@/components/admin/RichTextEditor";
import Link from "next/link";

export default function SmartPublisherPage() {
  const [content, setContent] = useState("<p>Write the job details here...</p>");

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
      
      {/* Main Editor Area */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#0B1B3D]">Create New Job Post</h1>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 flex items-center gap-2 shadow-sm">
              <Save className="w-4 h-4" /> Save Draft
            </button>
            <button className="px-4 py-2 bg-[#0A58CA] text-white font-bold rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-md">
              <Send className="w-4 h-4" /> Publish Now
            </button>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#0B1B3D] mb-1">Post Title <span className="text-red-500">*</span></label>
            <input type="text" placeholder="e.g. SSC CGL 2026 Recruitment" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0A58CA] text-lg font-bold text-gray-800" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
              <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none text-sm"><option>Central Govt</option><option>State Govt</option></select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Status</label>
              <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none text-sm"><option>Active</option><option>Upcoming</option></select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Organization</label>
              <input type="text" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none text-sm" placeholder="e.g. SSC" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Last Date</label>
              <input type="date" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none text-sm" />
            </div>
          </div>
        </div>

        {/* Rich Text Editor */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#0B1B3D] flex items-center gap-2">
            <Type className="w-4 h-4 text-gray-500"/> Content Body
          </label>
          <RichTextEditor content={content} onChange={setContent} />
          <p className="text-xs text-gray-500 mt-2">Use the toolbar to add H1-H6, tables, bullet lists, and images of any size.</p>
        </div>

      </div>

      {/* SEO & Settings Sidebar */}
      <div className="w-full lg:w-80 shrink-0 space-y-6">
        
        {/* SEO Score Meter */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-[#0B1B3D] to-[#0A58CA] text-white flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2"><PieChart className="w-4 h-4"/> SEO Score</h3>
            <span className="text-2xl font-black">85<span className="text-sm font-normal text-blue-200">/100</span></span>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-100">
              <CheckCircle2 className="w-4 h-4"/> Good Title Length
            </div>
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-100">
              <CheckCircle2 className="w-4 h-4"/> Focus Keyword Found
            </div>
            <div className="flex items-center gap-2 text-sm text-orange-700 bg-orange-50 px-3 py-2 rounded-lg border border-orange-100">
              <Info className="w-4 h-4"/> Add internal links
            </div>
          </div>
        </div>

        {/* SEO Meta Data */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-[#0B1B3D] border-b border-gray-100 pb-2">Search Engine Optimization</h3>
          
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Focus Keyword</label>
            <input type="text" placeholder="e.g. SSC CGL 2026 Notification" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#0A58CA] text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Meta Title</label>
            <input type="text" placeholder="SSC CGL 2026 Notification, Apply Online..." className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#0A58CA] text-sm" />
            <div className="text-[10px] text-gray-400 mt-1 text-right">54 / 60 chars</div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Meta Description</label>
            <textarea placeholder="Get complete details of SSC CGL 2026..." rows={3} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#0A58CA] text-sm resize-none"></textarea>
            <div className="text-[10px] text-gray-400 mt-1 text-right">120 / 160 chars</div>
          </div>
          
          {/* Google Preview */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mt-2">
            <div className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wide">Google Preview</div>
            <div className="text-sm text-[#1a0dab] font-bold hover:underline cursor-pointer truncate">SSC CGL 2026 Notification, Apply Online...</div>
            <div className="text-xs text-[#006621] truncate">https://govjobwala.com/jobs/ssc-cgl-2026</div>
            <div className="text-xs text-gray-600 line-clamp-2 mt-1">Get complete details of SSC CGL 2026 recruitment including eligibility, dates, and vacancies.</div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-[#0B1B3D] border-b border-gray-100 pb-2">Featured Image / Logo</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition cursor-pointer">
            <Image className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-bold text-[#0A58CA]">Click to upload</span>
            <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</span>
          </div>
        </div>

      </div>
    </div>
  );
}
