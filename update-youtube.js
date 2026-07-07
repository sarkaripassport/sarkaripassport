const fs = require('fs/promises');
const path = require('path');

async function main() {
  const dbFile = path.join(process.cwd(), 'src', 'lib', 'db.ts');
  let dbContent = await fs.readFile(dbFile, 'utf-8');

  // Add youtube_url to Job interface
  dbContent = dbContent.replace(
    /logo_url\?: string;/,
    `logo_url?: string;\n  youtube_url?: string;`
  );
  await fs.writeFile(dbFile, dbContent, 'utf-8');

  const apiFile = path.join(process.cwd(), 'src', 'app', 'api', 'jobs', 'route.ts');
  let apiContent = await fs.readFile(apiFile, 'utf-8');

  // We don't necessarily need to add youtube_url to the localization logic since it's just a string like logo_url. 
  // It will naturally be passed in `data` to `createJob`.

  // Now let's update the Admin Editor
  const editorFile = path.join(process.cwd(), 'src', 'app', 'admin', 'editor', 'page.tsx');
  let editorContent = await fs.readFile(editorFile, 'utf-8');

  // Add the state
  editorContent = editorContent.replace(
    /important_links: \[\]\n  \}\);/,
    `important_links: [],\n    youtube_url: ''\n  });`
  );

  // Add the UI input
  const youtubeUI = `
                  <div>
                    <label className="block text-sm font-bold mb-1">YouTube Explainer URL</label>
                    <input type="text" className="w-full border rounded p-2 text-sm" placeholder="e.g., https://youtube.com/watch?v=..." value={jobData.youtube_url || ''} onChange={e => setJobData({...jobData, youtube_url: e.target.value})} />
                  </div>
`;
  editorContent = editorContent.replace(
    /<div className="flex gap-4 items-center">/,
    `${youtubeUI}\n                  <div className="flex gap-4 items-center mt-4">`
  );
  
  await fs.writeFile(editorFile, editorContent, 'utf-8');
}
main();
