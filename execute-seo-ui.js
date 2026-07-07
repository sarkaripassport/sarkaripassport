const fs = require('fs/promises');
const path = require('path');

async function main() {
  const file = path.join(process.cwd(), 'src', 'app', 'admin', 'editor', 'page.tsx');
  let content = await fs.readFile(file, 'utf-8');

  // 1. Add schema and matrix state initialization
  const stateUpdates = `
    schema_settings: {
      enable_job_schema: true,
      enable_faq_schema: true,
      enable_syllabus_schema: true
    },
    seo_matrix: { states: [], cities: [], qualifications: [], departments: [] }
`;
  content = content.replace(/faqs: \[\],/, `faqs: [],\n${stateUpdates}`);

  // 2. Add SEO Score Calculation Logic before return
  const seoScoreLogic = `
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
`;
  content = content.replace(/return \(/, `${seoScoreLogic}\n  return (`);

  // 3. Update right sidebar SEO Preview to include the Live SEO Score
  const scoreUI = `
            {/* Live SEO Analyzer */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sticky top-[70px]">
              <h3 className="font-bold text-[#0B1B3D] mb-3 flex items-center gap-2">
                <Search className="w-4 h-4 text-[#4285f4]" /> Live SEO Analyzer
              </h3>
              
              <div className="mb-4">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Optimization Score</span>
                  <span className={\`text-lg font-black \${seoScore >= 80 ? 'text-green-600' : seoScore >= 50 ? 'text-yellow-600' : 'text-red-600'}\`}>{seoScore}/100</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className={\`h-2.5 rounded-full transition-all duration-500 \${seoScore >= 80 ? 'bg-green-500' : seoScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}\`} style={{ width: \`\${Math.max(10, seoScore)}%\` }}></div>
                </div>
                <div className="mt-2 text-[11px] text-gray-500 flex flex-col gap-1">
                  <div className="flex justify-between"><span>Title Length (40-70)</span> {jobData.seo_title?.[editLang]?.length >= 40 && jobData.seo_title?.[editLang]?.length <= 70 ? '✅' : '❌'}</div>
                  <div className="flex justify-between"><span>Desc Length (100-160)</span> {jobData.seo_description?.[editLang]?.length >= 100 && jobData.seo_description?.[editLang]?.length <= 160 ? '✅' : '❌'}</div>
                  <div className="flex justify-between"><span>Keyword in Title</span> {jobData.focus_keyword?.[editLang] && (jobData.seo_title?.[editLang]||jobData.title?.[editLang])?.toLowerCase().includes(jobData.focus_keyword?.[editLang]?.toLowerCase()) ? '✅' : '❌'}</div>
                  <div className="flex justify-between"><span>Keyword in Desc</span> {jobData.focus_keyword?.[editLang] && (jobData.seo_description?.[editLang]||jobData.job_summary?.[editLang])?.toLowerCase().includes(jobData.focus_keyword?.[editLang]?.toLowerCase()) ? '✅' : '❌'}</div>
                  <div className="flex justify-between"><span>Featured Image/Logo</span> {jobData.logo_url ? '✅' : '❌'}</div>
                </div>
              </div>
`;
  content = content.replace(/\{\/\* Google Search Console Preview \*\/\}\s*<div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sticky top-\[70px\]">/, scoreUI);
  content = content.replace(/<Search className="w-4 h-4 text-\[#4285f4\]" \/> Google Search Preview\s*<\/h3>/, "");

  // 4. Add Pillar 1 and Pillar 2 settings to the SEO Tab
  const pillarAdditions = `
                  <h2 className="text-xl font-bold text-[#0B1B3D] border-b pb-2 mt-8">Pillar 1: Schema Injections (JSON-LD)</h2>
                  <div className="space-y-3 bg-gray-50 p-4 rounded border">
                    <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
                      <input type="checkbox" checked={jobData.schema_settings?.enable_job_schema ?? true} onChange={e => setJobData({...jobData, schema_settings: {...jobData.schema_settings, enable_job_schema: e.target.checked}})} />
                      Generate JobPosting Schema (Required for Google Jobs Widget)
                    </label>
                    <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
                      <input type="checkbox" checked={jobData.schema_settings?.enable_faq_schema ?? true} onChange={e => setJobData({...jobData, schema_settings: {...jobData.schema_settings, enable_faq_schema: e.target.checked}})} />
                      Generate FAQPage Schema (Displays FAQs directly in Google search)
                    </label>
                    <label className="flex items-center gap-2 text-sm font-bold cursor-pointer">
                      <input type="checkbox" checked={jobData.schema_settings?.enable_syllabus_schema ?? true} onChange={e => setJobData({...jobData, schema_settings: {...jobData.schema_settings, enable_syllabus_schema: e.target.checked}})} />
                      Generate ItemList Schema (For Syllabus Topics)
                    </label>
                  </div>

                  <h2 className="text-xl font-bold text-[#0B1B3D] border-b pb-2 mt-8">Pillar 2: Programmatic SEO Matrix</h2>
                  <p className="text-sm text-gray-500 mb-4">Define tags to automatically push this job to thousands of intersecting /explore/ landing pages.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-1">States (e.g. UP, Bihar)</label>
                      <input type="text" className="w-full border rounded p-2 text-sm" placeholder="Comma separated..." value={jobData.seo_matrix?.states?.join(', ') || ''} onChange={e => setJobData({...jobData, seo_matrix: {...jobData.seo_matrix, states: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)}})} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">Cities (e.g. Lucknow, Patna)</label>
                      <input type="text" className="w-full border rounded p-2 text-sm" placeholder="Comma separated..." value={jobData.seo_matrix?.cities?.join(', ') || ''} onChange={e => setJobData({...jobData, seo_matrix: {...jobData.seo_matrix, cities: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)}})} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">Qualifications (e.g. 10th Pass, Graduate)</label>
                      <input type="text" className="w-full border rounded p-2 text-sm" placeholder="Comma separated..." value={jobData.seo_matrix?.qualifications?.join(', ') || ''} onChange={e => setJobData({...jobData, seo_matrix: {...jobData.seo_matrix, qualifications: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)}})} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">Departments (e.g. Police, Railway)</label>
                      <input type="text" className="w-full border rounded p-2 text-sm" placeholder="Comma separated..." value={jobData.seo_matrix?.departments?.join(', ') || ''} onChange={e => setJobData({...jobData, seo_matrix: {...jobData.seo_matrix, departments: e.target.value.split(',').map(s=>s.trim()).filter(Boolean)}})} />
                    </div>
                  </div>
`;
  content = content.replace(
    /<\/div>\s*<\/div>\s*\}\)\}\s*<\/div>\s*<\/div>\s*\{!activeTab/,
    `</div>\n${pillarAdditions}\n                </div>\n              )}\n            </div>\n          </div>\n          {!activeTab`
  );

  await fs.writeFile(file, content, 'utf-8');
}
main();
