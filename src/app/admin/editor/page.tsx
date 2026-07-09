'use client';

import { Suspense, useState, useEffect } from 'react';
import { Eye, Save, LayoutTemplate, Plus, Trash2, ArrowUp, ArrowDown, HelpCircle, FileText, CheckCircle, Smartphone, Monitor, Globe, Search, Link as LinkIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import SeoMatrixWidget from '@/components/admin/SeoMatrixWidget';
import SalaryCalcWidget from '@/components/admin/SalaryCalcWidget';
import ApplicationFeeWidget from '@/components/admin/ApplicationFeeWidget';
import FloatingLinkToolbar from '@/components/admin/FloatingLinkToolbar';
import { useTextSelection } from '@/hooks/useTextSelection';

function EditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const cloneId = searchParams.get('cloneId');

  const [editLang, setEditLang] = useState<'en'|'hi'|'mr'>('en');
  const [tagInput, setTagInput] = useState('');
  
  // Selection hook for sidebar hyperlink tool
  const { selection, setSelection } = useTextSelection();
  const [sidebarLink, setSidebarLink] = useState('');

  // Keep selection link in sync
  useEffect(() => {
    if (selection) setSidebarLink('');
  }, [selection]);

  const applySidebarLink = () => {
    if (!selection || !sidebarLink || !selection.element) return;
    const { text, element, start, end } = selection;
    const newText = `<a href="${sidebarLink}" target="_blank" class="text-blue-600 underline font-semibold">${text}</a>`;
    element.setRangeText(newText, start, end, 'end');
    element.dispatchEvent(new Event('input', { bubbles: true }));
    setSelection(null);
  };
  
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    // Prevent Vercel 4.5MB payload limit by enforcing 2MB limit on frontend
    if (file.size > 2 * 1024 * 1024) {
      alert("File is too large! Please upload a logo smaller than 2MB.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      
      if (!res.ok) {
        if (res.status === 413) throw new Error("File is too large (exceeds server limit).");
        const text = await res.text();
        throw new Error(text || res.statusText);
      }
      
      const data = await res.json();
      if (data.url) {
        setJobData((prev: any) => ({ ...prev, logo_url: data.url }));
      } else {
        alert(data.error || "Upload failed");
      }
    } catch(err: any) {
      alert("Upload failed: " + err.message);
    }
    setLoading(false);
  };

  const initLocalized = () => ({ en: '', hi: '', mr: '' });

  const [jobData, setJobData] = useState<any>({
    title: initLocalized(),
    slug: '',
    category: 'Latest Jobs', 
    categories: [],
    organization: initLocalized(),
    logo_url: '',
    status: 'Active',
    statusColor: 'text-green-800 bg-green-100 border-green-200',
    isLive: true,
    isTrending: false,
    daysLeft: 30,
    seo_title: initLocalized(),
    seo_description: initLocalized(),
    focus_keyword: initLocalized(),
    seo_score: 0,
    quick_facts: {
      vacancies: '', 
      last_date: initLocalized(), 
      qualification: initLocalized(), 
      age_limit: initLocalized(), 
      job_location: initLocalized(), 
      salary: initLocalized(), 
      application_mode: initLocalized()
    },
    job_summary: initLocalized(),
    important_dates: [],
    application_fee: [],
    age_limit: { min_age: '', max_age: '', cutoff_date: '', relaxation: initLocalized() },
    vacancy_cards: [],
    education_qualification: initLocalized(),
    required_documents: [],
    selection_process: [],
    salary_benefits: initLocalized(),
    physical_standards: initLocalized(),
    how_to_apply: [],
    eligibility_rules: [],
    similar_jobs: [],
    faqs: [],

    schema_settings: {
      enable_job_schema: true,
      enable_faq_schema: true,
      enable_syllabus_schema: true
    },
    seo_matrix: { states: [], cities: [], qualifications: [], departments: [] },
    important_links: []
  });

  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchId = editId || cloneId;
    if (fetchId) {
      setLoading(true);
      fetch(`/api/jobs?id=${fetchId}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            if (cloneId) {
              delete data.id;
              data.slug = data.slug + '-copy-' + Math.floor(Math.random() * 1000);
            }
            setJobData(data);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [editId, cloneId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = editId ? `/api/jobs?id=${editId}` : '/api/jobs';
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      });
      if (res.ok) {
        alert(`Job ${editId ? 'Updated' : 'Published'} Successfully!`);
        router.push('/admin/jobs');
      }
      else alert('Failed to publish');
    } catch (e) {
      alert('Error publishing job');
    }
  };

  const updateLocalizedField = (field: string, value: string) => {
    setJobData({ ...jobData, [field]: { ...jobData[field], [editLang]: value } });
  };

  const updateField = (field: string, value: any) => {
    setJobData({ ...jobData, [field]: value });
  };

  const updateNestedLocalizedField = (parent: string, field: string, value: string) => {
    setJobData({ 
      ...jobData, 
      [parent]: { 
        ...jobData[parent], 
        [field]: { ...jobData[parent][field], [editLang]: value } 
      } 
    });
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

  const updateArrayItemLocalized = (field: string, index: number, key: string, value: string) => {
    const newArr = [...jobData[field]];
    if (!newArr[index][key]) newArr[index][key] = initLocalized();
    newArr[index][key][editLang] = value;
    updateField(field, newArr);
  };

  const updateArrayItem = (field: string, index: number, key: string, value: any) => {
    const newArr = [...jobData[field]];
    newArr[index][key] = value;
    updateField(field, newArr);
  };

  if (loading) return <div className="p-10 text-center">Loading Job Data...</div>;

  
  // Live SEO Scoring Algorithm
  const calculateSEOScore = () => {
    let score = 0;
    const title = jobData.seo_title?.[editLang] || jobData.title?.[editLang] || '';
    const desc = jobData.seo_description?.[editLang] || jobData.job_summary?.[editLang] || '';
    const keyword = jobData.focus_keyword?.[editLang] || '';
    
    if (title.length >= 40 && title.length <= 70) score += 20;
    if (desc.length >= 100 && desc.length <= 160) score += 20;
    if (jobData.logo_url && jobData.logo_url.length > 5) score += 20;
    
    if (keyword) {
      if (title.toLowerCase().includes(keyword.toLowerCase())) score += 20;
      if (desc.toLowerCase().includes(keyword.toLowerCase())) score += 20;
    }
    return score;
  };
  const seoScore = calculateSEOScore();

  return (
    <>
      <FloatingLinkToolbar />
      <div className="font-sans text-gray-800 flex flex-col h-full bg-gray-50 min-h-screen">
      {/* Editor Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0A58CA] text-white rounded-lg flex items-center justify-center shadow-md">
                <LayoutTemplate className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-[#0B1B3D] leading-none">Vacancy Builder</h1>
                <span className="text-xs text-gray-500 font-medium">{editId ? 'Editing Job' : 'Creating New Job'}</span>
              </div>
            </div>
            
            <div className="h-8 w-px bg-gray-200"></div>
            
            {/* Language Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg border border-gray-200 shadow-inner">
              <Globe className="w-4 h-4 text-gray-400 ml-2" />
              {(['en', 'hi', 'mr'] as const).map(lang => (
                <button
                  key={lang}
                  onClick={() => setEditLang(lang)}
                  className={`px-4 py-1.5 text-xs font-bold uppercase rounded-md transition-all ${editLang === lang ? 'bg-white text-[#0A58CA] shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
                >
                  {lang === 'en' ? 'English' : lang === 'hi' ? 'Hindi' : 'Marathi'}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="px-5 py-2 bg-[#0A58CA] text-white text-sm font-bold rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-md transition-colors" onClick={handleSave}>
              <Save className="w-4 h-4" /> {editId ? 'Update Job' : 'Publish Job'}
            </button>
          </div>
        </div>
      </div>

      <main className="flex-grow max-w-[1600px] w-full mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
          
          {/* Main Writing Area */}
          <div className="flex-grow min-w-0 w-full space-y-6">
            
            <div className="relative border-b border-gray-200">
              <div className="flex bg-white rounded-t-xl overflow-x-auto shadow-sm sticky top-[70px] z-30 scrollbar-hide no-scrollbar snap-x snap-mandatory pb-1">
                {['general', 'fees', 'quick_facts', 'vacancies', 'eligibility', 'timelines', 'checklists', 'links', 'syllabus', 'salary', 'seo'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-3 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors snap-start ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}
                  >
                    {tab.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-b-xl border border-t-0 border-gray-200 shadow-sm p-6 min-h-[600px]">
              
              {activeTab === 'general' && (
                <div className="space-y-6 max-w-4xl">
                  <h2 className="text-xl font-bold text-[#0B1B3D] border-b pb-2 flex items-center justify-between">
                    General Information
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Editing: {editLang.toUpperCase()}</span>
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-1">Job Title</label>
                      <input type="text" className="w-full border rounded p-2" value={jobData.title?.[editLang] || ''} onChange={e => updateLocalizedField('title', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">URL Slug</label>
                      <input type="text" className="w-full border rounded p-2" value={jobData.slug} onChange={e => updateField('slug', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">Category (Primary)</label>
                      <input type="text" list="job-categories" className="w-full border rounded p-2" value={jobData.category} onChange={e => updateField('category', e.target.value)} />
                      <datalist id="job-categories">
                        <option value="Latest Jobs" />
                        <option value="Admit Card" />
                        <option value="Result" />
                        <option value="Answer Key" />
                        <option value="Syllabus" />
                        <option value="Admission" />
                      </datalist>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">Organization</label>
                      <input type="text" className="w-full border rounded p-2" value={jobData.organization?.[editLang] || ''} onChange={e => updateLocalizedField('organization', e.target.value)} />
                    </div>
                  
                    <div className="col-span-2">
                      <label className="block text-sm font-bold mb-1">Tags / Multiple Categories</label>
                      <div className="flex gap-2 mb-2">
                        <input 
                          type="text" 
                          className="flex-1 border rounded p-2" 
                          placeholder="e.g. Bank Jobs, Central Govt, 10th Pass" 
                          value={tagInput} 
                          onChange={e => setTagInput(e.target.value)} 
                          onKeyDown={e => {
                            if (e.key === 'Enter' && tagInput.trim()) {
                              e.preventDefault();
                              updateField('categories', [...(jobData.categories || []), tagInput.trim()]);
                              setTagInput('');
                            }
                          }}
                        />
                        <button 
                          type="button" 
                          className="px-4 py-2 bg-blue-100 text-blue-700 border border-blue-200 rounded font-bold hover:bg-blue-200 transition-colors"
                          onClick={() => {
                            if (tagInput.trim()) {
                              updateField('categories', [...(jobData.categories || []), tagInput.trim()]);
                              setTagInput('');
                            }
                          }}
                        >
                          Add Tag
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {jobData.categories?.map((tag: string, idx: number) => (
                          <span key={idx} className="bg-gray-100 border border-gray-200 px-3 py-1 rounded-full text-xs font-bold text-gray-700 flex items-center gap-1">
                            {tag}
                            <button 
                              type="button" 
                              className="text-red-500 hover:text-red-700 ml-1 text-base leading-none" 
                              onClick={() => {
                                const newCats = [...(jobData.categories || [])];
                                newCats.splice(idx, 1);
                                updateField('categories', newCats);
                              }}
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                        {(!jobData.categories || jobData.categories.length === 0) && (
                          <span className="text-xs text-gray-400 italic">No tags added yet.</span>
                        )}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-bold mb-1">Organization Logo</label>
                      <div className="flex gap-4 items-start">
                        {jobData.logo_url && (
                          <div className="shrink-0 w-16 h-16 border rounded bg-gray-50 flex items-center justify-center overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={jobData.logo_url} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                          </div>
                        )}
                        <div className="flex-1 flex gap-2">
                          <input type="text" className="flex-1 border rounded p-2 h-10" placeholder="Image URL..." value={jobData.logo_url || ''} onChange={e => updateField('logo_url', e.target.value)} />
                          <label className="bg-blue-50 text-blue-700 border border-blue-200 rounded px-4 py-2 h-10 cursor-pointer hover:bg-blue-100 font-bold flex items-center shrink-0">
                            Upload Logo
                            <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-1">Job Summary</label>
                    <textarea className="w-full border rounded p-2 h-24" value={jobData.job_summary?.[editLang] || ''} onChange={e => updateLocalizedField('job_summary', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">Salary & Benefits (HTML)</label>
                    <textarea className="w-full border rounded p-2 h-24" value={jobData.salary_benefits?.[editLang] || ''} onChange={e => updateLocalizedField('salary_benefits', e.target.value)} />
                  </div>
                </div>
              )}

              {activeTab === 'quick_facts' && (
                <div className="space-y-6 max-w-4xl">
                  <h2 className="text-xl font-bold text-[#0B1B3D] border-b pb-2">Quick Facts Panel</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {['last_date', 'qualification', 'age_limit', 'job_location', 'salary', 'application_mode'].map(key => (
                       <div key={key}>
                         <label className="block text-sm font-bold mb-1 capitalize">{key.replace('_', ' ')}</label>
                         <input type="text" className="w-full border rounded p-2" value={jobData.quick_facts[key]?.[editLang] || ''} onChange={e => updateNestedLocalizedField('quick_facts', key, e.target.value)} />
                       </div>
                    ))}
                    <div>
                      <label className="block text-sm font-bold mb-1">Total Vacancies (Number)</label>
                      <input type="text" className="w-full border rounded p-2" value={jobData.quick_facts.vacancies} onChange={e => updateNestedField('quick_facts', 'vacancies', e.target.value)} />
                    </div>
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
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div className="col-span-1 md:col-span-2">
                              <label className="text-xs font-bold text-gray-500 block mb-1">Post Name <span className="font-normal text-[10px] text-blue-500">(HTML supported for links e.g., &lt;a href="url"&gt;text&lt;/a&gt;)</span></label>
                              <textarea rows={2} className="w-full border border-gray-300 rounded p-2 text-sm" placeholder="Enter post name or HTML..." value={card.post_name?.[editLang] || ''} onChange={e => updateArrayItemLocalized('vacancy_cards', index, 'post_name', e.target.value)} />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-500 block mb-1">Total Vacancies</label>
                              <input type="text" className="w-full border border-gray-300 rounded p-2 text-sm" placeholder="e.g. 10" value={card.total} onChange={e => updateArrayItem('vacancy_cards', index, 'total', e.target.value)} />
                            </div>
                            <div>
                              <label className="text-xs font-bold text-gray-500 block mb-1">Education <span className="font-normal text-[10px] text-blue-500">(HTML supported)</span></label>
                              <textarea rows={2} className="w-full border border-gray-300 rounded p-2 text-sm" placeholder="Enter education qualification..." value={card.education?.[editLang] || ''} onChange={e => updateArrayItemLocalized('vacancy_cards', index, 'education', e.target.value)} />
                            </div>
                          </div>
                        
                        <div className="border-t border-gray-200 pt-3 mt-3">
                          <label className="text-xs font-bold mb-2 block">Category Wise Breakdown</label>
                          <div className="flex flex-wrap gap-2">
                            {Array.from(new Set(['UR', 'OBC', 'EWS', 'SC', 'ST', ...Object.keys(card.categories || {})])).map(cat => (
                              <div key={cat} className="w-16">
                                <label className="text-[10px] text-gray-500 font-semibold truncate block">{cat}</label>
                                <input 
                                  type="text" 
                                  className="w-full border rounded p-1 text-xs" 
                                  placeholder="0"
                                  value={card.categories?.[cat] || ''} 
                                  onChange={e => {
                                    const newCards = [...jobData.vacancy_cards];
                                    if (!newCards[index].categories) newCards[index].categories = {};
                                    newCards[index].categories[cat] = e.target.value;
                                    setJobData({ ...jobData, vacancy_cards: newCards });
                                  }} 
                                />
                              </div>
                            ))}
                            <div className="w-16 flex items-end pb-[1px]">
                              <button 
                                className="w-full bg-gray-200 text-gray-700 text-xs py-1.5 rounded font-bold hover:bg-gray-300 transition-colors"
                                onClick={(e) => {
                                  e.preventDefault();
                                  const customCat = window.prompt("Enter Custom Category Name (e.g., PwD, Ex-SM, Female):");
                                  if (customCat && customCat.trim() !== "") {
                                    const newCards = [...jobData.vacancy_cards];
                                    if (!newCards[index].categories) newCards[index].categories = {};
                                    if (newCards[index].categories[customCat.trim()] === undefined) {
                                      newCards[index].categories[customCat.trim()] = "";
                                      setJobData({ ...jobData, vacancy_cards: newCards });
                                    }
                                  }
                                }}
                              >+ Add</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded text-sm font-bold" onClick={() => addArrayItem('vacancy_cards', {post_name: initLocalized(), total:'', education: initLocalized(), categories:{}})}>+ Add Vacancy</button>
                  </div>
                </div>
              )}

              {activeTab === 'eligibility' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-[#0B1B3D] border-b pb-2">Dynamic Eligibility Builder</h2>
                  <div className="space-y-3 max-w-3xl">
                    {jobData.eligibility_rules.map((rule: any, index: number) => (
                      <div key={index} className="flex gap-3 items-center">
                        <input type="text" className="flex-1 border rounded p-2" placeholder="Condition e.g. 10th Pass" value={rule.condition?.[editLang] || ''} onChange={e => updateArrayItemLocalized('eligibility_rules', index, 'condition', e.target.value)} />
                        <select className="border rounded p-2 w-24 bg-gray-100" value={rule.operator || ''} onChange={e => updateArrayItem('eligibility_rules', index, 'operator', e.target.value)}>
                          <option value="">None</option><option value="AND">AND</option><option value="OR">OR</option>
                        </select>
                        <button className="p-2 text-red-500 hover:bg-red-50 rounded" onClick={() => removeArrayItem('eligibility_rules', index)}><Trash2 className="w-5 h-5"/></button>
                      </div>
                    ))}
                    <button className="bg-green-100 text-green-700 px-4 py-2 rounded text-sm font-bold" onClick={() => addArrayItem('eligibility_rules', {id: Date.now().toString(), condition: initLocalized(), operator: 'AND'})}>+ Add Rule</button>
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
                          <input type="text" placeholder="Label" className="flex-1 border rounded p-2" value={date.label?.[editLang] || ''} onChange={e => updateArrayItemLocalized('important_dates', index, 'label', e.target.value)} />
                          <input type="text" placeholder="Date" className="flex-1 border rounded p-2" value={date.date?.[editLang] || ''} onChange={e => updateArrayItemLocalized('important_dates', index, 'date', e.target.value)} />
                          <button className="text-red-500 p-2" onClick={() => removeArrayItem('important_dates', index)}><Trash2 className="w-5 h-5"/></button>
                        </div>
                      ))}
                      <button className="bg-gray-100 px-4 py-2 rounded text-sm font-bold" onClick={() => addArrayItem('important_dates', {label: initLocalized(), date: initLocalized()})}>+ Add Date</button>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-[#0B1B3D] border-b pb-2 mb-4">Selection Process Stepper</h2>
                    <div className="space-y-3 max-w-3xl">
                      {jobData.selection_process.map((step: any, index: number) => (
                        <div key={index} className="flex gap-3 items-start border p-3 rounded bg-gray-50">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">{index + 1}</div>
                          <div className="flex-1 space-y-2">
                            <input type="text" placeholder="Step Title" className="w-full border rounded p-2 font-bold" value={step.title?.[editLang] || ''} onChange={e => updateArrayItemLocalized('selection_process', index, 'title', e.target.value)} />
                            <textarea placeholder="Description..." className="w-full border rounded p-2 text-sm" value={step.description?.[editLang] || ''} onChange={e => updateArrayItemLocalized('selection_process', index, 'description', e.target.value)} />
                          </div>
                          <button className="text-red-500 p-2" onClick={() => removeArrayItem('selection_process', index)}><Trash2 className="w-5 h-5"/></button>
                        </div>
                      ))}
                      <button className="bg-gray-100 px-4 py-2 rounded text-sm font-bold" onClick={() => addArrayItem('selection_process', {step_number: jobData.selection_process.length + 1, title: initLocalized(), description: initLocalized()})}>+ Add Step</button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'checklists' && (
                <div className="space-y-10 max-w-3xl">
                  <div>
                    <h2 className="text-xl font-bold text-[#0B1B3D] border-b pb-2 mb-4">How to Apply Steps</h2>
                    <div className="space-y-2">
                      {jobData.how_to_apply.map((step: any, index: number) => (
                        <div key={index} className="flex gap-3 items-center">
                          <span className="font-bold text-gray-400">{index + 1}.</span>
                          <input type="text" placeholder="Instruction" className="flex-1 border rounded p-2" value={step.instruction?.[editLang] || ''} onChange={e => updateArrayItemLocalized('how_to_apply', index, 'instruction', e.target.value)} />
                          <button className="text-red-500 p-2" onClick={() => removeArrayItem('how_to_apply', index)}><Trash2 className="w-5 h-5"/></button>
                        </div>
                      ))}
                      <button className="bg-gray-100 px-4 py-2 rounded text-sm font-bold mt-2" onClick={() => addArrayItem('how_to_apply', {step_number: jobData.how_to_apply.length + 1, instruction: initLocalized()})}>+ Add Instruction</button>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-bold text-[#0B1B3D] border-b pb-2 mb-4">FAQs</h2>
                    <div className="space-y-4">
                      {jobData.faqs.map((faq: any, index: number) => (
                        <div key={index} className="border rounded p-3 bg-gray-50 relative">
                          <button className="absolute top-2 right-2 text-red-500" onClick={() => removeArrayItem('faqs', index)}><Trash2 className="w-4 h-4"/></button>
                          <input type="text" placeholder="Question" className="w-full border rounded p-2 mb-2 font-bold" value={faq.question?.[editLang] || ''} onChange={e => updateArrayItemLocalized('faqs', index, 'question', e.target.value)} />
                          <textarea placeholder="Answer" className="w-full border rounded p-2" value={faq.answer?.[editLang] || ''} onChange={e => updateArrayItemLocalized('faqs', index, 'answer', e.target.value)} />
                        </div>
                      ))}
                      <button className="bg-gray-100 px-4 py-2 rounded text-sm font-bold mt-2" onClick={() => addArrayItem('faqs', {question: initLocalized(), answer: initLocalized()})}>+ Add FAQ</button>
                    </div>
                  </div>
                </div>
              )}

              
              {activeTab === 'links' && (
                <div className="space-y-6 max-w-4xl">
                  <h2 className="text-xl font-bold text-[#0B1B3D] border-b pb-2">Important Links</h2>
                  <div className="space-y-4">
                    {jobData.important_links?.map((link: any, index: number) => (
                      <div key={index} className="flex gap-3 items-center border p-3 rounded bg-gray-50">
                        <input type="text" placeholder="Link Label (e.g. Apply Online)" className="flex-1 border rounded p-2 font-bold" value={link.label?.[editLang] || ''} onChange={e => updateArrayItemLocalized('important_links', index, 'label', e.target.value)} />
                        <input type="text" placeholder="URL (https://...)" className="flex-1 border rounded p-2" value={link.url || ''} onChange={e => {
                          const newArr = [...(jobData.important_links || [])];
                          newArr[index] = { ...newArr[index], url: e.target.value };
                          setJobData({ ...jobData, important_links: newArr });
                        }} />
                        <button className="text-red-500 p-2" onClick={() => removeArrayItem('important_links', index)}><Trash2 className="w-5 h-5"/></button>
                      </div>
                    ))}
                    <button className="bg-gray-100 px-4 py-2 rounded text-sm font-bold" onClick={() => addArrayItem('important_links', {label: initLocalized(), url: ''})}>+ Add Important Link</button>
                  </div>
                </div>
              )}

              {activeTab === 'syllabus' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-[#0B1B3D] border-b pb-2 mb-4">Syllabus Configuration</h2>
            
            {(jobData.syllabus || []).map((section: any, sIndex: number) => (
              <div key={sIndex} className="mb-6 p-4 border border-blue-100 bg-blue-50/50 rounded-lg">
                <div className="flex justify-between items-center mb-3">
                  <input
                    type="text"
                    value={section.subject[editLang] || ''}
                    onChange={(e) => {
                      const newSyllabus = [...(jobData.syllabus || [])];
                      newSyllabus[sIndex].subject[editLang] = e.target.value;
                      setJobData({ ...jobData, syllabus: newSyllabus });
                    }}
                    className="w-full px-3 py-2 border rounded font-semibold text-blue-900"
                    placeholder="Subject Name (e.g., General Knowledge)"
                  />
                  <button onClick={() => {
                    const newSyllabus = [...(jobData.syllabus || [])];
                    newSyllabus.splice(sIndex, 1);
                    setJobData({ ...jobData, syllabus: newSyllabus });
                  }} className="ml-4 text-red-500 hover:text-red-700">Remove Subject</button>
                </div>
                
                <div className="pl-4 space-y-2 border-l-2 border-blue-200">
                  {section.topics.map((topic: any, tIndex: number) => (
                    <div key={tIndex} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <input
                        type="text"
                        value={topic.title[editLang] || ''}
                        onChange={(e) => {
                          const newSyllabus = [...(jobData.syllabus || [])];
                          newSyllabus[sIndex].topics[tIndex].title[editLang] = e.target.value;
                          setJobData({ ...jobData, syllabus: newSyllabus });
                        }}
                        className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm"
                        placeholder="Topic (e.g., Indian History)"
                      />
                      <button onClick={() => {
                        const newSyllabus = [...(jobData.syllabus || [])];
                        newSyllabus[sIndex].topics.splice(tIndex, 1);
                        setJobData({ ...jobData, syllabus: newSyllabus });
                      }} className="text-red-400 hover:text-red-600">×</button>
                    </div>
                  ))}
                  <button onClick={() => {
                    const newSyllabus = [...(jobData.syllabus || [])];
                    newSyllabus[sIndex].topics.push({ title: { en: '', hi: '', mr: '' } });
                    setJobData({ ...jobData, syllabus: newSyllabus });
                  }} className="text-sm text-blue-600 hover:underline mt-2 inline-block">+ Add Topic</button>
                </div>
              </div>
            ))}
            
            <button
              onClick={() => {
                const newSyllabus = [...(jobData.syllabus || []), { subject: { en: '', hi: '', mr: '' }, topics: [] }];
                setJobData({ ...jobData, syllabus: newSyllabus });
              }}
              className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded hover:bg-blue-200"
            >
              + Add Syllabus Subject
            </button>
          </div>
        )}

        {activeTab === 'seo' && (
                <div className="space-y-6 max-w-4xl">
                  <h2 className="text-xl font-bold text-[#0B1B3D] border-b pb-2">SEO Meta Details</h2>
                  <div className="grid grid-cols-1 gap-4">
                    <div><label className="block text-sm font-bold mb-1">SEO Title</label><input type="text" className="w-full border rounded p-2" value={jobData.seo_title?.[editLang] || ''} onChange={e => updateLocalizedField('seo_title', e.target.value)} /></div>
                    <div><label className="block text-sm font-bold mb-1">SEO Description</label><textarea className="w-full border rounded p-2 h-20" value={jobData.seo_description?.[editLang] || ''} onChange={e => updateLocalizedField('seo_description', e.target.value)} /></div>
                    <div><label className="block text-sm font-bold mb-1">Focus Keyword</label><input type="text" className="w-full border rounded p-2" value={jobData.focus_keyword?.[editLang] || ''} onChange={e => updateLocalizedField('focus_keyword', e.target.value)} /></div>
                  </div>
                  <div className="mt-8">
                    <SeoMatrixWidget job={jobData} updateJob={(updates) => setJobData({ ...jobData, ...updates })} />
                  </div>
                </div>
              )}

              {activeTab === 'fees' && (
                <div className="space-y-6 max-w-4xl">
                  <ApplicationFeeWidget job={jobData} editLang={editLang} onChange={(updates) => setJobData({ ...jobData, ...updates })} />
                </div>
              )}

              {activeTab === 'salary' && (
                <div className="space-y-6 max-w-4xl">
                  <SalaryCalcWidget job={jobData} onChange={(updates) => setJobData({ ...jobData, ...updates })} />
                </div>
              )}

            </div>

          </div>
                    {/* Right Sidebar: SEO & Live Previews */}
            <div className="w-full lg:w-80 shrink-0 space-y-6 max-w-full min-w-0 overflow-hidden">
              {/* Hyperlink Tool */}
              <div className={`bg-white rounded-xl border ${selection ? 'border-blue-400 shadow-blue-100/50' : 'border-gray-200'} shadow-sm p-5 transition-all duration-300`}>
                <h3 className="font-bold text-[#0B1B3D] mb-3 flex items-center gap-2">
                  <LinkIcon className={`w-4 h-4 ${selection ? 'text-blue-500' : 'text-gray-400'}`} /> Quick Link Tool
                </h3>
                {selection ? (
                  <div className="space-y-3 animate-in fade-in zoom-in-95">
                    <p className="text-sm text-gray-600 bg-blue-50 p-2 rounded border border-blue-100">
                      Selected: <strong>{selection.text.length > 20 ? selection.text.substring(0, 20) + '...' : selection.text}</strong>
                    </p>
                    <input 
                      type="url" 
                      placeholder="https://" 
                      value={sidebarLink}
                      onChange={e => setSidebarLink(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') applySidebarLink(); }}
                      className="w-full text-sm border border-gray-300 rounded p-2 focus:border-blue-500 outline-none"
                    />
                    <button 
                      onClick={applySidebarLink}
                      className="w-full py-2 bg-[#0A58CA] text-white rounded font-bold hover:bg-blue-700 transition"
                    >
                      Apply Link
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    Highlight any text in the editor to add a hyperlink here.
                  </p>
                )}
              </div>

              {/* Breaking News Toggle */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="font-bold text-[#0B1B3D] mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-red-500" /> Visibility
              </h3>
              <button 
                className={`w-full py-2.5 rounded-lg font-bold border transition-colors ${jobData.isTrending ? 'bg-red-50 text-red-700 border-red-200' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
                onClick={() => setJobData({...jobData, isTrending: !jobData.isTrending})}
              >
                {jobData.isTrending ? '🔴 Live Breaking News' : 'Make Breaking News'}
              </button>
            </div>
            
            
            {/* Live SEO Analyzer */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sticky top-[70px]">
              <h3 className="font-bold text-[#0B1B3D] mb-3 flex items-center gap-2">
                <Search className="w-4 h-4 text-[#4285f4]" /> Live SEO Analyzer
              </h3>
              
              <div className="mb-4">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Optimization Score</span>
                  <span className={`text-lg font-black ${seoScore >= 80 ? 'text-green-600' : seoScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>{seoScore}/100</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className={`h-2.5 rounded-full transition-all duration-500 ${seoScore >= 80 ? 'bg-green-500' : seoScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${Math.max(10, seoScore)}%` }}></div>
                </div>
                <div className="mt-2 text-[11px] text-gray-500 flex flex-col gap-1">
                  <div className="flex justify-between"><span>Title Length (40-70)</span> {jobData.seo_title?.[editLang]?.length >= 40 && jobData.seo_title?.[editLang]?.length <= 70 ? '✅' : '❌'}</div>
                  <div className="flex justify-between"><span>Desc Length (100-160)</span> {jobData.seo_description?.[editLang]?.length >= 100 && jobData.seo_description?.[editLang]?.length <= 160 ? '✅' : '❌'}</div>
                  <div className="flex justify-between"><span>Keyword in Title</span> {jobData.focus_keyword?.[editLang] && (jobData.seo_title?.[editLang]||jobData.title?.[editLang])?.toLowerCase().includes(jobData.focus_keyword?.[editLang]?.toLowerCase()) ? '✅' : '❌'}</div>
                  <div className="flex justify-between"><span>Keyword in Desc</span> {jobData.focus_keyword?.[editLang] && (jobData.seo_description?.[editLang]||jobData.job_summary?.[editLang])?.toLowerCase().includes(jobData.focus_keyword?.[editLang]?.toLowerCase()) ? '✅' : '❌'}</div>
                  <div className="flex justify-between"><span>Featured Image/Logo</span> {jobData.logo_url ? '✅' : '❌'}</div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-3 text-sm shadow-sm font-sans">
                <div className="text-[#1a0dab] text-[18px] hover:underline cursor-pointer truncate max-w-full inline-block mb-1">
                  {jobData.seo_title?.[editLang] || jobData.title?.[editLang] || 'Job Title Example'}
                </div>
                <div className="text-[#006621] text-[13px] mb-1 truncate">
                  https://sarkaripassport.com/{editLang}/jobs/{jobData.slug || 'example-slug'}
                </div>
                <div className="text-[#545454] text-[13px] leading-[1.4] line-clamp-2">
                  {jobData.seo_description?.[editLang] || jobData.job_summary?.[editLang] || 'This is the meta description that will appear in search results to attract candidates.'}
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">Live preview for Google Search Results.</p>
            </div>
          </div>
          
        </div>
      </main>

      
    </div>
    </>
  );
}


import { Suspense } from 'react';
export default function AdvancedEditorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading editor...</div>}>
      <EditorContent />
    </Suspense>
  );
}
