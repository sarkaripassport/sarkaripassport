const fs = require('fs/promises');
const path = require('path');

async function main() {
  const file = path.join(process.cwd(), 'src', 'app', 'admin', 'editor', 'page.tsx');
  let content = await fs.readFile(file, 'utf-8');

  // Add 'links' to tabs
  content = content.replace(
    "{['general', 'quick_facts', 'vacancies', 'eligibility', 'timelines', 'checklists', 'seo']",
    "{['general', 'quick_facts', 'vacancies', 'eligibility', 'timelines', 'checklists', 'links', 'seo']"
  );

  // Add upload handler function
  const uploadHandler = `
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) {
        setJobData((prev: any) => ({ ...prev, logo_url: data.url }));
      }
    } catch(err) {
      alert("Upload failed");
    }
    setLoading(false);
  };
`;
  content = content.replace("const initLocalized = () => ({ en: '', hi: '', mr: '' });", uploadHandler + "\n  const initLocalized = () => ({ en: '', hi: '', mr: '' });");

  // Add categories (Tags) and Logo URL to General Tab
  const generalAdditions = `
                    <div className="col-span-2">
                      <label className="block text-sm font-bold mb-1">Tags / Multiple Categories (Comma Separated)</label>
                      <input type="text" className="w-full border rounded p-2" placeholder="e.g. Bank Jobs, Central Govt, 10th Pass" value={jobData.categories?.join(', ') || ''} onChange={e => updateField('categories', e.target.value.split(',').map(s=>s.trim()).filter(Boolean))} />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-bold mb-1">Organization Logo</label>
                      <div className="flex gap-2">
                        <input type="text" className="flex-1 border rounded p-2" placeholder="Image URL..." value={jobData.logo_url || ''} onChange={e => updateField('logo_url', e.target.value)} />
                        <label className="bg-blue-50 text-blue-700 border border-blue-200 rounded px-4 py-2 cursor-pointer hover:bg-blue-100 font-bold flex items-center">
                          Upload Logo
                          <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                        </label>
                      </div>
                    </div>
                  </div>
`;
  // Replace the closing \`</div>\` of the grid in General tab
  content = content.replace(
    /<\/div>\s*<div>\s*<label className="block text-sm font-bold mb-1">Job Summary<\/label>/,
    generalAdditions + '\n                  <div>\n                    <label className="block text-sm font-bold mb-1">Job Summary</label>'
  );

  // Add Links Tab Content
  const linksTabContent = `
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
`;
  
  content = content.replace(
    /\{activeTab === 'seo' && \(/,
    linksTabContent + "\n              {activeTab === 'seo' && ("
  );

  await fs.writeFile(file, content, 'utf-8');
}
main();
