const fs = require('fs/promises');
const path = require('path');

async function updatePages() {
  const pages = ['admit-card', 'results', 'syllabus', 'answer-key'];
  
  for (const p of pages) {
    const filePath = path.join(process.cwd(), 'src', 'app', '[lang]', p, 'page.tsx');
    let content = await fs.readFile(filePath, 'utf-8');
    
    // Fix JobsClient import
    content = content.replace(/@\/app\/jobs\/JobsClient/g, '@/app/[lang]/jobs/JobsClient');
    
    // Add getDictionary import
    if (!content.includes('getDictionary')) {
      content = content.replace('import type { Metadata } from "next";', 'import type { Metadata } from "next";\nimport { getDictionary, Locale } from "@/i18n/getDictionary";');
    }
    
    // Update generateMetadata
    content = content.replace(/export async function generateMetadata\(\): Promise<Metadata> \{/g, 'export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {');
    content = content.replace(/const pageData = settings.pages\?\.\[([^\]]+)\];/g, "const pageData = settings.pages?.['$1'];\n  const lang = params.lang || 'en';");
    content = content.replace(/title: pageData\.seo\.title,/g, 'title: pageData.seo.title[lang],');
    content = content.replace(/description: pageData\.seo\.description,/g, 'description: pageData.seo.description[lang],');
    content = content.replace(/keywords: pageData\.seo\.keywords,/g, 'keywords: pageData.seo.keywords[lang],');
    
    // Update component
    content = content.replace(/export default async function ([^\(]+)\(\) \{/g, 'export default async function $1({ params }: { params: { lang: Locale } }) {');
    content = content.replace(/const \[jobs/g, "const lang = params.lang || 'en';\n  const dict = await getDictionary(lang);\n  const [jobs");
    
    // Update hero strings
    content = content.replace(/\{pageData\.hero\.title\}/g, '{pageData.hero.title[lang]}');
    content = content.replace(/\{pageData\.hero\.subtitle\}/g, '{pageData.hero.subtitle[lang]}');
    
    // Update JobsClient prop
    content = content.replace(/<JobsClient jobs=\{([^\}]+)\} categories=\{categories\} \/>/g, '<JobsClient jobs={$1} categories={categories} lang={lang} dict={dict} />');
    
    await fs.writeFile(filePath, content, 'utf-8');
    console.log(`Updated ${p}`);
  }
}

updatePages();
