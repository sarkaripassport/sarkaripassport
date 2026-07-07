const fs = require('fs/promises');
const path = require('path');

async function main() {
  const file = path.join(process.cwd(), 'src', 'app', '[lang]', 'jobs', '[slug]', 'page.tsx');
  let content = await fs.readFile(file, 'utf-8');

  // Wrap the schema JSON-LD scripts in checks for schema_settings
  content = content.replace(
    /<script type="application\/ld\+json" dangerouslySetInnerHTML=\{\{ __html: JSON\.stringify\(jobPostingLd\) \}\} \/>/,
    `{(job.schema_settings?.enable_job_schema ?? true) && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingLd) }} />}`
  );

  content = content.replace(
    /\{faqLd && <script type="application\/ld\+json" dangerouslySetInnerHTML=\{\{ __html: JSON\.stringify\(faqLd\) \}\} \/>\}/,
    `{(job.schema_settings?.enable_faq_schema ?? true) && faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}`
  );

  content = content.replace(
    /\{syllabusLd && <script type="application\/ld\+json" dangerouslySetInnerHTML=\{\{ __html: JSON\.stringify\(syllabusLd\) \}\} \/>\}/,
    `{(job.schema_settings?.enable_syllabus_schema ?? true) && syllabusLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(syllabusLd) }} />}`
  );

  await fs.writeFile(file, content, 'utf-8');
}
main();
