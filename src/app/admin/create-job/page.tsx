'use client';

import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Bot, Link as LinkIcon, Loader2, Save, FileText } from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';

export default function CreateJobPage() {
  const [docUrl, setDocUrl] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Job Form State
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    last_date: '',
    status: 'New',
    statusColor: 'text-green-800 bg-green-100 border border-green-200',
    total_vacancies: '',
    seo_title: '',
    seo_description: '',
    description_html: ''
  });

  const [vacancies, setVacancies] = useState<any[]>([]);

  const handleExtract = async () => {
    if (!docUrl) return alert("Please enter a Document URL");
    
    setIsExtracting(true);
    try {
      const res = await fetch('/api/parse-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentUrl: docUrl })
      });
      const json = await res.json();
      
      if (res.ok) {
        setFormData({
          title: json.data.title,
          organization: json.data.organization,
          last_date: json.data.last_date,
          status: json.data.status,
          statusColor: json.data.statusColor,
          total_vacancies: json.data.total_vacancies,
          seo_title: json.data.seo_title,
          seo_description: json.data.seo_description,
          description_html: json.data.description_html
        });
        setVacancies(json.data.vacancies || []);
      } else {
        alert(json.error || "Extraction failed");
      }
    } catch (e) {
      alert("Something went wrong");
    }
    setIsExtracting(false);
  };

  const handleSave = async (isLive = true) => {
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        vacancies,
        isLive,
        isTrending: false,
        daysLeft: 10
      };

      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        const data = await res.json();
        alert(isLive ? "Job Published Successfully!" : "Job Saved as Draft!");
        window.location.href = isLive ? `/jobs/${data.job.slug}` : `/admin/jobs`;
      } else {
        alert("Failed to save job");
      }
    } catch (e) {
      alert("Something went wrong");
    }
    setIsSaving(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA] font-sans text-gray-800 flex flex-col">
      <Navbar />
      
      <main className="flex-grow max-w-[1000px] w-full mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-[#0B1B3D]">Admin: Add New Job</h1>
          <div className="flex gap-3">
            <button 
              onClick={() => handleSave(false)}
              disabled={isSaving || !formData.title}
              className="bg-white text-gray-700 border border-gray-300 px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <Save className="w-5 h-5 text-gray-500" />
              Save as Draft
            </button>
            <button 
              onClick={() => handleSave(true)}
              disabled={isSaving || !formData.title}
              className="bg-[#0A58CA] text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Publish Job
            </button>
          </div>
        </div>

        {/* Extraction Engine */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6 border-t-4 border-t-[#0A58CA]">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-[#0B1B3D]">
            <Bot className="w-5 h-5 text-[#0A58CA]" /> Auto-Extraction Engine
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <LinkIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input 
                type="url" 
                placeholder="Paste official PDF or Notification URL here..." 
                value={docUrl}
                onChange={(e) => setDocUrl(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0A58CA]"
              />
            </div>
            <button 
              onClick={handleExtract}
              disabled={isExtracting}
              className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-bold whitespace-nowrap hover:bg-black disabled:opacity-70 flex items-center gap-2"
            >
              {isExtracting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Extract Details"}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3">The AI engine will read the PDF and automatically fill the form below, including SEO data.</p>
        </div>

        {/* Editable Form */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Job Title</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#0A58CA]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Organization</label>
                <input 
                  type="text" 
                  value={formData.organization}
                  onChange={(e) => setFormData({...formData, organization: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#0A58CA]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Total Vacancies</label>
                <input 
                  type="text" 
                  value={formData.total_vacancies}
                  onChange={(e) => setFormData({...formData, total_vacancies: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#0A58CA]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Last Date</label>
                <input 
                  type="text" 
                  value={formData.last_date}
                  onChange={(e) => setFormData({...formData, last_date: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#0A58CA]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Status Badge</label>
                <input 
                  type="text" 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#0A58CA]"
                />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0A58CA]"/> Job Description (Rich Text)
              </label>
              <RichTextEditor 
                content={formData.description_html} 
                onChange={(html) => setFormData({...formData, description_html: html})} 
              />
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4">Post-wise Vacancies</h3>
              <div className="space-y-3">
                {vacancies.map((v, i) => (
                  <div key={i} className="flex gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                     <div className="flex-1"><label className="text-xs font-bold text-gray-500">Post</label><div className="text-sm font-medium">{v.name}</div></div>
                     <div className="flex-1"><label className="text-xs font-bold text-gray-500">Education</label><div className="text-sm">{v.education}</div></div>
                     <div className="w-20"><label className="text-xs font-bold text-gray-500">Count</label><div className="text-sm font-bold">{v.vac}</div></div>
                  </div>
                ))}
                {vacancies.length === 0 && <div className="text-sm text-gray-500">No specific vacancies extracted yet.</div>}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 bg-blue-50/30 -mx-6 px-6 pb-2 rounded-b-xl">
              <h3 className="font-bold text-lg text-[#0B1B3D] mb-4">SEO Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Meta Title</label>
                  <input 
                    type="text" 
                    value={formData.seo_title}
                    onChange={(e) => setFormData({...formData, seo_title: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#0A58CA]"
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended 50-60 characters.</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Meta Description</label>
                  <textarea 
                    rows={3}
                    value={formData.seo_description}
                    onChange={(e) => setFormData({...formData, seo_description: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-[#0A58CA]"
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended 150-160 characters. This appears in Google Search results.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
