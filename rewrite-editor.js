const fs = require('fs/promises');
const path = require('path');

async function rewriteEditor() {
  const filePath = path.join(process.cwd(), 'src', 'app', 'admin', 'editor', 'page.tsx');
  
  const content = `'use client';

import { useState, useEffect } from 'react';
import { Eye, Save, LayoutTemplate, Plus, Trash2, ArrowUp, ArrowDown, HelpCircle, FileText, CheckCircle, Smartphone, Monitor, Globe } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdvancedEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');

  const [editLang, setEditLang] = useState<'en'|'hi'|'mr'>('en');

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
    important_links: []
  });

  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editId) {
      setLoading(true);
      fetch(\`/api/jobs?id=\${editId}\`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setJobData(data);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [editId]);

  const handleSave = async () => {
    try {
      const url = editId ? \`/api/jobs?id=\${editId}\` : '/api/jobs';
      const method = editId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      });
      if (res.ok) {
        alert(\`Job \${editId ? 'Updated' : 'Published'} Successfully!\`);
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

  return (
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
                  className={\`px-4 py-1.5 text-xs font-bold uppercase rounded-md transition-all \${editLang === lang ? 'bg-white text-[#0A58CA] shadow-sm' : 'text-gray-500 hover:text-gray-800'}\`}
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
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Main Writing Area */}
          <div className="flex-grow w-full space-y-6">
            
            <div className="flex bg-white rounded-t-xl border-b border-gray-200 overflow-x-auto shadow-sm sticky top-[70px] z-30">
              {['general', 'quick_facts', 'vacancies', 'eligibility', 'timelines', 'checklists', 'seo'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={\`px-6 py-3 text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-colors \${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}\`}
                >
                  {tab.replace('_', ' ')}
                </button>
              ))}
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
                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div><label className="text-xs font-bold">Post Name</label><input type="text" className="w-full border rounded p-1" value={card.post_name?.[editLang] || ''} onChange={e => updateArrayItemLocalized('vacancy_cards', index, 'post_name', e.target.value)} /></div>
                          <div><label className="text-xs font-bold">Total Vacancies</label><input type="text" className="w-full border rounded p-1" value={card.total} onChange={e => updateArrayItem('vacancy_cards', index, 'total', e.target.value)} /></div>
                          <div><label className="text-xs font-bold">Education</label><input type="text" className="w-full border rounded p-1" value={card.education?.[editLang] || ''} onChange={e => updateArrayItemLocalized('vacancy_cards', index, 'education', e.target.value)} /></div>
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

              {activeTab === 'seo' && (
                <div className="space-y-6 max-w-4xl">
                  <h2 className="text-xl font-bold text-[#0B1B3D] border-b pb-2">SEO Meta Details</h2>
                  <div className="grid grid-cols-1 gap-4">
                    <div><label className="block text-sm font-bold mb-1">SEO Title</label><input type="text" className="w-full border rounded p-2" value={jobData.seo_title?.[editLang] || ''} onChange={e => updateLocalizedField('seo_title', e.target.value)} /></div>
                    <div><label className="block text-sm font-bold mb-1">SEO Description</label><textarea className="w-full border rounded p-2 h-20" value={jobData.seo_description?.[editLang] || ''} onChange={e => updateLocalizedField('seo_description', e.target.value)} /></div>
                    <div><label className="block text-sm font-bold mb-1">Focus Keyword</label><input type="text" className="w-full border rounded p-2" value={jobData.focus_keyword?.[editLang] || ''} onChange={e => updateLocalizedField('focus_keyword', e.target.value)} /></div>
                  </div>
                </div>
              )}

            </div>
          </div>
          
        </div>
      </main>
      
    </div>
  );
}
`;
  await fs.writeFile(filePath, content, 'utf-8');
  console.log("Updated editor");
}

rewriteEditor();
