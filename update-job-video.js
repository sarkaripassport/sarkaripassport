const fs = require('fs/promises');
const path = require('path');

async function main() {
  const file = path.join(process.cwd(), 'src', 'app', '[lang]', 'jobs', '[slug]', 'page.tsx');
  let content = await fs.readFile(file, 'utf-8');

  // Generate VideoObject JSON-LD Schema
  const videoSchemaCode = `
  // Generate VideoObject Schema for YouTube integration
  let videoLd = null;
  if (job.youtube_url) {
    const videoIdMatch = job.youtube_url.match(/(?:youtube\\.com\\/(?:[^/]+\\/.+\\/|(?:v|e(?:mbed)?)\\/|.*[?&]v=)|youtu\\.be\\/)([^"&?\\/\\s]{11})/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    
    if (videoId) {
      videoLd = {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        'name': job.title[lang],
        'description': job.seo_description?.[lang] || job.job_summary?.[lang] || job.title[lang],
        'thumbnailUrl': [\`https://img.youtube.com/vi/\${videoId}/maxresdefault.jpg\`],
        'uploadDate': new Date().toISOString(), // In reality, fetch this from API if possible
        'embedUrl': \`https://www.youtube.com/embed/\${videoId}\`
      };
    }
  }
`;

  content = content.replace(
    /\/\/ Generate BreadcrumbList JSON-LD Schema/,
    `${videoSchemaCode}\n\n  // Generate BreadcrumbList JSON-LD Schema`
  );

  content = content.replace(
    /\{(job\.schema_settings\?\.enable_syllabus_schema \?\? true) && syllabusLd && <script type="application\/ld\+json" dangerouslySetInnerHTML=\{\{ __html: JSON\.stringify\(syllabusLd\) \}\} \/>\}/,
    `{(job.schema_settings?.enable_syllabus_schema ?? true) && syllabusLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(syllabusLd) }} />}\n      {videoLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoLd) }} />}`
  );

  // Embed the YouTube video in the page
  const embedCode = `
            {/* Section: YouTube Video Explainer */}
            {job.youtube_url && (
              <section className="bg-white md:rounded-2xl border-y md:border border-gray-200 p-5 md:p-6 shadow-sm overflow-hidden">
                <h2 className="text-base font-black text-[#0B1B3D] mb-5 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600"><path d="M2.25 8.90446C2.25 7.15939 3.66442 5.74497 5.40949 5.74497H18.5905C20.3356 5.74497 21.75 7.15939 21.75 8.90446V15.0955C21.75 16.8406 20.3356 18.255 18.5905 18.255H5.40949C3.66442 18.255 2.25 16.8406 2.25 15.0955V8.90446Z"></path><path d="M9.75 15.0515L15.3015 12L9.75 8.94853V15.0515Z" fill="currentColor"></path></svg>
                  Official Notification Explainer
                </h2>
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200">
                  <iframe 
                    className="absolute top-0 left-0 w-full h-full"
                    src={\`https://www.youtube.com/embed/\${job.youtube_url.match(/(?:youtube\\\\.com\\\\/(?:[^/]+\\\\/.+\\\\/|(?:v|e(?:mbed)?)\\\\/|.*[?&]v=)|youtu\\\\.be\\\\/)([^"&?\\\\\\/\\\\s]{11})/)?.[1]}\`} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen>
                  </iframe>
                </div>
              </section>
            )}
`;
  
  content = content.replace(
    /\{\/\* Section 4: Timelines \*\/\}/,
    `${embedCode}\n\n            {/* Section 4: Timelines */}`
  );

  await fs.writeFile(file, content, 'utf-8');
}
main();
