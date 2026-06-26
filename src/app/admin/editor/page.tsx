'use client';

import { useState } from 'react';
import { Eye, Save, LayoutTemplate, Plus, Trash2, ArrowUp, ArrowDown, HelpCircle, FileText, CheckCircle, Smartphone, Monitor } from 'lucide-react';
import SeoSidebar from '@/components/admin/SeoSidebar';

export default function AdvancedEditorPage() {
  const [jobData, setJobData] = useState<any>({
    title: '',
    slug: '',
    organization: '',
    logo_url: '',
    status: 'Active',
    statusColor: 'text-green-800 bg-green-100 border-green-200',
    isLive: true,
    isTrending: false,
    daysLeft: 30,
    seo_title: '',
    seo_description: '',
    focus_keyword: '',
    seo_score: 0,
    quick_facts: {
      vacancies: '', last_date: '', qualification: '', age_limit: '', job_location: '', salary: '', application_mode: 'Online'
    },
    job_summary: '',
    important_dates: [],
    application_fee: [],
    age_limit: { min_age: '', max_age: '', cutoff_date: '', relaxation: '' },
    vacancy_cards: [],
    education_qualification: '',
    required_documents: [],
    selection_process: [],
    salary_benefits: '',
    physical_standards: '',
    how_to_apply: [],
    eligibility_rules: [],
    similar_jobs: [],
    faqs: [],
    important_links: []
  });

  const [activeTab, setActiveTab] = useState('general');

  const handleSave = async () => {
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      });
      if (res.ok) alert('Job Published Successfully!');
      else alert('Failed to publish');
    } catch (e) {
      alert('Error publishing job');
    }
  };

  const updateField = (field: string, value: any) => {
    setJobData({ ...jobData, [field]: value });
  };

  const updateNestedField = (parent: string, field: string, value: any) => {
    setJobData({ ...jobData, [parent]: { ...jobData[parent], [field]: value } });
  };

  const addArrayItem = (field: string, defaultObj: any) => {
    updateField(field, [...jobData[field], defaultObj]);
  };

  const removeArrayItem = (field: string, index: number) => {
    const newArr = [...jobData[field]];
    newArr.splice(index, 1);
    updateField(field, newArr);
  };

  const updateArrayItem = (field: string, index: number, key: string, value: any) => {
    const newArr = [...jobData[field]];
    newArr[index][key] = value;
    updateField(field, newArr);
  };

  return (
    <div className="font-sans text-gray-800 flex flex-col h-full bg-gray-50 min-h-screen">
      {/* Editor Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0A58CA] text-white rounded-lg flex items-center justify-center shadow-md">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-[#0B1B3D] leading-none">Vacancy Builder</h1>
              <span className="text-xs text-gray-500 font-medium">Premium Job Detail Architecture</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-5 py-2 bg-[#0A58CA] text-white text-sm font-bold rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-md transition-colors" onClick={handleSave}>
              <Save className="w-4 h-4" /> Publish Job
            </button>
          </div>
        </div>
      </div>

      <main className="flex-grow max-w-[1600px] w-full mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Main Writing Area (Left Column) */}
          <div className="flex-grow w-full space-y-6">
            
            <div className="flex bg-white rounded-t-xl border-b border-gray-200 overflow-x-auto shadow-sm sticky top-[70px] z-30">
              {['general', 'quick_facts', 'vacancies', 'eligibility', 'timelines', 'checklists', 'seo'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}
                >
                  {tab.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-b-xl border border-t-0 border-gray-200 shadow-sm p-6 min-h-[600px]">
              
              {activeTab === 'general' && (
                <div className="space-y-6 max-w-4xl">
                  <h2 className="text-xl font-bold text-[#0B1B3D] border-b pb-2">General Information</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-bold mb-1">Job Title</label><input type="text" className="w-full border rounded p-2" value={jobData.title} onChange={e => updateField('title', e.target.value)} /></div>
                    <div><label className="block text-sm font-bold mb-1">URL Slug</label><input type="text" className="w-full border rounded p-2" value={jobData.slug} onChange={e => updateField('slug', e.target.value)} /></div>
                    <div><label className="block text-sm font-bold mb-1">Organization</label><input type="text" className="w-full border rounded p-2" value={jobData.organization} onChange={e => updateField('organization', e.target.value)} /></div>
                    <div><label className="block text-sm font-bold mb-1">Logo URL</label><input type="text" className="w-full border rounded p-2" value={jobData.logo_url} onChange={e => updateField('logo_url', e.target.value)} /></div>
                  </div>
                  <div><label className="block text-sm font-bold mb-1">Job Summary (Short Description)</label><textarea className="w-full border rounded p-2 h-24" value={jobData.job_summary} onChange={e => updateField('job_summary', e.target.value)} /></div>
                  <div><label className="block text-sm font-bold mb-1">Salary & Benefits (HTML)</label><textarea className="w-full border rounded p-2 h-24" value={jobData.salary_benefits} onChange={e => updateField('salary_benefits', e.target.value)} /></div>
                </div>
              )}

              {activeTab === 'quick_facts' && (
                <div className="space-y-6 max-w-4xl">
                  <h2 className="text-xl font-bold text-[#0B1B3D] border-b pb-2">Quick Facts Panel</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {['vacancies', 'last_date', 'qualification', 'age_limit', 'job_location', 'salary', 'application_mode'].map(key => (
                       <div key={key}><label className="block text-sm font-bold mb-1 capitalize">{key.replace('_', ' ')}</label><input type="text" className="w-full border rounded p-2" value={jobData.quick_facts[key]} onChange={e => updateNestedField('quick_facts', key, e.target.value)} /></div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'vacancies' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-[#0B1B3D] border-b pb-2">Vacancy Cards</h2>
                  <div className="space-y-4">
                    {jobData.vacancy_cards.map((card: any, index: number) => (
                      <div key={index} className="border border-gray-200 rounded p-4 bg-gray-50 relative">
                        <button className="absolute top-2 right-2 text-red-500" onClick={() => removeArrayItem('vacancy_cards', index)}><Trash2 className="w-4 h-4"/></button>
                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div><label className="text-xs font-bold">Post Name</label><input type="text" className="w-full border rounded p-1" value={card.post_name} onChange={e => updateArrayItem('vacancy_cards', index, 'post_name', e.target.value)} /></div>
                          <div><label className="text-xs font-bold">Total Vacancies</label><input type="text" className="w-full border rounded p-1" value={card.total} onChange={e => updateArrayItem('vacancy_cards', index, 'total', e.target.value)} /></div>
                          <div><label className="text-xs font-bold">Education</label><input type="text" className="w-full border rounded p-1" value={card.education} onChange={e => updateArrayItem('vacancy_cards', index, 'education', e.target.value)} /></div>
                        </div>
                      </div>
                    ))}
                    <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded text-sm font-bold" onClick={() => addArrayItem('vacancy_cards', {post_name:'', total:'', education:'', categories:{}})}>+ Add Vacancy</button>
                  </div>
                </div>
              )}

              {activeTab === 'eligibility' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-[#0B1B3D] border-b pb-2">Dynamic Eligibility Builder</h2>
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded mb-6">
                    <p className="text-sm text-blue-800">Combine rules using AND/OR logic. This powers the "Check Eligibility" widget on the frontend.</p>
                  </div>
                  <div className="space-y-3 max-w-3xl">
                    {jobData.eligibility_rules.map((rule: any, index: number) => (
                      <div key={index} className="flex gap-3 items-center">
                        <input type="text" className="flex-1 border rounded p-2" placeholder="Condition e.g. 10th Pass, 18 Years Age" value={rule.condition} onChange={e => updateArrayItem('eligibility_rules', index, 'condition', e.target.value)} />
                        <select className="border rounded p-2 w-24 bg-gray-100" value={rule.operator || ''} onChange={e => updateArrayItem('eligibility_rules', index, 'operator', e.target.value)}>
                          <option value="">None</option><option value="AND">AND</option><option value="OR">OR</option>
                        </select>
                        <button className="p-2 text-red-500 hover:bg-red-50 rounded" onClick={() => removeArrayItem('eligibility_rules', index)}><Trash2 className="w-5 h-5"/></button>
                      </div>
                    ))}
                    <button className="bg-green-100 text-green-700 px-4 py-2 rounded text-sm font-bold" onClick={() => addArrayItem('eligibility_rules', {id: Date.now().toString(), condition: '', operator: 'AND'})}>+ Add Rule</button>
                  </div>
                </div>
              )}

              {activeTab === 'timelines' && (
                <div className="space-y-10">
                  <div>
                    <h2 className="text-xl font-bold text-[#0B1B3D] border-b pb-2 mb-4">Important Dates Timeline</h2>
                    <div className="space-y-3 max-w-2xl">
                      {jobData.important_dates.map((date: any, index: number) => (
                        <div key={index} className="flex gap-3">
                          <input type="text" placeholder="Label (e.g. Apply Start)" className="flex-1 border rounded p-2" value={date.label} onChange={e => updateArrayItem('important_dates', index, 'label', e.target.value)} />
                          <input type="text" placeholder="Date (e.g. 10 Jun 2026)" className="flex-1 border rounded p-2" value={date.date} onChange={e => updateArrayItem('important_dates', index, 'date', e.target.value)} />
                          <button className="text-red-500 p-2" onClick={() => removeArrayItem('important_dates', index)}><Trash2 className="w-5 h-5"/></button>
                        </div>
                      ))}
                      <button className="bg-gray-100 px-4 py-2 rounded text-sm font-bold" onClick={() => addArrayItem('important_dates', {label:'', date:''})}>+ Add Date</button>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-[#0B1B3D] border-b pb-2 mb-4">Selection Process Stepper</h2>
                    <div className="space-y-3 max-w-3xl">
                      {jobData.selection_process.map((step: any, index: number) => (
                        <div key={index} className="flex gap-3 items-start border p-3 rounded bg-gray-50">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">{index + 1}</div>
                          <div className="flex-1 space-y-2">
                            <input type="text" placeholder="Step Title (e.g. Prelims Exam)" className="w-full border rounded p-2 font-bold" value={step.title} onChange={e => updateArrayItem('selection_process', index, 'title', e.target.value)} />
                            <textarea placeholder="Description..." className="w-full border rounded p-2 text-sm" value={step.description} onChange={e => updateArrayItem('selection_process', index, 'description', e.target.value)} />
                          </div>
                          <button className="text-red-500 p-2" onClick={() => removeArrayItem('selection_process', index)}><Trash2 className="w-5 h-5"/></button>
                        </div>
                      ))}
                      <button className="bg-gray-100 px-4 py-2 rounded text-sm font-bold" onClick={() => addArrayItem('selection_process', {step_number: jobData.selection_process.length + 1, title:'', description:''})}>+ Add Step</button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'checklists' && (
                <div className="space-y-10 max-w-3xl">
                  <div>
                    <h2 className="text-xl font-bold text-[#0B1B3D] border-b pb-2 mb-4">Required Documents Checklist</h2>
                    <div className="space-y-2">
                      {jobData.required_documents.map((doc: any, index: number) => (
                        <div key={index} className="flex gap-3 items-center">
                          <input type="checkbox" checked={doc.is_required} onChange={e => updateArrayItem('required_documents', index, 'is_required', e.target.checked)} className="w-5 h-5" />
                          <input type="text" placeholder="Document Name" className="flex-1 border rounded p-2" value={doc.item} onChange={e => updateArrayItem('required_documents', index, 'item', e.target.value)} />
                          <button className="text-red-500 p-2" onClick={() => removeArrayItem('required_documents', index)}><Trash2 className="w-5 h-5"/></button>
                        </div>
                      ))}
                      <button className="bg-gray-100 px-4 py-2 rounded text-sm font-bold mt-2" onClick={() => addArrayItem('required_documents', {id: Date.now().toString(), item:'', is_required: true})}>+ Add Document</button>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#0B1B3D] border-b pb-2 mb-4">How to Apply Steps</h2>
                    <div className="space-y-2">
                      {jobData.how_to_apply.map((step: any, index: number) => (
                        <div key={index} className="flex gap-3 items-center">
                          <span className="font-bold text-gray-400">{index + 1}.</span>
                          <input type="text" placeholder="Instruction" className="flex-1 border rounded p-2" value={step.instruction} onChange={e => updateArrayItem('how_to_apply', index, 'instruction', e.target.value)} />
                          <button className="text-red-500 p-2" onClick={() => removeArrayItem('how_to_apply', index)}><Trash2 className="w-5 h-5"/></button>
                        </div>
                      ))}
                      <button className="bg-gray-100 px-4 py-2 rounded text-sm font-bold mt-2" onClick={() => addArrayItem('how_to_apply', {step_number: jobData.how_to_apply.length + 1, instruction: ''})}>+ Add Instruction</button>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#0B1B3D] border-b pb-2 mb-4">Important Links</h2>
                    <div className="space-y-2">
                      {jobData.important_links.map((link: any, index: number) => (
                        <div key={index} className="flex gap-3 items-center">
                          <input type="text" placeholder="Label" className="w-1/3 border rounded p-2" value={link.label} onChange={e => updateArrayItem('important_links', index, 'label', e.target.value)} />
                          <input type="url" placeholder="URL" className="flex-1 border rounded p-2 text-blue-600" value={link.url} onChange={e => updateArrayItem('important_links', index, 'url', e.target.value)} />
                          <button className="text-red-500 p-2" onClick={() => removeArrayItem('important_links', index)}><Trash2 className="w-5 h-5"/></button>
                        </div>
                      ))}
                      <button className="bg-gray-100 px-4 py-2 rounded text-sm font-bold mt-2" onClick={() => addArrayItem('important_links', {label:'', url:''})}>+ Add Link</button>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#0B1B3D] border-b pb-2 mb-4">FAQs</h2>
                    <div className="space-y-4">
                      {jobData.faqs.map((faq: any, index: number) => (
                        <div key={index} className="border rounded p-3 bg-gray-50 relative">
                          <button className="absolute top-2 right-2 text-red-500" onClick={() => removeArrayItem('faqs', index)}><Trash2 className="w-4 h-4"/></button>
                          <input type="text" placeholder="Question" className="w-full border rounded p-2 mb-2 font-bold" value={faq.question} onChange={e => updateArrayItem('faqs', index, 'question', e.target.value)} />
                          <textarea placeholder="Answer" className="w-full border rounded p-2" value={faq.answer} onChange={e => updateArrayItem('faqs', index, 'answer', e.target.value)} />
                        </div>
                      ))}
                      <button className="bg-gray-100 px-4 py-2 rounded text-sm font-bold mt-2" onClick={() => addArrayItem('faqs', {question:'', answer:''})}>+ Add FAQ</button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'seo' && (
                <div className="space-y-6 max-w-4xl">
                  <h2 className="text-xl font-bold text-[#0B1B3D] border-b pb-2">SEO Meta Details</h2>
                  <div className="grid grid-cols-1 gap-4">
                    <div><label className="block text-sm font-bold mb-1">SEO Title</label><input type="text" className="w-full border rounded p-2" value={jobData.seo_title} onChange={e => updateField('seo_title', e.target.value)} /></div>
                    <div><label className="block text-sm font-bold mb-1">SEO Description</label><textarea className="w-full border rounded p-2 h-20" value={jobData.seo_description} onChange={e => updateField('seo_description', e.target.value)} /></div>
                    <div><label className="block text-sm font-bold mb-1">Focus Keyword</label><input type="text" className="w-full border rounded p-2" value={jobData.focus_keyword} onChange={e => updateField('focus_keyword', e.target.value)} /></div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* SEO Sidebar (Right Column) */}
          <div className="w-full lg:w-[400px] shrink-0 sticky top-[70px]">
             <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-slate-900 text-white p-4">
                  <h3 className="font-bold text-lg flex items-center gap-2"><Monitor className="w-5 h-5"/> SEO Smart Publisher</h3>
                  <p className="text-slate-400 text-xs mt-1">Real-time analysis and preview</p>
                </div>
                <div className="p-5 space-y-6">
                  {/* Score */}
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-700">SEO Score</span>
                    <span className={`text-2xl font-black ${jobData.seo_title && jobData.seo_description ? 'text-green-500' : 'text-red-500'}`}>
                      {jobData.seo_title && jobData.seo_description ? '95/100' : '45/100'}
                    </span>
                  </div>
                  
                  {/* Checks */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm"><CheckCircle className={`w-4 h-4 ${jobData.title ? 'text-green-500' : 'text-gray-300'}`}/> H1 Title Present</div>
                    <div className="flex items-center gap-2 text-sm"><CheckCircle className={`w-4 h-4 ${jobData.seo_title ? 'text-green-500' : 'text-gray-300'}`}/> Meta Title Optimized</div>
                    <div className="flex items-center gap-2 text-sm"><CheckCircle className={`w-4 h-4 ${jobData.seo_description ? 'text-green-500' : 'text-gray-300'}`}/> Meta Description Added</div>
                    <div className="flex items-center gap-2 text-sm"><CheckCircle className={`w-4 h-4 ${jobData.faqs.length > 0 ? 'text-green-500' : 'text-gray-300'}`}/> FAQ Schema Ready</div>
                  </div>

                  {/* Preview */}
                  <div className="bg-gray-50 border border-gray-200 rounded p-4">
                    <div className="flex items-center gap-2 mb-3 border-b pb-2">
                      <Smartphone className="w-4 h-4 text-gray-500"/> <span className="text-xs font-bold text-gray-500 uppercase">Google Mobile Preview</span>
                    </div>
                    <div className="text-xs text-gray-800 flex items-center gap-1 mb-1">
                      <img src="https://www.google.com/favicon.ico" className="w-3 h-3" /> 
                      <span className="truncate">sarkarijob.com › {jobData.slug || 'slug'}</span>
                    </div>
                    <h4 className="text-[16px] text-[#1a0dab] font-medium leading-tight mb-1 cursor-pointer hover:underline">{jobData.seo_title || jobData.title || 'Add an SEO Title to see preview'}</h4>
                    <p className="text-[13px] text-[#4d5156] leading-snug line-clamp-2">{jobData.seo_description || 'Add an SEO Description to see preview'}</p>
                  </div>
                </div>
             </div>
          </div>
          
        </div>
      </main>
      
    </div>
  );
}
