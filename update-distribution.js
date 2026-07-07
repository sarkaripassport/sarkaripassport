const fs = require('fs/promises');
const path = require('path');

async function main() {
  // 1. Update API Route
  const apiFile = path.join(process.cwd(), 'src', 'app', 'api', 'jobs', 'route.ts');
  let apiContent = await fs.readFile(apiFile, 'utf-8');

  const broadcastImport = `import { broadcastToTelegram, broadcastToWhatsApp } from '@/lib/distribution';\n`;
  apiContent = broadcastImport + apiContent;

  const broadcastExecution = `
    // Trigger Distribution Broadcasts
    if (data.broadcast_now) {
      // Async so we don't block the API response
      Promise.all([
        broadcastToTelegram(job, 'en'),
        broadcastToWhatsApp(job, 'en')
      ]).catch(e => console.error("Broadcast failed:", e));
    }
`;

  apiContent = apiContent.replace(
    /return NextResponse\.json\(\{ success: true, job \}/,
    `${broadcastExecution}\n    return NextResponse.json({ success: true, job }`
  );

  await fs.writeFile(apiFile, apiContent, 'utf-8');


  // 2. Update Editor UI
  const editorFile = path.join(process.cwd(), 'src', 'app', 'admin', 'editor', 'page.tsx');
  let editorContent = await fs.readFile(editorFile, 'utf-8');

  // Add broadcast state
  editorContent = editorContent.replace(
    /youtube_url: ''\n  \}\);/,
    `youtube_url: '',\n    broadcast_now: false\n  });`
  );

  // Add the UI Checkbox near the publish buttons
  const broadcastUI = `
            {/* Distribution Controls */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="font-bold text-[#0B1B3D] mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> 
                Instant Distribution
              </h3>
              <label className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200 cursor-pointer hover:bg-green-100 transition-colors">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 text-green-600 rounded border-green-300 focus:ring-green-500" 
                  checked={jobData.broadcast_now || false} 
                  onChange={e => setJobData({...jobData, broadcast_now: e.target.checked})} 
                />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-green-900">Broadcast to Networks</span>
                  <span className="text-xs text-green-700">Send to Telegram & WhatsApp automatically when saved.</span>
                </div>
              </label>
            </div>
`;
  
  editorContent = editorContent.replace(
    /\{\/\* Google Search Console Preview \*\/\}/,
    `${broadcastUI}\n\n            {/* Google Search Console Preview */}`
  );

  await fs.writeFile(editorFile, editorContent, 'utf-8');
}
main();
