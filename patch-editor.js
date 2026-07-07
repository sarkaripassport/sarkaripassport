const fs = require('fs/promises');
const path = require('path');

async function fix() {
  const file = path.join(process.cwd(), 'src', 'app', 'admin', 'editor', 'page.tsx');
  let content = await fs.readFile(file, 'utf-8');
  
  // 1. Rename AdvancedEditorPage to EditorContent
  content = content.replace('export default function AdvancedEditorPage() {', 'function EditorContent() {');
  
  // 2. Add Suspense wrapper at the end
  content += `\n\nimport { Suspense } from 'react';\nexport default function AdvancedEditorPage() {\n  return (\n    <Suspense fallback={<div className="p-8 text-center">Loading editor...</div>}>\n      <EditorContent />\n    </Suspense>\n  );\n}\n`;

  // 3. Add Search import
  content = content.replace('Globe } from \'lucide-react\';', 'Globe, Search } from \'lucide-react\';');
  
  // 4. Inject Right Sidebar
  const sidebarHtml = `
          </div>
          
          {/* Right Sidebar: SEO & Live Previews */}
          <div className="w-full lg:w-[350px] shrink-0 space-y-6">
            {/* Breaking News Toggle */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="font-bold text-[#0B1B3D] mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-red-500" /> Visibility
              </h3>
              <button 
                className={\`w-full py-2.5 rounded-lg font-bold border transition-colors \${jobData.isTrending ? 'bg-red-50 text-red-700 border-red-200' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}\`}
                onClick={() => setJobData({...jobData, isTrending: !jobData.isTrending})}
              >
                {jobData.isTrending ? '🔴 Live Breaking News' : 'Make Breaking News'}
              </button>
            </div>
            
            {/* Google Search Console Preview */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sticky top-[70px]">
              <h3 className="font-bold text-[#0B1B3D] mb-3 flex items-center gap-2">
                <Search className="w-4 h-4 text-[#4285f4]" /> Google Search Preview
              </h3>
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
`;
  
  // Replace the closing tags of the main flex container
  content = content.replace(/          <\/div>\s*<\/div>\s*<\/main>/, sidebarHtml);

  await fs.writeFile(file, content, 'utf-8');
}
fix();
