const fs = require('fs/promises');
const path = require('path');

async function fixJobDetails() {
  const filePath = path.join(process.cwd(), 'src', 'app', '[lang]', 'jobs', '[slug]', 'page.tsx');
  let content = await fs.readFile(filePath, 'utf-8');
  
  // 1. Update component signature
  content = content.replace(/export default async function JobDetailPage\(\{ params \}: \{ params: Promise<\{ slug: string \}> \}\) \{/g, `import { getDictionary, Locale } from '@/i18n/getDictionary';\n\nexport default async function JobDetailPage({ params }: { params: { lang: Locale, slug: string } }) {`);
  content = content.replace(/const \{ slug \} = await params;/g, 'const { lang, slug } = params;\n  const dict = await getDictionary(lang);');
  
  // 2. Fix JSON LD
  content = content.replace(/'title': job.title,/g, "'title': job.title[lang],");
  content = content.replace(/'description': job.job_summary,/g, "'description': job.job_summary?.[lang],");
  content = content.replace(/'name': job.organization,/g, "'name': job.organization[lang],");
  content = content.replace(/'validThrough': job.quick_facts\?\.last_date,/g, "'validThrough': job.quick_facts?.last_date?.[lang],");
  
  // 3. Fix Breadcrumb
  content = content.replace(/>Home</g, '>{dict.navigation.home}<');
  content = content.replace(/>Latest Jobs</g, '>{dict.navigation.latestJobs}<');
  content = content.replace(/\{job.title\}/g, '{job.title[lang]}');
  
  // 4. Fix Hero
  content = content.replace(/\{job.organization\}/g, '{job.organization[lang]}');
  content = content.replace(/Days Left</g, '{dict.home.daysLeft}<');
  
  // 5. Fix Quick facts
  content = content.replace(/At a Glance</g, 'At a Glance<');
  content = content.replace(/\{job.quick_facts.qualification\}/g, '{job.quick_facts.qualification[lang]}');
  content = content.replace(/\{job.quick_facts.job_location\}/g, '{job.quick_facts.job_location[lang]}');
  
  // 6. Fix Summary
  content = content.replace(/\{job.job_summary\}/g, '{job.job_summary[lang]}');
  
  // 7. Fix Important Dates
  content = content.replace(/\{date.label\}/g, '{date.label[lang]}');
  content = content.replace(/\{date.date\}/g, '{date.date[lang]}');
  
  // 8. Fix Vacancies
  content = content.replace(/\{vac.post_name\}/g, '{vac.post_name[lang]}');
  content = content.replace(/\{vac.education\}/g, '{vac.education[lang]}');
  
  // 9. Fix Selection Process
  content = content.replace(/\{step.title\}/g, '{step.title[lang]}');
  content = content.replace(/\{step.description\}/g, '{step.description[lang]}');
  
  // 10. Fix How to apply
  content = content.replace(/\{step.instruction\}/g, '{step.instruction[lang]}');
  
  // 11. Fix FAQs
  content = content.replace(/\{faq.question\}/g, '{faq.question[lang]}');
  content = content.replace(/\{faq.answer\}/g, '{faq.answer[lang]}');
  
  // 12. Fix Right Sidebar
  content = content.replace(/\{job.quick_facts\?\.last_date\}/g, '{job.quick_facts?.last_date[lang]}');
  content = content.replace(/\{fee.category\}/g, '{fee.category[lang]}');
  content = content.replace(/\{link.label\}/g, '{link.label[lang]}');
  
  // Also add dictionary to other elements if desired.
  
  await fs.writeFile(filePath, content, 'utf-8');
  console.log("Updated Job Detail page");
}

fixJobDetails();
